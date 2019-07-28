import { createSlice, PayloadAction } from 'redux-starter-kit';
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
		setState(state: PlayerState, { payload }: PayloadAction<PlayerState>) {
			return payload;
		},
	},
});

const { reducer, actions, selectors } = playerSlice;

const saga = function* playerSaga() {
	try {
		put(actions.setState('loading'));
		const player = yield call(localforage.getItem, 'player');
		if (player) {
			log('loaded player', player);
			yield put(actions.setState(player));
		} else {
			log('no player saved');
			yield put(actions.setState(null));
		}
	} catch (e) {
		log('failure loading player');
		log(e);
		yield put(actions.setState(null));
	}

	yield takeEvery(actions.setState(null).type, function* savePlayer({
		payload,
	}: PayloadAction<PlayerState>) {
		if (payload === null || payload === 'loading') return;
		try {
			yield call([localforage, localforage.setItem], 'player', payload);
		} catch (e) {
			log('Failed to save player');
			log(e);
		}
	});
};

export { reducer, actions, selectors, saga };
