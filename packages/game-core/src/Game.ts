import { combineReducers, createStore, Store, applyMiddleware } from 'redux';
import { Reducer } from 'react';

export interface Player {
	name: string;
}
export type PlayerState = Player[];

export const PLAYER_REQ_JOIN = 'PLAYER_REQ_JOIN';
export const PLAYER_JOINED = 'PLAYER_JOINED';

interface PlayerReqJoinAction {
	type: typeof PLAYER_REQ_JOIN;
	payload: Player;
}

interface PlayerJoinedAction {
	type: typeof PLAYER_JOINED;
	payload: Player;
}

export type PlayerAction = PlayerReqJoinAction | PlayerJoinedAction;

export function playerReqJoin(player: Player): PlayerAction {
	return {
		type: PLAYER_REQ_JOIN,
		payload: player,
	};
}

export function playerJoined(player: Player): PlayerAction {
	return {
		type: PLAYER_JOINED,
		payload: player,
	};
}

const playerInitialState: PlayerState = [];
export const playerReducer: Reducer<PlayerState, PlayerAction> = (
	state = playerInitialState,
	action,
) => {
	switch (action.type) {
		case PLAYER_REQ_JOIN:
			return state.concat(action.payload);
		default:
			return state;
	}
};

export interface AppState {
	player: PlayerState;
}

export type AppAction = PlayerAction;

export const rootReducer = combineReducers<AppState, AppAction>({
	player: playerReducer,
});

export interface Message {
	type: string;
	payload: any;
}

export interface Disposable {
	(): void;
}

const initialState: AppState = {
	player: playerInitialState,
};

export default class Game {
	listeners: Set<(message: Message) => void> = new Set();
	store: Store<AppState, AppAction>;

	constructor() {
		this.store = createStore(rootReducer, initialState, applyMiddleware());
		// create store
		// run sagas
	}

	_sendToListeners(message: Message): void {
		this.listeners.forEach(cb => cb(message));
	}

	onMessage(listener: (message: Message) => void): Disposable {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	dispatch(action: AppAction): void {
		if (action.type === 'PLAYER_REQ_JOIN') {
			this._sendToListeners({
				type: 'PLAYER_JOINED',
				payload: action.payload,
			});
		}
	}
}
