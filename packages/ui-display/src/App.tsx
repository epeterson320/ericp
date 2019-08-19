import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import useStore from './redux';
import Display from './Display';

const App: React.FC = () => {
	const store = useStore();
	return (
		<ReduxProvider store={store}>
			<Display />
		</ReduxProvider>
	);
};

export default App;
