# Snack Gorbuz — site web (V1)

Site vitrine multi-pages de Snack Gorbuz : Next.js 16 (App Router, TypeScript), CSS Modules
sur tokens CSS, scène 3D procédurale Three.js / React Three Fiber dans le hero avec poster SVG
de secours.

## Commandes

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build
npm run verify     # captures Playwright 375 / 768 / 1440 + contrôles (après `npm run build && npm start`)
                   # nécessite Playwright + Chromium : npm i -D playwright && npx playwright install chromium
```

## Où modifier les contenus

| Besoin | Fichier |
| --- | --- |
| Coordonnées, horaires, réseaux, commande, mentions légales | `src/data/site.ts` |
| Familles et produits (noms, descriptions, prix, options, allergènes) | `src/data/menu.ts` |
| Produit à l’honneur | `src/data/featured.ts` |
| Galerie, coulisses, visuel du hero | `src/data/gallery.ts` |
| Avis clients vérifiés | `src/data/testimonials.ts` |
| Tous les textes provisoires | `src/data/copy.ts` |
| Titres et descriptions SEO | `src/data/seo.ts` |
| Médias (photos, logo) | `public/images/` (voir `public/images/README.txt`) |

La liste exacte des informations à fournir pour finaliser le site : `docs/A_COMPLETER_APRES_V1.txt`.
Le dossier de pilotage (contexte maître, brief DA, registre des prompts) est dans `docs/` et `prompts/`.

## Règle absolue

Aucune donnée inventée. Une valeur `null` ou un tableau vide dans les fichiers de données
masque l’affichage ou déclenche un état provisoire explicite (« Bientôt disponible »).
