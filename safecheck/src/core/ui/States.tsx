import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { DataError } from '@/core/data';
import { useTheme } from '@/core/theme';

import { Button } from './Button';
import { Text } from './Text';

export function LoadingState({ label }: { label?: string }) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  return (
    <View style={[styles.center, { gap: spacing.md }]} accessibilityRole="progressbar" accessibilityLabel={label ?? t('common.loading')}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text color="textMuted">{label ?? t('common.loading')}</Text>
    </View>
  );
}

export function EmptyState({ title, icon = 'leaf-outline' }: { title: string; icon?: keyof typeof Ionicons.glyphMap }) {
  const { colors, spacing } = useTheme();
  return (
    <View style={[styles.center, { gap: spacing.md }]}>
      <Ionicons name={icon} size={48} color={colors.textMuted} />
      <Text color="textMuted" align="center">
        {title}
      </Text>
    </View>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const code = error instanceof DataError ? error.code : 'unknown';
  return (
    <View style={[styles.center, { gap: spacing.lg }]} accessibilityLiveRegion="assertive">
      <Ionicons name="cloud-offline-outline" size={48} color={colors.textMuted} />
      <Text variant="heading" align="center">
        {t('errors.title')}
      </Text>
      <Text color="textMuted" align="center">
        {t(`errors.${code}`)}
      </Text>
      {onRetry ? <Button label={t('common.retry')} variant="secondary" fullWidth={false} onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 32, paddingHorizontal: 16 },
});
