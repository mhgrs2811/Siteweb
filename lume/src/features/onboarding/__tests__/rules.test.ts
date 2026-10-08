import { goalsRemaining, isUnderage, toggleGoal, toggleSensitivity } from '../rules';
import {
  canContinue,
  furthestOf,
  isValidFirstName,
  nextStep,
  normalizeFirstName,
  previousStep,
  stepNumber,
  stepProgress,
  TOTAL_STEPS,
} from '../steps';
import { EMPTY_ANSWERS, MAX_GOALS, type OnboardingAnswers } from '../types';

describe('age gate', () => {
  it('blocks only the under-16 band', () => {
    expect(isUnderage('under_16')).toBe(true);
    expect(isUnderage('16_19')).toBe(false);
    expect(isUnderage(null)).toBe(false);
  });
});

describe('goals', () => {
  it('adds and removes a goal', () => {
    expect(toggleGoal([], 'glow')).toEqual(['glow']);
    expect(toggleGoal(['glow'], 'glow')).toEqual([]);
  });

  it('ignores a fourth goal instead of replacing one', () => {
    const three = toggleGoal(toggleGoal(toggleGoal([], 'glow'), 'pores'), 'hydration');
    expect(three).toHaveLength(MAX_GOALS);
    expect(toggleGoal(three, 'texture')).toEqual(three);
    expect(goalsRemaining(three)).toBe(0);
  });

  it('never mutates its input', () => {
    const goals = ['glow'] as const;
    toggleGoal(goals, 'pores');
    expect(goals).toEqual(['glow']);
  });
});

describe('sensitivities', () => {
  it('makes "none" exclusive in both directions', () => {
    expect(toggleSensitivity(['fragrance', 'alcohol'], 'none')).toEqual(['none']);
    expect(toggleSensitivity(['none'], 'fragrance')).toEqual(['fragrance']);
  });

  it('toggles a regular sensitivity', () => {
    expect(toggleSensitivity(['fragrance'], 'alcohol')).toEqual(['fragrance', 'alcohol']);
    expect(toggleSensitivity(['fragrance', 'alcohol'], 'alcohol')).toEqual(['fragrance']);
    expect(toggleSensitivity(['none'], 'none')).toEqual([]);
  });
});

describe('first name', () => {
  it('normalises whitespace and bounds the length', () => {
    expect(normalizeFirstName('  Léa   Marie ')).toBe('Léa Marie');
    expect(isValidFirstName('   ')).toBe(false);
    expect(isValidFirstName('L')).toBe(true);
    expect(isValidFirstName('a'.repeat(41))).toBe(false);
  });
});

describe('steps', () => {
  it('walks forward and backward in order', () => {
    expect(nextStep('welcome')).toBe('name');
    expect(previousStep('name')).toBe('welcome');
    expect(previousStep('welcome')).toBeNull();
    expect(nextStep('capture-guide')).toBeNull();
  });

  it('numbers steps from 1 to the total and maps progress from 0 to 1', () => {
    expect(stepNumber('welcome')).toBe(1);
    expect(stepNumber('capture-guide')).toBe(TOTAL_STEPS);
    expect(stepProgress('welcome')).toBe(0);
    expect(stepProgress('capture-guide')).toBe(1);
  });

  it('remembers the furthest step reached', () => {
    expect(furthestOf(null, 'age')).toBe('age');
    expect(furthestOf('goals', 'age')).toBe('goals');
    expect(furthestOf('age', 'goals')).toBe('goals');
  });
});

describe('canContinue', () => {
  const complete: OnboardingAnswers = {
    firstName: 'Léa',
    ageBand: '25_29',
    skinType: 'combination',
    goals: ['glow'],
    sensitivities: ['none'],
    routineLevel: 'basic',
    monthlyBudget: '20_50',
    lifestyle: { sleep: '7_8', water: '1_2', sun: 'sometimes', makeup: false },
    photoConsent: { acceptedAt: '2026-10-08T10:00:00.000Z', version: 'v', keepPhotos: true },
    notificationsOptIn: true,
  };

  it('gates each answered step on its answer', () => {
    expect(canContinue('name', EMPTY_ANSWERS)).toBe(false);
    expect(canContinue('name', complete)).toBe(true);
    expect(canContinue('age', EMPTY_ANSWERS)).toBe(false);
    expect(canContinue('skin-type', EMPTY_ANSWERS)).toBe(false);
    expect(canContinue('goals', EMPTY_ANSWERS)).toBe(false);
    expect(canContinue('sensitivities', EMPTY_ANSWERS)).toBe(false);
    expect(canContinue('routine', { ...complete, monthlyBudget: null })).toBe(false);
    expect(
      canContinue('lifestyle', { ...complete, lifestyle: { ...complete.lifestyle, makeup: null } }),
    ).toBe(false);
    expect(canContinue('consent', EMPTY_ANSWERS)).toBe(false);
    expect(canContinue('consent', complete)).toBe(true);
  });

  it('lets informational steps through', () => {
    expect(canContinue('welcome', EMPTY_ANSWERS)).toBe(true);
    expect(canContinue('proof', EMPTY_ANSWERS)).toBe(true);
    expect(canContinue('notifications', EMPTY_ANSWERS)).toBe(true);
    expect(canContinue('capture-guide', EMPTY_ANSWERS)).toBe(true);
  });
});
