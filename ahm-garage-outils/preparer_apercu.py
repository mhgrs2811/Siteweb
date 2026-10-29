#!/usr/bin/env python3
"""Prépare une version d'aperçu du site AHM Garage, à mettre en ligne sur une adresse provisoire.

Usage :
    python3 ahm-garage-outils/preparer_apercu.py [--url https://adresse-provisoire/] [--site ahm-garage] [--sortie DOSSIER]

L'aperçu est identique au site, sauf qu'il ne doit pas apparaître dans les moteurs de recherche :
- la balise <meta name="robots"> passe à « noindex, nofollow » ;
- un fichier _headers ajoute l'en-tête X-Robots-Tag: noindex, nofollow (pris en compte par
  Netlify et Cloudflare Pages, ignoré ailleurs) ;
- robots.txt et sitemap.xml ne sont pas copiés : ils annoncent l'adresse définitive. Pas de
  « Disallow » non plus : un robot bloqué ne lit pas la consigne noindex et pourrait référencer
  l'adresse quand même.
Avec --url, les balises de partage (og:url, og:image, twitter:image) pointent vers l'adresse
provisoire, pour que la vignette s'affiche quand on envoie le lien (WhatsApp, Facebook…).

Le résultat est un dossier <sortie>/ahm-garage-apercu/ et une archive <sortie>/ahm-garage-apercu.zip.
"""

import argparse
import re
import shutil
import sys
import zipfile
from pathlib import Path

NOM = 'ahm-garage-apercu'
EXCLUS = {'robots.txt', 'sitemap.xml'}
DOMAINE = 'https://ahmgarage.be/'
HEADERS = '/*\n  X-Robots-Tag: noindex, nofollow\n'


def main():
    outils = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser(description="Prépare une version d'aperçu non indexée du site.")
    parser.add_argument('--url', help="adresse provisoire (ex. https://ahm-garage-apercu.netlify.app/)")
    parser.add_argument('--site', type=Path, default=outils.parent / 'ahm-garage',
                        help="dossier du site (contient index.html)")
    parser.add_argument('--sortie', type=Path, default=outils / 'apercu',
                        help="dossier où écrire l'aperçu et l'archive")
    args = parser.parse_args()

    site = args.site.resolve()
    index = site / 'index.html'
    if not index.is_file():
        sys.exit(f"index.html introuvable dans {site}")
    url = args.url
    if url:
        if not re.match(r'https://[^/\s]+\.[^/\s]+', url):
            sys.exit(f"Adresse invalide : {url} (attendu : https://nom.domaine/)")
        url = url.rstrip('/') + '/'

    source = index.read_text(encoding='utf-8')
    source, n = re.subn(r'<meta name="robots" content="[^"]*">',
                        '<meta name="robots" content="noindex, nofollow">', source)
    if n != 1:
        sys.exit(f"Balise <meta name=\"robots\"> attendue une fois dans index.html, trouvée {n} fois.")
    if url:
        for prop in ('property="og:url"', 'property="og:image"', 'name="twitter:image"'):
            source, n = re.subn(r'(<meta ' + prop + r' content=")' + re.escape(DOMAINE),
                                lambda m: m.group(1) + url, source)
            if n != 1:
                sys.exit(f"Balise <meta {prop}> pointant vers {DOMAINE} introuvable dans index.html.")

    dossier = args.sortie / NOM
    if dossier.exists():
        shutil.rmtree(dossier)
    shutil.copytree(site, dossier, ignore=lambda d, noms: EXCLUS & set(noms) if Path(d) == site else set())
    (dossier / 'index.html').write_text(source, encoding='utf-8')
    (dossier / '_headers').write_text(HEADERS, encoding='utf-8')

    archive = args.sortie / f'{NOM}.zip'
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
        for fichier in sorted(dossier.rglob('*')):
            if fichier.is_file():
                z.write(fichier, Path(NOM) / fichier.relative_to(dossier))

    fichiers = sorted(str(f.relative_to(dossier)) for f in dossier.rglob('*') if f.is_file())
    print(f"- aperçu : {dossier} ({', '.join(fichiers)})")
    print(f"- archive : {archive} ({archive.stat().st_size // 1024} Ko)")
    print("- indexation : noindex, nofollow (balise meta et _headers) ; robots.txt et sitemap.xml non copiés")
    if url:
        print(f"- vignette de partage : {url}og-image.jpg")
    else:
        print("  sans --url, la vignette de partage pointe vers " + DOMAINE +
              " : elle ne s'affichera qu'une fois ce domaine en ligne.")


if __name__ == '__main__':
    main()
