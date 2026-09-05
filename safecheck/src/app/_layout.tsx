import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DataProvider } from '@/core/data/DataProvider';
import { initI18n } from '@/core/i18n';
import { ThemeProvider, useTheme } from '@/core/theme';
import { AuthProvider } from '@/features/auth';
import { FeatureFlagProvider } from '@/features/subscription';

initI18n();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <DataProvider>
            <AuthProvider>
              <FeatureFlagProvider>
                <RootStack />
              </FeatureFlagProvider>
            </AuthProvider>
          </DataProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootStack() {
  const { t } = useTranslation();
  const { colors, scheme, typography } = useTheme();
  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { ...typography.heading, color: colors.text },
          headerBackButtonDisplayMode: 'minimal',
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="check/[kind]/[value]" options={{ title: t('result.title') }} />
        <Stack.Screen name="report/new" options={{ title: t('report.title'), presentation: 'modal' }} />
        <Stack.Screen name="alert/[id]" options={{ title: '' }} />
        <Stack.Screen name="learn/[slug]" options={{ title: '' }} />
        <Stack.Screen name="auth/sign-in" options={{ title: t('auth.title'), presentation: 'modal' }} />
        <Stack.Screen name="account" options={{ title: t('account.title') }} />
      </Stack>
    </>
  );
}
