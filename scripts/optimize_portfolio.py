"""Export web copies of public/portfolio into src/assets/portfolio.

Usage: python scripts/optimize_portfolio.py <project root> <path to ffmpeg>
"""
import subprocess, sys
from pathlib import Path
from PIL import Image

root, ffmpeg = Path(sys.argv[1]), sys.argv[2]
src, out = root / 'public/portfolio', root / 'src/assets/portfolio'
out.mkdir(parents=True, exist_ok=True)

def save(im, name, q=84):
    im.save(out / f'{name}.webp', 'WEBP', quality=q, method=6)
    print(name, im.size)

for file, name in [
    ('character-design-1.jpg', 'model-sheet-pencil'),
    ('character-design-2-reality.jpg', 'turnaround-color'),
    ('illustration-style-1.jpg', 'expression-sheet'),
    ('illustration-style-2.jpg', 'watercolor-portrait'),
    ('storybook-illuistration-2.jpg', 'spread-thumbnails'),
    ('coluring-pages-puzzles-1.jpg', 'activity-book-pages'),
]:
    save(Image.open(src / file).convert('RGB'), name)

# The storybook board is four stacked panels: two spreads, each followed by its board-book mockup.
board = Image.open(src / 'storybook-illustration-1.jpg').convert('RGB')
for (top, bottom), name in zip(
    [(0, 584), (584, 1190), (1190, 1794), (1794, 2400)],
    ['forest-spread', 'forest-board-book', 'bedroom-spread', 'bedroom-board-book'],
):
    save(board.crop((0, top, board.width, bottom)), name)

def run(*args):
    subprocess.run([ffmpeg, '-v', 'error', '-y', *args], check=True)

run('-i', src / 'illustration-portfolio-hero.mp4', '-c:v', 'libx264', '-preset', 'slow', '-crf', '26',
    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', out / 'hero-reel.mp4')
run('-i', src / 'colouring-puzzles-video.mp4', '-vf', 'scale=540:-2', '-c:v', 'libx264', '-preset', 'slow',
    '-crf', '27', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart',
    out / 'activity-booklet.mp4')
for video, at, name in [('illustration-portfolio-hero.mp4', '40', 'hero-poster'),
                        ('colouring-puzzles-video.mp4', '27', 'activity-booklet-poster')]:
    run('-ss', at, '-i', src / video, '-frames:v', '1', '-vf', 'scale=-2:960' if 'booklet' in name else 'null', out / f'{name}.png')
    save(Image.open(out / f'{name}.png').convert('RGB'), name, 80)
    (out / f'{name}.png').unlink()
