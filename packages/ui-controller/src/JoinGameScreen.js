import React from 'react';
import noop from 'lodash/noop';

export default function JoinGameScreen({ onGameStarted, onGameJoined }) {
	const listing = useGameListing();
	const { loading, error, games, refetch } = listing;

	return (
		<div className="App">
			<h1>Welcome to Crazytown</h1>
			{loading ? <p>Searching for games...</p> : null}
			{error ? <pre>{listing.error.message}</pre> : null}
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
	const [listing, setListing] = React.useState({
		loading: true,
		games: [],
		error: null,
		refetch: noop,
	});
	React.useEffect(() => {
		const timer = setTimeout(() => {
			setListing({
				loading: false,
				games: [{ id: 5 }],
				error: null,
				refetch: noop,
			});
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	return listing;
}
