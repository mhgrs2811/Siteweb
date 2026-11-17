/**
 * ============================================================
 * GALERIE — EMPLACEMENTS VISUELS (V1)
 * ============================================================
 * Chaque entrée décrit un emplacement de photo. Tant que `src` est `null`,
 * le composant affiche un visuel temporaire (composition graphique) clairement
 * identifié comme tel. Pour intégrer une vraie photo :
 *   1. déposer le fichier optimisé (WebP/AVIF) dans `public/images/galerie/` ;
 *   2. renseigner `src`, `width`, `height` et un `alt` descriptif.
 *
 * `tone` choisit la teinte dominante du visuel temporaire (palette du site).
 * `ratio` fixe le format d'affichage (largeur / hauteur).
 */

export type PlaceholderTone = 'cream' | 'espresso' | 'bordeaux' | 'sage' | 'copper';

export interface GalleryEntry {
  id: string;
  /** Sujet prévu pour cet emplacement (ex. « La façade »). */
  subject: string;
  /** Légende affichée sous l'image lorsqu'une vraie photo est en place. */
  caption: string | null;
  src: string | null;
  width: number | null;
  height: number | null;
  alt: string;
  ratio: '1 / 1' | '4 / 5' | '3 / 4' | '4 / 3' | '3 / 2' | '16 / 9';
  tone: PlaceholderTone;
  /** Emplacements marqués `featured` : affichés sur la page d'accueil. */
  featured: boolean;
}

export const gallery: GalleryEntry[] = [
  {
    id: 'facade',
    subject: 'La façade',
    caption: null,
    src: null,
    width: null,
    height: null,
    alt: 'Façade de Snack Gorbuz, Leuvensesteenweg 241 à Zaventem',
    ratio: '4 / 5',
    tone: 'espresso',
    featured: true,
  },
  {
    id: 'comptoir',
    subject: 'Le comptoir',
    caption: null,
    src: null,
    width: null,
    height: null,
    alt: 'Le comptoir de Snack Gorbuz',
    ratio: '4 / 3',
    tone: 'cream',
    featured: true,
  },
  {
    id: 'preparation',
    subject: 'La préparation',
    caption: null,
    src: null,
    width: null,
    height: null,
    alt: 'Préparation en cuisine chez Snack Gorbuz',
    ratio: '1 / 1',
    tone: 'bordeaux',
    featured: true,
  },
  {
    id: 'produits',
    subject: 'Les produits',
    caption: null,
    src: null,
    width: null,
    height: null,
    alt: 'Produits de la carte de Snack Gorbuz',
    ratio: '3 / 4',
    tone: 'copper',
    featured: true,
  },
  {
    id: 'equipe',
    subject: 'L’équipe',
    caption: null,
    src: null,
    width: null,
    height: null,
    alt: 'L’équipe de Snack Gorbuz',
    ratio: '16 / 9',
    tone: 'sage',
    featured: true,
  },
  {
    id: 'salle',
    subject: 'L’espace',
    caption: null,
    src: null,
    width: null,
    height: null,
    alt: 'L’espace intérieur de Snack Gorbuz',
    ratio: '3 / 2',
    tone: 'cream',
    featured: false,
  },
  {
    id: 'detail-produit',
    subject: 'Détail produit',
    caption: null,
    src: null,
    width: null,
    height: null,
    alt: 'Gros plan sur un produit de Snack Gorbuz',
    ratio: '1 / 1',
    tone: 'espresso',
    featured: false,
  },
  {
    id: 'service',
    subject: 'Le service',
    caption: null,
    src: null,
    width: null,
    height: null,
    alt: 'Moment de service chez Snack Gorbuz',
    ratio: '4 / 5',
    tone: 'sage',
    featured: false,
  },
];

export const featuredGallery = (): GalleryEntry[] => gallery.filter((g) => g.featured);
