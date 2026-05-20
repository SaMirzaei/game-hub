<div align="center">

# 🎮 Game Hub

**Discover, filter and explore video games — powered by the [RAWG](https://rawg.io/apidocs) database.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Chakra UI](https://img.shields.io/badge/Chakra%20UI-3-319795?logo=chakraui&logoColor=white)](https://chakra-ui.com/)
[![React Query](https://img.shields.io/badge/React%20Query-5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://game-hub-beta-five.vercel.app/)

### 🌐 [Live Demo →](https://game-hub-beta-five.vercel.app/)

</div>

---

> 🧪 **Heads up:** Game Hub is a **proof of concept (PoC)** built for learning and demonstration purposes. It is not production-grade software — expect rough edges, a hardcoded API key, and no automated tests.
>
> 🧩 **Mock data:** The **genres** and **parent platforms** lists are served from local mock files in [`src/data/`](src/data/) as React Query `initialData`. Live game results still come from the RAWG API.

---

## ✨ Features

- 🔍 **Search** the full RAWG catalog from the navbar
- 🎯 **Filter** games by genre and parent platform (PC, PlayStation, Xbox, Nintendo, …)
- 🔃 **Sort** by relevance, release date, popularity, rating, Metacritic score, name
- ♾️ **Infinite scroll** game grid with skeleton loading states
- 🕹️ **Game details page** with description, attributes, trailer and screenshots
- 🌗 **Light / dark mode** toggle (persisted via `next-themes`)
- 📱 **Fully responsive** layout (sidebar collapses below `lg` breakpoint)
- ⚡ **24h client-side cache** via React Query — fewer requests, snappier UX
- 🧩 **Mock/seed data** for genres and platforms in [`src/data/`](src/data/) — the sidebar renders instantly without waiting for RAWG

---

## 🧱 Tech Stack

| Area | Choice |
| ---- | ------ |
| Framework | **React 19** + **TypeScript ~5.7** |
| Build tool | **Vite 6** (`vite-tsconfig-paths` for the `@/` alias) |
| UI library | **Chakra UI v3** (`@emotion/react`, `next-themes`) |
| Routing | **`react-router-dom` v7** (`createBrowserRouter`) |
| Server state | **TanStack React Query v5** |
| UI state | **Zustand** |
| HTTP | **Axios** wrapped in a generic `APIClient<T>` |
| Icons | **react-icons** |
| Infinite scroll | **react-infinite-scroll-component** |
| Lint | **ESLint flat config** + `typescript-eslint`, `react-hooks`, `react-refresh` |
| Hosting | **Vercel** (static) |
| Data source | **RAWG** REST API (`https://api.rawg.io/api`) |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or your preferred package manager)
- A free **RAWG API key** — get one at <https://rawg.io/apidocs>

### Install & run

```bash
git clone https://github.com/SaMirzaei/game-hub.git
cd game-hub
npm install
npm run dev
```

The app will be available on <http://localhost:5173>.

### Scripts

| Script | What it does |
| ------ | ------------ |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) and produce a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint over the project |

> ⚠️ The RAWG API key currently lives in [`src/services/api-client.ts`](src/services/api-client.ts).
> For your own fork, replace it with your own key (and consider moving it to a Vite env variable such as `VITE_RAWG_API_KEY`).

---

## 🗂️ Project Structure

```
src/
├── main.tsx               # App bootstrap (Chakra + React Query + Router providers)
├── routes.tsx             # createBrowserRouter declarations
├── store.ts               # Zustand store (GameQuery: genre, platform, sort, search)
├── theme.ts               # Chakra theme + default color mode
├── pages/                 # Route-level views
│   ├── Layout.tsx
│   ├── HomePage.tsx
│   ├── GameDetailsPage.tsx
│   └── ErrorPage.tsx
├── components/            # Reusable UI (GameGrid, GameCard, NavBar, …)
│   └── ui/                # Chakra UI snippets (provider, color-mode, dialog, …)
├── hooks/                 # Data hooks wrapping React Query + APIClient
│   ├── useGames.ts        # useInfiniteQuery on /games
│   ├── useGame.ts         # /games/:slug
│   ├── useGenres.ts       # /genres (with static fallback)
│   ├── usePlatforms.ts    # /platforms/lists/parents
│   ├── useScreenshots.ts  # /games/:id/screenshots
│   └── useTrailers.ts     # /games/:id/movies
├── services/
│   ├── api-client.ts      # Generic APIClient<T> (axios)
│   └── image-url.ts       # Optimized image URL helper
├── entities/              # TypeScript interfaces mirroring RAWG
│   ├── Game.ts
│   ├── Genre.ts
│   ├── Platform.ts
│   ├── Publisher.ts
│   ├── Screenshot.ts
│   └── Trailer.ts
└── data/                  # Static seed lists (genres, platforms)
```

---

## 🧠 Architecture Highlights

- **Two-store discipline**
  - Server state lives in **React Query** (caching, retries, pagination).
  - UI state lives in **Zustand** (`useGameQueryStore`).
  - Server state is *never* mirrored into Zustand.
- **Generic API client** — every hook instantiates `new APIClient<Entity>(endpoint)` and wraps it in `useQuery` / `useInfiniteQuery`.
- **24h `staleTime`** on the games list keeps navigation instant within a session.
- **Static fallbacks (mock data)** for genres and platforms in [`src/data/genres.ts`](src/data/genres.ts) and [`src/data/platforms.ts`](src/data/platforms.ts) — used as React Query's `initialData` so the sidebar and platform selector render immediately, no spinner, no network round-trip.
- **Route-level error boundary** — `GameDetailsPage` rethrows fetch errors, caught by `ErrorPage` via `errorElement`.

Full arc42 documentation lives under [`docs/`](docs/):

| Section | Link |
| ------- | ---- |
| 1. Introduction & Goals | [docs/arc42_01_introduction.md](docs/arc42_01_introduction.md) |
| 2. Constraints | [docs/arc42_02_constraints.md](docs/arc42_02_constraints.md) |
| 3. Context & Scope | [docs/arc42_03_context.md](docs/arc42_03_context.md) |
| 5. Building Blocks | [docs/arc42_05_building_blocks.md](docs/arc42_05_building_blocks.md) |
| 6. Runtime View | [docs/arc42_06_runtime.md](docs/arc42_06_runtime.md) |
| 7. Deployment View | [docs/arc42_07_deployment.md](docs/arc42_07_deployment.md) |
| 8. Crosscutting Concepts | [docs/arc42_08_concepts.md](docs/arc42_08_concepts.md) |
| 9. Architecture Decisions | [docs/arc42_09_decisions.md](docs/arc42_09_decisions.md) |

---

## ☁️ Deployment

Game Hub is a fully static SPA deployed on **Vercel**:

1. Push to `main` on GitHub.
2. Vercel runs `npm install` + `npm run build`.
3. The contents of `dist/` are published to Vercel's global CDN.

Production URL: <https://game-hub-beta-five.vercel.app/>

---

## 🤝 Contributing

Issues and PRs are welcome! When contributing:

- Keep changes small and focused.
- Use the `@/` path alias for internal imports.
- Put data fetching in `src/hooks/` — components stay presentational.
- Prefer Chakra primitives (`Box`, `Flex`, `Grid`, responsive props) over custom CSS.
- Run `npm run lint` and `npm run build` before opening a PR.

---

## 🙏 Credits

- Game data, images, trailers and screenshots: **[RAWG Video Games Database API](https://rawg.io/apidocs)**.
- Built on top of the **React + TypeScript + Vite** starter and **Chakra UI v3**.
