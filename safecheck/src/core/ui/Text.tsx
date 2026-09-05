import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useTheme, type TypographyVariant } from '@/core/theme';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: 'text' | 'textMuted' | 'textInverse' | 'primary' | 'onPrimary';
  align?: 'left' | 'center';
}

/**
 * Texte thémé. Taille min 16pt, respecte le réglage système de taille de police
 * (allowFontScaling activé par défaut, avec un plafond pour préserver la mise en page).
 */
export function Text({ variant = 'body', color = 'text', align = 'left', style, ...rest }: TextProps) {
  const { colors, typography } = useTheme();
  return (
    <RNText
      maxFontSizeMultiplier={1.6}
      {...rest}
      style={[typography[variant], { color: colors[color], textAlign: align }, style]}
    />
  );
}
