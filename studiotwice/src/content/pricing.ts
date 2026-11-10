/**
 * TARIFS DE STUDIOTWICE
 * ---------------------------------------------------------------------------
 * Ce fichier est la seule source des montants affichés sur le site.
 * Modifiez les nombres ci-dessous, rien d'autre : le configurateur, les
 * formules et le récapitulatif envoyé par le formulaire se mettent à jour.
 *
 * Tous les montants sont en euros, hors TVA.
 * Les délais sont en semaines : [minimum, maximum].
 */
export const pricing = {
  /**
   * Afficher les prix sur le site ?
   * true  : montants visibles partout, configurateur avec estimation chiffrée.
   * false : aucun montant ; le configurateur devient une demande de devis
   *         (les choix sont conservés et envoyés dans le formulaire).
   */
  showPrices: true,
  /** Texte affiché à la place d'un montant quand les prix sont masqués. */
  quoteLabel: "Sur devis",
  quoteDisclaimer: "Devis gratuit après un échange, sur place ou par téléphone.",

  /** Mention affichée à côté de chaque montant. */
  vat: "HTVA",

  /** Les trois formules. L'ordre est celui de l'affichage. */
  sites: [
    {
      id: "onepage",
      name: "Site une page",
      /** Ce que le commerçant obtient, en une phrase. */
      promise: "Être trouvé sur Google et appelé.",
      detail:
        "Une seule page, claire : qui vous êtes, ce que vous faites, vos horaires, votre adresse, un bouton pour appeler. Idéal pour démarrer.",
      from: 890,
      pagesIncluded: 1,
      /** Peut-on ajouter des pages à cette formule ? */
      extraPages: false,
      pagesMin: 1,
      pagesMax: 1,
      delayWeeks: [1, 1],
      googleBusinessIncluded: false,
    },
    {
      id: "vitrine",
      name: "Site vitrine complet",
      promise: "Montrer votre travail et recevoir des demandes.",
      detail:
        "Cinq à sept pages : accueil, services ou carte, photos, à propos, contact. Fiche Google Business comprise.",
      from: 1890,
      pagesIncluded: 7,
      extraPages: true,
      pagesMin: 5,
      pagesMax: 12,
      delayWeeks: [2, 3],
      googleBusinessIncluded: true,
    },
    {
      id: "custom",
      name: "Site sur mesure",
      promise: "Réserver, commander ou vendre en ligne.",
      detail:
        "Réservation de table, commande à emporter, prise de rendez-vous, boutique en ligne. Nous construisons ce dont votre commerce a besoin.",
      from: 3500,
      pagesIncluded: 7,
      extraPages: true,
      pagesMin: 5,
      pagesMax: 15,
      delayWeeks: [4, 6],
      googleBusinessIncluded: true,
    },
  ],

  /** Prix d'une page au-delà des pages comprises. */
  extraPage: 150,

  /** Les options. Chacune ajoute son montant et, parfois, des semaines. */
  options: {
    copy: {
      name: "Rédaction des textes",
      note: "350 € jusqu’à 5 pages, puis 70 € par page",
      /** Note affichée quand les prix sont masqués. */
      noteQuote: "Vos textes, écrits avec vous, page par page",
      base: 350,
      basePages: 5,
      perExtraPage: 70,
      delayWeeks: 1,
    },
    photo: {
      name: "Shooting photo",
      note: "390 € la demi-journée, chez vous",
      noteQuote: "Une demi-journée chez vous, photos prêtes pour le site",
      perHalfDay: 390,
      maxHalfDays: 3,
      delayWeeks: 0,
    },
    language: {
      name: "Deuxième langue",
      note: "+30 % du prix du site, minimum 300 €",
      noteQuote: "Votre site dans une deuxième langue",
      percent: 30,
      minimum: 300,
      delayWeeks: 1,
    },
    logo: {
      name: "Logo et identité",
      note: "Logo, couleurs, typographies, à vous pour toujours",
      price: 590,
      delayWeeks: 1,
    },
    googleBusiness: {
      name: "Fiche Google Business",
      note: "Comprise dans le site vitrine et le sur-mesure",
      price: 150,
      delayWeeks: 0,
    },
  },

  /** Abonnement mensuel, affiché à part du prix du site. */
  hosting: {
    name: "Entretien et hébergement",
    note: "Hébergement, sauvegardes, mises à jour, petites modifications",
    monthly: 49,
  },

  /** Phrase affichée sous l'estimation. */
  disclaimer:
    "Estimation hors TVA. Le devis définitif est établi après un échange, sur place ou par téléphone.",
} as const;

export type SiteId = (typeof pricing.sites)[number]["id"];
export type OptionId = keyof typeof pricing.options;
