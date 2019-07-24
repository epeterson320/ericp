import React from 'react';
import debug from 'debug';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Spinner, Button, Form, Input } from 'reactstrap';
import { useSelector } from 'react-redux';
import { State, PlayerState, Player } from './redux';

const log = debug('crazytown:ui-controller:JoinGameScreen');

const JoinGameScreen = ({ history }: RouteComponentProps) => {
	const player: PlayerState = useSelector((state: State) => state.player);

	return (
		<div className="d-flex flex-column align-items-center">
			<h1>Welcome to Crazytown</h1>
			{player !== null ? (
				<>
					<PlayerThumbnail player={player} />
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
			) : (
				<PlayerNameInput />
			)}
		</div>
	);
};

function PlayerThumbnail({ player }: { player: Player | 'loading' }) {
	return (
		<div className="mb-3">
			<div
				className="d-flex border justify-content-center align-items-center"
				style={{ height: 120, width: 120 }}
			>
				{player === 'loading' ? (
					<Spinner />
				) : (
					<img className="h-100" src={player.src} />
				)}
			</div>
			{player === 'loading' ? '' : player.name}
		</div>
	);
}

const PlayerNameInput = () => {
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
				to={{
					pathname: '/draw',
					state: { name },
				}}
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
};

export default JoinGameScreen;
