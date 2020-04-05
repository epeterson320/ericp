const http = require('http');
const path = require("path");
const Bundler = require('parcel-bundler');

const displayEntry =  path.join(__dirname, '../display/index.html');
const displayBundler = new Bundler(displayEntry, { watch: true });
displayBundler.serve(3001);

const hostEntry =  path.join(__dirname, './wsHost.js');
const hostBundler = new Bundler(hostEntry, { target: 'node', watch: true });

let wss = null;
const server = http.createServer();
server.on('upgrade', function upgrade(request, socket, head) {
  if (!wss) return;
  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit('connection', ws, request);
  });
});
server.listen(3000);

hostBundler.on('buildEnd', () => {
  delete require.cache[require.resolve('../dist/wsHost')];
  wss = require('../dist/wsHost');
});

hostBundler.bundle();
