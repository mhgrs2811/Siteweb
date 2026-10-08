import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Wordmark } from '@/components/brand/Wordmark';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Stagger } from '@/components/ui/Stagger';
import { Text } from '@/components/ui/Text';
import { resolveLanguage, type Language } from '@/i18n';
import { devScreensEnabled } from '@/lib/env';
import { usePreferences, type ThemeMode } from '@/store/preferences';
import { useTheme } from '@/theme';

/**
 * Phase 0 landing screen. It will be replaced by the editorial welcome screen of the onboarding
 * in Phase 1; for now it demonstrates the brand, the theme and the language switch.
 */
export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const themeMode = usePreferences((state) => state.themeMode);
  const setThemeMode = usePreferences((state) => state.setThemeMode);
  const language = usePreferences((state) => state.language);
  const setLanguage = usePreferences((state) => state.setLanguage);

  const themeOptions: { value: ThemeMode; label: string }[] = [
    { value: 'system', label: t('theme.system') },
    { value: 'light', label: t('theme.light') },
    { value: 'dark', label: t('theme.dark') },
  ];

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'fr', label: t('language.fr') },
    { value: 'en', label: t('language.en') },
  ];

  return (
    <Screen scroll={false} contentContainerStyle={styles.content}>
      <View style={{ gap: theme.spacing[4] }}>
        <Stagger>
          <Wordmark size="lg" />
          <Text variant="overline" color="accent">
            {t('home.phase')}
          </Text>
          <Text variant="h1">{t('home.title')}</Text>
          <Text variant="body" color="secondary">
            {t('home.body')}
          </Text>
        </Stagger>
      </View>

      <View style={{ gap: theme.spacing[5] }}>
        <View style={{ gap: theme.spacing[2] }}>
          <Text variant="overline" color="secondary">
            {t('home.appearance')}
          </Text>
          <SegmentedControl
            options={themeOptions}
            value={themeMode}
            onChange={setThemeMode}
            accessibilityLabel={t('a11y.themeSelector')}
          />
        </View>
        <View style={{ gap: theme.spacing[2] }}>
          <Text variant="overline" color="secondary">
            {t('home.language')}
          </Text>
          <SegmentedControl
            options={languageOptions}
            value={resolveLanguage(language)}
            onChange={setLanguage}
            accessibilityLabel={t('a11y.languageSelector')}
          />
        </View>
        {devScreensEnabled ? (
          <Button
            label={t('home.openDesignSystem')}
            variant="secondary"
            onPress={() => router.push('/dev/design-system')}
          />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'space-between',
  },
});
