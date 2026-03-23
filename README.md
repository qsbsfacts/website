# QSBS Facts

**An open, data-driven resource on state QSBS (Section 1202) tax policy.**

Live at: [qsbsfacts.org](https://qsbsfacts.org)

## Why This Exists

Multiple states are moving to decouple from the federal QSBS (Qualified Small Business Stock) exclusion under Section 1202. The push relies heavily on one number: "94% of QSBS benefits go to households earning over $1 million." It's framed as a billionaire giveaway.

But the Treasury data shows something different. Most people using QSBS aren't wealthy. They're engineers and founders cashing out after years of risk.

Here's what the actual numbers say:

- **74% of claimants earn under $1 million.** That "94%" figure? It's dollar-weighted, not claimant-weighted.
- **The median annual QSBS exclusion is $2,810.** Half of all claimants exclude less than this. That's not billionaire territory.
- **75% of claimants use it exactly once** in an 11-year period — meaning it's a one-time event, not recurring tax avoidance.
- **Both peer-reviewed academic studies** on QSBS find it increases startup investment, firm formation, and employment.

This site exists because policy should be based on data, not talking points. We're pulling from the U.S. Treasury, IRS, and academic research so founders, policymakers, journalists, and tax advisors can see the full picture.

## What's on the Site

- **Exit Calculator** — See what your startup exit costs in each state, with and without QSBS conformity
- **Distribution Analysis** — Interactive charts showing claimant-weighted vs. dollar-weighted QSBS data
- **State Map** — Which states conform, which have decoupled, which are pending
- **Migration Data** — IRS data on where high-income taxpayers are moving
- **Academic Evidence** — The two studies that directly measure QSBS effects
- **Source Tracking** — Every claim linked to primary sources

## Data Sources

All data is in the `data/` directory as JSON files:

| File | Contents | Source |
|------|----------|--------|
| `states.json` | 50 states + DC: tax rates, QSBS conformity status, pending legislation | Tax Foundation, state legislative records |
| `treasury-summary.json` | Key statistics from the Treasury analysis | [U.S. Treasury OTA Working Paper 127](https://home.treasury.gov/system/files/131/WP-127.pdf) (Jan 2025) |
| `migration.json` | Interstate migration flows | [IRS SOI Migration Data](https://www.irs.gov/statistics/soi-tax-stats-migration-data) (2021-2022) |

## Contributing

This is an open project. Pull requests welcome.

### What we need:

- **Data corrections** — Spot an error in state tax rates or conformity status? Fix it in `data/states.json`.
- **New data** — State-level claimant counts, industry breakdowns, dynamic revenue models, or migration patterns would make the analysis stronger.
- **Legislation tracking** — Bills are being introduced constantly. Help us keep the state map up to date.
- **Better visualizations** — Charts could be more interactive, mobile experience could be smoother.
- **Translations** — Non-English-speaking founders and policymakers need this too.
- **Counter-arguments** — If you have data that contradicts our analysis, we want to see it. This site should be honest, not one-sided.

### How to contribute:

1. Fork the repo
2. Create a branch (`feature/your-change`)
3. Make your changes
4. Submit a pull request with clear descriptions and citations for any new data

### Ground rules:

- **Every claim needs a source.** No unsourced statistics.
- **Let the data do the talking.** Neutral tone, no editorializing.
- **Acknowledge the gray areas.** QSBS abuse happens — we're arguing for reform, not pretending there's no problem.
- **No doxxing.** Don't attribute the site to specific individuals or companies.

## Tech Stack

- [Astro](https://astro.build/) — Static site generator
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [Chart.js](https://www.chartjs.org/) — Data visualization
- Deployed on Cloudflare Pages

## Local Development

```bash
npm install
npm run dev      # Start dev server at localhost:4321
npm run build    # Build to dist/
npm run preview  # Preview production build
```

## License

MIT — use this data however you want. Attribution appreciated but not required.

## Disclaimer

This site is maintained by volunteers concerned about evidence-based tax policy. It is not affiliated with any company, political party, or lobbying organization. The data comes from public government sources and peer-reviewed academic research.
