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
const PADDING: Record<ButtonSize, number> = { md: 20, lg: 24 };

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

  let backgroundColor = 'transparent';
  let borderColor = 'transparent';
  let labelColor = colors.ink;

  switch (variant) {
    case 'primary':
      backgroundColor = inactive && !loading ? colors.line : colors.accent.strong;
      labelColor = inactive && !loading ? colors.textSecondary : colors.textOnAccent;
      break;
    case 'secondary':
      borderColor = inactive ? colors.lineStrong : colors.ink;
      labelColor = inactive ? colors.textSecondary : colors.ink;
      break;
    case 'ghost':
      labelColor = inactive ? colors.textSecondary : colors.accent.text;
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
          borderWidth: variant === 'secondary' ? 1.5 : 0,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
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
