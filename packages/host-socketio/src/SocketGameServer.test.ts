import Client from 'socket.io-client';
import { promisify } from 'util';
import SocketGameServer from './SocketGameServer';
import { actions } from '@crazytown/game-core/src/player';

class TestServer extends SocketGameServer {
	closeP: () => Promise<void> = promisify(this.close);
	listenP(): Promise<string> {
		return new Promise((res, rej) => {
			this.once('listening', () => {
				const address = this.address();
				if (typeof address === 'string') res(address);
				else res(`http://[${address.address}]:${address.port}`);
			});
			this.once('error', rej);
			this.listen();
		});
	}
}

interface TestClient extends SocketIOClient.Socket {
	openP: () => Promise<void>;
	closeP: () => Promise<void>;
	next: (eventName?: string) => Promise<any>;
}

function TestClient(url: string): TestClient {
	const socket = Client(url, {
		autoConnect: false,
		transports: ['websocket'],
		forceNew: true,
		reconnection: false,
	});
	return Object.assign(socket, {
		openP() {
			return new Promise<void>((res, rej) => {
				this.once('connect', res);
				this.once('connect_error', rej);
				this.open();
			});
		},
		closeP() {
			return new Promise<void>(res => {
				this.once('disconnect', res);
				this.close();
			});
		},
		next(eventName = 'message') {
			return new Promise(res => {
				this.once(eventName, res);
			});
		},
	});
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
		const url = await server.listenP();
		client1 = TestClient(url);
		await client1.openP();
		await client1.closeP();
		await server.closeP();
	});
});

describe('/game', () => {
	test('accepts connections', async () => {
		const url = await server.listenP();
		client1 = TestClient(url + '/game');
		await client1.openP();
		await client1.closeP();
		await server.closeP();
	});

	test('accepts actions and sends messages', async () => {
		const url = await server.listenP();
		client1 = TestClient(url + '/game');
		const p1Games1 = client1.next();
		await client1.openP();

		const player = { id: 'hey', name: 'Foo' };
		client1.emit('action', actions.playerReqJoin(player));
		const expectedMsg = {
			type: 'PLAYER_JOINED',
			payload: player,
		};

		await expect(p1Games1).resolves.toEqual(expectedMsg);
		await client1.closeP();
		await server.closeP();
	});
});

describe('/games', () => {
	test('publishes games at websocket, creates via POST', async () => {
		const url = await server.listenP();

		client1 = TestClient(url + '/games');
		client2 = TestClient(url + '/games');

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
