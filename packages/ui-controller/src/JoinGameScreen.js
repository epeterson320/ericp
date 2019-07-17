import React from 'react';
import debug from 'debug';

const log = debug('crazytown:ui-controller:JoinGameScreen');

export default function JoinGameScreen({ onGameStarted, onGameJoined }) {
	const listing = useGameListing();
	const { loading, error, games, refetch } = listing;

	return (
		<div className="App">
			<h1>Welcome to Crazytown</h1>
			{loading ? <p>Searching for games...</p> : null}
			{error ? <pre>{error.message}</pre> : null}
			{error ? <button onClick={refetch}>Retry</button> : null}
			<button
				disabled={loading || error}
				onClick={() => {
					const game = { id: 1 };
					onGameStarted(game);
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
		</div>
	);
}

function useGameListing() {
	const [loading, setLoading] = React.useState(true);
	const [games, setGames] = React.useState([]);
	const [error, setError] = React.useState(null);
	const [refetchCounter, setRefetchCounter] = React.useState(0);

	React.useEffect(() => {
		const ws = new WebSocket(`ws://${process.env.REACT_APP_WS_HOST}/games`);
		ws.onopen = () => {
			setLoading(false);
		};
		ws.onerror = event => {
			setError(new Error('Error connecting to server.'));
			setLoading(false);
			log('Websocket Error Event: %O', event);
		};
		ws.onmessage = msg => {
			setGames(JSON.parse(msg));
		};

		return () => {
			delete ws.onopen;
			delete ws.onerror;
			delete ws.onmessage;
			ws.close(1000);
		};
	}, [refetchCounter]);

	const refetch = () => {
		setLoading(true);
		setError(null);
		setRefetchCounter(refetchCounter + 1);
	};

	return { loading, games, error, refetch };
}
