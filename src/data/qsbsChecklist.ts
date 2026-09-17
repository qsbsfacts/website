// A records inventory, not an eligibility determination. Keep the page and download in sync.
export const checklistGroups = [
  {
    title: 'Records you may already have',
    items: [
      'Stock purchase or subscription agreements, exercise confirmations, payment evidence, and stock ledger entries for each lot.',
      'Grant, exercise, vesting, and acquisition dates; any restricted-stock election and filing evidence.',
      'Ownership and transfer records, including gifts, trusts, partnerships, conversions, and reorganizations.',
      'Basis records, prior sales and exclusions from the same issuer, and proposed sale documents.',
    ],
  },
  {
    title: 'Records to request from the company',
    items: [
      'Formation and tax-status history, including any conversion to a domestic C corporation.',
      'Original issuance approvals and financing closing records identifying the shares and consideration received.',
      'Support for the statutory gross-assets test before and immediately after issuance, including predecessors, controlled corporations, and contributed property. A funding valuation alone is not this test.',
      'Business activity and asset-use records throughout the holding period, including material changes in operations.',
      'Stock repurchase and redemption history around issuance, including transactions with the holder or related people.',
    ],
  },
  {
    title: 'Questions for your tax adviser',
    items: [
      'Which taxpayer and share lots are being reviewed, and do any transfer or pass-through rules apply?',
      'Which acquisition and issuance dates control the holding period, exclusion percentage, asset threshold, and gain limit?',
      'What records are missing, and which company facts need legal, accounting, or valuation support?',
      'How do prior exclusions, the basis alternative, state law, residency, and the proposed transaction affect the analysis?',
    ],
  },
] as const;
