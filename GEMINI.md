# GEMINI Memory

## Current State
- This is a GitHub profile repository (`juninmd/juninmd`).
- It contains a `README.md` with dynamic content (stats, snake animation, devcard).
- It uses GitHub Actions (`.github/workflows/`) to update this content:
    - `main.yml`: Updates DevCard.
    - `metrics.yml`: Updates GitHub Metrics.
    - `snake.yml`: Generates snake animation.
    - `release.yml`: Semantic Release.
    - `ci.yml`: YAML Linting.
- `devcard.svg` is present in the root.
- `package.json` and `package-lock.json` are now present for managing dependencies.

## Learnings
- The repository lacked standard contribution documents (`CONTRIBUTING.md`, etc.), which have now been added.
- A CI pipeline for validating YAML files was missing and is being implemented.
- The repository relies heavily on external actions (`dailydotdev/action-devcard`, `lowlighter/metrics`, `Platane/snk`).
- **[New]** Switching to local dependencies for Semantic Release (`npm ci`) improves reproducibility and avoids global install issues.
- **[New]** Strict YAML linting (`yamllint`) requires careful configuration, especially ignoring `node_modules` and handling indentation.

## Roadmap Adjustments
- Focus on maintaining the stability of the workflows.
- Ensure the `README.md` remains visually appealing and functional.
- **[New]** Monitor workflow execution for permissions issues.

## 2026-10-23 Profile Revamp
- README redesigned: animated `assets/hero.svg` (self-hosted, no third-party dependency), featured project (tokenix), auto-generated Top repos / Languages sections.
- `scripts/update-readme.mjs` rewrites sections between `<!--NAME:START/END-->` markers; tested via `npm test` (node:test).
- Workflow `update-readme.yml` is `workflow_dispatch` only — cron schedules were removed on purpose earlier.
- Removed fragile third-party widgets (github-readme-stats, streak, trophy, view counter). Snake image still read from the `output` branch.
- Sandbox cannot reach api.github.com; README seed data came from the GitHub MCP.
