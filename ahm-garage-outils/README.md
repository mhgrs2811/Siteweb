# Outils du site AHM Garage

Ce dossier ne se met pas en ligne : seul le dossier `ahm-garage/` va chez l'hébergeur.

## Intégrer les photos du garage

1. Placer les photos dans un dossier, une par emplacement, nommées ainsi (extension libre : jpg, png, webp, heic) :

   | Fichier | Emplacement sur le site |
   | --- | --- |
   | `atelier.jpg` | Haut de page, image de fond |
   | `poids-lourd.jpg` | Section « Pourquoi AHM », grande photo |
   | `mecanicien.jpg` | Section « Pourquoi AHM », petite photo |
   | `depanneuse.jpg` | Section Dépannage 24/7, image de fond |

   Il n'est pas nécessaire de toutes les avoir : les emplacements sans photo restent inchangés.

2. Facultatif mais recommandé : un fichier `photos.json` dans le même dossier, avec le texte alternatif de chaque photo en néerlandais et en français, et le cadrage horizontal si le sujet n'est pas au centre (0 = gauche, 1 = droite) :

   ```json
   {
     "atelier": {"alt_nl": "Werkplaats van AHM Garage met een bestelwagen op de hefbrug",
                 "alt_fr": "L'atelier d'AHM Garage avec une camionnette sur le pont"},
     "poids-lourd": {"alt_nl": "…", "alt_fr": "…", "focus_x": 0.3}
   }
   ```

3. Lancer depuis la racine du dépôt (Python 3 et Pillow requis ; `pip install pillow-heif` pour les photos HEIC d'iPhone) :

   ```sh
   python3 ahm-garage-outils/integrer_photos.py chemin/vers/photos --dry-run   # simulation
   python3 ahm-garage-outils/integrer_photos.py chemin/vers/photos
   ```

Le script redresse les photos, supprime leurs métadonnées (dont la position GPS), les recadre au format de leur cadre, les décline en WebP et JPEG dans `ahm-garage/photos/` et met à jour `index.html`. Quand plus aucune image ne vient d'Unsplash, il retire aussi la mention d'Unsplash de la notice vie privée. Il peut être relancé autant de fois que nécessaire.

Après l'intégration, le dossier à mettre en ligne contient `index.html`, `og-image.jpg`, `robots.txt`, `sitemap.xml` et le dossier `photos/`.
