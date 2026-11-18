# Atelier Nova — site de l’agence

Site vitrine de l’agence web **Atelier Nova** : Next.js 16 (App Router), TypeScript, Tailwind CSS 4, GSAP + ScrollTrigger, Motion, Three.js, Lucide.

Direction artistique : *galerie de nuit éditoriale*. Graphite profond, ivoire, gris minéral, chrome liquide (sculpture 3D), une seule couleur signature orange « Nova » (`#FF4F17`). Typographies : **Instrument Serif** (italiques expressives) + **Geist** (texte et capitales monumentales), auto-hébergées par `next/font`.

---

## Démarrer

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm start   # version de production
npm run lint
npm run typecheck
```

Node 20 ou plus récent.

## Pages

| URL | Contenu |
|---|---|
| `/` | Hero + sculpture 3D, manifeste, services, portfolio horizontal, méthode, pourquoi, offres, témoignages, FAQ, CTA |
| `/services` | 8 prestations, chacune avec sa propre composition (`layout` dans les données) |
| `/realisations` | Portfolio filtrable par catégorie |
| `/realisations/[slug]` | Étude de cas de chaque concept (5 pages statiques), démo de panier pour Orbe Café |
| `/a-propos` | Vision, répartition humain / IA, valeurs, philosophie, méthode |
| `/tarifs` | Formules, comparatif, options, maintenance, FAQ budget |
| `/contact` | Brief projet avec validation, anti-spam, consentement RGPD |
| `/mentions-legales`, `/confidentialite` | Pages juridiques (champs à compléter) |
| 404 | Page « Cette page a fondu » |

Plus : `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, image Open Graph (`public/og.jpg`), données structurées (ProfessionalService, FAQPage, BreadcrumbList, OfferCatalog, CreativeWork).

## Où modifier quoi

| Quoi | Fichier |
|---|---|
| Nom, e-mail, téléphone, ville, réseaux, disponibilité, mentions légales | `src/config/site.ts` |
| **Tarifs**, comparatif, options, maintenance | `src/config/pricing.ts` |
| Textes de l’accueil | `src/content/fr/home.ts` |
| Services | `src/content/fr/services.ts` |
| Portfolio (concepts, palettes, textes) | `src/content/fr/projects.ts` |
| Méthode et arguments « Pourquoi » | `src/content/fr/method.ts` |
| FAQ | `src/content/fr/faq.ts` |
| Témoignages | `src/content/fr/testimonials.ts` |
| À propos | `src/content/fr/about.ts` |
| Formulaire (libellés, options) | `src/content/fr/contact.ts` |
| Couleurs, typographie, espacements | `src/app/globals.css` (variables CSS) |

Le logo est typographique : il se construit à partir de `site.name` (premier mot en capitales, dernier mot en italique).

Les textes éditoriaux passent par `deepTypo()` qui ajoute automatiquement les espaces insécables françaises (avant `: ; ! ?`, dans les guillemets) et les apostrophes typographiques.

### Témoignages

Aucun témoignage n’est inventé. Les entrées de `testimonials.ts` sont marquées `placeholder: true` et s’affichent comme « Emplacement réservé ». Pour publier un vrai témoignage (avec l’accord écrit du client), remplacer le texte et passer `placeholder` à `false`.

### Portfolio

Les cinq projets sont des **concepts fictifs**, signalés comme tels partout (badge, page projet, mentions légales). Pour ajouter un vrai projet : ajouter une entrée dans `projects.ts` avec `fictional: false` et ses images dans `public/images/projects/<slug>/`.

## Formulaire de contact : configuration requise

L’envoi n’est **pas simulé**. La route `src/app/api/contact/route.ts` valide le brief côté serveur puis l’envoie par e-mail via [Resend](https://resend.com).

1. Créer un compte Resend et **vérifier le domaine** expéditeur (enregistrements DNS).
2. Créer une clé API.
3. Définir les variables d’environnement (voir `.env.example`) :

```bash
RESEND_API_KEY=re_xxx
CONTACT_FROM_EMAIL="Atelier Nova <brief@votre-domaine.be>"
CONTACT_TO_EMAIL=hello@votre-domaine.be
NEXT_PUBLIC_SITE_URL=https://www.votre-domaine.be
```

Sans clé, la route répond `503 not_configured` et le formulaire l’indique clairement en proposant d’envoyer le brief par e-mail (lien `mailto:` pré-rempli). Rien n’est perdu, rien n’est faussement confirmé.

Anti-spam intégré : champ piège invisible, délai minimal de 3 s, limitation à 5 envois / 10 min par IP. La limitation est en mémoire (par instance serveur) : derrière plusieurs instances, la remplacer par un stockage partagé (Upstash Redis, Vercel KV) ou ajouter Cloudflare Turnstile.

## Déploiement

### Vercel (recommandé)

1. Importer le dépôt dans Vercel, **Root Directory : `atelier-nova`**.
2. Ajouter les variables d’environnement ci-dessus (Production + Preview).
3. Brancher le domaine, puis vérifier `https://votre-domaine/sitemap.xml` et soumettre le sitemap dans Google Search Console.

### Autre hébergeur Node

```bash
npm ci && npm run build
npm start            # écoute sur le port 3000 (PORT=xxxx pour changer)
```

Toutes les pages sont statiques sauf `/api/contact`. Un export 100 % statique (`output: "export"`) est possible à condition de remplacer la route API par un service de formulaire externe.

## Visuels

- **Sculpture 3D** (`src/components/three/Sculpture.tsx`) : tore en Three.js, déformé dans le shader (bruit simplex), reflets d’un studio virtuel. Chargée à la demande, rendu suspendu hors écran, résolution adaptée et dégradation automatique si l’appareil peine. En mouvement réduit, sans WebGL ou sur appareil modeste : image fixe `public/images/sculpture/nova-ring.webp`.
  Régénérer les images fixes après une modification de la sculpture : `npm run dev` puis `node scripts/render-sculpture.mjs http://localhost:3000`.
- **Image Open Graph** : `node scripts/render-og.mjs`.
- **Portfolio** : images de synthèse 3D et captures des mini-sites des concepts, générées par `scripts/assets/` (voir `scripts/assets/README.md`). Ces scripts utilisent Playwright (`npx playwright install chromium` si besoin).

## Ajouter une langue (NL, EN)

L’architecture est prête :

1. Copier `src/content/fr/` vers `src/content/nl/` et traduire (le typage `satisfies Record<Locale, typeof fr>` signale tout oubli).
2. Ajouter `"nl"` dans `src/i18n/config.ts` et dans `dictionaries` de `src/content/index.ts`.
3. Déplacer les routes sous `src/app/[lang]/`, générer `generateStaticParams` à partir de `locales`, remplacer les imports `@/content` par `getContent(lang)`.
4. Ajouter `alternates.languages` (hreflang) dans `src/lib/seo.tsx` et un sélecteur de langue dans l’en-tête.

## Accessibilité et performance

- HTML sémantique, un seul `h1` par page, lien d’évitement, focus visible, menu mobile avec `aria-expanded`, fermeture à Échap et focus piégé.
- Toutes les animations respectent `prefers-reduced-motion` : le contenu reste visible sans JavaScript.
- Le défilement reste natif (pas de bibliothèque de « smooth scroll »).
- Curseur personnalisé uniquement sur pointeur fin ; désactivé au tactile.
- Polices auto-hébergées (aucune requête vers Google à la visite), images AVIF/WebP responsives.

## Limites connues

- Les visuels du portfolio sont des images de synthèse : pour de vrais projets clients, les remplacer par des photographies et captures réelles.
- Les mentions légales contiennent des champs « à compléter » (BCE, siège, responsable de publication).
- Le téléphone n’est pas affiché tant que `site.contact.phone` est vide.
