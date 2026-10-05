# Has Pide Kebap · site vitrine

Site du restaurant Has Pide Kebap, Chaussée de Haecht 115, 1030 Schaerbeek : pages statiques (HTML, CSS, JavaScript sans dépendance) et une fonction serveur pour les réservations, hébergés sur Cloudflare Pages.

## Pages

| Fichier | Contenu |
| --- | --- |
| `public/index.html` | Accueil : hero, la maison, plats incontournables, glossaire du pide, carte en bref, avis et services, réservation, horaires et plan |
| `public/carte.html` | Carte complète avec navigation par catégorie (catégorie active suivie au défilement) |
| `public/reserver.html` | Réservation de table : couverts, date, créneau, coordonnées |
| `public/mentions-legales.html` | Mentions légales et confidentialité (champs `[...]` à compléter) |

## Structure

```
public/                    ce qui est publié (et rien d'autre)
  assets/css/main.css      tokens (couleurs, typo, espacements) en tête de fichier
  assets/js/main.js        horaires, statut ouvert/fermé, menu mobile, navigation de la carte, réservation
  assets/fonts/            Gloock + Schibsted Grotesk en woff2 (latin + latin-ext pour ı ş ğ İ)
  assets/img/              photos (voir ci-dessous)
functions/api/reservation.js   fonction serveur POST /api/reservation
tests/reservation.test.mjs     tests de la fonction
scripts/build-preview.mjs      aperçus autonomes
apercu/                    aperçus autonomes et captures (non publiés)
wrangler.toml              configuration Cloudflare Pages
```

L'en-tête, le pied de page et la barre mobile sont identiques sur les quatre pages : une modification doit être reportée sur chacune.

## Commandes

```bash
npm test             # tests de la fonction de réservation (Node 18+, sans réseau)
npm run dev          # site + fonction en local sur http://localhost:8788 (lit .dev.vars)
npm run preview      # aperçus autonomes dans apercu/ (formulaire en mode démonstration)
npm run deploy       # publication sur Cloudflare Pages
```

Pour `npm run dev`, copier `.dev.vars.example` en `.dev.vars` et le remplir. Ce fichier est ignoré par git.

## Réservation en ligne

### Parcours d'une demande

1. Le client remplit `reserver.html` : nombre de personnes, date, créneau, nom, téléphone, e-mail facultatif, demande particulière, consentement.
2. Le navigateur envoie la demande à `/api/reservation` (`functions/api/reservation.js`).
3. La fonction vérifie tout, puis envoie via Brevo :
   - au restaurant, un e-mail « Réservation · Samedi 12 octobre · 20:00 · 4 personnes » avec toutes les informations ;
   - au client, s'il a donné son e-mail, un accusé de réception qui précise que la demande n'est pas encore confirmée.
4. Le restaurant confirme au client, de préférence par téléphone.

### Adresse du propriétaire : jamais visible

- Elle est stockée dans la variable secrète `RESTAURANT_EMAIL` de Cloudflare, jamais dans le code du site.
- L'accusé de réception part de l'adresse d'envoi (`SENDER_EMAIL`, par exemple `reservations@domaine`) et ne contient pas l'adresse du propriétaire.
- L'e-mail reçu par le restaurant n'a pas de « répondre à » vers le client : une réponse depuis la boîte du propriétaire dévoilerait son adresse. Pour écrire au client, utiliser l'adresse générique du restaurant.

### Filtrage des demandes inutiles

Tout est vérifié côté serveur, même si quelqu'un contourne le formulaire :

- seuls des choix structurés passent : 1 à 12 personnes, date dans les 60 jours, créneau réel selon les horaires, téléphone valide ;
- demande particulière limitée à 500 caractères, liens refusés ;
- champ piège invisible et délai minimal de 3 s : les robots sont ignorés sans le savoir ;
- requêtes venant d'un autre site refusées ;
- facultatif : 5 demandes maximum par heure et par adresse IP (espace KV `RATE_LIMIT`, voir `wrangler.toml`) ;
- facultatif : vérification anti-robot Cloudflare Turnstile (`TURNSTILE_SECRET` côté serveur, `RESERVATION.turnstileSiteKey` dans `main.js`). À activer seulement si du spam passe malgré tout.

L'accusé de réception ne reprend aucun texte libre saisi par le visiteur : impossible de s'en servir pour envoyer un message à un tiers.

Les règles de créneaux existent côté site (`HOURS` et `RESERVATION` dans `public/assets/js/main.js`) et côté serveur (`HOURS` et `RULES` dans `functions/api/reservation.js`) : les garder alignées.

### Mise en service

1. **Brevo** (gratuit jusqu'à 300 e-mails par jour) : créer un compte, authentifier le domaine du restaurant (enregistrements DNS SPF et DKIM), puis créer une clé API.
2. **Cloudflare Pages** : créer le projet depuis le dépôt git (répertoire de sortie `public`) ou avec `npm run deploy`.
3. Dans *Settings › Variables and secrets* du projet, renseigner :

   | Variable | Type | Exemple |
   | --- | --- | --- |
   | `BREVO_API_KEY` | secret | `xkeysib-…` |
   | `RESTAURANT_EMAIL` | secret | adresse du propriétaire |
   | `SENDER_EMAIL` | texte | `reservations@domaine-du-restaurant.be` |
   | `SENDER_NAME` | texte, facultatif | `Has Pide Kebap` |
   | `TURNSTILE_SECRET` | secret, facultatif | clé secrète Turnstile |

4. Faire une réservation test et vérifier la réception des deux e-mails, y compris dans les indésirables.

Tant qu'une variable manque, la fonction répond une erreur et la page invite le client à appeler : aucune demande n'est perdue en silence.

## Direction artistique

- **Couleurs** : noir encre `#0B0C0F` et bleu cobalt `#1D3F95` (couleurs du client), sur fond porcelaine `#F6F6F4`. Le bleu reste un accent : filets, motif d'İznik, états actifs. Caler `--cobalt` sur le bleu exact du logo dans `public/assets/css/main.css`.
- **Typographie** : Gloock pour les titres, Schibsted Grotesk pour le texte.
- **Signature** : le point du İ turc en cobalt dans le logotype, les mots turcs de la carte avec leur prononciation, une rosace et un carreau étoile-et-croix inspirés des céramiques d'İznik.

## Photos à fournir

Les emplacements photo affichent un motif tant que le fichier manque. Il suffit de déposer les images dans `public/assets/img/` avec ces noms exacts. JPEG qualité ~80, moins de 300 Ko chacun.

| Fichier | Format | Sujet |
| --- | --- | --- |
| `hero.jpg` | 4:5, 1600 × 2000 | Pide karışık coupé, à la sortie du four |
| `plat-karisik-pide.jpg` | 4:5, 1200 × 1500 | Karışık pide |
| `plat-adana-kebap.jpg` | 4:5, 1200 × 1500 | Adana kebap |
| `plat-lahmacun.jpg` | 4:5, 1200 × 1500 | Lahmacun |
| `plat-kunefe.jpg` | 4:5, 1200 × 1500 | Künefe |
| `og.jpg` | 1200 × 630 | Image de partage (réseaux sociaux) |

Conseil de prise de vue : lumière naturelle ou flash direct, fond sombre, plans serrés, même traitement couleur pour toute la série.

## À valider avec le restaurant avant la mise en ligne

- [ ] Logo : le logotype actuel est une proposition typographique
- [ ] Plats, descriptions et prix (`index.html`, `carte.html`) : valeurs indicatives
- [ ] Horaires : `HOURS` dans `public/assets/js/main.js` et `functions/api/reservation.js`, tableau de `index.html`. Seule la fermeture à 23:00 est connue
- [ ] Livraison : à confirmer avec le restaurant. Si oui, la remettre dans le texte du hero, la meta description et la liste des services (`index.html`), ainsi que dans l’introduction de `carte.html`
- [ ] Réservation : comptes Brevo et Cloudflare, domaine authentifié, variables renseignées, réservation test
- [ ] Réservation : nombre maximal de couverts (12), délai minimum, dernier créneau
- [ ] Adresse de contact générique (ex. `contact@domaine`) pour les mentions légales, obligatoire en Belgique, et pour écrire aux clients
- [ ] Données personnelles : durée de conservation (`mentions-legales.html#donnees`)
- [ ] Liens Instagram / Facebook (`data-pending` dans le pied de page)
- [ ] Mentions légales : dénomination, BCE, TVA, agence
- [ ] Textes de présentation (« La maison »)
- [ ] Domaine définitif : ajouter `<link rel="canonical">`, `og:url`, un `sitemap.xml` et des URL absolues pour `og:image`

## Choix techniques

- Pas de framework ni d'étape de build pour les pages ; une seule fonction serveur, sans dépendance.
- Polices auto-hébergées : aucun appel à Google Fonts, aucun cookie, aucun traceur. Seul le formulaire de réservation collecte des données, avec consentement et page de confidentialité.
- Données structurées `schema.org/Restaurant` sur l'accueil.
- Accessibilité : lien d'évitement, navigation clavier, focus visible, `aria-current`, `lang="tr"` sur les mots turcs, animations désactivées si `prefers-reduced-motion`.
- Statut « Ouvert / Fermé » et créneaux calculés à l'heure de Bruxelles, quel que soit le fuseau du visiteur.
- Les liens `tel:` et Google Maps fonctionnent directement sur mobile ; une barre d'actions fixe (Appeler, Itinéraire, Réserver) s'affiche sous 1000 px.
- Formulaire de réservation accessible : vrais boutons radio (navigation clavier), messages d'erreur reliés aux champs, récapitulatif annoncé aux lecteurs d'écran.
- Cloudflare Pages sert `/reserver` pour `/reserver.html` (redirection automatique) : les liens internes en `.html` restent valides et fonctionnent aussi dans les aperçus hors ligne.

## Logiciels de réservation (pour mémoire)

Si le restaurant veut un jour des disponibilités en temps réel, un plan de salle et des rappels SMS, il lui faudra un logiciel sur abonnement : environ 40 à 250 € HT par mois selon l'outil et la formule (Resengo, Guestplan, Zenchef…), ou une commission par couvert chez TheFork. Prix à confirmer sur devis. Leur module remplacerait alors le formulaire, sans toucher au reste du site.

## Prochaines étapes possibles

- Version néerlandaise (`/nl/`) avec balises `hreflang`
- Fiche Google Business Profile reliée au site
