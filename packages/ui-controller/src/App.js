import React from 'react';
import JoinGameScreen from './JoinGameScreen';
import GameScreen from './GameScreen';

export default function App() {
	const [game, setGame] = React.useState(null);
	if (game) return <GameScreen game={game} />;
	return <JoinGameScreen onGameJoined={setGame} />;
}
