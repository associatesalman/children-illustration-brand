"""Small 4:3 thumbnails for the Free Sample page's illustration-style choices.

Usage: python scripts/build_free_sample_thumbs.py <project root>

Each one is cropped from artwork already shown on the Illustration Styles page (src/assets/style-services/; the 3D one from the Character Design page),
so the picker shows the same examples visitors see there. Output: src/assets/free-sample/style-*.webp.
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

root = Path(sys.argv[1])
src = root / 'src/assets/style-services'
out = root / 'src/assets/free-sample'
out.mkdir(parents=True, exist_ok=True)

# style -> (source file, vertical focus 0..1)
SOURCES = {
    'cartoon': ('cartoon-character-640.webp', 0.25),
    'watercolor': ('watercolor-characters-530.webp', 0.5),
    'digital-painting': ('digital-landscape-finished-500.webp', 0.5),
    '3d': ('../character-design/expressions-3d-poster-736.webp', 0.35),
    'minimal': ('minimal-shadows-960.webp', 0.5),
}
for name, (file, focus) in SOURCES.items():
    im = Image.open(src / file).convert('RGB')
    thumb = ImageOps.fit(im, (320, 240), Image.LANCZOS, centering=(0.5, focus))
    thumb.save(out / f'style-{name}-320.webp', 'WEBP', quality=80, method=6)
    print(name, im.size, '->', thumb.size)
