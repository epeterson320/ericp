import { Server } from 'http';
import io from 'socket.io';
import debug from 'debug';
import { configureStore, AnyAction } from 'redux-starter-kit';
import createSagaMiddleware, { SagaIterator } from 'redux-saga';
import { takeEvery, call } from 'redux-saga/effects';
import * as host from '@crazytown/game-core/src/host';

const log = debug('crazytown:host-socketio');

export default class SocketGameServer extends Server {
	constructor(...args: any[]) {
		super(...args);

		const rootIO = io(this);
		const sagaMiddleware = createSagaMiddleware({
			onError: log,
		});
		const store = configureStore({
			reducer: host.reducer,
			middleware: [sagaMiddleware],
		});

		sagaMiddleware.run(host.saga);
		sagaMiddleware.run(function* rootSaga(): SagaIterator {
			yield takeEvery(isToAll, function* sendAction(action: any) {
				yield call([rootIO, rootIO.send], action);
			});
		});

		rootIO.on('connection', socket => {
			log('User %s connected', socket.id);
			socket.on('message', action => store.dispatch(action));
			socket.on('disconnect', () => {
				log('User %s disconnected', socket.id);
			});
		});
	}
}

function isToAll(action: AnyAction) {
	return action.meta && action.meta.to === 'ALL';
}
