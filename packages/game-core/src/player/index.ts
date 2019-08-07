import { createReducer } from 'redux-starter-kit';
import { Players, playersUpdated } from '../host/actions';
import { SagaIterator } from 'redux-saga';
import * as actions from './actions';

interface State {
	players: Players;
}

const initialState: State = { players: [] };

const reducer = createReducer(initialState, {
	[playersUpdated.type](state, action: ReturnType<typeof playersUpdated>) {
		state.players = action.payload;
	},
});

function* saga(): SagaIterator {}

export { reducer, actions, saga };
