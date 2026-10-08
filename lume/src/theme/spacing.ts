/** 4 pt base grid. Use the scale, never arbitrary pixel values. */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export type SpacingKey = keyof typeof spacing;

export const layout = {
  /** Horizontal page margin on phones. */
  gutter: 20,
  /** Horizontal page margin from 430 pt wide screens upward. */
  gutterWide: 24,
  /** Readable width cap for text-heavy screens on large devices. */
  maxContentWidth: 560,
  /** Minimum touch target (Apple HIG and Material agree on 44 / 48). */
  minTouchTarget: 44,
  /** Width above which `gutterWide` applies. */
  wideBreakpoint: 430,
} as const;

export const radii = {
  xs: 4,
  md: 12,
  lg: 24,
  pill: 999,
} as const;

export type RadiusKey = keyof typeof radii;
