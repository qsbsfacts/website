export const guideGroups = [
  {
    title: 'Start with the basics',
    description: 'Understand the benefit, the requirements, and the dates that matter.',
    guides: [
      { href: '/what-is-qsbs/', title: 'What is qualified small business stock?', description: 'A plain-English introduction to Section 1202 and how the exclusion works.' },
      { href: '/qsbs-eligibility/', title: 'Does my stock qualify for QSBS?', description: 'Work through the company, shareholder, and stock requirements before relying on an exclusion.' },
      { href: '/qsbs-holding-period/', title: 'How long do I need to hold QSBS?', description: 'Compare holding periods and understand which acquisition dates control the rules.' },
      { href: '/qsbs-exclusion-limits/', title: 'How much gain can I exclude?', description: 'Understand the dollar caps, the basis alternative, and the limits of a simplified example.' },
    ],
  },
  {
    title: 'Questions about your stock',
    description: 'Explore rule changes, employee equity, and more involved planning questions.',
    guides: [
      { href: '/new-qsbs-rules/', title: 'What changed in the QSBS rules?', description: 'Compare the older rules with the changes enacted in July 2025.' },
      { href: '/qsbs-stock-options/', title: 'Can employee stock options lead to QSBS?', description: 'Distinguish an option grant, acquiring shares, compensation, and a later stock sale.' },
      { href: '/qsbs-rollover/', title: 'What is a Section 1045 rollover?', description: 'Understand replacement stock, the election, and how deferral differs from exclusion.' },
      { href: '/qsbs-trust-stacking/', title: 'What is QSBS trust stacking?', description: 'An explanation of taxpayer limits, trust structures, and the policy debate.' },
    ],
  },
  {
    title: 'Understand your state',
    description: 'Federal qualification is only part of the picture. State treatment and residency matter too.',
    guides: [
      { href: '/california-qsbs/', title: 'California QSBS and state taxes', description: 'Understand California treatment and the questions a move before a sale raises.' },
      { href: '/california-exit-tax/', title: 'Moving out of California before an exit', description: 'Understand residency, income sourcing, and why a day count cannot answer every case.' },
      { href: '/oregon-qsbs/', title: 'Oregon QSBS after SB 1507', description: 'Read about enacted state changes, effective dates, and the discussion about future reform.' },
      { href: '/new-york-qsbs/', title: 'New York QSBS and state conformity', description: 'Understand New York treatment and distinguish budget proposals from enacted rules.' },
    ],
  },
] as const;
