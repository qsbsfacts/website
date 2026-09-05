# SEO verification and deployment

This change targets the current qsbsfacts/website repository at baseline 635de47, including all seven routes and the September 2026 factual updates.

OpenSEO research used https://seo.firecorn.net/mcp.
[Production baseline audit](https://seo.firecorn.net/p/cb1dab02-0aa0-40ec-b99d-408f8a567521/audit?auditId=e9ba12df-3123-47c3-b381-537487efd7c7) sampled 10 URLs: six trailing-slash canonical differences, four long descriptions, three long titles, and two heading-order skips.

US English keyword estimates included QSBS (8,100 monthly searches), qualified small business stock (1,900), Section 1202 (1,900), and QSBS calculator (20). These estimates informed metadata without changing policy claims.

## Changes

- Shared SEO component across all seven pages with concise, unique titles and descriptions and matching social metadata.
- Trailing-slash URLs aligned across canonicals, navigation, structured data, and the existing generated sitemap.
- Calculator query parameters remain shareable and canonicalize to /calculator/.
- Context-aware headings for the calculator, federal-rules box, and state map.
- Existing factual updates, citations, structured data, social image and crawler directives retained.

## Verification

Run `npm ci`, `npm test`, and `npm run check:seo`.

All 48 calculator tests pass. The SEO command builds the site and uses Python 3's standard library to inspect all seven pages: unique metadata, self-canonicals, social image existence, JSON-LD URLs, headings, internal links/fragments, robots, and exact sitemap coverage.

Chrome smoke testing verified that a California $10M calculator query loads with the existing $1.33M modeled result, and navigation reaches /state-impact/ with the corrected H2 heading.

Pull-request CI and the production deployment workflow run both test suites.

## Deployment

Merge this branch into main in qsbsfacts/website. The existing Deploy to Cloudflare Pages workflow deploys dist to the qsbsfacts Pages project with its existing GitHub secrets.

After deployment, verify the workflow and all seven production routes, then rerun OpenSEO's run_site_audit for https://qsbsfacts.org. The linked audit is the pre-deployment baseline; local validation does not claim production has changed.
