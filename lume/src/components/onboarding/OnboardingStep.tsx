import { useRouter } from 'expo-router';
import { useEffect, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Headline } from '@/components/ui/Headline';
import { IconButton } from '@/components/ui/IconButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useOnboarding } from '@/features/onboarding/store';
import { stepNumber, stepProgress, TOTAL_STEPS, type StepId } from '@/features/onboarding/steps';
import { useTheme } from '@/theme';

export interface OnboardingStepProps extends PropsWithChildren {
  step: StepId;
  /** Short section label above the title. */
  overline: string;
  /** Title with one `*italic*` accent. */
  title: string;
  helper?: string;
  primaryLabel?: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  /** Shows a ghost "skip" action under the primary button. */
  onSkip?: () => void;
  skipLabel?: string;
  /** Lift the footer above the keyboard (text entry steps). */
  keyboard?: boolean;
  scroll?: boolean;
}

/**
 * Layout shared by every onboarding question: back control, thin progress line with the step
 * counter, editorial title, content, and the primary action pinned above the safe area.
 */
export function OnboardingStep({
  step,
  overline,
  title,
  helper,
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  primaryLoading = false,
  onSkip,
  skipLabel,
  keyboard = false,
  scroll = true,
  children,
}: OnboardingStepProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const reachStep = useOnboarding((state) => state.reachStep);
  // The first screen of a cold start (resumed flow, corrected age) has nothing to go back to.
  const canGoBack = router.canGoBack();

  useEffect(() => {
    reachStep(step);
  }, [reachStep, step]);

  const counter = t('onboarding.stepCounter', {
    current: String(stepNumber(step)).padStart(2, '0'),
    total: TOTAL_STEPS,
  });

  const content = (
    <Screen
      scroll={scroll}
      footer={
        <View style={{ gap: theme.spacing[2] }}>
          <Button
            label={primaryLabel ?? t('common.continue')}
            onPress={onPrimary}
            disabled={primaryDisabled}
            loading={primaryLoading}
          />
          {onSkip ? (
            <Button
              label={skipLabel ?? t('common.skip')}
              variant="ghost"
              size="md"
              onPress={onSkip}
            />
          ) : null}
        </View>
      }
    >
      <View style={[styles.topBar, canGoBack ? styles.topBarWithBack : null]}>
        {canGoBack ? (
          <IconButton
            icon="caretLeft"
            accessibilityLabel={t('common.back')}
            onPress={() => router.back()}
          />
        ) : null}
        <ProgressBar
          progress={stepProgress(step)}
          accessibilityLabel={counter}
          style={styles.progress}
        />
        <Text variant="caption" color="secondary" style={styles.counter}>
          {counter}
        </Text>
      </View>

      <View style={[styles.heading, { marginTop: theme.spacing[7] }]}>
        <Text variant="overline" color="accent">
          {overline}
        </Text>
        <Headline text={title} variant="h1" />
        {helper ? (
          <Text variant="body" color="secondary">
            {helper}
          </Text>
        ) : null}
      </View>

      <View style={{ marginTop: theme.spacing[6] }}>{children}</View>
    </Screen>
  );

  if (!keyboard) return content;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {content}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
  },
  topBarWithBack: {
    marginLeft: -12,
  },
  progress: {
    flex: 1,
  },
  counter: {
    minWidth: 44,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  heading: {
    gap: 10,
  },
});
