import { reducer } from '.';
import { playersUpdated } from '../host/actions';

const player1 = { id: 'tr', name: 'Tommy', thumbUrl: '' };

describe('reducer', () => {
	it('updates the players when the server sends an update', () => {
		const action = playersUpdated([player1]);
		const state = reducer(undefined, action);
		expect(state.players).toEqual([player1]);
	});
});
