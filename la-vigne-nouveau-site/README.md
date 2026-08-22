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

## À compléter avant publication (obligatoire)

Je n'ai pas accès à internet depuis mon environnement de travail, donc je n'ai pas pu récupérer vos vraies photos ni le contenu exact de votre PDF de carte. Tout est prêt à recevoir vos éléments réels :

1. **Photos** — déposer vos fichiers dans `assets/img/gallery/` et `assets/img/team/`, puis remplacer les emplacements marqués `<!-- TODO -->`/`ph-label` dans `index.html` (section "L'adresse" et section "Galerie") par de vraies balises `<img>`. Les blocs actuels sont des emplacements stylisés, pas de fausses photos.
2. **Carte / menu réel** — les plats affichés (côte de bœuf, poisson du jour, salade grecque…) sont des exemples représentatifs de votre concept, **sans prix inventés**. Remplacez-les par vos plats et prix réels, ou envoyez-les-moi et je les intègre.
3. **Lien vers le PDF de la carte** — le bouton "Télécharger la carte (PDF)" pointe vers `#` (placeholder), à remplacer par l'URL réelle.
4. **Réservation en ligne** — j'ai mis en avant l'appel téléphonique (100% fonctionnel dès maintenant : `tel:+3225381207`) et l'e-mail. Pour réintégrer votre widget Zenchef (ou équivalent), collez son code d'intégration dans l'emplacement marqué `widget-slot` de la section Réservation.
5. **Réseaux sociaux** — les icônes TripAdvisor / Instagram / Facebook pointent vers `#`, à remplacer par vos vraies URLs (barre du haut + footer).
6. **E-mail de contact** — j'ai gardé `nc-invest@outlook.com` (celui du site actuel), mais il ressemble à une adresse interne/investisseur plutôt qu'à un contact client. Je recommande une adresse dédiée type `info@la-vigne.be` ou `reservation@la-vigne.be` si vous en avez une.
7. **Image de partage réseaux sociaux (Open Graph)** — prévoir une image 1200×630px, puis décommenter la ligne `og:image` dans le `<head>` de `index.html`.

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
