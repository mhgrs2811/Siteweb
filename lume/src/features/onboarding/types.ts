/**
 * Onboarding domain model. Values are stable identifiers stored in the database; labels live
 * in the locale files under `onboarding.options.*`.
 */

export const AGE_BANDS = [
  'under_16',
  '16_19',
  '20_24',
  '25_29',
  '30_34',
  '35_40',
  'over_40',
] as const;
export type AgeBand = (typeof AGE_BANDS)[number];

export const SKIN_TYPES = ['dry', 'oily', 'combination', 'normal', 'unknown'] as const;
export type SkinType = (typeof SKIN_TYPES)[number];

export const GOALS = [
  'glow',
  'blemishes',
  'texture',
  'spots',
  'wrinkles',
  'pores',
  'redness',
  'hydration',
] as const;
export type Goal = (typeof GOALS)[number];

/** A routine stays readable with at most three goals. */
export const MAX_GOALS = 3;

export const SENSITIVITIES = [
  'fragrance',
  'alcohol',
  'essential_oils',
  'exfoliating_acids',
  'retinoids',
  'none',
] as const;
export type Sensitivity = (typeof SENSITIVITIES)[number];

export const ROUTINE_LEVELS = ['none', 'basic', 'complete'] as const;
export type RoutineLevel = (typeof ROUTINE_LEVELS)[number];

export const MONTHLY_BUDGETS = ['under_20', '20_50', '50_100', 'over_100', 'undisclosed'] as const;
export type MonthlyBudget = (typeof MONTHLY_BUDGETS)[number];

export const SLEEP_OPTIONS = ['under_6', '6_7', '7_8', 'over_8'] as const;
export type Sleep = (typeof SLEEP_OPTIONS)[number];

export const WATER_OPTIONS = ['under_1', '1_2', 'over_2'] as const;
export type Water = (typeof WATER_OPTIONS)[number];

export const SUN_OPTIONS = ['rarely', 'sometimes', 'often'] as const;
export type Sun = (typeof SUN_OPTIONS)[number];

export interface Lifestyle {
  sleep: Sleep | null;
  water: Water | null;
  sun: Sun | null;
  makeup: boolean | null;
}

/** Bump when the consent wording changes: a new version asks for consent again. */
export const PHOTO_CONSENT_VERSION = '2026-10-v1';

export interface PhotoConsent {
  acceptedAt: string | null;
  version: string | null;
  keepPhotos: boolean;
}

export interface OnboardingAnswers {
  firstName: string;
  ageBand: AgeBand | null;
  skinType: SkinType | null;
  goals: Goal[];
  sensitivities: Sensitivity[];
  routineLevel: RoutineLevel | null;
  monthlyBudget: MonthlyBudget | null;
  lifestyle: Lifestyle;
  photoConsent: PhotoConsent;
  notificationsOptIn: boolean | null;
}

export const EMPTY_ANSWERS: OnboardingAnswers = {
  firstName: '',
  ageBand: null,
  skinType: null,
  goals: [],
  sensitivities: [],
  routineLevel: null,
  monthlyBudget: null,
  lifestyle: { sleep: null, water: null, sun: null, makeup: null },
  photoConsent: { acceptedAt: null, version: null, keepPhotos: true },
  notificationsOptIn: null,
};

export type OnboardingStatus = 'not_started' | 'in_progress' | 'blocked_age' | 'completed';
