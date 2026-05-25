const express = require("express");
const morgan = require("morgan");
const requireApiKey = require("./middlewares/requireApiKey");

const app = express();
const port = process.env.PORT || 3001;

const messages = [];

app.use(express.json());
app.use(morgan("tiny"));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/messages", (req, res) => {
  res.json({ messages });
});

app.post("/messages", requireApiKey, (req, res) => {
  const { user, message } = req.body || {};

  if (!user || !message) {
    return res.status(400).json({ error: "user and message are required" });
  }

  const newMessage = {
    id: messages.length + 1,
    user,
    message,
    createdAt: new Date().toISOString()
  };

  messages.push(newMessage);
  res.status(201).json(newMessage);
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
