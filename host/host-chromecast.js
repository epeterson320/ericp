const GameHost = require("./src");

const ccAdapter = {
  run() {
    // TODO
  }
};

const ccGameHost = new GameHost(ccAdapter);
ccGameHost.run();
