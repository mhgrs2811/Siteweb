import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { HapticIntent } from '@/lib/haptics';
import { useTheme } from '@/theme';

import { LoadingDots } from './LoadingDots';
import { Pressable, type PressableProps } from './Pressable';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children' | 'haptic'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  /** Fired on press. Defaults to `confirm` for primary buttons, `selection` otherwise. */
  haptic?: HapticIntent | null;
  leading?: ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const HEIGHT: Record<ButtonSize, number> = { md: 48, lg: 56 };
const PADDING: Record<ButtonSize, number> = { md: 20, lg: 28 };

/**
 * The three button voices: primary (terracotta, lit by a warm glow), secondary (hairline
 * outline) and ghost (text only). Loading replaces the label with three pulsing dots and keeps
 * the button's footprint so nothing shifts.
 */
export function Button({
  label,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  haptic,
  leading,
  fullWidth = true,
  style,
  accessibilityLabel,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const { colors } = theme;
  const inactive = disabled || loading;
  const dimmed = disabled && !loading;

  let backgroundColor = 'transparent';
  let borderColor = 'transparent';
  let labelColor = colors.ink;
  let shadow: ViewStyle | null = null;

  switch (variant) {
    case 'primary':
      backgroundColor = dimmed ? colors.surfaceSunken : colors.accent.strong;
      labelColor = dimmed ? colors.textSecondary : colors.textOnAccent;
      shadow = dimmed ? null : theme.shadows.accent;
      break;
    case 'secondary':
      borderColor = dimmed ? colors.line : colors.ink;
      labelColor = dimmed ? colors.textSecondary : colors.ink;
      break;
    case 'ghost':
      labelColor = dimmed ? colors.textSecondary : colors.accent.text;
      break;
  }

  return (
    <Pressable
      {...rest}
      disabled={inactive}
      haptic={haptic === undefined ? (variant === 'primary' ? 'confirm' : 'selection') : haptic}
      pressScale={variant === 'ghost' ? 1 : undefined}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={[
        styles.base,
        {
          height: HEIGHT[size],
          paddingHorizontal: PADDING[size],
          borderRadius: theme.radii.pill,
          backgroundColor,
          borderColor,
          borderWidth: variant === 'secondary' ? 1 : 0,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        shadow,
        style,
      ]}
    >
      {loading ? (
        <LoadingDots color={labelColor} />
      ) : (
        <View style={styles.content}>
          {leading ? <View style={styles.leading}>{leading}</View> : null}
          <Text variant="button" color="inherit" style={{ color: labelColor }} numberOfLines={1}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leading: {
    marginRight: 10,
  },
});
