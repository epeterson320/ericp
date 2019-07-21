import Socket from 'socket.io-client';

const io = Socket(process.env.REACT_APP_HOST_SOCKETIO);

export function listenToGames(cb) {
	const games = io.socket('/games');
	games.on('message', cb);
	return () => {
		games.close();
	};
}

export function createGame({ name }) {
	const games = io.socket('/games');
	games.emit('create', { gameHost: { name } });
}
