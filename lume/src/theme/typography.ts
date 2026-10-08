import type { TextStyle } from 'react-native';

/**
 * Typography tokens.
 *
 * Fraunces, a soft display serif, carries headlines and score numerals: light weights at large
 * sizes for an editorial feel, medium for numerals that need presence. Italic cuts mark one
 * accented word inside a headline (see the Headline component). Instrument Sans, a clean
 * grotesk with a little character, carries everything else.
 *
 * Font files are loaded at start-up with `useFonts` (see src/app/_layout.tsx), so the family
 * names below are the static instance names exported by @expo-google-fonts.
 */
export const fontFamilies = {
  display: 'Fraunces_300Light',
  displayItalic: 'Fraunces_300Light_Italic',
  displayRegular: 'Fraunces_400Regular',
  displayRegularItalic: 'Fraunces_400Regular_Italic',
  displayMedium: 'Fraunces_500Medium',
  text: 'InstrumentSans_400Regular',
  textMedium: 'InstrumentSans_500Medium',
  textSemibold: 'InstrumentSans_600SemiBold',
} as const;

export const typography = {
  display: {
    fontFamily: fontFamilies.display,
    fontSize: 46,
    lineHeight: 52,
    letterSpacing: -1.2,
  },
  displayItalic: {
    fontFamily: fontFamilies.displayItalic,
    fontSize: 46,
    lineHeight: 52,
    letterSpacing: -1.2,
  },
  h1: {
    fontFamily: fontFamilies.displayRegular,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.6,
  },
  h1Italic: {
    fontFamily: fontFamilies.displayRegularItalic,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.6,
  },
  h2: {
    fontFamily: fontFamilies.displayMedium,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.2,
  },
  h3: {
    fontFamily: fontFamilies.textSemibold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.1,
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
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  caption: {
    fontFamily: fontFamilies.text,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  captionMedium: {
    fontFamily: fontFamilies.textMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  overline: {
    fontFamily: fontFamilies.textSemibold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  score: {
    fontFamily: fontFamilies.displayMedium,
    fontSize: 72,
    lineHeight: 76,
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'],
  },
  scoreSmall: {
    fontFamily: fontFamilies.displayMedium,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.6,
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
  displayItalic: 1.2,
  h1: 1.25,
  h1Italic: 1.25,
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
