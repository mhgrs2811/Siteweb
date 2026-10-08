import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ChoiceGrid } from '@/components/onboarding/ChoiceGrid';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { Text } from '@/components/ui/Text';
import { useOnboardingNavigation } from '@/features/onboarding/navigation';
import { GOAL_ICONS } from '@/features/onboarding/options';
import { goalsRemaining } from '@/features/onboarding/rules';
import { useOnboarding } from '@/features/onboarding/store';
import { GOALS } from '@/features/onboarding/types';
import { useTheme } from '@/theme';

export default function GoalsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { goNext } = useOnboardingNavigation('goals');
  const goals = useOnboarding((state) => state.answers.goals);
  const toggleGoal = useOnboarding((state) => state.toggleGoal);
  const remaining = goalsRemaining(goals);

  const options = GOALS.map((value) => ({
    value,
    label: t(`onboarding.options.goals.${value}`),
    icon: GOAL_ICONS[value],
  }));

  return (
    <OnboardingStep
      step="goals"
      overline={t('onboarding.goals.overline')}
      title={t('onboarding.goals.title')}
      helper={t('onboarding.goals.helper')}
      primaryDisabled={goals.length === 0}
      onPrimary={goNext}
    >
      <View style={{ gap: theme.spacing[4] }}>
        <ChoiceGrid selection="multiple" options={options} selected={goals} onToggle={toggleGoal} />
        <Text variant="caption" color={remaining === 0 ? 'accent' : 'secondary'} align="center">
          {remaining === 0
            ? t('onboarding.goals.full')
            : t('onboarding.goals.remaining', { count: remaining })}
        </Text>
      </View>
    </OnboardingStep>
  );
}
