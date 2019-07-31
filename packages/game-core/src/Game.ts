import { combineReducers, createStore, Store, applyMiddleware } from 'redux';
import createSagaMiddleware, { SagaIterator } from 'redux-saga';
import { fork } from 'redux-saga/effects';
import {
	reducer as playerReducer,
	saga as playerSaga,
	PlayerState,
	PlayerMessage,
	PlayerAction,
} from './player';

interface GameState {
	player: PlayerState;
}

export type GameMessage = PlayerMessage;

export interface Disposable {
	(): void;
}

export type GameAction = PlayerAction;

const rootReducer = combineReducers<GameState, GameAction>({
	player: playerReducer,
});

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
		this.store = createStore(rootReducer, applyMiddleware(sagaMW));
		sagaMW.run(rootSaga, this.sendMessage.bind(this));
	}

	protected sendMessage(msg: GameMessage) {
		this.listeners.forEach(cb => cb(msg));
	}

	onMessage(listener: MessageListener): Disposable {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	dispatch(action: GameAction): void {
		this.store.dispatch(action);
	}
}
