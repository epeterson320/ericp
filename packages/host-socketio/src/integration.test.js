const Client = require('socket.io-client');
const { promisify } = require('util');
const log = require('debug')('crazytown:test');
const Server = require('.');

const socketConfig = {
	autoConnect: false,
	transports: ['websocket'],
	forceNew: true,
	reconnection: false,
};

class TestServer extends Server {
	constructor(...args) {
		super(...args);
		this.listen = promisify(this.listen);
		this.close = promisify(this.close);
		this.on('listening', () => {
			const { address, port } = this.address();
			this.url = `http://[${address}]:${port}`;
			log('listening on %s', this.url);
		});
	}
}

class TestClient extends Client {
	constructor(url) {
		super(url, socketConfig);
		this.openCb = this.open;
		this.closeCb = this.close;
		this.open = () =>
			new Promise((res, rej) => {
				this.once('connect', res);
				this.once('connect_error', rej);
				this.openCb();
			});
		this.close = () =>
			new Promise(res => {
				this.once('disconnect', res);
				this.closeCb();
			});
		this.next = (eventName = 'message') =>
			new Promise(resolve => {
				this.once(eventName, resolve);
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
		client2.connect();
		await expect(p2Games1).resolves.toHaveLength(1);

		const p2Games2 = client2.next();
		const p1Games3 = client1.next();
		client2.send('create', { hostPlayer: { name: 'Bob' } });

		expect(p2Games2).resolves.toHaveLength(2);
		expect(p1Games3).resolves.toHaveLength(2);
		await client1.close();
		await client2.close();
		await server.close();
	});
});
