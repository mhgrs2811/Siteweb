import { Stack } from 'expo-router';

import { useTheme } from '@/theme';

/** The onboarding flow: one route per step, pushed from left to right, no native header. */
export default function OnboardingLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}
