import { combineReducers, createStore, Store, applyMiddleware } from 'redux';
import createSagaMiddleware, { Channel, END, SagaIterator } from 'redux-saga';
import { takeEvery, put } from 'redux-saga/effects';
import { Reducer } from 'react';

export interface Player {
	id: string;
	name: string;
	thumbUrl?: string;
}

export type PlayerState = Player[];

export const PLAYER_REQ_JOIN = 'PLAYER_REQ_JOIN';
export const PLAYER_LEAVE = 'PLAYER_LEAVE';

interface PlayerReqJoinAction {
	type: typeof PLAYER_REQ_JOIN;
	payload: Player;
}

interface PlayerLeaveAction {
	type: typeof PLAYER_LEAVE;
	payload: { id: string };
}

export type PlayerAction = PlayerReqJoinAction | PlayerLeaveAction;

export function playerReqJoin(player: Player): PlayerAction {
	return {
		type: PLAYER_REQ_JOIN,
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
		case PLAYER_LEAVE:
			return state.filter(({ id }) => id !== action.payload.id);
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

export const PLAYER_JOINED = 'PLAYER_JOINED';
export const PLAYER_LEFT = 'PLAYER_JOINED';

interface PlayerJoinedMessage {
	type: typeof PLAYER_JOINED;
	payload: Player;
}

interface PlayerLeftMessage {
	type: typeof PLAYER_LEFT;
	payload: { id: string };
}

export type Message = PlayerJoinedMessage | PlayerLeftMessage;

export interface Disposable {
	(): void;
}

const initialState: AppState = {
	player: playerInitialState,
};

interface MessageListener {
	(message: Message): void;
}

function* sendJoined(
	msgChannel: Channel<Message>,
	action: PlayerReqJoinAction,
): SagaIterator {
	const msg: Message = { type: 'PLAYER_JOINED', payload: action.payload };
	yield put(msgChannel, msg);
}

function* messageSaga(msgChannel: Channel<Message>): SagaIterator {
	yield takeEvery('PLAYER_REQ_JOIN', sendJoined, msgChannel);
}

export default class Game {
	protected listeners: Set<MessageListener> = new Set();
	protected store: Store<AppState, AppAction>;

	constructor() {
		const sagaMW = createSagaMiddleware();
		this.store = createStore(
			rootReducer,
			initialState,
			applyMiddleware(sagaMW),
		);
		const listeners = this.listeners;
		const msgChannel: Channel<Message> = {
			put(message) {
				if (message.type === END.type) {
					return;
				}
				listeners.forEach(cb => cb(message));
			},
			take() {},
			close() {},
			flush() {},
		};
		sagaMW.run(messageSaga, msgChannel);
	}

	onMessage(listener: (message: Message) => void): Disposable {
		this.listeners.add(listener);
		return this.listeners.delete.bind(this.listeners, listener);
	}

	dispatch(action: AppAction): void {
		this.store.dispatch(action);
	}
}
