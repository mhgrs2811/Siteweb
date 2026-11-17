/**
 * DONNÉES DE LA CARTE — SNACK GORBUZ
 *
 * Seules trois familles sont confirmées à ce stade : durums, kumpirs, mitraillettes.
 * Aucun produit, prix, option, taille ou allergène n'a encore été communiqué :
 * les tableaux `products` restent vides et la page /carte affiche un état
 * éditorial provisoire par famille.
 *
 * Pour intégrer la carte réelle, ajouter des objets `Product` dans la famille
 * concernée. Les composants (ProductCard, FamilySection) sont déjà prêts à
 * afficher photo, nom, description, prix, variantes, suppléments, allergènes,
 * badge et disponibilité.
 */

export type FamilyId = "durums" | "kumpirs" | "mitraillettes";

export type Allergen =
  | "gluten"
  | "lait"
  | "oeufs"
  | "soja"
  | "arachides"
  | "fruits-a-coque"
  | "sesame"
  | "moutarde"
  | "celeri"
  | "poisson"
  | "crustaces"
  | "mollusques"
  | "lupin"
  | "sulfites";

export interface ProductImage {
  /** Chemin local dans /public, ex. "/media/durum-signature.jpg". */
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductVariant {
  label: string;
  /** Prix en euros TTC. */
  price: number;
}

export interface ProductOption {
  label: string;
  /** Supplément en euros ; 0 = inclus. */
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  /** Prix de base en euros. Absent si le produit se décline uniquement en variantes. */
  price?: number;
  variants?: ProductVariant[];
  options?: ProductOption[];
  /** Uniquement sur données confirmées par l'établissement. */
  allergens?: Allergen[];
  badge?: "nouveau" | "signature" | "populaire" | "edition-limitee";
  /** false = affiché mais marqué indisponible ; undefined = non géré. */
  available?: boolean;
  image?: ProductImage;
}

export interface Family {
  id: FamilyId;
  /** Numéro de chapitre affiché (01, 02, 03). */
  index: string;
  name: string;
  /** Phrase d'accroche provisoire — ne décrit aucune recette. */
  tagline: string;
  /** Texte éditorial court pour la page carte. */
  intro: string;
  /** Nom de fichier prévu pour la photo signature de la famille. */
  signatureImageFile: string;
  image: ProductImage | null;
  products: Product[];
}

export const families: Family[] = [
  {
    id: "durums",
    index: "01",
    name: "Durums",
    tagline: "Roulé serré, à emporter partout.",
    intro:
      "La famille des durums ouvre la carte Gorbuz. Les recettes, garnitures et prix seront publiés ici dès que la carte définitive sera transmise.",
    signatureImageFile: "durum-signature.jpg",
    image: null,
    products: [],
  },
  {
    id: "kumpirs",
    index: "02",
    name: "Kumpirs",
    tagline: "La pomme de terre garnie, version Gorbuz.",
    intro:
      "Les kumpirs forment la deuxième grande envie de la carte. Le détail des garnitures et des formats arrive avec la carte officielle.",
    signatureImageFile: "kumpir-signature.jpg",
    image: null,
    products: [],
  },
  {
    id: "mitraillettes",
    index: "03",
    name: "Mitraillettes",
    tagline: "Le classique belge, assumé.",
    intro:
      "Les mitraillettes complètent les trois familles confirmées. Compositions, suppléments et prix seront ajoutés sur base des informations du snack.",
    signatureImageFile: "mitraillette-signature.jpg",
    image: null,
    products: [],
  },
];

export interface FeaturedRef {
  familyId: FamilyId;
  productId: string;
}

/**
 * Produit mis en avant sur l'accueil (section « La vedette du moment »).
 * null = état éditorial de lancement. Exemple une fois la carte reçue :
 * `{ familyId: "durums", productId: "durum-xxx" }`.
 */
export const featuredProduct = null as FeaturedRef | null;

/** Libellés lisibles des allergènes (règlement UE 1169/2011). */
export const allergenLabels: Record<Allergen, string> = {
  gluten: "Gluten",
  lait: "Lait",
  oeufs: "Œufs",
  soja: "Soja",
  arachides: "Arachides",
  "fruits-a-coque": "Fruits à coque",
  sesame: "Sésame",
  moutarde: "Moutarde",
  celeri: "Céleri",
  poisson: "Poisson",
  crustaces: "Crustacés",
  mollusques: "Mollusques",
  lupin: "Lupin",
  sulfites: "Sulfites",
};

export const badgeLabels: Record<NonNullable<Product["badge"]>, string> = {
  nouveau: "Nouveau",
  signature: "Signature",
  populaire: "Populaire",
  "edition-limitee": "Édition limitée",
};

export const hasAnyProducts = () => families.some((f) => f.products.length > 0);

export const getFamily = (id: FamilyId) => families.find((f) => f.id === id);

export const getFeaturedProduct = () => {
  if (!featuredProduct) return null;
  const family = getFamily(featuredProduct.familyId);
  const product = family?.products.find((p) => p.id === featuredProduct.productId);
  return family && product ? { family, product } : null;
};

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
