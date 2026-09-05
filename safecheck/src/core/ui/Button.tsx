import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { MIN_TOUCH_TARGET, useTheme } from '@/core/theme';

import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  fullWidth?: boolean;
  size?: 'md' | 'lg';
}

/**
 * Bouton principal : hauteur ≥ 56pt (au-dessus du minimum de 48), libellé
 * explicite, retour haptique léger, état chargé accessible.
 */
export function Button({
  label,
  variant = 'primary',
  icon,
  loading = false,
  fullWidth = true,
  size = 'lg',
  disabled,
  onPress,
  accessibilityLabel,
  ...rest
}: ButtonProps) {
  const { colors, radius, spacing } = useTheme();
  const isDisabled = disabled || loading;

  const bg: Record<Variant, string> = {
    primary: colors.primary,
    secondary: colors.surface,
    ghost: 'transparent',
    danger: colors.risk.high.bg,
  };
  const fg: Record<Variant, string> = {
    primary: colors.onPrimary,
    secondary: colors.primary,
    ghost: colors.primary,
    danger: colors.risk.high.fg,
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      hitSlop={4}
      onPress={(e) => {
        if (Platform.OS !== 'web') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(e);
      }}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: size === 'lg' ? 56 : MIN_TOUCH_TARGET,
          paddingHorizontal: spacing.xl,
          borderRadius: radius.lg,
          backgroundColor: pressed && variant === 'primary' ? colors.primaryPressed : bg[variant],
          borderWidth: variant === 'secondary' ? 2 : 0,
          borderColor: colors.primary,
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={fg[variant]} />
      ) : (
        <View style={styles.content}>
          {icon ? <Ionicons name={icon} size={24} color={fg[variant]} style={{ marginRight: spacing.sm }} /> : null}
          <Text variant="bodyStrong" style={{ color: fg[variant] }} numberOfLines={2} align="center">
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
