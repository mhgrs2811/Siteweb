import { Redirect } from 'expo-router';

import { useOnboarding } from '@/features/onboarding/store';

/**
 * Entry switch. The root layout waits for the persisted onboarding state before rendering,
 * so the right screen opens first, without a flash of the welcome screen.
 */
export default function Index() {
  const status = useOnboarding((state) => state.status);

  if (status === 'completed') return <Redirect href="/(app)/home" />;
  if (status === 'blocked_age') return <Redirect href="/(onboarding)/too-young" />;
  return <Redirect href="/(onboarding)/welcome" />;
}
