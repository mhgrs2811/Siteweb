import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

export type BadgeTone = 'success' | 'warning' | 'accent' | 'neutral';

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  /** Leading tone dot, useful when several badges sit side by side. */
  dot?: boolean;
}

/** Small status pill: product verdicts, contrast levels, counters. */
export function Badge({ label, tone = 'neutral', dot = false }: BadgeProps) {
  const { colors, radii } = useTheme();

  const palette = {
    success: {
      background: colors.success.soft,
      text: colors.success.text,
      dot: colors.success.base,
    },
    warning: {
      background: colors.warning.soft,
      text: colors.warning.text,
      dot: colors.warning.base,
    },
    accent: { background: colors.accent.soft, text: colors.accent.text, dot: colors.accent.base },
    neutral: {
      background: colors.surfaceSunken,
      text: colors.textSecondary,
      dot: colors.lineStrong,
    },
  }[tone];

  return (
    <View style={[styles.badge, { backgroundColor: palette.background, borderRadius: radii.pill }]}>
      {dot ? <View style={[styles.dot, { backgroundColor: palette.dot }]} /> : null}
      <Text
        variant="captionMedium"
        color="inherit"
        style={{ color: palette.text }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 28,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});
