import { createReducer } from 'redux-starter-kit';
import { Players } from '../host/actions';
import * as hActions from '../host/actions';
import { SagaIterator } from 'redux-saga';
import * as pActions from './actions';

interface State {
	players: Players;
	counter: number;
}

const initialState: State = { players: [], counter: 0 };

const reducer = createReducer(initialState, {
	[hActions.playersUpdated.type](state, action) {
		state.players = action.payload;
	},
	[pActions.increment.type](state) {
		state.counter++;
	},
	[pActions.decrement.type](state) {
		state.counter = Math.max(0, state.counter - 1);
	},
	[hActions.counterUpdated.type](state, action) {
		state.counter = action.payload;
	},
});

function* saga(): SagaIterator {}

export { reducer, pActions as actions, saga };
