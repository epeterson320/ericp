import { createSlice, PayloadAction, AnyAction } from 'redux-starter-kit';
import localforage from 'localforage';
import debug from 'debug';
import { ThunkDispatch } from 'redux-thunk';

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
		setLoading(_, _2) {
			return 'loading';
		},
		setNoPlayer(_, _2) {
			return null;
		},
		setPlayer(_, action: PayloadAction<Player>) {
			return action.payload;
		},
	},
});

type Dispatch = ThunkDispatch<PlayerState, null, AnyAction>;

const setPlayer = (player: Player) => (dispatch: Dispatch) => {
	dispatch(playerSlice.actions.setPlayer(player));
	localforage.setItem('player', player).catch(e => {
		log('Failed to save player');
		log(e);
	});
};

const loadPlayer = () => (dispatch: Dispatch) => {
	dispatch(playerSlice.actions.setLoading());
	localforage
		.getItem<Player>('player')
		.then(player => {
			if (player) {
				log('Loaded player %s', player.name);
				dispatch(playerSlice.actions.setPlayer(player));
			} else {
				dispatch(playerSlice.actions.setNoPlayer());
			}
		})
		.catch(err => {
			log(err);
			dispatch(playerSlice.actions.setNoPlayer());
		});
};

const { reducer, selectors } = playerSlice;
const actions = { setPlayer, loadPlayer };

export { reducer, actions, selectors };
