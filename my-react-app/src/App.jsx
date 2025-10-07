import { useEffect, useState } from "react";
// usernames, ws for real time, input for box 
function App() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);

  // force username entrance
  useEffect(() => {
    if (connected && username) {
      const socket = new WebSocket("ws://localhost:3001");
      setWs(socket);

      socket.onopen = () => {
        // joined then the username
        socket.send(JSON.stringify({ type: "join", username }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // messages added to base
        setMessages((prev) => [...prev, data]);
      };

      return () => socket.close();
    }
  }, [connected, username]);

  const sendMessage = () => {
    if (ws && input) {
      ws.send(JSON.stringify({ type: "message", message: input }));
      setInput("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {!connected ? (
        <div>
          <input
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={() => {
              if (username.trim()) setConnected(true);
            }}
          >
            Join Chat
          </button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {username}!</h2>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              height: "300px",
              overflowY: "scroll",
              marginBottom: "10px",
            }}
          >
            {messages.map((msg, index) =>
              msg.type === "notification" ? (
                <p key={index} style={{ fontStyle: "italic", color: "gray" }}>
                  {msg.message}
                </p>
              ) : (
                <p key={index}>
                  <strong>{msg.username}:</strong> {msg.message}
                </p>
              )
            )}
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            //input for message area
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
