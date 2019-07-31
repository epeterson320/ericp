import { combineReducers, createStore, Store, applyMiddleware } from 'redux';
import createSagaMiddleware, { SagaIterator } from 'redux-saga';
import { takeEvery, call, fork } from 'redux-saga/effects';
import { Reducer } from 'react';
import _ from 'lodash';

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

export interface GameState {
	player: PlayerState;
}

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

function* sendJoined(
	sendMessage: MessageListener,
	action: PlayerReqJoinAction,
): SagaIterator {
	const msg: GameMessage = { type: 'PLAYER_JOINED', payload: action.payload };
	yield call(sendMessage, msg);
}

function* playerSaga(sendMessage: MessageListener): SagaIterator {
	yield takeEvery('PLAYER_REQ_JOIN', sendJoined, sendMessage);
}

export type GameMessage = PlayerJoinedMessage | PlayerLeftMessage;

export interface Disposable {
	(): void;
}

export type GameAction = PlayerAction;

export const rootReducer = combineReducers<GameState, GameAction>({
	player: playerReducer,
});

const initialState: GameState = {
	player: playerInitialState,
};

interface MessageListener {
	(message: GameMessage): void;
}

function* rootSaga(sendMessage: MessageListener): SagaIterator {
	yield fork(playerSaga, sendMessage);
}
export default class Game {
	protected listeners = new Set<MessageListener>();
	protected store: Store<GameState, GameAction>;

	constructor() {
		const sagaMW = createSagaMiddleware();
		this.store = createStore(
			rootReducer,
			initialState,
			applyMiddleware(sagaMW),
		);
		const sendMessage = msg => this.listeners.forEach(cb => cb(msg));
		sagaMW.run(rootSaga, sendMessage);
	}

	onMessage(listener: MessageListener): Disposable {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	dispatch(action: GameAction): void {
		this.store.dispatch(action);
	}
}
