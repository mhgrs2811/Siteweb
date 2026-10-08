import { colorsByScheme, type ColorScheme, type ThemeColors } from '../colors';
import { AA_LARGE_TEXT, AA_NORMAL_TEXT, contrastRatio } from '../contrast';

interface Pair {
  name: string;
  foreground: string;
  background: string;
}

/**
 * Every combination in which a colour is used as running text in the app. If a new usage
 * appears in a component, add the pair here first.
 */
function textPairs(c: ThemeColors): Pair[] {
  return [
    { name: 'ink on background', foreground: c.ink, background: c.background },
    { name: 'ink on surface', foreground: c.ink, background: c.surface },
    { name: 'ink on elevated surface', foreground: c.ink, background: c.surfaceElevated },
    { name: 'ink on sunken surface', foreground: c.ink, background: c.surfaceSunken },
    { name: 'ink on accent soft', foreground: c.ink, background: c.accent.soft },
    { name: 'ink on champagne soft', foreground: c.ink, background: c.champagne.soft },
    { name: 'secondary on background', foreground: c.textSecondary, background: c.background },
    { name: 'secondary on surface', foreground: c.textSecondary, background: c.surface },
    {
      name: 'secondary on sunken surface',
      foreground: c.textSecondary,
      background: c.surfaceSunken,
    },
    { name: 'secondary on accent soft', foreground: c.textSecondary, background: c.accent.soft },
    { name: 'accent text on background', foreground: c.accent.text, background: c.background },
    { name: 'accent text on surface', foreground: c.accent.text, background: c.surface },
    { name: 'accent text on accent soft', foreground: c.accent.text, background: c.accent.soft },
    { name: 'label on accent strong', foreground: c.textOnAccent, background: c.accent.strong },
    {
      name: 'champagne text on background',
      foreground: c.champagne.text,
      background: c.background,
    },
    { name: 'champagne text on surface', foreground: c.champagne.text, background: c.surface },
    {
      name: 'champagne text on champagne soft',
      foreground: c.champagne.text,
      background: c.champagne.soft,
    },
    { name: 'success text on background', foreground: c.success.text, background: c.background },
    { name: 'success text on surface', foreground: c.success.text, background: c.surface },
    {
      name: 'success text on success soft',
      foreground: c.success.text,
      background: c.success.soft,
    },
    { name: 'warning text on background', foreground: c.warning.text, background: c.background },
    { name: 'warning text on surface', foreground: c.warning.text, background: c.surface },
    {
      name: 'warning text on warning soft',
      foreground: c.warning.text,
      background: c.warning.soft,
    },
  ];
}

/**
 * Large numerals, rings and control borders only need the 3:1 threshold (large text and
 * UI components). Tone dots next to a label are purely decorative and are not listed.
 */
function decorativePairs(c: ThemeColors): Pair[] {
  return [
    { name: 'accent base on background', foreground: c.accent.base, background: c.background },
    { name: 'accent base on surface', foreground: c.accent.base, background: c.surface },
    { name: 'success base on surface', foreground: c.success.base, background: c.surface },
    { name: 'line strong on surface', foreground: c.lineStrong, background: c.surface },
    { name: 'line strong on background', foreground: c.lineStrong, background: c.background },
  ];
}

const schemes: ColorScheme[] = ['light', 'dark'];

describe.each(schemes)('%s palette', (scheme) => {
  const colors = colorsByScheme[scheme];

  it.each(textPairs(colors).map((p) => [p.name, p] as const))(
    '%s passes AA for running text',
    (_name, pair) => {
      const ratio = contrastRatio(pair.foreground, pair.background);
      expect(ratio).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
    },
  );

  it.each(decorativePairs(colors).map((p) => [p.name, p] as const))(
    '%s passes the large-text / UI component threshold',
    (_name, pair) => {
      const ratio = contrastRatio(pair.foreground, pair.background);
      expect(ratio).toBeGreaterThanOrEqual(AA_LARGE_TEXT);
    },
  );

  it('keeps a visible but quiet separator', () => {
    const ratio = contrastRatio(colors.line, colors.background);
    expect(ratio).toBeGreaterThan(1.05);
    expect(ratio).toBeLessThan(2);
  });
});
