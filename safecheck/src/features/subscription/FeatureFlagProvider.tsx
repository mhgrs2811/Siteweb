import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';

import {
  DEFAULT_FLAGS,
  mergeFlags,
  resolveFeatureAccess,
  type FeatureAccess,
  type FeatureFlag,
  type FeatureKey,
} from '@/core/config/feature-flags';
import { useRepositories } from '@/core/data';
import type { Plan } from '@/domain';
import { useAuth } from '@/features/auth';

interface FeatureFlagContextValue {
  flags: Record<FeatureKey, FeatureFlag>;
  plan: Plan;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue>({ flags: DEFAULT_FLAGS, plan: 'free' });

export function FeatureFlagProvider({ children }: PropsWithChildren) {
  const { featureFlags } = useRepositories();
  const auth = useAuth();
  const plan: Plan = auth.status === 'signed_in' ? auth.profile.plan : 'free';

  const { data: overrides } = useQuery({
    queryKey: ['feature-flags'],
    queryFn: () => featureFlags.fetchOverrides(),
    staleTime: 5 * 60_000,
  });

  const value = useMemo<FeatureFlagContextValue>(
    () => ({ flags: mergeFlags(DEFAULT_FLAGS, overrides ?? {}), plan }),
    [overrides, plan],
  );

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
}

export function useFeatureAccess(key: FeatureKey): FeatureAccess {
  const { flags, plan } = useContext(FeatureFlagContext);
  return resolveFeatureAccess(flags[key], plan);
}

export function useCurrentPlan(): Plan {
  return useContext(FeatureFlagContext).plan;
}
