import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme';

export interface WordmarkProps {
  size?: 'md' | 'lg';
}

/** Provisional typographic wordmark: the name in Fraunces, closed by a terracotta dot. */
export function Wordmark({ size = 'lg' }: WordmarkProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const large = size === 'lg';
  const dot = large ? 9 : 6;

  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel={t('common.appName')}>
      <Text variant={large ? 'display' : 'h2'}>{t('common.appName')}</Text>
      <View
        style={{
          width: dot,
          height: dot,
          borderRadius: dot / 2,
          backgroundColor: theme.colors.accent.base,
          marginLeft: large ? 4 : 3,
          marginBottom: large ? 8 : 5,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
