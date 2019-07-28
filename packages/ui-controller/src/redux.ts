import { configureStore } from 'redux-starter-kit';
import createSagaMiddleware from 'redux-saga';
import { reducer as playerReducer, saga as playerSaga } from './player';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
	reducer: {
		player: playerReducer,
	},
	middleware: [sagaMiddleware],
});

export default store;

export function run() {
	sagaMiddleware.run(playerSaga);
}
