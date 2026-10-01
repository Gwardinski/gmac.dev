# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio site (https://gmac.dev) plus a small API (deployed on Railway at https://gmacdev-production.up.railway.app/). Two independent packages, each with its own `package.json` and lockfile — there is no shared workspace:

- `frontend/` — React 19 + Vite SPA (TanStack Router/Query, Tailwind v4, Zustand, Base UI)
- `backend/` — Bun + Elysia API, mostly serving the real-time multiplayer game "pew"

Node version is pinned in `.nvmrc` (22.12.0). The backend requires the Bun runtime.

## Commands

From the repo root:

```bash
pnpm front    # frontend dev server on :3000
pnpm back     # backend dev server (bun --watch) on :3001
pnpm build    # frontend production build
```

Frontend (`cd frontend`):

```bash
pnpm dev                      # vite on :3000
pnpm build                    # vite build && tsc (tsc is type-check only, noEmit)
pnpm test                     # vitest run (jsdom, globals enabled)
pnpm vitest run path/to/file  # single test file
```

Backend (`cd backend`):

```bash
bun run dev     # bun --watch src/index.ts
bun run build   # bundle to dist/
bun run start   # run dist/index.js in production mode
bun test        # bun's test runner; `bun test path/to/file` for one file
```

There are currently no test files in either package, and no lint script. Formatting is Prettier (frontend `.prettierrc.json`: single quotes, no trailing commas, printWidth 180, `prettier-plugin-tailwindcss` for class sorting).

## Environment

- Backend env is validated with zod at startup in `backend/src/env.ts` — the server throws if `NOTE_TITLE`, `NOTE_CONTENT` or `CODE` are missing. `CORS_ORIGINS` is a comma-separated list (default `http://localhost:3000`). Add new env vars to that schema and its export.
- Frontend reads `VITE_BACKEND_URL` (default `http://localhost:3001`); the WebSocket URL is derived from it by swapping `http` → `ws`.

## Backend architecture

`src/index.ts` → `src/api/server.ts` builds a single Elysia app (CORS + routers) listening on port 3001. Routers are Elysia instances with a `prefix`, mounted with `.use()`.

**Layering:** router → controller → service, using tuple-style results defined in `src/types.ts` and built with helpers in `src/responses.ts`:

- Services return `ServiceResponse<T>` = `[value, undefined] | [undefined, ErrorCode]` (via `returnServiceResponse`).
- Guards/validators return `GuardResponse` = `[true, undefined] | [false, ErrorCode]`.
- Controllers return `APIResponse<T>` (`{ status, value?, error?, validationErrors? }`) via `returnAPIResponse` / `returnAPIError`.
- WebSocket messages are JSON `{ type, data }` via `returnWSResponse`.
- Error codes are a closed list (`ERROR_CODES` in `src/types.ts`); add new ones there, and map them to an HTTP status in `getStatusByErrorCode` if they shouldn't be 500.

Request bodies are validated by passing zod schemas to Elysia's `body`/`query` options; the pew router's `onError` turns `VALIDATION` errors into a 400 `APIResponse`.

**Pew game (`src/api/pew/`):** files are named `<kind>.<name>.pew.ts` (`controllers.*`, `service.*`, `models/*.model.pew.ts`).

- All state is in memory — `db.pew.ts` exports `ROOMS_DB`, `GAMES_DB`, `CHATS_DB` Maps keyed by room ID. Restarting the server wipes all rooms.
- REST endpoints (`/pew/rooms`, `/pew/join-room`, `/pew/chats/:roomId`) create/join rooms and players; the client then opens `ws://…/pew/game?roomId=…&playerId=…`.
- `engine.ts` runs one `setInterval` loop per room at 60 FPS, calling the `GameClass` `tick*` methods (collisions, respawns, bullets, item spawns, player cleanup) and broadcasting serialized `game-state` to every socket in the room. The engine starts on the first WS connection to a room.
- Models are classes (`GameClass`, `PlayerClass`, `BulletClass`, …) with paired zod "serialised" schemas; `toJSON()` produces the wire format (`GameSerialized`). System events (kills, joins, etc.) are pushed to room chat through `systemEventHandler`.
- Clients send `update-position`, `fire`, `send-chat`, `leave-room` WS messages (schema in `models/base.models.pew.ts`). Player movement is client-authoritative: the client simulates movement and reports position; the server simulates bullets/collisions.

**Lazy routes (`src/api/_lazy_routes/`):** one-off endpoints for unrelated side projects (e.g. `/note`), kept here to avoid separate backends. Not part of gmac.dev itself.

**Database:** Drizzle + Postgres is scaffolded (`drizzle.config.ts`, `src/db/`) but currently commented out / unused.

**Conventions:** prefer Bun-native APIs over Node equivalents in the backend — `Bun.file` over `node:fs`, the built-in `WebSocket` over `ws`, `` Bun.$`…` `` over execa. Tests use `bun test` with imports from `bun:test`. Bun loads `.env` automatically, so don't add dotenv (the dormant DB setup still uses `pg`/`dotenv`; whether to move it to `Bun.sql` is undecided).

## Frontend architecture

- `src/main.tsx` sets up QueryClient, ThemeProvider (default dark) and the TanStack router.
- **File-based routing** in `src/routes/` via the TanStack Router Vite plugin (auto code-splitting). `src/routeTree.gen.ts` is generated by the dev server/build — don't edit it by hand. `__root.tsx` holds the shared layout (background, header, footer).
- Path alias `@/` → `src/`.
- **`components/gmac.ui/`** is the site's own component library (shadcn-style, built on Base UI + `cva` + `cn()` from `utils.ts`), exported through `index.ts`. Its styles/tokens live in `_css.css`, imported by `App.css`. The `/ui` route is a showcase page for these components; `mocks/` holds example compositions used there. Note `components.json` still references shadcn default paths (`@/components/ui`) that aren't used.
- **Pew client (`components/pew/`):** `useGetGameState.ts` owns the WebSocket connection and a Zustand store, does client-side prediction for the local player and interpolation (lerp) for remote players/bullets. `client-copies/` contains hand-maintained copies of backend model types and constants (level grid, tile/player sizes, colours) — **when changing backend pew models or constants, update `client-copies/` to match**, since there is no shared package.
- Portfolio content (projects, playgrounds, tech tags) is static data in `src/data/`.
