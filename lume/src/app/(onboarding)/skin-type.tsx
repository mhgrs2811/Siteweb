import { useTranslation } from 'react-i18next';

import { ChoiceGrid } from '@/components/onboarding/ChoiceGrid';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { useOnboardingNavigation } from '@/features/onboarding/navigation';
import { SKIN_TYPE_ICONS } from '@/features/onboarding/options';
import { useOnboarding } from '@/features/onboarding/store';
import { SKIN_TYPES } from '@/features/onboarding/types';

export default function SkinTypeScreen() {
  const { t } = useTranslation();
  const { goNext } = useOnboardingNavigation('skin-type');
  const skinType = useOnboarding((state) => state.answers.skinType);
  const setSkinType = useOnboarding((state) => state.setSkinType);

  const options = SKIN_TYPES.map((value) => ({
    value,
    label: t(`onboarding.options.skinType.${value}`),
    description: t(`onboarding.options.skinTypeHint.${value}`),
    icon: SKIN_TYPE_ICONS[value],
  }));

  return (
    <OnboardingStep
      step="skin-type"
      overline={t('onboarding.skinType.overline')}
      title={t('onboarding.skinType.title')}
      helper={t('onboarding.skinType.helper')}
      primaryDisabled={!skinType}
      onPrimary={goNext}
    >
      <ChoiceGrid
        columns={1}
        options={options}
        selected={skinType ? [skinType] : []}
        onToggle={setSkinType}
      />
    </OnboardingStep>
  );
}
