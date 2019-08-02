import { Server } from 'http';
import io from 'socket.io';
import debug from 'debug';
import Game from '@crazytown/game-core';

const log = debug('crazytown:host-socketio');

export default class SocketGameServer extends Server {
	constructor(...args: any[]) {
		super(...args);

		const rootIo = io(this);
		rootIo.on('connection', socket => {
			log('User %s connected', socket.id);
			socket.on('disconnect', () => {
				log('User %s disconnected', socket.id);
			});
		});

		const gameIO = rootIo.of('/game');
		const game = new Game();
		gameIO.on('connection', socket => {
			socket.on('action', action => game.dispatch(action));
		});
		game.onMessage(msg => {
			gameIO.emit('message', msg);
		});
	}
}
