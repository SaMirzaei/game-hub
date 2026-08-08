# 5. Building Block View

## Level 1: System Overview (White Box)

Game Hub is a single React SPA. Internally it is organized into clearly separated layers:

```
┌────────────────────────────────────────────────────────────────┐
│                        Game Hub (SPA)                          │
│                                                                │
│   ┌───────────────┐    ┌──────────────────┐    ┌────────────┐  │
│   │    Pages      │───►│   Components     │───►│  Chakra UI │  │
│   │ (routes.tsx)  │    │  (presentational │    │ (theming,  │  │
│   │               │    │   + container)   │    │  layout)   │  │
│   └───────┬───────┘    └────────┬─────────┘    └────────────┘  │
│           │                     │                              │
│           ▼                     ▼                              │
│   ┌─────────────────────────────────────┐                      │
│   │            Hooks (data)             │                      │
│   │  useGames / useGame / useGenres /   │                      │
│   │  usePlatforms / useScreenshots ...  │                      │
│   └────────────────┬────────────────────┘                      │
│                    │                                           │
│           ┌────────┴────────┐                                  │
│           ▼                 ▼                                  │
│   ┌──────────────┐   ┌──────────────┐                          │
│   │ React Query  │   │   Zustand    │                          │
│   │ (server      │   │ (UI state:   │                          │
│   │  cache)      │   │  GameQuery)  │                          │
│   └──────┬───────┘   └──────────────┘                          │
│          │                                                     │
│          ▼                                                     │
│   ┌──────────────────────────┐                                 │
│   │   Services (API client)  │                                 │
│   │   axios → RAWG API       │                                 │
│   └──────────────────────────┘                                 │
└────────────────────────────────────────────────────────────────┘
```

### Contained Building Blocks (Level 1)

| Building Block      | Responsibility                                                     | Source                          |
| ------------------- | ------------------------------------------------------------------ | ------------------------------- |
| **App bootstrap**   | Mounts React, wires `Provider` (Chakra), `QueryClientProvider`, `RouterProvider`. | [src/main.tsx](../src/main.tsx) |
| **Router**          | Declares routes `/` (Home) and `/games/:slug` (Details) under `Layout`. | [src/routes.tsx](../src/routes.tsx) |
| **Pages**           | Top-level views composed of components.                            | [src/pages/](../src/pages/)     |
| **Components**      | Reusable UI building blocks (presentational + container).          | [src/components/](../src/components/) |
| **Hooks**           | Data-fetching and domain logic; bridge React Query and the API client. | [src/hooks/](../src/hooks/)     |
| **Services**        | HTTP client (`APIClient<T>`), image URL helpers.                   | [src/services/](../src/services/) |
| **Entities**        | TypeScript interfaces mirroring RAWG resources.                    | [src/entities/](../src/entities/) |
| **Store**           | Zustand store holding the current `GameQuery` (genre, platform, sort, search). | [src/store.ts](../src/store.ts) |
| **Theme**           | Chakra theme config + default color mode.                          | [src/theme.ts](../src/theme.ts) |
| **Static data**     | Fallback lists for genres and platforms.                           | [src/data/](../src/data/)       |

## Level 2: Key Building Blocks

### Pages

| Page                | Path                  | Responsibility                                                                 |
| ------------------- | --------------------- | ------------------------------------------------------------------------------ |
| `Layout`            | wraps all routes      | Renders `NavBar` + `<Outlet />` inside a padded `Box`.                         |
| `HomePage`          | `/`                   | Two-column responsive grid: `GenreList` aside + heading/selectors/`GameGrid`.  |
| `GameDetailsPage`   | `/games/:slug`        | Fetches a game via `useGame(slug)`, renders description, attributes, trailer, screenshots. |
| `ErrorPage`         | router `errorElement` | Fallback view for routing and thrown errors.                                   |

### Components

Grouped by role:

- **Game listing**: `GameGrid`, `GameCard`, `GameCardContainer`, `GameCardSkeleton`, `GameHeading`, `CriticScore`, `PlatformIconList`, `Emoji`.
- **Filter / sort / search**: `GenreList`, `PlatformSelector`, `SortSelector`, `SearchInput`.
- **Game details**: `GameAttributes`, `DefinitionItem`, `ExpandableText`, `GameScreenshots`, `GameTrailer`.
- **Chrome**: `NavBar`, `ColorModeSwitch`.
- **Chakra UI snippets** (`src/components/ui/`): theme provider, color-mode helpers, dialog, drawer, tooltip, etc.

### Hooks

| Hook              | Backed by                              | Endpoint                          |
| ----------------- | -------------------------------------- | --------------------------------- |
| `useGames`        | `useInfiniteQuery` + `APIClient.getAll` | `/games` (paginated)              |
| `useGame`         | `useQuery` + `APIClient.get`           | `/games/:slug`                    |
| `useGenres`       | `useQuery` (fallback to static data)   | `/genres`                         |
| `useGenre`        | local lookup                           | —                                 |
| `usePlatforms`    | `useQuery` (fallback to static data)   | `/platforms/lists/parents`        |
| `usePlatform`     | local lookup                           | —                                 |
| `useScreenshots`  | `useQuery`                             | `/games/:id/screenshots`          |
| `useTrailers`     | `useQuery`                             | `/games/:id/movies`               |

All game-list parameters (`genres`, `parent_platforms`, `ordering`, `search`, `page`) are read from the Zustand `GameQuery` store inside `useGames`.

### Services

- **`APIClient<T>`** ([src/services/api-client.ts](../src/services/api-client.ts)) — generic class with `getAll(config)` and `get(id|slug)`. Holds a single shared `axiosInstance` with `baseURL` and the RAWG `key`.
- **`image-url.ts`** — builds optimized image URLs from RAWG paths.

### Entities

Plain TypeScript interfaces in [src/entities/](../src/entities/) mirroring RAWG API resources:

| Entity          | Extends   | Key fields (excerpt)                                                          |
| --------------- | --------- | ----------------------------------------------------------------------------- |
| `Game`          | —         | `id`, `slug`, `name`, `background_image`, `genres[]`, `publishers[]`, `metacritic`, `rating_top`, `released`, `description_raw` |
| `GameDetails`   | `Game`    | `website`, `developers` (`Publisher[]`), `esrb_rating` (`id`, `name`, `slug`), `screenshots` (`id`, `image`) |
| `Genre`         | —         | `id`, `name`, `slug`, `image_background`                                      |
| `Platform`      | —         | `id`, `name`, `slug`                                                          |
| `Publisher`     | —         | `id`, `name`                                                                  |
| `Screenshot`    | —         | `id`, `image`                                                                 |
| `Trailer`       | —         | `id`, `name`, `preview`, `data` (video URLs by quality)                       |

`GameDetails` is used by `useGame(slug)` / `GameDetailsPage` to access detail-only fields not present on list results.

### Store (`useGameQueryStore`)

Zustand store with a single `gameQuery` object and setters:

- `setSearchText` — resets the rest of the query (search-only mode).
- `setGenreId`, `setPlatformId`, `setSortOrder` — merge into the current query.
