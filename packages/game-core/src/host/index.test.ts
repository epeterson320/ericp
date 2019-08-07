import SagaTester from 'redux-saga-tester';
import { reducer, saga, initialState } from '.';
import { playersUpdated } from './actions';
import { requestJoin } from '../player/actions';

describe('saga', () => {
	it('adds players', async () => {
		const sagaTester = new SagaTester({
			reducers: reducer,
			initialState,
		});
		sagaTester.start(saga);

		// When a player joins
		const joinAction = requestJoin({ name: 'Joey', thumbSrc: 'some data' });
		sagaTester.dispatch(joinAction);

		// The host should send the new list
		const outgoingAction = await sagaTester.waitFor(playersUpdated.type);
		expect(outgoingAction).toEqual(
			playersUpdated([
				{
					id: expect.any(String),
					name: 'Joey',
					thumbSrc: 'some data',
				},
			]),
		);
	});
});
