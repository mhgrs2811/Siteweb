import { deepTypo } from "@/lib/typo";

export type FaqItem = { q: string; a: string };

export const faq: FaqItem[] = deepTypo([
  {
    q: "Combien coûte un site internet ?",
    a: "Nos formules commencent à 2 900 € HTVA pour un site vitrine Essential, 6 500 € HTVA pour un site Signature entièrement sur mesure et 8 900 € HTVA pour une boutique e-commerce. Le prix final dépend du nombre de pages, des fonctionnalités et des langues : vous recevez un devis détaillé après l’appel de découverte, sans frais.",
  },
  {
    q: "Quels sont les délais de création ?",
    a: "Comptez en général 3 à 4 semaines pour un site Essential, 5 à 8 semaines pour un site Signature et 6 à 10 semaines pour une boutique en ligne. Le calendrier précis est fixé au démarrage et dépend aussi de la disponibilité de vos contenus (textes, photos, produits).",
  },
  {
    q: "Comment se déroule un projet ?",
    a: "En six étapes : découverte, analyse du besoin, direction artistique, conception et développement, tests, mise en ligne. Vous validez chaque étape clé et vous avez accès à une version de prévisualisation privée pendant tout le développement.",
  },
  {
    q: "Le site sera-t-il optimisé pour Google ?",
    a: "Oui. Chaque site est livré avec un SEO technique soigné : structure des titres, métadonnées par page, sitemap, données structurées, vitesse de chargement et compatibilité mobile. Le référencement dépend aussi de vos contenus et de la concurrence : nous ne promettons pas de position, mais nous vous donnons de solides fondations et des recommandations concrètes.",
  },
  {
    q: "Puis-je modifier mon site moi-même ?",
    a: "Oui, dès la formule Signature (et en option pour Essential) : textes, images, menus, actualités ou produits se modifient depuis une interface simple. Nous vous formons à la prise en main lors de la livraison.",
  },
  {
    q: "Proposez-vous l’hébergement ?",
    a: "Oui. Nous mettons en place un hébergement rapide et sécurisé, adapté à la technologie du site, et nous nous occupons du nom de domaine si vous le souhaitez. La première année est incluse dans les formules Essential et Signature.",
  },
  {
    q: "Assurez-vous la maintenance ?",
    a: "Oui, avec trois forfaits mensuels (Veille, Sérénité, Croissance) qui couvrent les mises à jour, les sauvegardes, la surveillance et, selon le forfait, des heures d’évolution. Ils sont sans engagement de durée au-delà du premier trimestre.",
  },
  {
    q: "Comment fonctionne votre approche avec l’IA ?",
    a: "L’IA est un outil de production, pas un auteur. Elle nous aide à explorer des variantes, accélérer l’intégration, rédiger des premières versions et contrôler le code. La stratégie, la direction artistique et chaque décision finale restent humaines. Nous n’envoyons pas vos données confidentielles à des services d’IA sans votre accord.",
  },
]);

export const pricingFaq: FaqItem[] = deepTypo([
  {
    q: "Les prix affichés sont-ils définitifs ?",
    a: "Ce sont des prix de départ indicatifs, hors TVA. Le devis final est établi après l’analyse de votre besoin, et il ne change plus sans votre accord écrit.",
  },
  {
    q: "Comment se répartissent les paiements ?",
    a: "En général : 40 % à la signature, 40 % à la validation de la direction artistique et 20 % à la mise en ligne. Un échelonnement différent peut être discuté pour les projets plus importants.",
  },
  {
    q: "Qu’est-ce qui n’est pas inclus ?",
    a: "Les abonnements d’outils tiers (Shopify, réservation, e-mailing), les licences de typographies ou de photos payantes, les traductions et les séances photo. Nous vous les signalons toujours dans le devis.",
  },
  {
    q: "Le site m’appartient-il ?",
    a: "Oui. À la fin du projet et après paiement complet, vous êtes propriétaire de votre nom de domaine, de vos contenus et du site livré. Vous restez libre de changer de prestataire.",
  },
]);
