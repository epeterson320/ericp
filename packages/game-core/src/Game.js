const { Subject } = require('rxjs');
const { scan, map, tap } = require('rxjs/operators');
const update = require('./update');
const log = require('debug')('crazytown:core:Game');

const initialState = {
	players: {},
};

function LogSubject(namespace) {
	return new Subject().pipe(tap(log.extend(namespace)));
}

module.exports = class Game {
	constructor() {
		// Create interface subjects. These are meant to be used by
		// the creator app of the game. 'rx' is received by the game,
		// and 'tx' is sent by the game.
		this.rxPlayer$ = new LogSubject('rxMessage');
		this.txPlayer$ = new LogSubject('txPlayer');
		this.txAudience$ = new LogSubject('txAudience');
		this.txAllPlayer$ = new LogSubject('txAllPlayer');

		// Create internal subjects
		this.action$ = new LogSubject('action');
		this.state$ = this.action$.pipe(
			scan(update.bind(this), initialState),
			tap(log.extend('state')),
		);

		// Convert received messages to actions and forward
		// to the action subject.
		const rxAction$ = this.rxPlayer$.pipe(
			map(function messageToAction({ from, type, body }) {
				return {
					type,
					payload: body,
					meta: {
						from,
					},
				};
			}),
		);
		rxAction$.subscribe(this.action$);

		// Start observing
		this.state$.subscribe();
		log('Game created');
	}
};
