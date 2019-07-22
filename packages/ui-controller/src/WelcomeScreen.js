import React from 'react';
import debug from 'debug';
import { Link } from 'react-router-dom';
import { Spinner, Button, Form, Input } from 'reactstrap';
import kebabCase from 'lodash/kebabCase';

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
				<PlayerNameInput />
			)}
		</div>
	);
}

function usePlayerProfile() {
	return { player: null, loading: false };
}

function PlayerThumbnail({ player, loading }) {
	return (
		<div className="mb-3">
			<div
				className="d-flex border justify-content-center align-items-center"
				style={{ height: 120, width: 120 }}
			>
				{loading ? <Spinner /> : <svg>{player.svg}</svg>}
			</div>
			{loading ? '' : player.name}
		</div>
	);
}

function PlayerNameInput({ onSubmitName }) {
	const [name, setName] = React.useState('');
	return (
		<Form>
			<Input
				type="text"
				placeholder="Your name"
				value={name}
				onChange={e => setName(e.target.value)}
				className="mb-2"
			/>
			<Button
				to={`/u/${kebabCase(name)}/face`}
				tag={Link}
				disabled={!name}
				className="float-right"
				onClick={() => {
					log('Submitted name %s', name);
				}}
			>
				Next
			</Button>
		</Form>
	);
}
