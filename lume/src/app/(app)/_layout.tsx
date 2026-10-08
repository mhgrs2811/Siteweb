import { Stack } from 'expo-router';

import { useTheme } from '@/theme';

/** Screens available once the onboarding is complete. Tabs arrive in Phase 4. */
export default function AppLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}
