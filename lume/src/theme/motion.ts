import type { WithSpringConfig } from 'react-native-reanimated';

/**
 * Motion tokens. Three named springs cover every animation in the app, so movement feels
 * consistent: `gentle` for things appearing, `snappy` for direct manipulation feedback,
 * `bouncy` for celebrations only.
 */
export const springs = {
  gentle: { damping: 18, stiffness: 160, mass: 1 },
  snappy: { damping: 20, stiffness: 320, mass: 0.9 },
  bouncy: { damping: 12, stiffness: 200, mass: 1 },
} as const satisfies Record<string, WithSpringConfig>;

export type SpringName = keyof typeof springs;

export const durations = {
  fast: 160,
  base: 240,
  slow: 400,
  /** Minimum on-screen time of the "analysis in progress" moment (Phase 2). */
  analysisMinimum: 6500,
} as const;

export const motion = {
  springs,
  durations,
  /** Delay between two staggered list items. */
  staggerMs: 40,
  /** Scale applied to a pressed button. */
  pressScale: 0.97,
  /** Opacity of a pressed ghost control. */
  pressOpacity: 0.72,
} as const;
