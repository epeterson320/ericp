import { createSlice, PayloadAction } from 'redux-starter-kit';
import { put, call, takeEvery } from 'redux-saga/effects';
import localforage from 'localforage';
import debug from 'debug';
import { SagaIterator } from 'redux-saga';

const log = debug('crazytown:redux');

export interface Profile {
	thumbSrc: string;
	name: string;
}
export type State = Profile | 'loading' | null;

const { reducer, actions, selectors } = createSlice({
	slice: 'profile',
	initialState: null as State,
	reducers: {
		loading() {
			return 'loading';
		},
		noProfileFound() {
			return null;
		},
		setProfile(state, { payload }: PayloadAction<Profile>) {
			return payload;
		},
	},
});

const { setProfile, loading, noProfileFound } = actions;

const STORAGE_KEY = 'player';

function* loadPlayer(): SagaIterator {
	try {
		yield put(loading());
		const player = yield call(localforage.getItem, STORAGE_KEY);
		if (player) {
			log('loaded player', player);
			yield put(setProfile(player));
		} else {
			log('no player saved');
			yield put(noProfileFound());
		}
	} catch (e) {
		log('failure loading player');
		log(e);
		yield put(noProfileFound());
	}
}

function* savePlayer(action: PayloadAction<Profile>): SagaIterator {
	try {
		yield call([localforage, localforage.setItem], STORAGE_KEY, action.payload);
	} catch (e) {
		log('Failed to save player');
		log(e);
	}
}

function* saga() {
	yield call(loadPlayer);
	yield takeEvery(actions.setProfile, savePlayer);
}

const publicActions = { setProfile };
export { reducer, publicActions as actions, selectors, saga };
