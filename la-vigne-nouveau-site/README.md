# La Vigne — nouveau site (proposition)

Site statique (HTML/CSS/JS pur, aucune dépendance, aucun build). Il fonctionne tel quel : on peut l'ouvrir en local en double-cliquant sur `index.html`, ou le déployer immédiatement.

## Aperçu en local

```
cd la-vigne-nouveau-site
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

(ou simplement ouvrir `index.html` dans un navigateur)

## Mise en ligne (au choix, aucune n'exige de compétences techniques poussées)

- **Netlify / Vercel** : glisser-déposer le dossier `la-vigne-nouveau-site` sur app.netlify.com/drop → site en ligne en 30 secondes.
- **Hébergeur actuel (la-vigne.be)** : envoyer le contenu du dossier par FTP à la racine du site, en remplaçant l'ancien site WordPress.
- **GitHub Pages** : pousser ce dossier sur un repo et activer Pages dans les réglages.

## Ce que ce site corrige par rapport à l'ancien

- **Bug carte Google Maps** ("The provided API key is invalid" affiché en clair) → remplacé par un embed Google Maps sans clé API, garanti fonctionnel.
- **Icône panier "0"** dans le header (reste d'un thème e-commerce, aucun sens ici) → supprimée.
- **Carte invisible sur le site** (juste un bouton vers un PDF externe) → catégories et plats phares maintenant visibles directement sur la page (meilleur pour le référencement Google et les visiteurs mobiles pressés), avec toujours un bouton vers le PDF complet.
- **Typographies incohérentes** (logo serif + titres en police manuscrite) → une seule famille de titres (Fraunces) cohérente du haut en bas de la page.
- **Aucun indicateur de disponibilité** → badge "Ouvert maintenant / Fermé" calculé en temps réel dans la barre du haut.
- **Pas de CTA fort** → bouton "Réserver" sticky sur mobile, CTA répétés à chaque section.
- **SEO quasi absent** → balises meta description, Open Graph, et données structurées `schema.org/Restaurant` (aide Google à afficher horaires/adresse/téléphone directement dans les résultats de recherche).
- **Nom "La Vigne" sans mise en avant du vin** → à vous de me dire si vous voulez une vraie section "cave à vins" (je peux l'ajouter dès que vous avez la liste).

## Contenu déjà réel

- **Menu et prix** : la carte affichée sur le site (6 catégories, plats phares) et le PDF téléchargeable (`assets/carte-la-vigne.pdf`, 4 pages, généré automatiquement à partir du script `build_menu_pdf.py`) reprennent l'intégralité de votre vraie carte — entrées, moules, mer, salades, grillades au feu de bois, rôtisserie du jour, pâtes, menu enfants, apéritifs, cocktails, bières, champagnes — avec les prix exacts que vous m'avez transmis.
- **Instagram** : lien réel vers `@lavignebxl` (barre du haut + footer).
- **"Depuis 1985"** : repris de l'en-tête de votre carte actuelle.

## À compléter avant publication (obligatoire)

Je n'ai pas accès à internet depuis mon environnement de travail, donc je n'ai pas pu récupérer vos vraies photos. Tout est prêt à les recevoir :

1. **Photos** — déposer vos fichiers dans `assets/img/gallery/` et `assets/img/team/`, puis remplacer les emplacements marqués `<!-- TODO -->`/`ph-label` dans `index.html` (section "L'adresse" et section "Galerie") par de vraies balises `<img>`. Les blocs actuels sont des emplacements stylisés, pas de fausses photos.
2. **Réservation en ligne** — j'ai mis en avant l'appel téléphonique (100% fonctionnel dès maintenant : `tel:+3225381207`) et l'e-mail. Pour réintégrer votre widget Zenchef (ou équivalent), collez son code d'intégration dans l'emplacement marqué `widget-slot` de la section Réservation.
3. **Facebook** — le nom de votre page ("La Vigne Restaurant") est connu mais pas son URL exacte ; à compléter dans la barre du haut et le footer (actuellement `href="#"`).
4. **E-mail de contact** — j'ai gardé `nc-invest@outlook.com` (celui du site actuel), mais il ressemble à une adresse interne/investisseur plutôt qu'à un contact client. Je recommande une adresse dédiée type `info@la-vigne.be` ou `reservation@la-vigne.be` si vous en avez une.
5. **Image de partage réseaux sociaux (Open Graph)** — prévoir une image 1200×630px, puis décommenter la ligne `og:image` dans le `<head>` de `index.html`.
6. **Mise à jour future de la carte** — si les plats ou les prix changent, éditez les listes dans `tools/build_menu_pdf.py` puis, depuis le dossier `tools/`, lancez `pip install reportlab && python3 build_menu_pdf.py` pour régénérer `assets/carte-la-vigne.pdf`. Pensez aussi à mettre à jour les prix affichés directement dans `index.html`.

## Structure des fichiers

```
la-vigne-nouveau-site/
├── index.html          page unique (toutes les sections)
├── css/style.css        styles
├── js/main.js            interactions (menu mobile, statut ouvert/fermé, animations)
└── assets/img/
    ├── gallery/          → vos photos de galerie
    └── team/              → photo(s) d'équipe / salle
```
