# 3. Context and Scope

## Business Context

Game Hub is a browser-based SPA. It has one human actor (the end user) and one external system (the RAWG games database).

```
          ┌──────────────┐
          │   End User   │
          │  (browser)   │
          └──────┬───────┘
                 │  HTTPS (HTML/JS/CSS, user interactions)
                 ▼
          ┌──────────────────────┐         HTTPS / REST          ┌──────────────┐
          │      Game Hub        │ ────────────────────────────► │   RAWG API   │
          │  (React SPA, Vercel) │ ◄──────────────────────────── │ api.rawg.io  │
          └──────────────────────┘     JSON (games, genres,      └──────────────┘
                                       platforms, screenshots,
                                       trailers)
```

| Partner       | Input to Game Hub                                             | Output from Game Hub                                  |
| ------------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| **End User**  | Clicks, search text, filter/sort selections, navigation       | Rendered game grid, game details, trailers, theme UI  |
| **RAWG API**  | JSON for `/games`, `/games/:slug`, `/genres`, `/platforms/lists/parents`, `/games/:id/screenshots`, `/games/:id/movies` | HTTP GET requests with `key`, `genres`, `parent_platforms`, `ordering`, `search`, `page` query params |

## Technical Context

| Partner       | Channel          | Protocol     | Auth / Security                                     |
| ------------- | ---------------- | ------------ | --------------------------------------------------- |
| **End User**  | Public internet  | HTTPS        | None; static assets served by Vercel CDN            |
| **RAWG API**  | Public internet  | HTTPS / REST | API key passed as `key` query parameter (see [src/services/api-client.ts](../src/services/api-client.ts)) |

**Base URL**: `https://api.rawg.io/api`  
**Client library**: Axios (`axios.create` with shared `baseURL` and `params.key`).

## TODO / Review Needed

- The RAWG API key is currently committed to source ([src/services/api-client.ts](../src/services/api-client.ts)). Consider moving to a Vite env variable (`VITE_RAWG_API_KEY`) before any sensitive use.
