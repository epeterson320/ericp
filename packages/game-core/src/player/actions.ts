import { createAction } from 'redux-starter-kit';

export interface Profile {
	name: string;
	thumbSrc: string;
}

export const requestJoin = createAction('REQUEST_JOIN', (payload: Profile) => ({
	payload,
	meta: { to: 'HOST' },
}));
