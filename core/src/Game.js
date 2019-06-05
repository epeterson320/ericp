const { Subject } = require("rxjs");
const { scan, map, tap } = require("rxjs/operators");
const update = require("./update");
const log = require("debug")("crazytown:core:Game");

const initialState = {
  players: {}
};

module.exports = class Game {
  constructor() {
    // Create subjects
    this.txMessage$ = new Subject().pipe(tap(log.extend("txMessage")));
    this.rxMessage$ = new Subject().pipe(tap(log.extend("rxMessage")));
    this.action$ = new Subject().pipe(tap(log.extend("action")));

    // Convert received messages to actions and forward
    // to the action subject.
    const rxAction$ = this.rxMessage$.pipe(map(messageToAction));
    rxAction$.subscribe(this.action$);

    // Update the state based on actions
    const boundUpdate = update.bind(this);
    this.state$ = this.action$.pipe(
      scan(boundUpdate, initialState),
      tap(log.extend("state"))
    );
    this.state$.subscribe();
    log("Game created");
  }
};

function messageToAction({ from, type, body }) {
  return {
    type,
    payload: body,
    meta: {
      from
    }
  };
}
