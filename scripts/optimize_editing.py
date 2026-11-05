"""Build web copies of the Editing & Proofreading page artwork (with Formatting & Layout).

Usage: python scripts/optimize_editing.py <project root>

The supplied files are never modified. Output goes to src/assets/editing/.

Sources:
- public/editing and proofreading/
    hero mockup.png                            -> hero ("Before & After Book Editing", shown whole)
    editing and proofreading sample image.jpg  -> before/after FORMATTING of one chapter page ("I'm a Survivor!")
    book layout design.jpg                     -> six chapter-book interior spreads (chapter openers)
    book layout design -2.jpg                  -> text-heavy interior spreads with drop caps and line art
- public/Childrens Brand Replica (4).docx, only the images under its "Editing & Proofreading" and
  "Formatting & Layout Design" parts (text panels such as image5, image9, image8, image13 and image26
  are rebuilt as page text, not shown as pictures):
    image20  proofreading tablet mockup ("Chapter One", editor notes)
    image22 / image11  Chapter One "Milo and the Moon", before / after
    image15 / image12  Chapter Two "The Dragon Who Sneezed", before / after
    image23 / image19  Chapter Three "Maisie's Missing Mittens", before / after
    image30  "Together Is Home" in print and on an e-reader
    image28  otter picture-book spread (transparent background kept)
    image18  "Pastures" full-bleed spread (transparent background kept)
    image16  activity-book spread ("Build the Jars")
    image24  two picture-book spreads with drop caps (Old Shu)
    image14  flat lay of a dog picture book's pages (dedication, chapter titles)
"""
import io, sys, zipfile
from pathlib import Path
from PIL import Image

root = Path(sys.argv[1])
src = root / 'public/editing and proofreading'
docx = zipfile.ZipFile(root / 'public/Childrens Brand Replica (4).docx')
out = root / 'src/assets/editing'
out.mkdir(parents=True, exist_ok=True)
for old in out.iterdir():  # start clean so renamed outputs never linger
    old.unlink()


def webp(im, name, widths, q=84):
    written = []
    for w in widths:
        w = min(w, im.width)
        if written and w == written[-1][0]:
            continue
        copy = im if w == im.width else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        copy.save(out / f'{name}-{w}.webp', 'WEBP', quality=q, method=6)
        written.append(copy.size)
    print(name, written)


def doc(n, mode='RGB'):
    return Image.open(io.BytesIO(docx.read(f'word/media/image{n}.png'))).convert(mode)


webp(Image.open(src / 'hero mockup.png').convert('RGB'), 'hero-before-after', (960, 1672), q=82)
webp(Image.open(src / 'editing and proofreading sample image.jpg').convert('RGB'), 'formatting-before-after', (640, 1080))
webp(Image.open(src / 'book layout design.jpg').convert('RGB'), 'chapter-book-spreads', (680,))
webp(Image.open(src / 'book layout design -2.jpg').convert('RGB'), 'text-interior-spreads', (480, 750))

webp(doc(20), 'proofreading-tablet', (640, 1254))
for n, name in [(22, 'ch1-before'), (11, 'ch1-after'), (15, 'ch2-before'), (12, 'ch2-after'), (23, 'ch3-before'), (19, 'ch3-after')]:
    webp(doc(n), name, (420, 760), q=82)

webp(doc(30), 'print-and-ebook', (720, 1448))
webp(doc(28, 'RGBA'), 'otter-spread', (720, 1530))
webp(doc(18, 'RGBA'), 'pastures-spread', (720, 1536))
webp(doc(16), 'activity-spread', (720, 1448))
webp(doc(24), 'drop-cap-spreads', (640, 1200))
webp(doc(14), 'dog-book-pages', (720, 1448))
