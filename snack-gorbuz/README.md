# Snack Gorbuz — site web (V1)

Site vitrine multi-pages de Snack Gorbuz : Next.js 16 (App Router), React 19,
TypeScript, CSS modules + tokens, scène 3D WebGL (three.js / React Three Fiber).

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de production
npm run start      # serveur de production
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Où modifier les contenus

| Besoin | Fichier |
|---|---|
| Nom, baseline, adresse, téléphone, email, horaires, réseaux, commande, légal | `src/data/siteConfig.ts` |
| Familles, produits, prix, options, allergènes, vedette | `src/data/menuData.ts` |
| Galerie (emplacements, fichiers attendus, alt) | `src/data/galleryData.ts` |
| Avis clients vérifiés | `src/data/testimonialsData.ts` |
| Titres / descriptions SEO | `src/data/seoData.ts` |
| Tous les textes éditoriaux | `src/data/copy.ts` |
| Palette, typographies, espacements | `src/app/globals.css` (`:root`) |
| Scène 3D du hero | `src/components/hero/HeroScene.tsx` |
| Fallback graphique du hero | `src/components/hero/HeroPoster.tsx` |
| Médias à déposer | `public/media/` (voir `README.txt`) |

Les blocs ne s'affichent que lorsque leurs données sont réellement renseignées.
La liste complète des contenus à fournir est dans `docs/A_COMPLETER_APRES_V1.txt`.

## Structure

```
src/app            routes (/, /carte, /concept, /galerie, /contact, légales), robots, sitemap
src/components     hero (3D), home (8 chapitres), menu, gallery, practical, legal, layout, ui
src/data           configuration et contenus centralisés (typés)
src/lib            routes et navigation
docs/              contexte maître, registre des prompts, liste à compléter
prompts/           prompts versionnés
references/        brief de direction artistique (3 références)
```
