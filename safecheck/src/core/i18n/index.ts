import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import fr from './locales/fr';

export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'fr';

export function detectLanguage(): SupportedLanguage {
  const code = getLocales()[0]?.languageCode ?? DEFAULT_LANGUAGE;
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(code) ? (code as SupportedLanguage) : DEFAULT_LANGUAGE;
}

export const resources = {
  fr: { translation: fr },
  en: { translation: en },
} as const;

let initialized = false;

export function initI18n(language: SupportedLanguage = detectLanguage()) {
  if (initialized) return i18n;
  // eslint-disable-next-line import/no-named-as-default-member -- faux positif connu avec i18next
  void i18n.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
    returnNull: false,
  });
  initialized = true;
  return i18n;
}

export { i18n };

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: (typeof resources)['fr'];
  }
}
