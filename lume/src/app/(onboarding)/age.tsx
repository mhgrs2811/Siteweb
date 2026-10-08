import { useTranslation } from 'react-i18next';

import { ChoiceGrid } from '@/components/onboarding/ChoiceGrid';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { useOnboardingNavigation } from '@/features/onboarding/navigation';
import { isUnderage } from '@/features/onboarding/rules';
import { useOnboarding } from '@/features/onboarding/store';
import { AGE_BANDS } from '@/features/onboarding/types';

export default function AgeScreen() {
  const { t } = useTranslation();
  const { goNext, router } = useOnboardingNavigation('age');
  const ageBand = useOnboarding((state) => state.answers.ageBand);
  const setAgeBand = useOnboarding((state) => state.setAgeBand);

  const options = AGE_BANDS.map((value) => ({
    value,
    label: t(`onboarding.options.ageBand.${value}`),
  }));

  const onPrimary = () => {
    if (!ageBand) return;
    // Under 16: a kind dead end, no account, nothing synced (PRD, section 2).
    if (isUnderage(ageBand)) {
      router.push('/(onboarding)/too-young');
      return;
    }
    goNext();
  };

  return (
    <OnboardingStep
      step="age"
      overline={t('onboarding.age.overline')}
      title={t('onboarding.age.title')}
      helper={t('onboarding.age.helper')}
      primaryDisabled={!ageBand}
      onPrimary={onPrimary}
    >
      <ChoiceGrid options={options} selected={ageBand ? [ageBand] : []} onToggle={setAgeBand} />
    </OnboardingStep>
  );
}
