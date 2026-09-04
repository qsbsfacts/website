# CLAUDE.md — QSBS Facts

## Project Overview

Data-driven advocacy site about Section 1202 QSBS tax policy. Argues against state-level QSBS decoupling using U.S. Treasury data, academic studies, and migration statistics. Live at [qsbsfacts.org](https://qsbsfacts.org).

## Tech Stack

- **Framework:** Astro 6 (static site generator)
- **Styling:** Tailwind CSS 4 (`@import "tailwindcss"` + `@theme` in `global.css`)
- **Charts:** Chart.js 4 (inline data in `<script>` block)
- **Deploy:** Cloudflare Pages (auto-deploy from GitHub)
- **Node:** >= 22.12.0

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server at localhost:4321
npm run build        # Build to dist/
npm run preview      # Preview built site locally
npm test             # Vitest: calcTax unit tests
```

## Project Structure

```
src/
  pages/index.astro          # Campaign homepage (does not use Base.astro)
  pages/*.astro              # SEO satellites: calculator, evidence, who-uses-it, etc.
  layouts/Base.astro         # Shared chrome for satellite pages
  components/                # ExitCalculator, StateMap, ObbbaBox, CtaStrip
  calcTax.ts                 # Canonical, tested tax math
  styles/global.css          # Tailwind config with custom @theme colors
data/
  states.json                # 51 jurisdictions: code, name, taxRate, qsbsConformity, note
  treasury-summary.json      # Treasury OTA WP127 data (distribution, median, studies)
  migration.json             # IRS SOI migration data + CA outmigration stats
```

## Architecture

- **Hybrid:** Homepage is a full campaign page. Six SEO satellites reuse `Base.astro`.
- **Client JS:** Calculator and map live in components that import `calcTax.ts`. Charts stay in page scripts.
- **Data flow:** JSON files imported at build time (Astro frontmatter)
- **URL params:** `?state=CA&exit=10000000&period=2010-2025&year=2026&holding=5`

## Data Sources

All statistics from **U.S. Treasury OTA Working Paper 127** (January 2025). Migration data from IRS SOI 2021-2022. California data from CA Legislative Analyst's Office (2024).

## State Conformity Values

`qsbsConformity` in states.json: `conforms` | `decoupled` | `pending` | `partial` | `none` (no income tax). As of September 2026 there are no `pending` states.

## Calculator

Canonical `calcTax()` is `src/calcTax.ts` (tested in `src/calcTax.test.ts`) and imported by `ExitCalculator.astro`. Handles OBBBA 3/4/5-year holds, $10M/$15M caps, Maine expansion-only decoupling, Vermont 40%/$350k CG exclusion, Rhode Island 2027 effective date, Massachusetts pre-OBBBA freeze at 5%, and Hawaii Act 35 $10M/50% freeze.

## Deployment

Push to `main` → Cloudflare Pages auto-builds and deploys. Custom domain `qsbsfacts.org`.

This `site/` directory is the git repo for github.com/qsbsfacts/website. GitHub identity is **qsbsfacts**, never personal `sud0n1m`. PAT is 1Password item **Qsbs Full PAT**. Do not attach that remote to the parent umbrella repo. See `AGENTS.md` (this folder) and `../AGENTS.md`.
