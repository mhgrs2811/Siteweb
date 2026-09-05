import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { track } from '@/core/analytics';
import { useTheme } from '@/core/theme';
import { ErrorState, LoadingState, Screen, Text } from '@/core/ui';
import { formatRelativeDate } from '@/core/utils/date';
import { SeverityChip, useAlert } from '@/features/alerts';
import { SimpleMarkdown } from '@/features/learn/SimpleMarkdown';

export default function AlertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const query = useAlert(id);

  useEffect(() => {
    if (query.data) track({ name: 'alert_opened' });
  }, [query.data]);

  if (query.isPending) {
    return (
      <Screen scroll={false}>
        <LoadingState />
      </Screen>
    );
  }
  if (query.isError || !query.data) {
    return (
      <Screen>
        <ErrorState error={query.error ?? null} onRetry={() => void query.refetch()} />
      </Screen>
    );
  }
  const alert = query.data;
  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        <SeverityChip severity={alert.severity} />
        <Text variant="title" accessibilityRole="header">
          {alert.title}
        </Text>
        <Text variant="caption" color="textMuted">
          {t('alerts.published', { date: formatRelativeDate(alert.publishedAt, t) })}
        </Text>
      </View>
      <SimpleMarkdown source={alert.body} />
    </Screen>
  );
}
