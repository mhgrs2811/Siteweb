import { deepTypo } from "@/lib/typo";

export const about = deepTypo({
  meta: {
    title: "À propos — vision, méthode et philosophie",
    description:
      "Atelier Nova réunit direction artistique humaine, intelligence artificielle et développement web avancé. Notre vision, nos valeurs et notre manière de concevoir.",
  },
  hero: {
    label: "À propos",
    title: ["Un studio de création", "qui travaille", "à la vitesse de l’IA."],
    lead:
      "Atelier Nova est né d’une conviction simple : les entreprises de toutes tailles méritent des sites dessinés avec le même soin que ceux des grandes marques. L’intelligence artificielle nous permet enfin de le rendre accessible.",
  },
  vision: {
    label: "Vision",
    text:
      "Le web s’est uniformisé. Les mêmes thèmes, les mêmes sections, les mêmes promesses. Nous pensons qu’un site doit au contraire révéler ce qu’une entreprise a d’unique : sa manière de travailler, ses clients, son lieu, sa voix.",
  },
  hybrid: {
    label: "Humain + IA",
    title: "Qui fait quoi, exactement.",
    intro:
      "Nous sommes transparents sur notre usage de l’intelligence artificielle. Voici comment le travail se répartit dans nos projets.",
    human: {
      title: "Ce qui reste humain",
      items: [
        "Comprendre votre activité et vos clients",
        "Définir la stratégie et l’arborescence",
        "Choisir une direction artistique et la défendre",
        "Arbitrer chaque détail de design",
        "Valider le code, l’accessibilité et la qualité finale",
        "Vous accompagner, vous former, vous répondre",
      ],
    },
    ai: {
      title: "Ce que l’IA accélère",
      items: [
        "Explorer rapidement des variantes de mise en page",
        "Produire des premières versions de textes à retravailler",
        "Générer le code répétitif et les tests",
        "Contrôler la cohérence, les liens et les performances",
        "Préparer les déclinaisons d’images et de formats",
        "Documenter le projet pour vous",
      ],
    },
  },
  values: {
    label: "Valeurs",
    items: [
      { title: "Exigence", text: "Nous préférons livrer moins d’éléments, parfaitement finis, que beaucoup de sections approximatives." },
      { title: "Honnêteté", text: "Pas de fausses promesses de classement, pas de faux témoignages, pas de délais intenables." },
      { title: "Clarté", text: "Des devis lisibles, des étapes visibles, un vocabulaire sans jargon." },
      { title: "Durabilité", text: "Des sites légers, rapides et maintenables, qui consomment moins et vieillissent mieux." },
    ],
  },
  philosophy: {
    label: "Philosophie de conception",
    principles: [
      { title: "Le contenu d’abord", text: "Nous dessinons à partir de vos vrais textes, vos vraies images, vos vrais prix. Jamais de lorem ipsum." },
      { title: "Une idée par écran", text: "Chaque section a une seule intention. Si elle n’en a pas, elle disparaît." },
      { title: "Le mouvement raconte", text: "Une animation existe pour guider le regard ou expliquer, jamais pour décorer." },
      { title: "Le mobile n’est pas une version réduite", text: "Nous composons chaque écran pour le pouce, puis nous l’enrichissons pour le bureau." },
      { title: "La performance est un choix de design", text: "Une page qui charge en une seconde est plus belle qu’une page qui en met six." },
    ],
  },
});
