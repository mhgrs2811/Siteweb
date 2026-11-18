import { deepTypo } from "@/lib/typo";

export const processSteps = deepTypo([
  {
    number: "01",
    title: "Découverte et stratégie",
    text: "Un premier échange pour comprendre votre activité, vos clients, vos concurrents et ce qui vous rend différent. Nous en tirons une stratégie claire.",
    deliverable: "Note de cadrage",
    duration: "Semaine 1",
  },
  {
    number: "02",
    title: "Analyse du besoin",
    text: "Arborescence, contenus, fonctionnalités, outils à connecter : nous listons précisément ce dont votre site a besoin, et ce dont il peut se passer.",
    deliverable: "Cahier des charges et devis final",
    duration: "Semaine 1 à 2",
  },
  {
    number: "03",
    title: "Direction artistique",
    text: "Nous explorons plusieurs pistes visuelles, puis nous en approfondissons une : typographies, couleurs, images, mouvement. Vous validez avant le moindre développement.",
    deliverable: "Pistes créatives et maquettes clés",
    duration: "Semaine 2 à 3",
  },
  {
    number: "04",
    title: "Conception et développement assistés par IA",
    text: "Nos designers et développeurs construisent le site. L’IA accélère les tâches répétitives, génère des variantes à évaluer et vérifie le code : chaque décision reste humaine.",
    deliverable: "Site de prévisualisation privé",
    duration: "Semaine 3 à 6",
  },
  {
    number: "05",
    title: "Tests et optimisation",
    text: "Navigateurs, téléphones, accessibilité, vitesse, référencement : nous testons sur de vrais appareils et corrigeons jusqu’à atteindre nos critères de qualité.",
    deliverable: "Rapport de recette",
    duration: "Avant la mise en ligne",
  },
  {
    number: "06",
    title: "Livraison et mise en ligne",
    text: "Mise en ligne, redirections, configuration de Google Search Console, formation à la prise en main. Puis nous restons disponibles pour les ajustements.",
    deliverable: "Site en ligne et guide d’utilisation",
    duration: "Jour J et suivi",
  },
]);

export const reasons = deepTypo([
  {
    id: "personnalisation",
    title: "Personnalisation",
    text: "Aucun thème acheté, aucun site copié. Chaque mise en page est dessinée pour votre métier.",
  },
  {
    id: "direction",
    title: "Direction artistique",
    text: "Un parti pris visuel assumé, défendu par des designers, pas par un générateur.",
  },
  {
    id: "rapidite",
    title: "Rapidité d’exécution",
    text: "L’IA prend en charge le répétitif : nous livrons en semaines ce qui prend souvent des mois.",
  },
  {
    id: "performance",
    title: "Performance",
    text: "Nous visons un score Lighthouse d’au moins 90 sur mobile et nous le vérifions avant chaque mise en ligne.",
  },
  {
    id: "expertise",
    title: "Expertise technique",
    text: "Next.js, Shopify, 3D temps réel, automatisations : la bonne technologie pour chaque besoin.",
  },
  {
    id: "humain",
    title: "Accompagnement humain",
    text: "Un interlocuteur unique, du premier appel au suivi après la mise en ligne.",
  },
]);
