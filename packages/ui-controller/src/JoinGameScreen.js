import React from 'react';
import debug from 'debug';
import Socket from 'socket.io-client';

const log = debug('crazytown:ui-controller:JoinGameScreen');

export default function JoinGameScreen({ onGameStarted, onGameJoined }) {
	const [loading, setLoading] = React.useState(true);
	const [games, setGames] = React.useState([]);
	const gamesRef = React.useRef(
		Socket(process.env.REACT_APP_HOST_SOCKETIO + '/games'),
	);
	let error,
		refetch = null;

	React.useEffect(() => {
		const games = gamesRef.current;
		games.on('message', newGames => {
			setGames(newGames);
			setLoading(false);
		});

		return () => {
			games.close();
		};
	}, []);

	return (
		<div className="App">
			<h1>Welcome to Crazytown</h1>
			{loading ? <p>Searching for games...</p> : null}
			{error ? <pre>{error.message}</pre> : null}
			{error ? <button onClick={refetch}>Retry</button> : null}
			<button
				disabled={loading || error}
				onClick={() => {
					gamesRef.current.emit('create', { hostPlayer: { name: 'Eric' } });
					//onGameStarted(game);
				}}
			>
				Start Game
			</button>
			<button
				disabled={loading || error}
				onClick={() => {
					const game = games[0];
					onGameJoined(game);
				}}
			>
				Join Game
			</button>
			<pre>{JSON.stringify(games, null, 2)}</pre>
		</div>
	);
}
