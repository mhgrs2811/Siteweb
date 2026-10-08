import type { IconName } from '@/components/ui/Icon';

import type { Goal, RoutineLevel, Sensitivity, SkinType } from './types';

/** One icon per answer card, from the curated Phosphor set. */
export const GOAL_ICONS: Record<Goal, IconName> = {
  glow: 'sparkle',
  blemishes: 'target',
  texture: 'waves',
  spots: 'circlesThree',
  wrinkles: 'waveSine',
  pores: 'scan',
  redness: 'sunHorizon',
  hydration: 'drop',
};

export const SKIN_TYPE_ICONS: Record<SkinType, IconName> = {
  dry: 'feather',
  oily: 'drop',
  combination: 'circlesThree',
  normal: 'checkCircle',
  unknown: 'info',
};

export const SENSITIVITY_ICONS: Record<Sensitivity, IconName> = {
  fragrance: 'leaf',
  alcohol: 'drop',
  essential_oils: 'leaf',
  exfoliating_acids: 'sparkle',
  retinoids: 'moon',
  none: 'checkCircle',
};

export const ROUTINE_LEVEL_ICONS: Record<RoutineLevel, IconName> = {
  none: 'feather',
  basic: 'drop',
  complete: 'listChecks',
};
