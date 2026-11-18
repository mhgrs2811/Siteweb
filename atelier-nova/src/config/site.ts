/**
 * Configuration centrale de l’agence.
 * Nom, coordonnées, réseaux, mentions légales : tout se modifie ici.
 * Les champs laissés vides ("") ne sont pas affichés sur le site.
 */
export const site = {
  /** Nom complet. Le logo affiche le premier mot en capitales et le dernier en italique. */
  name: "Atelier Nova",
  legalName: "Atelier Nova", // ex. « Atelier Nova SRL » — à compléter
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ateliernova.be").replace(/\/$/, ""),
  locale: "fr_BE",
  tagline: "Studio web nouvelle génération",
  description:
    "Atelier Nova conçoit des sites vitrines, e-commerce et restaurants sur mesure : direction artistique humaine, production accélérée par l’IA, performance mesurée. Studio basé à Bruxelles.",

  city: "Bruxelles",
  region: "Belgique",
  /** Zone desservie, affichée dans le hero et le pied de page. */
  area: "Bruxelles · Wallonie · Flandre · à distance",

  contact: {
    email: "hello@ateliernova.be",
    /** Format international, ex. "+32470000000". Laisser vide pour masquer. */
    phone: "",
    phoneDisplay: "",
    /** Adresse postale (laisser vide si studio sans accueil public). */
    address: "",
  },

  /** Message de disponibilité affiché dans le hero et le contact. */
  availability: "Planning ouvert pour les projets de début 2027",
  /** Délai de réponse annoncé (formulation indicative, pas une garantie). */
  responseTime: "Nous répondons généralement sous deux jours ouvrés.",

  socials: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Behance", href: "https://www.behance.net/" },
  ],

  legal: {
    /** Numéro d’entreprise BCE / KBO — obligatoire en Belgique. */
    companyNumber: "BE 0000.000.000 — à compléter",
    registeredOffice: "Adresse du siège — à compléter",
    publisher: "Responsable de publication — à compléter",
    host: "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    lastUpdate: "18 novembre 2026",
  },
} as const;

export type Site = typeof site;

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
