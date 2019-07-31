import { Server } from 'http';
import makeSocketServer from 'socket.io';
import uuid from 'uuid/v1';
import debug from 'debug';
import Game from '../../game-core/src/Game';

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

	protected onConnected(socket: SocketIO.Socket) {
		log('A user connected');
		socket.on('disconnect', function() {
			log('User disconnected');
		});
	}

	protected onGamesIOConnection(socket: SocketIO.Socket) {
		log('A user connected to /games');
		socket.send(Array.from(this.games.values()));
		socket.on('create', this.onCreateGameMsg);
	}

	protected onCreateGameMsg(msg: any) {
		const { hostPlayer } = msg;
		log('Creating game for %s', hostPlayer.name);
		const id = uuid();
		const game = new Game();
		this.games.set(id, { id, hostPlayer, core: game });
		const games = Array.from(this.games.values());
		games.forEach(g => delete g.core);
		this.gamesIO.emit('message', Array.from(this.games.values()));
	}
}
