import { checklistGroups } from '../../data/qsbsChecklist';

export function GET() {
  const text = [
    'QSBS RECORDS CHECKLIST — QSBS Facts',
    'September 17, 2026',
    'Guide and sources: https://qsbsfacts.org/qsbs-eligibility/#records-checklist',
    '',
    'Use a separate copy for each issuer and acquisition lot. This is a document inventory, not a certification that stock qualifies. Record unknowns for review with your tax adviser. A company letter alone does not establish eligibility.',
    'Complete and store this file privately. QSBS Facts does not receive your completed copy.',
    '',
    'Issuer / lot: ____________________   Review date: ____________________',
    'Status key: received / requested / unavailable / adviser review needed',
    ...checklistGroups.flatMap(group => [
      '', group.title.toUpperCase(),
      ...group.items.flatMap(item => ['', '[ ] ' + item, '    Status / record location / question: ______________________________']),
    ]),
    '', 'OPTIONAL REQUEST TO ADAPT AND SEND YOURSELF',
    'I am organizing records for a potential Section 1202 review of my shares. Could you identify the appropriate company contact and available records covering issuance, C corporation history, the statutory gross-assets test, business activity, and redemptions around issuance? Please identify any gaps or limitations. My adviser will evaluate eligibility; I am not asking you to guarantee the tax treatment.',
    '', 'SOURCES',
    '26 USC 1202: https://www.law.cornell.edu/uscode/text/26/1202',
    'IRS Schedule D instructions: https://www.irs.gov/instructions/i1040sd',
    'Redemption rules: https://www.law.cornell.edu/cfr/text/26/1.1202-2',
    '', 'Next: review requirements in the linked guide; compare modeled state taxes at https://qsbsfacts.org/calculator/. The calculator assumes eligibility and is not a full tax calculation.',
    '',
  ].join('\n');
  return new Response(text, { headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Disposition': 'attachment; filename="qsbs-records-checklist.txt"',
  } });
}
