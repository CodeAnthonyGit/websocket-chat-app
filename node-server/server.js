const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.get("/api/hello", (req, res) => res.json({ message: "Hello from Node!" }));

const server = app.listen(3001, () => console.log("Server running on port 3001"));

const wss = new WebSocket.Server({ server });

// Map to store each client's username
const clients = new Map();

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    // If user just sent their username, save it
    if (data.type === "join") {
      clients.set(ws, data.username);

      // Broadcast join message
      const joinMsg = { type: "notification", message: `${data.username} joined the chat.` };
      broadcast(joinMsg);
      return;
    }

    // Normal chat message
    if (data.type === "message") {
      const username = clients.get(ws);
      const chatMsg = { type: "message", username, message: data.message };
      broadcast(chatMsg);
    }
  });

  ws.on("close", () => {
    const username = clients.get(ws);
    if (username) {
      const leaveMsg = { type: "notification", message: `${username} left the chat.` };
      broadcast(leaveMsg);
      clients.delete(ws);
    }
    console.log("Client disconnected");
  });
});

// Helper to broadcast messages to all connected clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}
