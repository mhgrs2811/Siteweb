import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useTheme } from '@/core/theme';
import { Card, EmptyState, ErrorState, LoadingState, Screen, Text } from '@/core/ui';
import { formatRelativeDate } from '@/core/utils/date';
import type { Alert } from '@/domain';
import { SeverityChip, useAlerts } from '@/features/alerts';

export default function AlertsScreen() {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const alerts = useAlerts();

  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        <Text variant="display" accessibilityRole="header">
          {t('alerts.title')}
        </Text>
        <Text color="textMuted">{t('alerts.subtitle')}</Text>
      </View>
      {alerts.isPending ? (
        <LoadingState />
      ) : alerts.isError ? (
        <ErrorState error={alerts.error} onRetry={() => void alerts.refetch()} />
      ) : alerts.data.length === 0 ? (
        <EmptyState title={t('alerts.empty')} icon="notifications-off-outline" />
      ) : (
        alerts.data.map((a) => <AlertCard key={a.id} alert={a} />)
      )}
    </Screen>
  );
}

function AlertCard({ alert }: { alert: Alert }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, spacing } = useTheme();
  return (
    <Card
      accessibilityLabel={t('a11y.openAlert', { title: alert.title })}
      onPress={() => router.push({ pathname: '/alert/[id]', params: { id: alert.id } })}
      style={{ gap: spacing.sm }}
    >
      <SeverityChip severity={alert.severity} />
      <Text variant="heading">{alert.title}</Text>
      <Text color="textMuted">{alert.summary}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text variant="caption" color="textMuted">
          {t('alerts.published', { date: formatRelativeDate(alert.publishedAt, t) })}
        </Text>
        <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
      </View>
    </Card>
  );
}
