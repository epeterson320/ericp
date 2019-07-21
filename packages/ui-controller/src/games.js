export function useGameListing() {
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
