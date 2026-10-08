import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Text } from '@/components/ui/Text';
import { contrastLevel, contrastRatio, formatRatio, useTheme, type ContrastLevel } from '@/theme';

export interface ContrastRowProps {
  name: string;
  foreground: string;
  background: string;
}

const TONE: Record<ContrastLevel, BadgeTone> = {
  aa: 'success',
  'aa-large': 'warning',
  fail: 'neutral',
};

/** One measured pair: a sample tile, the pair name, the ratio and its WCAG level. */
export function ContrastRow({ name, foreground, background }: ContrastRowProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const ratio = contrastRatio(foreground, background);
  const level = contrastLevel(foreground, background);
  const levelLabel = {
    aa: t('designSystem.colors.levelAa'),
    'aa-large': t('designSystem.colors.levelAaLarge'),
    fail: t('designSystem.colors.levelFail'),
  }[level];

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.tile,
          {
            backgroundColor: background,
            borderRadius: theme.radii.md,
            borderColor: theme.colors.line,
          },
        ]}
      >
        <Text variant="h2" color="inherit" style={{ color: foreground }}>
          {t('designSystem.colors.sample')}
        </Text>
      </View>
      <View style={styles.texts}>
        <Text variant="label" numberOfLines={1}>
          {name}
        </Text>
        <Text variant="caption" color="secondary">
          {formatRatio(ratio, i18n.language)}
        </Text>
      </View>
      <Badge label={levelLabel} tone={TONE[level]} dot />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tile: {
    width: 56,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
});
