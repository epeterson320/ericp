import { Server } from 'http';
import makeSocketServer from 'socket.io';
import uuid from 'uuid/v1';
import debug from 'debug';

const log = debug('crazytown:host-socketio');

export default class SocketGameServer extends Server {
	games = new Map<string, any>();
	io: SocketIO.Server;
	gamesIO: SocketIO.Namespace;

	constructor(...args: any[]) {
		super(...args);
		this.onConnected = this.onConnected.bind(this);
		this.onGamesIOConnection = this.onGamesIOConnection.bind(this);
		this.onCreateGameMsg = this.onCreateGameMsg.bind(this);

		this.io = makeSocketServer(this);
		this.io.on('connection', this.onConnected);
		this.gamesIO = this.io.of('/games');
		this.gamesIO.on('connection', this.onGamesIOConnection);
	}

	onConnected(socket: SocketIO.Socket) {
		log('A user connected');
		socket.on('disconnect', function() {
			log('User disconnected');
		});
	}

	onGamesIOConnection(socket: SocketIO.Socket) {
		log('A user connected to /games');
		socket.send(Array.from(this.games.values()));
		socket.on('create', this.onCreateGameMsg);
	}

	onCreateGameMsg(msg: any) {
		const { hostPlayer } = msg;
		log('Creating game for %s', hostPlayer.name);
		const game = { id: uuid(), hostPlayer };
		this.games.set(game.id, game);
		this.gamesIO.emit('message', Array.from(this.games.values()));
	}
}
