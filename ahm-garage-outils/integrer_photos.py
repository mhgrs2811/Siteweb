#!/usr/bin/env python3
"""Intègre les vraies photos du garage dans le site AHM Garage.

Usage :
    python3 ahm-garage-outils/integrer_photos.py DOSSIER_PHOTOS [--site ahm-garage] [--dry-run]

DOSSIER_PHOTOS contient une photo par emplacement, nommée d'après lui
(extension libre : .jpg, .jpeg, .png, .webp, .heic) :
    atelier       haut de page (image de fond)
    poids-lourd   section « Pourquoi AHM », grande photo
    mecanicien    section « Pourquoi AHM », petite photo
    depanneuse    section Dépannage 24/7 (image de fond)

Facultatif : un fichier photos.json dans le même dossier, pour les textes
alternatifs (NL et FR) et le cadrage horizontal (0 = gauche, 1 = droite) :
    {"atelier": {"alt_nl": "...", "alt_fr": "...", "focus_x": 0.4}}

Pour chaque photo trouvée, le script :
- redresse la photo selon son orientation et supprime ses métadonnées (GPS compris) ;
- la recadre au format de son cadre et la décline en plusieurs largeurs, en WebP et en JPEG,
  dans <site>/photos/ ;
- remplace l'image Unsplash correspondante dans index.html par ces fichiers.
Quand plus aucune image ne vient d'Unsplash, il retire aussi les préconnexions
vers Unsplash et la mention d'Unsplash dans la notice vie privée (NL et FR).

Le script peut être relancé : il remplace les fichiers et le balisage précédents.
"""

import argparse
import html
import json
import re
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow est requis : pip install Pillow")

try:
    import pillow_heif
    pillow_heif.register_heif_opener()
    HEIF_OK = True
except ImportError:
    HEIF_OK = False

# Emplacements : largeurs générées, format du cadre (largeur / hauteur, None = plein écran
# sans recadrage), clé de texte alternatif dans le dictionnaire, attribut sizes.
SLOTS = {
    'atelier': {
        'widths': [960, 1440, 1920], 'aspect': None, 'alt_key': 'hero.img.alt',
        'sizes': '(max-aspect-ratio: 1/1) 180vh, 100vw',
    },
    'poids-lourd': {
        'widths': [600, 1100], 'aspect': 0.8 / 1.24, 'alt_key': 'why.img1.alt',
        'sizes': '(max-width:1024px) 90vw, 45vw',
    },
    'mecanicien': {
        'widths': [400, 800], 'aspect': 1 / 1.24, 'alt_key': 'why.img2.alt',
        'sizes': '(max-width:1024px) 45vw, 22vw',
    },
    'depanneuse': {
        'widths': [960, 1440, 1920], 'aspect': None, 'alt_key': 'tow.img.alt',
        'sizes': '(max-aspect-ratio: 1/1) 190vh, 100vw',
    },
}
EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif']
WEBP_QUALITY = 72
JPEG_QUALITY = 78


def find_photo(folder, slot):
    for ext in EXTENSIONS:
        for name in (slot + ext, slot + ext.upper()):
            path = folder / name
            if path.is_file():
                return path
    return None


def load_rgb(path):
    if path.suffix.lower() in ('.heic', '.heif') and not HEIF_OK:
        sys.exit(f"{path.name} : format HEIC non pris en charge ici. "
                 "Installez pillow-heif (pip install pillow-heif) ou convertissez la photo en JPEG.")
    img = Image.open(path)
    img = ImageOps.exif_transpose(img)
    if img.mode in ('RGBA', 'LA', 'P'):
        img = img.convert('RGBA')
        background = Image.new('RGB', img.size, (10, 10, 10))
        background.paste(img, mask=img.split()[-1])
        return background
    return img.convert('RGB')


def crop_to_aspect(img, aspect, focus_x):
    w, h = img.size
    if aspect is None or abs(w / h - aspect) < 0.01:
        return img
    if w / h > aspect:
        new_w = round(h * aspect)
        left = round((w - new_w) * focus_x)
        return img.crop((left, 0, left + new_w, h))
    new_h = round(w / aspect)
    top = round((h - new_h) / 2)
    return img.crop((0, top, w, top + new_h))


def export(img, slot, widths, out_dir, dry_run):
    """Écrit les variantes et renvoie [(largeur, hauteur), ...] effectivement produites."""
    produced = []
    for target in widths:
        width = min(target, img.width)
        if produced and produced[-1][0] == width:
            continue
        height = round(img.height * width / img.width)
        if not dry_run:
            resized = img.resize((width, height), Image.LANCZOS) if width != img.width else img
            resized.save(out_dir / f'{slot}-{width}.webp', 'WEBP', quality=WEBP_QUALITY, method=6)
            resized.save(out_dir / f'{slot}-{width}.jpg', 'JPEG', quality=JPEG_QUALITY,
                         optimize=True, progressive=True)
        produced.append((width, height))
    return produced


def parse_attrs(tag):
    """[(nom, valeur ou None pour un attribut sans valeur), ...] d'une balise <img>."""
    body = tag[len('<img'):].rstrip('>')
    return [(name, html.unescape(raw[2:-1]) if raw else None)
            for name, raw in re.findall(r'([\w:-]+)(="[^"]*")?', body)]


def attr_text(name, value):
    if value is None:
        return name
    return f'{name}="' + value.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;') + '"'


def build_picture(old_img_tag, slot, variants, sizes, alt_nl, focus_x, aspect):
    attrs = []
    for name, value in parse_attrs(old_img_tag):
        if name in ('src', 'srcset', 'sizes', 'width', 'height', 'style'):
            continue
        if name == 'alt' and alt_nl:
            value = alt_nl
        attrs.append((name, value))
    big_w, big_h = variants[-1]
    jpg_set = ', '.join(f'photos/{slot}-{w}.jpg {w}w' for w, _ in variants)
    webp_set = ', '.join(f'photos/{slot}-{w}.webp {w}w' for w, _ in variants)
    extra = [('src', f'photos/{slot}-{big_w}.jpg'), ('srcset', jpg_set), ('sizes', sizes),
             ('width', str(big_w)), ('height', str(big_h))]
    if aspect is None and focus_x is not None and abs(float(focus_x) - 0.5) > 0.01:
        extra.append(('style', f'object-position: {round(float(focus_x) * 100)}% 50%'))
    img_tag = '<img ' + ' '.join(attr_text(n, v) for n, v in attrs[:1] + extra + attrs[1:]) + '>'
    return (f'<picture data-photo-wrap="{slot}"><source type="image/webp" srcset="{webp_set}" '
            f'sizes="{sizes}">{img_tag}</picture>')


def set_dict_value(source, key, value, occurrence):
    """Remplace la valeur de la clé `key` dans le dictionnaire NL (occurrence 0) ou FR (1)."""
    value = value.replace('\\', '').replace("'", '’')
    pattern = re.compile(r"(^\s*'" + re.escape(key) + r"': ')(.*?)(',?\s*$)", re.M)
    matches = list(pattern.finditer(source))
    if len(matches) != 2:
        sys.exit(f"Clé {key} introuvable dans les deux dictionnaires ({len(matches)} trouvée(s)).")
    m = matches[occurrence]
    return source[:m.start(2)] + value + source[m.end(2):]


def main():
    parser = argparse.ArgumentParser(description="Intègre les photos du garage dans le site.")
    parser.add_argument('photos', type=Path, help="dossier contenant atelier.jpg, poids-lourd.jpg, …")
    parser.add_argument('--site', type=Path, default=Path(__file__).resolve().parent.parent / 'ahm-garage',
                        help="dossier du site (contient index.html)")
    parser.add_argument('--dry-run', action='store_true', help="affiche ce qui serait fait, sans rien écrire")
    args = parser.parse_args()

    index = args.site / 'index.html'
    if not index.is_file():
        sys.exit(f"index.html introuvable dans {args.site}")
    if not args.photos.is_dir():
        sys.exit(f"Dossier de photos introuvable : {args.photos}")
    meta = {}
    meta_file = args.photos / 'photos.json'
    if meta_file.is_file():
        meta = json.loads(meta_file.read_text(encoding='utf-8'))

    source = index.read_text(encoding='utf-8')
    out_dir = args.site / 'photos'
    if not args.dry_run:
        out_dir.mkdir(exist_ok=True)

    done = []
    for slot, cfg in SLOTS.items():
        path = find_photo(args.photos, slot)
        if not path:
            print(f"- {slot} : aucune photo, emplacement inchangé")
            continue
        info = meta.get(slot, {})
        focus_x = float(info.get('focus_x', 0.5))
        img = load_rgb(path)
        original = img.size
        img = crop_to_aspect(img, cfg['aspect'], focus_x)
        if img.width < cfg['widths'][-1]:
            print(f"  attention : {path.name} fait {img.width} px de large après recadrage, "
                  f"moins que les {cfg['widths'][-1]} px prévus : risque de flou sur grand écran.")
        variants = export(img, slot, cfg['widths'], out_dir, args.dry_run)

        wrap = re.compile(r'<picture data-photo-wrap="' + re.escape(slot) + r'">.*?</picture>', re.S)
        bare = re.compile(r'<img\b[^>]*\bdata-photo="' + re.escape(slot) + r'"[^>]*>', re.S)
        existing = wrap.search(source) or bare.search(source)
        if not existing:
            sys.exit(f"Emplacement {slot} introuvable dans index.html (attribut data-photo manquant).")
        old_img = bare.search(existing.group(0)).group(0)
        picture = build_picture(old_img, slot, variants, cfg['sizes'], info.get('alt_nl'),
                                info.get('focus_x'), cfg['aspect'])
        source = source[:existing.start()] + picture + source[existing.end():]
        if info.get('alt_nl'):
            source = set_dict_value(source, cfg['alt_key'], info['alt_nl'], 0)
        if info.get('alt_fr'):
            source = set_dict_value(source, cfg['alt_key'], info['alt_fr'], 1)
        sizes_txt = ', '.join(f'{w}×{h}' for w, h in variants)
        print(f"- {slot} : {path.name} ({original[0]}×{original[1]}) → {sizes_txt}")
        done.append(slot)

    if 'atelier' in done:
        big = SLOTS['atelier']['widths'][-1]
        webp_set = re.search(r'<picture data-photo-wrap="atelier"><source type="image/webp" srcset="([^"]+)"', source).group(1)
        largest = webp_set.split(', ')[-1].split(' ')[0]
        preload = (f'<link rel="preload" as="image" type="image/webp" href="{largest}" '
                   f'imagesrcset="{webp_set}" imagesizes="{SLOTS["atelier"]["sizes"]}">')
        source, n = re.subn(r'<link rel="preload" as="image"[^>]*>', preload, source, count=1)
        if not n:
            print(f"  (pas de préchargement trouvé pour l'image du haut de page, {big} px)")

    if not re.search(r'\b(src|srcset|imagesrcset)="https://(images\.)?unsplash\.com', source):
        source = re.sub(r'<link rel="preconnect" href="https://(images\.)?unsplash\.com">\n', '', source)
        source, n_html = re.subn(r'\s*<p><strong data-i18n="privacy\.ext\.k">.*?</p>', '', source, flags=re.S)
        source, n_dict = re.subn(r"^\s*'privacy\.ext\.[kd]': .*\n", '', source, flags=re.M)
        if n_html or n_dict:
            print("- notice vie privée : mention d'Unsplash retirée (NL et FR)")
    else:
        print("- des images viennent encore d'Unsplash : notice vie privée inchangée")

    missing_alt = [s for s in done if not meta.get(s, {}).get('alt_nl') or not meta.get(s, {}).get('alt_fr')]
    if missing_alt:
        print("  à vérifier : textes alternatifs NL/FR non fournis pour " + ', '.join(missing_alt) +
              " (photos.json) ; ils décrivent encore les photos Unsplash.")

    if args.dry_run:
        print("Simulation : aucun fichier écrit.")
    else:
        index.write_text(source, encoding='utf-8')
        print(f"index.html mis à jour ; photos dans {out_dir}")


if __name__ == '__main__':
    main()
