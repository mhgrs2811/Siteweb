/**
 * Internationalisation.
 * Aujourd’hui : français uniquement, URLs sans préfixe.
 * Pour ajouter le néerlandais ou l’anglais :
 *   1. créer src/content/nl (même forme que src/content/fr, le typage l’impose) ;
 *   2. ajouter la langue dans `locales` ci-dessous et dans src/content/index.ts ;
 *   3. déplacer les routes sous app/[lang]/ et générer les paramètres avec `locales`
 *      (voir README, section « Ajouter une langue »).
 */
export const locales = ["fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const localeMeta: Record<Locale, { label: string; htmlLang: string; ogLocale: string }> = {
  fr: { label: "Français", htmlLang: "fr-BE", ogLocale: "fr_BE" },
};
