import { createAction } from 'redux-starter-kit';

export interface Player {
	id: string;
	name: string;
	thumbSrc: string;
}
export type Players = Array<Player>;

export const playersUpdated = createAction(
	'PLAYERS_UPDATED',
	(payload: Players) => ({
		payload,
		meta: { to: 'ALL' },
	}),
);
