import { SagaIterator } from 'redux-saga';
import { takeEvery, select, put } from 'redux-saga/effects';
import {
	createReducer,
	createAction,
	Reducer,
	PayloadAction,
} from 'redux-starter-kit';
import uuid from 'uuid/v4';
import { playersUpdated, Player, Players } from './actions';
import * as hActions from './actions';
import * as pActions from '../player/actions';

const addPlayer = createAction<Player>('ADD_PLAYER');

interface State {
	players: Players;
	counter: number;
}

const initialState: State = {
	players: [],
	counter: 0,
};

const reducer: Reducer<State> = createReducer(initialState, {
	[addPlayer.type](state, action: PayloadAction<Player>) {
		state.players.push(action.payload);
	},
	[pActions.increment.type](state) {
		state.counter++;
	},
	[pActions.decrement.type](state) {
		state.counter = Math.max(state.counter - 1, 0);
	},
});

function* saga(): SagaIterator {
	yield takeEvery(pActions.requestJoin, joinSaga);
	yield takeEvery(pActions.increment, counterSaga);
	yield takeEvery(pActions.decrement, counterSaga);
}

function* joinSaga({ payload }: ReturnType<typeof pActions.requestJoin>) {
	yield put(addPlayer({ ...payload, id: uuid() }));
	const { players } = yield select();
	yield put(playersUpdated(players));
}

function* counterSaga(): SagaIterator {
	const { counter } = yield select();
	yield put(hActions.counterUpdated(counter));
}

export { reducer, saga, initialState, hActions as actions };
