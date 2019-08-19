import { createSlice, PayloadAction } from 'redux-starter-kit';
import { SagaIterator, eventChannel, END } from 'redux-saga';
import { take, put, call } from 'redux-saga/effects';
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
		connect(state) {
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

function* saga(): SagaIterator {
	while (true) {
		const socket = io(url, { autoConnect: false });
		try {
			yield put(actions.connect());
			yield call(openSocket, socket);
			yield put(actions.connected());
			yield call(receiveFromSocket, socket);
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

export { selectors, reducer, saga };
