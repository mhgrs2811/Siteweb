import { DEFAULT_LANGUAGE, isSupportedLanguage, resolveLanguage } from '..';

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'de' }],
}));

describe('language resolution', () => {
  it('recognises the two supported languages only', () => {
    expect(isSupportedLanguage('fr')).toBe(true);
    expect(isSupportedLanguage('en')).toBe(true);
    expect(isSupportedLanguage('de')).toBe(false);
    expect(isSupportedLanguage(undefined)).toBe(false);
  });

  it('prefers the persisted preference', () => {
    expect(resolveLanguage('fr')).toBe('fr');
  });

  it('falls back to English for an unsupported device language', () => {
    expect(resolveLanguage(null)).toBe(DEFAULT_LANGUAGE);
    expect(DEFAULT_LANGUAGE).toBe('en');
  });
});
