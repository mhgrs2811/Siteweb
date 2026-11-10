/**
 * Textes des sections du site, en français de Belgique.
 * Pour ajouter le néerlandais plus tard : dupliquer ce fichier en `sections.nl.ts`
 * et exposer la bonne langue depuis `src/content/index.ts`.
 */
import { pricing } from "./pricing";

const site = (id: string) => pricing.sites.find((s) => s.id === id)!;

export const realisations = {
  num: "02",
  title: "Réalisations",
  lead: "Nos premières réalisations arrivent ici. Chaque projet en grand format, avec le secteur du commerce, ce qui a été fait et le lien vers le site.",
  /**
   * TODO: remplacer par les projets réels. Un objet par projet :
   * { name, sector, city, what: [...], url, image: "/realisations/nom.webp" }
   * Avec un seul projet, la section devient une étude de cas complète.
   */
  projects: [] as Array<{
    name: string;
    sector: string;
    city: string;
    what: string[];
    url: string;
    image: string;
  }>,
  emptyTitle: "Votre commerce pourrait être le premier ici.",
  emptyText:
    "Nous démarrons. Les premiers sites livrés seront montrés ici, tels qu’ils sont en ligne, avec le nom du commerce et le lien. Pas de maquette fictive, pas de faux clients.",
};

export const services = {
  num: "03",
  title: "Ce que nous faisons",
  lead: "Trois formules, expliquées par ce que vous obtenez, pas par la technique.",
  items: [
    {
      siteId: "onepage",
      outcome: "Être trouvé.",
      text: "Quelqu’un cherche « garage ouvert samedi » ou « coiffeur près de chez moi ». Il doit tomber sur vous, voir vos horaires et pouvoir appeler en un geste. Une seule page, claire, qui fait ça très bien.",
      get: [
        "Une page qui dit tout : qui, quoi, où, quand",
        "Bouton d’appel et itinéraire en un geste",
        "Vos horaires, votre adresse, votre photo",
        "Rapide sur téléphone, même en 4G faible",
      ],
      from: site("onepage").from,
      delay: site("onepage").delayWeeks,
    },
    {
      siteId: "vitrine",
      outcome: "Recevoir des demandes.",
      text: "Montrer votre travail, vos plats, votre salon, votre atelier, et donner envie de vous écrire. Cinq à sept pages, une galerie de vos réalisations, un formulaire qui arrive dans votre boîte mail.",
      get: [
        "Cinq à sept pages : accueil, services, photos, à propos, contact",
        "Galerie de vos réalisations, à jour",
        "Formulaire de demande ou de réservation simple",
        "Fiche Google Business créée et remplie avec vous",
      ],
      from: site("vitrine").from,
      delay: site("vitrine").delayWeeks,
    },
    {
      siteId: "custom",
      outcome: "Vendre et réserver en ligne.",
      text: "Vos clients réservent une table, commandent à emporter, prennent rendez-vous ou achètent, directement sur votre site, sans commission d’une plateforme. Nous construisons exactement ce dont vous avez besoin.",
      get: [
        "Réservation de table ou prise de rendez-vous",
        "Commande à emporter ou boutique en ligne",
        "Paiement en ligne sécurisé",
        "Un tableau de bord simple pour gérer tout ça",
      ],
      from: site("custom").from,
      delay: site("custom").delayWeeks,
    },
  ],
  cta: pricing.showPrices ? "Estimer ce site" : "Demander un devis",
};

export const process = {
  num: "05",
  title: "Comment ça se passe",
  lead: "Quatre étapes, sans jargon. Vous savez toujours où on en est.",
  steps: [
    {
      title: "On se rencontre chez vous.",
      text: "Pas de visioconférence. Nous passons à votre commerce, à une heure creuse. On regarde ce que vous faites, ce que vos clients demandent, les photos que vous avez déjà. Vous repartez avec une estimation claire.",
      sheet: "visite",
    },
    {
      title: "Vous voyez la maquette avant qu’on construise.",
      text: "Une maquette de votre page d’accueil, à regarder sur votre téléphone. Vous dites ce qui va et ce qui ne va pas. On ajuste jusqu’à ce que ça vous ressemble, puis on construit.",
      sheet: "maquette",
    },
    {
      title: "Mise en ligne, on s’occupe de tout.",
      text: "Nom de domaine, hébergement, fiche Google, adresse e-mail professionnelle si vous le souhaitez. Le jour venu, on vérifie ensemble sur votre téléphone, puis on met en ligne.",
      sheet: "enligne",
    },
    {
      title: "On reste là.",
      text: "Un horaire qui change, une nouvelle photo, une carte de saison : vous nous écrivez, on s’en occupe. C’est compris dans l’entretien. Et si votre commerce grandit, le site grandit avec lui.",
      sheet: "suivi",
    },
  ],
};

export const about = {
  num: "06",
  title: "Qui nous sommes",
  statement: "Nous sommes deux.",
  people: [
    {
      role: "La première dessine et construit.",
      // TODO: prénom de la personne qui conçoit et développe.
      name: "",
      text: "Chaque page est dessinée pour votre commerce, puis écrite ligne à ligne. Pas de modèle acheté, pas de thème bricolé. C’est plus long, et c’est pour ça que le résultat ne ressemble à aucun autre.",
    },
    {
      role: "La seconde vient vous voir.",
      // TODO: prénom de la personne qui rencontre les clients.
      name: "",
      text: "Elle rencontre les commerçants chez eux, écoute, prend les photos, relit les textes avec vous et reste votre interlocutrice après la mise en ligne. Une seule personne à appeler, du premier café au dernier réglage.",
    },
  ],
  footer: "Un studio de deux personnes, en Belgique francophone. Pas d’intermédiaire, pas de sous-traitance : les deux personnes que vous rencontrez sont celles qui font votre site.",
};

export const faq = {
  num: "07",
  title: "Questions fréquentes",
  items: [
    {
      q: "Combien de temps ça prend ?",
      a: `Une semaine pour un site une page, deux à trois semaines pour un site vitrine, quatre à six semaines pour un site sur mesure. Le délai court à partir du moment où nous avons vos textes et vos photos, ou de notre séance photo chez vous.`,
    },
    {
      q: "Le site m’appartient-il ?",
      a: "Oui, entièrement. Le nom de domaine est enregistré à votre nom, les textes, les photos et le code sont à vous. Si vous décidez un jour de partir, vous emportez tout, sans frais.",
    },
    {
      q: "Et le nom de domaine ?",
      // TODO: confirmer qui paie le renouvellement annuel du nom de domaine.
      a: "Nous réservons votre nom de domaine, en .be ou autre, à votre nom. Si vous en avez déjà un, nous le reprenons. Il reste votre propriété, quoi qu’il arrive.",
    },
    {
      q: "Puis-je modifier mon site après la livraison ?",
      a: pricing.showPrices
        ? `Oui. Les petites modifications, horaires, photos, carte, prix, sont comprises dans l’entretien à ${pricing.hosting.monthly} € par mois : vous nous écrivez, on s’en occupe. Pour une nouvelle page, comptez ${pricing.extraPage} €. Pour une nouvelle fonction, on fait un petit devis.`
        : "Oui. Les petites modifications, horaires, photos, carte, prix, sont comprises dans l’entretien mensuel : vous nous écrivez, on s’en occupe. Pour une nouvelle page ou une nouvelle fonction, on fait un petit devis.",
    },
    {
      q: "Comment se passe le paiement ?",
      // TODO: confirmer les modalités (montant de l'acompte, échéances).
      a: "Un acompte à la commande, le solde à la mise en ligne, sur facture. L’entretien et l’hébergement se paient chaque mois, sans engagement de durée. Tous nos prix sont affichés hors TVA.",
    },
  ],
};

export const contact = {
  num: "08",
  title: "Parlons de votre commerce.",
  lead: "Dites-nous qui vous êtes et ce que vous faites. On vous rappelle, ou on passe vous voir.",
  fields: {
    name: "Votre nom",
    business: "Votre commerce",
    reach: "Téléphone ou e-mail",
    message: "Votre message",
    messagePlaceholder: "Ce que vous vendez, où, et ce que vous attendez du site.",
    summary: pricing.showPrices ? "Votre estimation" : "Votre projet",
    summaryHint: "Récapitulatif de vos choix, vous pouvez le modifier.",
    submit: "Envoyer",
    sending: "Envoi en cours",
  },
  whatsapp: "Écrire sur WhatsApp",
  call: "Appeler",
  success: {
    title: "Bien reçu.",
    text: "On vous répond rapidement, par téléphone ou par e-mail. À très vite.",
  },
  error: "Le message n’est pas parti. Réessayez, ou écrivez-nous directement par WhatsApp.",
  notConfigured: "L’envoi n’est pas encore activé. Contactez-nous par WhatsApp ou par téléphone.",
};

export const footer = {
  legal: "Mentions légales",
  privacy: "Politique de confidentialité",
  nl: "Nederlands",
  nlSoon: "bientôt",
  area: "Nous nous déplaçons à",
  bce: "BCE",
};
