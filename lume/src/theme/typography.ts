import type { TextStyle } from 'react-native';

/**
 * Typography tokens.
 *
 * Fraunces (display serif) carries titles and score numerals; Inter carries everything else.
 * Font files are loaded at start-up with `useFonts` (see src/app/_layout.tsx), so the family
 * names below are the static instance names exported by @expo-google-fonts.
 */
export const fontFamilies = {
  display: 'Fraunces_500Medium',
  displayRegular: 'Fraunces_400Regular',
  displayItalic: 'Fraunces_400Regular_Italic',
  text: 'Inter_400Regular',
  textMedium: 'Inter_500Medium',
  textSemibold: 'Inter_600SemiBold',
} as const;

export const typography = {
  display: {
    fontFamily: fontFamilies.display,
    fontSize: 44,
    lineHeight: 48,
    letterSpacing: -0.6,
  },
  h1: {
    fontFamily: fontFamilies.display,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: fontFamilies.display,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: 0,
  },
  h3: {
    fontFamily: fontFamilies.textSemibold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body: {
    fontFamily: fontFamilies.text,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontFamily: fontFamilies.textMedium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodySmall: {
    fontFamily: fontFamilies.text,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  label: {
    fontFamily: fontFamilies.textMedium,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0,
  },
  button: {
    fontFamily: fontFamilies.textSemibold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: fontFamilies.text,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
  captionMedium: {
    fontFamily: fontFamilies.textMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
  overline: {
    fontFamily: fontFamilies.textSemibold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  score: {
    fontFamily: fontFamilies.display,
    fontSize: 72,
    lineHeight: 76,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  scoreSmall: {
    fontFamily: fontFamilies.display,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;

/**
 * Dynamic Type is respected everywhere, but very large multipliers would break the layout of
 * headlines and numerals. Body copy keeps the most headroom.
 */
export const maxFontSizeMultiplier: Record<TypographyVariant, number> = {
  display: 1.2,
  h1: 1.25,
  h2: 1.3,
  h3: 1.4,
  body: 1.6,
  bodyMedium: 1.6,
  bodySmall: 1.6,
  label: 1.5,
  button: 1.4,
  caption: 1.6,
  captionMedium: 1.6,
  overline: 1.4,
  score: 1.1,
  scoreSmall: 1.2,
};
