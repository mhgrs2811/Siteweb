import { useTranslation } from 'react-i18next';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { BenefitList } from '@/components/onboarding/BenefitList';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { CaptureGuide } from '@/components/signature/CaptureGuide';
import { useGutter } from '@/components/ui/Screen';
import { useOnboardingNavigation } from '@/features/onboarding/navigation';
import { useOnboarding } from '@/features/onboarding/store';
import { flushAnalytics, track } from '@/lib/analytics';
import { useTheme } from '@/theme';

/** Last step: how to take a comparable selfie. Saving the profile completes the onboarding. */
export default function CaptureGuideScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const gutter = useGutter();
  const { width } = useWindowDimensions();
  const { router } = useOnboardingNavigation('capture-guide');
  const complete = useOnboarding((state) => state.complete);

  const tips = [
    {
      icon: 'sun',
      title: t('onboarding.captureGuide.tips.light.title'),
      body: t('onboarding.captureGuide.tips.light.body'),
    },
    {
      icon: 'leaf',
      title: t('onboarding.captureGuide.tips.bare.title'),
      body: t('onboarding.captureGuide.tips.bare.body'),
    },
    {
      icon: 'scan',
      title: t('onboarding.captureGuide.tips.center.title'),
      body: t('onboarding.captureGuide.tips.center.body'),
    },
  ] as const;

  const finish = () => {
    complete();
    track({ name: 'onboarding_completed' });
    void flushAnalytics();
    router.replace('/(onboarding)/done');
  };

  return (
    <OnboardingStep
      step="capture-guide"
      overline={t('onboarding.captureGuide.overline')}
      title={t('onboarding.captureGuide.title')}
      helper={t('onboarding.captureGuide.helper')}
      primaryLabel={t('onboarding.captureGuide.cta')}
      onPrimary={finish}
    >
      <View style={{ gap: theme.spacing[6] }}>
        <View
          style={[
            styles.viewfinder,
            { borderRadius: theme.radii.lg, borderColor: theme.colors.line },
          ]}
        >
          <CaptureGuide width={width - gutter * 2 - 2} height={240} />
        </View>
        <BenefitList items={tips} initialDelayMs={200} />
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  viewfinder: {
    overflow: 'hidden',
    borderWidth: 1,
  },
});
