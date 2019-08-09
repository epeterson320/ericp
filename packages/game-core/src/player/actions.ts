import { createAction } from 'redux-starter-kit';

export interface Profile {
	name: string;
	thumbSrc: string;
}

function createRemoteAction<P, T extends string = string>(type: T) {
	return createAction(type, (payload: P) => ({
		payload,
		meta: { to: 'HOST' },
	}));
}

export const requestJoin = createRemoteAction<Profile, 'REQUEST_JOIN'>(
	'REQUEST_JOIN',
);

export const increment = createRemoteAction<void, 'INCREMENT'>('INCREMENT');

export const decrement = createRemoteAction<void, 'DECREMENT'>('DECREMENT');
