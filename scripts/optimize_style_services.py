"""Build the web assets for the Illustration Styles page from public/illustration style service/.

Usage: python scripts/optimize_style_services.py <project root> <path to ffmpeg>

The supplied files are never modified. Output goes to src/assets/style-services/:

- Images: WebP at two widths (for srcset), with crops noted below.
- Videos: audio removed (the page only ever plays them muted), index moved to the front
  (+faststart) and the larger files re-encoded at the size they are shown. Each gets a WebP poster.
- Stills: single frames from the supplied videos, used as gallery images in their own section.
- The hero puzzle is built separately by scripts/build_styles_hero.py; its files are left in place.

Assets were assigned by what they show, not by file name: the fox and bee files are named
"digital painting" but are flat, outlined vector cartoon art, so they sit under Cartoon Style.
"""
import subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFilter

root, ffmpeg = Path(sys.argv[1]), sys.argv[2]
src, out = root / 'public/illustration style service', root / 'src/assets/style-services'
out.mkdir(parents=True, exist_ok=True)
for old in out.iterdir():  # start clean so renamed outputs never linger (the hero has its own script)
    if not old.name.startswith('hero-puzzle-'):
        old.unlink()


def webp(im, name, widths=(640, 1280), q=80):
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


def frame(video, t, vf=None):
    with tempfile.TemporaryDirectory() as tmp:
        target = Path(tmp) / 'f.png'
        args = ['-vf', vf] if vf else []
        subprocess.run([ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-ss', str(t), '-i', str(video),
                        '-frames:v', '1', *args, str(target)], check=True)
        return Image.open(target).convert('RGB')


SIDEWAYS = 'transpose=2'  # the minimal-style source is stored rotated

# ---------------------------------------------------------------- images
images = {  # name: (source file, crop box or None)
    'cartoon-structure-sheet': ('cartoon-style-structure-design.jpg', None),
    'cartoon-expression-sketches': ('cartoon style - 1.jpg', None),
    'cartoon-character': ('cartoon style - 2.jpg', None),
    'cartoon-fox-vector': ('digital painting -1.jpg', None),
    'cartoon-bee-tablet': ('digital painting -2.jpg', None),
    # Lower part of this file is a screenshot of a blank Photoshop template; keep the painting only.
    'watercolor-sea-life': ('watercolour style -1.jpg', (0, 0, 890, 690)),
    # Product-listing preview: crop to the mother-and-children group, away from all sales text and lettering.
    'watercolor-characters': ('watercolour style -2.jpg', (330, 625, 860, 1200)),
    '3d-render': ('3d illustration -1.jpg', None),
}
for name, (file, crop) in images.items():
    im = Image.open(src / file).convert('RGB')
    webp(im.crop(crop) if crop else im, name)

# ---------------------------------------------------------------- videos
videos = {  # name: (source, poster time, encode args or None for stream copy)
    'cartoon-turnaround': ('cartoon-style-video.mp4', 1, None),
    'cartoon-vector-face': ('cartoon-styles-practical-video.mp4', 18, None),
    'watercolor-bench': ('watercolour illustration video.mp4', 56,
                         ['-vf', 'scale=540:-2', '-c:v', 'h264_mf', '-b:v', '700k']),
    'digital-landscape': ('digital painting video.mp4', 1.7, ['-c:v', 'h264_mf', '-b:v', '850k']),
    '3d-walk': ('3d style illustration video.mp4', 1, None),
    'minimal-story': ('minimal style illustration video.mp4', 50.75,
                      ['-vf', f'{SIDEWAYS},scale=960:-2', '-c:v', 'h264_mf', '-b:v', '520k']),
}
for name, (file, at, encode) in videos.items():
    target = out / f'{name}.mp4'
    args = encode or ['-c:v', 'copy']
    subprocess.run([ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(src / file), *args, '-an',
                    '-movflags', '+faststart', str(target)], check=True)
    poster = frame(target, at)
    webp(poster, f'{name}-poster', widths=(poster.width,), q=74)
    print(name, f'{target.stat().st_size / 1e6:.1f} MB')

# ---------------------------------------------------------------- stills from videos
stills = {  # name: (source, time, filter)
    'digital-landscape-finished': ('digital painting video.mp4', 12.1, None),
    'digital-landscape-detail': ('digital painting video.mp4', 19.0, None),
    'minimal-street': ('minimal style illustration video.mp4', 94.25, SIDEWAYS),
    'minimal-shadows': ('minimal style illustration video.mp4', 21.75, SIDEWAYS),
}
for name, (file, t, vf) in stills.items():
    webp(frame(src / file, t, vf), name, widths=(960,), q=78)
