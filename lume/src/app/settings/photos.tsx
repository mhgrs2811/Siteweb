import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ConsentCard } from '@/components/onboarding/ConsentCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { Toggle } from '@/components/ui/Toggle';
import { formatConsentDate } from '@/features/onboarding/format';
import { useOnboarding } from '@/features/onboarding/store';
import { PHOTO_CONSENT_VERSION } from '@/features/onboarding/types';
import { resolveLanguage } from '@/i18n';
import { track } from '@/lib/analytics';
import { usePreferences } from '@/store/preferences';
import { useTheme } from '@/theme';

/** Photo consent settings: status, retention choice, withdrawal, or a fresh consent. */
export default function PhotosSheet() {
  const { t } = useTranslation();
  const theme = useTheme();
  const consent = useOnboarding((state) => state.answers.photoConsent);
  const givePhotoConsent = useOnboarding((state) => state.givePhotoConsent);
  const withdrawPhotoConsent = useOnboarding((state) => state.withdrawPhotoConsent);
  const setKeepPhotos = useOnboarding((state) => state.setKeepPhotos);
  const language = usePreferences((state) => state.language);
  const [accepted, setAccepted] = useState(false);

  const give = () => {
    givePhotoConsent(consent.keepPhotos);
    track({
      name: 'photo_consent_given',
      props: { version: PHOTO_CONSENT_VERSION, keep_photos: consent.keepPhotos },
    });
    setAccepted(false);
  };

  return (
    <Sheet
      icon="camera"
      overline={t('settings.title')}
      title={t('settings.photos.title')}
      body={t('settings.photos.body')}
    >
      {consent.acceptedAt ? (
        <View style={{ gap: theme.spacing[5] }}>
          <View style={{ gap: theme.spacing[2] }}>
            <Badge
              label={t('onboarding.consent.givenOn', {
                date: formatConsentDate(consent.acceptedAt, resolveLanguage(language)),
              })}
              tone="success"
              dot
            />
            <Text variant="caption" color="secondary">
              {t('settings.photos.version', { version: consent.version ?? PHOTO_CONSENT_VERSION })}
            </Text>
          </View>
          <Toggle
            label={t('onboarding.consent.keepPhotos')}
            description={t('onboarding.consent.keepPhotosHint')}
            value={consent.keepPhotos}
            onValueChange={setKeepPhotos}
          />
          <Button
            label={t('onboarding.consent.withdraw')}
            variant="secondary"
            size="md"
            onPress={withdrawPhotoConsent}
          />
        </View>
      ) : (
        <View style={{ gap: theme.spacing[4] }}>
          <ConsentCard
            accepted={accepted}
            onAcceptedChange={setAccepted}
            keepPhotos={consent.keepPhotos}
            onKeepPhotosChange={setKeepPhotos}
          />
          <Button label={t('onboarding.consent.give')} disabled={!accepted} onPress={give} />
        </View>
      )}
    </Sheet>
  );
}
