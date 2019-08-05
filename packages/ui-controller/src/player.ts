import { createSlice, getType, PayloadAction } from 'redux-starter-kit';
import { put, call, takeEvery } from 'redux-saga/effects';
import localforage from 'localforage';
import debug from 'debug';

const log = debug('crazytown:redux');

export interface Player {
	name: string;
	src: string;
}

export type PlayerState = Player | 'loading' | null;

const playerSlice = createSlice({
	slice: 'player',
	initialState: null as PlayerState,
	reducers: {
		setLoading() {
			return 'loading';
		},
		setNoPlayer() {
			return null;
		},
		setPlayer(state, { payload }: PayloadAction<Player>) {
			return payload;
		},
	},
});

const { reducer, actions, selectors } = playerSlice;

const saga = function* playerSaga() {
	yield call(loadPlayerSaga);
	yield takeEvery(actions.setPlayer, savePlayerSaga);
};

function* loadPlayerSaga() {
	try {
		put(actions.setLoading());
		const player = yield call(localforage.getItem, 'player');
		if (player) {
			log('loaded player', player);
			yield put(actions.setPlayer(player));
		} else {
			log('no player saved');
			yield put(actions.setNoPlayer());
		}
	} catch (e) {
		log('failure loading player');
		log(e);
		yield put(actions.setNoPlayer());
	}
}

function* savePlayerSaga({ payload }: PayloadAction<Player>) {
	try {
		yield call([localforage, localforage.setItem], 'player', payload);
	} catch (e) {
		log('Failed to save player');
		log(e);
	}
}

export { reducer, actions, selectors, saga };
