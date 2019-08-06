import React from 'react';
import debug from 'debug';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Spinner, Button, Input, FormGroup } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { selectors, Player } from './player';
import * as connection from './connection';
import * as game from '@crazytown/game-core/src/player';

const log = debug('crazytown:ui-controller:JoinGameScreen');

export default function WelcomeScreen({ history }: RouteComponentProps) {
	const player = useSelector(selectors.getPlayer);
	const { status } = useSelector(connection.selectors.getConnection);
	React.useEffect(() => {
		if (status === 'connected') {
			history.push('/play');
		}
	}, [status]);

	return (
		<div className="d-flex flex-column align-items-center">
			<h1>Welcome to Crazytown</h1>
			{player !== null ? (
				<StartGameControl player={player} status={status} />
			) : (
				<PlayerNameInput />
			)}
		</div>
	);
}

function StartGameControl({
	player,
	status,
}: {
	player: Player | 'loading';
	status: connection.Status;
}) {
	const dispatch = useDispatch();
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
				disabled={player === 'loading' || status === 'connecting'}
				onClick={() => {
					if (player === 'loading') return;
					log('Joined game');
					dispatch(game.actions.playerReqJoin({ id: '4', ...player }));
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
