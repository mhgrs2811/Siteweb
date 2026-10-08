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
import { IconButton } from '@/components/ui/IconButton';
import { Screen, useGutter } from '@/components/ui/Screen';
import { Stagger } from '@/components/ui/Stagger';
import { Surface } from '@/components/ui/Surface';
import { Text } from '@/components/ui/Text';
import { routeFor } from '@/features/onboarding/navigation';
import { stepNumber, TOTAL_STEPS } from '@/features/onboarding/steps';
import { useOnboarding } from '@/features/onboarding/store';
import { track } from '@/lib/analytics';
import { devScreensEnabled } from '@/lib/env';
import { useTheme } from '@/theme';

/** Illustrative preview of a result; the real ring arrives with the first scan (Phase 2). */
const PREVIEW = {
  score: 72,
  indicators: [
    { key: 'texture', value: 68 },
    { key: 'glow', value: 61 },
    { key: 'hydration', value: 79 },
  ] as const,
};

/**
 * Editorial welcome screen, first step of the onboarding. A returning user who stopped
 * midway is offered to resume where she left off, or to start over.
 */
export default function WelcomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const gutter = useGutter();
  const { width } = useWindowDimensions();
  const status = useOnboarding((state) => state.status);
  const furthestStep = useOnboarding((state) => state.furthestStep);
  const start = useOnboarding((state) => state.start);
  const reset = useOnboarding((state) => state.reset);

  const resumeStep =
    status === 'in_progress' && furthestStep && furthestStep !== 'welcome' ? furthestStep : null;

  // Tall enough to breathe, short enough to keep the call to action within the first screen.
  const heroHeight = Math.round(Math.min(width * 0.86, 360));

  const begin = () => {
    start();
    track({ name: 'onboarding_started' });
    router.push(routeFor('name'));
  };

  const restart = () => {
    reset();
    begin();
  };

  return (
    <Screen padded={false} safeTop={false}>
      <View style={{ height: heroHeight }}>
        <Aura width={width} height={heroHeight} />
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.heroBar,
            { paddingTop: insets.top + 14, paddingHorizontal: gutter },
          ]}
        >
          <Wordmark size="md" />
          <IconButton
            icon="translate"
            variant="surface"
            iconSize={20}
            accessibilityLabel={t('a11y.changeLanguage')}
            onPress={() => router.push('/settings/language')}
          />
        </View>
      </View>

      <View
        style={{ paddingHorizontal: gutter, marginTop: -theme.spacing[10], gap: theme.spacing[5] }}
      >
        <Stagger>
          <Text variant="overline" color="accent">
            {t('onboarding.welcome.kicker')}
          </Text>
          <Headline text={t('onboarding.welcome.headline')} />
          <Text variant="body" color="secondary" style={styles.lede}>
            {t('onboarding.welcome.body')}
          </Text>
        </Stagger>

        <Surface variant="elevated" radius="lg" padding={5} style={{ marginTop: theme.spacing[2] }}>
          <View style={styles.previewRow}>
            <ScoreRing score={PREVIEW.score} size={116} strokeWidth={8} hapticOnSettle={false} />
            <View style={styles.previewTexts}>
              <Text variant="overline" color="secondary">
                {t('onboarding.welcome.preview.label')}
              </Text>
              <Text variant="h2">{t('onboarding.welcome.preview.verdict')}</Text>
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

        {resumeStep ? (
          <View style={{ gap: theme.spacing[2] }}>
            <Button
              label={t('onboarding.resume')}
              onPress={() => router.push(routeFor(resumeStep))}
            />
            <Text variant="caption" color="secondary" align="center">
              {t('onboarding.welcome.resumeHint', {
                step: stepNumber(resumeStep),
                total: TOTAL_STEPS,
              })}
            </Text>
            <Button label={t('onboarding.restart')} variant="ghost" size="md" onPress={restart} />
          </View>
        ) : (
          <Button label={t('common.start')} onPress={begin} />
        )}

        <Text variant="caption" color="secondary" align="center">
          {t('common.disclaimer')}
        </Text>

        {devScreensEnabled ? (
          <Button
            label={t('home.openDesignSystem')}
            variant="ghost"
            size="md"
            onPress={() => router.push('/dev/design-system')}
          />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
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
