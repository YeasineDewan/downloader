# ⬇️ Downloader — Universal Media Hub

> Next-generation universal media downloader with multi-resolution video, studio-grade audio extraction, and deep web-asset fetching — wrapped in an Apple-inspired iOS dark experience.

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ES2022-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4-black?logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

**Paste a link → Analyze → Preview → Download in the quality you want. Single videos, lossless audio, full galleries, documents, or 100-link batch jobs — all from one Media Hub.**

---

## ✨ Highlights

- **🔗 Universal analyzer** — paste *any* URL. Auto-detects YouTube, Spotify, Instagram, TikTok, Facebook, X/Twitter, SoundCloud, Pinterest, Reddit, Vimeo, or generic web pages.
- **🎬 Multi-resolution video** — 360p → 4K / 8K picks with container, codec, FPS, HDR badges, bitrate + size estimates, and SRT/VTT subtitles.
- **🎧 Studio audio** — MP3 320kbps, AAC, FLAC 24-bit lossless with sample-rate, ID3 auto-tagging, volume/bass DSP, trim & speed controls.
- **🖼️ Gallery + Image + Documents scrapers** — deep Cheerio DOM crawl pulls every image, audio, video & file asset with thumbnails, dimensions, extensions, and one-click ZIP.
- **📦 Batch Queue built for power users** — bulk-paste 100 URLs, drag-to-reorder priority, live speed/ETA telemetry charts (Recharts), paginated queue, server-side ZIP bundling.
- **📚 Smart Library** — persistent localStorage library, search + filter + pagination, in-app player, PDF reports, rich ZIP archives (metadata.json, .m3u, .url/.webloc, HTML catalog + covers).
- **🧹 Smart Cleanup** — age-based (>7/14/30/60/90d) + size-based (>50MB–1GB) rules with reclaimable-space preview.
- **🍎 iOS 18 Pro dark UI** — frosted glass, segmented controls, Plus Jakarta Sans + JetBrains Mono, Lucide icons, Motion animations.
- **⚡ Resilient backend** — Express + Vite middleware, UA rotation, retry with backoff, oEmbed → OpenGraph/Schema.org → DOM scan → range-verified stream pipeline.

> ⚖️ **Fair-use note:** Only download content you own or have rights to. Respect platform ToS and copyright.

## 📑 Table of Contents

- [How It Works](#-how-it-works)
- [Feature Deep-Dive](#-feature-deep-dive)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Scripts](#-scripts)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Using the App](#-using-the-app)
- [Library Exports](#-library-exports)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Security & Legal](#-security--legal)
- [License](#-license)

## 🚀 How It Works

```text
1. Paste URL ──► 2. Analyze ──► 3. Pick tab ──► 4. Tune ──► 5. Download / Queue
     │               │               │              │              │
 DynamicUrlBar   POST /api/      MediaHub:      Advanced       /api/download
 + history +     analyze         Video/Audio/   OptionsBar     /api/batch-
 sample links    (oEmbed →       Image/Gallery/ (trim, DSP,    download-zip
 + clipboard     OG → DOM scan   Documents/     speed, GIF,    → Library
                 → verify)       Batch)         subs, ID3)
```

1. **Paste** a link in the smart URL bar (clipboard button, ⌘V shortcut, persistent recent history, 4 one-click samples).
2. **Analyze** via `POST /api/analyze` — platform detection, title/author/thumbnail/duration resolution, format lists, and full asset crawl.
3. **Explore** the Media Hub result card: hero artwork, metadata, and per-category sub-views with counts.

## 🛠️ Tech Stack

**Frontend:** React 19 + TypeScript (ES2022) · Vite 8 · Tailwind CSS v4 (`@tailwindcss/vite`) · Lucide icons · Motion · Recharts · JSZip + jsPDF + autotable (client exports)

**Backend:** Node.js + Express 4 · `tsx` runner · Cheerio scraper · JSZip bundler · dotenv · Vite middleware (dev) / static `dist/` (prod)

**Fonts & style:** Plus Jakarta Sans + JetBrains Mono (Google Fonts) · custom iOS glass surfaces, slim scrollbars, shimmer/pulse animations (`src/index.css`)

**State:** React hooks + `localStorage` (`downloader_library_v1`, `downloader_settings_v1`, `downloader_smart_cleanup_config_v1`, `media_downloader_search_history_v1`)

## 🏗️ Architecture

```text
downloader/
├── server.ts                  # Express API + Vite middleware / static host
├── index.html                 # Dark shell, SEO/OG meta, font preloads
├── vite.config.ts             # React + Tailwind, @ alias, HMR guard
├── src/
│   ├── main.tsx / App.tsx     # Boot + 3-tab orchestrator (hub/batch/library)
│   ├── types.ts               # PlatformInfo, formats, tasks, assets, settings
│   ├── components/
│   │   ├── Header / DynamicUrlBar / BatchQueueView / LibraryView
│   │   ├── MediaPlayerModal / SettingsModal
│   │   └── MediaHub/          # MediaHub + 5 sub-views + filter + DSP bar
│   ├── utils/                 # bulkZipExport, exportPdf, smartCleanup
│   └── assets/images/         # Hero + disc + prism artwork
└── .env.example / package.json / tsconfig.json / LICENSE
```

## 📁 Project Structure

```text
├── server.ts
├── index.html
├── src/
│   ├── App.tsx                        # Tabs, analyze flow, queue/library stores
│   ├── main.tsx
│   ├── index.css                      # Tailwind + iOS glass + animations
│   ├── types.ts
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── DynamicUrlBar.tsx          # History, samples, platform detect
│   │   ├── BatchQueueView.tsx         # DnD queue + telemetry charts
│   │   ├── LibraryView.tsx            # Search/filter/export/cleanup UI
│   │   ├── MediaPlayerModal.tsx
│   │   ├── SettingsModal.tsx          # Quality + Smart Cleanup prefs
│   │   └── MediaHub/
│   │       ├── MediaHub.tsx           # Result orchestrator + download zone
│   │       ├── CategoryFilterBar.tsx / CategoryNav.tsx
│   │       ├── VideoSubView.tsx / AudioSubView.tsx
│   │       ├── ImageSubView.tsx / GallerySubView.tsx
│   │       ├── DocumentsSubView.tsx / AdvancedOptionsBar.tsx
│   └── utils/
│       ├── bulkZipExport.ts           # HTML catalog + per-item folders
│       ├── exportPdf.ts               # A4 library summary report
│       └── smartCleanup.ts            # Age/size rules + sample data
```

## ⚡ Quick Start

**Prerequisites:** Node.js 20+ · npm 10+ (or Bun — `bun.lock` is included) · a modern browser.

```bash
# 1. Clone
git clone https://github.com/YeasineDewan/downloader.git
cd downloader

# 2. Install (pick one)
npm install
# bun install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local → set GEMINI_API_KEY and APP_URL (see Configuration)

# 4. Run (Express + Vite middleware via tsx)
npm run dev
# → http://localhost:3000

# 5. Type-check / production build
npm run lint
npm run build
npm run preview   # preview dist/
npm start         # NODE_ENV=production node server.ts (serves dist/)
```

> `npm run dev` uses `tsx server.ts`, so the **same Express API** (`/api/*`) is live during development. No separate backend process needed.

## 📜 Scripts

| Script | Command | Purpose |
| ------ | ------- | ------- |
| `dev` | `tsx server.ts` | Dev server (Express + Vite middleware, HMR unless `DISABLE_HMR=true`) |
| `build` | `vite build` | Production bundle → `dist/` |
| `start` | `node server.ts` | Production server (expects `NODE_ENV=production`, serves `dist/`) |

## 🔌 API Reference

Base URL is the same origin (dev: `http://localhost:3000`).

| Method & Path | Body / Query | Returns | Notes |
| ------------- | ------------ | ------- | ----- |
| `POST /api/analyze` | `{ "url": "https://..." }` | `MediaAnalysisResult` — platform, title, author, description, thumbnail, `durationSec`, `directMediaUrl`, `videoFormats[]`, `audioFormats[]`, `subtitles[]`, `extractedAssets[]`, `allAssets[]`, `totalAssetsCount` | 400 on missing/malformed URL. Multi-engine fallback, never hard-fails on one extractor. |
| `POST /api/scrape-assets` | `{ "url": "...", "page"?: 1, "pageSize"?: 50 }` | `{ assets: ScrapedSiteAsset[], total, page, hasMore }` | Deep Cheerio crawl with server-side pagination. |
| `GET /api/download?url=&title=&format=&resolution=&type=` | Query params (URL-encoded) | Binary stream with `Content-Disposition: attachment; filename="..."` | Range-request aware proxy. `type`: `video\|audio\|subtitle\|asset\|image`. |
| `POST /api/batch-download-zip` | `{ "items": [{title, url, format...}], "bundleName"?: "Downloader_Batch" }` | `application/zip` | Up to 50 items; fetches remotes (5s timeout each) with manifest fallback. |
| `GET /api/proxy-media?url=` | Query param | Proxied bytes with original `Content-Type` + `Access-Control-Allow-Origin: *` | For in-app preview without CORS issues. |

**`curl` examples:**

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=LXb3EKWsInQ"}'

curl "http://localhost:3000/api/download?url=https%3A%2F%2Fcdn.example.com%2Fv.mp4&title=demo&format=mp4&resolution=1080p&type=video" -OJ
```

**Key types (`src/types.ts`):** `PlatformInfo` · `VideoFormatOption { resolution, fps, container, codec, estimatedSize, bitrate, hdr? }` · `AudioFormatOption { quality, sampleRate, container, estimatedSize }` · `SubtitleOption` · `ScrapedSiteAsset` · `DownloadTask { status: idle|downloading|completed|failed|paused }` · `AdvancedDownloadSettings` · `MediaHubCategory = video|audio|image|gallery|documents|batch`.

## 🖱️ Using the App

1. **Analyze a link** — paste into the URL bar → **Analyze** (or `Enter`). Try a sample chip first to verify the pipeline.
2. **Pick quality** — Video tab: choose resolution card (Recommended is pre-selected) + subtitle format. Audio tab: pick MP3/AAC/FLAC card.
3. **Tune (optional)** — expand **Advanced / DSP deck**: trim start/end (`MM:SS`), volume 100–200%, bass boost, speed 0.5–1.5x, mute, GIF, ID3 tagging, thumbnail embed.
4. **Download or queue** — hit the master **Download** button, **Add to Queue**, or **Preview** in the modal player. Completions land in **Library**.
5. **Go bulk** — open **Batch Queue**, paste one URL per line → **Add**, drag to prioritize, **Start All**, then **Export ZIP**.
6. **Manage Library** — search/filter/paginate, multi-select delete, **Export PDF** for reports, **Export ZIP** for archives, configure **Smart Cleanup** in Preferences.

Try these:

```text
https://www.youtube.com/watch?v=LXb3EKWsInQ
https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
https://www.instagram.com/reel/C2i-Q2xrX8_/
https://en.wikipedia.org/wiki/Aurora
```


## 🚢 Deployment

**Any Node host (VPS, Render, Railway, Fly.io, Docker):**

```bash
npm install
npm run build
NODE_ENV=production PORT=3000 npm start
# or: NODE_ENV=production node server.ts
```

`server.ts` serves `dist/` + SPA fallback (`* → index.html`) in production. Set `GEMINI_API_KEY`, `APP_URL`, and `PORT` in the host's env dashboard.

**AI Studio / Cloud Run:** this repo ships `metadata.json` (`name: Downloader`, `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`) — deploy as-is; `GEMINI_API_KEY`/`APP_URL` are injected from Secrets at runtime.

**Static-only hosts (Netlify/Vercel) ⚠️:** `vite build` output works, but `/api/*` needs a Node server — keep Express hosted, or port endpoints to serverless functions.

**Docker (example):**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["node", "server.ts"]
```

## 🧩 Troubleshooting

| Symptom | Likely cause | Fix |
| ------- | ------------ | --- |
| `Analyze` returns generic title / no assets | Target blocks bots, needs JS, or rate-limits (429) | Retry (backoff is built-in); try the canonical/desktop URL; check server logs for `fetchWithRetry` warnings |
| Download is slow / stalls | Remote throttling or large 4K file | Pick a lower resolution; use Batch Queue telemetry to confirm speed; retry |
| `npm run dev` port in use | Another app on `:3000` | `PORT=4000 npm run dev` (PowerShell: `$env:PORT=4000; npm run dev`) |
| `tsc --noEmit` errors | Type drift after edits | Run `npm run lint`, fix reported file/line, keep `src/types.ts` as source of truth |
| `clean` fails on Windows CMD | `rm -rf` is Unix-only | Run in Git Bash / WSL, or `rmdir /s /q dist` |
| Blank page after `npm start` | `dist/` missing or `NODE_ENV` not set | `npm run build` first, then `NODE_ENV=production npm start` |
| History/library not persisting | Private mode / blocked `localStorage` | Allow site storage; keys are listed in [Tech Stack](#-tech-stack) |

## 🗺️ Roadmap

- [ ] Real `yt-dlp` / `ffmpeg` pipeline for true multi-bitrate remux + server-side trim/GIF/DSP
- [ ] Authenticated extractors (private playlists, age-gated, login-walled pages)
- [ ] WebSocket progress + resumable chunked downloads
- [ ] Playlist/channel expansion (one URL → N tasks)
- [ ] PWA offline mode + background fetch
- [ ] i18n + light-mode theme + Vitest/Playwright coverage

## 🤝 Contributing

PRs welcome! Quick workflow:

```bash
git checkout -b feat/my-improvement
npm install
npm run dev     # iterate
npm run lint    # must pass
npm run build   # must pass
```

Conventions: TypeScript strict-ish ES2022 · functional React components · Tailwind utilities + existing `ios-*` classes · Lucide icons only · keep `src/types.ts` canonical · co-locate MediaHub views under `src/components/MediaHub/` · small focused PRs with before/after notes.

## 🔒 Security & Legal

- Never commit `.env.local` / secrets (`.gitignore` covers `.env*`, `node_modules/`, `dist/`, logs).
- `/api/download` and `/api/proxy-media` are open proxies — add URL allow-listing, auth, and rate-limiting before exposing publicly.
- `express.json({ limit: '25mb' })` + 5–9s fetch timeouts bound abuse; lower them for untrusted deployments.
- Only download media you own or are licensed to use. You are responsible for complying with platform ToS and copyright law.

## 📄 License

[MIT](./LICENSE) © 2026 YeasineDewan. Free to use, modify, and distribute with attribution.

---

<div align="center">

**Built with React · Vite · Tailwind · Express — Downloader, Apple iOS Edition.**

⭐ Star the repo if it saved you a download — issues and PRs are welcome!

</div>

## 📦 Library Exports

**Client ZIP (`src/utils/bulkZipExport.ts` → `bulkExportToZip`):**

```text
Downloader_Library_YYYY-MM-DD.zip
├── index.html              # Offline dark catalog (cards + source links)
├── manifest.json           # Full task metadata
├── playlist.m3u            # All stream URLs
└── 01-title-slug/
    ├── metadata.json  info.txt  stream.url  stream.webloc  stream.m3u  cover.jpg
```

Progress callback stages: `preparing → fetching_assets → compressing → complete|error` with per-file percent.

**PDF (`src/utils/exportPdf.ts` → `exportLibraryToPdf`):** A4 portrait via jsPDF + autotable — dark header banner, timestamp, video/audio/other counts, striped table (`# · Title · Creator · Platform · Format · Quality · Size · Date`), footer page numbers → `Downloader_Library_Summary_YYYY-MM-DD.pdf`.

| `preview` | `vite preview` | Preview the production build |
| `lint` | `tsc --noEmit` | Type-check only |
| `clean` | `rm -rf dist server.js` | Remove build artifacts (use Git Bash / WSL on Windows) |

## 🔧 Configuration

Copy `.env.example` → `.env.local` (git-ignored via `.env*`):

```bash
GEMINI_API_KEY="MY_GEMINI_API_KEY"  # Required for Gemini AI calls (Secrets panel in AI Studio)
APP_URL="MY_APP_URL"                # Public URL — self-links, callbacks, API endpoints
PORT=3000                           # Optional — server.ts defaults to 3000
NODE_ENV=development                # Set to production for static dist/ serving
DISABLE_HMR=true                    # Optional — disable Vite HMR/file-watch during agent edits
```


**Backend pipeline (`server.ts`):**

- `fetchWithRetry` — 3 user agents, spoofed fetch headers, 6s/9s timeouts, retry on 429/5xx with backoff.
- `POST /api/analyze` — Stage 1: platform extractors (Vimeo oEmbed, Reddit JSON) → Stage 2/3: Cheerio crawl of OG/Twitter/Schema.org + `<video>/<audio>/<img>/links` → Stage 4: range-request stream verification → returns `MediaAnalysisResult`.
- `POST /api/scrape-assets` — paginated deep asset extraction (`allAssets`, `totalAssetsCount`).
- `GET /api/download` — range-aware stream proxy with `Content-Disposition: attachment`.
- `POST /api/batch-download-zip` — in-memory JSZip bundle (≤50 items + manifest).
- `GET /api/proxy-media` — CORS proxy for in-app preview.

4. **Tune** with the DSP deck: clip trimmer, volume/bass boost, playback speed, mute/GIF, subtitle format, thumbnail embed, ID3 auto-tag.
5. **Download** direct (`GET /api/download`), add to Batch Queue, or save to Library for ZIP/PDF export.

## 🎯 Feature Deep-Dive

| Area | What you get |
| ---- | ------------ |
| **Smart URL Bar** (`DynamicUrlBar.tsx`) | URL normalization, platform icon preview, loading state, search-history dropdown + recent chips (max 5, `localStorage`), clear-all, sample links for YouTube 4K / Spotify Hi-Fi / Instagram Reel / Wikipedia deep-scrape |
| **Media Hub** (`MediaHub/`) | `CategoryFilterBar` (Video · Audio · Image · Documents · Batch) with live counts → `VideoSubView` (resolution cards + subtitles) · `AudioSubView` (quality cards + waveform) · `ImageSubView` + `GallerySubView` (masonry grid, lightbox, bulk ZIP) · `DocumentsSubView` (file table) · `AdvancedOptionsBar` (DSP deck) · master download execution zone with progress + success state |
| **Batch Queue** (`BatchQueueView.tsx`) | Bulk textarea import, paginated list (8/page), drag-and-drop priority reorder, pause/resume/retry/remove, Start-All, server ZIP (`/api/batch-download-zip`), live telemetry dashboard (speed / ETA / tasks tabs) powered by Recharts Area + Bar charts |
| **Library** (`LibraryView.tsx`) | Auto-persist (`downloader_library_v1`), seeded sample items on first run, live background-task progress ticker, search + type filter (all/ongoing/video/audio/other) + pagination, multi-select bulk delete, in-app preview, PDF + ZIP export, Smart Cleanup badges (`>30d`, `Large`) |
| **Player** (`MediaPlayerModal.tsx`) | Frosted modal, video canvas / spinning-disc audio mode with waveform bars, play/pause, scrubber, volume/mute, restart, direct download shortcut |
| **Settings** (`SettingsModal.tsx`) | General tab (preferred video quality, preferred audio, ID3 toggle, 4 dark accents: Titanium/Charcoal/Cobalt/Emerald) + Cleanup tab (enable, age presets 7/14/30/60/90d, size presets 50MB–1GB + custom MB, live candidate preview, one-click run, reset defaults) |
| **Header** (`Header.tsx`) | Sticky glass header, segmented Media Hub / Batch Queue / Library nav with count badges, Paste-Link + Preferences actions |

