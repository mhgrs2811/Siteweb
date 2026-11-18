/**
 * Point d’entrée des contenus.
 * Les composants importent depuis "@/content" ; le jour où d’autres langues
 * arrivent, remplacer ces ré-exports par `getContent(locale)` (voir i18n/config.ts).
 */
import * as fr from "./fr";
import type { Locale } from "@/i18n/config";

const dictionaries = { fr } satisfies Record<Locale, typeof fr>;

export function getContent(locale: Locale = "fr") {
  return dictionaries[locale];
}

export * from "./fr";
