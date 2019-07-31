import Game from '.';
import { actions } from './player';

describe('Game', () => {
	const player1 = { id: 'jr', name: 'Joey' };
	const player2 = { id: 'tr', name: 'Tommy' };

	it('Responds when a player joins', () => {
		const game = new Game();

		const cb = jest.fn();
		game.onMessage(cb);
		game.dispatch(actions.playerReqJoin(player1));

		expect(cb).toHaveBeenCalledWith({
			type: 'PLAYER_JOINED',
			payload: player1,
		});
	});

	it('stops sending messages when a listener unsubscribes', () => {
		const game = new Game();
		const cb = jest.fn();
		const unsub = game.onMessage(cb);
		game.dispatch(actions.playerReqJoin(player1));
		unsub();
		game.dispatch(actions.playerReqJoin(player2));
		expect(cb).toHaveBeenCalledTimes(1);
	});
});
