import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { TextField } from '@/components/ui/TextField';
import { useOnboardingNavigation } from '@/features/onboarding/navigation';
import {
  FIRST_NAME_MAX_LENGTH,
  isValidFirstName,
  normalizeFirstName,
} from '@/features/onboarding/steps';
import { useOnboarding } from '@/features/onboarding/store';

export default function NameScreen() {
  const { t } = useTranslation();
  const { goNext } = useOnboardingNavigation('name');
  const firstName = useOnboarding((state) => state.answers.firstName);
  const setFirstName = useOnboarding((state) => state.setFirstName);
  const [value, setValue] = useState(firstName);
  const valid = isValidFirstName(value);

  const submit = () => {
    if (!valid) return;
    setFirstName(normalizeFirstName(value));
    goNext();
  };

  return (
    <OnboardingStep
      step="name"
      keyboard
      scroll={false}
      overline={t('onboarding.name.overline')}
      title={t('onboarding.name.title')}
      helper={t('onboarding.name.helper')}
      primaryDisabled={!valid}
      onPrimary={submit}
    >
      <TextField
        label={t('onboarding.name.label')}
        placeholder={t('onboarding.name.placeholder')}
        value={value}
        onChangeText={setValue}
        autoFocus
        autoCapitalize="words"
        autoComplete="given-name"
        textContentType="givenName"
        autoCorrect={false}
        returnKeyType="done"
        maxLength={FIRST_NAME_MAX_LENGTH}
        onSubmitEditing={submit}
      />
    </OnboardingStep>
  );
}
