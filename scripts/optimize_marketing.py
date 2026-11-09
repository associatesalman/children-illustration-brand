"""Build web copies of the Book Marketing page media.

Usage: python scripts/optimize_marketing.py <project root> <path to ffmpeg>

The supplied files in public/book marketing/ are never modified. Output goes to src/assets/marketing/.

Videos are stream-copied (no re-encode, so no quality loss) with the audio track dropped and the index
moved to the front (faststart) so playback can begin before the whole file arrives. Posters are single
frames saved as WebP.

Website samples 1 and 2 were replaced on 2026-11-06 and are stream-copied like the rest:
- website sample video -1.mp4 (800x600, 24 s, 60 fps; replaced again later on 2026-11-06): a scroll through
  a book-store website (hero, best sellers, featured books, award banner, testimonials, footer). It is
  re-encoded to 30 fps with libx264 (CRF 23), which looks the same and cuts it from 6.3 MB to about 1.5 MB.
  Poster at 2 s, once the hero has faded in.
- website sample video -2.mp4 (736x414, 25 s): a book trailer template (placeholder cover, review quotes,
  an inside page, a price and an end card). Poster from the opening cover shot.
The previous sample 2 (a portrait clip cropped to 4:3 with h264_mf) no longer exists.

Social media collages: the nine files are the slides of one retail case study, all nine built (in story
order, numbered 01-09). They were replaced on 2026-11-06 with 1122x1402 PNG versions (same headings and story
order, now illustrated with children's book covers); the 4:5 frame is unchanged, so they are only resized. Four of them state that sample's campaign figures (01, 06, 07, 08); the page labels
the series as a sample case study so those figures are never presented as a promise or as our results.

Amazon section additions (2026-11-06):
- amazon managment video.mp4 (720x900, 5.5 s): Amazon's own smile-logo brand montage (a Prime van,
  groceries, a Kindle, an Alexa+ event, Prime Video and Amazon Music screens). Stream-copied without audio as amazon-ecosystem.mp4. It shows no campaign
  dashboards, so the page never presents it as a demonstration of ad management.
- amazon book marketing mokcup.jpg (735x701): an "Amazon Marketing" illustration, people building a stack
  of boxes marked with analytics, settings and idea icons. Saved as amazon-marketing-board-*.webp.
- A + CONTENT -1..5.jpg (970x600 each, the standard A+ module size): one A+ set for a how-to-draw book
  series. Only resized, never cropped, so every word on them stays legible. Saved as aplus-0N-*.webp.
- "amazon book video.mp4" (cover-design-reel) is no longer placed on the page: it is another studio's
  watermarked cover-design clip, so it is not shown in the Book Cover sections either.
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
for file, name in (('socialmedia collage -1.png', 'social-01-case-study'),
                   ('socialmedia collage- 2.png', 'social-02-client'),
                   ('socialmedia collage -3.png', 'social-03-problem'),
                   ('socialmedia collage -4.png', 'social-04-approach'),
                   ('sociamedia collage -.png', 'social-05-ads-work'),
                   ('socialmedia collage -5.png', 'social-06-snapshot'),
                   ('socialmedia collage -6.png', 'social-07-result'),
                   ('socialmedia collage -8.png', 'social-08-impact'),
                   ('socialmedia collage -9.png', 'social-09-creative')):
    webp(open_rgb(file), name, (480, 736), q=86)
webp(open_rgb('amazon book marketing mokcup.jpg'), 'amazon-marketing-board', (480, 735), q=86)
for i, name in enumerate(('process', 'inside-pages', 'series', 'lesson-preview', 'contents'), start=1):
    webp(open_rgb(f'A + CONTENT -{i}.jpg'), f'aplus-0{i}-{name}', (640, 970), q=88)

# ---------------------------------------------------------------- videos
videos = {
    # name: (source, poster time in seconds)
    'cover-design-reel': ('amazon book video.mp4', 11.2),
    'brand-website-reel': ('author branding video.mp4', 0.6),
    'content-toolkit': ('content creation video explain.mp4', 8.0),
    'website-sample-2': ('website sample video -2.mp4', 1.0),
    'website-sample-3': ('website sample video -3.mp4', 6.0),
    'website-sample-4': ('website sample video -4.mp4', 2.6),
    'amazon-ecosystem': ('amazon managment video.mp4', 0.5),
}
with tempfile.TemporaryDirectory() as tmp:
    tmp = Path(tmp)

    def poster(video, name, at):
        run('-ss', str(at), '-i', str(video), '-frames:v', '1', str(tmp / 'p.png'))
        im = Image.open(tmp / 'p.png').convert('RGB')
        im.save(out / f'{name}-poster.webp', 'WEBP', quality=78, method=6)
        print('poster', name, im.size)

    video = out / 'website-sample-1.mp4'
    run('-i', str(src / 'website sample video -1.mp4'), '-an', '-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264',
        '-preset', 'slow', '-crf', '23', '-profile:v', 'high', '-movflags', '+faststart', str(video))
    poster(video, 'website-sample-1', 2.0)
    print('video website-sample-1', video.stat().st_size)

    for name, (file, at) in videos.items():
        video = out / f'{name}.mp4'
        run('-i', str(src / file), '-an', '-c:v', 'copy', '-movflags', '+faststart', str(video))
        poster(video, name, at)
        print('video', name, video.stat().st_size)
