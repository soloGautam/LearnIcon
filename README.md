# LearnIcon

AI learning companion. Plain Vite + React + React Router (no TanStack), with a Vercel serverless function calling the Anthropic Claude API.

## Local development

```bash
npm install
cp .env.example .env   # then set ANTHROPIC_API_KEY
npm run dev
```

The Vite dev server runs the frontend. For the `/api/chat` serverless function locally, use the Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

## Deploy to Vercel

1. Push to a Git repo and import into Vercel (Framework preset: **Vite**).
2. Add an Environment Variable: `ANTHROPIC_API_KEY` = your Claude API key from https://console.anthropic.com.
3. Deploy. The `api/chat.ts` file is auto-detected as a serverless function.

## Project layout

- `src/` — React app (React Router, Tailwind v4, Radix UI, shadcn-style components)
- `api/chat.ts` — Vercel serverless function calling Claude (`claude-3-5-sonnet-latest`)
- `vercel.json` — SPA rewrites
