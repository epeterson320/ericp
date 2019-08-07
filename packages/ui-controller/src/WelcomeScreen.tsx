import React from 'react';
import debug from 'debug';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Spinner, Button, Input, FormGroup } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { selectors, Profile } from './profile';
import * as connection from './connection';
import { player } from '@crazytown/game-core';

const log = debug('crazytown:ui-controller:JoinGameScreen');

export default function WelcomeScreen({ history }: RouteComponentProps) {
	const profile = useSelector(selectors.getProfile);
	const { status } = useSelector(connection.selectors.getConnection);
	React.useEffect(() => {
		if (status === 'connected') {
			history.push('/play');
		}
	}, [status, history]);

	return (
		<div className="d-flex flex-column align-items-center">
			<h1>Welcome to Crazytown</h1>
			{profile !== null ? (
				<StartGameControl profile={profile} status={status} />
			) : (
				<PlayerNameInput />
			)}
		</div>
	);
}

function StartGameControl({
	profile,
	status,
}: {
	profile: Profile | 'loading';
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
					{profile === 'loading' ? (
						<Spinner />
					) : (
						<img
							className="h-100"
							alt={`${profile.name}'s Face`}
							src={profile.thumbSrc}
						/>
					)}
				</div>
				{profile === 'loading' ? '' : profile.name}
			</div>
			<Button
				disabled={profile === 'loading' || status === 'connecting'}
				onClick={() => {
					if (profile === 'loading') return;
					log('Joined game');
					dispatch(player.actions.requestJoin(profile));
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
