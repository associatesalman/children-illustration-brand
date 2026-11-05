"""Web copy of the supplied Home hero background video.

Usage: python -I scripts/optimize_home_video.py <project root> <path to ffmpeg>

Source (left untouched): public/klutz-home-video.mp4, 1280x720 (720p HD), 40.1 s, 24 fps, H.264 ~1.9 Mbps,
AAC stereo audio. The picture has 40 px black letterbox bars top and bottom, and from about 37.2 s it ends on a
broadcaster title card. For a full-cover hero video with sound:
  - crop the bars away (1280x640 of picture remains, native resolution, no scaling),
  - keep 0-36.4 s, before the page turn into the title card,
  - keep the audio (AAC 160 kbps) with a short fade-out so the loop point doesn't click,
  - H.264 at 4 Mbps, about twice the source bitrate, so re-encoding adds no visible loss
    (this ffmpeg build only has h264_mf, which takes a fixed bitrate), faststart for quick playback.
Outputs to src/assets/home/: klutz-home-720p.mp4 and a WebP poster (frame at 2 s).
"""

import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

root, ffmpeg = Path(sys.argv[1]), sys.argv[2]
src = root / 'public' / 'klutz-home-video.mp4'
out = root / 'src' / 'assets' / 'home'
out.mkdir(parents=True, exist_ok=True)
LENGTH = 36.4


def run(*args):
    subprocess.run([ffmpeg, '-v', 'error', '-y', *map(str, args)], check=True)


for old in out.glob('klutz-home-*.mp4'):
    old.unlink()

video = out / 'klutz-home-720p.mp4'
run('-t', LENGTH, '-i', src,
    '-vf', 'crop=1280:640:0:40,format=yuv420p', '-c:v', 'h264_mf', '-b:v', '4000k',
    '-af', f'afade=t=out:st={LENGTH - 1.2:.1f}:d=1.2', '-c:a', 'aac', '-b:a', '160k',
    '-movflags', '+faststart', video)

with tempfile.TemporaryDirectory() as tmp:
    still = Path(tmp) / 'poster.png'
    run('-ss', 2, '-i', video, '-frames:v', 1, still)  # the first frames fade in from black
    Image.open(still).convert('RGB').save(out / 'klutz-home-poster.webp', 'WEBP', quality=88, method=6)

for path in sorted(out.iterdir()):
    print(path.name, path.stat().st_size)
