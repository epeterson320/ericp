import Game, { GameMessage, GameAction } from './Game';

function wait(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

describe('Game', () => {
	it('Ignores unknown messages', async () => {
		const game = new Game();

		const listener = jest.fn();
		const bogusMessage: unknown = {
			type: 'uas;dlkasn;l',
			payload: {
				a1pak: 'as;lk',
			},
		};
		game.onMessage(listener);
		game.dispatch(bogusMessage as GameAction);

		await wait(10);
		expect(listener).not.toHaveBeenCalled();
	});

	it('Responds when a player joins', () => {
		expect.assertions(1);
		const game = new Game();

		game.onMessage(gameMessage => {
			expect(gameMessage).toMatchObject<GameMessage>({
				type: 'PLAYER_JOINED',
				payload: {
					id: 'jr',
					name: 'Joey',
				},
			});
		});

		game.dispatch({
			type: 'PLAYER_REQ_JOIN',
			payload: { id: 'jr', name: 'Joey' },
		});
	});
});
