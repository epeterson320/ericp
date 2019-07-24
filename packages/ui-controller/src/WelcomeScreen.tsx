import React from 'react';
import debug from 'debug';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Spinner, Button, Form, Input } from 'reactstrap';

const log = debug('crazytown:ui-controller:JoinGameScreen');

const JoinGameScreen: React.FunctionComponent<RouteComponentProps> = () => {
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

function usePlayerProfile() {
	return { player: null, loading: false };
}

function PlayerThumbnail(props: any) {
	return (
		<div className="mb-3">
			<div
				className="d-flex border justify-content-center align-items-center"
				style={{ height: 120, width: 120 }}
			>
				{props.loading ? <Spinner /> : <svg>{props.player.svg}</svg>}
			</div>
			{props.loading ? '' : props.player.name}
		</div>
	);
}

function PlayerNameInput() {
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
				to="/draw"
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

export default JoinGameScreen;
