import { createSlice, PayloadAction } from 'redux-starter-kit';
import { put, call, takeEvery } from 'redux-saga/effects';
import localforage from 'localforage';
import debug from 'debug';
import { SagaIterator } from 'redux-saga';

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

const {
	reducer,
	actions: { setPlayer, setLoading, setNoPlayer },
	selectors,
} = playerSlice;
const actions = { setPlayer };

function* loadPlayer(): SagaIterator {
	try {
		yield put(setLoading());
		const player = yield call(localforage.getItem, 'player');
		if (player) {
			log('loaded player', player);
			yield put(setPlayer(player));
		} else {
			log('no player saved');
			yield put(setNoPlayer());
		}
	} catch (e) {
		log('failure loading player');
		log(e);
		yield put(setNoPlayer());
	}
}

function* savePlayer(action: PayloadAction<Player>): SagaIterator {
	try {
		yield call([localforage, localforage.setItem], 'player', action.payload);
	} catch (e) {
		log('Failed to save player');
		log(e);
	}
}

function* saga() {
	yield call(loadPlayer);
	yield takeEvery(actions.setPlayer, savePlayer);
}

export { reducer, actions, selectors, saga };
