const http = require('http');
const SocketServer = require('socket.io');
const uuid = require('uuid/v1');
const debug = require('debug');

const log = debug('crazytown:host-socketio');

module.exports = function Server() {
	const server = http.createServer();
	const games = new Map();
	const io = new SocketServer(server);
	io.on('connection', function(socket) {
		console.log('A user connected');
		socket.send('hello');
	});
	const gamesIO = io.of('/games');
	gamesIO.on('connection', function(socket) {
		console.log('A user connected to /games');
		socket.send([]);
	});
	return server;
};
