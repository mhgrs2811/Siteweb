/**
 * ============================================================
 * TEXTES ÉDITORIAUX — SNACK GORBUZ (V1, PROVISOIRES)
 * ============================================================
 * Tous les textes de marque sont regroupés ici pour être remplacés facilement.
 * Règle V1 : aucune histoire, promesse de qualité, recette ou origine inventée.
 * Les textes restent factuels (lieu, horaires, nature de l'établissement) tant
 * que l'établissement n'a pas fourni ses propres contenus.
 *
 * Les espaces insécables (&nbsp; / U+00A0) devant « : ; ! ? » sont volontaires (typographie française).
 */

export const content = {
  /** Phrase de direction interne. Non affichée comme slogan tant qu'elle n'est pas validée. */
  internalTagline: 'Le goût en scène. L’accueil sans détour.',

  hero: {
    eyebrow: 'Snack · Zaventem',
    /** H1 unique de la page d'accueil. */
    title: 'Snack Gorbuz',
    /** Sous-titre provisoire : uniquement des faits vérifiés. */
    subtitle:
      'Restauration rapide sur la Leuvensesteenweg, à Zaventem. Ouvert du lundi au samedi, midi et soir.',
    primaryCta: 'Découvrir la carte',
    secondaryCta: 'Nous trouver',
  },

  reassurance: {
    takeaway: {
      label: 'À emporter',
      /** Formulation prudente : option mentionnée sur la fiche Google, sans commande en ligne. */
      text: 'Option indiquée sur la fiche Google de l’établissement.',
    },
  },

  menuPreview: {
    eyebrow: 'La carte',
    title: 'La carte complète arrive bientôt en ligne.',
    text:
      'Les produits, les prix et les photos seront publiés ici dès leur validation par l’établissement. En attendant, voici la structure prévue de la carte.',
    structureNote: 'Structure proposée, à valider avec l’établissement.',
    cta: 'Voir la page carte',
  },

  universe: {
    eyebrow: 'L’univers',
    title: 'Un snack de quartier, sur la Leuvensesteenweg.',
    paragraphs: [
      'Snack Gorbuz est un établissement de restauration rapide installé au 241 Leuvensesteenweg, à Zaventem, à quelques minutes de Bruxelles.',
      'Les photos de l’établissement, de l’équipe et des produits seront intégrées à cette page dès qu’elles seront disponibles. Cette section est prête à accueillir le vrai récit de la maison.',
    ],
    /** Repères factuels affichés en liste éditoriale (aucune promesse marketing). */
    facts: [
      { label: 'Lieu', value: 'Leuvensesteenweg 241, 1932 Zaventem' },
      { label: 'Type', value: 'Restauration rapide' },
      { label: 'Ouverture', value: 'Du lundi au samedi' },
      { label: 'Gamme de prix', value: '1–20 € (fiche Google)' },
    ],
    cta: 'En savoir plus',
  },

  gallery: {
    eyebrow: 'En images',
    title: 'L’ambiance, le comptoir, les produits.',
    text:
      'Les visuels ci-dessous sont des emplacements temporaires. Ils seront remplacés par les photographies officielles de Snack Gorbuz.',
    cta: 'Voir la galerie',
  },

  visit: {
    eyebrow: 'Nous trouver',
    title: 'Venez nous voir à Zaventem.',
    text: 'Sur place ou à emporter, selon les options proposées par l’établissement.',
    directionsCta: 'Itinéraire',
    callCta: 'Appeler',
  },

  pages: {
    menu: {
      title: 'La carte',
      intro:
        'La carte de Snack Gorbuz est en cours de mise en ligne. Les produits, les prix et les informations sur les allergènes seront ajoutés dès validation par l’établissement.',
      emptyCategory: 'Les produits de cette catégorie seront bientôt disponibles.',
      allergenNote:
        'Les informations sur les allergènes seront indiquées produit par produit dès qu’elles auront été communiquées par l’établissement. En cas d’allergie, renseignez-vous sur place.',
    },
    universe: {
      title: 'Notre univers',
      intro:
        'Cette page présentera l’établissement, son équipe et sa manière de travailler. Son contenu définitif est en attente des informations de la maison.',
      sections: [
        {
          heading: 'Le lieu',
          text: 'Un snack installé sur la Leuvensesteenweg, l’un des axes principaux de Zaventem, à proximité immédiate de Bruxelles et de l’aéroport.',
        },
        {
          heading: 'Le comptoir',
          text: 'Les produits sont préparés et servis au comptoir, sur place ou à emporter. Les photos du comptoir et de la préparation seront ajoutées ici.',
        },
        {
          heading: 'L’équipe',
          text: 'Portrait et mot de l’équipe à venir. Cet espace est réservé à la présentation des personnes qui font tourner Snack Gorbuz au quotidien.',
        },
      ],
    },
    gallery: {
      title: 'Galerie',
      intro:
        'Une galerie éditoriale prête à recevoir les photographies officielles : façade, comptoir, préparation, produits, équipe et moments de vie. Chaque emplacement ci-dessous est identifié et remplaçable.',
    },
    contact: {
      title: 'Contact & accès',
      intro: 'Adresse, horaires et téléphone de Snack Gorbuz à Zaventem.',
      hoursNote:
        'Horaires issus de la fiche Google de l’établissement. En cas de doute, appelez avant de vous déplacer.',
      accessHeading: 'Accès',
      accessText:
        'L’établissement se situe sur la Leuvensesteenweg (N2), à Zaventem. Les informations de stationnement et de transports en commun seront précisées par l’établissement.',
    },
  },

  footer: {
    note: 'Site vitrine — version 1. La carte et les photographies officielles seront ajoutées prochainement.',
  },
} as const;
