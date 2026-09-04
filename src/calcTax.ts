/**
 * QSBS Exit Tax Calculator
 *
 * Calculates state-level tax on a QSBS exit, accounting for:
 * - Federal exclusion percentage (varies by acquisition period and, after
 *   July 4, 2025, holding period: 3 / 4 / 5 years → 50 / 75 / 100%)
 * - Exclusion cap ($10M pre-OBBBA, $15M after July 4, 2025)
 * - State conformity, including 2026-session special cases (ME, VT, RI, MA, HI)
 */

export type AcquisitionPeriod = 'before-2009' | '2009-2010' | '2010-2025' | 'after-july-2025';
export type HoldingYears = 3 | 4 | 5;

export interface ExclusionRules {
  exclusionPct: number;
  capAmount: number;
}

export interface CalcTaxOptions {
  /** Tax year of the sale. Rhode Island stays conforming through 2026. Default 2026. */
  saleYear?: number;
  /** OBBBA holding period for stock acquired after July 4, 2025. Default 5. */
  holdingYears?: HoldingYears;
}

export function getExclusionRules(
  period: AcquisitionPeriod,
  holdingYears: HoldingYears = 5,
): ExclusionRules {
  switch (period) {
    case 'before-2009':
      return { exclusionPct: 0.50, capAmount: 10_000_000 };
    case '2009-2010':
      return { exclusionPct: 0.75, capAmount: 10_000_000 };
    case '2010-2025':
      return { exclusionPct: 1.00, capAmount: 10_000_000 };
    case 'after-july-2025': {
      const exclusionPct = holdingYears >= 5 ? 1.00 : holdingYears === 4 ? 0.75 : 0.50;
      return { exclusionPct, capAmount: 15_000_000 };
    }
  }
}

function roundTax(amount: number): number {
  return Math.round(amount);
}

/**
 * Calculate state tax on a QSBS exit.
 *
 * @param exitAmount - Total gain from the QSBS exit
 * @param taxRate - State top marginal tax rate (percentage, e.g. 13.3)
 * @param conformity - State QSBS conformity status
 * @param period - When the stock was acquired (determines exclusion % and cap)
 * @param stateCode - Optional state code for special rules
 * @param options - Sale year and OBBBA holding period
 * @returns The state tax owed (rounded to nearest dollar)
 */
export function calcTax(
  exitAmount: number,
  taxRate: number,
  conformity: string,
  period: AcquisitionPeriod = '2010-2025',
  stateCode?: string,
  options: CalcTaxOptions = {},
): number {
  if (conformity === 'none') return 0;

  const holdingYears = options.holdingYears ?? 5;
  const saleYear = options.saleYear ?? 2026;
  const rules = getExclusionRules(period, holdingYears);
  const exclusion = Math.min(exitAmount, rules.capAmount) * rules.exclusionPct;
  const taxableGain = exitAmount - exclusion;
  const rate = taxRate / 100;

  // --- State-specific statutes (checked before generic conformity) ---

  if (stateCode === 'RI') {
    // HB 7127 Sub A: §1202 add-back for tax years beginning on/after Jan 1, 2027.
    if (saleYear < 2027) return roundTax(taxableGain * rate);
    return roundTax(exitAmount * rate);
  }

  if (stateCode === 'ME') {
    // LD 2212 / ch. 650: add-back only for stock first acquired after July 3, 2025.
    if (period === 'after-july-2025') return roundTax(exitAmount * rate);
    return roundTax(taxableGain * rate);
  }

  if (stateCode === 'VT') {
    // Act 164 §55a: add back the federal QSBS exclusion, then Vermont's 40%
    // capital-gains exclusion still applies, capped at $350,000 of exclusion.
    const vtExclusion = Math.min(exitAmount * 0.40, 350_000);
    return roundTax((exitAmount - vtExclusion) * rate);
  }

  if (stateCode === 'HI') {
    // Act 35 (2026) freezes §1202 as of Dec 31, 2024: 50% exclusion, $10M cap.
    const hawaiiExclusion = Math.min(exitAmount, 10_000_000) * 0.50;
    return roundTax((exitAmount - hawaiiExclusion) * rate);
  }

  if (stateCode === 'MA') {
    // Follows IRC as of January 1, 2024 (pre-OBBBA). No $15M cap, no 3/4-year
    // ladder. Remainder taxed at the 5% long-term capital-gains rate (the 4%
    // surtax on income above ~$1.11M is omitted; the 3% MA-domiciled-stock
    // rate is a separate election, not the default).
    let maPct: number;
    let maCap = 10_000_000;
    if (period === 'after-july-2025' && holdingYears < 5) {
      maPct = 0; // old law required a 5-year hold
    } else if (period === 'after-july-2025') {
      maPct = 1.00;
    } else {
      maPct = rules.exclusionPct;
      maCap = rules.capAmount;
    }
    const maExclusion = Math.min(exitAmount, maCap) * maPct;
    return roundTax((exitAmount - maExclusion) * 0.05);
  }

  if (conformity === 'conforms') {
    return roundTax(taxableGain * rate);
  }

  if (conformity === 'decoupled' || conformity === 'pending') {
    return roundTax(exitAmount * rate);
  }

  if (conformity === 'partial') {
    return roundTax(exitAmount * rate);
  }

  return roundTax(exitAmount * rate);
}

export function describeTax(args: {
  tax: number;
  exitAmount: number;
  conformity: string;
  period: AcquisitionPeriod;
  stateCode?: string;
  note?: string;
  holdingYears?: HoldingYears;
  saleYear?: number;
}): string {
  const {
    tax,
    exitAmount,
    conformity,
    period,
    stateCode,
    note,
    holdingYears = 5,
    saleYear = 2026,
  } = args;
  const rules = getExclusionRules(period, holdingYears);
  const capLabel = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(rules.capAmount);

  if (conformity === 'none') return 'No state income tax';

  if (stateCode === 'RI') {
    if (saleYear < 2027) {
      return 'Rhode Island still conforms for tax years beginning in 2026. Full §1202 add-back begins in 2027.';
    }
    return 'Rhode Island add-back of the federal §1202 exclusion for tax years beginning 2027+. Full state tax applies.';
  }

  if (stateCode === 'ME') {
    if (period === 'after-july-2025') {
      return 'Maine decoupled only for stock acquired after July 3, 2025. This exit is fully taxed.';
    }
    return 'Maine still conforms for stock acquired on or before July 3, 2025.';
  }

  if (stateCode === 'VT') {
    return 'Vermont adds back the federal QSBS exclusion, then allows a 40% capital-gains exclusion capped at $350,000.';
  }

  if (stateCode === 'HI') {
    return 'Hawaii Act 35 (2026) freezes §1202 as of Dec 31, 2024: 50% exclusion, $10M cap. No OBBBA $15M / 3-year pickup.';
  }

  if (stateCode === 'MA') {
    return 'Massachusetts follows IRC as of Jan 1, 2024 (pre-OBBBA). Remainder taxed at 5% long-term capital-gains rate. 4% surtax and the 3% MA-domiciled-stock rate are not modeled.';
  }

  if (conformity === 'conforms') {
    if (rules.exclusionPct < 1.0) {
      const era = period === 'before-2009' ? 'pre-2009' : period === '2009-2010' ? '2009–2010' : '3- or 4-year OBBBA hold';
      return `Conforms to federal QSBS — ${Math.round(rules.exclusionPct * 100)}% exclusion (${era} stock). ${tax > 0 ? 'State taxes the non-excluded portion.' : ''}`.trim();
    }
    if (exitAmount > rules.capAmount) {
      return `Conforms to federal QSBS — 100% exclusion up to ${capLabel} cap. Amount above cap is taxed.`;
    }
    return 'Conforms to federal QSBS — no state tax on qualified gains';
  }

  if (conformity === 'pending') {
    return (note || 'QSBS conformity pending') + ' — showing projected tax if enacted';
  }

  if (conformity === 'decoupled') {
    return note || 'Does not conform to federal QSBS — full state tax applies';
  }

  return note || 'Partial conformity';
}
