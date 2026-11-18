import { deepTypo } from "@/lib/typo";

export type ServiceLayout = "split" | "fullbleed" | "columns" | "index" | "diagram" | "stack";

export type Service = {
  slug: string;
  number: string;
  title: string;
  /** Titre court pour les listes. */
  short: string;
  kicker: string;
  summary: string;
  description: string;
  benefits: string[];
  features: string[];
  /** Exemple visuel : chemin d’image du portfolio (ou null pour un visuel dessiné). */
  image: string | null;
  imageAlt: string;
  /** Concept du portfolio lié, pour l’exemple visuel. */
  example?: string;
  layout: ServiceLayout;
  onHome: boolean;
  /** Valeur pré-remplie dans le formulaire de contact. */
  contactType: string;
};

export const services: Service[] = deepTypo([
  {
    slug: "sites-vitrines",
    number: "01",
    title: "Sites vitrines premium",
    short: "Sites vitrines",
    kicker: "Être choisi au premier regard",
    summary: "Votre activité présentée avec la précision d’une monographie : claire, élégante, rapide.",
    description:
      "Un site vitrine est souvent le premier contact entre vous et un futur client. Nous le dessinons pour qu’il comprenne en quelques secondes ce que vous faites, pour qui, et pourquoi vous plutôt qu’un autre. Pas de modèle acheté : une mise en page pensée pour votre métier, vos images et votre ton.",
    benefits: [
      "Une image à la hauteur de votre savoir-faire",
      "Des visiteurs qui comprennent votre offre en quelques secondes",
      "Des demandes de contact plus qualifiées",
    ],
    features: [
      "Design sur mesure, mobile d’abord",
      "Contenus modifiables par vos soins",
      "SEO local et fiche Google Business",
      "Formulaires reliés à votre boîte mail ou CRM",
      "Mesure d’audience sans cookies intrusifs",
      "Multilingue FR, NL, EN",
    ],
    image: "/images/projects/vide-architecture/desktop-hero.webp",
    imageAlt: "Page d’accueil du concept VIDE Architecture dans un navigateur",
    example: "vide-architecture",
    layout: "split",
    onHome: true,
    contactType: "site-vitrine",
  },
  {
    slug: "e-commerce",
    number: "02",
    title: "Boutiques e-commerce",
    short: "E-commerce",
    kicker: "Donner envie, puis faciliter l’achat",
    summary: "Des boutiques qui mettent le produit en scène et rendent le paiement évident.",
    description:
      "Une boutique en ligne doit faire deux choses à la fois : créer le désir et supprimer chaque friction jusqu’au paiement. Nous travaillons la mise en scène du produit comme une vitrine de créateur, puis nous optimisons le parcours, des filtres jusqu’au panier.",
    benefits: [
      "Des fiches produits qui répondent aux questions avant qu’on les pose",
      "Un tunnel d’achat court, pensé pour le mobile",
      "Une boutique que vous gérez en autonomie",
    ],
    features: [
      "Shopify ou architecture headless",
      "Bancontact, cartes, Apple Pay, Google Pay",
      "Collections, filtres et recherche",
      "Panier persistant et relances",
      "E-mails transactionnels à votre image",
      "Connexion stock, logistique et comptabilité",
    ],
    image: "/images/projects/orbe-cafe/desktop-hero.webp",
    imageAlt: "Page d’accueil du concept de boutique Orbe Café",
    example: "orbe-cafe",
    layout: "fullbleed",
    onHome: true,
    contactType: "e-commerce",
  },
  {
    slug: "restaurants-commerces",
    number: "03",
    title: "Restaurants et commerces",
    short: "Restaurants & commerces",
    kicker: "Remplir la salle, pas seulement la page",
    summary: "Menus vivants, réservation en trois gestes, ambiance qui se ressent à l’écran.",
    description:
      "Pour un restaurant, une boutique ou un salon, le site doit transmettre une atmosphère et déclencher une visite. Menu lisible sur téléphone, horaires toujours justes, réservation ou prise de rendez-vous sans appel : nous concevons des outils qui travaillent pendant que vous servez.",
    benefits: [
      "Moins d’appels, plus de réservations en ligne",
      "Un menu à jour sans PDF à refaire",
      "Une atmosphère qui donne envie de pousser la porte",
    ],
    features: [
      "Menu digital modifiable en quelques secondes",
      "Réservation : intégration (Zenchef, TheFork, Resengo…) ou module sur mesure",
      "Horaires, jours fériés et fermetures centralisés",
      "Données structurées Restaurant et LocalBusiness",
      "Click & collect et bons cadeaux",
      "Version touristique en anglais et néerlandais",
    ],
    image: "/images/projects/maison-ardoise/desktop-hero.webp",
    imageAlt: "Page d’accueil du concept de restaurant Maison Ardoise",
    example: "maison-ardoise",
    layout: "columns",
    onHome: true,
    contactType: "restaurant-commerce",
  },
  {
    slug: "refonte",
    number: "04",
    title: "Refonte de sites existants",
    short: "Refonte",
    kicker: "Repartir de ce qui marche déjà",
    summary: "Nous gardons votre référencement, nous changeons tout le reste.",
    description:
      "Une refonte commence par un audit : ce qui convertit, ce qui ralentit, ce que Google a déjà appris de vous. Nous repensons ensuite l’architecture, le design et la technique, en préservant soigneusement votre visibilité grâce à un plan de redirections complet.",
    benefits: [
      "Un site modernisé sans perdre vos positions Google",
      "Des pages plus rapides et plus faciles à faire évoluer",
      "Une identité remise au niveau de votre entreprise",
    ],
    features: [
      "Audit UX, SEO et performance",
      "Plan de redirections 301 page par page",
      "Migration des contenus existants",
      "Nouveau système de design documenté",
      "Comparatif de performance avant / après",
    ],
    image: "/images/projects/seve-institut/desktop-hero.webp",
    imageAlt: "Page d’accueil du concept Sève, institut esthétique",
    example: "seve-institut",
    layout: "index",
    onHome: true,
    contactType: "refonte",
  },
  {
    slug: "landing-pages",
    number: "05",
    title: "Landing pages et pages de conversion",
    short: "Landing pages",
    kicker: "Une page, un objectif",
    summary: "Pour un lancement, une campagne ou une offre : une page construite pour convertir.",
    description:
      "Une landing page n’a qu’une mission. Nous construisons le message, la hiérarchie et les preuves autour de cette mission, puis nous mesurons. Idéal pour un lancement de produit, une campagne publicitaire ou une offre saisonnière.",
    benefits: [
      "Un message unique, sans distraction",
      "Un coût par contact réduit sur vos campagnes",
      "Des variantes testables rapidement",
    ],
    features: [
      "Rédaction orientée conversion",
      "Variantes A/B",
      "Suivi des conversions respectueux du RGPD",
      "Chargement quasi instantané",
      "Connexion à vos outils (CRM, e-mailing)",
    ],
    image: "/images/projects/orbe-cafe/detail-1.webp",
    imageAlt: "Fiche produit du concept Orbe Café",
    example: "orbe-cafe",
    layout: "stack",
    onHome: true,
    contactType: "landing-page",
  },
  {
    slug: "ux-ui-direction-artistique",
    number: "06",
    title: "UX/UI et direction artistique",
    short: "Direction artistique",
    kicker: "Le parti pris avant le pixel",
    summary: "Un univers visuel cohérent, du logo à la dernière micro-interaction.",
    description:
      "Avant de dessiner une page, nous définissons un parti pris : une palette, des typographies, un rythme, une façon de bouger. Ce système devient la colonne vertébrale de votre site et de vos supports, et il reste cohérent quand votre entreprise grandit.",
    benefits: [
      "Une identité reconnaissable entre mille",
      "Des parcours clairs, testés sur de vrais écrans",
      "Un système réutilisable pour tous vos supports",
    ],
    features: [
      "Moodboards et pistes créatives",
      "Système de design (couleurs, typographies, composants)",
      "Prototypes interactifs",
      "Principes de motion design",
      "Tests d’usage sur mobile",
    ],
    image: "/images/projects/hinoki-lin/cover.webp",
    imageAlt: "Mise en scène d’objets en céramique pour le concept Hinoki & Lin",
    example: "hinoki-lin",
    layout: "split",
    onHome: false,
    contactType: "direction-artistique",
  },
  {
    slug: "ia-automatisations",
    number: "07",
    title: "Intégrations IA et automatisations",
    short: "IA & automatisations",
    kicker: "Les tâches répétitives, en coulisses",
    summary: "Assistants entraînés sur vos contenus, devis, relances et synchronisations automatiques.",
    description:
      "L’intelligence artificielle est utile quand elle fait gagner du temps sans rien abîmer. Nous intégrons des assistants qui répondent à partir de vos propres informations, et nous automatisons les tâches répétitives : formulaires vers votre CRM, devis, notifications, synchronisation de stock.",
    benefits: [
      "Des heures administratives récupérées chaque semaine",
      "Des réponses immédiates à vos clients, même le soir",
      "Des données qui circulent sans copier-coller",
    ],
    features: [
      "Assistant IA basé sur vos contenus, avec limites définies",
      "Formulaires connectés (CRM, Google Sheets, Notion…)",
      "Génération de devis et relances",
      "Synchronisation de stock et de commandes",
      "Hébergement des données en Europe lorsque c’est possible",
    ],
    image: null,
    imageAlt: "",
    layout: "diagram",
    onHome: true,
    contactType: "ia-automatisation",
  },
  {
    slug: "maintenance",
    number: "08",
    title: "Maintenance et optimisation",
    short: "Maintenance",
    kicker: "Un site qui vieillit bien",
    summary: "Mises à jour, sauvegardes, performance et évolutions, suivies chaque mois.",
    description:
      "Un site se dégrade s’il n’est pas entretenu : extensions obsolètes, pages qui ralentissent, contenus périmés. Nos forfaits de maintenance gardent le vôtre sûr, rapide et à jour, avec un interlocuteur qui connaît votre projet.",
    benefits: [
      "Un site sécurisé et toujours disponible",
      "Des performances surveillées, pas supposées",
      "Des évolutions régulières sans nouveau devis",
    ],
    features: [
      "Mises à jour et correctifs de sécurité",
      "Sauvegardes quotidiennes",
      "Surveillance de disponibilité",
      "Rapports de performance",
      "Heures d’évolution incluses selon forfait",
    ],
    image: null,
    imageAlt: "",
    layout: "index",
    onHome: true,
    contactType: "maintenance",
  },
]);

export const servicesPage = deepTypo({
  title: "Services",
  intro:
    "Huit savoir-faire, une seule exigence : que votre site soit le meilleur représentant de votre entreprise, à toute heure et sur tous les écrans.",
});
