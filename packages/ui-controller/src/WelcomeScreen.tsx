import React from 'react';
import debug from 'debug';
import { Link } from 'react-router-dom';
import { Spinner, Button, Input, FormGroup } from 'reactstrap';
import { useSelector } from 'react-redux';
import { selectors, Player } from './player';

const log = debug('crazytown:ui-controller:JoinGameScreen');

const WelcomeScreen: ScreenFC = () => {
	const player = useSelector(selectors.getPlayer);

	return (
		<div className="d-flex flex-column align-items-center">
			<h1>Welcome to Crazytown</h1>
			{player !== null ? (
				<StartGameControl player={player} />
			) : (
				<PlayerNameInput />
			)}
		</div>
	);
};

function StartGameControl({ player }: { player: Player | 'loading' }) {
	return (
		<>
			<div className="mb-3">
				<div
					className="d-flex border justify-content-center align-items-center"
					style={{ height: 120, width: 120 }}
				>
					{player === 'loading' ? (
						<Spinner />
					) : (
						<img
							className="h-100"
							alt={`${player.name}'s Face`}
							src={player.src}
						/>
					)}
				</div>
				{player === 'loading' ? '' : player.name}
			</div>
			<Button
				disabled={player === 'loading'}
				onClick={() => {
					log('Joined game');
					// TODO connect to game.
				}}
			>
				Start
			</Button>
		</>
	);
}

const PlayerNameInput = () => {
	const [name, setName] = React.useState('');
	return (
		<FormGroup inline>
			<Input
				autoFocus
				type="text"
				placeholder="Your name"
				value={name}
				onChange={e => setName(e.target.value)}
				className="mb-2"
			/>
			<Button
				tag={Link}
				to={{
					pathname: '/draw',
					state: { name },
				}}
				disabled={!name}
				className="float-right"
				onClick={() => {
					log('Submitted name %s', name);
				}}
			>
				Next
			</Button>
		</FormGroup>
	);
};

export default WelcomeScreen;
