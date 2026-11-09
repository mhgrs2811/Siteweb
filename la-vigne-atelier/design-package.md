# La Vigne, design package

Projet : site vitrine one-page pour le restaurant La Vigne, Rue Jourdan 6, 1060 Saint-Gilles (Bruxelles).
Dossier de déploiement : `la-vigne/` (un `index.html` + `assets/`). Ce document vit à côté, jamais dedans.
Contrainte posée par la cliente : aucun crédit Higgsfield. Pas de vidéo générée, pas d'image générée.
Le parcours au scroll est donc porté par les vraies photos du restaurant (la-vigne.be/galerie), et c'est un avantage : le hero montre le vrai feu, la vraie salle, la vraie terrasse.

## 1. La prémisse

**Le feu de bois.** À La Vigne, la viande cuit sur du bois qui brûle dans la cuisine depuis 1985. Tout le site enseigne et vend cette seule idée : le hero descend de la rue jusqu'à la braise, le moment interactif attise le feu, la carte s'organise autour de ce qui sort du gril et de la broche, la salle est l'endroit où l'on s'assoit près du feu, et l'appel à l'action unique est d'y prendre une table.

Direction artistique en une ligne : **brasserie de braise, bois sombre et laiton, papier crème pour la carte.**

Écart assumé par rapport au skill : le fond sombre chaud avec accent laiton et une serif est dans la liste des « looks par défaut » à éviter. Ici c'est le monde réel du sujet : l'enseigne est noire avec un V doré, la salle est en bois sombre, les photos sont du feu dans la nuit. On le gagne en échantillonnant les tons dans les photos, en inventant l'élément signature (le sarment qui se dessine) et en évitant la mise en page template. La section carte casse volontairement le sombre avec le crème du vrai menu papier.

## 2. La palette (tokens CSS)

Échantillonnée dans les photos : la salle (#4C2C10, #714B2F, #AC7135), les bûches (#150B06, #361408), les lampes (#D6A572, #C8996E), l'enseigne (V doré), le menu papier (crème).

```css
:root{
  --canvas:#171210;        /* fumée : brun-noir chaud, jamais #000 */
  --canvas-2:#201815;      /* variante pour alterner les sections */
  --panel:#261D18;         /* cartes et surfaces */
  --wood:#4C2C10;          /* bois de la salle */
  --accent:#C9A24A;        /* laiton, le V de l'enseigne : CTA, focus, rares accents */
  --accent-hover:#DDB85E;
  --accent-muted:rgba(201,162,74,.16);
  --text-primary:#F3EBDD;  /* blanc cassé chaud */
  --text-secondary:#B9A992;
  --paper:#F2E9D8;         /* la carte : papier crème du menu */
  --paper-2:#E8DCC6;
  --ink:#1E1711;           /* texte sur papier */
  --ink-2:#5E5245;
  --brass-deep:#7F6020;    /* laiton foncé pour petit texte sur papier (contraste 5:1) */
}
```

Contrastes calculés : texte primaire sur canvas 15:1 ; secondaire sur canvas 8:1 ; laiton sur canvas 7,5:1 ; encre sur papier 15:1 ; encre-2 sur papier 7:1 ; laiton foncé sur papier 5:1 ; bouton laiton avec texte encre 7,5:1.

## 3. Le trio typographique

- **Display : Fraunces** (variable, graisses 300 à 600, italique pour trois mots au plus). Serif chaleureuse, pas une Didone froide. Chargée en local (woff2, latin).
- **Texte : Figtree** (variable, 400 / 500 / 600). Conviviale et très lisible.
- **Labels : DM Mono 500** pour les horaires, prix, petits repères.

Échelle fluide avec `clamp()`, ratio 1,25. Texte courant 17 à 18 px, interlignage 1,6, 60 à 72 caractères par ligne (`max-width` en `ch` sur l'élément texte lui-même).

## 4. La carte des bandes (hero desktop)

Le hero fait 460vh. Le « film » est une suite de cinq vraies photos pilotées par le scroll : fondu croisé + lent zoom (transform et opacity seulement, lissés, réversibles). Descendre = entrer : trottoir, salle, feu, broche, table.

| Bande | Plage (point de départ) | Photo et mouvement | Texte (verbatim) | Entrée |
|---|---|---|---|---|
| 1 | 0,00 à 0,17 | `terrasse` : chaises en osier, vitrine. Zoom lent 1,00 → 1,06 | Kicker : « Rue Jourdan 6, Saint-Gilles » / Titre : « Depuis 1985, à la même adresse. » | Flou vers net (on arrive, la mise au point se fait) |
| 2 | 0,20 à 0,38 | `salle` : la salle en bois, bar au fond. Zoom 1,02 → 1,08 | « On entre. Le bois, l'osier, la lumière chaude. » | Approche depuis la profondeur (on avance dans la salle) |
| 3 | 0,41 à 0,59 | `feu-buches` : les bûches qui brûlent. Zoom 1,00 → 1,10 | « Au fond de la cuisine, du vrai bois brûle. » / Sous-ligne : « Pas de pierres de lave. Pas de plaque. De la braise. » | Dispersion (les lettres se rassemblent comme des braises) |
| 4 | 0,62 à 0,78 | `broche` : la rôtisserie sur les flammes bleues. Léger panoramique latéral | « La broche tourne de midi à 23 h. » / Sous-ligne : « Cochon de lait, coquelet, épaule d'agneau. Cuisine non-stop. » | Glissement aligné (les mots glissent comme la broche tourne) |
| 5 (settle) | 0,82 à 1,00 | `table-steak` : la photo verticale arrive dans un panneau à droite, la broche s'assombrit à gauche et devient le fond du texte | Kicker : « Brasserie méditerranéenne · Grillades au feu de bois » / H1 : « La Vigne » / Sous-ligne : « Viandes irlandaises grillées au feu de bois, moules-frites et plats grecs faits maison. Du lundi au samedi, cuisine non-stop de 12 h à 23 h. » / CTA : « Réserver une table » / Secondaire : « 02 538 12 07 » | Montée mot à mot puis arrivée en trois temps (titre, sous-ligne, boutons) |

Les plages sont des points de départ, validés ensuite par le test des coups de molette (120, 240, 360 px).

## 5. Le bloc hero statique (téléphones, tablettes portrait, mouvement réduit)

Photo : `table-steak` (verticale, parfaite en portrait), assombrie par le scrim.

- Kicker : « Saint-Gilles · Depuis 1985 »
- H1 : « La Vigne »
- Sous-ligne : « Grillades au feu de bois, moules-frites et cuisine grecque maison. Cuisine non-stop de 12 h à 23 h, du lundi au samedi. »
- CTA : « Réserver une table » / Secondaire : « 02 538 12 07 »

## 6. Le plan sous le hero

Un seul appel à l'action partout : **Réserver une table** → la page de réservation existante (Zenchef, rid 368570). Pas de formulaire sur le site : la réservation est déjà vendue ailleurs. Le téléphone est le secours. La privatisation passe par un lien courriel.

### Navigation
Logotype « La Vigne » (le V en laiton) · La carte · Le feu · La salle · Infos · bouton « Réserver ».

### Section « Le feu » (fond fumée)
- Kicker : « Le feu de bois »
- H2 : « Tout passe par la braise. »
- Lede : « Ici, la viande ne cuit pas sur une plaque. Elle cuit sur du bois qui brûle, dans la cuisine, depuis 1985. C'est plus long, c'est plus de travail, et ça se goûte. »
- Trois piliers, traitement égal, une vraie photo chacun :
  1. « La grillade » (photo `tomahawk-feu`) : « Côte à l'os, tomahawk, entrecôte irlandaise, filet mignon. Saisis sur la braise, servis sur plaque en fonte. »
  2. « La broche » (photo `broche-2`) : « Cochon de lait, coquelet, épaule d'agneau pour deux. La rôtisserie du jour tourne doucement, pendant des heures. »
  3. « La mer » (photo `moules`) : « Moules-frites comme il faut, poulpe grillé, bar entier, gambas. La Méditerranée, côté Saint-Gilles. »

### Le moment interactif : « Attisez le feu » (dans la section Le feu)
Un bouton à maintenir enfoncé. Pendant la pression, la photo `feu-grille` s'embrase (une copie plus claire monte en opacité, une lueur orange aussi), et trois lignes s'allument l'une après l'autre. Relâcher trop tôt fait redescendre la braise en douceur. Au clavier : Espace ou Entrée maintenue. Mouvement réduit : état final affiché directement.
- Label : « Maintenez pour attiser la braise »
- Pendant : « Ça prend… »
- Terminé : « La braise est prête. »
- Les trois lignes : « Côte à l'os irlandaise, ± 500 g · 39,90 € » / « Tomahawk de bœuf irlandais, ± 1 kg pour deux · 85,90 € » / « Le plat signature, filet mignon de bœuf, frites et salade · 26,90 € »

### Section « La carte » (fond papier crème)
- Kicker : « La carte 2026 »
- H2 : « Une carte de brasserie, honnête et généreuse. »
- Intro : « Des entrées à partager, des grillades, des moules, du poisson, des pâtes et un menu enfants. Tous les plats sont servis avec un accompagnement au choix : frites belges maison, riz basmati, croquettes de pommes de terre, grenailles ou écrasé de pommes de terre au feu de bois. »
- Colonnes (prix de la carte 2026) :
  - **Pour commencer** : Planche de charcuterie du Chef 14,90 € · Croquettes aux crevettes grises 19,90 € · Scampis au beurre à l'ail 19,90 € · Carpaccio de bœuf, parmesan, huile de truffe 18,90 € · Poulpe grillé 23,90 € · Tzatziki maison 9,90 €
  - **Du feu et de la broche** : Le plat signature, filet mignon de bœuf, frites et salade 26,90 € · Entrecôte irlandaise 35,90 € · Côte à l'os irlandaise, ± 500 g 39,90 € · Tomahawk de bœuf irlandais, ± 1 kg, pour deux 85,90 € · Coquelet rôti, sauce champignons 23,90 € · Cochon de lait à la broche, gratin dauphinois, béarnaise à la menthe 32,90 € · Épaule d'agneau, jus de viande, gratin dauphinois, pour deux 59,90 €
  - **Moules et mer** : Moules marinières 28,90 € · Moules crème à l'ail 29,90 € · Bar grillé 33,90 € · Sole meunière 37,90 € · Fish & chips, sauce tartare 25,90 €
  - **Grèce et pâtes** : Moussaka maison 21,90 € · Soutzoukakia maison 21,00 € · Gyros de poulet ou de porc, pain pitta, tzatziki 21,90 € · Pasticcio 17,90 € · Salade grecque 17,90 €
  - **Les enfants, jusqu'à 12 ans** : Spaghetti bolognaise, brochettes ou boulettes sauce tomate, avec une boule de glace 14,50 €
- Note : « Sauces au choix en supplément, 4,50 €. Prix de la carte 2026, susceptibles d'évoluer. »
- Bouton : « Télécharger la carte complète (PDF) »

### Section « La salle » (fond bois)
- Kicker : « La salle et la terrasse »
- H2 : « Une brasserie de quartier, pas un décor. »
- Texte : « Des tables en bois, des banquettes, des lampes en osier et une terrasse sur la rue Jourdan dès les beaux jours. Les habitués viennent à midi en semaine, les familles le samedi soir, et le restaurant se privatise pour vos fêtes et vos repas d'équipe. »
- Photos : `salle-lampes` (grande, verticale), `lampes`, `terrasse`, `equipe` (légende : « L'équipe, devant le restaurant. »).
- Lien : « Privatiser le restaurant » → courriel.

### Section « Les avis » (fond fumée 2)
- Kicker : « Les avis »
- H2 : « Ce que les clients citent le plus souvent. »
- Trois constats, formulés comme des faits, pas comme des citations inventées :
  1. « La viande » : « Des pièces irlandaises saisies au feu de bois. C'est le plat qui revient dans presque tous les avis. »
  2. « Le service » : « Chaleureux et attentif. Une bonne adresse de quartier, où l'on vous conseille le vin sans en faire trop. »
  3. « Les moules » : « Marinières, à la crème d'ail ou au curry, servies avec les frites maison. Le classique belge, bien fait. »
- Notes publiques avec lien : « 4,5 / 5 sur Google, environ 590 avis » (lien Google Maps) · « 4,4 / 5 sur Tripadvisor, plus de 600 avis » (lien Tripadvisor). Mention : « Notes relevées en novembre 2026. »

### Section « Infos » : FAQ + pratique
- H2 : « Les questions qu'on nous pose. »
- « Faut-il réserver ? » → « Le soir et le week-end, c'est plus sûr. En ligne avec le bouton Réserver, ou par téléphone au 02 538 12 07. »
- « Peut-on manger l'après-midi ? » → « Oui. La cuisine est ouverte non-stop de 12 h à 23 h, du lundi au samedi. Le dimanche, c'est fermé. »
- « Y a-t-il un menu pour les enfants ? » → « Oui, jusqu'à 12 ans : spaghetti bolognaise, brochettes ou boulettes, avec une boule de glace, pour 14,50 €. »
- « Et si je ne mange pas de viande ? » → « Poulpe, bar, sole, moules, salades, tagliatelles provençales, assortiment de légumes à l'huile d'olive. Il y a de quoi faire. »
- « Peut-on privatiser le restaurant ? » → « Oui, pour un anniversaire, un repas d'équipe ou une fête de famille. Écrivez-nous ou appelez, on regarde les dates ensemble. »
- « Faites-vous de l'emporter ? » → « Oui. Une participation de 1 € est demandée pour l'emballage. »
- « Comment venir ? » → « Rue Jourdan 6, à Saint-Gilles, à deux pas de l'avenue Louise et du rond-point Stéphanie. Métro Louise, trams 92 et 93, arrêt Stéphanie. »
- Bloc pratique : Adresse « Rue Jourdan 6, 1060 Saint-Gilles » · Horaires « Lundi à samedi, 12 h à 23 h, cuisine non-stop. Dimanche fermé. » · Téléphone « 02 538 12 07 » · Courriel « nc-invest@outlook.com » · Lien « Itinéraire » (Google Maps).

### Section finale (photo `feu-grille` assombrie)
- H2 : « Une table près du feu ? »
- Texte : « Réservez en ligne en une minute, ou appelez-nous. Du lundi au samedi, de 12 h à 23 h. »
- CTA : « Réserver une table » · Secondaire : « 02 538 12 07 »

### Pied de page
Logotype · « Restaurant et brasserie méditerranéenne à Saint-Gilles, depuis 1985. » · Adresse, téléphone, courriel, horaires · Instagram « @lavignebxl » · « Photos © La Vigne » · « Réservations en ligne par Zenchef ». Pas de mention de marque fictive : la marque est réelle. Les mentions légales (numéro d'entreprise) restent à fournir par la cliente.

## 7. Le plan de la couche vectorielle

- **Signature : le sarment.** Un trait SVG en laiton, dessiné à la main, qui descend le long de la marge gauche sous le hero et se trace avec le scroll (`stroke-dashoffset`). À chaque section, une petite feuille de vigne (SVG) s'ouvre quand le trait l'atteint. Si on l'enlève, la page perd son fil : c'est bien une signature. Caché sous 720 px ; à la place, une feuille seule devant chaque kicker.
- **Braises.** Huit à dix points orangés minuscules qui montent lentement (transform et opacity, délais négatifs, 7 à 11 s), dans le hero, la section Le feu et la section finale. Pausés hors écran et onglet caché.
- **Le V.** Logotype en HTML (Fraunces), le V agrandi en laiton. Favicon SVG inline : V laiton sur fumée.
- **Environnement fixe.** Une couche fixe derrière tout : vignette radiale chaude + grain SVG, dérive de 90 s. Le défilement traverse un lieu, pas des blocs empilés.
- **Séparateurs.** Un filet laiton très fin avec un point qui s'allume quand la section entre.
- Mouvement réduit : tout est affiché dans son état final, aucune animation.

## 8. La liste d'ingénierie

Le standard de `scrub-pipeline.md`, adapté à des photos à la place d'une vidéo :

- Hero épinglé de 460vh, scène sticky plein écran. Progrès 0 → 1 lissé par une boucle rAF normalisée par dt (k = 0,16) qui se repose quand elle converge et quand le hero est hors écran (IntersectionObserver).
- Cinq couches photo : opacity et transform uniquement, calculés depuis le progrès, écrits dans le DOM seulement si la valeur change (delta 0,002). Pas de `currentTime`, donc pas de seek à gérer ; les photos sont chargées en JS uniquement dans le chemin « scrub actif ».
- Bandes de légende : plateau long, rampes smoothstep en unités de progrès (`f = min(0.02, (b-a)/3)`), variable `--k` pour l'assemblage, première bande sans fondu d'entrée (rampe au chargement), dernière sans fondu de sortie. Test des coups de molette 120 / 240 / 360 px.
- Lisibilité en quatre couches : scrim global radial, scrim par bande qui suit `--k`, ombre de texte à trois niveaux, puces floutées pour les petits textes. Audit du pire pixel ≥ 3,5:1 par bande.
- Les cinq portes du hero statique, identiques dans le CSS et le JS, décidées en direct (`change` sur chaque media query). Poster et photos chargés seulement dans le chemin actif. Mouvement réduit honoré dans les deux sens (épingler les états finaux, puis réarmer).
- Complet sans les photos du parcours : si une photo échoue, la scène garde le poster et les légendes.
- `overflow-x: clip` sur html et body. Entrées de section par IntersectionObserver avec rétractation des délais. Un élément vivant par section. Un seul moment interactif (la braise). Animer seulement transform et opacity.
- Sémantique : skip link, `nav`, `main`, `footer`, un seul h1, `aria-hidden` sur les décors, focus visible en laiton, cibles 44 px sur écrans tactiles. Title, meta description, theme-color, Open Graph avec `<!-- DEPLOY STEP -->`, favicon SVG inline, `lang="fr"`.
- Polices locales, `font-display: swap`, préchargement des deux woff2 principaux.

## 9. La ligne de porte

Chaque ligne de texte ci-dessus est livrée telle quelle. La page construite doit passer la porte de la phase 9 avant d'être montrée : zéro tiret cadratin, zéro mot bateau (leverage, seamless, empower, unlock, robust, actionable, data-driven, solutions), et la relecture des tics d'IA (« ce n'est pas X, c'est Y », fausses plages, attributions vagues, conclusions grandiloquentes, testament, landscape, delve, elevate). Les dispositifs voulus ici (« Pas de pierres de lave. Pas de plaque. De la braise. ») sont de l'artisanat et restent.
