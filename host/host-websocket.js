const GameHost = require("./src");
const WebSocket = require("ws");

const server = {}; // TODO create a nodejs server
new WebSocket.Server({
  server
});

const wsAdapter = {
  run() {
    // TODO
  }
};

const wsGameHost = new GameHost(wsAdapter);
wsGameHost.run();
