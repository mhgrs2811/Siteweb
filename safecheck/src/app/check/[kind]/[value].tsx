import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useTheme } from '@/core/theme';
import { Button, Card, ErrorState, LoadingState, RiskBadge, Screen, Text } from '@/core/ui';
import { formatRelativeDate } from '@/core/utils/date';
import { identifierFromRouteParams, type CheckResult, type RiskReasonCode } from '@/domain';
import { useCheck, useRecentChecks } from '@/features/check';
import { PremiumGate } from '@/features/subscription';

export default function CheckResultScreen() {
  const { kind, value } = useLocalSearchParams<{ kind: string; value: string }>();
  const identifier = identifierFromRouteParams(kind ?? '', value ?? '');
  const { t } = useTranslation();
  const router = useRouter();
  const { spacing } = useTheme();
  const query = useCheck(identifier);
  const recent = useRecentChecks();

  useEffect(() => {
    if (query.data) {
      recent.add({ identifier: query.data.identifier, level: query.data.risk.level, checkedAt: query.data.checkedAt });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  if (!identifier) {
    return (
      <Screen>
        <ErrorState error={null} />
      </Screen>
    );
  }
  if (query.isPending) {
    return (
      <Screen scroll={false}>
        <LoadingState />
      </Screen>
    );
  }
  if (query.isError) {
    return (
      <Screen>
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      </Screen>
    );
  }

  const result = query.data;

  return (
    <Screen
      footer={
        <View style={{ gap: spacing.md }}>
          <Button
            label={t('result.reportThis')}
            icon="megaphone-outline"
            onPress={() => router.push({ pathname: '/report/new', params: { kind: identifier.kind, value: encodeURIComponent(identifier.value) } })}
          />
          <Button label={t('result.checkAnother')} variant="ghost" onPress={() => router.dismissTo('/')} />
        </View>
      }
    >
      <View style={{ gap: spacing.xs }}>
        <Text variant="caption" color="textMuted">
          {t(`check.detected.${identifier.kind}`)}
        </Text>
        <Text variant="title" selectable>
          {identifier.display}
        </Text>
      </View>

      <RiskBadge level={result.risk.level} />
      <Text>{t(`result.levelHint.${result.risk.level}`)}</Text>

      <Card style={{ gap: spacing.md }}>
        <Text variant="heading" accessibilityRole="header">
          {t('result.whyTitle')}
        </Text>
        {result.risk.reasons.map((code) => (
          <ReasonRow key={code} code={code} result={result} />
        ))}
      </Card>

      <Card tone="alt" style={{ gap: spacing.sm }}>
        <Text variant="heading" accessibilityRole="header">
          {t('result.adviceTitle')}
        </Text>
        <Text>{t(`result.advice.${result.risk.level}`)}</Text>
      </Card>

      {result.stats.totalReports > 0 ? (
        <View style={{ gap: spacing.md }}>
          <Text variant="heading" accessibilityRole="header">
            {t('result.reportsTitle')}
          </Text>
          {result.publicReports.length === 0 ? (
            <Text color="textMuted">{t('result.reportsEmpty')}</Text>
          ) : (
            <>
              {result.publicReports.slice(0, 2).map((r) => (
                <PublicReportCard key={r.id} category={r.category} excerpt={r.excerpt} createdAt={r.createdAt} />
              ))}
              {result.publicReports.length > 2 ? (
                <PremiumGate feature="check.detailed_reports">
                  {result.publicReports.slice(2).map((r) => (
                    <PublicReportCard key={r.id} category={r.category} excerpt={r.excerpt} createdAt={r.createdAt} />
                  ))}
                </PremiumGate>
              ) : null}
            </>
          )}
        </View>
      ) : null}

      <Text variant="caption" color="textMuted">
        {t('result.disclaimer')}
      </Text>
      <Text variant="caption" color="textMuted">
        {t('result.checkedAt', { date: formatRelativeDate(result.checkedAt, t) })}
      </Text>
    </Screen>
  );
}

function ReasonRow({ code, result }: { code: RiskReasonCode; result: CheckResult }) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const top = result.stats.categories[0];
  const params = {
    count:
      code === 'recent_activity'
        ? result.stats.recentReports
        : code === 'multiple_reporters'
          ? result.stats.distinctReporters
          : result.stats.totalReports,
    category: top ? t(`categoriesShort.${top.category}`) : '',
  };
  return (
    <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' }}>
      <Ionicons name="ellipse" size={10} color={colors.primary} style={{ marginTop: 9 }} />
      <Text style={{ flex: 1 }}>{t(`result.reasons.${code}`, params)}</Text>
    </View>
  );
}

function PublicReportCard({ category, excerpt, createdAt }: { category: CheckResult['publicReports'][number]['category']; excerpt: string | null; createdAt: string }) {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  return (
    <Card style={{ gap: spacing.xs }}>
      <Text variant="bodyStrong">{t(`categoriesShort.${category}`)}</Text>
      <Text color={excerpt ? 'text' : 'textMuted'}>{excerpt ?? t('result.reportWithoutText')}</Text>
      <Text variant="caption" color="textMuted">
        {formatRelativeDate(createdAt, t)}
      </Text>
    </Card>
  );
}
