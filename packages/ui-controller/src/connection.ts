import { createSlice, PayloadAction, AnyAction } from 'redux-starter-kit';
import { SagaIterator, eventChannel, END } from 'redux-saga';
import { take, put, call, all } from 'redux-saga/effects';
import io from 'socket.io-client';
import debug from 'debug';

const log = debug('crazytown:connection');
const url = process.env.REACT_APP_HOST_SOCKETIO || 'http://localhost:3000';

export type Status = 'disconnected' | 'connecting' | 'connected';
export interface State {
	status: Status;
	error: any;
}

const slice = createSlice({
	slice: 'connection',
	initialState: { status: 'disconnected' } as State,
	reducers: {
		connect(state, action) {
			state.status = 'connecting';
			state.error = null;
		},
		connected(state) {
			state.status = 'connected';
			state.error = null;
		},
		disconnected(state) {
			state.status = 'disconnected';
		},
		error(state, { payload }: PayloadAction<string>) {
			state.error = payload;
		},
	},
});

const { actions, selectors, reducer } = slice;

const isToHost = (a: AnyAction) => a.meta && a.meta.to === 'HOST';

function* saga(): SagaIterator {
	while (true) {
		const socket = io(url, { autoConnect: false });
		try {
			// Connect on first remote message sent
			const firstRemoteAction = yield take(isToHost);
			yield put(actions.connect());
			yield call(openSocket, socket);
			yield put(actions.connected());
			yield call([socket, socket.send], firstRemoteAction);
			// Send and receive until one of those tasks finishes or errors
			yield all([call(receiveFromSocket, socket), call(sendToSocket, socket)]);
		} catch (e) {
			yield put(actions.error(e));
			log(e);
		} finally {
			yield call([socket, socket.close]);
			yield put(actions.disconnected());
		}
	}
}

function openSocket(socket: SocketIOClient.Socket): Promise<void> {
	return new Promise((resolve, reject) => {
		socket.on('connect', resolve);
		socket.on('connect_error', reject);
		socket.on('connect_timeout', reject);
		socket.open();
	});
}

function* receiveFromSocket(socket: SocketIOClient.Socket): SagaIterator {
	const channel = eventChannel(emitter => {
		socket.on('message', (m: any) => emitter(m));
		socket.on('error', (e: any) => emitter(new Error(e)));
		socket.on('disconnect', () => emitter(END));
		return () => socket.close();
	});

	while (true) {
		const incomingAction = yield take(channel);
		yield put(incomingAction);
	}
}

function* sendToSocket(socket: SocketIOClient.Socket): SagaIterator {
	while (true) {
		const outgoingAction = yield take(isToHost);
		yield call([socket, socket.send], outgoingAction);
	}
}

export { selectors, reducer, saga };
