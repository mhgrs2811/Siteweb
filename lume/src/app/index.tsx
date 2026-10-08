import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Wordmark } from '@/components/brand/Wordmark';
import { Aura } from '@/components/signature/Aura';
import { ScoreRing } from '@/components/signature/ScoreRing';
import { Button } from '@/components/ui/Button';
import { Gauge } from '@/components/ui/Gauge';
import { Headline } from '@/components/ui/Headline';
import { ListRow } from '@/components/ui/ListRow';
import { Screen, useGutter } from '@/components/ui/Screen';
import { Stagger } from '@/components/ui/Stagger';
import { Surface } from '@/components/ui/Surface';
import { Text } from '@/components/ui/Text';
import { resolveLanguage } from '@/i18n';
import { devScreensEnabled } from '@/lib/env';
import { usePreferences } from '@/store/preferences';
import { useTheme } from '@/theme';

const PREVIEW = {
  score: 72,
  indicators: [
    { key: 'texture', value: 68 },
    { key: 'glow', value: 61 },
    { key: 'hydration', value: 79 },
  ] as const,
};

/**
 * Editorial welcome screen. In Phase 1 the call to action starts the onboarding; until then it
 * opens a sheet describing what comes next.
 */
export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const gutter = useGutter();
  const { width } = useWindowDimensions();
  const themeMode = usePreferences((state) => state.themeMode);
  const language = usePreferences((state) => state.language);

  // Tall enough to breathe, short enough to keep the call to action within the first screen.
  const heroHeight = Math.round(Math.min(width * 0.86, 360));

  return (
    <Screen padded={false} safeTop={false}>
      <View style={{ height: heroHeight }}>
        <Aura width={width} height={heroHeight} />
        <View
          style={[
            StyleSheet.absoluteFill,
            { paddingTop: insets.top + 14, paddingHorizontal: gutter },
          ]}
        >
          <Wordmark size="md" />
        </View>
      </View>

      <View
        style={{ paddingHorizontal: gutter, marginTop: -theme.spacing[10], gap: theme.spacing[5] }}
      >
        <Stagger>
          <Text variant="overline" color="accent">
            {t('home.kicker')}
          </Text>
          <Headline text={t('home.headline')} />
          <Text variant="body" color="secondary" style={styles.lede}>
            {t('home.body')}
          </Text>
        </Stagger>

        <Surface variant="elevated" radius="lg" padding={5} style={{ marginTop: theme.spacing[2] }}>
          <View style={styles.previewRow}>
            <ScoreRing score={PREVIEW.score} size={116} strokeWidth={8} hapticOnSettle={false} />
            <View style={styles.previewTexts}>
              <Text variant="overline" color="secondary">
                {t('home.preview.label')}
              </Text>
              <Text variant="h2">{t('home.preview.verdict')}</Text>
              <View style={{ gap: theme.spacing[2], marginTop: theme.spacing[1] }}>
                {PREVIEW.indicators.map((indicator) => (
                  <Gauge
                    key={indicator.key}
                    label={t(`indicators.${indicator.key}`)}
                    value={indicator.value}
                  />
                ))}
              </View>
            </View>
          </View>
        </Surface>

        <Button label={t('common.start')} onPress={() => router.push('/next-step')} />
        <Text variant="caption" color="secondary" align="center">
          {t('common.disclaimer')}
        </Text>

        <View style={{ marginTop: theme.spacing[6] }}>
          <Text variant="overline" color="secondary" style={{ marginBottom: theme.spacing[1] }}>
            {t('settings.title')}
          </Text>
          <ListRow
            title={t('settings.appearance.title')}
            subtitle={t(`theme.${themeMode}`)}
            leadingIcon="sun"
            trailing="chevron"
            onPress={() => router.push('/settings/appearance')}
            showDivider
          />
          <ListRow
            title={t('settings.language.title')}
            subtitle={t(`language.${resolveLanguage(language)}`)}
            leadingIcon="translate"
            trailing="chevron"
            onPress={() => router.push('/settings/language')}
          />
          {devScreensEnabled ? (
            <Button
              label={t('home.openDesignSystem')}
              variant="ghost"
              size="md"
              onPress={() => router.push('/dev/design-system')}
              style={{ marginTop: theme.spacing[2] }}
            />
          ) : null}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lede: {
    maxWidth: 340,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  previewTexts: {
    flex: 1,
    gap: 4,
  },
});
