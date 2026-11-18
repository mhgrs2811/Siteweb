import { deepTypo } from "@/lib/typo";

export const home = deepTypo({
  meta: {
    title: "Atelier Nova — Studio web nouvelle génération à Bruxelles",
    description:
      "Sites vitrines, e-commerce et restaurants sur mesure. Direction artistique humaine, production accélérée par l’IA, performance mesurée. Studio web basé à Bruxelles.",
  },
  hero: {
    eyebrow: "Studio web · Direction artistique · IA",
    lines: ["Votre marque", "mérite mieux", "qu’un template."],
    /** Index de la ligne affichée en serif italique. */
    italicLine: 1,
    lead:
      "Atelier Nova conçoit des sites vitrines, e-commerce et restaurants sur mesure. Une direction artistique humaine, une production accélérée par l’IA : la finition d’un grand studio, dans des délais et des budgets de PME.",
    primary: "Parlons de votre projet",
    secondary: "Explorer nos réalisations",
    scroll: "Défiler",
  },
  manifesto: {
    label: "Manifeste",
    text:
      "Un site internet n’est pas une brochure posée en ligne. C’est le premier rendez-vous avec vos clients. Alors nous le dessinons comme un objet : avec un regard d’auteur, la vitesse de l’intelligence artificielle et une exigence technique sans compromis.",
    trio: [
      { word: "Le regard", role: "humain", verbs: "choisit, compose, tranche" },
      { word: "La vitesse", role: "de l’IA", verbs: "explore, prototype, vérifie" },
      { word: "La rigueur", role: "technique", verbs: "construit, mesure, optimise" },
    ],
    result: "Des sites qui ne ressemblent qu’à vous.",
  },
  services: {
    label: "Services",
    title: "Ce que nous faisons, et pour qui.",
    intro:
      "Entrepreneurs, commerces, restaurants, PME, marques e-commerce : chaque prestation est un savoir-faire à part entière, pas une case à cocher.",
    cta: "Tous les services",
  },
  portfolio: {
    label: "Réalisations",
    title: "Cinq univers, cinq systèmes visuels.",
    intro:
      "Ces concepts ont été imaginés par notre studio pour montrer l’étendue de ce que nous savons faire. Ce ne sont pas des commandes clients : ce sont des démonstrations, poussées jusqu’au détail.",
    cta: "Voir toutes les réalisations",
  },
  process: {
    label: "Méthode",
    title: "Six étapes, aucune zone d’ombre.",
    intro: "Vous savez toujours où en est votre projet, ce qui a été décidé et ce qui vient ensuite.",
  },
  why: {
    label: "Pourquoi Atelier Nova",
    title: "Ce qui change quand vous travaillez avec nous.",
  },
  pricing: {
    label: "Offres",
    title: "Trois formules, un même niveau d’exigence.",
    cta: "Comparer les formules en détail",
  },
  testimonials: {
    label: "Témoignages",
    title: "Ils en parlent mieux que nous.",
  },
  faq: {
    label: "Questions fréquentes",
    title: "Ce qu’on nous demande avant de commencer.",
    more: "Une autre question ?",
    moreCta: "Écrivez-nous",
  },
  finalCta: {
    kicker: "Votre prochain site commence ici",
    title: ["Parlons de", "votre projet."],
    text:
      "Un appel de trente minutes, sans engagement, pour comprendre votre activité et vous dire honnêtement ce que nous ferions à votre place.",
    button: "Démarrer un brief",
  },
});
