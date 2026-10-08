import type { OnboardingAnswers } from './types';

/** Ordered onboarding steps. The route of each step is `/(onboarding)/<id>`. */
export const ONBOARDING_STEPS = [
  'welcome',
  'name',
  'age',
  'skin-type',
  'goals',
  'sensitivities',
  'routine',
  'lifestyle',
  'proof',
  'consent',
  'notifications',
  'capture-guide',
] as const;

export type StepId = (typeof ONBOARDING_STEPS)[number];

export const TOTAL_STEPS = ONBOARDING_STEPS.length;

export function stepIndex(step: StepId): number {
  return ONBOARDING_STEPS.indexOf(step);
}

/** 1-based position shown to the user ("3 / 12"). */
export function stepNumber(step: StepId): number {
  return stepIndex(step) + 1;
}

/** Progress of the thin bar, from 0 (welcome) to 1 (last step). */
export function stepProgress(step: StepId): number {
  return stepIndex(step) / (TOTAL_STEPS - 1);
}

export function nextStep(step: StepId): StepId | null {
  const index = stepIndex(step);
  return ONBOARDING_STEPS[index + 1] ?? null;
}

export function previousStep(step: StepId): StepId | null {
  const index = stepIndex(step);
  return index > 0 ? (ONBOARDING_STEPS[index - 1] ?? null) : null;
}

/** The later of two steps, used to remember how far the user has gone. */
export function furthestOf(a: StepId | null, b: StepId): StepId {
  if (!a) return b;
  return stepIndex(a) >= stepIndex(b) ? a : b;
}

/** Steps the user may skip without answering. */
export const SKIPPABLE_STEPS: readonly StepId[] = ['consent', 'notifications'];

/**
 * Whether the primary action of a step is enabled, from the answers collected so far.
 * Pure, so screens stay thin and the rule is unit-tested.
 */
export function canContinue(step: StepId, answers: OnboardingAnswers): boolean {
  switch (step) {
    case 'welcome':
    case 'proof':
    case 'capture-guide':
    case 'notifications':
      return true;
    case 'name':
      return isValidFirstName(answers.firstName);
    case 'age':
      return answers.ageBand !== null;
    case 'skin-type':
      return answers.skinType !== null;
    case 'goals':
      return answers.goals.length > 0;
    case 'sensitivities':
      return answers.sensitivities.length > 0;
    case 'routine':
      return answers.routineLevel !== null && answers.monthlyBudget !== null;
    case 'lifestyle': {
      const { sleep, water, sun, makeup } = answers.lifestyle;
      return sleep !== null && water !== null && sun !== null && makeup !== null;
    }
    case 'consent':
      return answers.photoConsent.acceptedAt !== null;
  }
}

export const FIRST_NAME_MAX_LENGTH = 40;

export function normalizeFirstName(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function isValidFirstName(value: string): boolean {
  const normalized = normalizeFirstName(value);
  return normalized.length >= 1 && normalized.length <= FIRST_NAME_MAX_LENGTH;
}
