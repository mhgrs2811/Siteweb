import type { GalleryItem, MediaSlotData } from "./types";

/**
 * GALERIE — SNACK GORBUZ
 * -----------------------
 * Chaque entrée est un emplacement remplaçable. `src: null` = pas encore de photo
 * réelle : le site affiche un bloc graphique provisoire portant la légende.
 * Pour activer une photo : déposer le fichier dans /public/images/ et renseigner `src`.
 * Noms de fichiers recommandés : identiques à `id` (ex. /images/gallery-01.webp).
 */
export const galleryItems: GalleryItem[] = [
  // Produits
  { id: "gallery-01", category: "produits", src: null, alt: "Durum Snack Gorbuz en gros plan", caption: "Durum, gros plan", ratio: "4:5" },
  { id: "gallery-02", category: "produits", src: null, alt: "Kumpir Snack Gorbuz vu du dessus", caption: "Kumpir, vue du dessus", ratio: "1:1" },
  { id: "gallery-03", category: "produits", src: null, alt: "Mitraillette Snack Gorbuz", caption: "Mitraillette", ratio: "3:2" },
  { id: "gallery-04", category: "produits", src: null, alt: "Détail de texture d’un produit Snack Gorbuz", caption: "Détail de texture", ratio: "1:1" },
  // Lieu et coulisses
  { id: "snack-exterior", category: "lieu", src: null, alt: "Devanture du Snack Gorbuz", caption: "Devanture", ratio: "3:2" },
  { id: "snack-interior", category: "lieu", src: null, alt: "Intérieur et comptoir du Snack Gorbuz", caption: "Comptoir", ratio: "4:3" },
  { id: "gallery-05", category: "lieu", src: null, alt: "Préparation au comptoir", caption: "Préparation", ratio: "4:5" },
  { id: "gallery-06", category: "lieu", src: null, alt: "Détail d’emballage Snack Gorbuz", caption: "Emballage", ratio: "1:1" },
  // Équipe
  { id: "team-gorbuz", category: "equipe", src: null, alt: "L’équipe du Snack Gorbuz", caption: "L’équipe", ratio: "3:2" },
  { id: "gallery-07", category: "equipe", src: null, alt: "Un membre de l’équipe en service", caption: "En service", ratio: "4:5" },
];

export const galleryByCategory = (category: GalleryItem["category"]) =>
  galleryItems.filter((item) => item.category === category);

/** Vrai si au moins un média réel existe dans la catégorie. */
export const categoryHasMedia = (category: GalleryItem["category"]) =>
  galleryByCategory(category).some((item) => item.src !== null);

/** Emplacements de la section « coulisses » de l’accueil (5 cadres). */
export const backstageSlots: MediaSlotData[] = [
  { id: "snack-interior", src: null, alt: "Comptoir du Snack Gorbuz", caption: "Le comptoir", ratio: "4:3" },
  { id: "durum-signature", src: null, alt: "Durum Snack Gorbuz", caption: "Le durum", ratio: "4:5" },
  { id: "team-gorbuz", src: null, alt: "L’équipe du Snack Gorbuz", caption: "L’équipe", ratio: "3:2" },
  { id: "gallery-06", src: null, alt: "Détail d’emballage Snack Gorbuz", caption: "L’emballage", ratio: "1:1" },
  { id: "snack-exterior", src: null, alt: "Devanture du Snack Gorbuz", caption: "La devanture", ratio: "4:5" },
];

/** Emplacement principal du hero (poster de secours si une vraie photo est fournie). */
export const heroMedia: MediaSlotData = {
  id: "hero-gorbuz",
  src: null,
  alt: "Snack Gorbuz",
  caption: "Visuel principal",
  ratio: "4:5",
};
