import { describe, it, expect } from 'vitest';
import { calcTax, getExclusionRules } from './calcTax';

describe('getExclusionRules', () => {
  it('before-2009: 50% exclusion, $10M cap', () => {
    const rules = getExclusionRules('before-2009');
    expect(rules.exclusionPct).toBe(0.50);
    expect(rules.capAmount).toBe(10_000_000);
  });

  it('2009-2010: 75% exclusion, $10M cap', () => {
    const rules = getExclusionRules('2009-2010');
    expect(rules.exclusionPct).toBe(0.75);
    expect(rules.capAmount).toBe(10_000_000);
  });

  it('2010-2025: 100% exclusion, $10M cap', () => {
    const rules = getExclusionRules('2010-2025');
    expect(rules.exclusionPct).toBe(1.00);
    expect(rules.capAmount).toBe(10_000_000);
  });

  it('after-july-2025: 100% exclusion, $15M cap', () => {
    const rules = getExclusionRules('after-july-2025');
    expect(rules.exclusionPct).toBe(1.00);
    expect(rules.capAmount).toBe(15_000_000);
  });
});

describe('calcTax', () => {
  // === Conforming states ===
  describe('conforming states', () => {
    it('100% exclusion under cap → $0 tax', () => {
      expect(calcTax(5_000_000, 5.0, 'conforms', '2010-2025')).toBe(0);
    });

    it('100% exclusion at exactly $10M cap → $0 tax', () => {
      expect(calcTax(10_000_000, 5.0, 'conforms', '2010-2025')).toBe(0);
    });

    it('100% exclusion above $10M cap → taxed on excess', () => {
      // $15M exit, $10M excluded, $5M taxable at 5%
      expect(calcTax(15_000_000, 5.0, 'conforms', '2010-2025')).toBe(250_000);
    });

    it('50% exclusion (pre-2009) + $1M exit → tax on 50% of gain', () => {
      // $1M exit, 50% excluded = $500K, taxed at 5% = $25,000
      expect(calcTax(1_000_000, 5.0, 'conforms', 'before-2009')).toBe(25_000);
    });

    it('75% exclusion (2009-2010) + $2M exit → tax on 25% of gain', () => {
      // $2M exit, 75% excluded = $1.5M excluded, $500K taxable at 6% = $30,000
      expect(calcTax(2_000_000, 6.0, 'conforms', '2009-2010')).toBe(30_000);
    });

    it('post-July-2025 stock at exactly $15M cap → $0 tax', () => {
      expect(calcTax(15_000_000, 9.9, 'conforms', 'after-july-2025')).toBe(0);
    });

    it('post-July-2025 stock above $15M cap → taxed on excess', () => {
      // $20M exit, $15M excluded, $5M taxable at 9.9%
      expect(calcTax(20_000_000, 9.9, 'conforms', 'after-july-2025')).toBe(495_000);
    });

    it('50% exclusion above cap → taxes both unexcluded and over-cap portions', () => {
      // $12M exit, cap at $10M, 50% of $10M = $5M excluded
      // Taxable = $12M - $5M = $7M at 5% = $350,000
      expect(calcTax(12_000_000, 5.0, 'conforms', 'before-2009')).toBe(350_000);
    });
  });

  // === No income tax states ===
  describe('no income tax states', () => {
    it('always $0 regardless of period', () => {
      expect(calcTax(50_000_000, 0, 'none', '2010-2025')).toBe(0);
      expect(calcTax(50_000_000, 0, 'none', 'before-2009')).toBe(0);
      expect(calcTax(50_000_000, 0, 'none', 'after-july-2025')).toBe(0);
    });
  });

  // === Decoupled states ===
  describe('decoupled states', () => {
    it('CA 13.3% + $2M exit + 100% exclusion period → $266,000', () => {
      // Decoupled ignores QSBS: $2M × 13.3% = $266,000
      expect(calcTax(2_000_000, 13.3, 'decoupled', '2010-2025')).toBe(266_000);
    });

    it('full tax regardless of exclusion period', () => {
      // Even before-2009 stock: decoupled means full state tax
      expect(calcTax(2_000_000, 13.3, 'decoupled', 'before-2009')).toBe(266_000);
    });

    it('small exit amounts', () => {
      // $40K × 13.3% = $5,320
      expect(calcTax(40_000, 13.3, 'decoupled', '2010-2025')).toBe(5_320);
    });

    it('zero tax rate decoupled state → $0', () => {
      expect(calcTax(10_000_000, 0, 'decoupled', '2010-2025')).toBe(0);
    });
  });

  // === Pending states ===
  describe('pending states', () => {
    it('shows projected tax as if decoupled', () => {
      // NY 10.9% on $5M = $545,000
      expect(calcTax(5_000_000, 10.9, 'pending', '2010-2025')).toBe(545_000);
    });

    it('OR 9.9% on $2M = $198,000', () => {
      expect(calcTax(2_000_000, 9.9, 'pending', '2010-2025')).toBe(198_000);
    });
  });

  // === Partial states ===
  describe('partial conformity states', () => {
    it('Hawaii: 50% exclusion regardless of federal period', () => {
      // $2M exit, Hawaii caps at 50% exclusion = $1M excluded, $1M taxable at 11%
      expect(calcTax(2_000_000, 11.0, 'partial', '2010-2025', 'HI')).toBe(110_000);
    });

    it('Hawaii: 50% exclusion with pre-2009 stock', () => {
      // Hawaii uses its own 50% regardless — same result
      // $2M exit, 50% of min($2M, $10M) = $1M excluded, $1M at 11%
      expect(calcTax(2_000_000, 11.0, 'partial', 'before-2009', 'HI')).toBe(110_000);
    });

    it('Hawaii: above cap', () => {
      // $12M exit, 50% of min($12M, $10M) = $5M excluded, $7M taxable at 11%
      expect(calcTax(12_000_000, 11.0, 'partial', '2010-2025', 'HI')).toBe(770_000);
    });

    it('Massachusetts: reduced 3% rate on all QSBS gains', () => {
      // $2M × 3% = $60,000
      expect(calcTax(2_000_000, 9.0, 'partial', '2010-2025', 'MA')).toBe(60_000);
    });

    it('Massachusetts: 3% rate regardless of period', () => {
      expect(calcTax(5_000_000, 9.0, 'partial', 'before-2009', 'MA')).toBe(150_000);
    });
  });

  // === Cap behavior ===
  describe('exclusion caps', () => {
    it('$10M cap for pre-2025 stock: exit at exactly cap', () => {
      expect(calcTax(10_000_000, 5.0, 'conforms', '2010-2025')).toBe(0);
    });

    it('$10M cap for pre-2025 stock: exit over cap', () => {
      // $20M exit, $10M excluded, $10M × 5% = $500,000
      expect(calcTax(20_000_000, 5.0, 'conforms', '2010-2025')).toBe(500_000);
    });

    it('$15M cap for post-July-2025 stock: exit over cap', () => {
      // $20M exit, $15M excluded, $5M × 5% = $250,000
      expect(calcTax(20_000_000, 5.0, 'conforms', 'after-july-2025')).toBe(250_000);
    });

    it('$10M cap with 50% exclusion: exit over cap', () => {
      // $20M exit, 50% of $10M cap = $5M excluded, $15M × 5% = $750,000
      expect(calcTax(20_000_000, 5.0, 'conforms', 'before-2009')).toBe(750_000);
    });
  });

  // === Defaults ===
  describe('defaults', () => {
    it('defaults to 2010-2025 period when not specified', () => {
      expect(calcTax(5_000_000, 5.0, 'conforms')).toBe(0);
    });
  });

  // === Edge cases ===
  describe('edge cases', () => {
    it('$0 exit amount', () => {
      expect(calcTax(0, 13.3, 'decoupled', '2010-2025')).toBe(0);
    });

    it('very small exit ($2,810 median)', () => {
      // $2,810 × 13.3% = $373.73 → $374
      expect(calcTax(2_810, 13.3, 'decoupled', '2010-2025')).toBe(374);
    });
  });
});
