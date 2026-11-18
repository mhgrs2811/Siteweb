import type { FeaturedProduct } from "./types";

/**
 * PRODUIT À L’HONNEUR — « La vedette du moment »
 * -----------------------------------------------
 * null tant qu’aucun produit réel n’a été désigné par le propriétaire.
 * Exemple une fois la sélection communiquée (le produit doit exister dans menu.ts) :
 *   { productId: "durum-xxx", headline: "La vedette du moment", text: "…" }
 */
export const featured: FeaturedProduct | null = null;
