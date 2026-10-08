/**
 * WCAG 2.x contrast helpers. Used by the design-system screen (live ratios) and by the palette
 * tests that guard the AA threshold on every text / background pair.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function hexToRgb(hex: string): Rgb {
  const trimmed = hex.trim();
  if (!HEX_PATTERN.test(trimmed)) {
    throw new Error(`Invalid hex colour: ${hex}`);
  }
  let digits = trimmed.slice(1);
  if (digits.length === 3) {
    digits = digits
      .split('')
      .map((d) => d + d)
      .join('');
  }
  return {
    r: parseInt(digits.slice(0, 2), 16),
    g: parseInt(digits.slice(2, 4), 16),
    b: parseInt(digits.slice(4, 6), 16),
  };
}

function linearize(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Relative luminance as defined by WCAG (0 = black, 1 = white). */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** Contrast ratio between two colours, from 1 to 21. Order does not matter. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

export const AA_NORMAL_TEXT = 4.5;
export const AA_LARGE_TEXT = 3;

export type ContrastLevel = 'aa' | 'aa-large' | 'fail';

/** Classifies a pair: AA for running text, AA for large text only (18 pt+ or 14 pt bold), or fail. */
export function contrastLevel(foreground: string, background: string): ContrastLevel {
  const ratio = contrastRatio(foreground, background);
  if (ratio >= AA_NORMAL_TEXT) return 'aa';
  if (ratio >= AA_LARGE_TEXT) return 'aa-large';
  return 'fail';
}

export function meetsAA(foreground: string, background: string, largeText = false): boolean {
  return contrastRatio(foreground, background) >= (largeText ? AA_LARGE_TEXT : AA_NORMAL_TEXT);
}

/** Two decimals, with the locale decimal separator. */
export function formatRatio(ratio: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(ratio);
}
