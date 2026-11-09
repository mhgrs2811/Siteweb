# CLAUDE.md — Règles de design pour des sites web soignés

Ce fichier s'applique à **tous les sites web et interfaces** créés dans ce dépôt.
Objectif : chaque site doit avoir l'air conçu par un·e designer, avec une direction
artistique propre au projet. Il ne doit **jamais** avoir l'air « vibe codé », c'est-à-dire
généré par une IA sans intention, avec les réflexes par défaut.

---

## 0. Ordre de priorité

1. **Les références fournies par l'utilisateur** (captures, liens, maquettes, sites
   aimés) passent avant tout le reste de ce fichier.
2. L'identité existante du projet (logo, charte, couleurs, typographies déjà en place).
3. Les règles ci-dessous.

En cas de doute sur la direction visuelle, **demander une référence** plutôt que de
retomber sur un style générique.

---

## 1. Suivre les références de l'utilisateur

Quand l'utilisateur fournit un site, une capture ou un design en exemple :

- **L'analyser avant de coder** et noter brièvement ce qui en fait le caractère :
  - typographies (serif / sans-serif, graisses, tailles, interlignage, casse) ;
  - palette (couleur dominante, couleur d'accent, neutres, rapport clair/sombre) ;
  - grille et rythme (largeur max, marges, espacement vertical entre sections) ;
  - traitement des images (plein cadre, détourées, coins arrondis ou non, grain) ;
  - style des boutons, liens, cartes, bordures, ombres ;
  - ton général (éditorial, luxe, technique, artisanal, ludique, minimal…).
- **Reprendre l'esprit, pas copier** : s'inspirer de la structure, du rythme et de
  l'ambiance, sans reproduire textes, logos ou marques d'un tiers.
- Si une règle de ce fichier contredit la référence fournie, **la référence gagne**
  (ex. : l'utilisateur montre un site violet qu'il adore → on peut utiliser du violet).
- Après réalisation, comparer le résultat à la référence et l'indiquer en une phrase
  dans le compte rendu.

---

## 2. Ce qui fait « site vibe codé » — à éviter

Ces motifs trahissent immédiatement un site généré sans intention. Ne pas les utiliser,
sauf demande explicite ou référence fournie qui les contient.

### Couleurs
- ❌ **Dégradés violets / violet-bleu / violet-rose** (`#7c3aed`, `#8b5cf6`, `#a855f7`,
  `indigo-500 → purple-600`, etc.). C'est le marqueur n°1 du site vibe codé.
  Le violet est **à éviter par défaut**, en fond comme en accent.
- ❌ Fond noir avec un halo / « glow » coloré flou derrière le titre.
- ❌ Texte en dégradé (`bg-clip-text text-transparent bg-gradient-to-r …`) sur les titres.
- ❌ Palette Tailwind par défaut prise telle quelle (`blue-500`, `indigo-600`, `slate-900`)
  sans aucune personnalisation.
- ❌ Plus de 2 couleurs vives sur une même page.

### Mise en page et contenu
- ❌ Hero centré « The Future of X is Here » / « Start it. Build it. Launch it. » :
  titre générique + sous-titre vague + deux boutons côte à côte.
- ❌ La rangée de 3 chiffres-clés (« 25% · 90% · 300% ») sans source ni contexte.
- ❌ La grille de 3 ou 6 cartes identiques « fonctionnalités » avec une icône dans un
  carré arrondi coloré, un titre et deux lignes de texte.
- ❌ Badge pilule au-dessus du titre (« ✨ New: AI-powered… »).
- ❌ Emojis utilisés comme icônes (🚀 ⚡ ✨ 🔥).
- ❌ Glassmorphism partout (`backdrop-blur` + bordure blanche translucide sur chaque carte).
- ❌ Tout centré, toutes les sections de même hauteur, même structure répétée.
- ❌ Coins très arrondis (`rounded-2xl`/`rounded-3xl`) appliqués uniformément à tout.
- ❌ Ombres portées fortes et floues sur chaque élément.
- ❌ Textes de remplissage creux : « Révolutionnez votre workflow », « Boostez votre
  productivité », « Solution tout-en-un », lorem ipsum laissé en place.
- ❌ Faux témoignages / faux logos clients / fausses statistiques.

### Typographie
- ❌ Inter / système par défaut pour tout, sans hiérarchie ni personnalité.
- ❌ Titres énormes en gras 800 partout, sans contraste de graisse ni de style.

---

## 3. Ce qu'on fait à la place

### Direction artistique
- Choisir **une direction claire** adaptée au sujet avant d'écrire du code, et
  l'énoncer en une ligne (ex. : « éditorial chaleureux, papier crème, serif contrastée,
  accent terracotta »).
- Le design doit découler du **contenu réel** du projet (métier, public, lieu, produit),
  pas d'un modèle de landing page SaaS.

### Couleurs
- Partir d'une base de **neutres travaillés** (blanc cassé, crème, pierre, gris chaud,
  encre, anthracite) plutôt que blanc pur `#fff` / noir pur `#000`.
- **Une seule couleur d'accent**, utilisée avec parcimonie (CTA, liens, détails).
- Pistes de palettes non génériques (à adapter au projet) :
  - Terracotta `#C2522D` + crème `#F5EFE6` + encre `#1E1B18`
  - Vert sapin `#1F3D2B` + sable `#E9E2D3` + laiton `#B08D57`
  - Bleu marine profond `#14213D` + ivoire `#FAF7F0` + orange brûlé `#E36414`
  - Noir chaud `#161513` + os `#EDE8DF` + rouge vermillon `#D7372B`
  - Olive `#5B6236` + lin `#EFEBE1` + brun `#3B2A20`
- Déclarer les couleurs en **variables CSS** (`--color-bg`, `--color-text`,
  `--color-accent`, …) — jamais de valeurs en dur dispersées.
- Contraste texte/fond conforme **WCAG AA** (4.5:1 pour le texte courant).

### Typographie — toujours une belle police
- **Ne jamais livrer une page en police système par défaut.** Charger une vraie police
  (Google Fonts, Fontshare ou fichiers locaux en `woff2`).
- Associer **2 familles maximum** : une pour les titres (avec du caractère), une pour
  le texte (très lisible).
- Associations qui fonctionnent bien :
  | Titres | Texte | Ambiance |
  |---|---|---|
  | Fraunces | Inter Tight | éditorial chaleureux |
  | Playfair Display | Source Sans 3 | élégant, classique |
  | Cormorant Garamond | Manrope | luxe, beauté, mode |
  | Instrument Serif | Geist / DM Sans | moderne raffiné |
  | DM Serif Display | DM Sans | magazine |
  | Space Grotesk | IBM Plex Sans | tech sobre (sans violet !) |
  | Archivo / Archivo Black | Work Sans | industriel, garage, artisan |
  | Syne / Clash Display | Satoshi / General Sans | créatif, studio |
  | Bricolage Grotesque | Figtree | convivial, local |
- Règles typographiques :
  - échelle de tailles cohérente (ex. ratio 1.25) avec `clamp()` pour être fluide ;
  - texte courant : 16–18 px minimum, interlignage 1.5–1.7, **60–75 caractères par ligne** ;
  - titres : interlignage serré (1.05–1.2), `letter-spacing` légèrement négatif sur les
    grandes tailles ;
  - utiliser le contraste de graisse (400 / 600) et de style (serif / sans) pour la
    hiérarchie, pas seulement la taille ;
  - `font-display: swap` et `preconnect` pour les polices web ;
  - soigner les détails : apostrophes typographiques (’), guillemets « », espaces
    insécables avant `: ; ! ?` en français.

### Mise en page
- Utiliser une **grille** (12 colonnes ou équivalent) et une largeur de contenu maîtrisée
  (`max-width` ~1200–1320 px, texte ~65ch).
- **Varier les sections** : alterner alignements à gauche, compositions asymétriques,
  image pleine largeur, texte en colonnes, listes éditoriales… Pas de répétition
  mécanique du même bloc.
- Système d'espacement constant (base 4 ou 8 px) et **beaucoup d'air** entre les sections.
- Des images réelles et de qualité (photos du projet si disponibles) plutôt que des
  illustrations génériques ou des icônes en masse. Toujours un `alt` descriptif.
- Icônes : un seul jeu cohérent en SVG au trait fin (Lucide, Phosphor, Tabler…), jamais
  d'emojis.
- Animations discrètes et utiles (fondu, léger décalage au scroll, 150–300 ms) ;
  respecter `prefers-reduced-motion`.
- Des textes concrets et spécifiques au projet : ce que fait l'entreprise, pour qui, où,
  à quel prix, comment contacter.

---

## 4. Responsive : desktop ET mobile, toujours

Chaque page doit être pensée et vérifiée pour les deux, sans exception.

- Conception **mobile-first**, puis enrichissement pour tablette et desktop.
- Points de contrôle obligatoires : **375 px** (mobile), **768 px** (tablette),
  **1440 px** (desktop). Vérifier aussi 320 px et 1920 px pour les cas extrêmes.
- `<meta name="viewport" content="width=device-width, initial-scale=1">` présent.
- **Aucun défilement horizontal** à aucune largeur.
- Cibles tactiles d'au moins **44 × 44 px** ; espacement suffisant entre les liens.
- Navigation mobile : menu accessible (bouton avec `aria-expanded`, fermeture au clic
  et à `Échap`), numéro de téléphone / CTA principal facilement atteignable.
- Tailles de police fluides avec `clamp()` ; pas de texte < 16 px dans les champs de
  formulaire (évite le zoom auto sur iOS).
- Images responsives (`srcset`/`sizes` ou `<picture>`, formats WebP/AVIF,
  `loading="lazy"` sous la ligne de flottaison, dimensions `width`/`height` pour éviter
  les décalages de mise en page).
- Performance : viser un Lighthouse ≥ 90 en performance et accessibilité sur mobile.

---

## 5. Toujours vérifier son travail avant de dire « terminé »

Un site n'est **jamais** livré sans vérification visuelle. Étapes obligatoires :

1. **Lancer la page** (serveur local ou fichier) et la capturer avec Playwright
   (Chromium est préinstallé : `require('playwright')`) aux largeurs 375, 768 et 1440 px,
   en pleine page.
2. **Regarder réellement les captures** et contrôler :
   - [ ] aucun élément qui déborde, se chevauche ou est coupé ;
   - [ ] pas de défilement horizontal (`document.documentElement.scrollWidth <= innerWidth`) ;
   - [ ] les polices web sont bien chargées (pas de repli sur la police système) ;
   - [ ] la hiérarchie se lit en 3 secondes : quoi, pour qui, quelle action ;
   - [ ] aucun motif de la liste « vibe codé » de la section 2 (dégradé violet, emojis,
         hero générique, grille de cartes identiques…) ;
   - [ ] contraste suffisant, images nettes et non déformées ;
   - [ ] menu mobile fonctionnel, liens et boutons cliquables ;
   - [ ] aucune erreur dans la console du navigateur ;
   - [ ] fidélité aux références fournies par l'utilisateur.
3. **Corriger** tout ce qui ne va pas, puis refaire les captures. Répéter jusqu'à ce que
   tout soit propre.
4. Dans le compte rendu final, indiquer ce qui a été vérifié, à quelles largeurs, et
   signaler honnêtement tout point restant.

Ne jamais affirmer qu'un rendu est correct sans l'avoir vu.

---

## 6. Qualité du code

- HTML sémantique (`header`, `nav`, `main`, `section`, `footer`, titres `h1`→`h3` dans
  l'ordre, un seul `h1` par page).
- Accessibilité : `alt` sur les images, `label` sur les champs, focus visible au clavier,
  liens explicites (pas de « cliquez ici »).
- SEO de base : `<title>` et `meta description` uniques, balises Open Graph,
  `lang="fr"` (ou la langue du site).
- CSS organisé autour de variables (couleurs, espacements, typographies, rayons).
- Pas de dépendances lourdes inutiles pour un site vitrine.

---

## 7. Résumé express

> Pas de violet, pas de dégradé, pas d'emoji, pas de hero générique.
> Une vraie police, une seule couleur d'accent, beaucoup d'air.
> Mobile et desktop, vérifiés en captures à 375 / 768 / 1440 px.
> Les références de l'utilisateur passent avant tout.
