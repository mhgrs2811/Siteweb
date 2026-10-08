import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ChoiceGrid } from '@/components/onboarding/ChoiceGrid';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { Text } from '@/components/ui/Text';
import { useOnboardingNavigation } from '@/features/onboarding/navigation';
import { canContinue } from '@/features/onboarding/steps';
import { useOnboarding } from '@/features/onboarding/store';
import { SLEEP_OPTIONS, SUN_OPTIONS, WATER_OPTIONS } from '@/features/onboarding/types';
import { useTheme } from '@/theme';

const MAKEUP_OPTIONS = ['yes', 'no'] as const;
type MakeupAnswer = (typeof MAKEUP_OPTIONS)[number];

function Group({ label, children }: PropsWithChildren<{ label: string }>) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing[3] }}>
      <Text variant="overline" color="secondary">
        {label}
      </Text>
      {children}
    </View>
  );
}

/** Four short lifestyle questions on one screen, answered with pills. */
export default function LifestyleScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { goNext } = useOnboardingNavigation('lifestyle');
  const answers = useOnboarding((state) => state.answers);
  const setLifestyle = useOnboarding((state) => state.setLifestyle);
  const { lifestyle } = answers;

  const makeupValue: MakeupAnswer | null =
    lifestyle.makeup === null ? null : lifestyle.makeup ? 'yes' : 'no';

  return (
    <OnboardingStep
      step="lifestyle"
      overline={t('onboarding.lifestyle.overline')}
      title={t('onboarding.lifestyle.title')}
      helper={t('onboarding.lifestyle.helper')}
      primaryDisabled={!canContinue('lifestyle', answers)}
      onPrimary={goNext}
    >
      <View style={{ gap: theme.spacing[7] }}>
        <Group label={t('onboarding.lifestyle.sleep')}>
          <ChoiceGrid
            size="md"
            options={SLEEP_OPTIONS.map((value) => ({
              value,
              label: t(`onboarding.options.sleep.${value}`),
            }))}
            selected={lifestyle.sleep ? [lifestyle.sleep] : []}
            onToggle={(sleep) => setLifestyle({ sleep })}
          />
        </Group>
        <Group label={t('onboarding.lifestyle.water')}>
          <ChoiceGrid
            size="md"
            options={WATER_OPTIONS.map((value) => ({
              value,
              label: t(`onboarding.options.water.${value}`),
            }))}
            selected={lifestyle.water ? [lifestyle.water] : []}
            onToggle={(water) => setLifestyle({ water })}
          />
        </Group>
        <Group label={t('onboarding.lifestyle.sun')}>
          <ChoiceGrid
            size="md"
            options={SUN_OPTIONS.map((value) => ({
              value,
              label: t(`onboarding.options.sun.${value}`),
            }))}
            selected={lifestyle.sun ? [lifestyle.sun] : []}
            onToggle={(sun) => setLifestyle({ sun })}
          />
        </Group>
        <Group label={t('onboarding.lifestyle.makeup')}>
          <ChoiceGrid
            size="md"
            options={MAKEUP_OPTIONS.map((value) => ({
              value,
              label: t(`onboarding.options.makeup.${value}`),
            }))}
            selected={makeupValue ? [makeupValue] : []}
            onToggle={(value) => setLifestyle({ makeup: value === 'yes' })}
          />
        </Group>
      </View>
    </OnboardingStep>
  );
}
