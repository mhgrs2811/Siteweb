# Has Pide Kebap · site vitrine

Site statique (HTML, CSS, JavaScript sans dépendance) pour le restaurant Has Pide Kebap, Chaussée de Haecht 115, 1030 Schaerbeek.

## Pages

| Fichier | Contenu |
| --- | --- |
| `index.html` | Accueil : hero, la maison, plats incontournables, glossaire du pide, carte en bref, avis et services, horaires et plan |
| `carte.html` | Carte complète avec navigation par catégorie (catégorie active suivie au défilement) |
| `reserver.html` | Réservation de table : couverts, date, créneau, coordonnées |
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
  js/main.js       horaires, statut ouvert/fermé, menu mobile, navigation de la carte, réservation
  fonts/           Gloock + Schibsted Grotesk en woff2 (latin + latin-ext pour ı ş ğ İ)
  img/             photos (voir ci-dessous)
scripts/build-preview.mjs
favicon.svg, site.webmanifest, robots.txt
```

L'en-tête, le pied de page et la barre mobile sont identiques sur les quatre pages : une modification doit être reportée sur chacune.

## Direction artistique

- **Couleurs** : noir encre `#0B0C0F` et bleu cobalt `#1D3F95` (couleurs du client), sur fond porcelaine `#F6F6F4`. Le bleu reste un accent : filets, motif d'İznik, états actifs. Caler `--cobalt` sur le bleu exact du logo dans `assets/css/main.css`.
- **Typographie** : Gloock pour les titres, Schibsted Grotesk pour le texte.
- **Signature** : le point du İ turc en cobalt dans le logotype, les mots turcs de la carte avec leur prononciation, une rosace et un carreau étoile-et-croix inspirés des céramiques d'İznik.

## Photos à fournir

Les emplacements photo affichent un motif tant que le fichier manque. Il suffit de déposer les images dans `assets/img/` avec ces noms exacts. JPEG qualité ~80, moins de 300 Ko chacun.

| Fichier | Format | Sujet |
| --- | --- | --- |
| `hero.jpg` | 4:5, 1600 × 2000 | Pide karışık coupé, à la sortie du four |
| `plat-karisik-pide.jpg` | 4:5, 1200 × 1500 | Karışık pide |
| `plat-adana-kebap.jpg` | 4:5, 1200 × 1500 | Adana kebap |
| `plat-lahmacun.jpg` | 4:5, 1200 × 1500 | Lahmacun |
| `plat-kunefe.jpg` | 4:5, 1200 × 1500 | Künefe |
| `og.jpg` | 1200 × 630 | Image de partage (réseaux sociaux) |

Conseil de prise de vue : lumière naturelle ou flash direct, fond sombre, plans serrés, même traitement couleur pour toute la série.

## Réservation en ligne

`reserver.html` envoie une **demande** de réservation : le restaurant la reçoit par e-mail et confirme la table au client par téléphone ou par e-mail. Les créneaux proposés découlent de `HOURS` (toutes les 30 min, dernier créneau 1 h avant la fermeture, 1 h de délai minimum le jour même). Ces règles se règlent dans l'objet `RESERVATION` de `assets/js/main.js`.

**Mode démonstration** : tant que `RESERVATION.endpoint` est vide, rien n'est envoyé et la confirmation l'indique.

**Brancher l'envoi** (au choix, sans serveur à maintenir) :

- **Web3Forms** (gratuit jusqu'à 250 envois par mois) : créer une clé avec l'adresse e-mail du restaurant sur web3forms.com, puis
  ```js
  endpoint: "https://api.web3forms.com/submit",
  extra: { access_key: "VOTRE-CLÉ" },
  ```
- **Formspree** : créer un formulaire, puis `endpoint: "https://formspree.io/f/xxxxxxx"`.
- Toute autre API qui accepte un `POST` JSON fonctionne aussi.

E-mail reçu : objet `Réservation · Samedi 12 octobre · 20:00 · 4 personnes`, puis nom, téléphone, e-mail, nombre de personnes, date (`AAAA-MM-JJ`), heure et demande particulière. Un champ piège (`website`) filtre les robots.

**Disponibilités en temps réel** : si le restaurant veut des réservations confirmées automatiquement, avec gestion des tables et rappels SMS, il faut un logiciel de réservation sur abonnement : environ 40 à 250 € HT par mois selon l'outil et la formule (Resengo, Guestplan, Zenchef…), plus une commission par couvert chez TheFork. Prix à confirmer sur devis. Leur module remplace alors le formulaire, sans toucher au reste du site.

## À valider avec le restaurant avant la mise en ligne

- [ ] Logo : le logotype actuel est une proposition typographique
- [ ] Plats, descriptions et prix (`index.html`, `carte.html`) : valeurs indicatives
- [ ] Horaires : objet `HOURS` dans `assets/js/main.js` et tableau de `index.html`. Seule la fermeture à 23:00 est connue
- [ ] Livraison : à confirmer avec le restaurant. Si oui, la remettre dans le texte du hero, la meta description et la liste des services (`index.html`), ainsi que dans l’introduction de `carte.html`
- [ ] Réservation : relier `RESERVATION.endpoint` à l'adresse e-mail du restaurant, puis faire un envoi test
- [ ] Réservation : nombre maximal de couverts (12), délai minimum, dernier créneau
- [ ] Données personnelles : durée de conservation, service d'envoi, adresse e-mail de contact (`mentions-legales.html#donnees`)
- [ ] Liens Instagram / Facebook (`data-pending` dans le pied de page)
- [ ] Mentions légales : dénomination, BCE, TVA, hébergeur, agence
- [ ] Textes de présentation (« La maison »)
- [ ] Domaine définitif : ajouter `<link rel="canonical">`, `og:url`, un `sitemap.xml` et des URL absolues pour `og:image`

## Choix techniques

- Aucune dépendance ni étape de build : le site se déploie tel quel (Netlify, Cloudflare Pages, OVH, etc.).
- Polices auto-hébergées : aucun appel à Google Fonts, aucun cookie, aucun traceur. Seul le formulaire de réservation collecte des données, avec consentement et page de confidentialité.
- Données structurées `schema.org/Restaurant` sur l'accueil.
- Accessibilité : lien d'évitement, navigation clavier, focus visible, `aria-current`, `lang="tr"` sur les mots turcs, animations désactivées si `prefers-reduced-motion`.
- Statut « Ouvert / Fermé » calculé à l'heure de Bruxelles, quel que soit le fuseau du visiteur.
- Les liens `tel:` et Google Maps fonctionnent directement sur mobile ; une barre d'actions fixe (Appeler, Itinéraire, Réserver) s'affiche sous 1000 px.
- Formulaire de réservation accessible : vrais boutons radio (navigation clavier), messages d'erreur reliés aux champs, récapitulatif annoncé aux lecteurs d'écran.

## Prochaines étapes possibles

- Version néerlandaise (`/nl/`) avec balises `hreflang`
- Fiche Google Business Profile reliée au site
