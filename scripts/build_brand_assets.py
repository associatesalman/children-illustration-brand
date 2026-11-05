"""Build the web copies of the supplied brand files.

Sources (left untouched):
  public/klutz-logo.png   full logo, transparent, with wide transparent margins
  public/site-title.png   square "K" app icon, transparent, with transparent margins

Outputs:
  src/assets/brand/klutz-logo-{480,960}.webp   logo trimmed to its visible pixels (lossless, alpha kept)
  public/favicon.ico (16/32/48), public/favicon-32.png, public/apple-touch-icon.png (180, on white),
  public/icon-192.png, public/icon-512.png      icon trimmed to its rounded square, aspect kept

Only fully transparent margin is removed, so no visible part of either artwork is cropped.
Run with:  .venv/Scripts/python.exe -I scripts/build_brand_assets.py
"""

import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, 'public')
BRAND = os.path.join(ROOT, 'src', 'assets', 'brand')


def trimmed(path):
    im = Image.open(path).convert('RGBA')
    return im.crop(im.getchannel('A').getbbox())


def main():
    os.makedirs(BRAND, exist_ok=True)

    logo = trimmed(os.path.join(PUBLIC, 'klutz-logo.png'))
    print('logo visible area', logo.size)
    for w in (480, 960):
        h = round(logo.height * w / logo.width)
        out = os.path.join(BRAND, f'klutz-logo-{w}.webp')
        logo.resize((w, h), Image.LANCZOS).save(out, 'WEBP', lossless=True, quality=100, method=6)
        print(out, (w, h), os.path.getsize(out))

    icon = trimmed(os.path.join(PUBLIC, 'site-title.png'))
    side = max(icon.size)
    square = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    square.paste(icon, ((side - icon.width) // 2, (side - icon.height) // 2))
    print('icon visible area', icon.size)

    square.save(os.path.join(PUBLIC, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])
    square.resize((32, 32), Image.LANCZOS).save(os.path.join(PUBLIC, 'favicon-32.png'), optimize=True)
    for s in (192, 512):
        square.resize((s, s), Image.LANCZOS).save(os.path.join(PUBLIC, f'icon-{s}.png'), optimize=True)
    # iOS fills transparency with black, so the touch icon sits on white with a small margin.
    touch = Image.new('RGBA', (180, 180), (255, 255, 255, 255))
    inner = square.resize((156, 156), Image.LANCZOS)
    touch.alpha_composite(inner, (12, 12))
    touch.convert('RGB').save(os.path.join(PUBLIC, 'apple-touch-icon.png'), optimize=True)
    for name in ('favicon.ico', 'favicon-32.png', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'):
        print(name, os.path.getsize(os.path.join(PUBLIC, name)))


if __name__ == '__main__':
    main()
