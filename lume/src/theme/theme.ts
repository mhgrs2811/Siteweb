import { colorsByScheme, type ColorScheme, type ThemeColors } from './colors';
import { motion } from './motion';
import { makeShadows, type Shadows } from './shadows';
import { layout, radii, spacing } from './spacing';
import { maxFontSizeMultiplier, typography } from './typography';

export interface Theme {
  scheme: ColorScheme;
  isDark: boolean;
  colors: ThemeColors;
  typography: typeof typography;
  maxFontSizeMultiplier: typeof maxFontSizeMultiplier;
  spacing: typeof spacing;
  layout: typeof layout;
  radii: typeof radii;
  shadows: Shadows;
  motion: typeof motion;
}

function buildTheme(scheme: ColorScheme): Theme {
  return {
    scheme,
    isDark: scheme === 'dark',
    colors: colorsByScheme[scheme],
    typography,
    maxFontSizeMultiplier,
    spacing,
    layout,
    radii,
    shadows: makeShadows(scheme),
    motion,
  };
}

export const themes: Record<ColorScheme, Theme> = {
  light: buildTheme('light'),
  dark: buildTheme('dark'),
};
