"""Build web copies of the Storybook Illustration page artwork.

Usage: python scripts/optimize_storybook.py <project root> <path to ffmpeg>

The supplied files are never modified. Output goes to src/assets/storybook/.

Assets were placed by what they show, not by file name:
- "storybook hero -2.jpg" is a presentation of one picture book about a boy with a map. It is cut into
  its parts: the two open-book mockups on painted meadows go to the hero; the bedtime page goes to Scene
  Illustrations. (The sunrise illustration and the map page were used for Full Page Illustrations until
  the brand owner chose their own mockup for that section; they are no longer built.) A small bird sticker from the presentation overlaps the bedtime page's blank top-left
  margin; that corner is filled with the page's own cream color (no artwork is touched).
- "storybook hero -1.jpg" holds three spreads from one book (a girl in a yellow raincoat): the girl by
  the water goes to Scene Illustrations; the interior still life and the autumn village go to Background
  Design.
- "double page spreads -2.jpg" (one illustration flowing across both pages) and "storybook video.mp4"
  (spreads from a square owl-and-bunny picture book) go to Double Page Spreads.
- "full page illustration -1.jpg" (Full Page Illustrations) and "double page spreads video.mp4"
  (Double Page Spreads) were chosen by the brand owner for those sections. Both show published books
  with named creators; see src/assets/artwork/ASSETS.md.

Not used:
- "doubkle page spreads -1.jpg": a magazine article spread about a named mobility brand, not a storybook.
"""
import subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageDraw

root, ffmpeg = Path(sys.argv[1]), sys.argv[2]
src, out = root / 'public/storybook illustration', root / 'src/assets/storybook'
out.mkdir(parents=True, exist_ok=True)
for old in out.iterdir():  # start clean so renamed outputs never linger
    old.unlink()


def webp(im, name, widths=(640, 1200), q=84):
    """Save one WebP per width (never upscaled)."""
    written = []
    for w in widths:
        w = min(w, im.width)
        if written and w == written[-1][0]:
            continue
        copy = im if w == im.width else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        copy.save(out / f'{name}-{w}.webp', 'WEBP', quality=q, method=6)
        written.append(copy.size)
    print(name, written)


def open_rgb(file):
    return Image.open(src / file).convert('RGB')


def run(*args):
    subprocess.run([ffmpeg, '-v', 'error', '-y', *args], check=True)


# ---------------------------------------------------------------- the boy-with-a-map book
miron = open_rgb('storybook hero -2.jpg')
webp(miron.crop((20, 11, 1179, 548)), 'hero-meadow-book', widths=(640, 1159))  # page turning; stops above the sunrise art
webp(miron.crop((20, 1437, 1179, 2037)), 'hero-meadow-spread', widths=(640, 1159))

# ---------------------------------------------------------------- full-page mockup (shown whole)
webp(open_rgb('full page illustration -1.jpg'), 'full-page-mockup', widths=(640, 735), q=86)

bedtime = miron.crop((150, 1022, 594, 1337))
cream = bedtime.getpixel((90, 30))
ImageDraw.Draw(bedtime).rectangle((0, 0, 72, 42), fill=cream)  # bird sticker over the blank margin
webp(bedtime, 'scene-bedtime-page', widths=(444,), q=88)

# ---------------------------------------------------------------- the girl-in-a-raincoat book
yoyo = open_rgb('storybook hero -1.jpg')
webp(yoyo.crop((14, 474, 731, 868)), 'scene-by-the-water', widths=(717,), q=88)
webp(yoyo.crop((14, 33, 731, 427)), 'background-interior', widths=(717,), q=88)
webp(yoyo.crop((123, 914, 622, 1188)), 'background-village', widths=(499,), q=88)

# ---------------------------------------------------------------- spreads
webp(open_rgb('double page spreads -2.jpg'), 'spread-lion-and-peacock', widths=(735,), q=88)

with tempfile.TemporaryDirectory() as tmp:
    tmp = Path(tmp)
    # A 10 s scroll through the book's spreads. 540 x 960 (shown at most ~400 px wide), silent, faststart.
    video = out / 'spreads-forest-friend.mp4'
    run('-i', str(src / 'storybook video.mp4'), '-an', '-vf', 'scale=540:960:flags=lanczos,format=yuv420p',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-movflags', '+faststart', str(video))
    run('-ss', '4.5', '-i', str(video), '-frames:v', '1', str(tmp / 'poster.png'))
    Image.open(tmp / 'poster.png').convert('RGB').save(out / 'spreads-forest-friend-poster-540.webp', 'WEBP', quality=80, method=6)
    print('video done', video.stat().st_size)

    # A 4 s run through one book, cover to back cover, on a dark backdrop. Square 720 x 720 kept, audio removed.
    spreads = out / 'spreads-cover-to-cover.mp4'
    run('-i', str(src / 'double page spreads video.mp4'), '-an', '-vf', 'format=yuv420p',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-movflags', '+faststart', str(spreads))
    run('-ss', '1.6', '-i', str(spreads), '-frames:v', '1', str(tmp / 'spreads.png'))
    Image.open(tmp / 'spreads.png').convert('RGB').save(out / 'spreads-cover-to-cover-poster-720.webp', 'WEBP', quality=80, method=6)
    print('video done', spreads.stat().st_size)
