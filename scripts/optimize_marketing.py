"""Build web copies of the Book Marketing page media.

Usage: python scripts/optimize_marketing.py <project root> <path to ffmpeg>

The supplied files in public/book marketing/ are never modified. Output goes to src/assets/marketing/.

Videos are stream-copied (no re-encode, so no quality loss) with the audio track dropped and the index
moved to the front (faststart) so playback can begin before the whole file arrives. The one exception is
"website sample video -2.mp4": a 720x1280 portrait clip whose website sits in a 720x540 band between flat
pink bars. It is cropped to that band (rows 370-910, measured) so it matches sample 1's 4:3 frame, which
needs a re-encode; the ffmpeg build used has only hardware/MediaFoundation H.264 encoders, so h264_mf at a
fixed bitrate is used. Posters are single frames saved as WebP.

Social media collages: the nine files are the slides of one retail case study, all nine built (in story
order, numbered 01-09). Four of them state that sample's campaign figures (01, 06, 07, 08); the page labels
the series as a sample case study so those figures are never presented as a promise or as our results.
"""
import subprocess, sys, tempfile
from pathlib import Path
from PIL import Image

root, ffmpeg = Path(sys.argv[1]), sys.argv[2]
src, out = root / 'public/book marketing', root / 'src/assets/marketing'
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


# ---------------------------------------------------------------- stills
webp(open_rgb('amazon book marketing -1.jpg'), 'market-your-story', (480, 736))
webp(open_rgb('author branding mokcup -1.jpg'), 'brand-identity-board', (480, 736))
webp(open_rgb('author banding book web mokcup-2.jpg'), 'illustrated-web-page', (480, 736))
webp(open_rgb('book promotion mokcup-1.jpg'), 'promotion-workbook-tablets', (640, 1200))
webp(open_rgb('advertising types mokcups-1.jpg'), 'advertising-types', (480, 735), q=86)
for file, name in (('socialmedia collage -1.jpg', 'social-01-case-study'),
                   ('socialmedia collage- 2.jpg', 'social-02-client'),
                   ('socialmedia collage -3.jpg', 'social-03-problem'),
                   ('socialmedia collage -4.jpg', 'social-04-approach'),
                   ('sociamedia collage -.jpg', 'social-05-ads-work'),
                   ('socialmedia collage -5.jpg', 'social-06-snapshot'),
                   ('socialmedia collage -6.jpg', 'social-07-result'),
                   ('socialmedia collage -8.jpg', 'social-08-impact'),
                   ('socialmedia collage -9.jpg', 'social-09-creative')):
    webp(open_rgb(file), name, (480, 736), q=86)

# ---------------------------------------------------------------- videos
videos = {
    # name: (source, poster time in seconds)
    'cover-design-reel': ('amazon book video.mp4', 11.2),
    'brand-website-reel': ('author branding video.mp4', 0.6),
    'content-toolkit': ('content creation video explain.mp4', 8.0),
    'website-sample-1': ('website sample video -1.mp4', 1.0),
    'website-sample-3': ('website sample video -3.mp4', 6.0),
    'website-sample-4': ('website sample video -4.mp4', 2.6),
}
with tempfile.TemporaryDirectory() as tmp:
    tmp = Path(tmp)

    def poster(video, name, at):
        run('-ss', str(at), '-i', str(video), '-frames:v', '1', str(tmp / 'p.png'))
        im = Image.open(tmp / 'p.png').convert('RGB')
        im.save(out / f'{name}-poster.webp', 'WEBP', quality=78, method=6)
        print('poster', name, im.size)

    for name, (file, at) in videos.items():
        video = out / f'{name}.mp4'
        run('-i', str(src / file), '-an', '-c:v', 'copy', '-movflags', '+faststart', str(video))
        poster(video, name, at)
        print('video', name, video.stat().st_size)

    video = out / 'website-sample-2.mp4'
    run('-i', str(src / 'website sample video -2.mp4'), '-an', '-vf', 'crop=720:540:0:370,fps=30,format=yuv420p',
        '-c:v', 'h264_mf', '-b:v', '450k', '-movflags', '+faststart', str(video))
    poster(video, 'website-sample-2', 5.0)
    print('video website-sample-2', video.stat().st_size)
