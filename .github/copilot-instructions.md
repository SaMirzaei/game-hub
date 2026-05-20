# Repository instructions for Copilot

You are assisting with **Game Hub**, a React 19 + TypeScript single-page application built with Vite and Chakra UI v3 that consumes the public RAWG games API. The repository also contains arc42 architecture documentation under `docs/`.

## Project at a Glance

- **Framework**: React 19, TypeScript ~5.7
- **Build tool**: Vite 6 (`npm run dev`, `npm run build`, `npm run preview`)
- **UI**: Chakra UI v3 (`@chakra-ui/react`, `@emotion/react`, `next-themes`)
- **Routing**: `react-router-dom` v7 (`createBrowserRouter` in `src/routes.tsx`)
- **Server state**: `@tanstack/react-query` v5 (hooks in `src/hooks/`)
- **UI state**: Zustand (`src/store.ts`, `useGameQueryStore`)
- **HTTP**: Axios via the generic `APIClient<T>` in `src/services/api-client.ts`
- **External API**: RAWG (`https://api.rawg.io/api`)
- **Hosting**: Static deploy on Vercel (<https://game-hub-beta-five.vercel.app/>)
- **Lint**: ESLint flat config (`eslint.config.js`)
- **Path alias**: `@/` → `src/` (via `vite-tsconfig-paths`)

## Repository Structure

- `src/` — application source
  - `pages/` — route-level views (`HomePage`, `GameDetailsPage`, `Layout`, `ErrorPage`)
  - `components/` — reusable UI; `components/ui/` holds Chakra snippets
  - `hooks/` — data-fetching hooks wrapping React Query + `APIClient`
  - `services/` — `api-client.ts`, `image-url.ts`
  - `entities/` — TypeScript interfaces mirroring RAWG (`Game`, `Genre`, `Platform`, `Publisher`, `Screenshot`, `Trailer`)
  - `data/` — static seed lists (`genres.ts`, `platforms.ts`)
  - `store.ts`, `theme.ts`, `routes.tsx`, `main.tsx`
- `docs/` — arc42 architecture documentation
- `template/` — Mini-Arc42 documentation templates
- `public/` — static assets

## Coding Conventions

- Use the `@/` path alias for all internal imports.
- One default export per component/hook file.
- Keep server state in React Query; never mirror it in Zustand.
- Data fetching belongs in `src/hooks/use*.ts`, not in components.
- Use Chakra primitives (`Box`, `Flex`, `Grid`, responsive props, `useBreakpointValue`) instead of custom CSS where possible.
- Entities are pure TypeScript interfaces — no classes, no runtime validation.
- Set `staleTime` on queries using `ms()` (e.g. `ms("24h")`).
- Prefer small, focused edits; do not refactor unrelated code.

## Architecture Documentation

Goals:
- Generate or update arc42 architecture documentation in Markdown.
- Keep documentation aligned with feature descriptions, pull request context, and changed code.
- Make small, reviewable edits.

Rules:
- Documentation must be written in Markdown only.
- Update existing files whenever possible.
- Follow the Mini-Arc42 templates in `template/` for heading structure, table formats, and recommended patterns.
- Before editing a doc file, read the matching template (e.g., `template/arc42_05_building_blocks.md` before editing `docs/arc42_05_building_blocks.md`).
- For architecture decisions, use the MADR format with naming convention `[Context/Prefix] ADRNNN - Short Title` — use `[GH]` as the prefix for Game Hub ADRs.
- Do not invent technical facts that are not supported by the source code, existing docs, or PR context.
- If something is unclear, add a "TODO / Review Needed" section instead of guessing.
- Keep content concise, factual, and easy to review.
- Do not delete documentation unless explicitly asked.
- The developer is the final approver for all generated changes.

Documentation targets:
- `docs/arc42_01_introduction.md` — purpose, scope, stakeholders
- `docs/arc42_02_constraints.md` — technical and organizational constraints
- `docs/arc42_03_context.md` — system context, external interfaces (user, RAWG)
- `docs/arc42_05_building_blocks.md` — components, hooks, services, entities, store
- `docs/arc42_06_runtime.md` — runtime scenarios (browse/filter, details, theme toggle, bootstrap)
- `docs/arc42_07_deployment.md` — Vercel static hosting, browser, RAWG
- `docs/arc42_08_concepts.md` — state management, data-fetching pattern, theming, error handling
- `docs/arc42_09_decisions.md` — architecture decisions and rationale (MADR)

When working on documentation:
- Identify what changed in the code or PR.
- Map the change to impacted arc42 sections.
- Update only relevant Markdown files.
- Preserve headings and style.
- Summarize the change clearly for PR review.
