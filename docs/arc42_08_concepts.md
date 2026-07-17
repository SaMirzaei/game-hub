# 8. Crosscutting Concepts

## Domain Model

The domain mirrors the RAWG API. All entities live in [src/entities/](../src/entities/) as TypeScript interfaces.

| Entity           | Key fields (excerpt)                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| **Game**         | `id`, `slug`, `name`, `background_image`, `genres[]`, `publishers[]`, `parent_platforms[]`, `metacritic`, `rating_top`, `released`, `description_raw` |
| **GameDetails**  | Extends `Game` — adds `website`, `developers` (`Publisher[]`), `esrb_rating` (`{name}`), `screenshots` (`{image}[]`). Used exclusively on the game details page via `useGame`. |
| **Genre**        | `id`, `name`, `slug`, `image_background`                                                              |
| **Platform**     | `id`, `name`, `slug`                                                                                  |
| **Publisher**    | `id`, `name` (also reused as developer shape in `GameDetails`)                                        |
| **Screenshot**   | `id`, `image`                                                                                         |
| **Trailer**      | `id`, `name`, `preview`, `data` (video URLs by quality)                                               |

### UI / Query Model

`GameQuery` (in [src/store.ts](../src/store.ts)) is the single source of truth for the home page:

```ts
interface GameQuery {
  genreId?: number;
  platformId?: number;
  sortOrder?: string;
  searchText?: string;
}
```

## State Management

| Kind             | Tool                 | Where                                            | Notes                                                  |
| ---------------- | -------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| **Server state** | TanStack React Query | All `src/hooks/use*.ts`                          | Single `QueryClient` created in [main.tsx](../src/main.tsx). |
| **UI state**     | Zustand              | [src/store.ts](../src/store.ts) (`useGameQueryStore`) | Drives `useGames` parameters.                          |
| **Routing state**| React Router 7       | [src/routes.tsx](../src/routes.tsx)              | `useParams` for slug-based detail page.                |
| **Theme state**  | `next-themes` + Chakra | [src/theme.ts](../src/theme.ts), `Provider`     | Persisted color mode.                                  |

## Data Fetching Pattern

A generic `APIClient<T>` encapsulates Axios:

```ts
const apiClient = new APIClient<Game>("/games");
apiClient.getAll({ params: { ... } }); // list
apiClient.get(slug);                    // single
```

Every hook follows the same shape:

1. Instantiate `new APIClient<Entity>(endpoint)`.
2. Wrap it with `useQuery` / `useInfiniteQuery`.
3. Provide a deterministic `queryKey` (including filter parameters).
4. Set `staleTime` via `ms()` (e.g. `ms("24h")` for games).

## Caching & Performance

- **`staleTime`** — `useGames` uses `24h`; reduces RAWG calls during normal browsing.
- **Static fallbacks** — `useGenres` / `usePlatforms` ship with static seed data in [src/data/](../src/data/) so the UI renders instantly while the network call resolves.
- **Code splitting** — Vite handles per-route bundles automatically via dynamic imports where used.
- **Skeleton UI** — `GameCardSkeleton` renders during initial load to avoid layout shift.

## Theming & Responsive Layout

- Chakra UI v3 `Provider` wraps the app (`src/components/ui/provider.tsx`).
- Color mode handled by `next-themes`; toggled via `ColorModeSwitch`.
- Responsive layout uses Chakra `Grid` + `useBreakpointValue` (see [HomePage.tsx](../src/pages/HomePage.tsx)) — sidebar only at `lg` and up.

## Error Handling

- Network/data errors from hooks expose `error` to consumers.
- `GameDetailsPage` rethrows on error → caught by the route-level `ErrorPage` (`errorElement` in [routes.tsx](../src/routes.tsx)).
- React Query handles automatic retries with default backoff.

## Project Conventions

| Convention                              | Detail                                                                  |
| --------------------------------------- | ----------------------------------------------------------------------- |
| **Path alias `@/`**                     | Maps to `src/`; configured via `vite-tsconfig-paths`.                   |
| **One default export per component/hook** | Easier to grep and refactor.                                          |
| **Entities are pure data**              | No methods, no Zod — interfaces only.                                   |
| **Hooks own data, components own view** | Components receive data via hooks or props, not by calling Axios.       |
| **ESLint flat config**                  | `typescript-eslint`, `react-hooks`, `react-refresh` (see `eslint.config.js`). |
