# 7. Deployment View

## Infrastructure Overview

Game Hub is a fully static SPA. There is no application server.

```
┌──────────────┐        HTTPS         ┌────────────────────────┐
│  End User    │ ───────────────────► │  Vercel Edge / CDN     │
│  (browser)   │ ◄─────────────────── │  (static index.html +  │
└──────┬───────┘                      │   hashed JS/CSS/assets)│
       │                              └────────────────────────┘
       │  HTTPS (XHR from JS bundle)
       ▼
┌─────────────────────────┐
│   api.rawg.io (RAWG)    │
│   External REST API     │
└─────────────────────────┘
```

**Production URL**: <https://game-hub-beta-five.vercel.app/>

## Nodes

### Node: Vercel Static Hosting

| Attribute   | Value                                                                 |
| ----------- | --------------------------------------------------------------------- |
| **Type**    | Managed static hosting (CDN + edge)                                   |
| **Purpose** | Serve the Vite build output (`dist/`) — `index.html`, JS, CSS, assets |
| **Build**   | `npm run build` → `tsc -b && vite build`                              |
| **Output**  | `dist/` (static; hashed filenames)                                    |
| **TLS**     | Vercel-managed certificate                                            |
| **Scaling** | Automatic via CDN                                                     |

### Node: End-User Browser

| Attribute   | Value                                                                 |
| ----------- | --------------------------------------------------------------------- |
| **Runtime** | Modern evergreen browser (ES2020+, fetch, ESM)                        |
| **Loads**   | `index.html`, then React bundle from Vercel                           |
| **Calls**   | RAWG API directly from JS (CORS-enabled by RAWG)                      |

### External Service: RAWG API

| Attribute    | Value                                                              |
| ------------ | ------------------------------------------------------------------ |
| **Endpoint** | `https://api.rawg.io/api`                                          |
| **Auth**     | API key passed as `?key=` query parameter (client-side)            |
| **Used by**  | `APIClient` in [src/services/api-client.ts](../src/services/api-client.ts) |

## Environment Comparison

| Aspect          | Development                          | Production                          |
| --------------- | ------------------------------------ | ----------------------------------- |
| **Server**      | `vite` dev server (HMR) via `npm run dev` | Vercel CDN                      |
| **Build**       | On-the-fly ESM                       | `tsc -b && vite build`              |
| **Source maps** | Yes                                  | Default Vite production config      |
| **Devtools**    | `ReactQueryDevtools` visible         | `ReactQueryDevtools` still mounted (see [main.tsx](../src/main.tsx)) |
| **API**         | Same RAWG endpoint                   | Same RAWG endpoint                  |

## Build & Deploy Flow

1. Push to `main` on GitHub (`SaMirzaei/game-hub`).
2. Vercel project picks up the commit.
3. Vercel runs `npm install` and `npm run build`.
4. The contents of `dist/` are published to the Vercel CDN.
5. Cache is invalidated; users get the new bundle on next load.

## TODO / Review Needed

- Confirm whether `ReactQueryDevtools` should be conditionally mounted only in dev.
- Document any Vercel-specific configuration (project settings, environment variables) if/when added.
