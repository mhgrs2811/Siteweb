import { getLocales } from 'expo-localization';
import i18n, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fr from './locales/fr.json';

export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

/** Devices set to neither French nor English fall back to English. */
export const DEFAULT_LANGUAGE: Language = 'en';

export const resources = {
  fr: { translation: fr },
  en: { translation: en },
} as const;

export function isSupportedLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

export function detectDeviceLanguage(): Language {
  const code = getLocales()[0]?.languageCode?.toLowerCase();
  return isSupportedLanguage(code) ? code : DEFAULT_LANGUAGE;
}

/** A persisted preference wins; otherwise the device language decides. */
export function resolveLanguage(preference: Language | null): Language {
  return preference ?? detectDeviceLanguage();
}

/**
 * Initialises i18next synchronously (resources are bundled, so no loading step) or switches the
 * active language when already initialised. Safe to call on every render of the root layout.
 */
export function initI18n(language: Language): I18nInstance {
  if (!i18n.isInitialized) {
    // eslint-disable-next-line import/no-named-as-default-member -- the instance API is intended
    void i18n.use(initReactI18next).init({
      resources,
      lng: language,
      fallbackLng: DEFAULT_LANGUAGE,
      supportedLngs: SUPPORTED_LANGUAGES,
      initAsync: false,
      interpolation: { escapeValue: false },
      returnNull: false,
    });
  } else if (i18n.language !== language) {
    // eslint-disable-next-line import/no-named-as-default-member -- the instance API is intended
    void i18n.changeLanguage(language);
  }
  return i18n;
}

export default i18n;
