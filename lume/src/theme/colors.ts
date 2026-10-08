/**
 * Colour tokens.
 *
 * Every semantic role comes in two flavours:
 *  - `base`  : fills, rings, large numerals, decoration. Not guaranteed to pass AA as text.
 *  - `text`  : the same hue, darkened (light mode) or lightened (dark mode) so that running
 *              text on the page backgrounds passes WCAG AA (4.5:1). Verified by palette.test.ts.
 *
 * Raw values live here; components only ever consume `theme.colors.*`.
 */

export type ColorScheme = 'light' | 'dark';

export interface AccentColors {
  /** Decorative terracotta: score ring, large numerals, dots. */
  base: string;
  /** Fill of primary buttons; `textOnAccent` passes AA on top of it. */
  strong: string;
  /** Terracotta as running text or link on background / surface. */
  text: string;
  /** Tinted background for selected chips and highlighted cards. */
  soft: string;
}

export interface ToneColors {
  base: string;
  text: string;
  soft: string;
}

/** Tints of the generative "aura" visual: blurred discs of warm light on the page background. */
export interface AuraColors {
  champagne: string;
  terracotta: string;
  sage: string;
  highlight: string;
}

export interface ThemeColors {
  background: string;
  surface: string;
  /** Slightly lifted surface (dark mode mostly); equals `surface` in light mode. */
  surfaceElevated: string;
  /** Inset surface: segmented-control track, skeleton base. */
  surfaceSunken: string;
  ink: string;
  textSecondary: string;
  /** Label colour on `accent.strong` fills. */
  textOnAccent: string;
  line: string;
  /** Borders of unchecked controls: passes the 3:1 UI-component threshold on `surface`. */
  lineStrong: string;
  accent: AccentColors;
  champagne: ToneColors;
  success: ToneColors;
  warning: ToneColors;
  aura: AuraColors;
  /** Scrim behind sheets and dialogs. */
  overlay: string;
  skeleton: { base: string; highlight: string };
  shadow: string;
}

export const lightColors: ThemeColors = {
  background: '#F7F3EE',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSunken: '#EFE9E1',
  ink: '#1C1A17',
  textSecondary: '#6E675F',
  textOnAccent: '#FFFFFF',
  line: '#E7E0D7',
  lineStrong: '#948C81',
  accent: {
    base: '#B5684A',
    strong: '#9E5538',
    text: '#9E5538',
    soft: '#F6EAE3',
  },
  champagne: {
    base: '#CDB38B',
    text: '#74602F',
    soft: '#EFE6DA',
  },
  success: {
    base: '#7E9A7A',
    text: '#4F6B4C',
    soft: '#E9EFE6',
  },
  warning: {
    base: '#C98A3D',
    text: '#8C5A1C',
    soft: '#F6EBDA',
  },
  aura: {
    champagne: '#E9D7BC',
    terracotta: '#E8BBA3',
    sage: '#D6DFD1',
    highlight: '#FFFFFF',
  },
  overlay: 'rgba(28, 26, 23, 0.40)',
  skeleton: { base: '#EFE9E1', highlight: '#F7F3EE' },
  shadow: '#1C1A17',
};

export const darkColors: ThemeColors = {
  background: '#121110',
  surface: '#1C1A18',
  surfaceElevated: '#262321',
  surfaceSunken: '#26231F',
  ink: '#F2EDE6',
  textSecondary: '#A89F94',
  textOnAccent: '#121110',
  line: '#2B2825',
  lineStrong: '#6F675E',
  accent: {
    base: '#C97E60',
    strong: '#C97E60',
    text: '#E0987A',
    soft: '#2A1F1A',
  },
  champagne: {
    base: '#D9C39F',
    text: '#D9C39F',
    soft: '#2E2A22',
  },
  success: {
    base: '#93AD8E',
    text: '#A9C2A4',
    soft: '#1E2520',
  },
  warning: {
    base: '#D89C52',
    text: '#E3AE6A',
    soft: '#2A2117',
  },
  aura: {
    champagne: '#3F3425',
    terracotta: '#4F2E22',
    sage: '#22302A',
    highlight: '#2C2824',
  },
  overlay: 'rgba(0, 0, 0, 0.55)',
  skeleton: { base: '#26231F', highlight: '#302C27' },
  shadow: '#000000',
};

export const colorsByScheme: Record<ColorScheme, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};
