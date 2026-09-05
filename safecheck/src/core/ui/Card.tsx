import { Pressable, StyleSheet, View, type PressableProps, type ViewProps } from 'react-native';

import { shadows, useTheme } from '@/core/theme';

export interface CardProps extends ViewProps {
  onPress?: PressableProps['onPress'];
  accessibilityLabel?: string;
  tone?: 'default' | 'alt';
}

/** Surface de regroupement. Devient pressable (avec rôle bouton) si onPress est fourni. */
export function Card({ children, style, onPress, accessibilityLabel, tone = 'default', ...rest }: CardProps) {
  const { colors, radius, spacing } = useTheme();
  const base = [
    styles.card,
    shadows.card,
    {
      backgroundColor: tone === 'alt' ? colors.surfaceAlt : colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      borderColor: colors.border,
    },
    style,
  ];
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [base, { opacity: pressed ? 0.85 : 1 }]}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View style={base} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ card: { borderWidth: StyleSheet.hairlineWidth } });
