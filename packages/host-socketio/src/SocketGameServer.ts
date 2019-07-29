import { Server } from 'http';
import socketIO from 'socket.io';
import uuid from 'uuid/v1';
import debug from 'debug';

const log = debug('crazytown:host-socketio');

export default class SocketGameServer extends Server {
	games = new Map<string, any>();
	io: any;
	gamesIO: any;

	constructor(...args) {
		super(...args);
		this.onConnected = this.onConnected.bind(this);
		this.onGamesIOConnection = this.onGamesIOConnection.bind(this);
		this.onCreateGameMsg = this.onCreateGameMsg.bind(this);

		this.io = socketIO(this);
		this.io.on('connection', this.onConnected);
		this.gamesIO = this.io.of('/games');
		this.gamesIO.on('connection', this.onGamesIOConnection);
	}

	onConnected(socket) {
		log('A user connected');
		socket.on('disconnect', function() {
			log('User disconnected');
		});
	}

	onGamesIOConnection(socket) {
		log('A user connected to /games');
		socket.send(Array.from(this.games.values()));
		socket.on('create', this.onCreateGameMsg);
	}

	onCreateGameMsg(msg) {
		const { hostPlayer } = msg;
		log('Creating game for %s', hostPlayer.name);
		const game = { id: uuid(), hostPlayer };
		this.games.set(game.id, game);
		this.gamesIO.emit('message', Array.from(this.games.values()));
	}
}
