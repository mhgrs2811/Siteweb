import type { Plan } from '@/domain';

/**
 * Feature flags.
 *
 * Deux dimensions indépendantes :
 *  - `enabled`  : la fonctionnalité est-elle déployée (kill-switch, rollout progressif) ?
 *  - `minPlan`  : quel abonnement minimum y donne accès (freemium) ?
 *
 * Les valeurs par défaut vivent ici ; elles peuvent être surchargées à distance
 * (table `feature_flags` côté Supabase) sans nouvelle release.
 */
export const FEATURE_KEYS = [
  'check.basic',
  'check.history',
  'check.detailed_reports',
  'report.create',
  'alerts.feed',
  'alerts.push',
  'learn.articles',
  'protection.proactive',
  'family.sharing',
  'business.api',
] as const;

export type FeatureKey = (typeof FEATURE_KEYS)[number];

export interface FeatureFlag {
  enabled: boolean;
  minPlan: Plan;
}

const PLAN_RANK: Record<Plan, number> = { free: 0, premium: 1, family: 2, business: 3 };

export const DEFAULT_FLAGS: Record<FeatureKey, FeatureFlag> = {
  'check.basic': { enabled: true, minPlan: 'free' },
  'check.history': { enabled: true, minPlan: 'free' },
  'check.detailed_reports': { enabled: true, minPlan: 'premium' },
  'report.create': { enabled: true, minPlan: 'free' },
  'alerts.feed': { enabled: true, minPlan: 'free' },
  'alerts.push': { enabled: false, minPlan: 'premium' },
  'learn.articles': { enabled: true, minPlan: 'free' },
  'protection.proactive': { enabled: false, minPlan: 'premium' },
  'family.sharing': { enabled: false, minPlan: 'family' },
  'business.api': { enabled: false, minPlan: 'business' },
};

export type FeatureAccess = 'available' | 'upgrade_required' | 'disabled';

export function resolveFeatureAccess(
  flag: FeatureFlag | undefined,
  plan: Plan,
): FeatureAccess {
  if (!flag || !flag.enabled) return 'disabled';
  return PLAN_RANK[plan] >= PLAN_RANK[flag.minPlan] ? 'available' : 'upgrade_required';
}

export function mergeFlags(
  defaults: Record<FeatureKey, FeatureFlag>,
  overrides: Partial<Record<FeatureKey, Partial<FeatureFlag>>>,
): Record<FeatureKey, FeatureFlag> {
  const merged = { ...defaults };
  for (const key of FEATURE_KEYS) {
    const o = overrides[key];
    if (o) merged[key] = { ...defaults[key], ...o };
  }
  return merged;
}
