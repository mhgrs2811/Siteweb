import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useTheme } from '@/core/theme';
import { Button, Card, LoadingState, Screen, Text } from '@/core/ui';
import { formatRelativeDate } from '@/core/utils/date';
import { useAuth } from '@/features/auth';
import { useMyReports } from '@/features/report';

export default function ReportTabScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const auth = useAuth();
  const signedIn = auth.status === 'signed_in';
  const reports = useMyReports(signedIn);

  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        <Text variant="display" accessibilityRole="header">
          {t('report.title')}
        </Text>
        <Text color="textMuted">{t('report.intro')}</Text>
      </View>

      <Button label={t('report.start')} icon="megaphone-outline" onPress={() => router.push('/report/new')} />

      <Card tone="alt" style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
        <Ionicons name="shield-checkmark-outline" size={28} color={colors.primary} />
        <Text variant="caption" color="textMuted" style={{ flex: 1 }}>
          {t('report.reassurance')}
        </Text>
      </Card>

      {signedIn ? (
        <View style={{ gap: spacing.md }}>
          <Text variant="heading" accessibilityRole="header">
            {t('report.myReports')}
          </Text>
          {reports.isPending ? (
            <LoadingState />
          ) : !reports.data || reports.data.length === 0 ? (
            <Text color="textMuted">{t('report.myReportsEmpty')}</Text>
          ) : (
            reports.data.map((r) => (
              <Card key={r.id} style={{ gap: spacing.xs }}>
                <Text variant="bodyStrong">{r.identifier.display}</Text>
                <Text variant="caption" color="textMuted">
                  {t(`categoriesShort.${r.category}`)} · {t(`report.status.${r.status}`)} ·{' '}
                  {formatRelativeDate(r.createdAt, t)}
                </Text>
              </Card>
            ))
          )}
        </View>
      ) : null}
    </Screen>
  );
}
