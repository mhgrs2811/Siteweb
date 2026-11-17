/**
 * ============================================================
 * CONFIGURATION UNIQUE DU RESTAURANT — SNACK GORBUZ
 * ============================================================
 * C'est LE fichier à modifier pour changer les coordonnées, les horaires,
 * les liens sociaux, les liens de commande et l'activation des boutons.
 * Tout le site (pages, footer, données structurées SEO) lit ces valeurs.
 *
 * Source des données : capture de la fiche Google fournie par la cliente
 * (références/fiche_google_Snack_Gorbuz.png) et documents de cadrage V1.
 *
 * ⚠ Deux écarts constatés entre la capture Google et les textes de cadrage :
 *   - Rue : la capture affiche « Leuvensesteenweg » (orthographe officielle
 *     de la chaussée à Zaventem) ; les textes écrivent « Leuvensteenweg ».
 *     → La capture fait foi ici. À confirmer par l'établissement.
 *   - Samedi : la capture affiche 12:00–22:30 ; les textes indiquent 12:00–22:00.
 *     → La capture fait foi ici. À confirmer par l'établissement.
 */

export type DayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

/** Plage horaire au format "HH:MM" (24 h). `null` = fermé ce jour-là. */
export type DayHours = { open: string; close: string } | null;

export interface RestaurantConfig {
  name: string;
  /** Raison sociale / dénomination légale — non fournie à ce jour. */
  legalName: string | null;
  /** Catégorie affichée sur la fiche Google. */
  category: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
    countryCode: 'BE';
  };
  /** Coordonnées GPS — non fournies. À compléter si besoin d'une carte. */
  geo: { lat: number; lng: number } | null;
  phone: {
    /** Format affiché à l'écran. */
    display: string;
    /** Format international pour le lien `tel:`. */
    e164: string;
  };
  email: string | null;
  hours: Record<DayKey, DayHours>;
  priceRange: {
    display: string;
    /** Valeur pour les données structurées schema.org. */
    schema: string;
  };
  /** Informations lues sur la fiche Google (capture fournie). */
  googleListing: {
    ratingDisplay: string;
    ratingValue: number;
    reviewCount: number;
    /** Date de la capture (mois) — affichée pour contextualiser la note. */
    capturedOn: string;
    /** URL de la fiche Google — non fournie ; un lien de recherche est construit à défaut. */
    url: string | null;
    /** Options mentionnées sur la fiche (boutons « À emporter » / « Se faire livrer »). */
    mentions: { takeaway: boolean; delivery: boolean };
  };
  /**
   * Boutons d'action configurables.
   * Tant que `enabled` est `false` ou que `url` est `null`, le bouton n'est PAS affiché.
   */
  cta: {
    order: { enabled: boolean; url: string | null; label: string };
    delivery: { enabled: boolean; url: string | null; label: string };
    reservation: { enabled: boolean; url: string | null; label: string };
  };
  /** Profils sociaux — affichés uniquement si une URL est renseignée. */
  social: {
    instagram: string | null;
    facebook: string | null;
    tiktok: string | null;
  };
  seo: {
    siteName: string;
    defaultTitle: string;
    defaultDescription: string;
    locale: string;
    /** Chemin vers l'image Open Graph (1200 × 630), générée par `node tools/og/generate.mjs`. */
    ogImage: string;
  };
}

export const restaurant: RestaurantConfig = {
  name: 'Snack Gorbuz',
  legalName: null,
  category: 'Restauration rapide',

  address: {
    street: 'Leuvensesteenweg 241',
    postalCode: '1932',
    city: 'Zaventem',
    country: 'Belgique',
    countryCode: 'BE',
  },
  geo: null,

  phone: {
    display: '0470 90 60 36',
    e164: '+32470906036',
  },
  email: null,

  hours: {
    monday: { open: '10:30', close: '22:00' },
    tuesday: { open: '10:30', close: '22:00' },
    wednesday: { open: '10:30', close: '22:00' },
    thursday: { open: '10:30', close: '22:00' },
    friday: { open: '10:30', close: '22:00' },
    saturday: { open: '12:00', close: '22:30' },
    sunday: null,
  },

  priceRange: {
    display: '1–20 €',
    schema: '€1-20',
  },

  googleListing: {
    ratingDisplay: '3,9',
    ratingValue: 3.9,
    reviewCount: 190,
    capturedOn: 'novembre 2026',
    url: null,
    mentions: { takeaway: true, delivery: true },
  },

  cta: {
    order: { enabled: false, url: null, label: 'Commander' },
    delivery: { enabled: false, url: null, label: 'Se faire livrer' },
    reservation: { enabled: false, url: null, label: 'Réserver' },
  },

  social: {
    instagram: null,
    facebook: null,
    tiktok: null,
  },

  seo: {
    siteName: 'Snack Gorbuz',
    defaultTitle: 'Snack Gorbuz — Snack à Zaventem, Leuvensesteenweg 241',
    defaultDescription:
      'Snack Gorbuz, restauration rapide à Zaventem (Leuvensesteenweg 241). Ouvert du lundi au samedi. Adresse, horaires, téléphone et carte.',
    locale: 'fr_BE',
    ogImage: '/og-image.jpg',
  },
};
