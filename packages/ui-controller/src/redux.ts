import React from 'react';
import { configureStore, combineReducers } from 'redux-starter-kit';
import createSagaMiddleware, { SagaIterator } from 'redux-saga';
import { fork } from 'redux-saga/effects';
import { player } from '@crazytown/game-core';
import * as profile from './profile';
import * as connection from './connection';

const rootReducer = combineReducers({
	profile: profile.reducer,
	game: player.reducer,
	connection: connection.reducer,
});

function* rootSaga(): SagaIterator {
	yield fork(profile.saga);
	yield fork(player.saga);
	yield fork(connection.saga);
}

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
