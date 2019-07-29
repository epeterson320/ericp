const Server = require('.');
const log = require('debug')('crazytown:host-socketio');

const server = new Server();
server.listen(3000, err => {
	if (err) {
		log(err);
	} else {
		log('Server running');
	}
});
