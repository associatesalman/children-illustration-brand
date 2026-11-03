"""Build the Illustration Styles hero puzzle from public/illustration style service/hero-pixabay/.

Usage: python scripts/build_styles_hero.py <project root>

Six Pixabay illustrations (Pixabay Content License; sources in src/assets/artwork/ASSETS.md) are cropped
square around their subjects and fitted into one jigsaw composition, in a wide (desktop, 3x2) and a tall
(mobile, 2x3) arrangement. None of them appears elsewhere on the page. The source files are never changed.
Output: src/assets/style-services/hero-puzzle-wide-{760,1440}.webp and hero-puzzle-tall-800.webp.
"""
import sys
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFilter

root = Path(sys.argv[1])
src, out = root / 'public/illustration style service/hero-pixabay', root / 'src/assets/style-services'

PAPER = (247, 241, 230)  # warm off-white behind the transparent PNGs

hero_pieces = {  # key: (file, square crop box around the subject, in source pixels)
    'stars': ('stars-6726176.jpg', (0, 330, 932, 1262)),             # digital painting: girl on a star
    'kids': ('children-6233868.png', (42, 0, 1239, 1197)),          # cartoon: two kids and a dog in the rain
    'mushroom': ('mushroom-4000133.png', (50, 0, 1230, 1180)),     # 3D: mushroom cottage
    'bear': ('cat-3643705.jpg', (0, 50, 1129, 1179)),               # soft hand-drawn: bear in a winter coat
    'swing': ('child-6093230.jpg', (0, 100, 1021, 1121)),           # minimal: girl swinging from a street lamp
    'winter': ('illustration-4765349.jpg', (0, 330, 876, 1206)),    # watercolor and ink: winter village
}


def load(file, box):
    im = Image.open(src / file).convert('RGBA')
    flat = Image.new('RGBA', im.size, PAPER + (255,))
    return Image.alpha_composite(flat, im).convert('RGB').crop(box)


pieces = {key: load(file, box) for key, (file, box) in hero_pieces.items()}


def puzzle(layout, cell, gap, radius):
    rows, cols = len(layout), len(layout[0])
    W, H = cols * cell, rows * cell
    r = round(cell * 0.13)  # knob radius
    off = round(r * 0.72)   # knob centre sits this far past the edge, which forms the neck

    def knob(draw, cx, cy, fill):
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=fill)

    canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    for i in range(rows):
        for j in range(cols):
            mask = Image.new('L', (W, H), 0)
            d = ImageDraw.Draw(mask)
            x0, y0 = j * cell, i * cell
            d.rectangle((x0, y0, x0 + cell - 1, y0 + cell - 1), fill=255)
            # Each shared edge gets one knob; its direction alternates so pieces interlock.
            for di, dj in ((0, 1), (1, 0), (0, -1), (-1, 0)):
                ni, nj = i + di, j + dj
                if not (0 <= ni < rows and 0 <= nj < cols):
                    continue
                a, b = min((i, j), (ni, nj)), max((i, j), (ni, nj))
                outward_from_a = (a[0] + a[1]) % 2 == 1
                mine_out = outward_from_a == ((i, j) == a)
                if dj:  # vertical edge
                    ex = x0 + (cell if dj > 0 else 0)
                    cx, cy = ex + dj * off * (1 if mine_out else -1), y0 + cell // 2
                else:
                    ey = y0 + (cell if di > 0 else 0)
                    cx, cy = x0 + cell // 2, ey + di * off * (1 if mine_out else -1)
                knob(d, cx, cy, 255 if mine_out else 0)
            mask = mask.filter(ImageFilter.MinFilter(gap * 2 + 1))  # gutter between pieces
            # Round the outer corners of the whole puzzle.
            outer = Image.new('L', (W, H), 0)
            ImageDraw.Draw(outer).rounded_rectangle((0, 0, W - 1, H - 1), radius=radius, fill=255)
            mask = ImageChops.multiply(mask, outer)
            bbox = mask.getbbox()
            img = pieces[layout[i][j]]
            bw, bh = bbox[2] - bbox[0], bbox[3] - bbox[1]
            # Uniform scale (never stretched), centred on the crop.
            scale = max(bw / img.width, bh / img.height)
            fit = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
            left, top = (fit.width - bw) // 2, (fit.height - bh) // 2
            tile = Image.new('RGBA', (W, H), (0, 0, 0, 0))
            tile.paste(fit.crop((left, top, left + bw, top + bh)), bbox[:2])
            canvas = Image.alpha_composite(canvas, Image.composite(tile, Image.new('RGBA', (W, H)), mask))
    return canvas


def webp(im, name, widths, q=82):
    for w in widths:
        copy = im if w == im.width else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        copy.save(out / f'{name}-{w}.webp', 'WEBP', quality=q, method=6)
        print(name, copy.size)


# The two dark night scenes (stars, swing) never touch, in either arrangement.
wide = puzzle([['stars', 'kids', 'mushroom'], ['bear', 'swing', 'winter']], cell=480, gap=6, radius=28)
webp(wide, 'hero-puzzle-wide', widths=(760, 1440))
tall = puzzle([['stars', 'kids'], ['bear', 'mushroom'], ['winter', 'swing']], cell=400, gap=5, radius=24)
webp(tall, 'hero-puzzle-tall', widths=(800,))
