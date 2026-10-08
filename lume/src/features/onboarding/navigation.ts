import { useRouter, type Href } from 'expo-router';
import { useCallback } from 'react';

import { track } from '@/lib/analytics';

import { nextStep, stepIndex, type StepId } from './steps';

export function routeFor(step: StepId): Href {
  return `/(onboarding)/${step}` as Href;
}

/** Forward navigation shared by every onboarding screen: tracks the step, then pushes the next. */
export function useOnboardingNavigation(step: StepId) {
  const router = useRouter();

  const goNext = useCallback(() => {
    track({ name: 'onboarding_step_completed', props: { index: stepIndex(step), step } });
    const next = nextStep(step);
    if (next) router.push(routeFor(next));
  }, [router, step]);

  return { goNext, router };
}
