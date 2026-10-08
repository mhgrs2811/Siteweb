import { Redirect, Stack } from 'expo-router';

import { devScreensEnabled } from '@/lib/env';
import { useTheme } from '@/theme';

/** Developer-only routes. Unreachable in production builds unless explicitly flagged. */
export default function DevLayout() {
  const theme = useTheme();

  if (!devScreensEnabled) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="design-system" />
      <Stack.Screen
        name="sheet"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.55, 0.92],
          sheetInitialDetentIndex: 0,
          sheetGrabberVisible: true,
          sheetCornerRadius: theme.radii.lg,
          contentStyle: { backgroundColor: theme.colors.surface },
        }}
      />
    </Stack>
  );
}
