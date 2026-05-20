# 1. Introduction and Goals

## Requirements Overview

### Business Context

**Game Hub** is a single-page web application that lets users browse, search, filter and inspect video games. It consumes the public [RAWG](https://rawg.io/apidocs) games database via its HTTP API and presents the data through a responsive, themable UI.

The project is built with **React 19 + TypeScript + Vite** and uses **Chakra UI v3** for components and theming. It is a pure frontend application — there is no custom backend; all data comes from RAWG.

### Core Functionality

1. **Browse games** — Paginated, infinite-scroll grid of games fetched from RAWG.
2. **Filter** — By genre (sidebar list) and by parent platform (selector).
3. **Sort** — By relevance, date added, name, release date, popularity, rating, Metacritic score.
4. **Search** — Full-text search across the RAWG catalog from the navbar.
5. **Game details** — Per-game page (`/games/:slug`) showing description, attributes, trailer and screenshots.
6. **Theming** — Light/dark color-mode switch.

### Scope

- **In Scope**: React client, RAWG API integration, client-side routing, state management (server-state via React Query, UI state via Zustand), responsive layout, theming.
- **Out of Scope**: Backend services, authentication, user accounts, persistence of user data, mutating RAWG data.

### Key Use Cases

| ID    | Use Case                                                | Priority |
| ----- | ------------------------------------------------------- | -------- |
| UC-01 | Browse the games catalog with infinite scroll           | High     |
| UC-02 | Filter games by genre and parent platform               | High     |
| UC-03 | Sort games by various criteria                          | High     |
| UC-04 | Search games by free-text query                         | High     |
| UC-05 | View details, trailer and screenshots for a single game | High     |
| UC-06 | Toggle between light and dark color mode                | Medium   |

---

## Quality Goals

| Priority | Quality Goal             | Scenario                                                | Measurement                                                  |
| -------- | ------------------------ | ------------------------------------------------------- | ------------------------------------------------------------ |
| 1        | **Usability**            | Responsive layout works on mobile, tablet and desktop   | Chakra responsive props; layout adapts at `lg` breakpoint    |
| 2        | **Performance Efficiency** | Repeated navigation does not trigger redundant fetches | React Query cache with 24h `staleTime` on games queries      |
| 3        | **Maintainability**      | Adding a new filter or page is a localized change       | Feature-based folders (`components/`, `hooks/`, `entities/`, `pages/`) |
| 4        | **Reliability**          | Network/RAWG errors surface cleanly to the user         | `ErrorPage` route + per-query `error` handling               |
| 5        | **Compatibility**        | Modern evergreen browsers                                | Vite + ES2020+ target; React 19                              |

---

## Stakeholders

| Role                | Expectations                              | Concerns                                            |
| ------------------- | ----------------------------------------- | --------------------------------------------------- |
| **End User**        | Fast, intuitive game discovery            | Loading time, broken images, stale data             |
| **Developer**       | Clear structure, typed code, easy DX      | Build speed, type safety, dependency upgrades       |
| **Maintainer**      | Stable third-party APIs and dependencies  | RAWG API key rotation, breaking changes in Chakra/React Router |
| **Hosting (Vercel)**| Static build output, fast cold starts     | Bundle size, build configuration                    |
