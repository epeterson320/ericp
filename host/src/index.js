module.exports = class GameHost {
  constructor(adapter) {
    this.adapter = adapter;
  }

  run() {
    this.adapter.run();
  }
};
