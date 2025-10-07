const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Allow requests from any origin (React frontend)
app.use(cors());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node!' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
