import { Reducer } from 'redux';
import { SagaIterator } from 'redux-saga';
import { takeEvery, call } from 'redux-saga/effects';
export interface Player {
	id: string;
	name: string;
	thumbUrl?: string;
}

export type State = Player[];

const PLAYER_REQ_JOIN = 'PLAYER_REQ_JOIN';
const PLAYER_LEAVE = 'PLAYER_LEAVE';

interface PlayerReqJoinAction {
	type: typeof PLAYER_REQ_JOIN;
	payload: Player;
}

interface PlayerLeaveAction {
	type: typeof PLAYER_LEAVE;
	payload: { id: string };
}

export type Action = PlayerReqJoinAction | PlayerLeaveAction;

function playerReqJoin(player: Player): Action {
	return {
		type: PLAYER_REQ_JOIN,
		payload: player,
	};
}

function playerLeave(id: string): Action {
	return {
		type: PLAYER_LEAVE,
		payload: { id },
	};
}
export const actions = { playerReqJoin, playerLeave };

const playerInitialState: State = [];

export const reducer: Reducer<State, Action> = (
	state = playerInitialState,
	action,
) => {
	switch (action.type) {
		case PLAYER_REQ_JOIN:
			return state.concat(action.payload);
		case PLAYER_LEAVE:
			return state.filter(({ id }) => id !== action.payload.id);
		default:
			return state;
	}
};

export const PLAYER_JOINED = 'PLAYER_JOINED';
export const PLAYER_LEFT = 'PLAYER_JOINED';

interface PlayerJoinedMessage {
	type: typeof PLAYER_JOINED;
	payload: Player;
}

interface PlayerLeftMessage {
	type: typeof PLAYER_LEFT;
	payload: { id: string };
}

export type Message = PlayerJoinedMessage | PlayerLeftMessage;

type SendMessage = (msg: Message) => void;

function* sendJoined(
	sendMessage: SendMessage,
	action: PlayerReqJoinAction,
): SagaIterator {
	const msg: Message = { type: 'PLAYER_JOINED', payload: action.payload };
	yield call(sendMessage, msg);
}

export function* saga(sendMessage: SendMessage): SagaIterator {
	yield takeEvery('PLAYER_REQ_JOIN', sendJoined, sendMessage);
}
