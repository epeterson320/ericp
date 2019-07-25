import { reducer as playerReducer } from './player';
import { configureStore } from 'redux-starter-kit';

const store = configureStore({
	reducer: {
		player: playerReducer,
	},
});

export default store;
