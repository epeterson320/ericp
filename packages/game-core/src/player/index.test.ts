import { reducer } from '.';
import * as hActions from '../host/actions';
import * as pActions from './actions';
import { AnyAction } from 'redux';

const player1 = { id: 'tr', name: 'Tommy', thumbSrc: '' };

describe('reducer', () => {
	const initialState = reducer(undefined, { type: '' });

	it('updates the players when the server sends an update', () => {
		const action = hActions.playersUpdated([player1]);
		const state = reducer(initialState, action);
		expect(state.players).toEqual([player1]);
	});

	it('updates the counter', () => {
		const pairs: [AnyAction, number][] = [
			[pActions.increment(), 1],
			[pActions.decrement(), 0],
			[pActions.decrement(), 0],
			[hActions.counterUpdated(42), 42],
		];

		pairs.reduce((state, [action, expected]) => {
			const nextState = reducer(state, action);
			expect(nextState.counter).toBe(expected);
			return nextState;
		}, initialState);
	});
});
