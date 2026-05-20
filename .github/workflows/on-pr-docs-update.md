---
on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
    paths:
      - 'src/**'
      - 'docs/**'
      - 'template/**'
      - 'public/**'
      - 'package.json'
      - 'package-lock.json'
      - 'vite.config.ts'
      - 'tsconfig*.json'
      - 'eslint.config.js'
      - 'index.html'
  reaction: "eyes"
  status-comment: true

engine: copilot

imports:
  - .github/agents/docs-writer.agent.md

permissions:
  contents: read
  pull-requests: read

safe-outputs:
  push-to-pull-request-branch:
    max: 1
    allowed-files:
      - "docs/**"
    protected-files: blocked
  add-comment:
    max: 3

timeout-minutes: 20
---

# Update Arc42 Architecture Documentation

Review the changes in this pull request and update the arc42 architecture documentation.

## Instructions

1. Analyze the PR diff to identify architecture-relevant changes.
2. Map changes to the impacted arc42 sections.
3. Read the matching Mini-Arc42 template in `template/` before editing each doc file (e.g., read `template/arc42_07_deployment.md` before editing `docs/arc42_07_deployment.md`). Follow the template heading structure, table formats, and recommended patterns.
4. Read the target `docs/arc42_*.md` file(s) to understand existing content.
5. Make focused edits following the template structure — preserve existing headings and style.
6. For architecture decisions, use the MADR format with naming convention `[Context/Prefix] ADRNNN - Short Title`.
7. Summarize what you updated in a follow-up comment.

## Constraints

- Do not invent details unsupported by the code changes.
- Add "TODO / Review Needed" for anything uncertain.
- Only modify files under `docs/`.
