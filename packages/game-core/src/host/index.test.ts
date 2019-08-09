import SagaTester from 'redux-saga-tester';
import { reducer, saga, initialState, State } from '.';
import * as hActions from './actions';
import * as pActions from '../player/actions';

describe('saga', () => {
	let sagaTester: SagaTester<State>;

	beforeEach(() => {
		sagaTester = new SagaTester({
			reducers: reducer,
			initialState,
		});
		sagaTester.start(saga);
	});

	it('adds players', async () => {
		// When a player joins
		sagaTester.dispatch(
			pActions.requestJoin({ name: 'Joey', thumbSrc: 'some data' }),
		);

		// The host should send the new list
		const outgoingAction = await sagaTester.waitFor(
			hActions.playersUpdated.type,
		);
		expect(outgoingAction).toEqual(
			hActions.playersUpdated([
				{
					id: expect.any(String),
					name: 'Joey',
					thumbSrc: 'some data',
				},
			]),
		);
	});

	it('updates the counter', async () => {
		sagaTester.dispatch(pActions.increment());
		sagaTester.dispatch(pActions.decrement());
		sagaTester.dispatch(pActions.decrement()); // Ignored, shouldn't go below zero
		sagaTester.dispatch(pActions.increment());
		sagaTester.dispatch(pActions.increment());
		sagaTester.dispatch(pActions.decrement());
		sagaTester.dispatch(pActions.increment());
		sagaTester.dispatch(pActions.increment());

		const outgoingAction = sagaTester.waitFor(
			hActions.counterUpdated.type,
			true,
		);
		sagaTester.dispatch(pActions.increment());
		await expect(outgoingAction).resolves.toEqual(hActions.counterUpdated(4));
	});
});
