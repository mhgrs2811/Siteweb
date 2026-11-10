# StudioTwice, site du studio

Site vitrine de StudioTwice : création de sites web pour commerces locaux et indépendants en Belgique francophone.
Next.js (App Router), TypeScript, Tailwind v4, GSAP + ScrollTrigger, Lenis, Resend. Déploiement prévu sur Vercel.

## Lancer en local

```bash
npm install
npm run dev
```

Le site tourne sur http://localhost:3000.

## Vérifier avant de déployer

```bash
npm run lint
npm run build
npm run start
```

## Déployer sur Vercel

1. Importer le dépôt dans Vercel, dossier racine `studiotwice`.
2. Dans *Settings → Environment Variables*, ajouter les trois variables de `.env.example` :
   `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
   Sans elles, le formulaire affiche un message et invite à passer par WhatsApp ou le téléphone.
3. Déployer. Chaque `git push` sur la branche principale redéploie.

Ou en ligne de commande :

```bash
npx vercel
```

```bash
npx vercel --prod
```

## Modifier les contenus sans toucher au code

| Quoi | Fichier |
|---|---|
| Tarifs, options, délais, abonnement | `src/content/pricing.ts` |
| Afficher ou masquer tous les prix | `showPrices` en tête de `src/content/pricing.ts` (`false` : le site passe en « sur devis », le configurateur garde les choix sans montants) |
| Coordonnées, BCE, zone desservie, domaine | `src/content/site.ts` |
| Textes des sections, FAQ, formulaire | `src/content/sections.ts` |
| Textes du hero et de la page d’exemple | `src/content/hero.ts` |
| Réalisations | tableau `projects` dans `src/content/sections.ts`, captures dans `public/realisations/` |
| Couleurs et courbes | `src/app/globals.css` (variables en tête) et `src/lib/tokens.ts` |

Les polices sont auto-hébergées dans `src/fonts` (Archivo variable, Onest variable, licence SIL OFL).

## Version néerlandaise, plus tard

Dupliquer `src/content/sections.ts`, `hero.ts` et `pricing.ts` en `*.nl.ts`, créer une route `src/app/nl/page.tsx`
qui importe ces fichiers, et activer le lien « Nederlands » dans `src/components/Footer.tsx`.

## À compléter (TODO)

Chaque emplacement est signalé par un commentaire `TODO` dans le code.

- `src/content/site.ts` : domaine définitif, téléphone, WhatsApp, e-mail, numéro BCE, adresse, horaires.
- `src/content/sections.ts` : réalisations réelles (`projects`), prénoms du duo (`about.people[].name`),
  modalités de paiement et renouvellement du nom de domaine dans la FAQ.
- `.env` : clés Resend (voir `.env.example`).
- `public/og.png` : régénérer l’image de partage si le titre change (voir ci-dessous).

## Image de partage

`public/og.png` (1200 × 630) est rendue depuis une page HTML statique avec les polices du site.
Pour la refaire, ouvrir une page avec le même titre et la capturer à 1200 × 630, ou demander au studio.
