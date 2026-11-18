/**
 * TARIFS — source unique.
 * Les composants (accueil, page Tarifs, contact) lisent uniquement ce fichier.
 * Montants indicatifs en euros hors TVA, à ajuster librement.
 */

export type PlanId = "essential" | "signature" | "ecommerce";

export type Plan = {
  id: PlanId;
  name: string;
  /** Prix « à partir de », en euros HTVA. */
  priceFrom: number;
  /** Fourchette de délai indicative. */
  timeline: string;
  pitch: string;
  idealFor: string;
  includes: string[];
  highlighted?: boolean;
};

export const currency = "EUR";
export const priceNote =
  "Prix indicatifs « à partir de », hors TVA (21 %). Chaque projet fait l’objet d’un devis détaillé après l’appel de découverte.";

export const plans: Plan[] = [
  {
    id: "essential",
    name: "Essential",
    priceFrom: 2900,
    timeline: "3 à 4 semaines",
    pitch: "Un site vitrine net et rapide, construit sur notre système de design éprouvé.",
    idealFor: "Indépendants, artisans, professions libérales",
    includes: [
      "Jusqu’à 5 pages",
      "Direction artistique sur base de notre système",
      "Design responsive mobile, tablette, desktop",
      "SEO technique de base et données structurées",
      "Formulaire de contact relié à votre boîte",
      "Mise en ligne et formation d’une heure",
    ],
  },
  {
    id: "signature",
    name: "Signature",
    priceFrom: 6500,
    timeline: "5 à 8 semaines",
    pitch: "Une identité digitale entièrement dessinée pour vous, animée et mémorable.",
    idealFor: "Marques, restaurants, PME qui veulent se démarquer",
    highlighted: true,
    includes: [
      "Jusqu’à 12 pages",
      "Direction artistique 100 % sur mesure",
      "Animations, motion design et micro-interactions",
      "Contenus modifiables (CMS)",
      "2 langues incluses (FR + NL ou EN)",
      "SEO avancé, performance ≥ 90 visée sur mobile",
      "Atelier de cadrage et prototypes interactifs",
    ],
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    priceFrom: 8900,
    timeline: "6 à 10 semaines",
    pitch: "Une boutique qui donne envie d’acheter, du premier écran au paiement.",
    idealFor: "Marques produit, concept stores, créateurs",
    includes: [
      "Shopify ou solution headless selon le besoin",
      "Direction artistique sur mesure",
      "Fiches produits, collections et filtres",
      "Paiement Bancontact, cartes, Apple Pay",
      "Import de 50 produits inclus",
      "E-mails transactionnels personnalisés",
      "Formation à la gestion de la boutique",
    ],
  },
];

/** Tableau comparatif : true = inclus, false = non inclus, texte = précision. */
export type CompareValue = boolean | string;
export const comparison: { group: string; rows: { label: string; values: Record<PlanId, CompareValue> }[] }[] = [
  {
    group: "Design",
    rows: [
      { label: "Direction artistique", values: { essential: "Système Nova", signature: "Sur mesure", ecommerce: "Sur mesure" } },
      { label: "Nombre de pages", values: { essential: "5", signature: "12", ecommerce: "Illimité (catalogue)" } },
      { label: "Animations et motion design", values: { essential: "Essentielles", signature: true, ecommerce: true } },
      { label: "Prototype interactif avant développement", values: { essential: false, signature: true, ecommerce: true } },
      { label: "Élément 3D ou interaction signature", values: { essential: false, signature: "En option", ecommerce: "En option" } },
    ],
  },
  {
    group: "Technique",
    rows: [
      { label: "Responsive mobile, tablette, desktop", values: { essential: true, signature: true, ecommerce: true } },
      { label: "Contenus modifiables (CMS)", values: { essential: "En option", signature: true, ecommerce: true } },
      { label: "Langues incluses", values: { essential: "1", signature: "2", ecommerce: "2" } },
      { label: "SEO technique et données structurées", values: { essential: "Base", signature: "Avancé", ecommerce: "Avancé" } },
      { label: "Paiement en ligne", values: { essential: false, signature: false, ecommerce: true } },
      { label: "Hébergement la première année", values: { essential: true, signature: true, ecommerce: "Selon plateforme" } },
    ],
  },
  {
    group: "Accompagnement",
    rows: [
      { label: "Interlocuteur unique", values: { essential: true, signature: true, ecommerce: true } },
      { label: "Formation à la prise en main", values: { essential: "1 h", signature: "2 h", ecommerce: "3 h" } },
      { label: "Ajustements après mise en ligne", values: { essential: "15 jours", signature: "30 jours", ecommerce: "30 jours" } },
    ],
  },
];

export type Addon = { label: string; price: string; detail: string };
export const addons: Addon[] = [
  { label: "Page supplémentaire", price: "dès 350 €", detail: "Conçue et intégrée dans le système existant." },
  { label: "Langue supplémentaire", price: "dès 900 €", detail: "Architecture multilingue, balises hreflang. Traduction sur devis." },
  { label: "Réservation ou prise de rendez-vous", price: "dès 700 €", detail: "Intégration d’un outil existant ou module sur mesure." },
  { label: "Assistant IA sur vos contenus", price: "dès 1 200 €", detail: "Répond aux questions fréquentes à partir de vos propres informations." },
  { label: "Automatisation métier", price: "dès 600 €", detail: "Formulaires vers CRM, devis, factures, notifications." },
  { label: "Production visuelle 3D", price: "sur devis", detail: "Objets, packshots et scènes en images de synthèse." },
  { label: "Rédaction web optimisée", price: "dès 180 € / page", detail: "Textes écrits pour vos clients et pour Google." },
];

export type CarePlan = { name: string; price: string; includes: string[] };
export const carePlans: CarePlan[] = [
  {
    name: "Veille",
    price: "59 € / mois",
    includes: ["Mises à jour de sécurité", "Sauvegardes quotidiennes", "Surveillance de disponibilité"],
  },
  {
    name: "Sérénité",
    price: "129 € / mois",
    includes: ["Tout le forfait Veille", "1 h de modifications par mois", "Rapport de performance trimestriel"],
  },
  {
    name: "Croissance",
    price: "290 € / mois",
    includes: ["Tout le forfait Sérénité", "4 h d’évolutions par mois", "Suivi SEO et recommandations mensuelles"],
  },
];

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("fr-BE", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}
