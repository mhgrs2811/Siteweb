import type { Alert, EntityStats, LearnArticle, PublicReport } from '@/domain';

/**
 * Données fictives pour le développement hors-ligne et les tests.
 * Aucune donnée réelle : numéros réservés à la fiction (06 12 34 56 78 est
 * un numéro d'exemple), domaines inventés.
 */
export const MOCK_ENTITIES: Record<string, { stats: EntityStats; reports: PublicReport[] }> = {
  '+33612345678': {
    stats: {
      totalReports: 14,
      recentReports: 6,
      distinctReporters: 11,
      lastReportedAt: daysAgo(1),
      categories: [
        { category: 'fake_bank', count: 9 },
        { category: 'phishing', count: 4 },
        { category: 'other', count: 1 },
      ],
    },
    reports: [
      {
        id: 'r1',
        category: 'fake_bank',
        excerpt:
          "Appel se présentant comme le service anti-fraude de ma banque, demande de valider une opération sur l'application.",
        createdAt: daysAgo(1),
      },
      {
        id: 'r2',
        category: 'fake_bank',
        excerpt: 'Demande de transférer mon argent vers un « compte sécurisé ». Le ton était très pressant.',
        createdAt: daysAgo(3),
      },
      { id: 'r3', category: 'phishing', excerpt: null, createdAt: daysAgo(12) },
    ],
  },
  'colis-suivi-express.com': {
    stats: {
      totalReports: 3,
      recentReports: 0,
      distinctReporters: 3,
      lastReportedAt: daysAgo(70),
      categories: [{ category: 'fake_delivery', count: 3 }],
    },
    reports: [
      {
        id: 'r4',
        category: 'fake_delivery',
        excerpt: 'SMS demandant 1,99 € de « frais de douane » pour livrer un colis que je n’attendais pas.',
        createdAt: daysAgo(70),
      },
    ],
  },
  'support@assistance-windows-fr.com': {
    stats: {
      totalReports: 1,
      recentReports: 1,
      distinctReporters: 1,
      lastReportedAt: daysAgo(2),
      categories: [{ category: 'tech_support', count: 1 }],
    },
    reports: [],
  },
};

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    title: 'Faux conseillers bancaires : vague d’appels signalée',
    summary:
      'De nombreux signalements décrivent des appels se présentant comme le service anti-fraude d’une banque.',
    body:
      "Depuis quelques jours, plusieurs personnes signalent des appels très convaincants. La personne au téléphone connaît parfois votre nom et votre banque.\n\nElle demande de « valider » une opération dans votre application, ou de déplacer votre argent vers un « compte sécurisé ».\n\nCe que vous pouvez faire :\n- Raccrochez, même si la personne est aimable.\n- Rappelez votre banque avec le numéro au dos de votre carte.\n- Ne validez jamais une opération que vous n’avez pas vous-même demandée.\n\nUne vraie banque ne vous demandera jamais de déplacer votre argent par téléphone.",
    severity: 'critical',
    publishedAt: daysAgo(1),
    region: 'FR',
  },
  {
    id: 'a2',
    title: 'SMS de livraison avec « frais à régler »',
    summary: 'Des SMS invitent à payer quelques euros pour recevoir un colis. Le lien mène à un faux site.',
    body:
      "Le message annonce qu’un colis est en attente et demande un petit paiement (1 ou 2 euros).\n\nLe but réel est de récupérer les informations de votre carte bancaire.\n\nCe que vous pouvez faire :\n- Ne cliquez pas sur le lien du SMS.\n- Vérifiez directement sur le site officiel du transporteur.\n- Si vous avez saisi votre carte, appelez votre banque pour la faire bloquer.",
    severity: 'warning',
    publishedAt: daysAgo(4),
    region: null,
  },
  {
    id: 'a3',
    title: 'Rappel : les impôts ne remboursent jamais par SMS',
    summary: 'Les messages promettant un remboursement d’impôts avec un lien sont à ignorer.',
    body:
      "L’administration fiscale ne vous demandera jamais vos coordonnées bancaires par SMS ou par email.\n\nPour toute démarche, passez uniquement par votre espace personnel sur le site officiel.",
    severity: 'info',
    publishedAt: daysAgo(9),
    region: 'FR',
  },
];

export const MOCK_ARTICLES: LearnArticle[] = [
  {
    id: 'l1',
    slug: 'reconnaitre-un-faux-conseiller-bancaire',
    title: 'Reconnaître un faux conseiller bancaire',
    summary: 'Les 5 signes qui doivent vous alerter quand « votre banque » vous appelle.',
    body:
      "## Le scénario habituel\n\nOn vous appelle en se présentant comme le service anti-fraude de votre banque. On vous annonce qu’une opération suspecte est en cours et qu’il faut agir vite.\n\n## Les signes qui doivent vous alerter\n\n- On vous met la pression : « il faut agir tout de suite ».\n- On vous demande de valider quelque chose dans votre application.\n- On vous demande un code reçu par SMS.\n- On vous propose de déplacer votre argent vers un « compte sécurisé ».\n- On vous demande de garder le secret.\n\n## Ce que vous pouvez faire\n\nRaccrochez, puis rappelez votre banque avec le numéro au dos de votre carte. Prenez votre temps : une vraie urgence bancaire n’exige jamais une réponse dans la minute.",
    category: 'fake_bank',
    readingMinutes: 3,
    publishedAt: daysAgo(30),
  },
  {
    id: 'l2',
    slug: 'sms-et-emails-pieges',
    title: 'SMS et emails pièges : comment les repérer',
    summary: 'Un lien, une urgence, une demande de paiement : le trio classique.',
    body:
      "## Comment ça marche\n\nVous recevez un message qui ressemble à une entreprise connue (livraison, banque, impôts, sécurité sociale). Il contient un lien vers un site qui imite le vrai.\n\n## Les signes qui doivent vous alerter\n\n- Une adresse d’expéditeur étrange ou un numéro inconnu.\n- Des fautes ou un ton inhabituel.\n- Une urgence : « votre compte sera fermé », « dernier rappel ».\n- Une demande de paiement ou d’identifiants.\n\n## Ce que vous pouvez faire\n\nNe cliquez pas. Ouvrez vous-même l’application ou le site officiel pour vérifier. En cas de doute, vérifiez le numéro ou l’adresse dans SafeCheck.",
    category: 'phishing',
    readingMinutes: 3,
    publishedAt: daysAgo(45),
  },
  {
    id: 'l3',
    slug: 'que-faire-si-vous-avez-ete-victime',
    title: 'Que faire si vous pensez avoir été victime',
    summary: 'Les bons réflexes, dans l’ordre, sans panique.',
    body:
      "## D’abord, respirez\n\nCela arrive à des milliers de personnes chaque jour, y compris des personnes très prudentes. Vous n’avez rien à vous reprocher.\n\n## Les étapes\n\n1. Appelez votre banque pour faire opposition si vous avez donné des informations bancaires.\n2. Changez vos mots de passe si vous avez saisi des identifiants.\n3. Conservez les messages, numéros et captures d’écran.\n4. Signalez le contact dans SafeCheck pour protéger les autres.\n5. Déposez plainte ou faites un signalement auprès des autorités compétentes.\n\n## Parlez-en\n\nUn proche, une association, votre banque : vous n’êtes pas seul.",
    category: 'general',
    readingMinutes: 4,
    publishedAt: daysAgo(60),
  },
];

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}
