import { useTranslation } from 'react-i18next';

import { ChoiceGrid } from '@/components/onboarding/ChoiceGrid';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { useOnboardingNavigation } from '@/features/onboarding/navigation';
import { SENSITIVITY_ICONS } from '@/features/onboarding/options';
import { useOnboarding } from '@/features/onboarding/store';
import { SENSITIVITIES } from '@/features/onboarding/types';

export default function SensitivitiesScreen() {
  const { t } = useTranslation();
  const { goNext } = useOnboardingNavigation('sensitivities');
  const sensitivities = useOnboarding((state) => state.answers.sensitivities);
  const toggleSensitivity = useOnboarding((state) => state.toggleSensitivity);

  const options = SENSITIVITIES.map((value) => ({
    value,
    label: t(`onboarding.options.sensitivities.${value}`),
    icon: SENSITIVITY_ICONS[value],
  }));

  return (
    <OnboardingStep
      step="sensitivities"
      overline={t('onboarding.sensitivities.overline')}
      title={t('onboarding.sensitivities.title')}
      helper={t('onboarding.sensitivities.helper')}
      primaryDisabled={sensitivities.length === 0}
      onPrimary={goNext}
    >
      <ChoiceGrid
        selection="multiple"
        options={options}
        selected={sensitivities}
        onToggle={toggleSensitivity}
      />
    </OnboardingStep>
  );
}
