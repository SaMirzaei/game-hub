---
applyTo: "docs/arc42_*.md"
description: "Use when editing or updating arc42 architecture documentation for the Game Hub React SPA — building blocks, deployment views, runtime scenarios, architecture decisions, or constraints."
---

When editing architecture documentation:

- Before editing a doc file, read the matching Mini-Arc42 template in `template/` (e.g., read `template/arc42_07_deployment.md` before editing `docs/arc42_07_deployment.md`).
- Follow the heading structure, table formats, and recommended patterns from the template.
- Prefer short sections and bullets.
- Keep the wording factual and implementation-aware — verify claims against the actual code in `src/` before writing.
- Do not repeat the same information across multiple files unless required.
- Link to source files using workspace-relative paths (e.g. `[src/store.ts](../src/store.ts)`).
- For architecture decisions (`docs/arc42_09_decisions.md`), use the MADR format with naming convention `[GH] ADRNNN - Short Title`.

Project context to keep in mind while documenting:

- Game Hub is a static React 19 + TypeScript + Vite SPA. There is **no backend** — all data comes from the RAWG public API.
- Server state is managed by TanStack React Query; UI state (`GameQuery`) by Zustand in `src/store.ts`.
- UI is built with Chakra UI v3 and themed via `next-themes`.
- Routing uses `react-router-dom` v7 (`createBrowserRouter` in `src/routes.tsx`).
- Deployment target is Vercel (static).

Use these sections when relevant:
- Change Summary
- Affected Components
- Interface Impact
- Dependency Impact
- Risks / Open Questions
- TODO / Review Needed

Template-to-doc mapping:
- `template/arc42_01_introduction.md` → `docs/arc42_01_introduction.md` (Requirements Overview, Quality Goals with ISO 25010, Stakeholders)
- `template/arc42_02_constraints.md` → `docs/arc42_02_constraints.md` (Technical, Organizational constraints; Conventions)
- `template/arc42_03_context.md` → `docs/arc42_03_context.md` (Business Context: user + RAWG; Technical Context: HTTPS, API key)
- `template/arc42_05_building_blocks.md` → `docs/arc42_05_building_blocks.md` (Level 1 SPA decomposition; Level 2 pages, components, hooks, services, entities, store)
- `template/arc42_06_runtime.md` → `docs/arc42_06_runtime.md` (browse/filter, game details, color-mode toggle, bootstrap)
- `template/arc42_07_deployment.md` → `docs/arc42_07_deployment.md` (Vercel CDN, browser node, RAWG external service, build flow)
- `template/arc42_08_concepts.md` → `docs/arc42_08_concepts.md` (domain model, state-management split, data-fetching pattern, theming, error handling, conventions)
- `template/arc42_09_decisions.md` → `docs/arc42_09_decisions.md` (MADR ADRs with `[GH]` prefix: status, context, decision, consequences)
