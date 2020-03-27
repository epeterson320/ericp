import React from 'react';

const useRemoteCounter = (): [string, () => void] => {
  const [latestMsg, setLatestMsg] = React.useState('');

  const ping = React.useMemo(() => {
    const ws = new WebSocket('ws://localhost:3000');
    ws.onerror = console.error;
    ws.onopen = () => console.log('Connected.');
    ws.onclose = () => console.log('Closed.');
    ws.onmessage = function onMessage(event) {
      console.log('got pong', event.data);
      setLatestMsg(event.data);
    };

    return function ping() {
      console.log('pinging...');
      ws.send('ping');
    };
  }, []);

  return [latestMsg, ping];
}

const App: React.FC = () => {
  const [latestMsg, ping] = useRemoteCounter();
  return (
    <div>
      <h1>Hello folks</h1>
      <p>The latest message is <code>{latestMsg}</code></p>
      <button onClick={ping}>Increment</button>
    </div>
  );
}

export default App;
