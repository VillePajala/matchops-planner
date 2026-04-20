# MatchOps Planner

Standalone tournament/lineup planner for football coaches. Runs as a single HTML file — no build step, no dependencies, opens in any modern browser. All data stays in the browser's `localStorage`.

**Live tool:** open `index.html` in a browser (desktop or mobile). Deployed version (once set up): Vercel URL.

## Deployment

Production hosting via Vercel. The project is static (no build step) — Vercel serves `index.html` and the other files directly.

Cache strategy: the service worker is **network-first** (always tries the network, falls back to cache only when offline), and Vercel sends `Cache-Control: no-cache, no-store, must-revalidate` for `index.html`, `sw.js`, and `manifest.webmanifest`. Net effect: every deployment is visible on the next page load, and the installed PWA auto-reloads when a new service worker activates.

### Deploy steps

1. Push this repo to GitHub.
2. Import the repo into Vercel (no framework preset needed — "Other" / static).
3. Done. Every push to `main` ships to production; branches get preview URLs.

Local dev: just open `index.html` in a browser (or `python3 -m http.server 8000` from the project root for proper relative-URL resolution).

## Install as PWA

Once deployed, the app is installable:
- **Mobile (Android Chrome / iOS Safari):** browser menu → "Add to Home Screen" / "Install App".
- **Desktop (Chrome/Edge):** address-bar install icon, or browser menu → "Install MatchOps Planner".

Installed PWA runs standalone, works offline, and auto-updates when a new version is deployed.

## Why this is separate from MatchOps-Local

MatchOps-Local is the actual match-day app — timer, live events, stats. This planner is its companion:

- Build game plans **before** the tournament (home, on a laptop).
- Adjust plans **between games** on tournament day (on a phone), quickly see how each change affects every player's total minutes.
- The MatchOps-Local app handles the live match (timer, scoring, substitutions-as-events).

The two apps don't talk to each other yet. Future goal: full integration (see `/home/villepajala/projects/MatchOps-Local/docs/02-technical/tournament-planner-integration.md` and the corresponding GitHub issue).

## Features

- **Multi-game view** of all 5 games, side-by-side or as a swipable carousel on mobile.
- **Per-game lineups** with a single half-time substitution window.
- **Drag-drop** (desktop) / **tap-to-swap** (mobile) for moving players between slots.
- **Merge / split** buttons per position: turn a sub-rotation slot into a full-game slot (or vice versa).
- **Player pills** color-coded by current tournament minutes vs fair share (red → yellow → green gradient).
- **Click a pill or chip** to highlight every appearance of that player across all games (multi-select).
- **Warning** on bench chips for players who aren't playing a game at all.
- **Named versions**: save, rename, load, delete plan snapshots (e.g. "Default", "Jasper refuses GK", "Niilo H. sick").
- **Export / import JSON** for cross-device backup or sharing.
- Auto-save to localStorage after every change.

## Tournament context (seed data)

The tool ships seeded with a specific tournament plan — Pepo Violetti Sunday 2026-04-26. See below for the tournament layout and the rotation rules applied:

(… tournament-specific plan below …)

---

## Tournament format
- Games: 5
- Duration: 25 minutes each
- Format: 8v8
- Formation: 2-1-2-2 (GK — 2 DEF — 1 CDM — 2 MID — 1 CAM — 1 ST)
- Roster: 11 players (8 on field, 3 on bench)

## Files
- `planner.html` — the app (standalone, open in a browser)
- `players.md` — player profiles (roster, positions, strengths, notes)
- `games/game-N.md` — per-game starting lineup + substitution schedule (human-readable plan notes)

## Schedule — Sunday 2026-04-26
| # | Time  | Match                              | Field | Notes          |
|---|-------|------------------------------------|-------|----------------|
| 1 | 09:30 | FC Lahti – Pepo Violetti           | TN1   |                |
| 2 | 11:30 | Pepo Violetti – Lautp              | TN2   |                |
| 3 | 13:00 | FC Lahti 2 – Pepo Violetti         | TN1   |                |
| 4 | TBD   | Playoffs (opponent TBD)            | TBD   | expected tough |
| 5 | TBD   | Placement match (opponent TBD)     | TBD   | not easy       |

## Rotation rules (hard)
- **Everyone plays every game.**
- **One sub window per game, at 12:30** (middle of the 25-minute match).
- Per game: **5 fullgamers** (25 min) + **3 first-half-only** (12:30) + **3 second-half-only** (12:30).
- Goalies play outfield in games they're not keeping.

## Goalie pool
- Verne (primary), Petja, Jasper. Any non-Verne game is interchangeable between Petja and Jasper.

## In-flight adjustment
If someone drops out / is injured / off-form on tournament day, rebalance remaining games — the rotation is a system, not a stack of independent plans. Use the **Versions** feature to save each contingency scenario.
