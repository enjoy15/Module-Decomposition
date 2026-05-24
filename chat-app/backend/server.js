const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

if (FRONTEND_ORIGIN) {
  app.use(cors({ origin: FRONTEND_ORIGIN }));
} else {
  app.use(cors());
}
app.use(express.json());

const messages = [
  {
    id: 1,
    name: 'System',
    text: 'Welcome to the chat!',
    createdAt: new Date().toISOString(),
  },
];

function makeSafeText(value) {
  return String(value || '').trim();
}

app.get('/api/messages', (req, res) => {
  res.json({ messages });
});

app.post('/api/messages', (req, res) => {
  const name = makeSafeText(req.body.name) || 'Anonymous';
  const text = makeSafeText(req.body.text);

  if (!text) {
    return res.status(400).json({ error: 'Message text is required.' });
  }

  const message = {
    id: messages.length + 1,
    name,
    text,
    createdAt: new Date().toISOString(),
  };

  messages.push(message);
  res.status(201).json({ message });
});

app.listen(PORT, () => {
  console.log(`Chat app running at http://localhost:${PORT}`);
});
