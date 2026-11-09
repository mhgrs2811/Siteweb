# Prompt pour Claude Code : un site vitrine immersif « à la La Vigne »

Mode d'emploi : remplace les champs entre crochets, ouvre Claude Code dans le dossier du
projet (`claude`), colle le prompt. Joins les fichiers (logo, carte en PDF, dossier de
photos) avec `@chemin/du/fichier` dans le message. Si les skills `10k-websites` et
`frontend-design` sont installés dans le projet, Claude les utilisera ; sinon le prompt
se suffit à lui-même.

---

Tu es designer et développeur front, dans un studio connu pour donner à chaque client une
identité visuelle qu'on ne confond avec aucune autre. Crée le site vitrine de
[NOM DU COMMERCE], [type d'activité, ex. : brasserie méditerranéenne et grillades au feu de
bois], [adresse complète], ouvert depuis [ANNÉE]. Si les skills `10k-websites` et
`frontend-design:frontend-design` sont disponibles, utilise-les. Lis et applique le
fichier CLAUDE.md du projet s'il existe. Travaille sans génération d'images ni de vidéos
par IA.

## Matière première (tout est réel, rien n'est inventé)

- Site actuel : [URL] et sa galerie : [URL]. Lis-les pour comprendre l'univers, le ton,
  les produits, le public.
- Réservation : [lien du module, ex. Zenchef]. Téléphone : [NUMÉRO]. Horaires :
  [HORAIRES]. E-mail : [E-MAIL].
- Carte et tarifs : [chemin du PDF]. Reprends les vrais noms de plats et les vrais prix.
- Photos : [dossier ou URL]. Uniquement les photos réelles du commerce, aucune banque
  d'images. Optimise-les : WebP, plusieurs largeurs, `srcset`, `loading="lazy"` sous la
  ligne de flottaison, dimensions déclarées.
- Logo : [fichier PDF, SVG ou PNG]. Ne le modifie pas et ne le redessine pas. Vectorise-le
  tel quel (ou reprends le SVG) avec sa vraie typographie, et utilise-le partout :
  en-tête, animation d'arrivée, pied de page, favicon.
- Produit phare : [ex. : le tomahawk]. Il doit être visible dès la première seconde, y
  compris pendant l'animation d'arrivée.

## Références

- Animation d'arrivée : https://www.palazzosogni.com/ (le rideau qui s'ouvre). Reprends
  l'esprit et le rythme, jamais le code, les textes ni les marques.
- Mise en page sous le hero : https://lesaintgeorges.ch/ (fond clair, beaucoup d'air,
  titres en serif de taille modérée, rangées alternées photo et texte, boutons
  rectangulaires). Adapte ses principes aux couleurs et à la typographie de
  [NOM DU COMMERCE], ne copie pas ses couleurs.
- [Ajoute ici une ou deux captures ou liens que tu aimes.] Les références fournies passent
  avant tes habitudes. S'il te manque une référence pour trancher une direction visuelle,
  pose-moi la question avant de coder.

## Ce que je veux obtenir

1. Un effet « waouw, ce site a dû coûter cher » dès le chargement, sans défilement
   d'images sur l'accueil. Un site immersif, pas un modèle de page d'atterrissage.
2. L'animation d'arrivée, jouée à chaque chargement (sauf lien profond vers une section et
   préférence « mouvement réduit ») : fond sombre et fumée, le logo apparaît, la photo du
   produit phare se révèle à travers une lettre du logo, puis cette fenêtre s'ouvre sur le
   hero. Trois à quatre secondes au total, aucun flash clair avant le rideau, le rideau
   est dans le HTML avant tout script.
3. Le hero : une photo plein cadre, jamais coupée ni recouverte par un bloc. C'est le texte
   qui s'adapte à l'image : il se range dans sa zone sombre, avec un voile local si
   nécessaire. Pas de logo répété dans le hero, il est dans l'en-tête. Une phrase
   d'identité en police de titrage (ex. : « Brasserie méditerranéenne à Saint-Gilles,
   depuis 1985. »), une seule ligne pratique (adresse, horaires), un bouton « Réserver une
   table » et le téléphone. Un lent zoom de la photo après l'arrivée, un léger parallaxe au
   défilement. En portrait, la photo se recadre sur le produit phare et le texte passe au
   pied de l'écran.
4. Sous le hero, dans l'esprit de la référence : introduction centrée, rangées alternées
   texte et collage de deux photos, bande de carte avec points de conduite et vrais prix,
   trois photos plein écran qui rythment la page avec une seule phrase chacune posée dans
   la zone sombre, section salle, avis réels avec la source et la date, FAQ en `<details>`,
   fiche pratique (adresse, horaires, téléphone, itinéraire), pied de page clair. Un seul
   moment interactif discret lié au métier (ex. : maintenir pour attiser la braise).
5. Textes concrets en français soigné : apostrophes typographiques, guillemets « »,
   espaces insécables avant : ; ! ? et dans « 12 h ». Aucun tiret cadratin. Aucun faux
   témoignage, aucune fausse statistique, aucun lorem ipsum, aucun mot creux (révolutionnez,
   boostez, tout-en-un, seamless, empower, unlock).

## Direction artistique (énonce-la en une ligne avant de coder)

- Palette : neutres travaillés (crème, sable, encre chaude, jamais #fff ni #000) et une
  seule couleur d'accent, prise dans le logo. Tout en variables CSS. Contraste WCAG AA.
- Typographie : deux familles maximum, auto-hébergées en woff2 avec `preload` et
  `font-display: swap`. La police de titrage doit avoir du caractère et répondre au logo
  (ex. : un vrai Didone si le logo en est un). Évite les polices devenues le défaut des
  sites générés : Inter, Fraunces, Playfair Display, Poppins, Montserrat, DM Sans, Space
  Grotesk. Texte courant 17 à 18 px, 60 à 75 caractères par ligne, échelle fluide en
  `clamp()`.
- Interdits : violet et dégradés, texte en dégradé, halo flou derrière un titre, emojis,
  icônes dans des carrés arrondis, grille de cartes identiques, badge pilule, étiquettes en
  capitales espacées au-dessus des titres, numérotation 01 / 02 / 03, points médians
  (A · B · C), flèches « → » dans les liens, un mot isolé en couleur ou en italique dans un
  titre, fondu à l'apparition de chaque section, zoom au survol des images, glassmorphism,
  coins très arrondis partout, ombres floues partout, hero du type « The future of X ».
- Mouvement : une seule séquence orchestrée (l'arrivée), puis des gestes discrets de 150 à
  300 ms qui répondent à une action. Respecte `prefers-reduced-motion`.

## Technique

- Un seul `index.html` avec son CSS et son JavaScript, plus un dossier `assets` (images,
  polices, PDF de la carte, image Open Graph 1200 × 630). Pas de framework, pas de
  dépendance lourde.
- HTML sémantique, un seul h1, `alt` descriptifs, `label` sur les champs, focus visible,
  menu mobile avec `aria-expanded`, fermeture au clic et à Échap, cibles tactiles d'au
  moins 44 px, pas de texte sous 16 px dans les champs.
- SEO de base : `title`, `meta description`, Open Graph, `lang="fr"`, favicon tiré du logo.
- Mobile-first, puis tablette et ordinateur.

## Vérification obligatoire avant de me montrer quoi que ce soit

- Lance un serveur local et capture la page avec Playwright (Chromium est préinstallé) à
  320, 375, 768 et 1440 px en pleine page, plus l'animation d'arrivée image par image sur
  ordinateur et téléphone. Regarde réellement les captures.
- Contrôle : aucun débordement horizontal, polices chargées, zéro erreur console, aucune
  image cassée, cibles tactiles d'au moins 44 px, menu mobile fonctionnel, mouvement réduit
  respecté. Pour chaque texte posé sur une photo, mesure le contraste au pire pixel
  (au moins 4,5:1, ou 3,5:1 pour les grands titres) et corrige le voile ou le placement
  si ça échoue.
- Passe les textes au crible : zéro tiret cadratin, zéro mot creux, zéro motif de la liste
  des interdits.
- Tiens à jour un dossier de design en Markdown (direction, palette, typographie, plan des
  sections, décisions et leurs raisons).
- Commits en français sur la branche indiquée, puis un aperçu que je valide avant toute
  mise en ligne. Dans ton compte rendu, dis ce qui a été vérifié, à quelles largeurs, et
  ce qui reste à faire. N'affirme jamais qu'un rendu est correct sans l'avoir vu.
