import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:3001/api/hello')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage('Error fetching API: ' + err));
  }, []);

  return (
    <div>
      <h1>React + Node Example</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
