import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ConsentCard } from '@/components/onboarding/ConsentCard';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { useOnboardingNavigation } from '@/features/onboarding/navigation';
import { useOnboarding } from '@/features/onboarding/store';
import { PHOTO_CONSENT_VERSION } from '@/features/onboarding/types';
import { track } from '@/lib/analytics';

/**
 * Photo consent, on its own screen and never pre-checked. Skipping is allowed: consent is
 * required for the first scan (Phase 2), not to finish the onboarding.
 */
export default function ConsentScreen() {
  const { t } = useTranslation();
  const { goNext } = useOnboardingNavigation('consent');
  const consent = useOnboarding((state) => state.answers.photoConsent);
  const givePhotoConsent = useOnboarding((state) => state.givePhotoConsent);
  const withdrawPhotoConsent = useOnboarding((state) => state.withdrawPhotoConsent);
  const setKeepPhotos = useOnboarding((state) => state.setKeepPhotos);
  const alreadyGiven = consent.acceptedAt !== null;
  const [accepted, setAccepted] = useState(alreadyGiven);

  const accept = () => {
    givePhotoConsent(consent.keepPhotos);
    track({
      name: 'photo_consent_given',
      props: { version: PHOTO_CONSENT_VERSION, keep_photos: consent.keepPhotos },
    });
    goNext();
  };

  const later = () => {
    // Unchecking a consent given earlier, then leaving, counts as withdrawing it.
    if (alreadyGiven && !accepted) withdrawPhotoConsent();
    goNext();
  };

  return (
    <OnboardingStep
      step="consent"
      overline={t('onboarding.consent.overline')}
      title={t('onboarding.consent.title')}
      helper={t('onboarding.consent.helper')}
      primaryLabel={t('onboarding.consent.accept')}
      primaryDisabled={!accepted}
      onPrimary={accept}
      onSkip={later}
      skipLabel={t('onboarding.consent.later')}
    >
      <ConsentCard
        accepted={accepted}
        onAcceptedChange={setAccepted}
        keepPhotos={consent.keepPhotos}
        onKeepPhotosChange={setKeepPhotos}
      />
    </OnboardingStep>
  );
}
