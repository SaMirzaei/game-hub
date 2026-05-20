# 6. Runtime View

## RT-01: Browse and Filter Games (Home Page)

**Trigger**: User opens `/` or changes a filter/sort/search.

```
User        NavBar/Selectors     Zustand Store      useGames        APIClient        RAWG API
 │                │                    │                │                │              │
 │ select genre   │                    │                │                │              │
 │───────────────►│ setGenreId(id)     │                │                │              │
 │                │───────────────────►│                │                │              │
 │                │                    │ state change   │                │              │
 │                │                    │───────────────►│                │              │
 │                │                    │                │ queryKey:      │              │
 │                │                    │                │ ["games",query]│              │
 │                │                    │                │───────────────►│ GET /games   │
 │                │                    │                │                │─────────────►│
 │                │                    │                │                │◄──── JSON ───│
 │                │                    │                │◄── data ───────│              │
 │ render grid    │◄──────────────────────────────── GameGrid ──────────────────────────│
```

**Notes**

- `useGames` uses `useInfiniteQuery` with `staleTime: ms("24h")`, so the same `queryKey` does not re-fetch within 24h.
- Infinite scroll: `getNextPageParam` returns `allPages.length + 1` while `lastPage.next` is truthy. `GameGrid` triggers `fetchNextPage()` via `react-infinite-scroll-component`.
- Search resets the query (via `setSearchText`), all other setters merge.

## RT-02: View Game Details

**Trigger**: User clicks a `GameCard` and navigates to `/games/:slug`.

```
User      Router      GameDetailsPage     useGame        APIClient        RAWG API
 │           │              │                │                │              │
 │ click card│              │                │                │              │
 │──────────►│ navigate     │                │                │              │
 │           │─────────────►│ useParams→slug │                │              │
 │           │              │───────────────►│ GET /games/slug│              │
 │           │              │                │───────────────►│─────────────►│
 │           │              │                │                │◄──── JSON ───│
 │           │              │ render details │◄──── game ─────│              │
 │◄──────────────────────── description, attributes, trailer, screenshots ───│
```

**Notes**

- While loading, a Chakra `Spinner` is shown.
- On error or missing data, the page `throw`s, which is caught by the route-level `ErrorPage` (`errorElement` in [routes.tsx](../src/routes.tsx)).
- `GameTrailer` and `GameScreenshots` each fire their own queries (`useTrailers(id)`, `useScreenshots(id)`).

## RT-03: Toggle Color Mode

**Trigger**: User clicks `ColorModeSwitch` in the `NavBar`.

1. `ColorModeSwitch` calls Chakra's color-mode hook (provided via `Provider` in [main.tsx](../src/main.tsx)).
2. `next-themes` persists the preference (default theme from `theme.ts`).
3. All Chakra components re-render with the new theme tokens.

## RT-04: Application Bootstrap

1. `index.html` loads `src/main.tsx`.
2. `createRoot` mounts a tree of providers: `StrictMode` → Chakra `Provider` → `QueryClientProvider` → `RouterProvider`.
3. `RouterProvider` resolves the current URL against `routes.tsx` and renders `Layout` + the matching child route.
4. `ReactQueryDevtools` is mounted alongside in development.
