import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/core/theme';
import type { RiskLevel } from '@/domain';

import { Text } from './Text';

const ICONS: Record<RiskLevel, keyof typeof Ionicons.glyphMap> = {
  unknown: 'help-circle',
  low: 'checkmark-circle',
  moderate: 'alert-circle',
  high: 'warning',
};

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'md' | 'lg';
}

/**
 * Indicateur de risque : couleur + icône + texte (jamais la couleur seule).
 * Le libellé provient d'i18n et respecte la charte éditoriale.
 */
export function RiskBadge({ level, size = 'lg' }: RiskBadgeProps) {
  const { t } = useTranslation();
  const { colors, radius, spacing } = useTheme();
  const tone = colors.risk[level];
  const label = t(`result.level.${level}`);
  const isLarge = size === 'lg';
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={t('a11y.riskBadge', { level: label })}
      style={[
        styles.badge,
        {
          backgroundColor: tone.bg,
          borderRadius: radius.lg,
          paddingVertical: isLarge ? spacing.lg : spacing.sm,
          paddingHorizontal: isLarge ? spacing.xl : spacing.md,
          gap: spacing.sm,
        },
      ]}
    >
      <Ionicons name={ICONS[level]} size={isLarge ? 40 : 24} color={tone.accent} />
      <Text variant={isLarge ? 'title' : 'bodyStrong'} style={{ color: tone.fg, flexShrink: 1 }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({ badge: { flexDirection: 'row', alignItems: 'center' } });
