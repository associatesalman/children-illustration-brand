"""Build web copies of the 2D & 3D Animation page media.

Usage: python scripts/optimize_animation.py <project root> <path to ffmpeg>

Everything in public/2d & 3d animation/ is left unchanged. Output goes to src/assets/animation/.

- 3d animation process steps.jpg (736x1104): a seven-panel infographic of one 3D character going from
  concept sketch through modeling, texturing, rigging, animation and lighting to the final render.
- simple scratch , 2d and 3d animation difference video.mp4 (720x1280, 58 s, with audio): three stacked
  landscape bands that play in sync. Top: rough pencil storyboard (rows 0-413). Middle: untextured 3D
  layout/blocking (rows 415-844). Bottom: the lit, rendered 3D shot (rows 846-1280). It shows a family
  camping trip and a day at home (0-41 s), then a woman booking a holiday rental on a laptop (41-54 s, a
  "Hidden Haven" site, five stars and a "Book now" button), then the studio's end card ("The Future
  Animations" logo and a business email, from about 54 s). A faint "The Future Animations" watermark
  moves between the bands throughout, and the middle band carries a cut-off "YOUT" label in places.

From the video, only the family scenes are used; the rental-booking ad and the end card are not:
- sketch-to-render.mp4: all three bands, 0-14 s (camping scenes), 540x960, no audio.
- story-scenes.mp4: the rendered band only, 14-40.5 s (tent, campfire, bike ride, home), 720x432.
- stage-sketch / stage-layout / stage-render: one still per band of the same moment (father and daughter
  cheering, 28-32 s), each cropped to 2:1 so the watermark, the "YOUT" label and a logo fragment at the
  bottom of the middle band stay out of frame. The three bands are taken from instants where each is clean.

The available ffmpeg build only has hardware/MediaFoundation H.264 encoders, so h264_mf at a fixed
bitrate is used.
"""
import subprocess, sys, tempfile
from pathlib import Path
from PIL import Image

root, ffmpeg = Path(sys.argv[1]), sys.argv[2]
src = root / 'public/2d & 3d animation'
out = root / 'src/assets/animation'
out.mkdir(parents=True, exist_ok=True)
for old in out.iterdir():
    if old.is_file():
        old.unlink()

VIDEO = src / 'simple scratch , 2d and 3d animation difference video.mp4'


def webp(im, name, widths, q=84):
    for w in widths:
        w = min(w, im.width)
        copy = im if w == im.width else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        copy.save(out / f'{name}-{w}.webp', 'WEBP', quality=q, method=6)
        print(name, copy.size)


def run(*args):
    subprocess.run([ffmpeg, '-v', 'error', '-y', *map(str, args)], check=True)


webp(Image.open(src / '3d animation process steps.jpg').convert('RGB'), '3d-process-steps', (480, 736), q=86)

with tempfile.TemporaryDirectory() as tmp:
    tmp = Path(tmp)

    def frame(t):
        path = tmp / f'{t}.png'
        run('-ss', t, '-i', VIDEO, '-frames:v', 1, path)
        return Image.open(path).convert('RGB')

    # One clean 2:1 still per band (720x360). Offsets are band top + margin.
    webp(frame(28.2).crop((0, 20, 720, 380)), 'stage-sketch', (480, 720))
    webp(frame(31.4).crop((0, 415 + 30, 720, 415 + 390)), 'stage-layout', (480, 720))
    webp(frame(28.2).crop((0, 846 + 30, 720, 846 + 390)), 'stage-render', (480, 720))

    triptych = out / 'sketch-to-render.mp4'
    run('-t', 14, '-i', VIDEO, '-an', '-vf', 'scale=540:960:flags=lanczos,format=yuv420p',
        '-c:v', 'h264_mf', '-b:v', '1000k', '-movflags', '+faststart', triptych)
    run('-ss', 9, '-i', triptych, '-frames:v', 1, tmp / 'p1.png')
    Image.open(tmp / 'p1.png').convert('RGB').save(out / 'sketch-to-render-poster.webp', 'WEBP', quality=78, method=6)

    story = out / 'story-scenes.mp4'
    run('-ss', 14, '-to', 40.5, '-i', VIDEO, '-an', '-vf', 'crop=720:432:0:847,format=yuv420p',
        '-c:v', 'h264_mf', '-b:v', '900k', '-movflags', '+faststart', story)
    run('-ss', 8, '-i', story, '-frames:v', 1, tmp / 'p2.png')
    Image.open(tmp / 'p2.png').convert('RGB').save(out / 'story-scenes-poster.webp', 'WEBP', quality=80, method=6)

    for v in (triptych, story):
        print(v.name, v.stat().st_size)
