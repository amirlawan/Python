# Rextory

Minimal web app that calls the [Mistral AI API](https://docs.mistral.ai/) with the
official TypeScript SDK (`@mistralai/mistralai`). The API key stays on the server;
the browser only talks to the local `/api/chat` endpoint.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add your API key (get one at [console.mistral.ai](https://console.mistral.ai/api-keys)):

   ```bash
   cp .env.example .env
   # then edit .env and set MISTRAL_API_KEY=...
   ```

## Run locally

```bash
npm run dev
```

Then open <http://localhost:3000> and chat. To use a different port,
set `PORT` in `.env`.

## Structure

- `src/server.ts` — Express server; serves the UI and proxies chat requests to
  Mistral (`mistral-small-latest`) via the official SDK.
- `public/index.html` — single-file chat interface (no build step).
