"""Build the web assets for the Character Design page from public/character design/.

Usage: python scripts/optimize_character_design.py <project root> <path to ffmpeg>

The supplied files are never modified. Output goes to src/assets/character-design/.

Assets were placed by what they show, not by file name:
- "character development -1.jpg" is a four-view 3D turnaround, so it sits under Character Sheets.
- "character sheet -2.jpg" is one figure as a color final beside its own pencil drawing, so it sits
  under Character Development (the same character at two stages).
- "character creation video.mp4" is one 3D boy cycling through facial expressions, so it sits under
  Character Expressions.
- "character design -1.jpg" (Buddies) is split into its panels: the group scene, and two panels that
  each pair pose sketches with the finished character. Its fourth panel is cut off mid-character in the
  source, so it is not used.
- "character creation -2.jpg" is stored sideways: rotated upright and cropped to the row of faces. The
  crop also removes a cartoon-brand logo printed on one child's shirt.
- "character development video.mp4" is not used: it is official branded animation for a well-known
  franchise (its logo appears on screen), not a development sequence, and is 47 MB.
"""
import subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageChops, ImageFilter

root, ffmpeg = Path(sys.argv[1]), sys.argv[2]
src, out = root / 'public/character design', root / 'src/assets/character-design'
out.mkdir(parents=True, exist_ok=True)
for old in out.iterdir():  # start clean so renamed outputs never linger
    old.unlink()


def webp(im, name, widths=(640, 1200), q=82, upscale=False):
    """Save one WebP per width (never upscaled unless asked); returns the sizes written."""
    written = []
    for w in widths:
        w = w if upscale else min(w, im.width)
        if written and w == written[-1][0]:
            continue
        copy = im if w == im.width else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        copy.save(out / f'{name}-{w}.webp', 'WEBP', quality=q, method=6)
        written.append(copy.size)
    print(name, written)
    return written


def open_rgb(file):
    return Image.open(src / file).convert('RGB')


# ---------------------------------------------------------------- hero: cut out of its white page
def cut_out_white(im):
    """Flood-fill the neutral white page from the edges and make it transparent, with a soft edge.

    Only near-pure neutral white counts as page, so the characters' warm off-white shirts stay opaque.
    """
    W, H = im.size
    px = im.load()
    page = Image.new('L', (W, H), 0)
    mask = page.load()
    is_page = lambda c: min(c) >= 238 and max(c) - min(c) <= 10
    # Each connected patch of page-white is page if it touches the border, or if it is an enclosed gap
    # (between an arm and a body, say) that is as pure a white as the page itself. Shirts never are.
    seen = Image.new('1', (W, H), 0).load()
    for sy in range(H):
        for sx in range(W):
            if seen[sx, sy] or not is_page(px[sx, sy]):
                continue
            patch, stack, edge = [], [(sx, sy)], False
            seen[sx, sy] = 1
            while stack:
                x, y = stack.pop()
                patch.append((x, y))
                edge = edge or x in (0, W - 1) or y in (0, H - 1)
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < W and 0 <= ny < H and not seen[nx, ny] and is_page(px[nx, ny]):
                        seen[nx, ny] = 1
                        stack.append((nx, ny))
            pure = sum(min(px[p]) for p in patch) / len(patch) >= 250
            if edge or (len(patch) >= 12 and pure):
                for p in patch:
                    mask[p] = 255
    # JPEG ringing leaves a light 1-2 px rim around every shape. Drop the first pixel next to the page,
    # and the second one too where it is still pale, then soften the new edge slightly.
    ring1 = page.filter(ImageFilter.MaxFilter(3))
    ring2 = page.filter(ImageFilter.MaxFilter(5)).load()
    cut = ring1.load()
    for y in range(H):
        for x in range(W):
            if not cut[x, y] and ring2[x, y] and min(px[x, y]) >= 200:
                cut[x, y] = 255
    alpha = ImageChops.invert(ring1).filter(ImageFilter.GaussianBlur(0.6))
    rgba = im.convert('RGBA')
    rgba.putalpha(alpha)
    return rgba


hero = cut_out_white(open_rgb('character design hero full mockup.jpg')).crop((8, 66, 705, 472))
# Flat vector art: a careful Lanczos upscale keeps edges clean at the large hero size.
webp(hero, 'hero-lineup', widths=(697, 1394), q=88, upscale=True)

# ---------------------------------------------------------------- images
images = {  # name: (source file, crop box or None)
    'creation-details': ('main character creation -1.jpg', None),
    'expression-sketches': ('character expression -1.jpg', None),
    'expression-sequence': ('character expression emotional -2.jpg', None),
    'sheet-ellis': ('character sheet -1.jpg', None),
    'sheet-turnaround': ('character development -1.jpg', None),
    'development-sketch-final': ('character sheet -2.jpg', None),
    # Buddies, split along its white divider lines (panel 4 is cut off in the source).
    'buddies-group': ('character design -1.jpg', (0, 0, 600, 338)),
    'buddies-poses-a': ('character design -1.jpg', (0, 344, 600, 680)),
    'buddies-poses-b': ('character design -1.jpg', (0, 686, 600, 1022)),
}
for name, (file, box) in images.items():
    im = open_rgb(file)
    webp(im.crop(box) if box else im, name, widths=(640, 1200))

# The cast lineup is stored on its side: turn it upright, then keep the row of faces.
cast = open_rgb('character creation -2.jpg').rotate(90, expand=True).crop((0, 336, 1308, 618))
webp(cast, 'cast-faces', widths=(760, 1308))


# ---------------------------------------------------------------- video
def run(*args):
    subprocess.run([ffmpeg, '-v', 'error', '-y', *args], check=True)


with tempfile.TemporaryDirectory() as tmp:
    fixed = Path(tmp) / 'fixed.mp4'
    # The source flags a reserved color matrix, which decoders reject; mark it BT.709 and drop the audio.
    run('-i', str(src / 'character creation video.mp4'), '-map', '0:v', '-c', 'copy',
        '-bsf:v', 'h264_metadata=matrix_coefficients=1:colour_primaries=1:transfer_characteristics=1', str(fixed))
    run('-i', str(fixed), '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p',
        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
        '-movflags', '+faststart', str(out / 'expressions-3d.mp4'))
    still = Path(tmp) / 'poster.png'
    run('-ss', '7.6', '-i', str(fixed), '-frames:v', '1', str(still))  # the wide, happy grin
    poster = Image.open(still).convert('RGB')
    poster.save(out / f'expressions-3d-poster-{poster.width}.webp', 'WEBP', quality=80, method=6)
    print('expressions-3d poster', poster.size)
