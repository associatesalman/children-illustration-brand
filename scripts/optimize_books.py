"""Export web copies of the book covers in public/illustration books into src/assets/books.

Each cover is saved at its own width and, when wider than 220px, at 220px for small
screens. Duplicates and the one adult title are skipped (see SKIPPED).

Usage: python scripts/optimize_books.py <project root>
"""
import sys
from pathlib import Path
from PIL import Image

# Amazon image ID (start of the file name) -> slug used in src/content/books.ts.
COVERS = {
    '31SZQiR+GZS': 'o-pequeno-principe',
    '415mVQARnbL': 'le-avventure-di-pinocchio',
    '41J-b-Ezw1L': 'a-tail-of-twirls',
    '41JqtqtfR9L': 'les-contraires',
    '41KTG6EnvuL': 'italian-short-stories-for-beginners',
    '41NZG67ZrpL': 'mateo-aprende-a-orar',
    '41OYwBzWstL': 'naciste-para-brillar',
    '41OmYqo0leL': 'eres-un-chico-fantastico',
    '41RiX2q1fBL': 'blanco-y-negro',
    '41SvaAhbp0L': 'je-peux-dire-oui-et-je-peux-aussi-dire-non',
    '41WFm8e0gVL': 'la-bible-pour-les-enfants',
    '41ZtbFQfakL': 'eres-una-chica-maravillosa',
    '41fFI7MU4vL': 'la-magia-del-futbol',
    '41hN89OPWcL': 'honesty-is-my-superpower',
    '41pmSOTDnXL': 'tu-puedes',
    '41rzMatjm6L': 'el-principito',
    '41urCJjeGIL': 'learn-french-with-short-stories',
    '41vCWAWIurL': 'el-ladron-de-mis-recuerdos',
    '41zXtTv4IBL': 'barzellette-per-bambini',
    '51-8nwB1AqL': 'activites-et-jeux-educatifs-maternelle',
    '51-Hrube1WL': 'my-first-italian-book',
    '51023DjKlUL': 'mystere-au-college',
    '512ARoBqPkL': 'le-secret-de-la-cabane-interdite',
    '512WNFwYHKL': 'premieres-lectures-les-sons',
    '515Sy8qExzL': 'le-avventure-di-pinocchio-storia-di-un-burattino',
    '517YsHHOKaL': 'apprendre-a-lire-methode-syllabique',
    '51De3y66KXL': 'brainrot-coloring-book',
    '51ILqZ-rmtL': 'favole-per-bambini',
    '51IUCvBMwWL': 'captivating-stories-for-curious-kids',
    '51JdDDpX8fL': 'brainrot-coloring-book-viral-meme-edition',
    '51LSwmyshRL': 'corazon',
    '51MK2rUnRpL': 'my-first-100-words-portuguese-english',
    '51NHdArV8NL': '100000-whys',
    '51PnZjngleL': '100000-whys-for-teens',
    '51QdUGrMQ-L': 'mon-premier-livre-de-lecture-cp',
    '51SHoY+-XOL': 'the-marigold-road',
    '51TowwnaORL': 'raising-children-street-smart',
    '51Wo1e93JgL': 'great-grandma-loves-me',
    '51YTpYgTzrL': 'apprendre-a-lire-le-son-des-lettres',
    '51aGvPnDpIL': 'mon-cahier-d-activites',
    '51ctkg-uQDL': 'le-livre-des-enfants-curieux',
    '51ftYr+QVXL': 'christmas-coloring-book-for-kids',
    '51iFjblOWBL': 'freddie-the-farting-snowman',
    '51k2kpWo3LL': 'i-tre-moschettieri',
    '51kSxhijhNL': 'pebbles-and-the-biggest-number',
    '51nlSgfnsVL': 'fiabe-per-bambini',
    '51qwqhScmsL': 'cahier-d-ecriture-cursive',
    '51r0ZOKv87L': 'coinces-dans-une-partie-d-echecs',
    '51sIUiEH+IL': 'mi-primer-libro-de-colorear',
    '51ypO68b6UL': 'tom-veut-etre-messi',
    '61I94hyJO9L': 'tienes-9-anos-y-eres-maravillosa',
    '61KO3ZxvQlL': 'the-secret-jobs-of-christmas-creatures',
    '711CIGoJvML': 'il-misterioso-ladro-di-zucche',
    '717K0Kj9g5L': 'paciencia',
    '71V5IUbkaAL._SY385_.jpg': 'donde-esta-venezuela',
    '71ejFKrRkHL': 'favole-sbagliate',
    '71m5N-szb4L': 'my-first-1000-words-greek',
}

SKIPPED = {
    '61FTKzyYhtL': 'duplicate of 41J-b-Ezw1L (A Tail of Twirls)',
    '71V5IUbkaAL._SY385_ (1)': 'byte-identical copy of 71V5IUbkaAL._SY385_.jpg',
    '41AihqAzxkL': 'The Owner & the Wife: an adult novel, not a children’s book',
}

root = Path(sys.argv[1])
src, out = root / 'public/illustration books', root / 'src/assets/books'
out.mkdir(parents=True, exist_ok=True)
used, skipped = set(), set()

for file in sorted(src.iterdir()):
    key = next((k for k in COVERS if file.name.startswith(k) and (k.endswith('.jpg') or '.' not in k)), None)
    if file.name.startswith('71V5IUbkaAL') and '(1)' in file.name:
        key = None
    if key is None:
        skipped.add(file.name)
        continue
    slug = COVERS[key]
    im = Image.open(file).convert('RGB')
    im.save(out / f'{slug}.webp', 'WEBP', quality=86, method=6)
    if im.width > 220:
        small = im.resize((220, round(im.height * 220 / im.width)), Image.LANCZOS)
        small.save(out / f'{slug}-220.webp', 'WEBP', quality=84, method=6)
    used.add(slug)
    print(f"{slug} {im.width} {im.height}")

print('covers', len(used), 'skipped', sorted(skipped))
assert len(used) == len(COVERS), set(COVERS.values()) - used
