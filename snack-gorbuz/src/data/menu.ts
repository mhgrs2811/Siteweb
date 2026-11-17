/**
 * ============================================================
 * DONNÉES DE LA CARTE — SNACK GORBUZ
 * ============================================================
 * Schéma typé prêt à recevoir les produits réels. AUCUN produit fictif ici.
 *
 * Pour ajouter un produit : compléter le tableau `menuItems` en respectant
 * l'interface `MenuItem`. Les composants de la page Menu se remplissent
 * automatiquement, sans modification de code.
 *
 * Exemple (à décommenter et adapter avec les VRAIES informations) :
 *
 * {
 *   id: 'exemple-id-unique',
 *   name: 'Nom du produit',
 *   category: 'id-de-la-categorie',
 *   description: 'Description courte fournie par l’établissement.',
 *   price: 0,                 // en euros, ex. 4.5
 *   image: null,              // ex. '/images/menu/nom-du-produit.webp'
 *   tags: [],                 // ex. ['nouveau', 'signature', 'vegetarien']
 *   allergens: [],            // ex. ['gluten', 'lait'] — uniquement si fournis
 *   available: true,
 *   sortOrder: 1,
 * }
 */

export type MenuTag = 'nouveau' | 'signature' | 'best-seller' | 'vegetarien' | 'vegan' | 'epice';

/** Allergènes selon la liste européenne des 14 allergènes à déclaration obligatoire. */
export type Allergen =
  | 'gluten'
  | 'crustaces'
  | 'oeufs'
  | 'poissons'
  | 'arachides'
  | 'soja'
  | 'lait'
  | 'fruits-a-coque'
  | 'celeri'
  | 'moutarde'
  | 'sesame'
  | 'sulfites'
  | 'lupin'
  | 'mollusques';

export interface MenuCategory {
  /** Identifiant stable, utilisé pour les ancres (#frites) et les liaisons produit → catégorie. */
  id: string;
  name: string;
  /** Courte phrase d'introduction, facultative. */
  description: string | null;
  sortOrder: number;
  /**
   * 'proposed'  : structure proposée par l'agence, à valider par l'établissement.
   * 'confirmed' : catégorie validée par l'établissement.
   */
  status: 'proposed' | 'confirmed';
}

export interface MenuItem {
  id: string;
  name: string;
  /** Doit correspondre à un `MenuCategory.id`. */
  category: string;
  description: string | null;
  /** Prix en euros. `null` tant que le prix n'est pas communiqué. */
  price: number | null;
  /** Chemin public de l'image (ex. '/images/menu/xxx.webp'). `null` = visuel en attente. */
  image: string | null;
  tags: MenuTag[];
  allergens: Allergen[];
  available: boolean;
  sortOrder: number;
}

/**
 * Catégories.
 * Statut 'proposed' : ce sont des familles habituelles d'un snack, proposées pour
 * donner une structure à la page Menu. Elles ne décrivent PAS l'offre réelle
 * de Snack Gorbuz tant que l'établissement ne les a pas confirmées.
 * Supprimer / renommer librement.
 */
export const menuCategories: MenuCategory[] = [
  { id: 'snacks', name: 'Snacks', description: null, sortOrder: 1, status: 'proposed' },
  { id: 'sandwichs', name: 'Sandwichs', description: null, sortOrder: 2, status: 'proposed' },
  { id: 'frites', name: 'Frites', description: null, sortOrder: 3, status: 'proposed' },
  { id: 'sauces', name: 'Sauces', description: null, sortOrder: 4, status: 'proposed' },
  { id: 'boissons', name: 'Boissons', description: null, sortOrder: 5, status: 'proposed' },
];

/** Produits — volontairement vide en V1. */
export const menuItems: MenuItem[] = [];

/** Libellés d'affichage des tags. */
export const tagLabels: Record<MenuTag, string> = {
  nouveau: 'Nouveau',
  signature: 'Signature',
  'best-seller': 'Best-seller',
  vegetarien: 'Végétarien',
  vegan: 'Vegan',
  epice: 'Épicé',
};

/** Libellés d'affichage des allergènes. */
export const allergenLabels: Record<Allergen, string> = {
  gluten: 'Gluten',
  crustaces: 'Crustacés',
  oeufs: 'Œufs',
  poissons: 'Poissons',
  arachides: 'Arachides',
  soja: 'Soja',
  lait: 'Lait',
  'fruits-a-coque': 'Fruits à coque',
  celeri: 'Céleri',
  moutarde: 'Moutarde',
  sesame: 'Sésame',
  sulfites: 'Sulfites',
  lupin: 'Lupin',
  mollusques: 'Mollusques',
};

/** Produits d'une catégorie, triés. */
export function itemsForCategory(categoryId: string): MenuItem[] {
  return menuItems
    .filter((item) => item.category === categoryId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Catégories triées. */
export function sortedCategories(): MenuCategory[] {
  return [...menuCategories].sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Formate un prix en euros à la française (ex. "4,50 €"). */
export function formatPrice(price: number | null): string {
  if (price === null) return 'Prix à venir';
  return new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}
