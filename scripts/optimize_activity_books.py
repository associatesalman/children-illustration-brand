"""Build the web assets for the Activity Book Illustration page from public/activity book illustration/.

Usage: python scripts/optimize_activity_books.py <project root> <path to ffmpeg>

The supplied files are never modified. Output goes to src/assets/activity-books/.

Assets were placed by what they show, not by file name:
- The hero video is a flip-through of a summer activity workbook. It is recorded in HDR (HLG); HLG is
  made to look right when shown as standard video, so it is converted to BT.709 color without tone
  mapping, which keeps the wall and page whites neutral.
- The jungle activity sheet ("educational activity books -1.jpg") holds six pages that belong to two
  sections, so each page is cut out on its own: the maze, matching and spot-the-difference pages go to
  Puzzle Books; alphabet tracing, counting and draw-the-other-half go to Educational Activity Books.
- The robot activity book ("educational activity books -2.jpg") is a template listing. Its page grid
  and its open two-page spread are used; the sales text between them ("84 pages ... AI, EPS, JPEG, PDF")
  is cut away.
Not used: "activity book illustration -1.jpg" is a storybook (The Secret Treasure) with no activities;
"puzzle books -1.jpg" is a published picture book with its author and illustrator credited, beside a
jigsaw of its cover; "puzzle books.mp4" is an advertisement for a clay craft kit with no puzzles in it.
"""
import subprocess, sys, tempfile
from pathlib import Path
from PIL import Image

root, ffmpeg = Path(sys.argv[1]), sys.argv[2]
src, out = root / 'public/activity book illustration', root / 'src/assets/activity-books'
out.mkdir(parents=True, exist_ok=True)
for old in out.iterdir():  # start clean so renamed outputs never linger
    old.unlink()


def webp(im, name, widths=(640, 1200), q=82):
    """Save one WebP per width (never upscaled); returns the sizes written."""
    written = []
    for w in widths:
        w = min(w, im.width)
        if written and w == written[-1][0]:
            continue
        copy = im if w == im.width else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        copy.save(out / f'{name}-{w}.webp', 'WEBP', quality=q, method=6)
        written.append(copy.size)
    print(name, written)
    return written


def open_rgb(file):
    return Image.open(src / file).convert('RGB')


def run(*args):
    subprocess.run([ffmpeg, '-v', 'error', '-y', *args], check=True)


# ---------------------------------------------------------------- images
webp(open_rgb('colouring books -1.jpg'), 'coloring-window-set', widths=(640, 848))
# The bottom edge of a seventh, cut-off card is trimmed away.
webp(open_rgb('colouring books -2.jpg').crop((0, 0, 1080, 1890)), 'coloring-copy-colors', widths=(640, 1080))

jungle = open_rgb('educational activity books -1.jpg')
jungle_pages = {  # name: page box inside the 3 x 2 sheet (page edges, without the drop shadows)
    'jungle-complete-faces': (8, 12, 349, 512),
    'jungle-counting': (366, 12, 709, 512),
    'jungle-maze': (724, 12, 1068, 512),
    'jungle-matching': (8, 548, 349, 1049),
    'jungle-spot-difference': (366, 548, 709, 1049),
    'jungle-alphabet': (724, 548, 1068, 1049),
}
for name, box in jungle_pages.items():
    webp(jungle.crop(box), name, widths=(344,), q=86)

robots = open_rgb('educational activity books -2.jpg')
webp(robots.crop((0, 0, 1065, 798)), 'robots-page-grid', widths=(640, 1065))
webp(robots.crop((0, 972, 1065, 1600)), 'robots-spread', widths=(640, 1065))

# ---------------------------------------------------------------- videos
with tempfile.TemporaryDirectory() as tmp:
    tmp = Path(tmp)

    # Hero: HLG -> BT.709 matrix, tagged SDR, 30 fps, 540 x 960 (shown at most ~520 px wide), no audio.
    hero = out / 'hero-workbook.mp4'
    run('-i', str(src / 'activity book illustration hero video center.mp4'), '-an',
        '-vf', 'scale=540:960:flags=lanczos:in_color_matrix=bt2020:out_color_matrix=bt709,fps=30,format=yuv420p',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-maxrate', '900k', '-bufsize', '1800k',
        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
        '-movflags', '+faststart', str(hero))


    run('-ss', '0.5', '-i', str(hero), '-frames:v', '1', str(tmp / 'hero.png'))
    Image.open(tmp / 'hero.png').convert('RGB').save(out / 'hero-workbook-poster-540.webp', 'WEBP', quality=78, method=6)

    # Coloring: a marker filling in a bow-and-hearts page. The first 45 s (cover, page, coloring) loop;
    # 540 x 960, no audio.
    run('-t', '45', '-i', str(src / 'colouring books video.mp4'), '-an', '-vf', 'scale=540:960:flags=lanczos,format=yuv420p',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-maxrate', '700k', '-bufsize', '1400k', '-movflags', '+faststart', str(out / 'coloring-markers.mp4'))
    run('-ss', '30', '-i', str(out / 'coloring-markers.mp4'), '-frames:v', '1', str(tmp / 'color.png'))
    Image.open(tmp / 'color.png').convert('RGB').save(out / 'coloring-markers-poster-540.webp', 'WEBP', quality=78, method=6)
    print('videos done')
