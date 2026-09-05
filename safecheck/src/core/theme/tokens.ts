/**
 * Design tokens SafeCheck.
 *
 * Palette volontairement calme : bleu profond rassurant, neutres chauds.
 * Les couleurs de risque sont pensées pour rester lisibles par les personnes
 * daltoniennes (jamais utilisées seules : toujours accompagnées d'une icône
 * et d'un libellé). Tous les couples texte/fond respectent WCAG AA (≥ 4.5:1).
 */
export const palette = {
  blue900: '#12324F',
  blue700: '#1F4E79',
  blue500: '#2F6DA8',
  blue100: '#DCE9F5',
  blue50: '#EEF4FA',

  neutral900: '#1C1F23',
  neutral700: '#3D434B',
  neutral500: '#6B7280',
  neutral300: '#C9CED6',
  neutral200: '#E3E6EB',
  neutral100: '#F2F4F7',
  neutral0: '#FFFFFF',

  green700: '#1E6B3A',
  green100: '#DDF3E4',
  amber700: '#8A5A00',
  amber100: '#FFEFC7',
  red700: '#A32D2D',
  red100: '#FBE1E1',
} as const;

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  textInverse: string;
  primary: string;
  primaryPressed: string;
  onPrimary: string;
  focus: string;
  risk: Record<'unknown' | 'low' | 'moderate' | 'high', { bg: string; fg: string; accent: string }>;
  severity: Record<'info' | 'warning' | 'critical', { bg: string; fg: string }>;
}

export const lightColors: ThemeColors = {
  background: palette.blue50,
  surface: palette.neutral0,
  surfaceAlt: palette.neutral100,
  border: palette.neutral200,
  text: palette.neutral900,
  textMuted: palette.neutral700,
  textInverse: palette.neutral0,
  primary: palette.blue700,
  primaryPressed: palette.blue900,
  onPrimary: palette.neutral0,
  focus: palette.blue500,
  risk: {
    unknown: { bg: palette.neutral100, fg: palette.neutral700, accent: palette.neutral500 },
    low: { bg: palette.green100, fg: palette.green700, accent: palette.green700 },
    moderate: { bg: palette.amber100, fg: palette.amber700, accent: palette.amber700 },
    high: { bg: palette.red100, fg: palette.red700, accent: palette.red700 },
  },
  severity: {
    info: { bg: palette.blue100, fg: palette.blue900 },
    warning: { bg: palette.amber100, fg: palette.amber700 },
    critical: { bg: palette.red100, fg: palette.red700 },
  },
};

export const darkColors: ThemeColors = {
  background: '#0F1720',
  surface: '#182230',
  surfaceAlt: '#1F2B3A',
  border: '#2E3B4B',
  text: '#F3F5F8',
  textMuted: '#B9C2CE',
  textInverse: palette.neutral900,
  primary: '#5B9BE0',
  primaryPressed: '#7DB1EA',
  onPrimary: '#0B1B2C',
  focus: '#8CC0F5',
  risk: {
    unknown: { bg: '#243040', fg: '#D5DCE5', accent: '#9AA6B5' },
    low: { bg: '#163A26', fg: '#B8EBC8', accent: '#5CCB84' },
    moderate: { bg: '#4A3A0F', fg: '#FFE2A0', accent: '#F2C15C' },
    high: { bg: '#4E1F1F', fg: '#FFC5C5', accent: '#F27B7B' },
  },
  severity: {
    info: { bg: '#1E3350', fg: '#CFE3FA' },
    warning: { bg: '#4A3A0F', fg: '#FFE2A0' },
    critical: { bg: '#4E1F1F', fg: '#FFC5C5' },
  },
};

/** Échelle d'espacement base 4. */
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 } as const;

/**
 * Typographie : 16pt minimum partout, 18pt pour le corps courant.
 * Ces tailles sont multipliées par le réglage système (allowFontScaling).
 */
export const typography = {
  display: { fontSize: 32, lineHeight: 40, fontWeight: '700' as const },
  title: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
  heading: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
  body: { fontSize: 18, lineHeight: 28, fontWeight: '400' as const },
  bodyStrong: { fontSize: 18, lineHeight: 28, fontWeight: '600' as const },
  caption: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
} as const;

export type TypographyVariant = keyof typeof typography;

/** Zone tactile minimale (WCAG 2.5.5 / Apple HIG / Material). */
export const MIN_TOUCH_TARGET = 48;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
} as const;
