# CLAUDE.md — QSBS Facts

## Project Overview

Data-driven advocacy site about Section 1202 QSBS tax policy. Argues against state-level QSBS decoupling using U.S. Treasury data, academic studies, and migration statistics. Live at [qsbsfacts.pages.dev](https://qsbsfacts.pages.dev).

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
```

## Project Structure

```
src/
  pages/index.astro     # Single-page site (all HTML + client JS)
  styles/global.css     # Tailwind config with custom @theme colors
data/
  states.json           # 51 states: code, name, taxRate, qsbsConformity, note
  treasury-summary.json # Treasury OTA WP127 data (distribution, median, studies)
  migration.json        # IRS SOI migration data + CA outmigration stats
public/
  favicon.svg
dist/                   # Build output (gitignored)
```

## Architecture

- **Single page:** Everything is in `index.astro` — HTML sections + one `<script>` block
- **Client JS:** Calculator, charts, state map interaction, mobile menu, URL params
- **Data flow:** JSON files imported at build time (Astro frontmatter), Chart.js data hardcoded in script
- **Color scheme:** Custom primary blues defined in `@theme` in global.css
- **URL params:** `?state=CA&exit=10000000` for shareable calculator links

## Data Sources

All statistics from **U.S. Treasury OTA Working Paper 127** (January 2025). Migration data from IRS SOI 2021-2022. California data from CA Legislative Analyst's Office (2024).

## State Conformity Values

`qsbsConformity` in states.json: `conforms` | `decoupled` | `pending` | `partial` | `none` (no income tax)

## Calculator

The `calcTax()` function lives in `src/calcTax.ts` (canonical, tested) and is duplicated in the `<script>` block of `index.astro` for client-side use. The function accepts an `AcquisitionPeriod` parameter and handles exclusion caps ($10M/$15M), partial conformity (Hawaii 50% exclusion, Massachusetts 3% rate), and pre-2010 reduced exclusion percentages. Tests are in `src/calcTax.test.ts`.

## Deployment

Push to `main` → Cloudflare Pages auto-builds and deploys. Custom domain `qsbsfacts.org` pending DNS setup.
