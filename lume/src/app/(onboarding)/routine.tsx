import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ChoiceGrid } from '@/components/onboarding/ChoiceGrid';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { Text } from '@/components/ui/Text';
import { useOnboardingNavigation } from '@/features/onboarding/navigation';
import { ROUTINE_LEVEL_ICONS } from '@/features/onboarding/options';
import { useOnboarding } from '@/features/onboarding/store';
import { MONTHLY_BUDGETS, ROUTINE_LEVELS } from '@/features/onboarding/types';
import { useTheme } from '@/theme';

export default function RoutineScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { goNext } = useOnboardingNavigation('routine');
  const routineLevel = useOnboarding((state) => state.answers.routineLevel);
  const monthlyBudget = useOnboarding((state) => state.answers.monthlyBudget);
  const setRoutineLevel = useOnboarding((state) => state.setRoutineLevel);
  const setMonthlyBudget = useOnboarding((state) => state.setMonthlyBudget);

  const levels = ROUTINE_LEVELS.map((value) => ({
    value,
    label: t(`onboarding.options.routineLevel.${value}`),
    description: t(`onboarding.options.routineLevelHint.${value}`),
    icon: ROUTINE_LEVEL_ICONS[value],
  }));

  const budgets = MONTHLY_BUDGETS.map((value) => ({
    value,
    label: t(`onboarding.options.monthlyBudget.${value}`),
  }));

  return (
    <OnboardingStep
      step="routine"
      overline={t('onboarding.routine.overline')}
      title={t('onboarding.routine.title')}
      helper={t('onboarding.routine.helper')}
      primaryDisabled={!routineLevel || !monthlyBudget}
      onPrimary={goNext}
    >
      <View style={{ gap: theme.spacing[7] }}>
        <View style={{ gap: theme.spacing[3] }}>
          <Text variant="overline" color="secondary">
            {t('onboarding.routine.levelLabel')}
          </Text>
          <ChoiceGrid
            columns={1}
            options={levels}
            selected={routineLevel ? [routineLevel] : []}
            onToggle={setRoutineLevel}
          />
        </View>
        <View style={{ gap: theme.spacing[3] }}>
          <Text variant="overline" color="secondary">
            {t('onboarding.routine.budgetLabel')}
          </Text>
          <ChoiceGrid
            size="md"
            options={budgets}
            selected={monthlyBudget ? [monthlyBudget] : []}
            onToggle={setMonthlyBudget}
          />
        </View>
      </View>
    </OnboardingStep>
  );
}
