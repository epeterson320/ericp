import { createAction } from 'redux-starter-kit';

function createBroadcastAction<P = any, T extends string = string>(type: T) {
	return createAction(type, (payload: P) => ({
		payload,
		meta: { to: 'ALL' },
	}));
}

export interface Player {
	id: string;
	name: string;
	thumbSrc: string;
}
export type Players = Array<Player>;

export const playersUpdated = createBroadcastAction<Players, 'PLAYERS_UPDATED'>(
	'PLAYERS_UPDATED',
);

export const counterUpdated = createBroadcastAction<number, 'COUNTER_UPDATED'>(
	'COUNTER_UPDATED',
);
