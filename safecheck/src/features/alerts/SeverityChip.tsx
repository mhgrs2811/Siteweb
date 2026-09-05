import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useTheme } from '@/core/theme';
import { Text } from '@/core/ui';
import type { AlertSeverity } from '@/domain';

/** Pastille de niveau de vigilance : couleur + texte (jamais la couleur seule). */
export function SeverityChip({ severity }: { severity: AlertSeverity }) {
  const { t } = useTranslation();
  const { colors, radius, spacing } = useTheme();
  const tone = colors.severity[severity];
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: tone.bg,
        borderRadius: radius.pill,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
      }}
    >
      <Text variant="caption" style={{ color: tone.fg, fontWeight: '600' }}>
        {t(`alerts.severity.${severity}`)}
      </Text>
    </View>
  );
}
