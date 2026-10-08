import {
  contrastLevel,
  contrastRatio,
  formatRatio,
  hexToRgb,
  meetsAA,
  relativeLuminance,
} from '../contrast';

describe('hexToRgb', () => {
  it('parses six-digit hex', () => {
    expect(hexToRgb('#B5684A')).toEqual({ r: 181, g: 104, b: 74 });
  });

  it('expands three-digit hex', () => {
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('rejects malformed input', () => {
    expect(() => hexToRgb('terracotta')).toThrow('Invalid hex colour');
    expect(() => hexToRgb('#12345')).toThrow('Invalid hex colour');
  });
});

describe('relativeLuminance', () => {
  it('is 0 for black and 1 for white', () => {
    expect(relativeLuminance('#000000')).toBe(0);
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 5);
  });
});

describe('contrastRatio', () => {
  it('is 21 between black and white, in either order', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 5);
  });

  it('is 1 for identical colours', () => {
    expect(contrastRatio('#B5684A', '#B5684A')).toBeCloseTo(1, 5);
  });

  it('matches the hand-checked value for white on the PRD terracotta', () => {
    expect(contrastRatio('#FFFFFF', '#B5684A')).toBeCloseTo(4.16, 2);
  });
});

describe('contrastLevel and meetsAA', () => {
  it('flags white on PRD terracotta as large-text only', () => {
    expect(contrastLevel('#FFFFFF', '#B5684A')).toBe('aa-large');
    expect(meetsAA('#FFFFFF', '#B5684A')).toBe(false);
    expect(meetsAA('#FFFFFF', '#B5684A', true)).toBe(true);
  });

  it('passes white on the strong terracotta used for buttons', () => {
    expect(contrastLevel('#FFFFFF', '#9E5538')).toBe('aa');
  });

  it('fails champagne on ivory', () => {
    expect(contrastLevel('#CDB38B', '#F7F3EE')).toBe('fail');
  });
});

describe('formatRatio', () => {
  it('formats with two decimals and a locale-aware separator', () => {
    expect(formatRatio(4.1649, 'en')).toBe('4.16');
    expect(formatRatio(4.1649, 'fr')).toBe('4,16');
  });
});
