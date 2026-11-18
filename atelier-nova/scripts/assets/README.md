# Pipeline d’images du portfolio

Les cinq projets du portfolio (Maison Ardoise, Sève, Hinoki & Lin, VIDE, Orbe) sont des **concepts fictifs**. Leurs visuels sont produits localement, sans banque d’images :

1. **Rendus 3D photographiques** (`scenes/<slug>.html`) : des scènes Three.js rendues dans Chromium sans écran. Chaque image est la moyenne de 16 passes, avec des lumières surfaciques en jitter (ombres douces), une lumière de ciel aléatoire (occlusion douce), une profondeur de champ et un anticrénelage sous-pixel. Un grain et un vignettage sont ajoutés à la fin.
2. **Mini-sites** (`sites/<slug>/index.html`) : une page d’accueil conçue pour chaque concept (polices Google Fonts, palette propre). Ils utilisent les rendus 3D et sont capturés avec Playwright en desktop (1440 px) et en mobile (390 px).
3. **Export** : WebP via sharp dans `public/images/projects/<slug>/`, puis génération de `src/content/generated/media.ts` (dimensions et `blurDataURL` de chaque image).

## Commandes

```bash
node scripts/assets/render-all.mjs                         # tout (≈ 30–45 min sur CPU)
node scripts/assets/render-all.mjs --only=renders          # rendus 3D seulement
node scripts/assets/render-all.mjs --only=sites            # captures des mini-sites seulement
node scripts/assets/render-all.mjs --only=media            # régénère media.ts seulement
node scripts/assets/render-all.mjs --filter=orbe-cafe      # un seul concept
node scripts/assets/render-all.mjs --filter=orbe-cafe/cover --passes=6   # aperçu rapide d’un rendu
```

Prérequis : Playwright et Chromium (préinstallés dans l’environnement), `three` et `sharp` (dépendances du projet). Les polices sont chargées depuis Google Fonts au moment du rendu, il faut donc un accès réseau.

## Fichiers produits par concept

| Fichier | Taille | Contenu |
|---|---|---|
| `cover.webp` | 1600 × 1000 | rendu 3D principal |
| `render-1.webp` | 1600 × 1100 | rendu 3D secondaire (paysage) |
| `render-2.webp` | 1200 × 1500 | rendu 3D secondaire (portrait) |
| `desktop-hero.webp` | 1440 × 900 | capture du haut de page desktop |
| `desktop-full.webp` | 1440 × hauteur de page | capture pleine page desktop |
| `mobile-1.webp`, `mobile-2.webp` | 780 × 1688 | captures mobiles (390 px, DPR 2) |
| `detail-1.webp` | 1440 × 900 | section signature (menu, réservation, collection…) |
| `detail-2.webp` | 1440 × 900 | Orbe uniquement : tiroir panier ouvert |

## Remplacer par de vraies images

Quand de vraies photos ou captures existent, il suffit de déposer des fichiers WebP portant les mêmes noms dans `public/images/projects/<slug>/`, puis de lancer `--only=media` pour mettre à jour les dimensions et les placeholders.

## Limites connues

- Le rendu se fait sur CPU (SwiftShader) : c’est lent, mais déterministe (graine fixe).
- Les rendus restent des images de synthèse. Les objets simples (boîtes, céramiques, flacons) sont crédibles ; l’architecture extérieure et la nourriture le sont moins. C’est pour ça que le mini-site VIDE affiche ses images en noir et blanc.
