/**
 * Game Rules, Elimination Schedules, and Banker Math for Dlilek Mlak
 */

// Custom preset schedules for standard game sizes (summing to N - 2, leaving 2 for final swap)
export const PRESET_SCHEDULES: Record<number, number[]> = {
  4: [1, 1], // 2 to open -> 2 remain
  6: [2, 1, 1], // 4 to open
  9: [3, 2, 1, 1], // 7 to open
  12: [4, 3, 2, 1], // 10 to open
  16: [5, 4, 3, 1, 1], // 14 to open
  20: [5, 4, 3, 2, 2, 1, 1], // 18 to open
  24: [6, 5, 4, 3, 2, 1, 1], // 22 to open (Classic Dlilek Mlak style)
  26: [6, 5, 4, 3, 2, 2, 1, 1], // 24 to open (Deal or No Deal classic)
};

/**
 * Auto-computes an elimination schedule for any N (4 to 30)
 * Guarantees that the sum of rounds is exactly N - 2 (leaving 2 chests for final swap)
 */
export function getRoundSchedule(totalChests: number): number[] {
  if (PRESET_SCHEDULES[totalChests]) {
    return [...PRESET_SCHEDULES[totalChests]];
  }

  const targetEliminations = Math.max(1, totalChests - 2);
  const schedule: number[] = [];
  let remaining = targetEliminations;

  // Start with roughly 25-30% of remaining chests in first round, tapering down
  let step = Math.min(6, Math.max(2, Math.floor(totalChests / 4)));

  while (remaining > 0) {
    if (remaining <= step) {
      schedule.push(remaining);
      break;
    }
    schedule.push(step);
    remaining -= step;
    // Taper down the openings
    if (step > 1) {
      step = Math.max(1, Math.floor(step * 0.75));
    }
  }

  return schedule;
}

/**
 * Tension multipliers that gradually increase as fewer chests remain.
 * Banker lowballs contestants in early rounds and gets closer to true EV near the climax.
 */
export const BASE_TENSION_MULTIPLIERS = [
  0.32, // Round 1: 32% of EV
  0.45, // Round 2: 45% of EV
  0.58, // Round 3: 58% of EV
  0.70, // Round 4: 70% of EV
  0.80, // Round 5: 80% of EV
  0.88, // Round 6: 88% of EV
  0.94, // Round 7: 94% of EV
  0.98, // Round 8+: 98% of EV
];

/**
 * Calculates the Banker's offer based on unopened chests
 * @param unopenedValues Numeric values of all unopened chests (including contestant's box)
 * @param roundIndex 0-indexed round number
 * @param totalRounds Total number of rounds in schedule
 */
export function calculateBankerOffer(
  unopenedValues: number[],
  roundIndex: number,
  totalRounds: number
): number {
  if (unopenedValues.length === 0) return 0;

  // Calculate arithmetic mean
  const sum = unopenedValues.reduce((acc, val) => acc + val, 0);
  const average = sum / unopenedValues.length;

  // Get tension multiplier
  let multiplier: number;
  if (roundIndex < BASE_TENSION_MULTIPLIERS.length) {
    multiplier = BASE_TENSION_MULTIPLIERS[roundIndex];
  } else {
    // Dynamic fallback based on progress
    const progress = Math.min(1, roundIndex / Math.max(1, totalRounds - 1));
    multiplier = 0.35 + 0.60 * Math.pow(progress, 1.1);
  }

  const rawOffer = average * multiplier;

  // Round to a clean TV-friendly number
  return formatBankerOfferNumber(rawOffer);
}

/**
 * Rounds numbers cleanly (e.g. 4371 -> 4400 or 4500, 23.4 -> 25)
 */
export function formatBankerOfferNumber(val: number): number {
  if (val <= 0) return 0;
  if (val < 10) return Math.round(val * 10) / 10;
  if (val < 100) return Math.round(val);
  if (val < 1000) return Math.round(val / 10) * 10;
  if (val < 10000) return Math.round(val / 50) * 50;
  if (val < 100000) return Math.round(val / 100) * 100;
  return Math.round(val / 500) * 500;
}

/**
 * Smart regex parser that extracts numeric values from prize strings
 * Handles Arabic & French formats:
 * - "5000 دينار" -> 5000
 * - "0.5 DT" -> 0.5
 * - "10 ملاين" -> 10000
 * - "100.000 د.ت" -> 100000
 * - "25000" -> 25000
 * - "صفر" -> 0
 */
export function parsePrizeNumericValue(label: string): number | null {
  if (!label || typeof label !== 'string') return null;

  const trimmed = label.trim();

  // If label contains parenthesized expression with numbers (e.g. "iPhone 16 Pro (4,500 د.ت)"),
  // prioritize extracting the parenthesized amount as the actual prize value.
  const parenMatches = trimmed.matchAll(/\(([^)]+)\)/g);
  for (const match of parenMatches) {
    const inner = match[1].trim();
    if (inner && inner !== trimmed) {
      const innerVal = parsePrizeNumericValue(inner);
      if (innerVal !== null) {
        return innerVal;
      }
    }
  }

  // Gag prizes mapping matching official game value rankings
  if (/مخد/i.test(trimmed)) return 2;
  if (/فريت/i.test(trimmed)) return 75;
  if (/دجاج|فخذ/i.test(trimmed)) return 750;
  if (/كردون/i.test(trimmed)) return 0;
  if (/دبوز/i.test(trimmed)) return 0.5;

  // Explicit zeros
  if (/^(صفر|لاشيء|0|zero|rien)$/i.test(trimmed)) {
    return 0;
  }

  // Check for "ملاين" or "مليون" (Millions in Tunisian slang, e.g., 10 ملاين = 10,000 DT)
  const millionMatch = trimmed.match(/(\d+(?:[.,]\d+)?)\s*(?:ملاين|ملايين|مليون)/i);
  if (millionMatch) {
    const num = parseFloat(millionMatch[1].replace(',', '.'));
    return num * 1000;
  }

  // Strip currency words
  const stripped = trimmed.replace(/[دdtDT\.ت\s]/g, (m) => m === '.' ? '.' : '').trim();

  // Multi-dot format (e.g. 1.000.000 -> 1000000, 2.000.000 -> 2000000)
  if ((trimmed.match(/\./g) || []).length >= 2) {
    const numOnly = trimmed.replace(/[^\d]/g, '');
    const val = parseFloat(numOnly);
    if (!isNaN(val)) return val;
  }

  // Thousand dot format (e.g. 1.000 -> 1000, 5.000 -> 5000, 10.000 -> 10000, 300.000 -> 300000)
  const thousandDotMatch = trimmed.match(/(\d+)\.000(?:\s*د)?/);
  if (thousandDotMatch) {
    const base = parseFloat(thousandDotMatch[1]);
    if (!isNaN(base)) return base * 1000;
  }

  // Decimal dot format (e.g. 0.1 or 0.5)
  const decimalMatch = trimmed.match(/0\.\d+/);
  if (decimalMatch) {
    const dec = parseFloat(decimalMatch[0]);
    if (!isNaN(dec)) return dec;
  }

  // Look for number with explicit currency marker if there's any (e.g. "Car 2024 - 35,000 DT")
  const currencyMatch = trimmed.match(/(\d[\d,.]*)\s*(?:د\.ت|دنانير|دينار|DT|dt)\b/i)
    || trimmed.match(/(?:د\.ت|دنانير|دينار|DT|dt)\s*(\d[\d,.]*)/i);
  if (currencyMatch && currencyMatch[1] && currencyMatch[1] !== trimmed) {
    const candidate = parsePrizeNumericValue(currencyMatch[1]);
    if (candidate !== null) return candidate;
  }

  // Clean numbers
  const cleaned = stripped.replace(/,/g, '');
  const match = cleaned.match(/(\d+(?:\.\d+)?)/);
  if (match) {
    const parsed = parseFloat(match[1]);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
}

/**
 * Format currency display string with Dinars symbol
 */
export function formatPrizeDisplay(label: string, numericValue: number | null): string {
  if (numericValue !== null && !isNaN(numericValue)) {
    // If label is purely digits, format nicely
    if (/^\d+(\.\d+)?$/.test(label.trim())) {
      return `${numericValue.toLocaleString()} DT`;
    }
  }
  return label;
}
