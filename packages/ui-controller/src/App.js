import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const WelcomeScreen = lazy(() => import('./WelcomeScreen'));
const DrawFaceScreen = lazy(() => import('./DrawFaceScreen'));

export default function App() {
	return (
		<Router>
			<Suspense fallback={<div>Loading...</div>}>
				<Switch>
					<Route path="/" exact component={WelcomeScreen} />
					<Route path="/u/:player/face" component={DrawFaceScreen} />
				</Switch>
			</Suspense>
		</Router>
	);
}
