import { View, type ViewProps } from 'react-native';

import { useTheme, type RadiusKey, type SpacingKey } from '@/theme';

export type SurfaceVariant = 'default' | 'highlight' | 'elevated' | 'sunken' | 'outline';

export interface SurfaceProps extends ViewProps {
  variant?: SurfaceVariant;
  radius?: Extract<RadiusKey, 'md' | 'lg'>;
  padding?: SpacingKey;
}

/**
 * Card container. In light mode cards are borderless sheets of white paper lifted by a warm,
 * diffuse shadow; in dark mode they are a step lighter than the page with a hairline edge.
 * Radii are intentional: `md` (12) for rows and inputs, `lg` (24) for hero cards and sheets.
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
    outline: 'transparent',
  }[variant];

  const hairline =
    variant === 'outline' || (theme.isDark && (variant === 'default' || variant === 'elevated'));

  const shadow =
    variant === 'default'
      ? theme.shadows.soft
      : variant === 'elevated'
        ? theme.shadows.lifted
        : null;

  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor,
          borderRadius: theme.radii[radius],
          padding: theme.spacing[padding],
          borderWidth: hairline ? 1 : 0,
          borderColor: hairline ? colors.line : 'transparent',
        },
        shadow,
        style,
      ]}
    >
      {children}
    </View>
  );
}
