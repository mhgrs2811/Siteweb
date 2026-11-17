/**
 * DONNÉES GALERIE — SNACK GORBUZ
 *
 * Chaque emplacement décrit un média attendu : catégorie, ratio, nom de fichier
 * définitif et texte alternatif à rédiger. Tant que `src` est null, le composant
 * affiche un bloc graphique provisoire clairement signalé comme « visuel à venir ».
 *
 * Pour activer une photo : déposer le fichier dans /public/media/ puis renseigner
 * `src`, `width`, `height` et `alt`. Aucune photo stock ne doit être présentée
 * comme une photo du snack.
 */

export type GalleryCategory = "produits" | "lieu" | "equipe";

export type MediaRatio = "1:1" | "4:5" | "3:4" | "4:3" | "3:2" | "16:9" | "21:9";

export interface GalleryItem {
  id: string;
  category: GalleryCategory;
  /** Légende courte, affichée sous le média quand il existe. */
  title: string;
  /** Nom de fichier définitif attendu dans /public/media. */
  file: string;
  ratio: MediaRatio;
  /** Taille de la tuile dans la grille éditoriale. */
  span: "wide" | "tall" | "square" | "large";
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
}

export const galleryCategories: { id: GalleryCategory; label: string; heading: string }[] = [
  { id: "produits", label: "Produits", heading: "Les produits" },
  { id: "lieu", label: "Le lieu", heading: "Le lieu et les coulisses" },
  { id: "equipe", label: "L'équipe", heading: "L'équipe" },
];

export const galleryItems: GalleryItem[] = [
  // --- Produits -----------------------------------------------------------
  { id: "g-01", category: "produits", title: "Durum signature", file: "durum-signature.jpg", ratio: "4:5", span: "tall", src: null, alt: "" },
  { id: "g-02", category: "produits", title: "Kumpir signature", file: "kumpir-signature.jpg", ratio: "1:1", span: "square", src: null, alt: "" },
  { id: "g-03", category: "produits", title: "Mitraillette signature", file: "mitraillette-signature.jpg", ratio: "3:2", span: "wide", src: null, alt: "" },
  { id: "g-04", category: "produits", title: "Détail de garniture", file: "gallery-01.jpg", ratio: "1:1", span: "square", src: null, alt: "" },
  { id: "g-05", category: "produits", title: "Emballage Gorbuz", file: "gallery-02.jpg", ratio: "4:3", span: "wide", src: null, alt: "" },
  // --- Lieu / coulisses ---------------------------------------------------
  { id: "g-06", category: "lieu", title: "Devanture", file: "snack-exterior.jpg", ratio: "16:9", span: "large", src: null, alt: "" },
  { id: "g-07", category: "lieu", title: "Comptoir", file: "snack-interior.jpg", ratio: "4:5", span: "tall", src: null, alt: "" },
  { id: "g-08", category: "lieu", title: "Préparation", file: "gallery-03.jpg", ratio: "1:1", span: "square", src: null, alt: "" },
  { id: "g-09", category: "lieu", title: "Détail du lieu", file: "gallery-04.jpg", ratio: "3:2", span: "wide", src: null, alt: "" },
  // --- Équipe -------------------------------------------------------------
  { id: "g-10", category: "equipe", title: "L'équipe Gorbuz", file: "team-gorbuz.jpg", ratio: "3:2", span: "large", src: null, alt: "" },
  { id: "g-11", category: "equipe", title: "Au comptoir", file: "gallery-05.jpg", ratio: "4:5", span: "tall", src: null, alt: "" },
];

/** Sous-ensemble utilisé par la section « Dans les coulisses » de l'accueil. */
export const homeGalleryIds = ["g-01", "g-06", "g-02", "g-10", "g-03"] as const;

export const hasRealMedia = (items: GalleryItem[] = galleryItems) => items.some((i) => i.src !== null);

export const categoryHasRealMedia = (category: GalleryCategory) =>
  galleryItems.some((i) => i.category === category && i.src !== null);

/** Les filtres ne sont affichés que si au moins deux catégories ont du contenu réel. */
export const shouldShowGalleryFilters = () =>
  galleryCategories.filter((c) => categoryHasRealMedia(c.id)).length >= 2;
