import { configureStore, Store } from 'redux-starter-kit';
import createSagaMiddleware, { SagaIterator } from 'redux-saga';
import { fork } from 'redux-saga/effects';
import * as player from './player';

export type Action = player.Action; // | slice2.Action | slice3.Action;
export type Message = player.Message; // | slice2.Message | slice3.Message;

export interface State {
	player: player.State;
}

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
		this.store = configureStore({
			reducer: { player: player.reducer },
			middleware: [sagaMW],
		});
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
