import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { useTheme, type ThemeColors, type TypographyVariant } from '@/theme';

export type TextColor =
  'ink' | 'secondary' | 'accent' | 'onAccent' | 'success' | 'warning' | 'champagne' | 'inherit';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: TextColor;
  align?: TextStyle['textAlign'];
}

function resolveColor(colors: ThemeColors, color: TextColor): string | undefined {
  switch (color) {
    case 'ink':
      return colors.ink;
    case 'secondary':
      return colors.textSecondary;
    case 'accent':
      return colors.accent.text;
    case 'onAccent':
      return colors.textOnAccent;
    case 'success':
      return colors.success.text;
    case 'warning':
      return colors.warning.text;
    case 'champagne':
      return colors.champagne.text;
    case 'inherit':
      return undefined;
  }
}

/**
 * The only way to render text in the app. Picks a typography token, a semantic colour and the
 * matching Dynamic Type cap, so no screen ever hard-codes a font or a size.
 */
export function Text({
  variant = 'body',
  color = 'ink',
  align,
  style,
  maxFontSizeMultiplier,
  children,
  ...rest
}: TextProps) {
  const theme = useTheme();
  const resolved = resolveColor(theme.colors, color);

  return (
    <RNText
      {...rest}
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? theme.maxFontSizeMultiplier[variant]}
      style={[
        theme.typography[variant],
        resolved ? { color: resolved } : null,
        align ? { textAlign: align } : null,
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
