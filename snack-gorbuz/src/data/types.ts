/**
 * Types partagés du site Snack Gorbuz.
 * Toutes les données éditables (coordonnées, carte, galerie, textes) passent par ces types.
 * Une valeur `null` ou un tableau vide signifie « information non encore fournie » :
 * les composants masquent alors l'affichage ou montrent un état provisoire.
 */

export type MediaRatio = "1:1" | "4:5" | "3:4" | "4:3" | "3:2" | "16:9" | "21:9";

/** Emplacement média remplaçable. `src` null = pas encore de média réel. */
export interface MediaSlotData {
  /** Identifiant stable, utilisé aussi comme nom de fichier recommandé (ex. durum-signature). */
  id: string;
  /** Chemin public du média réel, ex. "/images/durum-signature.webp". null tant qu'il n'existe pas. */
  src: string | null;
  /** Texte alternatif à utiliser quand le média réel est fourni. */
  alt: string;
  /** Légende visible du bloc provisoire (ce que la photo devra montrer). */
  caption: string;
  ratio: MediaRatio;
}

export type FamilySlug = "durums" | "kumpirs" | "mitraillettes";

export interface Family {
  slug: FamilySlug;
  name: string;
  /** Définition générique de la famille (pas une recette Gorbuz). */
  definition: string;
  /** Accroche éditoriale provisoire. */
  tagline: string;
  media: MediaSlotData;
}

export interface ProductOption {
  label: string;
  /** Supplément en euros. 0 = inclus. */
  priceDelta: number;
}

export interface Product {
  id: string;
  familySlug: FamilySlug;
  name: string;
  description: string | null;
  /** Prix TTC en euros. null = prix non communiqué. */
  price: number | null;
  /** Variantes (ex. tailles) sous forme { label, price }. */
  variants: { label: string; price: number }[];
  options: ProductOption[];
  /** Allergènes confirmés uniquement. */
  allergens: string[];
  badge: "nouveau" | "signature" | "populaire" | null;
  /** undefined = disponibilité non gérée. */
  available?: boolean;
  media: MediaSlotData | null;
}

export interface FeaturedProduct {
  productId: string;
  /** Titre éditorial de la mise en avant (ex. « La vedette du moment »). */
  headline: string;
  text: string;
}

export interface OpeningSlot {
  /** 0 = dimanche … 6 = samedi */
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Plages horaires au format "11:30-14:00". Tableau vide = fermé. */
  ranges: string[];
}

export interface SocialLink {
  network: "instagram" | "facebook" | "tiktok" | "autre";
  label: string;
  url: string;
}

export interface Address {
  street: string;
  postalCode: string;
  city: string;
  country: string;
  /** Lien d'itinéraire réel (Google Maps, OpenStreetMap…). */
  mapsUrl: string | null;
  /** URL d'intégration de carte (iframe). null = pas de carte affichée. */
  mapEmbedUrl: string | null;
}

export interface LegalInfo {
  /** Passe à true quand toutes les informations légales réelles sont saisies. */
  complete: boolean;
  companyName: string | null;
  legalForm: string | null;
  /** Numéro d'entreprise BCE/KBO. */
  companyNumber: string | null;
  vatNumber: string | null;
  registeredOffice: string | null;
  publisherName: string | null;
  hostName: string | null;
  hostAddress: string | null;
  dataController: string | null;
  contactEmail: string | null;
}

export interface SiteConfig {
  brand: {
    name: string;
    shortName: string;
    /** Baseline provisoire, modifiable. */
    baseline: string;
    /** Logo officiel : null = wordmark typographique provisoire. */
    logo: { src: string; alt: string; width: number; height: number } | null;
  };
  locale: string;
  country: string;
  /** Commune : null tant qu'elle n'est pas communiquée. */
  city: string | null;
  address: Address | null;
  phone: string | null;
  email: string | null;
  openingHours: OpeningSlot[];
  /** Note libre sur les horaires (jours fériés, fermeture annuelle…). */
  hoursNote: string | null;
  socials: SocialLink[];
  /** Lien de commande en ligne réel. null = aucun canal confirmé. */
  orderUrl: string | null;
  /** Lien vers la fiche Google Business réelle. */
  googleBusinessUrl: string | null;
  /** URL publique du site, utile pour le SEO (sitemap, Open Graph). */
  siteUrl: string | null;
  legal: LegalInfo;
}

export interface GalleryItem extends MediaSlotData {
  category: "produits" | "lieu" | "equipe";
}

export interface Testimonial {
  author: string;
  text: string;
  source: string;
  sourceUrl: string | null;
  date: string;
}

export interface PageSeo {
  title: string;
  description: string;
  /** Ton du header au-dessus de la première section de la page. */
  headerTone: "dark" | "light";
  noIndex?: boolean;
}
