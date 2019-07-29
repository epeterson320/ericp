import debug from 'debug';
import SocketGameServer from './SocketGameServer';

const log = debug('crazytown:host-socketio');

const server = new SocketGameServer();
server.on('error', log);
server.listen(3000, () => {
	log('Server running');
});
