import { View, type ViewProps } from 'react-native';

import { useTheme, type RadiusKey, type SpacingKey } from '@/theme';

export type SurfaceVariant = 'default' | 'highlight' | 'elevated' | 'sunken';

export interface SurfaceProps extends ViewProps {
  variant?: SurfaceVariant;
  radius?: Extract<RadiusKey, 'md' | 'lg'>;
  padding?: SpacingKey;
}

/**
 * Card container. Radii are intentional: `md` (12) for rows and inputs, `lg` (24) for
 * hero cards and sheets. Never both at the same size on one screen by accident.
 */
export function Surface({
  variant = 'default',
  radius = 'lg',
  padding = 4,
  style,
  children,
  ...rest
}: SurfaceProps) {
  const theme = useTheme();
  const { colors } = theme;

  const backgroundColor = {
    default: colors.surface,
    highlight: colors.accent.soft,
    elevated: colors.surfaceElevated,
    sunken: colors.surfaceSunken,
  }[variant];

  const bordered = variant === 'default' || (variant === 'elevated' && !theme.isDark);

  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor,
          borderRadius: theme.radii[radius],
          padding: theme.spacing[padding],
          borderWidth: bordered ? 1 : 0,
          borderColor: bordered ? colors.line : 'transparent',
        },
        variant === 'elevated' ? theme.shadows.lifted : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}
