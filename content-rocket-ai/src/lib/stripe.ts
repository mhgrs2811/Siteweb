import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: "Gratuit",
    price: 0,
    priceId: null,
    generations: 10,
    features: [
      "10 générations/mois",
      "Toutes les plateformes",
      "Idées de vidéos",
      "Hooks viraux",
    ],
  },
  PRO: {
    name: "Pro",
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    generations: -1,
    features: [
      "Générations illimitées",
      "Export PDF",
      "Sauvegarde des projets",
      "Calendrier éditorial",
      "Scripts complets",
      "Support prioritaire",
    ],
  },
  AGENCY: {
    name: "Agency",
    price: 49,
    priceId: process.env.STRIPE_AGENCY_PRICE_ID,
    generations: -1,
    features: [
      "Tout du plan Pro",
      "Multi-clients",
      "Export CSV",
      "Historique complet",
      "Génération de masse",
      "API Access",
    ],
  },
};
