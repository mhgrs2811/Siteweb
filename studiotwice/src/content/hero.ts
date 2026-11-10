/**
 * Textes du hero et de la séquence de construction.
 * Tout ce qui est affiché dans la première section vient d'ici.
 */
import { pricing } from "./pricing";

const onepage = pricing.sites[0];

export const heroCopy = {
  statement:
    "Nous construisons le site de votre commerce, du croquis à la mise en ligne.",
  sub: pricing.showPrices
    ? `Restaurants, garages, salons, artisans, en Belgique francophone. Un site une page à partir de ${onepage.from} € ${pricing.vat}, en ligne en une semaine.`
    : "Restaurants, garages, salons, artisans, en Belgique francophone. Un site une page en ligne en une semaine, un devis clair avant de commencer.",
  cta: pricing.showPrices ? { label: "Voir les tarifs", href: "#tarifs" } : { label: "Composer votre site", href: "#tarifs" },
  hint: "Défilez pour construire",
  steps: [
    {
      word: "Croquis",
      text: "On commence par un croquis, chez vous, sur un coin de comptoir.",
    },
    {
      word: "Grille",
      text: "La structure se pose : ce qui doit se voir en premier, ce qui vient après.",
    },
    {
      word: "Texte",
      text: "Vos mots, écrits simplement. Ce que vous faites, pour qui, où, à quel prix.",
    },
    {
      word: "Photo",
      text: "Vos photos prennent la place. Les vraies, pas des images de banque.",
    },
    {
      word: "Couleur",
      text: "Une couleur, la vôtre, posée là où il faut cliquer.",
    },
    {
      word: "En ligne",
      text: "Votre site est en ligne, lisible sur téléphone, prêt à être trouvé sur Google.",
    },
  ],
  /** Page d'exemple dessinée dans la séquence. Commerce fictif, signalé comme tel. */
  demo: {
    name: "La Brasserie du Coin",
    links: ["La carte", "Réserver"],
    title: "Cuisine de saison, terrasse au soleil.",
    para: "Ouvert du mardi au samedi, midi et soir. Produits de producteurs d’ici, carte courte qui change chaque semaine.",
    photo: "Votre photo ici",
    cta: "Réserver une table",
    footer: "Mardi au samedi, midi et soir",
    url: "votre-brasserie.be",
    online: "en ligne",
  },
};

export type HeroCopy = typeof heroCopy;
