# 9. Architecture Decisions

This section records the significant architectural decisions for Game Hub in lightweight MADR form.

| ID                                     | Title                                  | Status   |
| -------------------------------------- | -------------------------------------- | -------- |
| [GH] ADR001                            | Use Vite + React 19 + TypeScript       | Accepted |
| [GH] ADR002                            | Consume the RAWG public API directly   | Accepted |
| [GH] ADR003                            | TanStack React Query for server state  | Accepted |
| [GH] ADR004                            | Zustand for UI state                   | Accepted |
| [GH] ADR005                            | Chakra UI v3 as component library      | Accepted |
| [GH] ADR006                            | React Router 7 with data routes        | Accepted |
| [GH] ADR007                            | Deploy as static SPA on Vercel         | Accepted |

---

## [GH] ADR001 - Use Vite + React 19 + TypeScript

**Status**: Accepted

**Context**: A modern, fast-feedback SPA toolchain is needed.

**Decision**: Use Vite 6 with React 19 and TypeScript ~5.7. Build via `tsc -b && vite build`.

**Consequences**
- ✅ Fast dev server, HMR, native ESM.
- ✅ Strong typing via TS + `@types/react` 19.
- ⚠️ React 19 / Chakra UI v3 are recent; expect ecosystem churn.

## [GH] ADR002 - Consume the RAWG public API directly

**Status**: Accepted

**Context**: We need game catalog data without operating a backend.

**Decision**: Call `https://api.rawg.io/api` directly from the browser with an API key embedded in the client.

**Consequences**
- ✅ Zero backend to operate.
- ✅ CORS supported by RAWG.
- ⚠️ The API key is visible to anyone inspecting traffic.
- ⚠️ Subject to RAWG rate limits and availability.

## [GH] ADR003 - TanStack React Query for server state

**Status**: Accepted

**Context**: Many components need the same remote data with caching, pagination and background refresh.

**Decision**: Use `@tanstack/react-query` v5 with a single `QueryClient` provided in [main.tsx](../src/main.tsx). Use `useInfiniteQuery` for the games list and `useQuery` for everything else. Set `staleTime` per hook (e.g. 24h for games).

**Consequences**
- ✅ Deduplicated requests, declarative cache invalidation.
- ✅ Built-in infinite-scroll support.
- ⚠️ Extra concept to learn for new contributors.

## [GH] ADR004 - Zustand for UI state

**Status**: Accepted

**Context**: A small piece of cross-component UI state (`GameQuery`) drives `useGames`.

**Decision**: Use Zustand (`useGameQueryStore` in [src/store.ts](../src/store.ts)) instead of Context or Redux.

**Consequences**
- ✅ Minimal boilerplate.
- ✅ Selectors avoid unnecessary re-renders.
- ⚠️ Two state libraries (Zustand + React Query); the boundary must stay clear: server state never goes into Zustand.

## [GH] ADR005 - Chakra UI v3 as component library

**Status**: Accepted

**Context**: We need accessible, themeable components with light/dark mode and responsive primitives.

**Decision**: Adopt Chakra UI v3 with `@emotion/react`, `next-themes`, and the local `src/components/ui/` snippets.

**Consequences**
- ✅ Fast UI assembly; built-in dark mode.
- ✅ Responsive props and `useBreakpointValue` for layout.
- ⚠️ v3 introduces API differences vs. v2; community examples may not match.

## [GH] ADR006 - React Router 7 with data routes

**Status**: Accepted

**Context**: We need client-side routing with route-level error handling.

**Decision**: Use `react-router-dom` v7 via `createBrowserRouter` + `RouterProvider` (see [routes.tsx](../src/routes.tsx)). Use `errorElement` for the route-level error page.

**Consequences**
- ✅ Clean nested layout via `Layout` + `<Outlet />`.
- ✅ Errors bubble to `ErrorPage` automatically.

## [GH] ADR007 - Deploy as static SPA on Vercel

**Status**: Accepted

**Context**: The app is fully static; no server-side rendering or APIs are owned by us.

**Decision**: Build with `vite build` and host the `dist/` output on Vercel.

**Consequences**
- ✅ Free / low-cost global CDN.
- ✅ Zero-config deploy from GitHub `main`.
- ⚠️ Any future server-side concerns (e.g. proxying the RAWG key) would require adding Vercel Functions or moving off-platform.
