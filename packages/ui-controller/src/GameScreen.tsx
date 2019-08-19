import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { player } from '@crazytown/game-core';
import { Button } from 'reactstrap';
import { RouteComponentProps } from 'react-router';
import * as connection from './connection';

export default function GameScreen({ history }: RouteComponentProps) {
	const state = useSelector(s => s);
	const game = useSelector((s: any) => s.game as player.State);
	const conn = useSelector(connection.selectors.getConnection);

	React.useEffect(() => {
		if (conn.status === 'disconnected') history.replace('/');
	}, [conn, history]);

	const dispatch = useDispatch();

	return (
		<div>
			<h1>Game</h1>
			<p>
				Counter: <span>{game.counter}</span>
			</p>
			<Button
				className="mr-3 mb-3"
				onClick={() => dispatch(player.actions.increment())}
			>
				Increment
			</Button>
			<Button
				className="mb-3"
				onClick={() => dispatch(player.actions.decrement())}
			>
				Decrement
			</Button>
			{game.players.map(player => (
				<div className="mb-3" key={player.id}>
					<h2>{player.name}</h2>
					<img src={player.thumbSrc} alt="" />
				</div>
			))}
			<pre>{JSON.stringify(state, null, 4)}</pre>
		</div>
	);
}
