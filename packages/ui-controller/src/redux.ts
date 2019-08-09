import { configureStore, combineReducers } from 'redux-starter-kit';
import createSagaMiddleware, { SagaIterator } from 'redux-saga';
import { fork } from 'redux-saga/effects';
import { player } from '@crazytown/game-core';
import * as profile from './profile';
import * as connection from './connection';

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
	profile: profile.reducer,
	game: player.reducer,
	connection: connection.reducer,
});

const store = configureStore({
	reducer,
	middleware: [sagaMiddleware],
});

export default store;

export function run() {
	sagaMiddleware.run(function* rootSaga(): SagaIterator {
		yield fork(profile.saga);
		yield fork(player.saga);
		yield fork(connection.saga);
	});
}
