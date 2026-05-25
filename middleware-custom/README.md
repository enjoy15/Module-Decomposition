# Custom middleware example

This Express app uses two custom middlewares:
- `requestLogger` logs each request with status and duration.
- `requireApiKey` protects `POST /messages` using an API key header.

## Run locally

```bash
npm install
npm start
```

Set a custom API key (optional):

```bash
API_KEY=my-secret npm start
```

## Try it

```bash
curl http://localhost:3000/health
curl http://localhost:3000/messages
curl -X POST http://localhost:3000/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: cyf" \
  -d '{"user":"Azin","message":"Hello"}'
```
