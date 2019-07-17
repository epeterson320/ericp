import React from 'react';
import './App.css';

function App() {
	return (
		<div className="App">
			<h1>Welcome to Crazytown</h1>
			<p>Searching for games...</p>
			{/* TODO: error connecting to server, start game, join game, connect to chromecast */}
			<button disabled>Enter</button>
		</div>
	);
}

export default App;
