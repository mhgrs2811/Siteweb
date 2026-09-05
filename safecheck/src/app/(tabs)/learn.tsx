import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useTheme } from '@/core/theme';
import { Card, EmptyState, ErrorState, LoadingState, Screen, Text } from '@/core/ui';
import { useArticles } from '@/features/learn';

export default function LearnScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const articles = useArticles();

  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        <Text variant="display" accessibilityRole="header">
          {t('learn.title')}
        </Text>
        <Text color="textMuted">{t('learn.subtitle')}</Text>
      </View>
      {articles.isPending ? (
        <LoadingState />
      ) : articles.isError ? (
        <ErrorState error={articles.error} onRetry={() => void articles.refetch()} />
      ) : articles.data.length === 0 ? (
        <EmptyState title={t('learn.empty')} icon="book-outline" />
      ) : (
        articles.data.map((a) => (
          <Card
            key={a.id}
            accessibilityLabel={t('a11y.openArticle', { title: a.title })}
            onPress={() => router.push({ pathname: '/learn/[slug]', params: { slug: a.slug } })}
            style={{ gap: spacing.sm }}
          >
            <Text variant="heading">{a.title}</Text>
            <Text color="textMuted">{a.summary}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text variant="caption" color="textMuted">
                {t('learn.readingTime', { count: a.readingMinutes })}
              </Text>
              <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
}
