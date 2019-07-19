const Client = require('socket.io-client');
const { promisify } = require('util');
const Server = require('.');

const HOST = 'localhost';
const PORT = '3000';
const socketConfig = {
	autoConnect: false,
	transports: ['websocket'],
	forceNew: true,
	reconnection: false,
};
const url = `http://${HOST}:${PORT}`;

class TestServer extends Server {
	constructor(...args) {
		super(...args);
		this.listen = promisify(this.listen).bind(this, PORT);
		this.close = promisify(this.close);
	}
}

class TestClient extends Client {
	constructor(path = '/') {
		super(url + path, socketConfig);
		this.openCb = this.open;
		this.closeCb = this.close;
		this.open = () =>
			new Promise((res, rej) => {
				console.log('opening');
				this.once('connect', res);
				this.once('connect_error', rej);
				this.openCb();
			});
		this.close = () =>
			new Promise(res => {
				this.once('disconnect', res);
				this.closeCb();
			});
		this.next = () =>
			new Promise(resolve => {
				this.once('message', resolve);
			});
	}
}

describe('server', () => {
	test('starts and stops', async () => {
		const server = new TestServer();
		await server.listen();
		await server.close();
	});

	test('accepts connections', async () => {
		const server = new TestServer();
		const client = new TestClient();

		await server.listen();
		await client.open();
		await client.close();
		await server.close();
	});

	test('sends messages', async () => {
		const server = new TestServer();
		await server.listen();
		const client = new TestClient();
		client.connect();
		const message = await client.next();
		await client.close();
		await server.close();
	});
});

describe('/games', () => {
	test('publishes games at websocket, creates via POST', async () => {
		const server = new TestServer();
		const client1 = new TestClient('/games');
		const client2 = new TestClient('/games');

		await server.listen();

		client1.open();
		const p1Games1 = client1.next();
		await expect(p1Games1).resolves.toEqual([]);

		await client1.close();
		await client2.close();
		await server.close();

		return;

		client1.send('create', { hostPlayer: { name: 'Alice' } });
		const p1Games2 = await client1.nextMessage('games');
		expect(p1Games2).toEqual([{ hostPlayer: { name: 'Alice' } }]);

		client2.connect();
		const p2Games1 = await client2.nextMessage('games');
		expect(p2Games1).toHaveLength(1);

		client2.send('create', { hostPlayer: { name: 'Bob' } });
		const p2Games2 = await client2.nextMessage('games');
		const p1Games3 = await client1.nextMessage('games');

		expect(p2Games2).toHaveLength(2);
		expect(p1Games3).toHaveLength(2);
	});
});
