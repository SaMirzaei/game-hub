# 2. Architecture Constraints

## Technical Constraints

| Constraint                          | Background / Motivation                                                                 |
| ----------------------------------- | --------------------------------------------------------------------------------------- |
| **React 19 + TypeScript**           | Project template choice; type safety and modern React features (Suspense, concurrent).  |
| **Vite 6 build tool**               | Fast dev server, native ESM, simple config (`vite.config.ts`).                          |
| **Chakra UI v3 component library**  | Provides theming, color-mode, responsive primitives; reduces custom CSS surface.        |
| **RAWG public HTTP API**            | The only data source; defines the data model and rate limits.                           |
| **API key embedded in client**      | RAWG only offers client-side keys; no backend exists to proxy requests.                 |
| **`@/` path alias**                 | Configured via `vite-tsconfig-paths`; all internal imports use `@/...`.                 |
| **Node-based tooling**              | npm scripts: `dev`, `build` (`tsc -b && vite build`), `lint`, `preview`.                |
| **ESLint flat config**              | `eslint.config.js` with `typescript-eslint`, `react-hooks`, `react-refresh`.            |

## Organizational Constraints

| Constraint                       | Background / Motivation                                          |
| -------------------------------- | ---------------------------------------------------------------- |
| **Single-developer / small team** | Personal/learning project — keep architecture lightweight.       |
| **Hosted on Vercel**             | Static deployment from `dist/`; no server-side runtime.          |
| **GitHub as source of truth**    | Repository `SaMirzaei/game-hub`, default branch `main`.          |

## Conventions

| Convention                                | Background / Motivation                                       |
| ----------------------------------------- | ------------------------------------------------------------- |
| **Feature folders by role**               | `components/`, `hooks/`, `pages/`, `entities/`, `services/`.  |
| **One file per React component / hook**   | Consistency and discoverability.                              |
| **Server state via React Query**          | `useQuery` / `useInfiniteQuery`; `staleTime` set in `ms()`.   |
| **UI state via Zustand**                  | Single global store in `src/store.ts` for `GameQuery`.        |
| **Entities as TS interfaces**             | Plain data shapes mirroring the RAWG API in `src/entities/`.  |
| **Chakra UI primitives over custom CSS**  | Use `Box`, `Flex`, `Grid`, responsive props, `useBreakpointValue`. |
