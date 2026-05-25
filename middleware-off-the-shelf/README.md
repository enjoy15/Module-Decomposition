# Off-the-shelf middleware example

This Express app replaces the custom logger with the `morgan` middleware.
The `requireApiKey` middleware is still custom.

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
curl http://localhost:3001/health
curl http://localhost:3001/messages
curl -X POST http://localhost:3001/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: cyf" \
  -d '{"user":"Azin","message":"Hello"}'
```
