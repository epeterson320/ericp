import { actions, reducer, saga } from './player';
import { runSaga, channel, Saga } from 'redux-saga';
import { fork, put, cancel, call } from 'redux-saga/effects';

const player1 = { id: 'tr', name: 'Tommy' };
describe('reducer', () => {
	it('adds players', () => {
		const state = reducer(undefined, actions.playerReqJoin(player1));
		expect(state).toEqual([player1]);
	});

	it('removes players', () => {
		const state1 = reducer(undefined, actions.playerReqJoin(player1));
		expect(state1).toEqual([player1]);
		const state2 = reducer(state1, actions.playerLeave(player1.id));
		expect(state2).toEqual([]);
	});
});

describe('saga', () => {
	it('notifies when players join', async () => {
		const sendMsg = jest.fn();

		const testSaga = function*() {
			yield put(actions.playerReqJoin(player1));
		};

		await runTestSaga(testSaga, saga, sendMsg);

		expect(sendMsg).toHaveBeenCalledWith({
			type: 'PLAYER_JOINED',
			payload: player1,
		});
	});
});

function runTestSaga(testSaga: Saga, prodSaga: Saga, ...args: any[]) {
	const testChannel = channel();
	const testSagaOpts = {
		channel: testChannel,
		dispatch: testChannel.put,
	};
	const saga = function*() {
		yield fork(prodSaga, ...args);
		yield call(testSaga, ...args);
		yield cancel();
	};
	return runSaga(testSagaOpts, saga).toPromise();
}
