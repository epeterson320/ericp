import Client from 'socket.io-client';
import { promisify } from 'util';
import { Server } from 'http';
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

class TestServer {
	nodeServer: Server = new SocketGameServer();
	listen = promisify(this.nodeServer.listen).bind(this.nodeServer);
	close = promisify(this.nodeServer.close).bind(this.nodeServer);
	url = '';
	constructor() {
		this.nodeServer.on('listening', () => {
			const { address, port } = this.nodeServer.address() as AddressInfo;
			this.url = `http://[${address}]:${port}`;
			log('listening on %s', this.url);
		});
	}
}

class TestClient {
	socket: typeof Client;
	constructor(url) {
		this.socket = new Client(url, socketConfig);
	}

	open() {
		return new Promise((res, rej) => {
			this.socket.once('connect', res);
			this.socket.once('connect_error', rej);
			this.socket.open();
		});
	}

	close() {
		new Promise(res => {
			this.socket.once('disconnect', res);
			this.socket.close();
		});
	}

	emit(...args) {
		this.socket.emit(...args);
	}

	next(eventName = 'message') {
		return new Promise(resolve => {
			this.socket.once(eventName, resolve);
		});
	}
}

let server, client1, client2;

beforeEach(() => {
	server = new TestServer();
});

afterEach(async () => {
	if (server.listening) await server.close();
	if (client1 && client1.connected) await client1.close();
	if (client2 && client2.connected) await client2.close();
	server = client1 = client2 = null;
});

describe('server', () => {
	test('starts and stops', async () => {
		await server.listen();
		await server.close();
	});

	test('accepts connections', async () => {
		await server.listen();
		client1 = new TestClient(server.url);
		await client1.open();
		await client1.close();
		await server.close();
	});
});

describe('/games', () => {
	test('publishes games at websocket, creates via POST', async () => {
		await server.listen();

		client1 = new TestClient(server.url + '/games');
		client2 = new TestClient(server.url + '/games');

		const p1Games1 = client1.next();
		client1.open();
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
		await client1.close();
		await client2.close();
		await server.close();
	});
});
