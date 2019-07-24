import {
	configureStore,
	createSlice,
	PayloadAction,
	EnhancedStore,
	AnyAction,
} from 'redux-starter-kit';

export type PlayerState = Player | 'loading' | null;

export interface Player {
	name: string;
	src: string;
}

const playerSlice = createSlice({
	slice: 'player',
	initialState: null as PlayerState,
	reducers: {
		setLoading(state, action: PayloadAction<boolean>): PlayerState {
			return action.payload ? 'loading' : null;
		},
		setPlayer(state, { payload }: { payload: Player }): PlayerState {
			return payload;
		},
	},
});

export interface State {
	player: PlayerState;
}

export const store: EnhancedStore<State, AnyAction> = configureStore({
	reducer: {
		player: playerSlice.reducer,
	},
});

export const { setLoading, setPlayer } = playerSlice.actions;

export function run() {
	store.dispatch(playerSlice.actions.setLoading(true));
	// load player
	store.dispatch(playerSlice.actions.setLoading(false));
}
