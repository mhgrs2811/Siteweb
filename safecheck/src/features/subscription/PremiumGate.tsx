import { Ionicons } from '@expo/vector-icons';
import { useEffect, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { track } from '@/core/analytics';
import type { FeatureKey } from '@/core/config/feature-flags';
import { useTheme } from '@/core/theme';
import { Card, Text } from '@/core/ui';

import { useFeatureAccess } from './FeatureFlagProvider';

/**
 * Enveloppe une fonctionnalité soumise à un feature flag.
 * - available        → rend les enfants
 * - upgrade_required → carte Premium (le paywall complet viendra avec la facturation)
 * - disabled         → rien, ou un message discret si `showDisabled`
 */
export function PremiumGate({
  feature,
  children,
  showDisabled = false,
}: PropsWithChildren<{ feature: FeatureKey; showDisabled?: boolean }>) {
  const access = useFeatureAccess(feature);
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();

  useEffect(() => {
    if (access === 'upgrade_required') track({ name: 'premium_wall_shown', props: { feature } });
  }, [access, feature]);

  if (access === 'available') return <>{children}</>;
  if (access === 'disabled' && !showDisabled) return null;

  return (
    <Card tone="alt">
      <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
        <Ionicons name={access === 'disabled' ? 'time-outline' : 'star'} size={28} color={colors.primary} />
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text variant="bodyStrong">{t('premium.lockedTitle')}</Text>
          <Text variant="caption" color="textMuted">
            {access === 'disabled' ? t('premium.disabledBody') : t('premium.lockedBody')}
          </Text>
        </View>
      </View>
    </Card>
  );
}
