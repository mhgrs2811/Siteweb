# Has Pide Kebap — site vitrine

Site une page du restaurant **Has Pide Kebap (Halal)**, Chaussée de Haecht 115, 1030 Schaerbeek.
HTML/CSS/JS statique, sans framework ni étape de build : le dossier se met en ligne tel quel.

## Sections (dans l'ordre)

| # | Section | Ancre |
|---|---------|-------|
| 1 | Accueil (hero, bouton « Réserver une table ») | `#accueil` |
| 2 | Avis clients Google | `#avis` |
| 3 | La carte (8 catégories en onglets) | `#carte` |
| 4 | La maison *(proposition)* | `#maison` |
| 5 | À emporter & livraison *(proposition)* | `#emporter` |
| 6 | Réservation (formulaire) *(proposition)* | `#reserver` |
| 7 | Bon à savoir / FAQ *(proposition)* | `#questions` |
| 8 | Horaires & accès *(proposition)* | `#infos` |

Les sections 4 à 8 sont une proposition, à valider avec le restaurant.

## Direction artistique

« Lokanta de nuit » : la façade noire de la chaussée de Haecht, éclairée par le turquoise
de l'enseigne, s'ouvre sur des pans de porcelaine à l'encre cobalt (la carte et la réservation),
comme les assiettes et carreaux d'İznik.

- **Couleurs** : noir façade, turquoise de faïence, bleu cobalt, porcelaine, encre cobalt
  (jetons en haut de `assets/css/style.css`).
- **Typographie** : Gloock pour les titres et les noms de plats, Sofia Sans pour le texte,
  Sofia Sans Extra Condensed pour les prix et étiquettes, à la manière des enseignes de lokanta.
- **Signature** : le motif étoile-et-croix des carreaux d'İznik, dessiné en canvas
  (`main.js`, fonction `dessinerCarreaux`) sur le mur de l'accueil, le plat signature,
  le plan et la frise du pied de page. La photo de la devanture est cadrée dans un arc brisé ottoman.
- **Détails propres au lieu** : prononciation des noms turcs sous chaque plat, pancarte
  de porte « AÇIK / KAPALI » calculée à l'heure de Bruxelles, adresse bilingue
  (Haachtsesteenweg), « Afiyet olsun » en pied de page.

## Fichiers

```
index.html              page principale
mentions-legales.html   mentions légales + politique de confidentialité (RGPD)
merci.html              page de confirmation (formulaire envoyé sans JavaScript)
404.html                page d'erreur
assets/css/style.css    styles (jetons de couleur en haut du fichier)
assets/js/main.js       onglets, statut ouvert/fermé, formulaire, carte, menu mobile
assets/fonts/           Gloock + Sofia Sans, auto-hébergées (licence OFL)
assets/img/             devanture, favicon, icônes, image de partage (og-image.jpg)
netlify.toml            en-têtes de sécurité et de cache pour Netlify
robots.txt, sitemap.xml, site.webmanifest
```

## Mise en ligne

### Option recommandée : Netlify (gratuit)

1. Aller sur <https://app.netlify.com/drop> et glisser-déposer le dossier `has-pide-kebap`.
2. Le formulaire de réservation est détecté automatiquement (Netlify Forms).
   Activer la notification par e-mail : *Site configuration → Forms → Form notifications → Email*.
3. Brancher le nom de domaine : *Domain management → Add a domain*.

### Autre hébergeur (OVH, Combell, o2switch…)

Le formulaire a besoin d'un service d'envoi. Créer un formulaire gratuit sur Formspree,
puis ajouter son adresse sur la balise `<form>` de `index.html` :

```html
<form … data-endpoint="https://formspree.io/f/VOTRE_ID">
```

Si l'envoi échoue, le visiteur voit un message l'invitant à appeler le 02 203 83 00.

## ⚠️ À faire avant la mise en ligne

1. **Avis Google** — les 6 avis de la section 2 sont des **exemples de mise en page**.
   Les remplacer par de vrais avis copiés depuis la fiche Google (texte exact, prénom + initiale,
   note, mois). Publier des avis inventés est interdit en Belgique
   (Code de droit économique, art. VI.100, 23°).
2. **Mentions légales** — compléter les champs en orange dans `mentions-legales.html`
   (dénomination, forme juridique, n° BCE, TVA, e-mail, hébergeur).
3. **Carte et prix** — les plats, descriptions et prix sont une proposition crédible :
   à valider ou corriger avec le restaurant.
4. **Textes « La maison »** — affirmations à confirmer (pâte pétrie chaque jour, döner taillé
   à la commande, terrasse, etc.).
5. **Livraison** — préciser les plateformes (Uber Eats, Deliveroo, Takeaway…) pour ajouter
   des boutons directs.
6. **Nom de domaine** — remplacer `www.haspidekebap.be` (provisoire) partout :
   `index.html` (canonical, Open Graph, données structurées), `mentions-legales.html`,
   `robots.txt`, `sitemap.xml`.
7. **Photos** — ajouter de vraies photos des plats et de la salle (format paysage, 2000 px de large).

## Modifier les horaires

Les horaires apparaissent à quatre endroits — les garder synchronisés :

- `assets/js/main.js` → constante `HORAIRES` (pilote le badge « Ouvert maintenant ») ;
- `index.html` → tableau `.horaires`, pied de page, et bloc JSON-LD `openingHoursSpecification`.

## Choix techniques

- **Pas de cookie, pas de traceur.** Les polices sont hébergées localement ; la carte Google Maps
  ne se charge qu'après un clic du visiteur.
- **Accessibilité** : navigation au clavier (onglets de la carte au clavier, lien d'évitement),
  contrastes AA, `prefers-reduced-motion` respecté.
- **SEO local** : données structurées `Restaurant` (adresse, horaires, téléphone), balises
  Open Graph avec image de partage, sitemap.
- Le statut « Ouvert / Fermé » est calculé à l'heure de Bruxelles, quel que soit le fuseau du visiteur.
