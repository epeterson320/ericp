import React from 'react';
import debug from 'debug';
import { Spinner, Button } from 'reactstrap';

const log = debug('crazytown:ui-controller:JoinGameScreen');

export default function JoinGameScreen({ onGameJoined }) {
	const { player, loading } = usePlayerProfile();
	return (
		<div className="d-flex flex-column align-items-center">
			<h1>Welcome to Crazytown</h1>
			{player || loading ? (
				<>
					<PlayerThumbnail player={player} loading={loading} />
					<Button
						disabled={loading}
						onClick={() => {
							log('Joined game');
							const game = {}; // TODO connect to game.
							onGameJoined(game);
						}}
					>
						Start
					</Button>
				</>
			) : (
				<PlayerNameInput
					onSubmitName={() => {
						log('Submitted name');
					}}
				/>
			)}
		</div>
	);
}

function usePlayerProfile() {
	return { player: null, loading: true };
}

function PlayerThumbnail({ player, loading }) {
	if (loading) return <Spinner />;
	return 'PT';
}

function PlayerNameInput() {
	return 'PNI';
}
