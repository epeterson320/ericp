const { ReplaySubject } = require('rxjs');
const Game = require('./Game');
const Message = require('./Message');

describe('Game', () => {
	it('Ignores unknown messages', () => {
		const game = new Game();
		const message = Message({
			from: '123',
			to: 'HOST',
			type: 'uas;dlkasn;l',
			body: {
				a1pak: 'as;lk',
			},
		});

		function fail() {
			throw new Error('fail');
		}

		game.txPlayer$.subscribe(fail);
		game.txAllPlayer$.subscribe(fail);
		game.txAudience$.subscribe(fail);

		game.rxPlayer$.next(message);
	});

	it('Responds when a player joins', () => {
		expect.assertions(1);

		const game = new Game();

		const message = Message({
			from: 'PLAYER/ASPLK10A',
			to: 'HOST',
			type: 'JOIN',
			body: {
				name: 'Joey',
			},
		});

		const expected = Message({
			from: 'HOST',
			to: 'AUDIENCE',
			type: 'PLAYER_JOINED',
			body: {
				name: 'Joey',
			},
		});

		game.txAudience$.subscribe(gameMessage => {
			expect(gameMessage).toMatchObject(expected);
		});
		game.rxPlayer$.next(message);
	});
});
