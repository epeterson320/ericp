import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const WelcomeScreen = lazy(() => import('./WelcomeScreen'));
const DrawFaceScreen = lazy(() => import('./DrawFaceScreen'));
const NotFound: React.FunctionComponent = () => <p>Not found</p>;

export default function App() {
	return (
		<Router>
			<Suspense fallback={<div>Loading...</div>}>
				<Switch>
					<Route path="/" exact component={WelcomeScreen} />
					<Route path="/draw" component={DrawFaceScreen} />
					{/* <Route path="/play" component={GameScreen} /> */}
					<Route component={NotFound} />
				</Switch>
			</Suspense>
		</Router>
	);
}
