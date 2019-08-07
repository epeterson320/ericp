import Client from 'socket.io-client';
import { promisify } from 'util';
import SocketGameServer from './SocketGameServer';
import { requestJoin } from '@crazytown/game-core/src/player/actions';
import { playersUpdated } from '@crazytown/game-core/src/host/actions';
import { reject } from 'q';

class TestServer extends SocketGameServer {
	closeP: () => Promise<void> = promisify(this.close);
	listenP(): Promise<string> {
		return new Promise((res, rej) => {
			this.once('listening', () => {
				const address = this.address();
				if (address === null) return reject();
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
				socket.once('connect', res);
				socket.once('connect_error', rej);
				socket.open();
			});
		},
		closeP() {
			return new Promise<void>(res => {
				socket.once('disconnect', res);
				socket.close();
			});
		},
		next(eventName = 'message') {
			return new Promise(res => {
				socket.once(eventName, res);
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

	test('accepts actions and sends messages', async () => {
		const url = await server.listenP();
		client1 = TestClient(url);
		const p1Games1 = client1.next();
		await client1.openP();

		const player = { name: 'Foo', thumbSrc: 'some-data' };
		client1.send(requestJoin(player));
		const expectedMsg = playersUpdated([
			{
				id: expect.any(String),
				...player,
			},
		]);

		await expect(p1Games1).resolves.toEqual(expectedMsg);
		await client1.closeP();
		await server.closeP();
	});
});
