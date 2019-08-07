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
import * as actions from './actions';
import { requestJoin } from '../player/actions';

const addPlayer = createAction<Player>('ADD_PLAYER');

interface State {
	players: Players;
}

const initialState: State = {
	players: [],
};

const reducer: Reducer<State> = createReducer(initialState, {
	[addPlayer.type]: (state, action: PayloadAction<Player>) => {
		state.players.push(action.payload);
	},
});

function* saga(): SagaIterator {
	yield takeEvery(requestJoin, function*({ payload }) {
		yield put(addPlayer({ ...payload, id: uuid() }));
		const { players } = yield select();
		yield put(playersUpdated(players));
	});
}

export { reducer, saga, initialState, actions };
