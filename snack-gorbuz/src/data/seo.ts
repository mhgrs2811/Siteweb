import type { PageSeo } from "./types";

/**
 * MÉTADONNÉES PAR PAGE — titres et descriptions uniques.
 * `headerTone` indique la couleur du header au-dessus de la première section.
 */
export const seo: Record<
  "home" | "menu" | "concept" | "gallery" | "contact" | "legalNotice" | "privacy" | "notFound",
  PageSeo
> = {
  home: {
    title: "Snack Gorbuz — La street-food qui a du caractère",
    description:
      "Snack Gorbuz : durums, kumpirs et mitraillettes. Un snack de street-food contemporaine en Belgique. Découvrez la carte et l’univers Gorbuz.",
    headerTone: "dark",
  },
  menu: {
    title: "La carte — Snack Gorbuz",
    description:
      "La carte Snack Gorbuz par familles : durums, kumpirs et mitraillettes. Détails, options et prix publiés avec la carte officielle.",
    headerTone: "light",
  },
  concept: {
    title: "Le concept — Snack Gorbuz",
    description:
      "L’esprit Gorbuz : une street-food contemporaine, généreuse et affirmée. Découvrez le positionnement et l’identité du snack.",
    headerTone: "dark",
  },
  gallery: {
    title: "Galerie — Snack Gorbuz",
    description:
      "L’univers Snack Gorbuz en images : produits, lieu, coulisses et équipe.",
    headerTone: "light",
  },
  contact: {
    title: "Contact et accès — Snack Gorbuz",
    description:
      "Adresse, horaires et contact du Snack Gorbuz. Toutes les informations pratiques sur une seule page.",
    headerTone: "dark",
  },
  legalNotice: {
    title: "Mentions légales — Snack Gorbuz",
    description: "Mentions légales du site Snack Gorbuz.",
    headerTone: "light",
    noIndex: true,
  },
  privacy: {
    title: "Politique de confidentialité — Snack Gorbuz",
    description: "Politique de confidentialité du site Snack Gorbuz.",
    headerTone: "light",
    noIndex: true,
  },
  notFound: {
    title: "Page introuvable — Snack Gorbuz",
    description: "La page demandée n’existe pas.",
    headerTone: "dark",
    noIndex: true,
  },
};

/** Ton du header selon le chemin (utilisé côté client par le Header). */
export const headerToneByPath: Record<string, PageSeo["headerTone"]> = {
  "/": seo.home.headerTone,
  "/carte": seo.menu.headerTone,
  "/concept": seo.concept.headerTone,
  "/galerie": seo.gallery.headerTone,
  "/contact": seo.contact.headerTone,
  "/mentions-legales": seo.legalNotice.headerTone,
  "/confidentialite": seo.privacy.headerTone,
};
