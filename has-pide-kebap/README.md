# Has Pide Kebap · site vitrine

Site statique (HTML, CSS, JavaScript sans dépendance) pour le restaurant Has Pide Kebap, Chaussée de Haecht 115, 1030 Schaerbeek.

## Pages

| Fichier | Contenu |
| --- | --- |
| `index.html` | Accueil : hero, la maison, plats incontournables, glossaire du pide, carte en bref, avis et services, horaires et plan |
| `carte.html` | Carte complète avec navigation par catégorie (catégorie active suivie au défilement) |
| `mentions-legales.html` | Mentions légales et confidentialité (champs `[...]` à compléter) |

## Lancer en local

```bash
npm run dev          # serveur statique sur http://localhost:4321
# ou, sans Node :
python3 -m http.server 4321
```

`npm run preview` génère dans `apercu/` des versions autonomes de chaque page : CSS, JS, polices et photos y sont intégrés. Ce sont des fichiers uniques à envoyer au client ou à ouvrir sans serveur.

## Structure

```
assets/
  css/main.css     tokens (couleurs, typo, espacements) en tête de fichier
  js/main.js       horaires, statut ouvert/fermé, menu mobile, fenêtre Commander, navigation de la carte
  fonts/           Gloock + Schibsted Grotesk en woff2 (latin + latin-ext pour ı ş ğ İ)
  img/             photos (voir ci-dessous)
scripts/build-preview.mjs
favicon.svg, site.webmanifest, robots.txt
```

L'en-tête, le pied de page, la barre mobile et la fenêtre « Commander » sont identiques sur les trois pages : une modification doit être reportée sur chacune.

## Direction artistique

- **Couleurs** : noir encre `#0B0C0F` et bleu cobalt `#1D3F95` (couleurs du client), sur fond porcelaine `#F6F6F4`. Le bleu reste un accent : filets, motif d'İznik, états actifs. Caler `--cobalt` sur le bleu exact du logo dans `assets/css/main.css`.
- **Typographie** : Gloock pour les titres, Schibsted Grotesk pour le texte.
- **Signature** : le point du İ turc en cobalt dans le logotype, les mots turcs de la carte avec leur prononciation, une rosace et un carreau étoile-et-croix inspirés des céramiques d'İznik.

## Photos à fournir

Les emplacements photo affichent un motif tant que le fichier manque. Il suffit de déposer les images dans `assets/img/` avec ces noms exacts. JPEG qualité ~80, moins de 300 Ko chacun.

| Fichier | Format | Sujet |
| --- | --- | --- |
| `hero.jpg` | 4:5, 1600 × 2000 | Pide karışık coupé, à la sortie du four |
| `maison-four.jpg` | 4:5, 1200 × 1500 | Le four, l'usta au travail |
| `maison-salle.jpg` | 3:2, 1500 × 1000 | La salle ou la terrasse |
| `plat-karisik-pide.jpg` | 4:5, 1200 × 1500 | Karışık pide |
| `plat-adana-kebap.jpg` | 4:5, 1200 × 1500 | Adana kebap |
| `plat-lahmacun.jpg` | 4:5, 1200 × 1500 | Lahmacun |
| `plat-kunefe.jpg` | 4:5, 1200 × 1500 | Künefe |
| `og.jpg` | 1200 × 630 | Image de partage (réseaux sociaux) |

Conseil de prise de vue : lumière naturelle ou flash direct, fond sombre, plans serrés, même traitement couleur pour toute la série.

## À valider avec le restaurant avant la mise en ligne

- [ ] Logo : le logotype actuel est une proposition typographique
- [ ] Plats, descriptions et prix (`index.html`, `carte.html`) : valeurs indicatives
- [ ] Horaires : objet `HOURS` dans `assets/js/main.js` et tableau de `index.html`. Seule la fermeture à 23:00 est connue
- [ ] Plateformes de livraison réellement utilisées (fenêtre « Commander »)
- [ ] Liens Instagram / Facebook (`data-pending` dans le pied de page)
- [ ] Mentions légales : dénomination, BCE, TVA, hébergeur, agence
- [ ] Textes de présentation (« La maison »)
- [ ] Domaine définitif : ajouter `<link rel="canonical">`, `og:url`, un `sitemap.xml` et des URL absolues pour `og:image`

## Choix techniques

- Aucune dépendance ni étape de build : le site se déploie tel quel (Netlify, Cloudflare Pages, OVH, etc.).
- Polices auto-hébergées : aucun appel à Google Fonts, aucun cookie, aucun traceur.
- Données structurées `schema.org/Restaurant` sur l'accueil.
- Accessibilité : lien d'évitement, navigation clavier, focus visible, `aria-current`, `lang="tr"` sur les mots turcs, animations désactivées si `prefers-reduced-motion`.
- Statut « Ouvert / Fermé » calculé à l'heure de Bruxelles, quel que soit le fuseau du visiteur.
- Les liens `tel:` et Google Maps fonctionnent directement sur mobile ; une barre d'actions fixe (Appeler, Itinéraire, Commander) s'affiche sous 1000 px.

## Prochaines étapes possibles

- Version néerlandaise (`/nl/`) avec balises `hreflang`
- Fiche Google Business Profile reliée au site
