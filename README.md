# ReelDrop 🎬

**Instagram Reel downloader — paste a link, get the video.**

🔗 **Live:** https://reeldrop.happythakur1700.workers.dev

## What it does

Paste any public Instagram Reel URL and ReelDrop fetches the video — with an inline preview player, thumbnail, and one-click MP4 download. No login, no Instagram credentials needed, works great on mobile.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [vinext](https://github.com/cloudflare/vinext) (Next.js App Router on Vite) |
| Styling | Tailwind CSS v4 |
| Hosting | Cloudflare Workers |
| Download provider | [Apify](https://apify.com/snapinsta/instagram-downloader-api) (snapinsta actor) |

## Features

- ⚡ **Auto-fetch on paste** — paste a Reel link anywhere on the page and it starts immediately
- 🎥 **Inline video preview** — watch before downloading
- 🌗 **Light/dark theme** — persisted preference, Instagram-gradient accents
- 🔒 **Honest errors** — typed error mapping (private, deleted, rate-limited, not configured) instead of silent failures
- ⌨️ **Keyboard-first** — shared accent focus rings, global Ctrl+V support

## Provider chain

ReelDrop tries providers in order until one is configured:

1. **instagrapi** — self-hosted [aiograpi-rest](https://github.com/subzeroid/instagrapi) (unlimited, needs your own deployment)
2. **Apify** — snapinsta actor (currently active, free tier)
3. **rest** — generic keyless REST provider
4. **rapidapi** — RapidAPI downloader

Credentials live as Cloudflare Worker secrets — never in this repo.

## Develop

```bash
npm install
npm run dev          # Next.js dev server
npm run dev:vinext   # vinext dev server (Cloudflare runtime)
```

## Deploy

```bash
npx wrangler secret put APIFY_API_TOKEN   # or your provider's secret
npx @vinext/cloudflare deploy
```

## Legal

Download only content you own or have permission to save. ReelDrop is not affiliated with Instagram or Meta.
