import type { Language } from '@/i18n';

const LOCALE_TAGS: Record<Language, string> = { fr: 'fr-FR', en: 'en-GB' };

/** "8 octobre 2026" / "8 October 2026" from an ISO timestamp; falls back to the raw date. */
export function formatConsentDate(iso: string, language: Language): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  try {
    return new Intl.DateTimeFormat(LOCALE_TAGS[language], {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}
