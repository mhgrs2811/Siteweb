# Audit du site actuel de La Vigne (la-vigne.be)

Audit réalisé le 10 novembre 2026 depuis un navigateur Chromium (Playwright) et Lighthouse 12,
sur ordinateur (1440 px) et téléphone (375 px), plus lecture du code source, des en-têtes HTTP,
du plan du site et de chaque page listée.

## 1. Résumé

Le site est un WordPress monté en 2022 avec un thème générique (Nuvo) et une douzaine
d'extensions. Il est en ligne, en HTTPS, avec les vraies photos et le vrai logo, mais il ne
raconte rien : une bannière, un module de réservation, un paragraphe, neuf photos, quatre
titres. Rien sur le feu de bois, le tomahawk, 1985, l'équipe. La carte est enfermée dans un
« flipbook » illisible par Google. Le site est déclaré en anglais, sans titre principal, sans
description, sans balises de partage. Le serveur tourne sur une version de PHP abandonnée
depuis quatre ans, sans aucun en-tête de sécurité, avec le nom d'utilisateur administrateur
exposé.

| Lighthouse mobile | Score |
|---|---|
| Performance | 73 / 100 |
| Accessibilité | 88 / 100 |
| Bonnes pratiques | 93 / 100 |
| Référencement | 85 / 100 |

| Mesure (mobile) | Valeur | Seuil « bon » de Google |
|---|---|---|
| Premier affichage (FCP) | 3,2 s | 1,8 s |
| Plus grand élément affiché (LCP) | 4,4 s | 2,5 s |
| Indice de vitesse | 6,3 s | 3,4 s |
| Interactivité | 6,5 s | 3,8 s |
| Réponse du serveur (TTFB) | 0,9 s | 0,8 s |
| Poids de la page d'accueil | 0,8 Mo (mobile), 1,3 Mo (ordinateur), 53 à 56 requêtes | |
| Poids de la page Galerie (mobile) | 2,5 Mo, 54 images | |

Les temps sont mesurés à travers un proxy, ils peuvent être légèrement pessimistes ; le
diagnostic relatif (CSS bloquant, pas de cache, serveur lent) ne change pas.

## 2. Ce que voit un client

### Page d'accueil
- **La bannière ne dit presque rien.** Une photo de la salle réduite à une bande de 430 px
  de haut sur ordinateur, avec « Brasserie méditerranéenne / Grillade au feu de bois » en
  blanc au centre. Pas de bouton, pas d'horaires, pas de produit phare. La photo d'origine
  est un portrait de 2048 × 2560 px (560 Ko) dont les trois quarts sont rognés.
- **Le module de réservation arrive avant toute présentation.** Juste sous la bannière, un
  titre « La Vigne – Réservation » puis le cadre Zenchef de 630 px de haut. Sur téléphone,
  on ne lit rien sur le restaurant avant deux écrans de défilement.
- **Un seul paragraphe de présentation**, avec des fautes : « Restaurant à Bruxelles, Rue
  Jourdan 6 à 1060 Saint-Gilles vous propose une carte variée faites de grillades… »
  (sujet sans article, « faite » au féminin singulier). Aucune mention de 1985, du
  tomahawk, de la broche au feu de bois comme signature, de l'équipe, de la terrasse.
- **Neuf photos en grille** sans légende ni hiérarchie, puis « Notre carte » et un bouton
  « NOTRE MENU » blanc sur or (contraste 2,5:1, sous le minimum de 4,5:1).
- **Adresse, Téléphone, Email, Horaires en quatre titres centrés** avec le texte en
  italique dessous : lisible mais sans itinéraire, sans jours d'ouverture explicites
  (« Ouvert de 12h00 – 23h00 », « Dimanche fermé », sans dire lundi à samedi).
- **Du texte en anglais sur un site francophone** : « Rue Jourdan 6, 1060 Brussels » dans
  la barre du haut et le pied de page, bandeau cookies entièrement en anglais (« We are
  using cookies to give you the best experience… »), « Reservation » sans accent dans le
  menu.
- **Pied de page daté** : « © La Vigne 2022, powered by Panglos ». Le lien vers l'agence
  est en http:// (non sécurisé) et n'est pas distinguable du texte (contraste 1,36:1).
- **Un « 0 » au-dessus du menu** (compteur de panier d'une boutique inexistante) qui ne
  mène nulle part.
- **Pas de lien Instagram, pas d'avis** sur l'accueil. L'icône Tripadvisor seule, en haut
  à gauche. Instagram apparaît uniquement sur la page Contact, sous forme d'adresse brute
  « https://www.instagram.com/lavignebxl/ ».
- **L'e-mail de contact est une adresse Outlook personnelle** (nc-invest@outlook.com),
  en clair dans le code (récoltée par les robots à spam), en or sur blanc (2,5:1).
- **Positionnement contradictoire** : la bannière dit « Brasserie méditerranéenne », la
  balise titre que Google affiche dit « Brasserie belge ».

### Page La carte
- La carte est un **flipbook (DearFlip) qui charge le PDF** : écran gris avec « DearFlip:
  Loading PDF Worker… » pendant le chargement, pages à tourner, texte minuscule sur
  téléphone, impossible à copier, à rechercher, et **invisible pour Google** (aucun nom de
  plat ni prix dans le HTML). Le PDF derrière est bien celui de 2026, les prix sont donc
  à jour, mais personne ne peut les lire sans l'avoir ouvert.
- Trois adresses pour la même carte : /la-carte/, /la-ca/ (le lien du bouton) et /menu/.

### Page Galerie
- 54 photos chargées sur une seule page, 2,5 Mo sur téléphone, sans texte alternatif pour
  51 d'entre elles, sans légende ni classement (salle, cuisine, plats mélangés). Les
  vignettes font 380 px de large : floues sur un écran haute densité.

### Page Réservation
- Uniquement le cadre Zenchef, sans un mot (pas de téléphone en alternative, pas
  d'horaires, pas de mention des groupes ou de la privatisation).

### Page Contact
- Horaires, privatisation, e-mail, Instagram en adresse brute, puis un titre
  « Réservation : » suivi d'un second module Zenchef, puis une carte Google en vue
  satellite (moins lisible qu'un plan). Pas d'adresse postale structurée, pas de bouton
  itinéraire, pas de formulaire alors que l'extension Contact Form 7 est chargée.

### Pages fantômes, toutes indexables (plan du site : 28 adresses)
- **/home/** : la page d'accueil en anglais (« Mediterranean Brasserie, Wood fired
  grill… »), sans sélecteur de langue nulle part.
- **/ontvangst/, /reservering/, /galerij/** : restes d'une version néerlandaise ;
  /reservering/ affiche un formulaire d'annulation de réservation TableBooker.
- **/dejeuner/** titré « Christmas 2024 » et **/lunch-2/** titré « New Year 2024 » :
  flipbooks de menus de fêtes de 2024 toujours en ligne.
- **/contact/, /contact-2/, /contact-3/** : trois pages Contact. **/menu/, /menu-3/,
  /la-carte/, /la-ca/** : quatre pages Carte. **/cafe-gallery/** : doublon de la galerie.
- **/bonjour-tout-le-monde/** : l'article d'exemple installé par défaut avec WordPress,
  jamais supprimé.
- **/evenements/** et ses sous-pages (emplacements, catégories, étiquettes,
  mes-reservations) : extension d'événements vide.
- **/bon-cadeau/** : un module de bons cadeaux TableBooker fonctionnel, mais absent du
  menu et du site : un produit qui existe et que personne ne voit.

## 3. Sur téléphone
- Bannière de 430 px avec le texte en très grand, sans bouton d'appel ni de réservation
  visible au premier écran.
- Bouton du menu de 40 × 32 px (minimum recommandé 44 × 44), attribut `aria-expanded`
  qui reste à « false » une fois le menu ouvert, `aria-controls` vide.
- 11 liens ou boutons sous 44 px.
- Pas de défilement horizontal (correct).

## 4. Performance
- **CSS bloquant le rendu** : 21 feuilles de style et 17 scripts sur l'accueil, 190 Ko de
  CSS en ligne dans le HTML (230 Ko pour la page). Lighthouse estime 1,5 s perdue avant le
  premier affichage et 197 Ko de CSS inutilisé.
- **Les feuilles de style de l'éditeur WordPress sont chargées sur le site public**
  (block-editor, editor, components, patterns, reusable-blocks, media-utils, preferences) :
  elles ne servent qu'à l'administration.
- **Aucun cache navigateur** sur 48 ressources (polices, scripts, images) : chaque visite
  retélécharge tout, y compris la police d'icônes Font Awesome de 118 Ko.
- Bootstrap 5 complet, Font Awesome, animate.css, wow.js, jQuery + jQuery Migrate pour une
  page qui n'en utilise presque rien.
- Une seule image avec `srcset` (la bannière), aucune en chargement différé natif.
- Polices Manrope et League Spartan sans `font-display: swap` (texte retardé au
  chargement).
- Temps de réponse du serveur de 0,9 s : pas de cache de page, hébergement mutualisé
  lent.

## 5. Référencement
- **Aucun `<h1>` sur aucune page.**
- **Aucune meta description** : Google compose lui-même l'extrait.
- **Balise titre bourrée** (116 caractères, tronquée dans les résultats) : « La Vigne –
  Restaurant – Brasserie belge – Grillades à Bruxelles – Tel: 02/538.12.07 – Rue Jourdan 6
  – 1060 Bruxelles ».
- **`lang="en-US"`** sur toutes les pages d'un site en français.
- **Aucune balise Open Graph** : un lien partagé sur WhatsApp, Facebook ou Messenger
  apparaît sans image ni description.
- **Aucune donnée structurée** (schema.org Restaurant : horaires, adresse, carte, prix,
  avis) alors que c'est ce que Google affiche dans les résultats locaux.
- **Contenu très mince** : un paragraphe sur l'accueil, la carte dans un PDF, aucune page
  sur le feu de bois, le tomahawk, la broche, la privatisation, les bons cadeaux.
- **Contenu dupliqué et périmé indexable** : accueil en trois langues sous trois adresses,
  trois pages Contact, quatre pages Carte, menus de fêtes 2024, article d'exemple.
- 11 images sur 14 sans attribut `alt` sur l'accueil, 51 sur 54 dans la galerie.
- Le plan du site liste la page auteur /author/admin/.

## 6. Accessibilité
- Pas de titre principal, hiérarchie de titres absente.
- Contrastes insuffisants : bouton « NOTRE MENU » 2,5:1, e-mail 2,5:1, boutons du bandeau
  cookies 3,8:1, liens non distinguables du texte (1,36:1).
- Deux cadres (Zenchef, Google Maps) sans attribut `title`.
- Le bandeau cookies utilise `role="dialog"` sur un élément qui ne l'autorise pas.
- Cibles tactiles trop petites, menu mobile dont l'état n'est pas annoncé.

## 7. Sécurité et maintenance
- **PHP 7.4**, dont les correctifs de sécurité ont cessé en novembre 2022 : quatre ans sans
  mise à jour de sécurité du langage qui fait tourner le site.
- **Aucun en-tête de sécurité HTTP** : pas de Strict-Transport-Security, pas de
  Content-Security-Policy, pas de X-Content-Type-Options, X-Frame-Options ni
  Referrer-Policy.
- **Le compte administrateur s'appelle « admin »** et il est exposé publiquement via
  l'API REST (/wp-json/wp/v2/users), la page /author/admin/ et le plan du site : c'est la
  cible idéale d'une attaque par force brute sur /wp-login.php, laissé à son adresse par
  défaut.
- **Le listage des dossiers est activé** : /wp-content/uploads/2022/05/ affiche la liste
  de tous les fichiers envoyés.
- /readme.html accessible (version de WordPress divulguée).
- Le noyau WordPress est à jour (7.1.4), mais plusieurs extensions datent de 2022
  (Contact Form 7 5.6.4, bandeau cookies 4.9.4, FooGallery 2.2.26).
- Point positif : xmlrpc.php est désactivé.

## 8. Hygiène du code
- **Trois systèmes de réservation cohabitent dans le code** : Zenchef (utilisé),
  TableBooker (deux scripts externes chargés sur chaque page, bons cadeaux, annulation) et
  une extension TheFork qui charge jqueryCrypt.js et admin.js sur le site public.
- **Une erreur JavaScript sur chaque page** : `$(...).magnificPopup is not a function`
  (le thème appelle une visionneuse qui n'est pas installée ; une seconde visionneuse,
  FooBox, fait le travail).
- Deux visionneuses d'images, deux extensions de galerie, une extension de formulaire sans
  formulaire, une extension d'événements sans événement, un flipbook pour trois PDF.
- Hiérarchie de contenu construite avec des blocs d'espacement vides (`wp-block-spacer`)
  plutôt qu'avec une mise en page.

## 9. Ce qui va bien
- HTTPS valide, pas de contenu mixte, pas de décalage de mise en page (CLS 0), pas de
  défilement horizontal.
- Images en WebP, vraies photos de qualité, vrai logo.
- Le PDF de la carte est celui de 2026, les horaires et le téléphone sont justes, le
  numéro est cliquable, Zenchef fonctionne.
- Le noyau WordPress est maintenu à jour automatiquement.

## 10. Limites de cet audit
- Les cadres Zenchef, Google Maps et les scripts TableBooker sont bloqués par le réseau de
  l'environnement de test : leur fonctionnement n'a pas pu être vérifié, et ils ne sont pas
  comptés comme des défauts.
- Les redirections http:// vers https:// et www. vers sans www. n'ont pas pu être testées.
- Les temps de chargement passent par un proxy : ils sont indicatifs, légèrement
  pessimistes.
