# Calculator accuracy and usefulness

Scope: align the calculator and older stock-sale examples with the sourced guides, explain the existing state-tax model, and add reproducible examples. This is not a replacement for an individualized tax computation or an audit of every policy claim on the site.

1. Label input as gain after basis, qualify results as modeled estimates, and identify assumptions near the controls.
2. Correct option-exercise examples, hypothetical conformity comparisons, exact federal acquisition bands, and acquisition/issuance distinctions.
3. Add methodology, omitted factors, worked examples linked to populated calculator scenarios, and a document checklist linked to eligibility guidance.
4. Flag post-July-2025 holding scenarios as hypothetical, retain existing URL parameter names, validate shared-link selections, and verify browser operation.
5. Run calculator tests and all-page SEO checks; open PR, merge after CI, and verify deployment.

Sources: current 26 USC 1202 (https://www.law.cornell.edu/uscode/text/26/1202); existing sourced eligibility, holding-period, state and options guides. Example outputs must agree with calcTax, and all examples explicitly describe model assumptions. No new claim of professional review or guaranteed tax savings.

Completed: gain labels and model limitations; exact acquisition bands; corrected stock-sale examples and California comparison note; calculator methodology, three loadable examples, and adviser document checklist; hypothetical-date notice; shared-link option validation. Browser verified CA $1M = $133,000, NY $12M = $218,000, invalid selections fall back safely, and new-stock scenarios display the hypothetical notice. Corrected the California dataset note's double-counted surcharge against FTB 2025 Form 540 guidance. All 51 tests and all 20 pages' build/SEO checks pass.
