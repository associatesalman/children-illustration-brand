"""Build web copies of the Book Publishing & Distribution page artwork.

Usage: python scripts/optimize_publishing.py <project root>

The supplied files are never modified. Output goes to src/assets/publishing/.

Sources:
- public/book publication and distribution/hero mokcup.png: the hero (a library wall with a lit doorway,
  replaced on 2026-11-06 with a 1671x941 version that shows children's book covers on the shelves). Only resized.
- public/book publication and distribution/process mockup.png: the nine-step publishing chart. Shown whole
  and kept large and sharp so its labels stay legible.
- public/about-mockups/mockup3 illustratiion.jpg: a printed picture book, cover and two spreads, used
  beside the publishing introduction.
- The platform-logo reference (image1.png inside public/Childrens Brand Replica (4).docx): a strip of
  logos on light blue. Barnes & Noble and hoopla are cut out with the backdrop removed. Nothing else is
  taken from the document. Not used from the strip: Goodreads (reviews, not a store), Book Depository
  (closed in 2023), Pearson (a publisher, not a store), Smashwords (now part of Draft2Digital) and ACX
  (audiobooks).
"""
import io, sys, zipfile
from pathlib import Path
from PIL import Image

root = Path(sys.argv[1])
src = root / 'public/book publication and distribution'
docx = zipfile.ZipFile(root / 'public/Childrens Brand Replica (4).docx')
out = root / 'src/assets/publishing'
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


webp(Image.open(src / 'hero mokcup.png').convert('RGB'), 'hero-library', (960, 1671), q=82)
webp(Image.open(src / 'process mockup.png').convert('RGB'), 'process-chart', (640, 941), q=90)
# Introduction section: a printed picture book (cover and two open spreads) on white. The last 4 px are a
# grey border line on the right edge of the white backdrop; trimming them lets the image sit seamlessly on white.
book = Image.open(root / 'public/about-mockups/mockup3 illustratiion.jpg').convert('RGB')
webp(book.crop((0, 0, book.width - 4, book.height)), 'printed-picture-book', (640, 1195), q=84)

# ---------------------------------------------------------------- logos: remove the flat light-blue backdrop
strip = Image.open(io.BytesIO(docx.read('word/media/image1.png'))).convert('RGB')
bg = strip.getpixel((5, 5))
logos = {'barnes-noble': (318, 0, 428, 97), 'hoopla': (875, 0, 980, 97)}
for name, box in logos.items():
    part = strip.crop(box)
    rgba = Image.new('RGBA', part.size)
    px = []
    raw = part.tobytes()
    for r, g, b in zip(raw[0::3], raw[1::3], raw[2::3]):
        # Alpha from the distance to the backdrop color, then un-mix the backdrop from the edge pixels.
        a = max(abs(r - bg[0]), abs(g - bg[1]), abs(b - bg[2])) / 255
        a = min(1.0, a * 2.2)
        if a < 0.06:
            px.append((0, 0, 0, 0))
            continue
        un = [round(max(0, min(255, (c - (1 - a) * k) / a))) for c, k in zip((r, g, b), bg)]
        px.append((*un, round(a * 255)))
    rgba.putdata(px)
    rgba = rgba.crop(rgba.getbbox())
    rgba.save(out / f'logo-{name}.png', optimize=True)
    print('logo', name, rgba.size)
