# La Vigne, design package

Projet : site vitrine one-page pour le restaurant La Vigne, Rue Jourdan 6, 1060 Saint-Gilles (Bruxelles).
Dossier de déploiement : `la-vigne/` (un `index.html` + `assets/`). Ce document vit à côté, jamais dedans.
Contrainte posée par la cliente : aucun crédit Higgsfield. Pas de vidéo générée, pas d'image générée.
Le parcours au scroll est donc porté par les vraies photos du restaurant (la-vigne.be/galerie), et c'est un avantage : le hero montre le vrai feu, la vraie salle, la vraie terrasse.

## 1. La prémisse

**Le feu de bois.** À La Vigne, la viande cuit sur du bois qui brûle dans la cuisine depuis 1985. Tout le site enseigne et vend cette seule idée : le hero descend de la rue jusqu'à la braise, le moment interactif attise le feu, la carte s'organise autour de ce qui sort du gril et de la broche, la salle est l'endroit où l'on s'assoit près du feu, et l'appel à l'action unique est d'y prendre une table.

Direction artistique en une ligne : **le feu dans la nuit pour l'arrivée, puis une brasserie en plein jour : papier ivoire, encre, un filet de laiton.**

Référence donnée par la cliente : lesaintgeorges.ch (hôtel-restaurant à Gruyères). Ce qui en fait le caractère, et ce qu'on en reprend : fond clair et beaucoup d'air, titres en serif fine de taille modérée (pas de titres géants), texte centré en colonne étroite, photos à angles droits qui alternent gauche et droite avec parfois deux photos qui se chevauchent, boutons rectangulaires en petites capitales très espacées, liens « En savoir plus → » soulignés d'un trait fin, un bandeau sable pour une section, une frise au trait avant le pied de page, un pied de page clair à colonnes titrées en serif. Ce qu'on ne copie pas : son brun, sa Lora et son Avenir, ses textes, son en-tête à deux étages. Les couleurs et les polices viennent de La Vigne : l'ivoire du menu papier, l'encre de l'enseigne, le laiton du V, Fraunces et Figtree. Décision de la cliente : l'arrivée sur le feu reste telle quelle ; l'esprit clair s'applique à tout ce qui suit.

## 2. La palette (tokens CSS)

Deux mondes, un seul site. Le feu pour le hero et le bandeau final, échantillonné dans les photos (bûches #150B06, lampes #D6A572, V doré de l'enseigne). Le papier pour tout le reste, tiré du menu imprimé de La Vigne (ivoire, titres dorés, texte noir) et de l'enseigne (noir et laiton).

```css
:root{
  /* le feu */
  --canvas:#171210;        /* fumée : brun-noir chaud, jamais #000 */
  --accent:#C9A24A;        /* laiton clair sur fond sombre : V, bouton du hero */
  --text-primary:#F3EBDD;  /* blanc cassé chaud */
  --text-secondary:#B9A992;
  /* le papier */
  --paper:#F6F0E4;         /* ivoire du menu, plus aéré que le crème imprimé */
  --sand:#EADFCB;          /* le bandeau de la carte et la fiche pratique */
  --ink:#231A12;           /* le noir chaud de l'enseigne : titres, texte, boutons */
  --ink-2:#5C4F42;         /* texte secondaire */
  --ink-3:#8C7E6E;         /* légendes */
  --brass:#A67C22;         /* le V, les filets, la frise, le survol : jamais pour du petit texte */
  --brass-deep:#7A5B1D;    /* les kickers et petits repères en capitales */
}
```

Contrastes calculés : encre sur ivoire 15:1 ; encre-2 sur ivoire 7:1 ; laiton foncé sur ivoire 5,6:1 ; laiton sur ivoire 3,4:1 (réservé aux grands signes et aux traits) ; encre sur sable 13:1 ; bouton encre avec texte ivoire 15:1 ; blanc cassé sur fumée 15:1 ; laiton clair sur fumée 7,5:1.

## 3. Le trio typographique

- **Display : Fraunces** (variable, 300 pour le grand « La Vigne » du hero, 500 pour les titres de sections). Taille modérée sous le hero, comme la référence : 30 à 40 px pour les h2, 27 à 38 px pour les h3.
- **Texte : Figtree** (variable, 400 / 500 / 600), 17 à 18 px, interlignage 1,65. Les kickers, boutons et liens « en savoir plus » sont en Figtree capitales, 12 à 13 px, espacement .16 à .2 em, dans l'esprit des petites capitales espacées de la référence.
- **Repères du hero : DM Mono 500** pour les kickers et le téléphone sur le feu uniquement.

Échelle fluide avec `clamp()`. 60 à 72 caractères par ligne (`max-width` en `ch` sur l'élément texte lui-même). Boutons rectangulaires sans arrondi.

## 4. L'arrivée : le rideau de fumée et le V qui s'ouvre (d'après palazzosogni.com)

Référence donnée par la cliente : l'arrivée de palazzosogni.com. Ce qu'elle fait, image par image : un fond calme et coloré qui bouge à peine, le monogramme qui apparaît au centre, un reflet de lumière qui le traverse, puis le monogramme devient une fenêtre sur la photo de l'hôtel et s'ouvre jusqu'à remplir l'écran, la navigation arrive en dernier. Ce qu'on en reprend, traduit pour La Vigne :

1. Un rideau fumée (le noir chaud de l'enseigne) avec trois nappes de lumière qui dérivent très lentement, laiton et braise.
2. L'enseigne apparaît au centre : LA, le grand V doré, IGNE, puis « Depuis 1985 ». Un reflet de lumière traverse les lettres.
3. Le V doré se dissout et laisse voir, à travers sa forme, la photo du tomahawk au-dessus des flammes (une découpe SVG, la même photo et le même cadrage que le hero dessous).
4. La fenêtre s'ouvre : le V grandit en une seconde jusqu'à seize fois sa taille, les lettres s'effacent, le rideau se fond, et la photo plein cadre est là. Rien ne saute : la photo de la fenêtre et celle du hero sont au pixel près la même.
5. La navigation, puis les mots du coin bas droit, puis l'invitation à défiler.

Trois secondes et demie. Jouée une fois par visite : revenir à l'accueil dans la même session donne un simple fondu d'une seconde. Mouvement réduit : pas de rideau du tout. Le rideau est posé dans le HTML avant tout script, donc rien ne clignote avant lui.

## 4 bis. Le hero : le tomahawk au-dessus du feu, plein cadre

Règle posée par la cliente : l'image d'abord, en plein cadre, et le texte se range dans ses parties vides. La photo du tomahawk occupe tout l'écran (cadrée au centre sur ordinateur, calée à droite sur téléphone pour garder la viande). Les mots prennent le coin bas droit, sous la pince, au-dessus de la grille sombre : LA V IGNE comme sur la façade, « Depuis 1985 », une phrase, le bouton Réserver et le téléphone, alignés à droite. Un voile local les porte ; la flamme et la viande restent claires. Sur téléphone, les mots sont en bas à gauche sur un dégradé. La photo continue un zoom très lent et glisse en parallaxe douce quand on descend.

Sous le hero, trois photos plein cadre rythment la page comme des respirations, chacune avec une phrase posée dans sa partie sombre : les bûches (« Au fond de la cuisine, du vrai bois brûle. »), les lampes en osier (« On entre. Le bois, l'osier, la lumière chaude. »), la terrasse (« Depuis 1985, à la même adresse. »). Elles glissent un peu moins vite que la page. Le bandeau final est la broche.

## Ancienne version du hero (remplacée)

Décisions successives de la cliente : pas de défilement d'images ; le « waouw » dès le chargement ; puis, le produit phare étant le tomahawk, il doit être visible dès le départ, animation comprise.

**Composition.** Un écran coupé en deux. À droite, la vraie photo du tomahawk saisi à la pince au-dessus des flammes, en entier, jamais rognée (la photo est verticale, la moitié d'écran aussi). À gauche, le fond fumée et la carte de titre, alignée à gauche : « Saint-Gilles, depuis 1985 », le grand « La Vigne » avec le V de l'enseigne, un filet doré, la sous-ligne, le bouton « Réserver une table » et le téléphone. Le bord gauche de la photo se fond dans le fond fumée, et une lueur orange déborde de la flamme sur le panneau sombre. Sur téléphone et tablette en portrait, la photo occupe le haut de l'écran, entière, sans rien par-dessus ; les mots viennent dessous sur le fond fumée.

**L'arrivée (3 secondes, jouée une fois).** La photo apparaît tout de suite, en une seconde, avec un léger recul de zoom : le tomahawk est là avant tout le reste. Pendant ce temps, à gauche, le V de l'enseigne se trace en laiton puis se remplit, « La » et « igne » glissent se coller au V, le filet doré s'étire, la lueur s'allume et se met à respirer, les braises montent dans le panneau sombre, puis la ligne « Saint-Gilles, depuis 1985 », la sous-ligne et les boutons arrivent l'un après l'autre. La navigation vient en dernier. Si la photo n'arrive pas, la carte joue quand même son arrivée.

**Ensuite.** La photo continue un très lent zoom (40 secondes aller, 40 retour). Quand on descend, elle glisse un peu moins vite que la page et la carte s'estompe. La navigation passe à l'ivoire une fois le hero quitté. Mouvement réduit : rien ne bouge, tout est affiché.

**Texte (verbatim).** « Saint-Gilles, depuis 1985 ». H1 : « La Vigne ». Sous-ligne : « Brasserie méditerranéenne. Le tomahawk et la côte à l’os irlandais saisis au feu de bois, les moules-frites, les plats grecs maison. Du lundi au samedi, cuisine non-stop de 12 h à 23 h. » CTA : « Réserver une table ». Secondaire : « 02 538 12 07 ». La photo du tomahawk servi à table prend la place de celle du feu dans la rangée « La grillade », pour ne pas répéter l'image du hero. L'image de partage (og) est aussi le tomahawk.

| Bande | Plage (point de départ) | Photo et mouvement | Texte (verbatim) | Entrée |
|---|---|---|---|---|
| 1 (carte de titre) | 0,00 à 0,15 | `feu-buches` : les bûches qui brûlent, flamme à gauche, texte à droite. Zoom 1,00 → 1,08 | Kicker : « Saint-Gilles · Depuis 1985 » / H1 : « La Vigne » (le V dessiné) / Sous-ligne : « Brasserie méditerranéenne. Grillades au feu de bois. » | La séquence d'arrivée ci-dessus |
| 2 | 0,17 à 0,31 | `terrasse` : chaises en osier, vitrine. Zoom lent 1,00 → 1,07 | Kicker : « Rue Jourdan 6, Saint-Gilles » / Titre : « Depuis 1985, à la même adresse. » | Flou vers net (on arrive, la mise au point se fait) |
| 3 | 0,33 à 0,47 | `salle` : la salle en bois, bar au fond. Zoom 1,02 → 1,09 | « On entre. Le bois, l'osier, la lumière chaude. » | Approche depuis la profondeur (on avance dans la salle) |
| 4 | 0,49 à 0,63 | `feu-grille` : la braise sous la grille. Zoom 1,00 → 1,11 | « Au fond de la cuisine, du vrai bois brûle. » / Sous-ligne : « Pas de pierres de lave. Pas de plaque. De la braise. » | Dispersion (les lettres se rassemblent comme des braises) |
| 5 | 0,65 à 0,79 | `broche` : la rôtisserie sur les flammes bleues. Léger panoramique latéral | « La broche tourne de midi à 23 h. » / Sous-ligne : « Cochon de lait, coquelet, épaule d'agneau. Cuisine non-stop. » | Glissement aligné (les mots glissent comme la broche tourne) |
| 6 (settle) | 0,83 à 1,00 | `table-steak` : la photo verticale arrive dans un panneau à droite, la broche s'assombrit à gauche et devient le fond du texte | Kicker : « Brasserie méditerranéenne · Grillades au feu de bois » / Titre : « La bonne table de Saint-Gilles, depuis plus de quarante ans. » / Sous-ligne : « Viandes irlandaises au feu de bois, moules-frites et plats grecs faits maison. Du lundi au samedi, cuisine non-stop de 12 h à 23 h. » / CTA : « Réserver une table » / Secondaire : « 02 538 12 07 » | Montée mot à mot puis arrivée en trois temps (titre, sous-ligne, boutons) |

Les plages sont des points de départ, validées par le test des coups de molette (120, 240, 360 px) : chaque bande tient 6 coups de 120 px, aucune n'est sautée à 360 px. Voiles par bande mesurés au pire pixel : 6,6:1 à 13:1.

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

- **Signature : le V qui se trace et la frise de vigne.** À l'arrivée, le V de l'enseigne se dessine en un trait (SVG, `stroke-dashoffset`) avant de se remplir. Avant le pied de page, une frise de vigne dessinée à la main au trait de laiton (sarment, feuilles, vrilles, deux grappes) se trace sur toute la largeur quand elle entre dans l'écran, puis les grappes apparaissent. C'est la réponse de La Vigne à la frise de village au trait de la référence.
- **Les feuilles.** Une petite feuille de vigne (SVG) devant chaque kicker.
- **Les filets.** Chaque section s'ouvre sur un filet laiton qui se trace de gauche à droite quand elle entre, avec un point qui respire.
- **Braises.** Points orangés minuscules qui montent lentement (transform et opacity, délais négatifs, 7 à 11 s), dans le hero, le bloc de la braise et le bandeau final. Pausés hors écran et onglet caché.
- **Le logotype.** « LA V IGNE » en Fraunces, le V agrandi en laiton, avec « Saint-Gilles · Depuis 1985 » en petites capitales dessous, centré dans l'en-tête comme la référence. Favicon : le V en laiton sur fumée.
- **Environnement fixe.** Une couche fixe derrière tout : grain de papier et une vignette dorée très légère, dérive de 90 s.
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

## 8 bis. La passe « frontend-design » (à la demande de la cliente)

Relecture du site comme directeur de création, contre la liste des tics de page générée. Ce qui a été retiré, et pourquoi :

- Les étiquettes en capitales espacées au-dessus de chaque titre (« LE FEU DE BOIS », « LA CARTE 2026 »…) : du chrome de gabarit, le titre dit déjà tout.
- Les chaînes à points médians (« Saint-Gilles · Depuis 1985 ») : remplacées par des phrases (« Saint-Gilles, depuis 1985 »).
- La police mono pour les petits repères : supprimée. Deux familles seulement, Fraunces et Figtree, nettement distinctes.
- Les numéros 01 / 02 / 03 devant la grillade, la broche et la mer, et devant les trois constats des avis : ce ne sont pas des étapes, la numérotation mentait. Les avis deviennent une seule phrase posée.
- Les flèches collées aux liens, les filets qui se dessinent avec un point qui pulse, le fondu-glissé de chaque section, le zoom au survol de chaque photo, la dérive du grain de fond, la frise qui se trace, les braises du bandeau final : du mouvement sans raison. Il reste exactement un moment orchestré, l'arrivée sur le feu, et un mouvement qui répond au geste, la braise que l'on attise (ses braises ne montent que pendant la pression).
- Les liens du menu passent en minuscules (comme la référence). Les boutons gardent leurs petites capitales espacées, c'est la référence choisie par la cliente.

Ce qui est gardé en connaissance de cause : le V doré dans « La Vigne » (c'est l'enseigne réelle, pas un mot mis en couleur), l'ivoire et la serif (le papier du menu et la référence), le bandeau sable de la carte (il isole la carte comme la référence isole ses offres), les pointillés qui relient plat et prix (la structure porte une information), les accordéons de la FAQ (le mouvement montre ce qui s'ouvre).

Plan de tokens, inchangé : ivoire #F6F0E4, sable #EADFCB, encre #231A12, laiton #A67C22 (foncé #7A5B1D pour le texte), fumée #171210. Alignement : texte centré en colonne étroite pour les introductions et les rangées, aligné à gauche dans la carte, la FAQ et le pied de page.

## 9. La ligne de porte

Chaque ligne de texte ci-dessus est livrée telle quelle. La page construite doit passer la porte de la phase 9 avant d'être montrée : zéro tiret cadratin, zéro mot bateau (leverage, seamless, empower, unlock, robust, actionable, data-driven, solutions), et la relecture des tics d'IA (« ce n'est pas X, c'est Y », fausses plages, attributions vagues, conclusions grandiloquentes, testament, landscape, delve, elevate). Les dispositifs voulus ici (« Pas de pierres de lave. Pas de plaque. De la braise. ») sont de l'artisanat et restent.
