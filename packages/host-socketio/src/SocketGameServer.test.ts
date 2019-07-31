import Client from 'socket.io-client';
import { promisify } from 'util';
import debug from 'debug';
import SocketGameServer from './SocketGameServer';
import { AddressInfo } from 'net';

const log = debug('crazytown:test');

const socketConfig = {
	autoConnect: false,
	transports: ['websocket'],
	forceNew: true,
	reconnection: false,
};

class TestServer extends SocketGameServer {
	listenP = promisify(this.listen) as () => Promise<undefined>;
	closeP = promisify(this.close) as () => Promise<undefined>;
	url = '';
	constructor(...args: any[]) {
		super(...args);
		this.on('listening', () => {
			const { address, port } = this.address() as AddressInfo;
			this.url = `http://[${address}]:${port}`;
			log('listening on %s', this.url);
		});
	}
}

interface TestClient extends SocketIOClient.Socket {
	openP: () => Promise<undefined>;
	closeP: () => Promise<undefined>;
	next: (eventName?: string) => Promise<any>;
}

function TestClient(url: string): TestClient {
	const socket: TestClient = Client(url, socketConfig) as TestClient;

	socket.openP = () =>
		new Promise((res, rej) => {
			socket.once('connect', res);
			socket.once('connect_error', rej);
			socket.open();
		});
	socket.closeP = () =>
		new Promise(res => {
			socket.once('disconnect', res);
			socket.close();
		});
	socket.next = (eventName = 'message') =>
		new Promise(resolve => {
			socket.once(eventName, resolve);
		});
	return socket;
}

let server: TestServer;
let client1: TestClient;
let client2: TestClient;

beforeEach(() => {
	server = new TestServer();
});

afterEach(async () => {
	if (server.listening) await server.closeP();
	if (client1 && client1.connected) await client1.close();
	if (client2 && client2.connected) await client2.close();
});

describe('server', () => {
	test('starts and stops', async () => {
		await server.listenP();
		await server.closeP();
	});

	test('accepts connections', async () => {
		await server.listenP();
		client1 = TestClient(server.url);
		await client1.openP();
		await client1.closeP();
		await server.closeP();
	});
});

describe('/games', () => {
	test('publishes games at websocket, creates via POST', async () => {
		await server.listenP();

		client1 = TestClient(server.url + '/games');
		client2 = TestClient(server.url + '/games');

		const p1Games1 = client1.next();
		client1.openP();
		await expect(p1Games1).resolves.toEqual([]);

		const p1Games2 = client1.next();
		client1.emit('create', { hostPlayer: { name: 'Alice' } });
		await expect(p1Games2).resolves.toEqual([
			{ id: expect.any(String), hostPlayer: { name: 'Alice' } },
		]);

		const p2Games1 = client2.next();
		client2.open();
		await expect(p2Games1).resolves.toHaveLength(1);

		const p2Games2 = client2.next();
		const p1Games3 = client1.next();
		client2.emit('create', { hostPlayer: { name: 'Bob' } });

		expect(p2Games2).resolves.toHaveLength(2);
		expect(p1Games3).resolves.toHaveLength(2);
		await client1.closeP();
		await client2.closeP();
		await server.closeP();
	});
});
