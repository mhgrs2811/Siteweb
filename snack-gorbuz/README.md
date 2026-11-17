# Snack Gorbuz — site vitrine V1

Site vitrine de **Snack Gorbuz**, snack de restauration rapide à Zaventem (Leuvensesteenweg 241).
Version 1 : identité visuelle, structure complète, données centralisées, carte prête à recevoir
les produits réels. Aucun produit, prix, avis ou lien de commande n'est inventé.

## Sommaire

1. [Lancer le projet](#1-lancer-le-projet)
2. [Stack et architecture](#2-stack-et-architecture)
3. [Direction artistique](#3-direction-artistique)
4. [Où modifier quoi](#4-où-modifier-quoi)
5. [Ajouter les produits de la carte](#5-ajouter-les-produits-de-la-carte)
6. [Ajouter les photos](#6-ajouter-les-photos)
7. [Hero animé : fonctionnement et repli](#7-hero-animé--fonctionnement-et-repli)
8. [Qualité : vérifications](#8-qualité--vérifications)
9. [Mise en ligne](#9-mise-en-ligne)
10. [À fournir par l'établissement (TODO V2)](#10-à-fournir-par-létablissement-todo-v2)

---

## 1. Lancer le projet

Prérequis : Node.js ≥ 20 et npm.

```bash
cd snack-gorbuz
npm install
npm run dev        # http://localhost:4321
```

Scripts :

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement avec rechargement |
| `npm run build` | build statique dans `dist/` (+ sitemap) |
| `npm run preview` | sert `dist/` en local pour vérification |
| `npm run check` | vérification des types (Astro + TypeScript) |
| `npm run lint` | ESLint (TS + Astro) |
| `npm run verify` | check + lint + build, en une commande |
| `node tools/capture.mjs` | captures d'écran de contrôle (voir §8) |
| `node tools/og/generate.mjs` | régénère l'image Open Graph et l'icône iOS |

## 2. Stack et architecture

**Astro 5 + TypeScript**, sans framework UI côté client.

Pourquoi Astro plutôt que Next.js ou Vite + React :
- un site vitrine de restaurant doit être **indexable** (menu en HTML, pas en JS) et rapide
  sur mobile : Astro génère des pages HTML statiques et n'envoie **aucun JavaScript par défaut** ;
- les composants `.astro` offrent la même modularité que React (props typées, slots) sans
  embarquer un runtime ;
- les données (`src/data/*.ts`) sont typées et importées au build : erreur de type = build en échec ;
- le seul JS livré est celui des interactions (menu mobile, scène du hero, statut d'ouverture),
  soit ≈ 8 Ko au total.

Polices auto-hébergées (`@fontsource-variable`) : aucune requête vers Google Fonts, pas d'enjeu RGPD.

```
snack-gorbuz/
├── astro.config.mjs          # URL du site (SITE_URL), sitemap
├── public/                   # fichiers servis tels quels
│   ├── favicon.svg, apple-touch-icon.png, og-image.jpg, robots.txt
│   └── images/               # (à créer) photos officielles : menu/, galerie/
├── src/
│   ├── data/
│   │   ├── restaurant.ts     # ★ CONFIG UNIQUE : nom, adresse, téléphone, horaires, CTA, réseaux, SEO
│   │   ├── menu.ts           # ★ schéma + catégories + produits (vide en V1)
│   │   ├── content.ts        # ★ tous les textes provisoires des pages
│   │   └── gallery.ts        # ★ emplacements photos
│   ├── lib/
│   │   ├── hours.ts          # formatage horaires, liens Maps, tel:
│   │   ├── seo.ts            # données structurées schema.org Restaurant
│   │   └── icons.ts          # noms d'icônes
│   ├── styles/
│   │   ├── tokens.css        # ★ design tokens (couleurs, typo, espacements)
│   │   └── global.css        # reset, typographie, utilitaires, reveal, reduced-motion
│   ├── layouts/Base.astro    # <head> SEO/OG/JSON-LD, header, footer
│   ├── components/
│   │   ├── Header.astro      # navigation sticky + menu mobile accessible
│   │   ├── Footer.astro
│   │   ├── Logo.astro        # logo typographique temporaire (à remplacer)
│   │   ├── Button.astro      # 4 variantes : primary, inverse, outline, link
│   │   ├── Icon.astro        # jeu d'icônes SVG au trait fin
│   │   ├── Hours.astro       # tableau horaires + statut ouvert/fermé
│   │   ├── HeroScene.astro   # scène animée du hero + repli CSS
│   │   ├── Placeholder.astro # visuel temporaire → <img> dès qu'une photo existe
│   │   ├── MenuItem.astro    # fiche produit
│   │   └── EmptyState.astro  # état vide d'une catégorie
│   ├── scripts/              # JS client : header, reveal, hours-status, hero-scene
│   └── pages/                # index, menu, univers, galerie, contact, mentions-legales,
│                             # confidentialite, 404
└── tools/                    # outils de contrôle (captures Playwright, génération OG)
```

## 3. Direction artistique

Ligne directrice : **« comptoir éditorial chaleureux »**. La nourriture sera le héros
(photos à venir), l'ambiance crée l'émotion, l'humain et les informations pratiques créent la confiance.

Fusion des trois références du brief :
- **LÜKS** → hiérarchie commerciale forte (CTA carte omniprésent, catégories numérotées,
  badges `Nouveau` / `Signature` prévus dans le schéma), grands visuels, typographie XXL ;
- **Qissa** → alternance de sections claires et profondes, rythme éditorial, serif à caractère,
  galerie en grille asymétrique, pages secondaires traitées comme de vraies pages ;
- **Rumbeke Platse** → adresse, horaires et téléphone visibles dès le hero, bandeau de repères
  factuels, statut « ouvert / fermé », numéro cliquable, menu mobile avec horaires et bouton Appeler.

### Palette (`src/styles/tokens.css`)

| Token | Valeur | Usage |
|---|---|---|
| `--c-cream` | `#f3ecdf` | fond principal (ivoire minéral) |
| `--c-cream-2` | `#e9dfcd` | surfaces secondaires |
| `--c-paper` | `#faf6ee` | cartes |
| `--c-espresso` | `#2a1f19` | hero, sections profondes |
| `--c-ink` | `#1d1512` | texte, footer |
| `--c-accent` | `#8a2f2a` | **accent unique** : bordeaux épicé (CTA, liens, prix) |
| `--c-copper` | `#b8874f` | micro-accent sur fond sombre : filets, eyebrows |
| `--c-copper-ink` | `#7a5527` | cuivre foncé pour les numéros sur fond clair (contraste AA) |
| `--c-sage` | `#8e9b74` | touche de fraîcheur (statut ouvert, un visuel) |

Choix de l'accent : le brief proposait **olive profond ou bordeaux**. Le bordeaux a été retenu
parce qu'il évoque l'appétit et la chaleur d'un snack, tout en restant loin du rouge/jaune
fast-food ; l'olive aurait tiré l'identité vers un registre « salade / healthy » éloigné du produit.
La sauge n'est utilisée qu'en touche (jamais en concurrence avec le bordeaux).

### Typographie

- **Fraunces** (variable, axe optique `opsz`, romain + vraie italique) pour les titres : serif
  contemporaine, gourmande, avec de la personnalité ; italique pour les mots d'accroche.
- **Manrope** (variable) pour l'interface, les prix, les horaires et le texte courant.
- Échelle fluide `clamp()` (ratio ≈ 1,25), prix et horaires en chiffres tabulaires.

### Mise en page

Grille 12 colonnes, conteneur 1280 px, espacements base 4 px. Sections asymétriques (5/7, 6/6
décalé), bandeau à colonnes, listes éditoriales numérotées, grilles de galerie à tailles variées.
Aucune grille de cartes identiques, aucun dégradé décoratif, aucun emoji.

## 4. Où modifier quoi

| Besoin | Fichier | Détail |
|---|---|---|
| Horaires | `src/data/restaurant.ts` → `hours` | `null` = fermé. Format `"HH:MM"`. Propagé partout (hero, bandeau, contact, footer, menu mobile, JSON-LD). |
| Adresse, téléphone | `src/data/restaurant.ts` → `address`, `phone` | `phone.e164` alimente le lien `tel:`. |
| Activer « Commander » / « Livraison » / « Réserver » | `src/data/restaurant.ts` → `cta` | Mettre `enabled: true` **et** une `url`. Tant que l'un des deux manque, le bouton n'est pas rendu. |
| Réseaux sociaux | `src/data/restaurant.ts` → `social` | Affichés dans le footer et en `sameAs` dès qu'une URL est renseignée. |
| Note / avis Google | `src/data/restaurant.ts` → `googleListing` | Valeurs lues sur la capture ; `url` de la fiche à renseigner si disponible. |
| Titres / descriptions SEO | `src/data/restaurant.ts` → `seo` + chaque page (`title`, `description`) | |
| Textes des pages | `src/data/content.ts` | Tous les textes provisoires sont là, commentés. |
| Catégories de la carte | `src/data/menu.ts` → `menuCategories` | Passer `status` à `'confirmed'` une fois validées (retire la mention « à confirmer »). |
| Produits | `src/data/menu.ts` → `menuItems` | Voir §5. |
| Photos | `src/data/gallery.ts` + `public/images/` | Voir §6. |
| Logo | `src/components/Logo.astro` + `public/favicon.svg` | Remplacer le monogramme temporaire. |
| Couleurs, polices, espacements | `src/styles/tokens.css` | |
| URL publique du site | `astro.config.mjs` (`SITE_URL`) + `public/robots.txt` | |
| Mentions légales | `src/pages/mentions-legales.astro` | Champs « À compléter » : dénomination, BCE, TVA, hébergeur. |

⚠ **Deux écarts** entre la capture Google et les textes de cadrage, tranchés en faveur de la capture
(à confirmer par l'établissement, modifiables en une ligne dans `restaurant.ts`) :
- rue : `Leuvensesteenweg` (capture) vs « Leuvensteenweg » (textes) ;
- samedi : `12:00–22:30` (capture) vs « 12:00–22:00 » (textes).

## 5. Ajouter les produits de la carte

Dans `src/data/menu.ts`, compléter `menuItems` :

```ts
export const menuItems: MenuItem[] = [
  {
    id: 'exemple',                 // unique, sans espace (sert d'ancre)
    name: 'Nom du produit',
    category: 'frites',            // id d'une catégorie de menuCategories
    description: 'Description courte fournie par l’établissement.',
    price: 4.5,                    // euros ; null si prix non communiqué
    image: '/images/menu/exemple.webp', // ou null → visuel temporaire
    tags: ['signature'],           // 'nouveau' | 'signature' | 'best-seller' | 'vegetarien' | 'vegan' | 'epice'
    allergens: ['gluten'],         // liste UE des 14 allergènes, uniquement si fournis
    available: true,
    sortOrder: 1,
  },
];
```

Les pages Menu et Accueil se mettent à jour automatiquement : fiches produit, prix formatés
(`4,50 €`), tags, allergènes, mention « Indisponible » si `available: false`. L'état vide
disparaît dès qu'une catégorie contient un produit. Aucun composant à modifier.

Images produit : WebP ou AVIF, ≈ 1200 px de large, dans `public/images/menu/`.

## 6. Ajouter les photos

Dans `src/data/gallery.ts`, pour chaque emplacement, renseigner `src`, `width`, `height`
(dimensions réelles, pour éviter les décalages de mise en page) et un `alt` descriptif :

```ts
{ id: 'facade', subject: 'La façade', src: '/images/galerie/facade.webp', width: 1600, height: 2000, alt: 'Façade de Snack Gorbuz…', ratio: '4 / 5', tone: 'espresso', featured: true, caption: null }
```

Le composant `Placeholder` bascule alors automatiquement du visuel temporaire vers `<img>`
(lazy loading, `decoding="async"`). `featured: true` = affiché aussi sur l'accueil.
Les visuels de la page Univers sont dans `src/pages/univers.astro` (même composant).

Recommandations : WebP/AVIF, 1600–2000 px de large, exports spécifiques pour les formats
portrait utilisés sur mobile, cohérence de lumière et de traitement entre les photos.

## 7. Hero animé : fonctionnement et repli

La scène (`src/scripts/hero-scene.ts`, ≈ 4 Ko) est une **composition procédurale en pseudo-3D**
dessinée en Canvas 2D, sans bibliothèque : une pile de disques stylisés aux couleurs de la marque,
éclairée par le haut-gauche. C'est un **objet de marque abstrait**, volontairement pas la
représentation d'un plat (aucun produit n'a été fourni, rien n'est simulé).

- Souris : rotation et inclinaison douces de la pile.
- Défilement : les couches s'écartent (vue éclatée) et la pile pivote.
- Repos : respiration très lente.
- Mobile : DPR plafonné à 1,5 ; pas de parallaxe pointeur ; animation uniquement si visible.
- `prefers-reduced-motion` : une seule image statique, aucune boucle.
- Sans JavaScript / canvas indisponible : repli CSS (`HeroScene.astro`, `.scene__fallback`).

Pourquoi pas Three.js : le gain visuel ne justifiait pas 150 Ko de dépendance pour une scène
abstraite ; l'approche Canvas 2D donne un rendu distinctif, contrôlé, et un hero à moins de 10 Ko
de JS. Si un vrai modèle 3D du produit signature est produit plus tard, `HeroScene.astro` est le
seul composant à remplacer (chargement différé recommandé).

## 8. Qualité : vérifications

```bash
npm run verify                  # types + lint + build
npm run preview                 # puis, dans un autre terminal :
node tools/capture.mjs          # captures 375 / 768 / 1440 px (+ EXTRA_WIDTHS=320,1920)
```

`tools/capture.mjs` (Playwright, Chromium) capture chaque page en pleine page et vérifie :
absence de défilement horizontal, polices web chargées, un seul `<h1>`, aucune erreur console.
Le contrôle qualité de réception a en plus été passé avec axe-core (WCAG 2.1 AA + bonnes pratiques)
sur les 8 pages à 375 et 1440 px : 0 violation.
Sorties dans `tools/output/` (ignoré par git). Si Playwright n'est pas installé :
`npm i -D playwright && npx playwright install chromium`.

Accessibilité intégrée : lien d'évitement, focus visible partout, `aria-expanded` et fermeture
à Échap sur le menu mobile, cibles tactiles ≥ 44 px, contrastes AA (texte secondaire 6,6:1 sur crème,
7,5:1 sur espresso), `aria-current="page"`, icônes décoratives masquées, `prefers-reduced-motion`.

## 9. Mise en ligne

Le site est 100 % statique : `npm run build` produit `dist/`, à déployer sur n'importe quel
hébergeur statique (Netlify, Vercel, Cloudflare Pages, OVH, etc.).

Avant la mise en ligne :
1. définir l'URL finale : `SITE_URL=https://www.domaine.be npm run build` (ou modifier la
   valeur de repli dans `astro.config.mjs`) et mettre à jour `public/robots.txt` ;
2. régénérer l'image Open Graph si le nom ou les horaires changent : `node tools/og/generate.mjs` ;
3. compléter `mentions-legales.astro` et faire valider `confidentialite.astro`.

## 10. À fournir par l'établissement (TODO V2)

Contenus :
- [ ] la **carte** : catégories définitives, produits, descriptions, prix, disponibilités ;
- [ ] les **allergènes** par produit ;
- [ ] **photos officielles** : façade, comptoir, préparation, produits, équipe, espace, service
      (chaque emplacement est prêt dans `gallery.ts`) ;
- [ ] **logo** officiel (SVG) et éventuelle charte existante ;
- [ ] texte de présentation réel (histoire, équipe) pour la page Univers — rien n'a été inventé ;
- [ ] confirmation de l'orthographe de la rue et de l'horaire du samedi (voir §4) ;
- [ ] informations d'accès : stationnement, transports en commun ;
- [ ] e-mail de contact (nécessaire si un formulaire est souhaité).

Fonctionnalités à confirmer :
- [ ] commande en ligne / livraison : URL de la plateforme utilisée (Deliveroo, Uber Eats, Takeaway…)
      → active les boutons via `restaurant.ts` → `cta` ;
- [ ] URL de la fiche Google Business (lien direct plutôt que la recherche construite) ;
- [ ] profils sociaux (Instagram, Facebook, TikTok) ;
- [ ] coordonnées GPS si une carte intégrée est souhaitée ;
- [ ] mentions légales : dénomination, numéro BCE, TVA, hébergeur, responsable de publication ;
- [ ] version néerlandaise / anglaise si la clientèle le justifie (structure prête : textes centralisés).
