import { DEFAULT_FLAGS, mergeFlags, resolveFeatureAccess } from '../feature-flags';

describe('feature flags', () => {
  it('une fonctionnalité gratuite activée est disponible pour tous', () => {
    expect(resolveFeatureAccess(DEFAULT_FLAGS['check.basic'], 'free')).toBe('available');
  });
  it('une fonctionnalité premium demande une mise à niveau en plan gratuit', () => {
    expect(resolveFeatureAccess(DEFAULT_FLAGS['check.detailed_reports'], 'free')).toBe('upgrade_required');
    expect(resolveFeatureAccess(DEFAULT_FLAGS['check.detailed_reports'], 'premium')).toBe('available');
  });
  it('un kill-switch prime sur le plan', () => {
    expect(resolveFeatureAccess(DEFAULT_FLAGS['protection.proactive'], 'business')).toBe('disabled');
  });
  it('les surcharges distantes fusionnent champ par champ', () => {
    const merged = mergeFlags(DEFAULT_FLAGS, { 'alerts.push': { enabled: true } });
    expect(merged['alerts.push']).toEqual({ enabled: true, minPlan: 'premium' });
    expect(merged['check.basic']).toEqual(DEFAULT_FLAGS['check.basic']);
  });
});
