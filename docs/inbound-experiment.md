# Inbound validation experiment

Started September 14, 2026. First decision checkpoint: October 14, 2026.

## Hypothesis and first release

Search visitors who find a specific QSBS answer will use a relevant state-tax example and share a useful result. This is an observational experiment, not a randomized test; changes in traffic cannot be attributed to a single edit with certainty.

Improve existing pages rather than add competing URLs:

| Opportunity | Landing page | Initial change |
| --- | --- | --- |
| What QSBS means for a stock sale | `/what-is-qsbs/` | Load the existing $2M-gain example into the state calculator |
| New York state exclusion | `/new-york-qsbs/` | Direct $1M NY example, with eligibility and state-only caveats |
| Gain above the exclusion cap | `/qsbs-exclusion-limits/` | Load the existing $12M example; explain omitted 10x-basis alternative |

These guides already receive search impressions. Exact private analytics and reporting windows belong in the operator's private experiment log, not the public repository. Page-level impressions are not keyword ranks. Tax rules remain grounded in each guide's cited sources; the changes connect existing explanations to the tested calculator.

Also render actual default calculator results into static HTML, instead of placeholder zeros. Copying a result now waits for clipboard success, gives a failure message when needed, and links directly to the calculator using only its known scenario parameters.

## Measurement

GA4 events:

- `guide_to_calculator`: a calculator link clicked from a guide page, including related links. An interaction, not proof of use on the destination.
- `calculator_use`: first calculator field change per page load. Not a completed tax assessment; edits can be experimental.
- `calculator_share`: a successful clipboard write of a calculator link. Not evidence the recipient opened it.

Custom events include sanitized page location/referrer with no query or fragment. No financial amounts, state selections, holding periods, or stock dates are added to event payloads. QA pages with `?qa=1` and nonproduction hosts skip GA loading entirely. Keep QA disabled on every visited URL; the parameter deliberately does not propagate into share links. Browser tests should use local pages, and production smoke tests should include `qa=1`.

## Daily and weekly review

Daily: check production availability and current deploy, then Search Console indexing/performance and GA4 acquisition/events. Record retrieval date, exact data windows, data freshness, totals, per-page figures, and any blocked access. Refresh stale browser reports. Unknown, thresholded, unreported, and unavailable values are not zero. Search Console and GA4 have different attribution, dates, and coverage; do not divide GSC clicks into GA events as a conversion rate.

Weekly: compare the latest complete seven-day window with the previous one, alongside 28-day context. Review query/page pairs, device/country mix, organic landing sessions, engaged sessions, event users, and returning users when available. Evaluate a same-cohort funnel in GA4 only if the report supports it; otherwise present counts separately. Query tables omit some queries; do not claim complete nonbrand totals by subtracting a partial table.

Fix verified availability, indexing configuration, privacy, or calculator regressions promptly. Avoid daily title changes and speculative new pages. Log every deployment date and reason. Never repeatedly request indexing as a daily tactic. Reinspect persistently absent URLs weekly; a crawl request is not indexing proof.

## Decision rules

- Under 50 measured organic landing sessions across the three guides: insufficient exposure to evaluate engagement. Focus on discoverability and extend observation if appropriate. This is an operational threshold, not statistical significance.
- At or above that threshold: examine engagement and calculator transitions by page; use counts and uncertainty, not a categorical validation claim. Zero transitions warrants checking relevance and usability. Usage without shares suggests investigating the sharing experience, not assuming zero value.
- Early positive evidence: repeated organic discovery across multiple days and meaningful calculator interactions from those visitors. Successful copies and returning visitors strengthen the signal; agent QA traffic does not.
- On day 30: report exposure, behavior, limits of the evidence, and the next bounded experiment. Continue daily reviews until the owner changes the schedule.

## Execution and maintenance

Use the `qsbsfacts/website` repository, website-specific GitHub credentials and QSBS Facts author identity. Fetch current main, preserve unrelated work, make bounded changes, run `npm test` and `npm run check:seo`, inspect the diff, open a PR, require passing checks, merge, verify deployment and live behavior. Do not use the umbrella repository's stale `site/` snapshot.

No outbound messaging, paid promotion, paid service signup, or collection of personal financial inputs is part of this experiment. A BB agent automation performs daily reviews in the originating thread; its configuration and private run log are stored outside this public repository.

References: [Google's search performance diagnosis guidance](https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops), [Section 1202](https://www.law.cornell.edu/uscode/text/26/1202), [New York Tax Law 612](https://www.nysenate.gov/legislation/laws/TAX/612).

## Discovery experiment 2 — September 17, 2026

Hypothesis: a reusable records checklist on `/qsbs-eligibility/` can attract people searching for QSBS eligibility/documentation checklists and give them something useful to take to their company or adviser. The existing guide remains the canonical destination; no competing guide URL is added.

The guide now offers an ungated, editable text download, grouped by records held by the shareholder, records to request from the company, and adviser questions. It includes a request template readers can choose to send themselves. This site sends no requests and receives no completed checklists. The guide hub and introductory QSBS guide link to the resource. Checklist content and download share one source.

Measure `checklist_download` (a click on the download link, not confirmed saving, completion, sharing, or eligibility). It uses the existing sanitized event payload without financial values, query strings, or fragments. Direct requests to the text file have no GA instrumentation and are not counted by this event.

Observe September 18–October 1; assess October 2 using the available complete dates and record any lag. Compare eligibility-page impressions, queries and clicks with the preceding 14 days, and inspect organic landing sessions and checklist event users separately. Improvements are observational, not attributable proof. Under 50 measured organic landings on this page is insufficient exposure to judge usefulness; do not treat that as a reason to stop discovery work. If exposure grows without downloads, review the offer, placement, and file format. If downloads occur, look for repeated organic discovery and returning visitors before expanding.

## Active experimentation cadence

Daily monitoring supports a weekly build-and-learn cycle. Low exposure is a discoverability problem to work on, not a prerequisite that must resolve before trying anything. At each weekly review, choose and ship one bounded discovery experiment grounded in observed queries, an actual search task, or an indexing problem; record the hypothesis, distribution mechanism, metric, and review date. If no defensible experiment is found, record the research and concrete blocker rather than repeating “insufficient data.”

Keep each experiment stable for its stated window except for fixes. Prefer a distinct page/task or reusable resource over repeatedly rewriting the same titles. Do not call internal links, a new asset, or a shipped page proof of broader distribution: confirm actual search/referral exposure. No outbound messaging, paid promotion, or new personal-data collection is authorized. First next weekly selection: September 21. Keep the October 14 overall assessment.
