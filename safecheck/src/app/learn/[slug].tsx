import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { track } from '@/core/analytics';
import { useTheme } from '@/core/theme';
import { ErrorState, LoadingState, Screen, Text } from '@/core/ui';
import { useArticle } from '@/features/learn';
import { SimpleMarkdown } from '@/features/learn/SimpleMarkdown';

export default function ArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const query = useArticle(slug);

  useEffect(() => {
    if (query.data) track({ name: 'article_opened' });
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
  const article = query.data;
  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        <Text variant="title" accessibilityRole="header">
          {article.title}
        </Text>
        <Text variant="caption" color="textMuted">
          {t('learn.readingTime', { count: article.readingMinutes })}
        </Text>
      </View>
      <Text color="textMuted">{article.summary}</Text>
      <SimpleMarkdown source={article.body} />
    </Screen>
  );
}
