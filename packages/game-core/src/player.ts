import { createSlice, PayloadAction } from 'redux-starter-kit';
import { SagaIterator } from 'redux-saga';
import { takeEvery, call } from 'redux-saga/effects';
interface Player {
	id: string;
	name: string;
	thumbUrl?: string;
}

type State = Player[];
const initialState: State = [];

const slice = createSlice({
	slice: 'player',
	initialState,
	reducers: {
		playerReqJoin(state, action: PayloadAction<Player>) {
			return state.concat(action.payload);
		},
		playerLeave(state, action: PayloadAction<{ id: string }>) {
			return state.filter(({ id }) => id !== action.payload.id);
		},
	},
});

const { reducer, selectors, actions } = slice;

type PlayerReqJoinAction = ReturnType<typeof actions.playerReqJoin>;
type PlayerLeaveAction = ReturnType<typeof actions.playerLeave>;
type Action = PlayerReqJoinAction | PlayerLeaveAction;

const PLAYER_JOINED = 'PLAYER_JOINED';
const PLAYER_LEFT = 'PLAYER_JOINED';

type PlayerJoinedMessage = PayloadAction<Player, typeof PLAYER_JOINED>;
type PlayerLeftMessage = PayloadAction<{ id: string }, typeof PLAYER_LEFT>;
type Message = PlayerJoinedMessage | PlayerLeftMessage;

type SendMessage = (msg: Message) => void;

function* sendJoined(
	sendMessage: SendMessage,
	action: PlayerReqJoinAction,
): SagaIterator {
	const msg: Message = { type: 'PLAYER_JOINED', payload: action.payload };
	yield call(sendMessage, msg);
}

function* saga(sendMessage: SendMessage): SagaIterator {
	yield takeEvery(actions.playerReqJoin, sendJoined, sendMessage);
}

export { reducer, actions, selectors, saga, State, Action, Message, Player };
