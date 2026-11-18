import { deepTypo } from "@/lib/typo";

/**
 * PORTFOLIO — concepts fictifs.
 * Données séparées des composants. Pour ajouter un vrai projet client,
 * ajouter une entrée avec `fictional: false` et ses images dans
 * public/images/projects/<slug>/.
 */

export type ProjectCategory = "restaurant" | "beaute" | "decoration" | "architecture" | "ecommerce";

export const categories: { id: ProjectCategory | "all"; label: string }[] = [
  { id: "all", label: "Tout" },
  { id: "restaurant", label: "Restaurant" },
  { id: "beaute", label: "Beauté" },
  { id: "decoration", label: "Décoration" },
  { id: "architecture", label: "Architecture" },
  { id: "ecommerce", label: "E-commerce" },
];

export type Project = {
  slug: string;
  number: string;
  name: string;
  category: ProjectCategory;
  categoryLabel: string;
  fictional: boolean;
  place: string;
  year: string;
  tagline: string;
  /** Problématique (fictive pour les concepts). */
  problem: string;
  goals: string[];
  direction: string;
  palette: { name: string; hex: string }[];
  fonts: { display: string; text: string };
  features: { title: string; text: string }[];
  choices: { title: string; text: string }[];
  /** Couleurs utilisées pour habiller la page projet. */
  theme: { bg: string; fg: string; accent: string; muted: string };
  /** Clés d’images dans public/images/projects/<slug>/ */
  images: {
    cover: string;
    renders: string[];
    desktopHero: string;
    desktopFull: string;
    mobile: string[];
    details: string[];
  };
  alt: { cover: string; renders: string[]; details: string[] };
};

const img = (slug: string, name: string) => `/images/projects/${slug}/${name}.webp`;

function imagesFor(slug: string, details = 1) {
  return {
    cover: img(slug, "cover"),
    renders: [img(slug, "render-1"), img(slug, "render-2")],
    desktopHero: img(slug, "desktop-hero"),
    desktopFull: img(slug, "desktop-full"),
    mobile: [img(slug, "mobile-1"), img(slug, "mobile-2")],
    details: Array.from({ length: details }, (_, i) => img(slug, `detail-${i + 1}`)),
  };
}

export const projects: Project[] = deepTypo([
  {
    slug: "maison-ardoise",
    number: "01",
    name: "Maison Ardoise",
    category: "restaurant",
    categoryLabel: "Restaurant gastronomique",
    fictional: true,
    place: "Ixelles, Bruxelles",
    year: "Concept 2026",
    tagline: "Une table de saison, racontée à la lueur des braises.",
    problem:
      "Scénario imaginé : un restaurant gastronomique de 34 couverts reçoit l’essentiel de ses réservations par téléphone, pendant le service. Son menu change chaque mois mais n’existe qu’en PDF, illisible sur mobile, et rien en ligne ne transmet l’atmosphère du lieu.",
    goals: [
      "Faire ressentir l’ambiance de la salle avant la visite",
      "Rendre le menu lisible et modifiable sans PDF",
      "Déplacer les réservations vers le site, sans appel",
    ],
    direction:
      "Clair-obscur. Fond ardoise, typographie Cormorant en italique, une seule touche couleur braise. Les images occupent l’écran, le texte se fait discret comme un service en salle.",
    palette: [
      { name: "Ardoise", hex: "#161816" },
      { name: "Os", hex: "#E9E2D4" },
      { name: "Braise", hex: "#C4552F" },
      { name: "Fumée", hex: "#6F716C" },
    ],
    fonts: { display: "Cormorant Garamond", text: "Jost" },
    features: [
      { title: "Menu digital de saison", text: "Plats, accords et prix mis à jour depuis le CMS, lisibles sur téléphone, sans PDF." },
      { title: "Réservation en trois gestes", text: "Date, nombre de couverts, horaire. Les créneaux complets disparaissent d’eux-mêmes." },
      { title: "Le lieu en plein écran", text: "Une séquence d’images immersives qui raconte la salle, la cuisine, la cave." },
      { title: "Prêt pour Google", text: "Données structurées Restaurant, horaires et menu lisibles par les moteurs de recherche." },
    ],
    choices: [
      { title: "Le noir comme une salle tamisée", text: "Une interface sombre met en valeur les assiettes comme un éclairage de restaurant : on regarde l’image, pas l’écran." },
      { title: "Le menu traité comme une carte papier", text: "Colonnes étroites, filets fins, prix alignés : on retrouve les codes de la carte imprimée, en version vivante." },
      { title: "Un seul accent couleur", text: "La couleur braise est réservée aux actions : réserver, appeler, voir le menu. L’œil sait où cliquer." },
    ],
    theme: { bg: "#161816", fg: "#E9E2D4", accent: "#D46A44", muted: "#A39E93" },
    images: imagesFor("maison-ardoise"),
    alt: {
      cover: "Assiette gastronomique dressée sur une table en ardoise, lumière chaude et rasante",
      renders: ["Verre à vin et détails de table dans la pénombre", "Salle voûtée avec une table dressée, éclairage tamisé"],
      details: ["Section menu de saison et réservation du concept Maison Ardoise"],
    },
  },
  {
    slug: "seve-institut",
    number: "02",
    name: "Sève",
    category: "beaute",
    categoryLabel: "Institut esthétique",
    fictional: true,
    place: "Uccle, Bruxelles",
    year: "Concept 2026",
    tagline: "Le soin de la peau, avec l’élégance d’un magazine.",
    problem:
      "Scénario imaginé : un institut haut de gamme dont la clientèle découvre les soins sur Instagram mais abandonne sur un site daté, où les prix sont introuvables et la prise de rendez-vous passe par un outil tiers sans rapport avec la marque.",
    goals: [
      "Installer un univers éditorial premium et rassurant",
      "Présenter chaque soin avec durée, bénéfices et prix",
      "Intégrer la prise de rendez-vous dans le parcours",
    ],
    direction:
      "Éditorial et feutré. Bodoni Moda pour les titres, beaucoup de blanc crème, des tons de pierre rosée et un vert sauge pour l’apaisement. Les produits sont photographiés comme des objets.",
    palette: [
      { name: "Crème", hex: "#F6F0E8" },
      { name: "Pierre rosée", hex: "#E8D8CC" },
      { name: "Cacao", hex: "#3B2A24" },
      { name: "Sauge", hex: "#8A9A82" },
    ],
    fonts: { display: "Bodoni Moda", text: "Manrope" },
    features: [
      { title: "Carte des soins", text: "Chaque soin avec sa durée, ses bénéfices et son prix, filtrable par besoin." },
      { title: "Rendez-vous intégré", text: "Choix du soin, du créneau et confirmation sans quitter l’univers de la marque." },
      { title: "Journal", text: "Des articles conseils qui nourrissent le référencement et la confiance." },
      { title: "Bons cadeaux", text: "Achat et envoi de cartes cadeaux en ligne." },
    ],
    choices: [
      { title: "Une grille de magazine", text: "Titres en Bodoni, colonnes asymétriques et grandes respirations : la page se lit comme un article de beauté." },
      { title: "Des prix assumés", text: "Les tarifs sont visibles dès la carte des soins : la transparence rassure une clientèle exigeante." },
      { title: "Une palette qui apaise", text: "Crème, pierre et sauge : des couleurs de peau et de plantes, jamais de rose criard." },
    ],
    theme: { bg: "#F6F0E8", fg: "#3B2A24", accent: "#6E7F66", muted: "#7A6A62" },
    images: imagesFor("seve-institut"),
    alt: {
      cover: "Flacons de soins en verre dépoli posés sur des galets, lumière du jour douce",
      renders: ["Flacon compte-gouttes en gros plan sur fond pierre rosée", "Composition de flacons et d’arches aux tons crème"],
      details: ["Étape de prise de rendez-vous du concept Sève"],
    },
  },
  {
    slug: "hinoki-lin",
    number: "03",
    name: "Hinoki & Lin",
    category: "decoration",
    categoryLabel: "Décoration intérieure",
    fictional: true,
    place: "Gand",
    year: "Concept 2026",
    tagline: "Des objets calmes pour des intérieurs qui respirent.",
    problem:
      "Scénario imaginé : une jeune marque d’objets Japandi vend sur les marchés de créateurs et via Instagram. Elle veut une boutique en ligne qui raconte la matière et l’artisanat, sans ressembler à un catalogue standard.",
    goals: [
      "Mettre en scène les objets dans des intérieurs",
      "Raconter les matières et les artisans",
      "Proposer une expérience d’achat fluide et apaisée",
    ],
    direction:
      "Japandi contemporain. Papier de riz, chêne, charbon et mousse ; une typographie Mincho délicate, des images très larges et un rythme lent, presque silencieux.",
    palette: [
      { name: "Papier de riz", hex: "#EEE8DC" },
      { name: "Chêne", hex: "#B4966F" },
      { name: "Charbon", hex: "#2A2825" },
      { name: "Mousse", hex: "#6A6E4C" },
    ],
    fonts: { display: "Zen Old Mincho", text: "Zen Kaku Gothic New" },
    features: [
      { title: "Collections mises en scène", text: "Chaque collection s’ouvre sur un intérieur complet, puis détaille chaque objet." },
      { title: "Fiches matière", text: "Origine, fabrication et entretien de chaque matériau." },
      { title: "Shop the look", text: "Les objets d’une scène s’ajoutent au panier depuis l’image." },
      { title: "Paiement et livraison Benelux", text: "Bancontact, cartes, retrait en atelier." },
    ],
    choices: [
      { title: "Le vide comme matière", text: "De grandes marges et peu d’éléments par écran : l’objet existe parce qu’il a de l’espace autour de lui." },
      { title: "Un rythme lent", text: "Les animations sont plus longues que d’habitude, comme une respiration. Rien ne clignote." },
      { title: "Une typographie de caractère", text: "La Mincho apporte une élégance discrète, associée à une linéale très lisible pour les prix." },
    ],
    theme: { bg: "#EEE8DC", fg: "#2A2825", accent: "#5D6142", muted: "#6B655B" },
    images: imagesFor("hinoki-lin"),
    alt: {
      cover: "Coin de pièce Japandi : banc en chêne, vases en céramique et lampe en papier",
      renders: ["Trio de vases en céramique sur fond lin", "Lampe en papier allumée dans une pièce baignée de lumière"],
      details: ["Grille de produits de la collection Automne du concept Hinoki & Lin"],
    },
  },
  {
    slug: "vide-architecture",
    number: "04",
    name: "VIDE Architecture",
    category: "architecture",
    categoryLabel: "Studio d’architecture",
    fictional: true,
    place: "Namur",
    year: "Concept 2026",
    tagline: "La lumière, le béton, et ce qu’on choisit de ne pas construire.",
    problem:
      "Scénario imaginé : un studio d’architecture reconnu localement présente ses projets dans un portfolio PDF. Il veut attirer des clients privés et des concours publics avec un site aussi rigoureux que ses bâtiments.",
    goals: [
      "Montrer les projets à l’échelle monumentale",
      "Structurer le portfolio par type, lieu et année",
      "Exprimer une philosophie, pas seulement des réalisations",
    ],
    direction:
      "Minimal et monumental. Gris béton, blanc craie et noir, une touche ocre utilisée deux fois. Archivo étroite pour les titres, Plex Mono pour les données. Des grilles asymétriques qui rappellent un plan.",
    palette: [
      { name: "Craie", hex: "#F2F1EE" },
      { name: "Béton", hex: "#CFCBC4" },
      { name: "Noir", hex: "#111111" },
      { name: "Ocre", hex: "#B9872F" },
    ],
    fonts: { display: "Archivo", text: "IBM Plex Mono" },
    features: [
      { title: "Index des projets", text: "Liste filtrable par programme, lieu et année, avec aperçu au survol." },
      { title: "Pages projets cinématographiques", text: "Images monumentales, plans, données techniques." },
      { title: "Transitions de plan", text: "Les images s’ouvrent comme une porte qui coulisse." },
      { title: "Espace presse", text: "Dossiers et visuels haute définition à télécharger." },
    ],
    choices: [
      { title: "Une grille de plan", text: "Des colonnes et des repères visibles, comme sur une planche d’architecte." },
      { title: "Des données en monospace", text: "Surface, année, programme : la Plex Mono donne aux chiffres la précision d’une cote." },
      { title: "L’ocre, deux fois seulement", text: "Une couleur rare rend chaque apparition significative." },
    ],
    theme: { bg: "#F2F1EE", fg: "#111111", accent: "#8C6420", muted: "#5E5B55" },
    images: imagesFor("vide-architecture"),
    alt: {
      cover: "Maison monolithe en béton en porte-à-faux sous un soleil rasant",
      renders: ["Escalier en béton éclairé par une fente de lumière", "Volumes de béton et ombres portées sur ciel profond"],
      details: ["Index des projets du concept VIDE Architecture"],
    },
  },
  {
    slug: "orbe-cafe",
    number: "05",
    name: "Orbe Café",
    category: "ecommerce",
    categoryLabel: "Boutique e-commerce",
    fictional: true,
    place: "Bruxelles",
    year: "Concept 2026",
    tagline: "Du café de spécialité, servi avec du caractère.",
    problem:
      "Scénario imaginé : un torréfacteur artisanal vend surtout en boutique et souhaite développer la vente en ligne et les abonnements. Son packaging est très graphique, mais sa boutique en ligne actuelle est un thème générique.",
    goals: [
      "Prolonger l’énergie du packaging à l’écran",
      "Aider à choisir un café selon ses goûts et sa méthode",
      "Rendre l’achat et l’abonnement évidents",
    ],
    direction:
      "Pop et premium. Rouge tomate, moutarde et expresso sur fond crème ; Bricolage Grotesque pour les titres généreux, Figtree pour la lisibilité. Des boîtes de café qui tournent, des boutons qui répondent.",
    palette: [
      { name: "Crème", hex: "#F3EDE2" },
      { name: "Tomate", hex: "#D2452B" },
      { name: "Moutarde", hex: "#E2B13C" },
      { name: "Expresso", hex: "#2A1A14" },
    ],
    fonts: { display: "Bricolage Grotesque", text: "Figtree" },
    features: [
      { title: "Fiches produits complètes", text: "Origine, notes de dégustation, mouture adaptée à votre méthode, quantité." },
      { title: "Panier instantané", text: "Ajout sans rechargement, panier latéral, livraison offerte affichée en temps réel." },
      { title: "Abonnements", text: "Livraison toutes les deux ou quatre semaines, modifiable en un clic." },
      { title: "Guide de choix", text: "Trois questions pour trouver son café." },
    ],
    choices: [
      { title: "Le packaging comme interface", text: "Les couleurs des boîtes deviennent les couleurs des pages produits : on reconnaît son café d’un coup d’œil." },
      { title: "Des micro-animations utiles", text: "Le bouton confirme l’ajout, le panier compte, la barre de livraison offerte progresse." },
      { title: "Mobile d’abord", text: "Bouton d’achat toujours accessible au pouce, panier en tiroir plein écran." },
    ],
    theme: { bg: "#F3EDE2", fg: "#2A1A14", accent: "#B23A22", muted: "#6E5A4F" },
    images: imagesFor("orbe-cafe", 2),
    alt: {
      cover: "Trois boîtes de café colorées et une tasse en céramique sur fond crème",
      renders: ["Boîte de café rouge tomate en gros plan", "Tasse de café et grains éparpillés, ombre franche"],
      details: ["Fiche produit du concept Orbe Café", "Panier latéral ouvert du concept Orbe Café"],
    },
  },
]);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const realisationsPage = deepTypo({
  title: "Réalisations",
  intro:
    "Cinq concepts imaginés et conçus par notre studio, chacun avec sa propre identité. Ils montrent notre manière de travailler en attendant de vous présenter nos projets clients.",
});
