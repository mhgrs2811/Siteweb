import { deepTypo } from "@/lib/typo";

export const nav = deepTypo({
  main: [
    { label: "Services", href: "/services" },
    { label: "Réalisations", href: "/realisations" },
    { label: "À propos", href: "/a-propos" },
    { label: "Tarifs", href: "/tarifs" },
  ],
  cta: { label: "Parlons de votre projet", short: "Contact", href: "/contact" },
  legal: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Confidentialité", href: "/confidentialite" },
  ],
  skip: "Aller au contenu",
  menuOpen: "Ouvrir le menu",
  menuClose: "Fermer le menu",
  home: "Accueil",
});

export const ui = deepTypo({
  fictional: "Concept fictif",
  fictionalLong:
    "Projet conceptuel imaginé par Atelier Nova pour illustrer notre savoir-faire. Il ne s’agit pas d’une commande client.",
  viewProject: "Voir le concept",
  allProjects: "Toutes les réalisations",
  nextProject: "Concept suivant",
  readMore: "En savoir plus",
  scroll: "Faire défiler",
  backHome: "Retour à l’accueil",
  priceFrom: "à partir de",
  vatExcl: "HTVA",
  included: "Inclus",
  notIncluded: "Non inclus",
});
