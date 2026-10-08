import { MAX_GOALS, type AgeBand, type Goal, type Sensitivity } from './types';

/** Lumé is for ages 16 and up (PRD, section 2). */
export function isUnderage(ageBand: AgeBand | null): boolean {
  return ageBand === 'under_16';
}

/**
 * Toggles a goal. Adding beyond the limit is ignored rather than replacing the oldest choice,
 * so the user has to deselect deliberately.
 */
export function toggleGoal(goals: readonly Goal[], goal: Goal): Goal[] {
  if (goals.includes(goal)) return goals.filter((g) => g !== goal);
  if (goals.length >= MAX_GOALS) return [...goals];
  return [...goals, goal];
}

export function goalsRemaining(goals: readonly Goal[]): number {
  return Math.max(0, MAX_GOALS - goals.length);
}

/** "None" is exclusive: choosing it clears the others, choosing another clears "none". */
export function toggleSensitivity(
  sensitivities: readonly Sensitivity[],
  sensitivity: Sensitivity,
): Sensitivity[] {
  if (sensitivities.includes(sensitivity)) {
    return sensitivities.filter((s) => s !== sensitivity);
  }
  if (sensitivity === 'none') return ['none'];
  return [...sensitivities.filter((s) => s !== 'none'), sensitivity];
}
