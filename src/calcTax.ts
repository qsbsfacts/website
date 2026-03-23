/**
 * QSBS Exit Tax Calculator
 *
 * Calculates state-level tax on a QSBS exit, accounting for:
 * - Federal exclusion percentage (varies by acquisition period)
 * - Exclusion cap ($10M or $15M depending on period)
 * - State conformity status (conforms, decoupled, pending, partial, none)
 * - Partial-conformity special rules (Hawaii 50% exclusion, Massachusetts 3% rate)
 */

export type AcquisitionPeriod = 'before-2009' | '2009-2010' | '2010-2025' | 'after-july-2025';

export interface ExclusionRules {
  exclusionPct: number;    // 0.50, 0.75, or 1.00
  capAmount: number;       // $10M or $15M
}

export function getExclusionRules(period: AcquisitionPeriod): ExclusionRules {
  switch (period) {
    case 'before-2009':
      return { exclusionPct: 0.50, capAmount: 10_000_000 };
    case '2009-2010':
      return { exclusionPct: 0.75, capAmount: 10_000_000 };
    case '2010-2025':
      return { exclusionPct: 1.00, capAmount: 10_000_000 };
    case 'after-july-2025':
      return { exclusionPct: 1.00, capAmount: 15_000_000 };
  }
}

/**
 * Calculate state tax on a QSBS exit.
 *
 * @param exitAmount - Total gain from the QSBS exit
 * @param taxRate - State top marginal tax rate (percentage, e.g. 13.3)
 * @param conformity - State QSBS conformity status
 * @param period - When the stock was acquired (determines exclusion % and cap)
 * @param stateCode - Optional state code for partial-conformity special rules
 * @returns The state tax owed (rounded to nearest dollar)
 */
export function calcTax(
  exitAmount: number,
  taxRate: number,
  conformity: string,
  period: AcquisitionPeriod = '2010-2025',
  stateCode?: string,
): number {
  // No income tax states: always $0
  if (conformity === 'none') return 0;

  const rules = getExclusionRules(period);

  // Amount that can be excluded (limited by cap)
  const excludableAmount = Math.min(exitAmount, rules.capAmount);
  // Actual exclusion based on period's exclusion percentage
  const exclusion = excludableAmount * rules.exclusionPct;
  // Taxable gain = total gain minus exclusion
  const taxableGain = exitAmount - exclusion;

  if (conformity === 'conforms') {
    // Conforming states honor the federal exclusion.
    // For 100% exclusion periods under the cap, tax is $0.
    // For pre-2010 stock or amounts over the cap, state taxes the remainder.
    return Math.round(taxableGain * (taxRate / 100));
  }

  if (conformity === 'decoupled') {
    // Decoupled states ignore federal QSBS entirely — full state tax on all gains
    return Math.round(exitAmount * (taxRate / 100));
  }

  if (conformity === 'pending') {
    // Pending decoupling — show projected tax as if decoupled
    return Math.round(exitAmount * (taxRate / 100));
  }

  if (conformity === 'partial') {
    // State-specific partial conformity rules
    if (stateCode === 'HI') {
      // Hawaii: only allows 50% exclusion (regardless of federal exclusion %)
      const hawaiiExclusion = Math.min(exitAmount, rules.capAmount) * 0.50;
      const hawaiiTaxable = exitAmount - hawaiiExclusion;
      return Math.round(hawaiiTaxable * (taxRate / 100));
    }
    if (stateCode === 'MA') {
      // Massachusetts: taxes QSBS gains at reduced 3% rate (vs standard 9%)
      return Math.round(exitAmount * (3 / 100));
    }
    // Fallback for unknown partial states: treat like decoupled
    return Math.round(exitAmount * (taxRate / 100));
  }

  // Unknown conformity: treat as taxable
  return Math.round(exitAmount * (taxRate / 100));
}
