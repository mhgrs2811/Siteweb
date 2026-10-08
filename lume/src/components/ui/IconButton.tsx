import type { StyleProp, ViewStyle } from 'react-native';

import type { HapticIntent } from '@/lib/haptics';
import { useTheme } from '@/theme';

import { Icon, type IconName, type IconSize } from './Icon';
import { Pressable, type PressableProps } from './Pressable';

export type IconButtonVariant = 'ghost' | 'surface' | 'soft';

export interface IconButtonProps extends Omit<PressableProps, 'style' | 'children' | 'haptic'> {
  icon: IconName;
  /** Required: an icon-only control must describe itself to screen readers. */
  accessibilityLabel: string;
  variant?: IconButtonVariant;
  size?: number;
  iconSize?: IconSize;
  color?: string;
  haptic?: HapticIntent | null;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  icon,
  accessibilityLabel,
  variant = 'ghost',
  size = 44,
  iconSize = 24,
  color,
  haptic = 'selection',
  disabled,
  style,
  ...rest
}: IconButtonProps) {
  const { colors, radii } = useTheme();

  const backgroundColor =
    variant === 'surface'
      ? colors.surface
      : variant === 'soft'
        ? colors.accent.soft
        : 'transparent';
  const borderColor = variant === 'surface' ? colors.line : 'transparent';
  const iconColor = color ?? (variant === 'soft' ? colors.accent.text : colors.ink);

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      haptic={haptic}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      hitSlop={size < 44 ? (44 - size) / 2 : undefined}
      style={[
        {
          width: size,
          height: size,
          borderRadius: radii.pill,
          backgroundColor,
          borderColor,
          borderWidth: variant === 'surface' ? 1 : 0,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Icon name={icon} size={iconSize} color={iconColor} />
    </Pressable>
  );
}
