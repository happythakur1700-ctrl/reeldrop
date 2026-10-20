# ReelDrop

Instagram Reel downloader — Next.js (App Router) + Tailwind CSS v4 + TypeScript.
Live: https://reeldrop-three.vercel.app

## Providers (tried in this order)

1. **instagrapi** (primary) — [aiograpi-rest](https://github.com/subzeroid/instagrapi)
   REST wrapper (`subzeroid/aiograpi-rest` Docker image). `GET /media?url=…`
   with `X-Session-ID` auth; username/password login supported with session
   caching and auto re-login on 401.
2. **rest** — generic key-less REST provider (`{download_link, title, thumbnail}`
   response shape).
3. **rapidapi** — RapidAPI downloader (`X-RapidAPI-Key` / `X-RapidAPI-Host`).

## Environment variables

Copy `.env.example` to `.env.local` for development, or set them in
Vercel → Settings → Environment Variables for production:

```
INSTAGRAPI_URL=https://your-aiograpi-host
INSTAGRAPI_SESSION_ID=<instagram sessionid cookie>
# or:
INSTAGRAPI_USERNAME=...
INSTAGRAPI_PASSWORD=...
```

Until a provider is configured, the API honestly reports
`NOT_CONFIGURED (503)`.

## Develop

```bash
npm install
npm run dev
```

## Deploy

```bash
npm i -g vercel
vercel login
vercel --prod
```
