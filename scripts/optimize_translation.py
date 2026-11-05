"""Build web copies of the Children's Book Translation page media.

Usage: python scripts/optimize_translation.py <project root> <path to ffmpeg>

Everything in public/children book translation/ is left unchanged; covers are read straight out of the
three supplied zip archives. Output goes to src/assets/translation/.

- children book hero mockup.png (1672x941): the hero, resized only.
- mokcup -2.jpg (736x1104): three spreads of a bear-and-mouse picture book, used beside the service copy.
- children book video.mp4 (720x1280, 23 s, 2.3 Mb/s, with audio): Dutch picture books ("Wens", "Samen")
  paged through by hand. Re-encoded at 540x960 without audio (shown at most ~26 rem wide); the available
  ffmpeg build only has hardware/MediaFoundation H.264 encoders, so h264_mf at a fixed bitrate is used.
- Covers: every file in "children book.zip" (3) and "best seller (1).zip" (5), and 60 of the 111 files in
  "book.zip". Covers are resized to at most 466 px tall (only one, a 1500 px file, is larger) and saved as
  WebP. No trimming: the only covers with white edges are white-background designs whose white belongs
  to the cover.

Not used from book.zip: four copies of "Book of Wisdom" (61JOtvhplmL x3 and 41TI60qP1QL) and a second
copy of "Simplicidad" (41-bAV2sB1L / 616ZR4HrEgL), plus covers unsuitable for a children's-book studio
(nudity, an adult novelty title, occult imagery, graphic thrillers, political pamphlets) and the rest
beyond the 60 required.
"""
import io, subprocess, sys, tempfile, zipfile
from pathlib import Path
from PIL import Image

root, ffmpeg = Path(sys.argv[1]), sys.argv[2]
src = root / 'public/children book translation'
out = root / 'src/assets/translation'
books_out = out / 'books'
books_out.mkdir(parents=True, exist_ok=True)
for folder in (out, books_out):
    for old in folder.iterdir():
        if old.is_file():
            old.unlink()

CHILDREN = {
    '51lDzNRlzzL._SX342_SY445_FMwebp_.webp': 'paciencia',
    '61GVaw9boJL._SY425_.jpg': 'eres-una-chica-maravillosa',
    '61Ky3cDmteL._SY425_.jpg': 'eres-un-chico-fantastico',
}
BESTSELLERS = {
    '41Adgazu1bL._SY445_SX342_FMwebp_.webp': '40-dias-de-viaje-en-silencio',
    '41otc3uElSL._SY445_SX342_FMwebp_.webp': 'caminando-a-traves-del-duelo',
    '61OsrDjJMZL._SY466_.jpg': 'el-principe-de-maquiavelo',
    '61hq8Z3Pg+L._SY466_.jpg': 'between-heaven-and-earth',
    '71STq-ywePL._SY466_.jpg': 'necesitaba-perderte-para-encontrarme',
}
GENERAL = {
    # English
    '31ZAZPOXYhL._SY445_SX342_FMwebp_.webp': 'les-miserables-high-school-edition',
    '31dtht1GTlL._SX342_SY445_FMwebp_.webp': 'the-stranger',
    '31sBu6iE1AL._SY445_SX342_FMwebp_.webp': 'swanns-way',
    '41+q56VkuSL._SY445_SX342_FMwebp_.webp': '101-conversations-in-simple-italian',
    '415dYo40fkL._SY445_SX342_FMwebp_.webp': 'juliette-and-the-magic-candy-store',
    '41KTG6EnvuL._SY445_SX342_FMwebp_.webp': 'italian-short-stories-for-beginners',
    '41OKJ8kHG8L._SY445_SX342_FMwebp_.webp': 'revelations-of-catalina-on-the-holy-mass',
    '41RqVQee4OL._SY445_SX342_FMwebp_.webp': 'the-zen-monkey-and-the-lotus-flower',
    '41Vf5VFMpLL._SX342_SY445_FMwebp_.webp': 'momma-jackies-traditional-italian-cooking',
    '511+BYAzJzL._SY445_SX342_FMwebp_.webp': 'the-crowd',
    '51G+h70iWZL._SY445_SX342_FMwebp_.webp': 'learn-italian-fast-for-adult-beginners',
    '51ubnPLuC-L._SY445_SX342_FMwebp_.webp': 'italian-short-stories-language-guru',
    '6159aCAbG2L._SY466_.jpg': 'learn-french-with-short-stories',
    '71INvFBSW0L._SY466_.jpg': 'the-millionaire-way',
    '314rkQJY9JL._SY385_.jpg': 'freedom',
    # Spanish
    '31dGXtDW4NL._SY445_SX342_FMwebp_.webp': 'el-viaje-de-quien-se-atrevio-a-cambiar',
    '31gQ6F-xcJL._SY445_SX342_QL70_FMwebp_.webp': 'las-meditaciones-de-marco-aurelio',
    '41P05HZ2HBL._SY445_SX342_FMwebp_.webp': 'imitacion-de-cristo',
    '41L180uAllL._SY445_SX342_FMwebp_.webp': 'el-arte-de-la-guerra',
    '41YEEPAwV6L._SY445_SX342_FMwebp_.webp': 'primero-yo-despues-el-resto',
    '41vCWAWIurL._SY445_SX342_FMwebp_.webp': 'el-ladron-de-mis-recuerdos',
    '41wkHNDEL0L._SY445_SX342_FMwebp_.webp': 'el-castillo-interior',
    '41y4rH2raeL._SY445_SX342_FMwebp_.webp': 'el-poder-de-estar-solo',
    '51Ak1FcPPqL._SY466_.jpg': 'amor-fati',
    '51OezQfa0HL._SY522_.jpg': 'diario-de-un-corazon-sano',
    '51rfYcc8GsL._SY466_.jpg': 'te-sigo-buscando-en-las-estrellas',
    '610zYaxg3qL._SY522_.jpg': 'como-dejar-de-pensar-demasiado',
    '716GZmHnN5L._SY385_.jpg': 'ejercicios-de-memoria-para-personas-mayores',
    '61Lx6NJ2CsL._SY466_.jpg': 'meditaciones-marco-aurelio-en-espanol',
    '61fCFK+qyQL._SY466_.jpg': 'la-taza-de-la-manana',
    '61k4G8yF8PL._SY466_.jpg': 'tu-eres-tu-prioridad',
    '61u8SeD2KcL._SY466_.jpg': 'me-acorde-de-mi',
    '61zEUQyB28L._SY466_.jpg': 'dosis-diaria-de-terapia',
    '71UW+vupnJL._SY466_.jpg': '46-cartas-estoicas',
    '71tmG2xlfaL._SY466_.jpg': 'el-nino-que-dejo-de-ser-un-desastre',
    '81n66ocE-sL._SY466_.jpg': 'noches-blancas',
    '71QzDE+NZ4L._SY466_.jpg': 'deja-de-pensar-demasiado',
    # French
    '41DD2jLp-+L._SY445_SX342_FMwebp_.webp': 'une-si-longue-lettre',
    '512J433PTHL._SY445_SX342_FMwebp_.webp': 'vingt-quatre-heures-de-la-vie-dune-femme',
    '51O-5o6eVZL._SY445_SX342_FMwebp_.webp': 'la-fortune-des-rougon',
    '51fNi3bCs5L._SY425_.jpg': 'le-horla',
    '61UCK6vL5WL._SY466_.jpg': 'letranger',
    '61Ul5tQxzvL._SY466_.jpg': 'le-prince-de-machiavel',
    '71uInYmOiKL._SY385_.jpg': 'cahier-decriture-cursive',
    # Italian
    '415vfKraJYL._SY445_SX342_FMwebp_.webp': 'i-fantasmi-di-sambuca',
    '41tMS1Eft8L._SY445_SX342_FMwebp_.webp': 'il-fu-mattia-pascal',
    '41yuL4ACGWL._SY445_SX342_FMwebp_.webp': 'incontri-in-sicilia',
    '51rM-uzrssL._SY466_.jpg': 'divina-commedia',
    '51u6jqfd6kL._SY466_.jpg': 'iliade',
    '61U6zTdjAiL._SY522_.jpg': 'gioielli-caffe-e-firenze',
    '71D4wk1ECXL._SY385_.jpg': 'i-promessi-sposi',
    '71FrkX5nqmL._SY466_.jpg': 'il-mistero-della-casa-in-sicilia',
    # German
    '51-gV-D7MwL._SY466_.jpg': 'schachnovelle',
    '61LcGOtkXGL._SY466_.jpg': 'der-zauberberg',
    '51Mk0-wu4rL._SY445_SX342_FMwebp_.webp': 'meersalz-zimt-und-kuestenglueck',
    '51Ti5DIWXiL._SX342_SY445_FMwebp_.webp': 'omas-kreuzwortraetsel',
    '61+o5r7JceL._SY522_.jpg': 'der-kleine-roman-fuer-zwischendurch',
    '719+RSDNYKL._SL1500_.jpg': 'das-maedchen-mit-der-goldenen-schere',
    '71FNg0BTNkL._SY342_.jpg': 'slow-cooker-kochbuch',
    '41OKk8mtPGL._SY445_SX342_FMwebp_.webp': 'sylter-briefe',
}
assert len(CHILDREN) == 3 and len(BESTSELLERS) == 5 and len(GENERAL) == 60
slugs = [*CHILDREN.values(), *BESTSELLERS.values(), *GENERAL.values()]
assert len(set(slugs)) == len(slugs), 'duplicate slug'

MAX_H = 466
sizes = {}
for archive, files in (('children book.zip', CHILDREN), ('best seller (1).zip', BESTSELLERS), ('book.zip', GENERAL)):
    with zipfile.ZipFile(src / archive) as z:
        names = set(z.namelist())
        assert names >= set(files), f'{archive}: missing {set(files) - names}'
        if archive != 'book.zip':
            assert names == set(files), f'{archive}: not every file is used: {names - set(files)}'
        for name, slug in files.items():
            im = Image.open(io.BytesIO(z.read(name))).convert('RGB')
            if im.height > MAX_H:
                im = im.resize((round(im.width * MAX_H / im.height), MAX_H), Image.LANCZOS)
            im.save(books_out / f'{slug}.webp', 'WEBP', quality=84, method=6)
            sizes[slug] = im.size
print('covers', len(sizes))
# Sizes for the content file, so every <img> reserves its exact frame.
print({slug: list(size) for slug, size in sizes.items()})


def webp(im, name, widths, q=84):
    for w in widths:
        w = min(w, im.width)
        copy = im if w == im.width else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        copy.save(out / f'{name}-{w}.webp', 'WEBP', quality=q, method=6)
        print(name, copy.size)


webp(Image.open(src / 'children book hero mockup.png').convert('RGB'), 'hero-translating-picture-books', (960, 1672), q=82)
webp(Image.open(src / 'mokcup -2.jpg').convert('RGB'), 'bear-and-mouse-spreads', (480, 736), q=86)

with tempfile.TemporaryDirectory() as tmp:
    video = out / 'dutch-picture-books.mp4'
    subprocess.run([ffmpeg, '-v', 'error', '-y', '-i', str(src / 'children book video.mp4'), '-an',
                    '-vf', 'scale=540:960:flags=lanczos,format=yuv420p', '-c:v', 'h264_mf', '-b:v', '1100k',
                    '-movflags', '+faststart', str(video)], check=True)
    subprocess.run([ffmpeg, '-v', 'error', '-y', '-ss', '5.8', '-i', str(video), '-frames:v', '1',
                    str(Path(tmp) / 'p.png')], check=True)
    Image.open(Path(tmp) / 'p.png').convert('RGB').save(out / 'dutch-picture-books-poster.webp', 'WEBP', quality=78, method=6)
    print('video', video.stat().st_size)
