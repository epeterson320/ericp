import React from 'react';
import { useSelector } from 'react-redux';
import { host } from '@crazytown/game-core';
import { selectors } from './connection';

const Display: React.FC = () => {
	const state = useSelector(s => s);
	const game = useSelector((s: any) => s.game as host.State);
	const conn = useSelector(selectors.getConnection);

	if (conn.status === 'disconnected') {
		return <p>Connecting...</p>;
	}

	return (
		<div>
			<h1>Game</h1>
			<p>
				AI Players: <span>{game.counter}</span>
			</p>
			{game.players.map(player => (
				<div className="mb-3" key={player.id}>
					<h2>{player.name}</h2>
					<img src={player.thumbSrc} alt="" />
				</div>
			))}
			<pre>{JSON.stringify(state, null, 4)}</pre>
		</div>
	);
};

export default Display;
