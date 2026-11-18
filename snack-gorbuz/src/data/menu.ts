import type { Family, FamilySlug, Product } from "./types";

/**
 * CARTE — SNACK GORBUZ
 * ---------------------
 * Les trois familles ci-dessous sont confirmées par le propriétaire.
 * `definition` est une définition générique du type de produit (ce qu’est un durum,
 * un kumpir, une mitraillette), pas une recette Gorbuz. Aucun ingrédient précis,
 * aucun prix, aucune option n’est affirmé tant que la carte officielle n’est pas reçue.
 *
 * Pour ajouter un produit, compléter le tableau `products` ci-dessous, par exemple :
 * {
 *   id: "durum-xxx",
 *   familySlug: "durums",
 *   name: "Nom officiel",
 *   description: "Description officielle",
 *   price: 9.5,
 *   variants: [],
 *   options: [{ label: "Supplément …", priceDelta: 1 }],
 *   allergens: ["gluten"],
 *   badge: null,
 *   media: { id: "durum-xxx", src: "/images/durum-xxx.webp", alt: "…", caption: "…", ratio: "4:5" },
 * }
 */
export const families: Family[] = [
  {
    slug: "durums",
    name: "Durums",
    definition: "La galette roulée autour de sa garniture, à prendre en main.",
    tagline: "Roulé serré, à emporter partout.",
    media: {
      id: "durum-signature",
      src: null,
      alt: "Durum Snack Gorbuz",
      caption: "Photo du durum signature",
      ratio: "4:5",
    },
  },
  {
    slug: "kumpirs",
    name: "Kumpirs",
    definition: "La grosse pomme de terre cuite au four, ouverte et garnie.",
    tagline: "Généreux, à la cuillère.",
    media: {
      id: "kumpir-signature",
      src: null,
      alt: "Kumpir Snack Gorbuz",
      caption: "Photo du kumpir signature",
      ratio: "1:1",
    },
  },
  {
    slug: "mitraillettes",
    name: "Mitraillettes",
    definition: "Le sandwich belge garni de frites, à manger à deux mains.",
    tagline: "Le classique belge, version Gorbuz.",
    media: {
      id: "mitraillette-signature",
      src: null,
      alt: "Mitraillette Snack Gorbuz",
      caption: "Photo de la mitraillette signature",
      ratio: "3:2",
    },
  },
];

/** Produits réels : vide tant que la carte officielle n’est pas communiquée. */
export const products: Product[] = [];

export const productsByFamily = (slug: FamilySlug): Product[] =>
  products.filter((p) => p.familySlug === slug);

export const getFamily = (slug: FamilySlug): Family => {
  const family = families.find((f) => f.slug === slug);
  if (!family) throw new Error(`Famille inconnue : ${slug}`);
  return family;
};
