/**
 * CONFIGURATION CENTRALE — SNACK GORBUZ
 *
 * Toutes les coordonnées, horaires, liens et informations légales du site sont
 * pilotés depuis ce fichier. Les composants n'affichent QUE les valeurs réellement
 * renseignées : une valeur `null` ou un tableau vide masque le bloc concerné ou
 * déclenche un état provisoire sobre (« Informations bientôt disponibles »).
 *
 * RÈGLE : ne jamais remplir une valeur avec une donnée supposée ou inventée.
 * Les champs à compléter sont listés dans docs/A_COMPLETER_APRES_V1.txt.
 */

export type Weekday =
  | "lundi"
  | "mardi"
  | "mercredi"
  | "jeudi"
  | "vendredi"
  | "samedi"
  | "dimanche";

export interface OpeningSlot {
  /** ex. "11:30" */
  from: string;
  /** ex. "14:00" */
  to: string;
}

export interface OpeningDay {
  day: Weekday;
  /** Tableau vide = fermé ce jour-là. */
  slots: OpeningSlot[];
  /** Note facultative, ex. "Service continu". */
  note?: string;
}

export interface Address {
  street: string;
  postalCode: string;
  city: string;
  country: string;
  /** Lien Google Maps / itinéraire complet, fourni par le propriétaire. */
  mapsUrl: string | null;
  /** URL d'embed de la carte, uniquement si une adresse réelle est fournie. */
  mapEmbedUrl: string | null;
}

export interface SocialLink {
  /** Identifiant stable utilisé pour l'icône. */
  network: "instagram" | "facebook" | "tiktok" | "google" | "other";
  label: string;
  url: string;
}

export interface LogoAsset {
  /** Chemin local dans /public, ex. "/media/logo-gorbuz.svg". */
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  /** Baseline provisoire validée comme piste de travail par la direction artistique. */
  baseline: string;
  /** Signature éditoriale provisoire. */
  signature: string;
  /** URL de production, à renseigner avant la mise en ligne (metadataBase, sitemap). */
  siteUrl: string | null;
  country: string;
  locale: string;
  /** Logo officiel ; null = wordmark typographique provisoire. */
  logo: LogoAsset | null;
  address: Address | null;
  phone: string | null;
  email: string | null;
  openingHours: OpeningDay[];
  /** Mention affichée sous les horaires, ex. jours fériés. */
  openingNote: string | null;
  socials: SocialLink[];
  /** Lien de commande en ligne ou plateforme : null = CTA « Voir la carte ». */
  orderUrl: string | null;
  /** Lien de téléchargement d'une carte PDF officielle, si elle existe. */
  menuPdfUrl: string | null;
  legal: {
    /** Dénomination sociale exacte. */
    companyName: string | null;
    /** Forme juridique (SRL, SNC, personne physique…). */
    legalForm: string | null;
    /** Numéro d'entreprise BCE / TVA. */
    companyNumber: string | null;
    /** Adresse du siège si différente de l'adresse du snack. */
    registeredOffice: string | null;
    /** Responsable de la publication. */
    publisher: string | null;
    /** Hébergeur du site. */
    host: string | null;
    /** Responsable du traitement des données. */
    dataController: string | null;
    /** Email de contact pour les demandes RGPD. */
    privacyEmail: string | null;
    /** Date de dernière mise à jour des textes légaux (ISO). */
    updatedAt: string | null;
  };
}

export const siteConfig: SiteConfig = {
  name: "Snack Gorbuz",
  shortName: "Gorbuz",
  baseline: "La street-food qui a du caractère.",
  signature: "Du caractère. Du croustillant. Du Gorbuz.",
  siteUrl: null,
  country: "Belgique",
  locale: "fr-BE",
  logo: null,
  address: null,
  phone: null,
  email: null,
  openingHours: [],
  openingNote: null,
  socials: [],
  orderUrl: null,
  menuPdfUrl: null,
  legal: {
    companyName: null,
    legalForm: null,
    companyNumber: null,
    registeredOffice: null,
    publisher: null,
    host: null,
    dataController: null,
    privacyEmail: null,
    updatedAt: null,
  },
};

/* ------------------------------------------------------------------ */
/* Helpers conditionnels : utilisés par le header, le footer, la page  */
/* contact et la section « informations pratiques » de l'accueil.      */
/* ------------------------------------------------------------------ */

export const hasAddress = (c: SiteConfig = siteConfig): c is SiteConfig & { address: Address } =>
  c.address !== null && c.address.street.trim().length > 0;

export const hasHours = (c: SiteConfig = siteConfig) => c.openingHours.length > 0;

export const hasPhone = (c: SiteConfig = siteConfig) => !!c.phone && c.phone.trim().length > 0;

export const hasEmail = (c: SiteConfig = siteConfig) => !!c.email && c.email.trim().length > 0;

export const hasSocials = (c: SiteConfig = siteConfig) => c.socials.length > 0;

export const hasOrdering = (c: SiteConfig = siteConfig) => !!c.orderUrl;

export const hasAnyContact = (c: SiteConfig = siteConfig) =>
  hasAddress(c) || hasHours(c) || hasPhone(c) || hasEmail(c);

export const isLegalComplete = (c: SiteConfig = siteConfig) =>
  !!c.legal.companyName && !!c.legal.companyNumber && !!c.legal.publisher;

/** Format d'un numéro belge pour un lien tel: (retire espaces, points, slashs). */
export const telHref = (phone: string) => `tel:${phone.replace(/[\s./-]/g, "")}`;

/** Adresse sur une ligne, pour les balises meta et le footer. */
export const formatAddress = (a: Address) =>
  `${a.street}, ${a.postalCode} ${a.city}, ${a.country}`;

export const weekdayOrder: Weekday[] = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
];
