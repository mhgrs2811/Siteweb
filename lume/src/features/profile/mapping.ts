import type { Language } from '@/i18n';
import type {
  ProfileInsert,
  ProfileRow,
  SkinProfileInsert,
  SkinProfileRow,
} from '@/lib/database.types';

import {
  AGE_BANDS,
  GOALS,
  MONTHLY_BUDGETS,
  ROUTINE_LEVELS,
  SENSITIVITIES,
  SKIN_TYPES,
  SLEEP_OPTIONS,
  SUN_OPTIONS,
  WATER_OPTIONS,
  type AgeBand,
  type Goal,
  type Lifestyle,
  type MonthlyBudget,
  type OnboardingAnswers,
  type RoutineLevel,
  type Sensitivity,
  type SkinType,
  type Sleep,
  type Sun,
  type Water,
} from '../onboarding/types';

export interface ProfileMeta {
  userId: string;
  locale: Language;
  completedAt: string | null;
}

/** Local answers → `profiles` row. */
export function toProfileRow(answers: OnboardingAnswers, meta: ProfileMeta): ProfileInsert {
  if (!answers.ageBand) throw new Error('ageBand is required to build a profile row');
  return {
    id: meta.userId,
    first_name: answers.firstName,
    age_band: answers.ageBand,
    locale: meta.locale,
    photo_consent_at: answers.photoConsent.acceptedAt,
    photo_consent_version: answers.photoConsent.version,
    keep_photos: answers.photoConsent.keepPhotos,
    notifications_opt_in: answers.notificationsOptIn ?? false,
    onboarding_completed_at: meta.completedAt,
  };
}

/** Local answers → `skin_profiles` row. */
export function toSkinProfileRow(answers: OnboardingAnswers, userId: string): SkinProfileInsert {
  if (!answers.skinType) throw new Error('skinType is required to build a skin profile row');
  if (!answers.routineLevel)
    throw new Error('routineLevel is required to build a skin profile row');
  return {
    user_id: userId,
    skin_type: answers.skinType,
    goals: [...answers.goals],
    sensitivities: [...answers.sensitivities],
    routine_level: answers.routineLevel,
    monthly_budget: answers.monthlyBudget,
    lifestyle: {
      sleep: answers.lifestyle.sleep,
      water: answers.lifestyle.water,
      sun: answers.lifestyle.sun,
      makeup: answers.lifestyle.makeup,
    },
  };
}

function oneOf<T extends string>(values: readonly T[], value: unknown): T | null {
  return typeof value === 'string' && (values as readonly string[]).includes(value)
    ? (value as T)
    : null;
}

function manyOf<T extends string>(values: readonly T[], list: unknown): T[] {
  if (!Array.isArray(list)) return [];
  return list.flatMap((item) => {
    const match = oneOf(values, item);
    return match ? [match] : [];
  });
}

function readLifestyle(raw: unknown): Lifestyle {
  const source =
    raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  return {
    sleep: oneOf<Sleep>(SLEEP_OPTIONS, source.sleep),
    water: oneOf<Water>(WATER_OPTIONS, source.water),
    sun: oneOf<Sun>(SUN_OPTIONS, source.sun),
    makeup: typeof source.makeup === 'boolean' ? source.makeup : null,
  };
}

/**
 * Server rows → local answers. Unknown values (from a newer app version, or a manual edit in
 * the dashboard) degrade to "unanswered" instead of crashing the app.
 */
export function fromRows(profile: ProfileRow, skin: SkinProfileRow | null): OnboardingAnswers {
  return {
    firstName: profile.first_name,
    ageBand: oneOf<AgeBand>(AGE_BANDS, profile.age_band),
    skinType: skin ? oneOf<SkinType>(SKIN_TYPES, skin.skin_type) : null,
    goals: skin ? manyOf<Goal>(GOALS, skin.goals) : [],
    sensitivities: skin ? manyOf<Sensitivity>(SENSITIVITIES, skin.sensitivities) : [],
    routineLevel: skin ? oneOf<RoutineLevel>(ROUTINE_LEVELS, skin.routine_level) : null,
    monthlyBudget: skin ? oneOf<MonthlyBudget>(MONTHLY_BUDGETS, skin.monthly_budget) : null,
    lifestyle: readLifestyle(skin?.lifestyle),
    photoConsent: {
      acceptedAt: profile.photo_consent_at,
      version: profile.photo_consent_version,
      keepPhotos: profile.keep_photos,
    },
    notificationsOptIn: profile.notifications_opt_in,
  };
}
