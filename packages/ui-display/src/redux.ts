import React from 'react';
import { configureStore, combineReducers } from 'redux-starter-kit';
import createSagaMiddleware, { SagaIterator } from 'redux-saga';
import { fork } from 'redux-saga/effects';
import { player } from '@crazytown/game-core';
import * as connection from './connection';

function* rootSaga(): SagaIterator {
	yield fork(connection.saga);
}

const rootReducer = combineReducers({
	game: player.reducer,
	connection: connection.reducer,
});

export default function useAppStore() {
	const [sagaMiddleware] = React.useState(createSagaMiddleware);

	const [store] = React.useState(() =>
		configureStore({
			reducer: rootReducer,
			middleware: [sagaMiddleware],
		}),
	);

	React.useEffect(() => {
		sagaMiddleware.run(rootSaga);
	}, [sagaMiddleware]);

	return store;
}
