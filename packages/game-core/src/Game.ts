import { combineReducers, createStore, Store, applyMiddleware } from 'redux';
import createSagaMiddleware, { SagaIterator } from 'redux-saga';
import { fork } from 'redux-saga/effects';
import * as player from './player';

export type Action = player.Action; // | slice2.Action | slice3.Action;
export type Message = player.Message; // | slice2.Message | slice3.Message;

interface State {
	player: player.State;
}

const rootReducer = combineReducers<State, Action>({
	player: player.reducer,
});

interface MessageListener {
	(message: Message): void;
}

function* rootSaga(sendMessage: MessageListener): SagaIterator {
	yield fork(player.saga, sendMessage);
}

export default class Game {
	protected listeners = new Set<MessageListener>();
	protected store: Store<State, Action>;

	constructor() {
		const sagaMW = createSagaMiddleware();
		this.store = createStore(rootReducer, applyMiddleware(sagaMW));
		sagaMW.run(rootSaga, this.sendMessage.bind(this));
	}

	protected sendMessage(msg: Message) {
		this.listeners.forEach(cb => cb(msg));
	}

	onMessage(listener: MessageListener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	dispatch(action: Action): void {
		this.store.dispatch(action);
	}
}
