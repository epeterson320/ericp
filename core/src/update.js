const Message = require("./Message");
const log = require("debug")("crazytown:core:update");

// This is a rare time where I want to use `this`.
// rxjs.scan wants a function in the form (state, action) => state,
// but I also want this function to have access to context, for side
// effects like messaging, which is not stateful. I decided to use
// `this` instead of classes or closures. Refactor if you want. YOLO.

// A regular reducer would not work because the app really
// needs an update function not like:
//   (state, action) => state
// but more like:
//   (state, action) => (state, effect[])

module.exports = function update(state, action) {
  const { type, payload, meta } = action;
  const { txAudience$ } = this;
  switch (type) {
    case "JOIN": {
      const { name } = payload;
      state.players[meta.from] = { name };
      txAudience$.next(Message({ type: "PLAYER_JOINED", body: { name } }));
      log("Player joined: $o", payload);
      return state;
    }
    default: {
      return state;
    }
  }
};
