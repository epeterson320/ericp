const WebSocket = require("ws");

const wss = new WebSocket.Server({
  port: 3000
});

let count = 10;

wss.on("connection", function onConnection(ws) {
  ws.on("message", function onMessage(message) {
    console.log("received %s", message);
    count++;
    ws.send(`pinged ${count} times`);
  });
  ws.send(`pinged ${count} times`);
});
