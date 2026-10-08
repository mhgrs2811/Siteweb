import { useTranslation } from 'react-i18next';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { BenefitList } from '@/components/onboarding/BenefitList';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { ProofChart } from '@/components/signature/ProofChart';
import { Badge } from '@/components/ui/Badge';
import { useGutter } from '@/components/ui/Screen';
import { Surface } from '@/components/ui/Surface';
import { useOnboardingNavigation } from '@/features/onboarding/navigation';
import { useTheme } from '@/theme';

const CARD_PADDING = 4;

/** The "proof" step: the shape of progress, drawn, with no number promised. */
export default function ProofScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const gutter = useGutter();
  const { width } = useWindowDimensions();
  const { goNext } = useOnboardingNavigation('proof');

  const chartWidth = width - gutter * 2 - theme.spacing[CARD_PADDING] * 2;

  const pillars = [
    {
      icon: 'calendarCheck',
      title: t('onboarding.proof.pillars.routine.title'),
      body: t('onboarding.proof.pillars.routine.body'),
    },
    {
      icon: 'scan',
      title: t('onboarding.proof.pillars.scan.title'),
      body: t('onboarding.proof.pillars.scan.body'),
    },
    {
      icon: 'chartLineUp',
      title: t('onboarding.proof.pillars.progress.title'),
      body: t('onboarding.proof.pillars.progress.body'),
    },
  ] as const;

  return (
    <OnboardingStep
      step="proof"
      overline={t('onboarding.proof.overline')}
      title={t('onboarding.proof.title')}
      helper={t('onboarding.proof.helper')}
      onPrimary={goNext}
    >
      <View style={{ gap: theme.spacing[6] }}>
        <Surface radius="lg" padding={CARD_PADDING}>
          <View style={styles.chartHeader}>
            <Badge label={t('onboarding.proof.caption')} tone="neutral" />
          </View>
          <ProofChart
            width={chartWidth}
            height={190}
            startLabel={t('onboarding.proof.axisStart')}
            endLabel={t('onboarding.proof.axisEnd')}
          />
        </Surface>
        <BenefitList items={pillars} initialDelayMs={300} />
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
