import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { PermissionPrimer } from '@/components/onboarding/PermissionPrimer';
import { useOnboardingNavigation } from '@/features/onboarding/navigation';
import { useOnboarding } from '@/features/onboarding/store';
import { track } from '@/lib/analytics';
import { requestNotificationPermission } from '@/lib/notifications';

/** Value screen shown before the system prompt. Declining is never blocking. */
export default function NotificationsScreen() {
  const { t } = useTranslation();
  const { goNext } = useOnboardingNavigation('notifications');
  const setNotificationsOptIn = useOnboarding((state) => state.setNotificationsOptIn);
  const [requesting, setRequesting] = useState(false);

  const benefits = [
    {
      icon: 'calendarCheck',
      title: t('onboarding.notifications.benefits.routine.title'),
      body: t('onboarding.notifications.benefits.routine.body'),
    },
    {
      icon: 'arrowsClockwise',
      title: t('onboarding.notifications.benefits.rescan.title'),
      body: t('onboarding.notifications.benefits.rescan.body'),
    },
    {
      icon: 'moon',
      title: t('onboarding.notifications.benefits.quiet.title'),
      body: t('onboarding.notifications.benefits.quiet.body'),
    },
  ] as const;

  const enable = async () => {
    setRequesting(true);
    const permission = await requestNotificationPermission();
    const granted = permission === 'granted';
    setNotificationsOptIn(granted);
    track({ name: 'notifications_opt_in', props: { granted } });
    setRequesting(false);
    goNext();
  };

  const later = () => {
    setNotificationsOptIn(false);
    track({ name: 'notifications_opt_in', props: { granted: false } });
    goNext();
  };

  return (
    <OnboardingStep
      step="notifications"
      overline={t('onboarding.notifications.overline')}
      title={t('onboarding.notifications.title')}
      helper={t('onboarding.notifications.helper')}
      primaryLabel={t('onboarding.notifications.enable')}
      primaryLoading={requesting}
      onPrimary={() => void enable()}
      onSkip={later}
      skipLabel={t('onboarding.notifications.later')}
    >
      <PermissionPrimer icon="bell" benefits={benefits} />
    </OnboardingStep>
  );
}
