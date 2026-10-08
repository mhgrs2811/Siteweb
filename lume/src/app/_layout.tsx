import {
  Fraunces_400Regular,
  Fraunces_400Regular_Italic,
  Fraunces_500Medium,
} from '@expo-google-fonts/fraunces';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { detectDeviceLanguage, initI18n, resolveLanguage } from '@/i18n';
import { createQueryClient } from '@/lib/query-client';
import { loadSkiaWeb } from '@/lib/skia-web';
import { usePreferences } from '@/store/preferences';
import { ThemeProvider, useTheme } from '@/theme';

// Translations are bundled, so i18n is ready synchronously before the first render.
initI18n(detectDeviceLanguage());

// Keep the native splash screen up until fonts, preferences and (on web) Skia are ready.
SplashScreen.preventAutoHideAsync().catch(() => {
  /* already hidden or unavailable (web): nothing to do */
});
SplashScreen.setOptions({ duration: 400, fade: true });

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Fraunces_400Regular,
    Fraunces_400Regular_Italic,
    Fraunces_500Medium,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const hasHydrated = usePreferences((state) => state.hasHydrated);
  const language = usePreferences((state) => state.language);
  const [skiaReady, setSkiaReady] = useState(Platform.OS !== 'web');
  const [queryClient] = useState(createQueryClient);

  // Apply the persisted language before children render, so no screen flashes in the wrong one.
  initI18n(resolveLanguage(language));

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    loadSkiaWeb()
      .catch(() => {
        /* the ring degrades to its placeholder; everything else keeps working */
      })
      .finally(() => setSkiaReady(true));
  }, []);

  const ready = (fontsLoaded || fontError !== null) && hasHydrated && skiaReady;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {
        /* nothing to hide */
      });
    }
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const theme = useTheme();

  useEffect(() => {
    // Root view colour behind every screen: avoids a white flash when switching themes.
    SystemUI.setBackgroundColorAsync(theme.colors.background).catch(() => {
      /* unsupported platform */
    });
  }, [theme.colors.background]);

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="dev" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
