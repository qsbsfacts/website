# QSBS Facts — Site Strategy

*Created: 2026-03-21*

## Current State

The site is comprehensive and data-rich, but it reads like a research paper organized by topic. The argument structure is bottom-up (data → conclusion) when it should be top-down (claim → rebuttal → evidence).

**The core problem:** A visitor arrives because they've heard "QSBS is a tax loophole for billionaires." The site needs to immediately confront and dismantle that framing, then build the affirmative case. Right now it starts with a calculator (useful but not persuasive) and buries the strongest arguments.

---

## Strategy

### 1. Lead with the rebuttal, not the calculator

The strongest content is the "94% claim" deconstruction and the "$2,810 median" stat. Those should be above the fold, not below a calculator. The visitor's mental model is "billionaire loophole" — you have ~5 seconds to crack that open.

**Proposed hero rewrite:** Big stat — "The median QSBS exclusion is $2,810" — with a one-line explainer underneath. Immediately challenges the "millionaire" framing before they scroll.

### 2. Add real people (anonymized archetypes)

The data is strong but abstract. Add 3-4 concrete examples:

- "A senior engineer at a 50-person startup exercises $40K in stock after 6 years. QSBS: $0 state tax. Without it: $5,320."
- "A co-founder sells after 8 years for $2M. First liquidity event of their career."
- "A seed investor puts $25K into a friend's company. 7 years later it's worth $200K."

These make the 74% tangible. Nobody pictures a billionaire when you describe an engineer exercising stock options.

### 3. Restructure the argument flow

**Current:** Calculator → 94% Claim → Who Benefits → Map → Migration → Evidence → Campaign → Sources

**Proposed:**

1. **Hero** — "$2,810" stat + "here's what QSBS actually looks like"
2. **The Claim vs. Reality** — 94% deconstruction (strongest rebuttal, deserves prime position)
3. **Who Actually Uses It** — Archetypes + the one-time-use stat + median data
4. **Calculator** — Now the visitor has context, the calculator is more meaningful
5. **Does It Work?** — Academic evidence (rename from "Evidence" — more assertive)
6. **The Self-Defeating Policy** — Migration + state competition (combine migration + map into one argument: "states that decouple lose the people AND the revenue")
7. **The Campaign** — Who's pushing this and how they frame it
8. **Reform, Not Repeal** — Expand the trust abuse note into its own section. Acknowledging the real problem makes the argument much stronger. "We agree trust stacking is a problem. Fix that. Don't kill the $2,810 median exclusion to get at it."
9. **Sources**

### 4. Fix the calculator's California/Oregon display

Right now CA shows "$0" tax on a QSBS exit even though it's decoupled. Oregon shows "$0" while pending. The `calcTax` function returns 0 for `conforms` and `none` but also seems to return 0 for decoupled states when looking at the comparison table. **That's a bug** — California should show $1.33M on a $10M exit. That's the whole point of the calculator.

### 5. Add a "What You Can Do" CTA

The site presents information but doesn't tell visitors what to do with it. Add:

- "Contact your state legislator" with links to find-your-rep tools
- "Share this data" with pre-written social copy
- "Subscribe for updates" (even just a simple email signup)

Without a CTA, the site is a research paper. With one, it's a campaign tool.

### 6. Sharpen "The Campaign" section

It names ITEP, WFP, and OCPP but doesn't show the coordination pattern. The fact that nearly identical bills appeared in OR, NY, WA, and DC within months — using the same ITEP data — is the story. A simple timeline would make this visceral:

- **Dec 2024:** DC passes B25-0900
- **Jan 2025:** OR introduces SB 1507
- **Jan 2025:** WA introduces SB 6229
- **Feb 2025:** NY includes decoupling in budget proposal

Same playbook, same data, multiple states, same session. That's a coordinated campaign, and showing the timeline makes the argument without editorializing.

---

## Priority Order

1. **Fix the calculator bug** (CA showing $0 is factually wrong and undermines credibility)
2. **Restructure the page flow** (hero → rebuttal → people → calculator)
3. **Add archetypes**
4. **Add "Reform, Not Repeal" section**
5. **Campaign timeline**
6. **CTA section**

---

## Implementation

Single PR with the restructured page. All changes to `site/src/pages/index.astro` and potentially new components.
