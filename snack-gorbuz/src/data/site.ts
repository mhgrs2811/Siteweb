import type { SiteConfig } from "./types";

/**
 * CONFIGURATION DU SITE — SNACK GORBUZ
 * -------------------------------------
 * Fichier unique pour les coordonnées, horaires, réseaux et informations légales.
 * Règle : aucune donnée inventée. Tant qu'une information n'est pas confirmée par
 * le propriétaire, elle reste `null` (ou tableau vide) et le site masque ou
 * remplace proprement son affichage.
 *
 * Exemple une fois les informations reçues :
 *   phone: "+32 ...",
 *   address: { street: "…", postalCode: "…", city: "…", country: "Belgique",
 *              mapsUrl: "https://maps.app.goo.gl/…", mapEmbedUrl: null },
 *   openingHours: [ { day: 1, ranges: ["11:30-14:00", "17:30-22:00"] }, … ]
 */
export const siteConfig: SiteConfig = {
  brand: {
    name: "Snack Gorbuz",
    shortName: "Gorbuz",
    baseline: "La street-food qui a du caractère.",
    logo: null,
  },
  locale: "fr-BE",
  country: "Belgique",
  city: null,
  address: null,
  phone: null,
  email: null,
  openingHours: [],
  hoursNote: null,
  socials: [],
  orderUrl: null,
  googleBusinessUrl: null,
  siteUrl: null,
  legal: {
    complete: false,
    companyName: null,
    legalForm: null,
    companyNumber: null,
    vatNumber: null,
    registeredOffice: null,
    publisherName: null,
    hostName: null,
    hostAddress: null,
    dataController: null,
    contactEmail: null,
  },
};

/** Jours de la semaine (index 0 = dimanche, comme Date.getDay()). */
export const dayNames = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
] as const;

export const hasAddress = (c: SiteConfig = siteConfig) => c.address !== null;
export const hasPhone = (c: SiteConfig = siteConfig) => Boolean(c.phone);
export const hasEmail = (c: SiteConfig = siteConfig) => Boolean(c.email);
export const hasHours = (c: SiteConfig = siteConfig) => c.openingHours.length > 0;
export const hasSocials = (c: SiteConfig = siteConfig) => c.socials.length > 0;
export const hasContact = (c: SiteConfig = siteConfig) => hasPhone(c) || hasEmail(c);
export const hasOrder = (c: SiteConfig = siteConfig) => Boolean(c.orderUrl);
export const hasAnyPractical = (c: SiteConfig = siteConfig) =>
  hasAddress(c) || hasHours(c) || hasContact(c);
