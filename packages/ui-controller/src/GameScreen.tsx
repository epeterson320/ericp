import React from 'react';
import { useSelector } from 'react-redux';

export default function GameScreen() {
	const state = useSelector(s => s);

	return (
		<div>
			<h1>Game</h1>
			<pre>{JSON.stringify(state, null, 4)}</pre>
		</div>
	);
}
