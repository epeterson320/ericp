const http = require('http');
const socketIO = require('socket.io');
const uuid = require('uuid/v1');
const debug = require('debug');

const log = debug('crazytown:host-socketio');

module.exports = function Server() {
	const server = http.createServer();
	const games = new Map();
	const io = socketIO(server);
	io.on('connection', function(socket) {
		log('A user connected');
		socket.on('disconnect', function() {
			log('User disconnected');
		});
	});

	const gamesIO = io.of('/games');
	gamesIO.on('connection', function(socket) {
		log('A user connected to /games');

		socket.send(Array.from(games.values()));

		socket.on('create', function(msg) {
			const { hostPlayer } = msg;
			log('Creating game for %s', hostPlayer.name);
			const game = { id: uuid(), hostPlayer };
			games.set(game.id, game);
			gamesIO.emit('message', Array.from(games.values()));
		});
	});

	return server;
};
