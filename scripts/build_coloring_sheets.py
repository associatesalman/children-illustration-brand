"""Build the Coloring Studio sheets: original line art split into fillable regions and a line layer.

Usage: python -I scripts/build_coloring_sheets.py <project root>

The drawings are original klutzbookpublisher artwork. They reuse the studio's own cast and helpers from
scripts/generate_artwork.py (Leo the fox, Mia, books, trees, clouds) in its "line" style, where every shape
is a closed white shape with a dark outline, drawn back to front.

Each sheet becomes:
  - a region layer: every closed white shape, unstroked, with a stable id (data-region="<part>-<n>").
    Shapes are kept in painting order, so a region is the visible part of its shape; the topmost shape under
    the pointer is the one that gets filled. A full-page background region means every spot is fillable.
  - a line layer: the finished line art itself (white shapes with dark outlines, back to front, so hidden
    outlines stay hidden), drawn above the colors with multiply blending: its white lets the colors through and
    its outlines stay dark on top, covering the seams between neighbouring regions.
  - a highlight layer: the few small white details drawn on ink (eye shine), on top in normal blending.
Output (src/assets/coloring/):
  sheets/<id>.json   the layers as a whitelisted element tree (no markup strings), region list, version
  thumbs/<id>.svg    a small, plain preview of the uncolored sheet for the library card
Validation fails the build on: unknown elements or attributes, odd transforms, open region paths, duplicate
ids, regions without a part, or a region count outside the sheet's difficulty range. Visible area per region
(nothing fully hidden or too small to tap) is checked in the browser, where the shapes are actually rendered.

Region ids are stable for a given artwork version: they are numbered within each named part ("leo-03"), so
editing one part only affects that part. Bump VERSION in a sheet when its regions change, and saved progress
for the old version is matched by id when it is restored.
"""

import contextlib
import json
import math
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import generate_artwork as ga  # noqa: E402  (the studio's own drawing helpers)

C, fmt = ga.C, ga.fmt
INK = '#1d1a17'
WHITE = '#ffffff'
W, H = 1200, 1500

# ---------------------------------------------------------------- part labels (region ids and names)

_part = [None]
_names = [None]
_original_tag = ga.tag


def tag(name, name_=None, **a):
    """generate_artwork.tag plus the current part, so every shape knows which part of the drawing it belongs to.

    Inside part(..., names=[...]) each fillable shape takes the next name from the list, which is how shapes drawn
    by the shared character helpers get readable names. A None entry keeps that shape as fixed line art (used for
    shapes that end up hidden behind others, such as Mia's hairband under her fringe)."""
    if _part[0]:
        a['data_part'] = _part[0]
    fillable = a.get('fill') == WHITE and a.get('stroke') not in (None, 'none', WHITE)
    if fillable and _names[0] is not None:
        if not _names[0]:
            raise BuildError(f'more fillable shapes than names in part {_part[0]}')
        given = _names[0].pop(0)
        if given is None:
            a['data_fixed'] = 'true'
        else:
            name_ = given
    if name_:
        a['data_name'] = name_
    return _original_tag(name, **a)


ga.tag = tag  # helpers in generate_artwork look tag up at call time


@contextlib.contextmanager
def part(slug, names=None):
    previous, _part[0] = _part[0], slug
    previous_names, _names[0] = _names[0], (list(names) if names is not None else None)
    try:
        yield
        if _names[0]:
            raise BuildError(f'{len(_names[0])} unused names in part {slug}: the drawing changed, update the list')
    finally:
        _part[0] = previous
        _names[0] = previous_names


def limb(st, x1, y1, x2, y2, w, color):
    """Arms and legs as closed capsules (generate_artwork draws them as thick strokes, which can't be filled)."""
    dx, dy = x2 - x1, y2 - y1
    length = math.hypot(dx, dy) or 1
    nx, ny = -dy / length * w / 2, dx / length * w / 2
    r = w / 2
    d = (f'M{fmt(x1 + nx)} {fmt(y1 + ny)} L{fmt(x2 + nx)} {fmt(y2 + ny)} '
         f'A{fmt(r)} {fmt(r)} 0 0 0 {fmt(x2 - nx)} {fmt(y2 - ny)} L{fmt(x1 - nx)} {fmt(y1 - ny)} '
         f'A{fmt(r)} {fmt(r)} 0 0 0 {fmt(x1 + nx)} {fmt(y1 + ny)}Z')
    return tag('path', d=d, **st.paint(color, None))


ga.limb = limb


LEO_NAMES = ['Tail', 'Tail tip', 'Body', 'Tummy', 'Foot', 'Foot', 'Ear', 'Ear', 'Head', 'Muzzle']
# Mia, as drawn by generate_artwork.mia() without details (no buttons or pocket), in drawing order.
MIA_BODY = ['Leg', 'Leg', 'Shoe', 'Shoe', 'Neck', 'Dress', 'Arm', 'Arm', 'Collar', 'Sleeve', 'Sleeve']
MIA_HEAD = ['Hair', 'Hair', 'Hair', 'Hair bun', None]  # the hairband is hidden behind the fringe


def mia_names(view, prop=None):
    book = ['Book cover', 'Book page', 'Book page'] if prop == 'book' else []
    ears = ['Ear', 'Ear'] if view == 'front' else ['Ear']
    return MIA_BODY + book + ['Hand', 'Hand'] + MIA_HEAD + ears + ['Face', 'Fringe', 'Mouth']


def mia_style(sw):
    return ga.Style(mode='line', sw=sw, ink=INK, details=False)


def style(sw):
    return ga.Style(mode='line', sw=sw, ink=INK)


def leo_style(sw):
    # Leo's inner-ear patches are unoutlined white details: leave them out so each ear is one clean region.
    return ga.Style(mode='line', sw=sw, ink=INK, details=False)


def P(st, name=None):
    a = st.paint(WHITE, None)
    if name:
        a['name_'] = name
    return a


# ---------------------------------------------------------------- shared pieces

def sun(st, cx, cy, r, rays=8, ray_len=.55):
    out = []
    for k in range(rays):
        a = k / rays * math.tau - math.pi / 2
        tip = (cx + math.cos(a) * r * (1.2 + ray_len), cy + math.sin(a) * r * (1.2 + ray_len))
        half = math.pi / rays * .45
        b1 = (cx + math.cos(a - half) * r * 1.08, cy + math.sin(a - half) * r * 1.08)
        b2 = (cx + math.cos(a + half) * r * 1.08, cy + math.sin(a + half) * r * 1.08)
        out.append(tag('path', d=f'M{fmt(b1[0])} {fmt(b1[1])} L{fmt(tip[0])} {fmt(tip[1])} L{fmt(b2[0])} {fmt(b2[1])}Z',
                       **P(st, 'Sun ray')))
    out.append(tag('circle', cx=cx, cy=cy, r=r, **P(st, 'Sun')))
    return ''.join(out)


def big_flower(st, x, y, r, stem, petals=6, leaf_side=1):
    out = [tag('path', d=f'M{fmt(x)} {fmt(y)} Q{fmt(x - 10 * leaf_side)} {fmt(y + stem * .5)} {fmt(x)} {fmt(y + stem)}',
               fill='none', stroke=INK, stroke_width=st.sw, stroke_linecap='round')]
    lx, ly = x - 6 * leaf_side, y + stem * .55
    out.append(tag('path', d=(f'M{fmt(lx)} {fmt(ly)} Q{fmt(lx + 60 * leaf_side)} {fmt(ly - 46)} {fmt(lx + 96 * leaf_side)} {fmt(ly - 18)} '
                              f'Q{fmt(lx + 50 * leaf_side)} {fmt(ly + 22)} {fmt(lx)} {fmt(ly)}Z'), **P(st, 'Leaf')))
    for k in range(petals):
        a = k / petals * math.tau
        px, py = x + math.cos(a) * r * .95, y + math.sin(a) * r * .95
        out.append(tag('ellipse', cx=px, cy=py, rx=r * .72, ry=r * .5,
                       transform=f'rotate({fmt(math.degrees(a))} {fmt(px)} {fmt(py)})', **P(st, 'Petal')))
    out.append(tag('circle', cx=x, cy=y, r=r * .62, **P(st, 'Flower centre')))
    return ''.join(out)


def butterfly(st, x, y, s=1.0, tilt=0):
    out = [f'<g transform="rotate({fmt(tilt)} {fmt(x)} {fmt(y)})">']
    for sgn in (-1, 1):
        out.append(tag('path', d=(f'M{fmt(x)} {fmt(y - 4 * s)} C{fmt(x + sgn * 30 * s)} {fmt(y - 52 * s)} {fmt(x + sgn * 70 * s)} {fmt(y - 34 * s)} '
                                  f'{fmt(x + sgn * 58 * s)} {fmt(y - 4 * s)} C{fmt(x + sgn * 50 * s)} {fmt(y + 10 * s)} {fmt(x + sgn * 20 * s)} {fmt(y + 6 * s)} {fmt(x)} {fmt(y)}Z'),
                       **P(st, 'Upper wing')))
        out.append(tag('path', d=(f'M{fmt(x)} {fmt(y + 2 * s)} C{fmt(x + sgn * 34 * s)} {fmt(y + 6 * s)} {fmt(x + sgn * 52 * s)} {fmt(y + 30 * s)} '
                                  f'{fmt(x + sgn * 30 * s)} {fmt(y + 44 * s)} C{fmt(x + sgn * 14 * s)} {fmt(y + 52 * s)} {fmt(x + sgn * 4 * s)} {fmt(y + 30 * s)} {fmt(x)} {fmt(y + 10 * s)}Z'),
                       **P(st, 'Lower wing')))
    out.append(tag('ellipse', cx=x, cy=y + 8 * s, rx=6 * s, ry=26 * s, fill=INK))
    out.append(tag('path', d=f'M{fmt(x - 2 * s)} {fmt(y - 16 * s)} q-10 -22 -22 -26 M{fmt(x + 2 * s)} {fmt(y - 16 * s)} q10 -22 22 -26',
                   fill='none', stroke=INK, stroke_width=st.sw * .8, stroke_linecap='round'))
    out.append('</g>')
    return ''.join(out)


def book_spine(st, x, y, w, h, kind=0, lean=0):
    """A book standing on a shelf, (x, y) bottom-left. kind picks the spine decoration."""
    top = y - h
    out = [tag('rect', x=x, y=top, width=w, height=h, rx=3, **P(st, 'Book'))]
    if kind == 0:
        out.append(tag('rect', x=x, y=top + h * .14, width=w, height=h * .1, **P(st, 'Book band')))
        out.append(tag('rect', x=x, y=top + h * .76, width=w, height=h * .1, **P(st, 'Book band')))
    elif kind == 1:
        out.append(tag('rect', x=x + w * .22, y=top + h * .3, width=w * .56, height=h * .3, rx=3, **P(st, 'Book label')))
    elif kind == 2:
        out.append(tag('circle', cx=x + w / 2, cy=top + h * .35, r=min(w * .3, 13), **P(st, 'Book badge')))
        out.append(tag('rect', x=x, y=top + h * .82, width=w, height=h * .08, **P(st, 'Book band')))
    else:
        out.append(tag('circle', cx=x + w / 2, cy=top + h * .66, r=min(w * .3, 13), **P(st, 'Book badge')))
        out.append(tag('rect', x=x, y=top + h * .84, width=w, height=h * .08, **P(st, 'Book band')))
    body = ''.join(out)
    if lean:
        pivot = (x + w, y) if lean > 0 else (x, y)
        return f'<g transform="rotate({fmt(lean)} {fmt(pivot[0])} {fmt(pivot[1])})">{body}</g>'
    return body


def lying_book(st, x, y, w, h):
    """A book lying flat, (x, y) top-left: cover with a strip of page edges."""
    return (tag('rect', x=x, y=y, width=w, height=h, rx=5, **P(st, 'Book cover'))
            + tag('rect', x=x + 10, y=y + h * .28, width=w - 10, height=h * .44, **P(st, 'Page edges'))
            + tag('path', d=f'M{fmt(x + 24)} {fmt(y + h * .5)} H{fmt(x + w - 8)}', fill='none', stroke=INK, stroke_width=st.sw * .6,
                  stroke_linecap='round'))


def svg_body(content):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">{content}</svg>'


# ---------------------------------------------------------------- sheet 1: Easy, a friendly animal

def leo_sheet():
    st = style(9)
    out = []
    with part('sky'):
        out.append(tag('rect', x=0, y=0, width=W, height=H, **P(st, 'Sky')))
    with part('sun'):
        out.append(sun(st, 960, 250, 96, rays=8))
    with part('clouds'):
        out.append(ga.cloud(st, None, 90, 250, 1.9))
        out.append(ga.cloud(st, None, 470, 140, 1.3))
    with part('hills'):
        out.append(tag('path', d='M-20 1040 Q300 930 620 1010 Q900 1080 1220 960 L1220 1520 L-20 1520Z', **P(st, 'Far hill')))
        out.append(tag('path', d='M-20 1250 Q380 1150 700 1230 Q980 1290 1220 1210 L1220 1520 L-20 1520Z', **P(st, 'Grass')))
    with part('flowers'):
        out.append(big_flower(st, 150, 1130, 42, 210, leaf_side=1))
        out.append(big_flower(st, 1070, 1180, 38, 190, leaf_side=-1))
    with part('butterfly'):
        out.append(butterfly(style(7), 250, 640, 1.5, tilt=-12))
    with part('leo', LEO_NAMES):
        s = 3.3
        out.append(ga.leo(leo_style(9 / s), None, (W - 260 * s) / 2 - 30, 1395 - 240 * s, s))
    return out


# ---------------------------------------------------------------- sheet 2: Medium, a reading corner

def reading_sheet():
    st = style(6)
    out = []
    with part('room'):
        out.append(tag('rect', x=0, y=0, width=W, height=1110, **P(st, 'Wall')))
        out.append(tag('rect', x=0, y=1110, width=W, height=H - 1110, **P(st, 'Floor')))
        out.append(tag('rect', x=-10, y=1080, width=W + 20, height=34, **P(st, 'Skirting board')))
    with part('window'):
        x, y, w, h = 80, 150, 400, 440
        out.append(tag('rect', x=x, y=y, width=w, height=h, rx=8, **P(st, 'Window frame')))
        pw, ph = (w - 66) / 2, (h - 66) / 2
        panes = [(x + 22, y + 22), (x + 44 + pw, y + 22), (x + 22, y + 44 + ph), (x + 44 + pw, y + 44 + ph)]
        for px, py in panes:
            out.append(tag('rect', x=px, y=py, width=pw, height=ph, rx=4, **P(st, 'Window pane')))
        out.append(tag('circle', cx=panes[1][0] + pw * .55, cy=panes[1][1] + ph * .45, r=46, **P(st, 'Sun')))
        out.append(ga.cloud(st, None, panes[0][0] + 22, panes[0][1] + 92, .95))
        out.append(tag('path', d=f'M{x - 40} {y - 30} H{x + w + 40}', fill='none', stroke=INK, stroke_width=10, stroke_linecap='round'))
        for side in (-1, 1):
            cx = x - 34 if side < 0 else x + w + 34
            inner = cx + side * -96
            out.append(tag('path', d=(f'M{cx} {y - 30} L{fmt(inner)} {y - 30} Q{fmt(inner + side * 30)} {y + 200} {fmt(inner + side * 52)} {y + 300} '
                                      f'Q{fmt(inner + side * 20)} {y + 420} {fmt(inner + side * -6)} {y + h + 60} L{cx} {y + h + 60}Z'),
                           **P(st, 'Curtain')))
            out.append(tag('rect', x=min(cx, inner + side * 40) - 4, y=y + 290, width=abs(inner + side * 40 - cx) + 8, height=26, rx=13,
                           **P(st, 'Curtain tie')))
        out.append(tag('rect', x=x - 26, y=y + h, width=w + 52, height=30, rx=6, **P(st, 'Window sill')))
    with part('picture'):
        out.append(tag('rect', x=540, y=230, width=150, height=190, rx=6, **P(st, 'Picture frame')))
        out.append(tag('rect', x=560, y=250, width=110, height=150, **P(st, 'Picture')))
        out.append(tag('path', d='M560 400 L600 320 L630 360 L650 330 L670 370 L670 400Z', **P(st, 'Mountain')))
        out.append(tag('circle', cx=640, cy=285, r=14, **P(st, 'Picture sun')))
    with part('shelf'):
        sx, sy, sw_, sh = 720, 210, 400, 880
        out.append(tag('rect', x=sx, y=sy, width=sw_, height=sh, rx=6, **P(st, 'Bookcase')))
        out.append(tag('rect', x=sx + 24, y=sy + 24, width=sw_ - 48, height=sh - 48, **P(st, 'Bookcase back')))
        shelves = [sy + 300, sy + 570, sy + sh - 24]
        for by in shelves:
            out.append(tag('rect', x=sx + 24, y=by - 22, width=sw_ - 48, height=22, **P(st, 'Shelf')))
    with part('books'):
        rows = [
            (shelves[0] - 22, [(46, 210, 0, 0), (38, 236, 1, 0), (52, 190, 2, 0), (40, 222, 3, 0), (44, 200, 0, -12)]),
            (shelves[1] - 22, [(42, 200, 2, 0), (50, 226, 0, 0), (36, 188, 3, 0), (46, 214, 1, 0), (40, 200, 0, 0), (44, 180, 2, 10)]),
        ]
        for base, books in rows:
            bx = sx + 34
            for bw, bh, kind, lean in books:
                if lean > 0:
                    bx += 14
                out.append(book_spine(st, bx, base, bw, bh, kind, lean))
                bx += bw + 2
        # bottom shelf: a few books on their side and a plant
        base = shelves[2] - 22
        out.append(lying_book(st, sx + 40, base - 46, 190, 46))
        out.append(lying_book(st, sx + 52, base - 88, 166, 42))
        out.append(lying_book(st, sx + 34, base - 128, 180, 40))
    with part('plant'):
        px, base = sx + 300, shelves[2] - 22
        for a, l in ((-40, 120), (-12, 150), (18, 140), (46, 110)):
            rad = math.radians(a - 90)
            tx, ty = px + math.cos(rad) * l, base - 110 + math.sin(rad) * l
            out.append(tag('path', d=(f'M{px} {base - 104} Q{fmt((px + tx) / 2 - 30)} {fmt((base - 104 + ty) / 2)} {fmt(tx)} {fmt(ty)} '
                                      f'Q{fmt((px + tx) / 2 + 30)} {fmt((base - 104 + ty) / 2 + 10)} {px} {base - 104}Z'), **P(st, 'Plant leaf')))
        out.append(tag('path', d=f'M{px - 52} {base - 112} L{px + 52} {base - 112} L{px + 40} {base} L{px - 40} {base}Z', **P(st, 'Plant pot')))
        out.append(tag('rect', x=px - 60, y=base - 128, width=120, height=24, rx=6, **P(st, 'Pot rim')))
    with part('rug'):
        out.append(tag('ellipse', cx=560, cy=1330, rx=470, ry=120, **P(st, 'Rug')))
        out.append(tag('ellipse', cx=560, cy=1330, rx=380, ry=86, **P(st, 'Rug border')))
        out.append(tag('ellipse', cx=560, cy=1330, rx=290, ry=56, **P(st, 'Rug centre')))
    with part('stack'):
        out.append(lying_book(st, 900, 1290, 230, 58))
        out.append(lying_book(st, 916, 1236, 200, 54))
        out.append(lying_book(st, 894, 1186, 216, 50))
        out.append(tag('path', d='M960 1186 L966 1104 Q1010 1094 1054 1104 L1060 1186Z', **P(st, 'Mug')))
        out.append(tag('path', d='M1056 1120 q44 4 38 34 q-6 26 -40 22 l2 -14 q24 2 26 -10 q2 -16 -24 -18Z', **P(st, 'Mug handle')))
        out.append(tag('path', d='M992 1078 q-14 -22 0 -40 q14 -18 0 -36 M1026 1078 q-14 -22 0 -40 q14 -18 0 -36', fill='none', stroke=INK,
                       stroke_width=st.sw * .8, stroke_linecap='round'))
    with part('mia', mia_names('front', 'book')):
        s = 1.3
        out.append(ga.mia(mia_style(6 / s), None, 150, 1395 - 600 * s, s, 'happy', 'front', 'hold', 'book'))
    with part('leo', LEO_NAMES):
        s = 1.25
        out.append(ga.leo(leo_style(6 / s), None, 560, 1440 - 240 * s, s))
    return out


# ---------------------------------------------------------------- sheet 3: Detailed, a storybook castle

def castle(st, cx, by):
    """A storybook castle centred on cx, standing on by. Windows, doors and battlements are separate regions."""
    out = []

    def tower(x, w, h, roof_h, flag=True, windows=2):
        top = by - h
        out.append(tag('rect', x=x, y=top, width=w, height=h, **P(st, 'Tower')))
        for k in range(windows):
            wy = top + 40 + k * 70
            if wy + 50 > by - 30:
                break
            out.append(tag('path', d=f'M{fmt(x + w / 2 - 12)} {fmt(wy + 44)} V{fmt(wy + 12)} a12 12 0 0 1 24 0 V{fmt(wy + 44)}Z',
                           **P(st, 'Tower window')))
        out.append(tag('path', d=f'M{fmt(x - 14)} {fmt(top + 2)} L{fmt(x + w / 2)} {fmt(top - roof_h)} L{fmt(x + w + 14)} {fmt(top + 2)}Z',
                       **P(st, 'Tower roof')))
        out.append(tag('rect', x=x - 14, y=top - 2, width=w + 28, height=14, rx=4, **P(st, 'Roof trim')))
        if flag:
            fx, fy = x + w / 2, top - roof_h
            out.append(tag('path', d=f'M{fmt(fx)} {fmt(fy)} V{fmt(fy - 54)}', fill='none', stroke=INK, stroke_width=st.sw, stroke_linecap='round'))
            out.append(tag('path', d=f'M{fmt(fx)} {fmt(fy - 54)} q22 -8 44 4 q-10 10 -2 20 q-20 -8 -42 2Z', **P(st, 'Flag')))

    # back keep
    kx, kw, kh = cx - 90, 180, 300
    tower(kx, kw, kh, 150, windows=0)
    out.append(tag('circle', cx=cx, cy=by - kh + 70, r=30, **P(st, 'Round window')))
    out.append(tag('path', d=f'M{cx - 30} {by - kh + 70} H{cx + 30} M{cx} {by - kh + 40} V{by - kh + 100}', fill='none', stroke=INK,
                   stroke_width=st.sw * .8))
    # side towers
    tower(cx - 250, 92, 280, 120, windows=3)
    tower(cx + 158, 92, 280, 120, windows=3)
    # front wall with battlements
    wx, ww, wh = cx - 160, 320, 170
    for k in range(8):
        out.append(tag('rect', x=wx + k * 42 + 4, y=by - wh - 30, width=28, height=34, **P(st, 'Battlement')))
    out.append(tag('rect', x=wx, y=by - wh, width=ww, height=wh, **P(st, 'Castle wall')))
    for bx, byy in ((wx + 30, by - 130), (wx + 230, by - 120), (wx + 60, by - 60), (wx + 250, by - 50)):
        out.append(tag('path', d=f'M{bx} {byy} h34 M{bx + 14} {byy + 18} h34', fill='none', stroke=INK, stroke_width=st.sw * .7,
                       stroke_linecap='round'))
    for wxx in (wx + 44, wx + ww - 80):
        out.append(tag('path', d=f'M{wxx} {by - 72} V{by - 110} a18 18 0 0 1 36 0 V{by - 72}Z', **P(st, 'Window')))
    out.append(tag('path', d=f'M{cx - 46} {by} V{by - 80} a46 46 0 0 1 92 0 V{by}Z', **P(st, 'Door arch')))
    out.append(tag('path', d=f'M{cx - 34} {by} V{by - 76} a34 34 0 0 1 68 0 V{by}Z', **P(st, 'Door')))
    out.append(tag('path', d=f'M{cx} {by} V{by - 110}', fill='none', stroke=INK, stroke_width=st.sw * .8))
    out.append(tag('circle', cx=cx + 18, cy=by - 40, r=5, fill=INK))
    return ''.join(out)


def mushroom(st, x, y, s=1.0):
    return (tag('path', d=f'M{fmt(x - 14 * s)} {fmt(y)} Q{fmt(x - 16 * s)} {fmt(y - 34 * s)} {fmt(x - 10 * s)} {fmt(y - 44 * s)} '
                          f'L{fmt(x + 10 * s)} {fmt(y - 44 * s)} Q{fmt(x + 16 * s)} {fmt(y - 34 * s)} {fmt(x + 14 * s)} {fmt(y)}Z', **P(st, 'Mushroom stem'))
            + tag('path', d=f'M{fmt(x - 46 * s)} {fmt(y - 40 * s)} Q{fmt(x - 44 * s)} {fmt(y - 92 * s)} {fmt(x)} {fmt(y - 94 * s)} '
                            f'Q{fmt(x + 44 * s)} {fmt(y - 92 * s)} {fmt(x + 46 * s)} {fmt(y - 40 * s)}Z', **P(st, 'Mushroom cap'))
            + ''.join(tag('circle', cx=x + dx * s, cy=y + dy * s, r=r * s, **P(st, 'Mushroom spot'))
                      for dx, dy, r in ((-21, -60, 10), (8, -75, 10), (25, -53, 8))))


def fence(st, x0, x1, y, h=110):
    out = [tag('rect', x=x0 - 10, y=y - h * .72, width=x1 - x0 + 20, height=18, rx=4, **P(st, 'Fence rail')),
           tag('rect', x=x0 - 10, y=y - h * .32, width=x1 - x0 + 20, height=18, rx=4, **P(st, 'Fence rail'))]
    n = int((x1 - x0) / 70) + 1
    for k in range(n):
        px = x0 + k * (x1 - x0) / (n - 1)
        out.append(tag('path', d=f'M{fmt(px - 15)} {y} V{y - h} L{fmt(px)} {y - h - 22} L{fmt(px + 15)} {y - h} V{y}Z', **P(st, 'Fence post')))
    return ''.join(out)


def apple_tree(st, x, y, s, apples):
    out = [ga.tree(st, None, x, y, s)]
    for dx, dy in apples:
        out.append(tag('circle', cx=x + dx * s, cy=y + dy * s, r=13 * s, **P(st, 'Apple')))
    return ''.join(out)


def castle_sheet():
    st = style(4)
    out = []
    with part('sky'):
        out.append(tag('rect', x=0, y=0, width=W, height=H, **P(st, 'Sky')))
    with part('sun'):
        out.append(sun(st, 1060, 150, 66, rays=12, ray_len=.5))
    with part('clouds'):
        out.append(ga.cloud(st, None, 60, 170, 1.25))
        out.append(ga.cloud(st, None, 380, 90, .9))
        out.append(ga.cloud(st, None, 780, 230, 1.05))
    with part('birds'):
        out.append(tag('path', d='M560 230 q16 -16 32 0 q16 -16 32 0 M650 190 q12 -12 24 0 q12 -12 24 0 M300 330 q12 -12 24 0 q12 -12 24 0',
                       fill='none', stroke=INK, stroke_width=st.sw, stroke_linecap='round'))
    with part('hills'):
        out.append(tag('path', d='M-20 700 Q200 540 470 610 Q700 470 930 560 Q1080 500 1220 560 L1220 1520 L-20 1520Z', **P(st, 'Far hill')))
    with part('castle'):
        out.append(castle(st, 640, 620))
    with part('hills'):
        out.append(tag('path', d='M-20 760 Q260 650 560 700 Q860 760 1220 660 L1220 1520 L-20 1520Z', **P(st, 'Castle hill')))
    with part('forest'):
        for x, y, s in ((90, 760, .62), (200, 790, .5), (1010, 740, .58), (1130, 770, .5)):
            out.append(ga.tree(st, None, x, y, s))
    with part('path'):
        out.append(tag('path', d='M612 700 Q560 780 640 840 Q760 920 600 1010 Q440 1100 560 1220 Q640 1300 560 1520 L860 1520 '
                                 'Q900 1300 780 1220 Q680 1120 800 1030 Q930 930 720 830 Q650 780 668 700Z', **P(st, 'Path')))
        for cx, cy, rx, ry in ((640, 760, 18, 8), (700, 880, 26, 11), (660, 1120, 30, 12), (640, 1200, 34, 14), (700, 1300, 40, 16), (690, 1440, 46, 18)):
            out.append(tag('ellipse', cx=cx, cy=cy, rx=rx, ry=ry, **P(st, 'Stepping stone')))
    with part('river'):
        out.append(tag('path', d='M-20 930 Q300 880 520 950 Q760 1020 1220 930 L1220 1010 Q760 1100 520 1030 Q300 960 -20 1010Z', **P(st, 'River')))
        for x, y in ((120, 960), (330, 945), (900, 1000), (1080, 965)):
            out.append(tag('path', d=f'M{x} {y} q15 -10 30 0 q15 -10 30 0', fill='none', stroke=INK, stroke_width=st.sw * .8, stroke_linecap='round'))
    with part('bridge'):
        out.append(tag('path', d='M470 1040 Q640 900 810 1040 L810 1070 L740 1070 Q640 990 540 1070 L470 1070Z', **P(st, 'Bridge')))
        out.append(tag('path', d='M462 1000 Q640 860 818 1000 L818 1018 Q640 880 462 1018Z', **P(st, 'Bridge rail')))
        for k, x in enumerate((500, 560, 620, 680, 740)):
            yy = 1000 - (1 - ((x - 640) / 178) ** 2) * 70
            out.append(tag('rect', x=x, y=yy - 2, width=12, height=44 - abs(x - 640) * .05, rx=3, **P(st, 'Bridge post')))
    with part('trees'):
        out.append(apple_tree(st, 120, 1190, .95, ((-40, -220), (30, -180), (-60, -150), (50, -250))))
        out.append(apple_tree(st, 1070, 1210, .95, ((-30, -200), (40, -240), (20, -160))))
    with part('fence'):
        out.append(fence(st, 840, 1180, 1400))
    with part('mushrooms'):
        out.append(mushroom(st, 90, 1460, 1.0))
        out.append(mushroom(st, 165, 1478, .85))
        out.append(mushroom(st, 1030, 1478, .85))
    with part('flowers'):
        for x, y in ((40, 1290), (150, 1330), (520, 1420), (480, 1290), (900, 1450), (1160, 1440), (1150, 1075), (40, 1400)):
            k = 1.7  # the stock flower is tiny at this page size; scale it up, keeping the line weight
            out.append(f'<g transform="translate({x} {y}) scale({k}) translate({-x} {-y})">'
                       + ga.flower(style(4 / k), None, x, y, C['red']) + '</g>')
    with part('mia', mia_names('three')):
        s = .9
        out.append(ga.mia(mia_style(4 / s), None, 200, 1480 - 600 * s, s, 'happy', 'three', 'wave'))
    with part('leo', LEO_NAMES):
        s = .82
        out.append(ga.leo(leo_style(4 / s), None, 830, 1305 - 240 * s, s, flip=True))
    with part('butterflies'):
        out.append(butterfly(style(3), 400, 860, .8, tilt=14))
        out.append(butterfly(style(3), 960, 840, .7, tilt=-10))
    return out


# ---------------------------------------------------------------- shared shapes for the library sheets

def pt(x, y):
    return f'{fmt(float(x))} {fmt(float(y))}'


def poly_d(points):
    return 'M' + ' L'.join(pt(x, y) for x, y in points) + 'Z'


def star_d(cx, cy, ro, ri, n=5, rot=-90):
    pts = []
    for i in range(n * 2):
        r = ro if i % 2 == 0 else ri
        a = math.radians(rot + i * 180 / n)
        pts.append((cx + math.cos(a) * r, cy + math.sin(a) * r))
    return poly_d(pts)


def heart_d(cx, cy, s):
    k = s / 2
    return (f'M{pt(cx, cy + k * .85)} C{pt(cx - k * 1.1, cy + k * .1)} {pt(cx - k * 1.05, cy - k * .85)} {pt(cx - k * .5, cy - k * .85)} '
            f'C{pt(cx - k * .2, cy - k * .85)} {pt(cx, cy - k * .6)} {pt(cx, cy - k * .38)} '
            f'C{pt(cx, cy - k * .6)} {pt(cx + k * .2, cy - k * .85)} {pt(cx + k * .5, cy - k * .85)} '
            f'C{pt(cx + k * 1.05, cy - k * .85)} {pt(cx + k * 1.1, cy + k * .1)} {pt(cx, cy + k * .85)}Z')


def leaf_d(x, y, length, width, angle):
    """A pointed leaf from its base (x, y) towards angle (degrees)."""
    a = math.radians(angle)
    dx, dy = math.cos(a), math.sin(a)
    nx, ny = -dy, dx
    tip = (x + dx * length, y + dy * length)
    c1 = (x + dx * length * .5 + nx * width, y + dy * length * .5 + ny * width)
    c2 = (x + dx * length * .5 - nx * width, y + dy * length * .5 - ny * width)
    return f'M{pt(x, y)} Q{pt(*c1)} {pt(*tip)} Q{pt(*c2)} {pt(x, y)}Z'


def half_ring_d(cx, cy, ro, ri, top=True, ry_scale=1.0):
    """Half an annulus (a rainbow band): the top half, or the bottom half."""
    sweep = 1 if top else 0
    inner = 0 if top else 1
    return (f'M{pt(cx - ro, cy)} A{fmt(float(ro))} {fmt(ro * ry_scale)} 0 0 {sweep} {pt(cx + ro, cy)} L{pt(cx + ri, cy)} '
            f'A{fmt(float(ri))} {fmt(ri * ry_scale)} 0 0 {inner} {pt(cx - ri, cy)}Z')


def crescent_d(cx, cy, r, ox, oy, orad):
    """The part of circle (cx, cy, r) outside circle (ox, oy, orad)."""
    d = math.hypot(ox - cx, oy - cy)
    a = (r * r - orad * orad + d * d) / (2 * d)
    h = math.sqrt(max(0.0, r * r - a * a))
    mx, my = cx + a * (ox - cx) / d, cy + a * (oy - cy) / d
    p1 = (mx + h * (oy - cy) / d, my - h * (ox - cx) / d)
    p2 = (mx - h * (oy - cy) / d, my + h * (ox - cx) / d)
    return f'M{pt(*p1)} A{fmt(float(r))} {fmt(float(r))} 0 1 0 {pt(*p2)} A{fmt(float(orad))} {fmt(float(orad))} 0 0 1 {pt(*p1)}Z'


def capsule_d(x1, y1, x2, y2, w):
    dx, dy = x2 - x1, y2 - y1
    length = math.hypot(dx, dy) or 1
    nx, ny = -dy / length * w / 2, dx / length * w / 2
    r = fmt(w / 2)
    return (f'M{pt(x1 + nx, y1 + ny)} L{pt(x2 + nx, y2 + ny)} A{r} {r} 0 0 0 {pt(x2 - nx, y2 - ny)} '
            f'L{pt(x1 - nx, y1 - ny)} A{r} {r} 0 0 0 {pt(x1 + nx, y1 + ny)}Z')


def line(st, d, w=None):
    return tag('path', d=d, fill='none', stroke=INK, stroke_width=w or st.sw, stroke_linecap='round', stroke_linejoin='round')


def rr(st, x, y, w, h, r, name):
    return tag('rect', x=x, y=y, width=w, height=h, rx=r, **P(st, name))


def circ(st, cx, cy, r, name):
    return tag('circle', cx=cx, cy=cy, r=r, **P(st, name))


def ell(st, cx, cy, rx, ry, name, rot=0):
    extra = {'transform': f'rotate({fmt(float(rot))} {fmt(float(cx))} {fmt(float(cy))})'} if rot else {}
    return tag('ellipse', cx=cx, cy=cy, rx=rx, ry=ry, **extra, **P(st, name))


def shape(st, d, name):
    return tag('path', d=d, **P(st, name))


def dot(cx, cy, r):
    return tag('circle', cx=cx, cy=cy, r=r, fill=INK)


def shine(cx, cy, r):
    """A small white highlight on ink (eye shine)."""
    return tag('circle', cx=cx, cy=cy, r=r, fill=WHITE)


def gores(st, cx, top, r, bottom, bw, n, name='Balloon panel'):
    """A hot-air balloon envelope split into n vertical panels. top: top of the dome; bottom: where it meets the skirt."""
    cy = top + r

    def hw(y):
        if y <= cy:
            return math.sqrt(max(0.0, r * r - (y - cy) ** 2))
        return bw + (r - bw) * math.cos((y - cy) / (bottom - cy) * math.pi / 2)

    ys = [top + (bottom - top) * i / 48 for i in range(49)]
    out = []
    for i in range(n):
        u1, u2 = -1 + 2 * i / n, -1 + 2 * (i + 1) / n
        left = [(cx + u1 * hw(y), y) for y in ys]
        right = [(cx + u2 * hw(y), y) for y in reversed(ys)]
        out.append(shape(st, poly_d(left + right), name))
    return ''.join(out)


def bg(st, name, h=H, y=0):
    return tag('rect', x=0, y=y, width=W, height=h, **P(st, name))


# ---------------------------------------------------------------- Easy: Sleepy Owl (Animals)

def owl_sheet():
    st = style(9)
    out = []
    with part('sky'):
        out.append(bg(st, 'Night sky'))
    with part('moon'):
        out.append(shape(st, crescent_d(950, 250, 120, 1000, 205, 100), 'Moon'))
    with part('stars'):
        for x, y, r in ((330, 170, 34), (560, 100, 26), (720, 250, 30), (290, 560, 24), (1080, 520, 28), (1110, 880, 24)):
            out.append(shape(st, star_d(x, y, r, r * .45), 'Star'))
    with part('clouds'):
        out.append(ga.cloud(st, None, 470, 330, 1.3))
        out.append(ga.cloud(st, None, 980, 690, 1.1))
    with part('hills'):
        out.append(shape(st, 'M-20 1290 Q300 1180 640 1260 Q930 1330 1220 1230 L1220 1520 L-20 1520Z', 'Far hill'))
        out.append(shape(st, 'M-20 1400 Q420 1320 760 1390 Q1000 1440 1220 1380 L1220 1520 L-20 1520Z', 'Near hill'))
    with part('tree'):
        out.append(shape(st, 'M-20 -20 L200 -20 Q235 700 190 1500 L-20 1500Z', 'Tree trunk'))
        out.append(line(st, 'M60 120 Q80 260 62 380 M140 520 Q156 640 138 760 M70 900 Q88 1020 72 1160 M150 1250 Q160 1330 150 1420', 6))
        out.append(ell(st, 110, 640, 34, 52, 'Knot hole'))
        out.append(shape(st, 'M170 1060 Q600 1040 1120 1086 Q1170 1100 1120 1126 Q600 1112 170 1150Z', 'Branch'))
        for x, y, a in ((250, 1062, -120), (310, 1062, -70), (900, 1080, -110), (980, 1084, -60), (1050, 1120, 40)):
            out.append(shape(st, leaf_d(x, y, 120, 34, a), 'Leaf'))
    with part('owl'):
        for sgn in (-1, 1):
            out.append(shape(st, poly_d([(560 + sgn * 200, 680), (560 + sgn * 215, 470), (560 + sgn * 90, 580)]), 'Ear tuft'))
        out.append(ell(st, 560, 830, 235, 280, 'Body'))
        for sgn in (-1, 1):
            x = 560 + sgn * 222
            out.append(shape(st, f'M{pt(x, 760)} Q{pt(x + sgn * 70, 900)} {pt(x - sgn * 20, 1060)} Q{pt(x - sgn * 90, 960)} {pt(x - sgn * 70, 820)}Z', 'Wing'))
        out.append(ell(st, 560, 945, 145, 140, 'Tummy'))
        for row, n in ((880, 3), (950, 4), (1020, 3)):
            for k in range(n):
                x = 560 + (k - (n - 1) / 2) * 62
                out.append(line(st, f'M{pt(x - 18, row)} Q{pt(x, row + 18)} {pt(x + 18, row)}', 6))
        for sgn in (-1, 1):
            out.append(circ(st, 560 + sgn * 88, 700, 98, 'Eye patch'))
        for sgn in (-1, 1):
            ex = 560 + sgn * 88
            out.append(line(st, f'M{pt(ex - 50, 702)} Q{pt(ex, 742)} {pt(ex + 50, 702)}', 9))
            for k in (-1, 0, 1):
                out.append(line(st, f'M{pt(ex + k * 30, 724 + abs(k) * -6)} l{fmt(k * 8.0)} 22', 6))
        out.append(shape(st, poly_d([(560, 752), (594, 796), (560, 852), (526, 796)]), 'Beak'))
        out.append(shape(st, 'M392 610 Q470 470 640 420 Q760 390 820 470 Q760 450 700 470 Q650 520 730 600 Q620 560 392 610Z', 'Nightcap'))
        out.append(shape(st, 'M380 640 Q560 540 744 618 L752 580 Q560 500 372 600Z', 'Cap band'))
        out.append(circ(st, 826, 486, 44, 'Pompom'))
        for fx in (480, 640):
            for k in (-1, 0, 1):
                out.append(ell(st, fx + k * 30, 1086, 18, 30, 'Toe', rot=k * 12))
    return out


# ---------------------------------------------------------------- Easy: Robot Friend (Storybook Characters)

def robot_sheet():
    st = style(9)
    out = []
    with part('room'):
        out.append(bg(st, 'Wall'))
        out.append(tag('rect', x=0, y=1270, width=W, height=H - 1270, **P(st, 'Floor')))
    with part('decorations'):
        for x, y, r in ((170, 260, 60), (240, 520, 36), (1060, 640, 46)):
            out.append(shape(st, ga.sparkle(x, y, r), 'Sparkle'))
    with part('balloon'):
        out.append(line(st, 'M905 432 Q960 400 930 350 Q900 300 940 268', 6))
        out.append(shape(st, heart_d(950, 170, 220), 'Heart balloon'))
    with part('robot'):
        out.append(line(st, 'M600 252 V200'))
        out.append(circ(st, 600, 178, 30, 'Antenna ball'))
        out.append(shape(st, capsule_d(430, 650, 300, 880, 64), 'Arm'))
        out.append(shape(st, capsule_d(770, 650, 880, 450, 64), 'Arm'))
        out.append(rr(st, 372, 330, 50, 120, 20, 'Ear'))
        out.append(rr(st, 778, 330, 50, 120, 20, 'Ear'))
        out.append(rr(st, 410, 250, 380, 280, 56, 'Head'))
        for x in (520, 680):
            out.append(circ(st, x, 375, 52, 'Eye'))
            out.append(dot(x + 6, 380, 20))
            out.append(shine(x, 372, 7))
        out.append(rr(st, 500, 445, 200, 52, 22, 'Mouth'))
        out.append(line(st, 'M550 445 V497 M600 445 V497 M650 445 V497', 6))
        out.append(rr(st, 560, 528, 80, 44, 8, 'Neck'))
        out.append(rr(st, 450, 970, 90, 210, 30, 'Leg'))
        out.append(rr(st, 660, 970, 90, 210, 30, 'Leg'))
        out.append(rr(st, 380, 562, 440, 420, 44, 'Body'))
        out.append(rr(st, 455, 625, 290, 300, 28, 'Chest panel'))
        for x in (520, 600, 680):
            out.append(circ(st, x, 690, 28, 'Button'))
        out.append(shape(st, heart_d(600, 830, 120), 'Heart'))
        out.append(rr(st, 410, 1166, 160, 84, 34, 'Foot'))
        out.append(rr(st, 630, 1166, 160, 84, 34, 'Foot'))
        out.append(circ(st, 300, 880, 50, 'Hand'))
        out.append(circ(st, 880, 450, 50, 'Hand'))
    with part('toys'):
        out.append(circ(st, 180, 1330, 96, 'Ball'))
        out.append(shape(st, 'M100 1290 Q180 1250 262 1294 Q272 1330 262 1366 Q180 1322 100 1370 Q88 1330 100 1290Z', 'Ball stripe'))
        out.append(shape(st, poly_d([(930, 1240), (1110, 1240), (1150, 1200), (970, 1200)]), 'Block top'))
        out.append(shape(st, poly_d([(1110, 1240), (1150, 1200), (1150, 1380), (1110, 1420)]), 'Block side'))
        out.append(tag('rect', x=930, y=1240, width=180, height=180, **P(st, 'Block')))
        out.append(shape(st, star_d(1020, 1334, 58, 26), 'Block star'))
    return out


# ---------------------------------------------------------------- Easy: Rocket Trip (Vehicles & Places)

def rocket_sheet():
    st = style(9)
    out = []
    with part('space'):
        out.append(bg(st, 'Space'))
    with part('stars'):
        for x, y, r in ((620, 120, 30), (1080, 210, 36), (110, 700, 28), (1100, 860, 30), (420, 1340, 26), (150, 1120, 34), (760, 1420, 22)):
            out.append(shape(st, star_d(x, y, r, r * .45), 'Star'))
    with part('planet'):
        g = '<g transform="rotate(-18 280 360)">'
        out.append(g + shape(st, half_ring_d(280, 360, 250, 190, top=True, ry_scale=.26), 'Planet ring') + '</g>')
        out.append(circ(st, 280, 360, 150, 'Planet'))
        out.append(line(st, 'M150 300 Q280 340 410 300 M140 400 Q280 440 420 400', 7))
        out.append(g + shape(st, half_ring_d(280, 360, 250, 190, top=False, ry_scale=.26), 'Planet ring') + '</g>')
    with part('moon'):
        out.append(circ(st, 1000, 1260, 140, 'Moon'))
        for x, y, r in ((950, 1210, 34), (1060, 1300, 26), (960, 1330, 18)):
            out.append(circ(st, x, y, r, 'Crater'))
    with part('rocket'):
        body = ['<g transform="rotate(24 620 760)">']
        body.append(shape(st, 'M560 1010 Q540 1110 620 1220 Q700 1110 680 1010Z', 'Flame'))
        body.append(shape(st, 'M585 1010 Q575 1080 620 1150 Q665 1080 655 1010Z', 'Inner flame'))
        body.append(shape(st, 'M520 760 Q420 840 430 990 L540 930Z', 'Fin'))
        body.append(shape(st, 'M720 760 Q820 840 810 990 L700 930Z', 'Fin'))
        body.append(shape(st, poly_d([(560, 960), (680, 960), (700, 1020), (540, 1020)]), 'Nozzle'))
        body.append(shape(st, 'M520 470 Q520 380 620 300 Q720 380 720 470 L720 940 Q620 975 520 940Z', 'Rocket body'))
        body.append(shape(st, 'M532 450 Q550 360 620 300 Q690 360 708 450 Q620 480 532 450Z', 'Nose cone'))
        body.append(circ(st, 620, 600, 78, 'Window frame'))
        body.append(circ(st, 620, 600, 54, 'Window'))
        body.append(shape(st, 'M520 780 Q620 800 720 780 L720 840 Q620 860 520 840Z', 'Stripe'))
        body.append(rr(st, 604, 870, 32, 70, 14, 'Middle fin'))
        body.append('</g>')
        out.append(''.join(body))
    return out


# ---------------------------------------------------------------- Easy: Hot-Air Balloons (Vehicles & Places)

def balloon(st, cx, top, s, panels):
    out = [gores(st, cx, top, 250 * s, top + 560 * s, 70 * s, panels)]
    by = top + 560 * s
    out.append(shape(st, poly_d([(cx - 72 * s, by), (cx + 72 * s, by), (cx + 56 * s, by + 50 * s), (cx - 56 * s, by + 50 * s)]), 'Skirt'))
    out.append(line(st, f'M{pt(cx - 50 * s, by + 50 * s)} L{pt(cx - 48 * s, by + 140 * s)} M{pt(cx + 50 * s, by + 50 * s)} L{pt(cx + 48 * s, by + 140 * s)}',
                    st.sw * .7))
    out.append(rr(st, cx - 70 * s, by + 140 * s, 140 * s, 100 * s, 12 * s, 'Basket'))
    out.append(rr(st, cx - 80 * s, by + 128 * s, 160 * s, 30 * s, 10 * s, 'Basket rim'))
    return ''.join(out)


def balloons_sheet():
    st = style(9)
    out = []
    with part('sky'):
        out.append(bg(st, 'Sky'))
    with part('sun'):
        out.append(sun(st, 170, 190, 80, rays=8))
    with part('clouds'):
        out.append(ga.cloud(st, None, 760, 140, 1.4))
        out.append(ga.cloud(st, None, 60, 620, 1.2))
        out.append(ga.cloud(st, None, 880, 760, 1.5))
    with part('hills'):
        out.append(shape(st, 'M-20 1240 Q280 1120 620 1200 Q940 1270 1220 1150 L1220 1520 L-20 1520Z', 'Far hill'))
        out.append(shape(st, 'M-20 1370 Q360 1290 700 1350 Q980 1400 1220 1330 L1220 1520 L-20 1520Z', 'Near hill'))
    with part('small-balloons'):
        out.append(balloon(st, 960, 260, .5, 4))
        out.append(balloon(st, 210, 820, .42, 4))
    with part('big-balloon'):
        out.append(balloon(st, 580, 300, 1.0, 5))
    with part('birds'):
        out.append(line(st, 'M300 420 q20 -20 40 0 q20 -20 40 0 M410 360 q14 -14 28 0 q14 -14 28 0 M960 1000 q18 -18 36 0 q18 -18 36 0', 7))
    return out


# ---------------------------------------------------------------- Easy: Open Book Adventure (Books & Reading)

def open_book_sheet():
    st = style(9)
    out = []
    with part('sky'):
        out.append(bg(st, 'Sky'))
    with part('rainbow'):
        radii = [520, 455, 390, 325, 260]
        for ro, ri in zip(radii, radii[1:]):
            out.append(shape(st, half_ring_d(600, 1020, ro, ri), 'Rainbow band'))
    with part('clouds'):
        out.append(ga.cloud(st, None, 20, 960, 2.0))
        out.append(ga.cloud(st, None, 880, 960, 2.0))
    with part('stars'):
        for x, y, r in ((160, 200, 44), (1040, 170, 40), (600, 170, 34), (330, 380, 26), (900, 400, 28)):
            out.append(shape(st, star_d(x, y, r, r * .45), 'Star'))
    with part('balloons'):
        out.append(line(st, 'M420 640 Q400 720 430 800', 6))
        out.append(ell(st, 420, 560, 62, 80, 'Balloon'))
        out.append(line(st, 'M790 590 Q820 680 790 760', 6))
        out.append(ell(st, 790, 510, 58, 76, 'Balloon'))
    with part('book'):
        out.append(shape(st, 'M60 1090 L1140 1090 L1140 1420 Q600 1380 60 1420Z', 'Book cover'))
        for sgn in (-1, 1):
            edge = 600 + sgn * 520
            out.append(shape(st, f'M600 1080 Q{pt(600 + sgn * 260, 1010)} {pt(edge, 1050)} L{pt(edge, 1370)} Q{pt(600 + sgn * 260, 1330)} {pt(600, 1400)}Z', 'Page'))
            for k in range(4):
                y = 1130 + k * 52
                x1, x2 = 600 + sgn * 70, 600 + sgn * (420 - k * 30)
                out.append(line(st, f'M{pt(x1, y)} Q{pt((x1 + x2) / 2, y - 22)} {pt(x2, y - 10)}', 5))
        out.append(shape(st, 'M640 1390 L640 1490 L670 1462 L700 1490 L700 1385Z', 'Bookmark'))
    return out


# ---------------------------------------------------------------- Easy: Book Stack (Books & Reading)

def book_stack_sheet():
    st = style(8)
    out = []
    with part('room'):
        out.append(bg(st, 'Wall'))
    with part('clock'):
        out.append(circ(st, 950, 260, 130, 'Clock'))
        out.append(circ(st, 950, 260, 100, 'Clock face'))
        out.append(line(st, 'M950 260 V195 M950 260 L995 285', 8))
        out.append(dot(950, 260, 10))
    with part('table'):
        out.append(tag('rect', x=-10, y=1180, width=W + 20, height=60, **P(st, 'Table top')))
        out.append(tag('rect', x=-10, y=1240, width=W + 20, height=280, **P(st, 'Table front')))
    with part('books'):
        books = [(170, 1060, 640, 120), (210, 950, 560, 110), (150, 850, 600, 100), (230, 740, 520, 110), (190, 640, 560, 100)]
        for x, y, w, h in books:
            out.append(rr(st, x, y, w, h, 10, 'Book cover'))
            out.append(tag('rect', x=x + w - 70, y=y + h * .22, width=56, height=h * .56, **P(st, 'Page edges')))
            out.append(rr(st, x + 60, y + h * .3, w * .4, h * .4, 8, 'Book label'))
    with part('apple'):
        out.append(shape(st, 'M470 560 Q470 520 500 510 Q470 470 432 470 Q360 470 360 545 Q362 620 430 642 Q470 650 510 642 '
                             'Q578 620 580 545 Q580 470 508 470 Q490 472 500 510Z', 'Apple'))
        out.append(line(st, 'M498 512 Q500 470 520 440', 9))
        out.append(shape(st, leaf_d(512, 470, 90, 26, -40), 'Apple leaf'))
    with part('glasses'):
        out.append(line(st, 'M592 598 L560 560 M768 598 L800 566', 7))
        out.append(circ(st, 632, 602, 40, 'Glasses lens'))
        out.append(circ(st, 728, 602, 40, 'Glasses lens'))
        out.append(line(st, 'M670 596 Q680 584 690 596', 7))
    with part('pencils'):
        for k, (x, a) in enumerate(((930, -12), (990, 4), (1050, 16))):
            g = f'<g transform="rotate({a} {x} 1050)">'
            pencil = (rr(st, x - 20, 760, 40, 260, 4, 'Pencil')
                      + shape(st, poly_d([(x - 20, 760), (x + 20, 760), (x, 700)]), 'Pencil tip')
                      + tag('path', d=poly_d([(x - 7, 721), (x + 7, 721), (x, 700)]), fill=INK))
            out.append(g + pencil + '</g>')
        out.append(shape(st, 'M880 960 L1100 960 L1080 1180 L900 1180Z', 'Pencil cup'))
        out.append(rr(st, 870, 945, 240, 34, 12, 'Cup rim'))
    return out


# ---------------------------------------------------------------- Easy: Spring Garden (Nature & Seasons)

def tulip(st, x, y, stem, lean=0):
    out = [line(st, f'M{pt(x, y)} Q{pt(x + lean, y + stem * .5)} {pt(x, y + stem)}')]
    out.append(shape(st, leaf_d(x, y + stem * .8, 170, 34, -120), 'Tulip leaf'))
    out.append(shape(st, leaf_d(x, y + stem * .7, 150, 30, -55), 'Tulip leaf'))
    out.append(shape(st, f'M{pt(x - 70, y - 100)} L{pt(x - 35, y - 50)} L{pt(x, y - 110)} L{pt(x + 35, y - 50)} L{pt(x + 70, y - 100)} '
                         f'Q{pt(x + 80, y + 10)} {pt(x, y + 14)} Q{pt(x - 80, y + 10)} {pt(x - 70, y - 100)}Z', 'Tulip'))
    return ''.join(out)


def spring_sheet():
    st = style(9)
    out = []
    with part('sky'):
        out.append(bg(st, 'Sky'))
    with part('sun'):
        out.append(circ(st, 1010, 190, 110, 'Sun'))
    with part('clouds'):
        out.append(ga.cloud(st, None, 90, 160, 1.6))
        out.append(ga.cloud(st, None, 520, 300, 1.2))
    with part('fence'):
        out.append(tag('rect', x=-10, y=770, width=W + 20, height=36, rx=8, **P(st, 'Fence rail')))
        out.append(tag('rect', x=-10, y=900, width=W + 20, height=36, rx=8, **P(st, 'Fence rail')))
        for k in range(5):
            px = 120 + k * 240
            out.append(shape(st, f'M{pt(px - 40, 1040)} V700 L{pt(px, 640)} L{pt(px + 40, 700)} V1040Z', 'Fence post'))
    with part('ground'):
        out.append(shape(st, 'M-20 1010 Q400 960 700 1000 Q980 1040 1220 990 L1220 1520 L-20 1520Z', 'Grass'))
    with part('flowers'):
        out.append(tulip(st, 230, 880, 420, lean=-20))
        out.append(tulip(st, 440, 960, 360, lean=16))
        out.append(big_flower(st, 1000, 860, 72, 440, petals=8, leaf_side=-1))
    with part('watering-can'):
        out.append(shape(st, 'M760 1225 L652 1132 L632 1176 L748 1300Z', 'Spout'))
        out.append(shape(st, poly_d([(612, 1120), (650, 1105), (672, 1190), (634, 1206)]), 'Sprinkler'))
        out.append(shape(st, 'M860 1150 Q870 1040 990 1040 Q1110 1040 1120 1150 L1080 1150 Q1075 1080 990 1080 Q905 1080 900 1150Z', 'Handle'))
        out.append(rr(st, 740, 1150, 340, 240, 30, 'Watering can'))
    with part('snail'):
        out.append(shape(st, 'M100 1420 Q100 1360 160 1360 L330 1360 Q380 1360 380 1300 Q380 1270 400 1270 Q420 1270 420 1310 Q420 1420 330 1420Z', 'Snail body'))
        out.append(circ(st, 220, 1290, 95, 'Snail shell'))
        out.append(line(st, 'M220 1290 m-20 0 a20 20 0 1 1 40 0 a40 40 0 1 1 -80 0 a60 60 0 1 1 120 0', 7))
        out.append(line(st, 'M395 1272 L380 1220 M410 1272 L430 1222', 6))
        out.append(dot(380, 1216, 8))
        out.append(dot(432, 1218, 8))
    with part('ladybird'):
        out.append(circ(st, 640, 1450, 26, 'Ladybird head'))
        out.append(ell(st, 700, 1450, 52, 44, 'Ladybird'))
        out.append(line(st, 'M700 1408 V1492', 6))
        for x, y in ((680, 1430), (722, 1436), (690, 1470), (722, 1470)):
            out.append(dot(x, y, 8))
    return out


# ---------------------------------------------------------------- more shared shapes

def ellipse_band_d(cx, cy, rx, ry, y1, y2, steps=16):
    """The slice of an ellipse between heights y1 and y2 (y1 < y2)."""
    def half(y):
        t = max(-1.0, min(1.0, (y - cy) / ry))
        return rx * math.sqrt(max(0.0, 1 - t * t))
    ys = [y1 + (y2 - y1) * i / steps for i in range(steps + 1)]
    left = [(cx - half(y), y) for y in ys]
    right = [(cx + half(y), y) for y in reversed(ys)]
    return poly_d(left + right)


def lily_pad_d(cx, cy, r, notch=0, squash=.42):
    """A lily pad: an ellipse with a wedge cut out, notch = direction of the cut in degrees."""
    a1, a2 = math.radians(notch - 16), math.radians(notch + 16)
    p1 = (cx + math.cos(a1) * r, cy + math.sin(a1) * r * squash)
    p2 = (cx + math.cos(a2) * r, cy + math.sin(a2) * r * squash)
    return f'M{pt(cx, cy)} L{pt(*p1)} A{fmt(float(r))} {fmt(r * squash)} 0 1 0 {pt(*p2)}Z'


def wave_band_d(y_top, y_bottom, amp, wavelength, phase=0.0):
    """A band of water across the page with a wavy top edge."""
    pts = []
    x = -40.0
    while x <= W + 40:
        pts.append((x, y_top + math.sin((x / wavelength) * math.tau + phase) * amp))
        x += wavelength / 8
    return poly_d(pts + [(W + 40, y_bottom), (-40, y_bottom)])


def pine(st, x, base, h, tiers=3, name='Pine tree'):
    out = [tag('rect', x=x - h * .06, y=base - h * .2, width=h * .12, height=h * .2, **P(st, 'Tree trunk'))]
    for k in range(tiers):
        top = base - h * .16 - (k + 1) * h * .78 / tiers - h * .1
        bottom = base - h * .16 - k * h * .72 / tiers
        half = h * (.34 - k * .07)
        out.append(shape(st, f'M{pt(x - half, bottom)} Q{pt(x, bottom + 14)} {pt(x + half, bottom)} L{pt(x, top)}Z', name))
    return ''.join(out)


def small_flower(st, x, y, k=1.7, sw=4):
    return (f'<g transform="translate({x} {y}) scale({k}) translate({-x} {-y})">'
            + ga.flower(style(sw / k), None, x, y, C['red']) + '</g>')


# ---------------------------------------------------------------- Medium: Pond Friends (Animals)

def frog(st, x, y, s):
    o = [f'<g transform="translate({fmt(float(x))} {fmt(float(y))}) scale({fmt(float(s))})">']
    for sgn in (-1, 1):
        o.append(ell(st, sgn * 95, 40, 70, 42, 'Back leg', rot=sgn * -20))
        o.append(ell(st, sgn * 150, 78, 54, 18, 'Back foot'))
    o.append(ell(st, 0, 0, 110, 90, 'Frog body'))
    o.append(ell(st, 0, 30, 66, 56, 'Frog tummy'))
    for sgn in (-1, 1):
        o.append(shape(st, capsule_d(sgn * 52, 30, sgn * 62, 90, 30), 'Front leg'))
        o.append(ell(st, sgn * 68, 96, 30, 13, 'Front foot'))
    o.append(ell(st, 0, -70, 100, 62, 'Frog head'))
    for sgn in (-1, 1):
        o.append(circ(st, sgn * 52, -122, 34, 'Eye bump'))
        o.append(dot(sgn * 52, -120, 14))
        o.append(shine(sgn * 52 - 5, -126, 5))
    o.append(line(st, 'M-46 -52 Q0 -18 46 -52', st.sw * .9))
    o.append('</g>')
    return ''.join(o)


def turtle(st, x, y, s):
    o = [f'<g transform="translate({fmt(float(x))} {fmt(float(y))}) scale({fmt(float(s))})">']
    for lx in (-110, 90):
        o.append(ell(st, lx, 22, 34, 26, 'Turtle leg'))
    o.append(shape(st, 'M150 -10 Q180 -20 190 -50 L210 -46 Q206 -10 160 14Z', 'Neck'))
    o.append(ell(st, 222, -64, 46, 38, 'Turtle head'))
    o.append(dot(236, -72, 7))
    o.append(line(st, 'M228 -44 Q244 -40 258 -50', st.sw * .8))
    o.append(shape(st, poly_d([(-176, 12), (-240, 26), (-176, 34)]), 'Tail'))
    o.append(shape(st, 'M-170 10 Q-160 -150 0 -160 Q160 -150 170 10Z', 'Shell'))
    o.append(shape(st, 'M-182 10 L182 10 Q180 34 150 36 L-150 36 Q-180 34 -182 10Z', 'Shell rim'))
    plates = [
        [(-40, -110), (40, -110), (70, -55), (40, -10), (-40, -10), (-70, -55)],
        [(-40, -110), (-70, -55), (-130, -60), (-118, -112), (-70, -140)],
        [(40, -110), (70, -55), (130, -60), (118, -112), (70, -140)],
        [(-70, -55), (-40, -10), (-140, -10), (-130, -60)],
        [(70, -55), (40, -10), (140, -10), (130, -60)],
    ]
    for poly in plates:
        o.append(shape(st, poly_d(poly), 'Shell plate'))
    o.append('</g>')
    return ''.join(o)


def duck(st, x, y, s, flip=False):
    sx = -s if flip else s
    o = [f'<g transform="translate({fmt(float(x))} {fmt(float(y))}) scale({fmt(float(sx))} {fmt(float(s))})">']
    o.append(shape(st, 'M-120 0 Q-150 -40 -110 -50 Q-60 -40 -20 -50 Q40 -70 90 -40 Q120 10 70 40 Q0 60 -80 40 Q-120 30 -120 0Z', 'Duck body'))
    o.append(shape(st, 'M-60 -20 Q0 -50 50 -20 Q20 20 -40 14Z', 'Wing'))
    o.append(circ(st, 80, -100, 50, 'Duck head'))
    o.append(shape(st, 'M120 -106 Q170 -110 176 -90 Q160 -76 122 -82Z', 'Beak'))
    o.append(dot(92, -112, 8))
    o.append('</g>')
    return ''.join(o)


def pond_sheet():
    st = style(6)
    out = []
    with part('sky'):
        out.append(bg(st, 'Sky'))
    with part('sun'):
        out.append(sun(st, 1040, 160, 70, rays=10))
    with part('clouds'):
        out.append(ga.cloud(st, None, 80, 140, 1.4))
        out.append(ga.cloud(st, None, 560, 90, 1.0))
    with part('trees'):
        plain = ga.Style(mode='line', sw=6, ink=INK, details=False)
        for x, sc in ((140, .9), (380, .75), (1000, .85)):
            out.append(ga.tree(plain, None, x, 640, sc))
    with part('bank'):
        out.append(shape(st, 'M-20 600 Q300 560 600 600 Q900 640 1220 590 L1220 1520 L-20 1520Z', 'Grass bank'))
    with part('pond'):
        out.append(shape(st, 'M60 820 Q120 700 420 700 Q760 690 1060 740 Q1220 790 1160 1060 Q1120 1380 760 1420 Q300 1460 120 1320 Q-20 1180 60 820Z', 'Pond water'))
        for x, y, w in ((260, 860, 70), (700, 1080, 90), (420, 1300, 80), (950, 900, 60)):
            out.append(line(st, f'M{pt(x - w, y)} Q{pt(x, y - 14)} {pt(x + w, y)}', 4))
    with part('reeds'):
        for x, a in ((70, -100), (110, -80), (1130, -90), (1160, -110)):
            out.append(shape(st, leaf_d(x, 960, 330, 22, a), 'Reed'))
        for x, top in ((90, 610), (140, 650), (1120, 600)):
            out.append(line(st, f'M{pt(x, 950)} L{pt(x, top)}', 5))
            out.append(shape(st, capsule_d(x, top + 30, x, top + 120, 30), 'Cattail'))
    with part('lily-pads'):
        for cx, cy, r, notch in ((330, 1150, 190, 70), (880, 1250, 150, 110), (1050, 870, 80, 30), (600, 1360, 90, 200), (170, 920, 80, 300)):
            out.append(shape(st, lily_pad_d(cx, cy, r, notch), 'Lily pad'))
    with part('lotus'):
        for a in (-150, -120, -90, -60, -30):
            out.append(shape(st, leaf_d(1050, 870, 70, 20, a), 'Lotus petal'))
    with part('duck'):
        out.append(duck(st, 620, 800, .9))
        out.append(duck(st, 790, 840, .45))
        out.append(duck(st, 880, 860, .45))
    with part('fish'):
        out.append(shape(st, 'M640 980 Q700 920 780 950 Q740 990 640 980Z', 'Fish'))
        out.append(shape(st, poly_d([(776, 950), (820, 920), (812, 972)]), 'Tail fin'))
        out.append(shape(st, 'M680 946 Q700 922 726 932 Z', 'Fin'))
        out.append(line(st, 'M600 1000 q10 -16 24 -6 M820 1000 q10 -14 22 -2', 4))
    with part('frog'):
        out.append(frog(st, 330, 1080, 1.0))
    with part('turtle'):
        out.append(shape(st, ga.blob(950, 1250, 130, bumps=5, amp=.08, rot=.3, squash=.45), 'Rock'))
        out.append(turtle(st, 920, 1210, .7))
    with part('dragonfly'):
        dx, dy = 690, 300
        for sgn in (-1, 1):
            out.append(ell(st, dx + sgn * 88, dy + 50, 84, 20, 'Wing', rot=sgn * -8))
            out.append(ell(st, dx + sgn * 80, dy + 92, 76, 18, 'Wing', rot=sgn * 10))
        out.append(shape(st, capsule_d(dx, dy + 40, dx, dy + 230, 20), 'Dragonfly body'))
        out.append(circ(st, dx, dy + 30, 24, 'Dragonfly head'))
        out.append(line(st, f'M{dx - 8} {dy + 8} q-10 -30 -30 -40 M{dx + 8} {dy + 8} q10 -30 30 -40', 4))
    return out


# ---------------------------------------------------------------- Medium: Friendly Dragon (Storybook Characters)

def dragon_sheet():
    st = style(6)
    out = []
    with part('sky'):
        out.append(bg(st, 'Sky'))
    with part('clouds'):
        out.append(ga.cloud(st, None, 80, 160, 1.3))
        out.append(ga.cloud(st, None, 760, 110, 1.6))
    with part('mountains'):
        for x0, peak, x1, top in ((-40, 230, 520, 520), (300, 640, 1000, 430), (760, 1000, 1260, 560)):
            out.append(shape(st, f'M{pt(x0, 960)} L{pt(peak, top)} L{pt(x1, 960)}Z', 'Mountain'))
            w = (x1 - x0) * .14
            out.append(shape(st, f'M{pt(peak - w, top + 80)} L{pt(peak, top)} L{pt(peak + w, top + 80)} L{pt(peak + w * .4, top + 64)} '
                                 f'L{pt(peak, top + 92)} L{pt(peak - w * .45, top + 66)}Z', 'Snow cap'))
    with part('hills'):
        out.append(shape(st, 'M-20 900 Q300 820 640 870 Q960 920 1220 840 L1220 1520 L-20 1520Z', 'Hill'))
    with part('castle'):
        out.append(rr(st, 1010, 690, 90, 200, 0, 'Tower'))
        out.append(shape(st, poly_d([(996, 692), (1055, 590), (1114, 692)]), 'Tower roof'))
        out.append(shape(st, 'M1018 890 V820 a37 37 0 0 1 74 0 V890Z', 'Door'))
        out.append(shape(st, 'M1043 760 V730 a12 12 0 0 1 24 0 V760Z', 'Window'))
        out.append(line(st, 'M1055 590 V545'))
        out.append(shape(st, 'M1055 545 q22 -8 40 4 q-8 10 0 20 q-18 -8 -40 0Z', 'Flag'))
    with part('ground'):
        out.append(shape(st, 'M-20 1240 Q400 1190 700 1230 Q980 1270 1220 1220 L1220 1520 L-20 1520Z', 'Meadow'))
    with part('rocks'):
        out.append(shape(st, ga.blob(150, 1400, 80, bumps=5, amp=.1, rot=.4, squash=.6), 'Rock'))
        out.append(shape(st, ga.blob(1060, 1420, 64, bumps=5, amp=.1, rot=.1, squash=.6), 'Rock'))
    with part('flowers'):
        for x, y in ((80, 1280), (300, 1440), (900, 1330), (1130, 1300)):
            out.append(small_flower(st, x, y, 1.8, 6))
    with part('dragon'):
        # wings, behind everything else of the dragon
        def wing(sx, sy, edges):
            o = []
            for (ax, ay), (bx, by) in zip(edges, edges[1:]):
                cx, cy = (ax + bx) / 2 + (sx - (ax + bx) / 2) * .25, (ay + by) / 2 + (sy - (ay + by) / 2) * .25
                o.append(shape(st, f'M{pt(sx, sy)} L{pt(ax, ay)} Q{pt(cx, cy)} {pt(bx, by)}Z', 'Wing'))
            return ''.join(o)
        out.append(wing(530, 870, [(320, 600), (230, 760), (240, 900), (360, 980)]))
        out.append(wing(660, 880, [(880, 720), (950, 850), (880, 980)]))
        # tail and its spikes
        spikes = []
        for x, y, nx, ny in ((520, 760, -.6, -.8), (560, 700, -.5, -.85), (470, 840, -.85, -.5), (430, 920, -.95, -.3),
                             (405, 1010, -1, -.1), (398, 1100, -1, .1)):
            px, py = -ny, nx
            spikes.append(shape(st, poly_d([(x + px * 26, y + py * 26), (x + nx * 62, y + ny * 62), (x - px * 26, y - py * 26)]), 'Spike'))
        out.append(''.join(spikes))
        out.append(shape(st, 'M150 1062 L110 1090 L150 980 L196 1078Z', 'Tail tip'))
        out.append(shape(st, 'M440 1220 Q260 1310 160 1190 Q120 1130 150 1066 L178 1082 Q160 1130 190 1168 Q280 1250 450 1140Z', 'Tail'))
        out.append(ell(st, 470, 1190, 92, 118, 'Leg', rot=20))
        out.append(ell(st, 700, 1190, 82, 108, 'Leg', rot=-18))
        out.append(shape(st, 'M520 860 Q520 720 600 650 L700 690 Q650 760 660 880Z', 'Neck'))
        out.append(shape(st, 'M440 1290 Q330 1150 400 960 Q450 820 570 800 Q690 820 730 960 Q790 1150 700 1290Z', 'Body'))
        bands = [870, 940, 1010, 1150, 1220, 1290]
        for y1, y2 in zip(bands, bands[1:]):
            out.append(shape(st, ellipse_band_d(580, 1080, 125, 212, y1, y2), 'Belly scale'))
        out.append(ell(st, 430, 1300, 92, 30, 'Foot'))
        out.append(ell(st, 740, 1300, 86, 30, 'Foot'))
        for x in (360, 395, 430, 680, 715, 750, 800):
            if x < 600:
                out.append(circ(st, x - 20, 1300, 15, 'Claw'))
            elif x < 790:
                out.append(circ(st, x + 40, 1300, 15, 'Claw'))
        # the book it's reading
        out.append(shape(st, capsule_d(480, 930, 520, 1010, 44), 'Arm'))
        out.append(shape(st, capsule_d(690, 930, 660, 1010, 44), 'Arm'))
        out.append(shape(st, 'M455 990 L590 1010 L725 990 L725 1100 L590 1124 L455 1100Z', 'Book cover'))
        out.append(shape(st, 'M465 996 L590 1016 L590 1112 L465 1092Z', 'Book page'))
        out.append(shape(st, 'M715 996 L590 1016 L590 1112 L715 1092Z', 'Book page'))
        for k in range(3):
            out.append(line(st, f'M{485} {1030 + k * 22} L{570} {1044 + k * 22} M{610} {1044 + k * 22} L{695} {1030 + k * 22}', 3))
        # head
        out.append(shape(st, 'M585 535 Q560 460 500 430 Q560 430 610 515Z', 'Horn'))
        out.append(shape(st, 'M640 515 Q630 430 590 395 Q650 410 668 512Z', 'Horn'))
        out.append(shape(st, leaf_d(560, 610, 110, 34, 170), 'Ear'))
        out.append(ell(st, 640, 600, 122, 96, 'Head'))
        out.append(ell(st, 770, 640, 95, 62, 'Snout'))
        out.append(dot(820, 620, 7))
        out.append(dot(796, 614, 7))
        out.append(circ(st, 650, 565, 34, 'Eye'))
        out.append(dot(662, 572, 15))
        out.append(shine(656, 565, 5))
        out.append(line(st, 'M720 690 Q770 712 830 680'))
        out.append(shape(st, ga.sparkle(880, 520, 30), 'Sparkle'))
    return out


# ---------------------------------------------------------------- Medium: Little Wizard (Storybook Characters)

def potion(st, x, y):
    return (circ(st, x, y, 56, 'Potion bottle')
            + rr(st, x - 20, y - 98, 40, 50, 6, 'Bottle neck')
            + rr(st, x - 26, y - 122, 52, 30, 10, 'Cork')
            + line(st, f'M{pt(x - 46, y + 4)} Q{pt(x, y + 24)} {pt(x + 46, y + 4)}', 4))


def wizard_sheet():
    st = style(6)
    out = []
    with part('sky'):
        out.append(bg(st, 'Night sky'))
    with part('moon'):
        out.append(shape(st, crescent_d(200, 220, 120, 250, 175, 100), 'Moon'))
    with part('stars'):
        for x, y, r in ((460, 120, 30), (720, 210, 22), (1000, 140, 36), (1120, 360, 22), (380, 380, 20), (90, 520, 24),
                        (1100, 620, 26), (860, 420, 18), (560, 300, 16), (160, 820, 20)):
            out.append(shape(st, star_d(x, y, r, r * .45), 'Star'))
    with part('hill'):
        out.append(shape(st, 'M-20 1260 Q300 1180 620 1220 Q920 1260 1220 1190 L1220 1520 L-20 1520Z', 'Hill'))
    with part('mushrooms'):
        out.append(mushroom(st, 120, 1420, 1.3))
        out.append(mushroom(st, 1135, 1390, .9))
    with part('cape'):
        out.append(shape(st, 'M500 1015 Q420 1250 350 1440 Q600 1480 850 1440 Q780 1250 700 1015Z', 'Cape'))
    names = mia_names('front')
    names[names.index('Hair bun')] = None  # hidden under the hat
    sx, sy, s = 320, 600, 1.4
    with part('wizard', names):
        out.append(ga.mia(mia_style(6 / s), None, sx, sy, s, 'happy', 'front', 'wave'))
    with part('hat'):
        k = 6 / s
        hs = style(k)
        hat = [f'<g transform="translate({sx} {sy}) scale({s})">']
        hat.append(shape(hs, 'M118 96 Q160 -20 230 -140 Q262 -172 304 -150 Q250 -126 250 -40 Q258 40 282 96Z', 'Wizard hat'))
        hat.append(shape(hs, 'M120 70 Q200 88 280 70 L286 96 Q200 114 114 96Z', 'Hat band'))
        hat.append(ell(hs, 200, 100, 126, 24, 'Hat brim'))
        hat.append(shape(hs, star_d(205, 10, 22, 10), 'Hat star'))
        hat.append(shape(hs, star_d(240, -70, 14, 6), 'Hat star'))
        hat.append(circ(hs, 308, -150, 16, 'Hat tassel'))
        hat.append(line(hs, 'M318 196 L376 104', 8))
        hat.append(shape(hs, star_d(384, 92, 30, 13), 'Wand star'))
        hat.append('</g>')
        out.append(''.join(hat))
    with part('sparkles'):
        for x, y, r in ((960, 560, 34), (1040, 780, 26), (880, 700, 20), (1120, 480, 18)):
            out.append(shape(st, ga.sparkle(x, y, r), 'Sparkle'))
    with part('spellbook'):
        out.append(lying_book(st, 820, 1320, 250, 70))
        out.append(lying_book(st, 846, 1256, 210, 64))
    with part('potion'):
        out.append(potion(st, 300, 1350))
    return out


# ---------------------------------------------------------------- Medium: Autumn Leaves (Nature & Seasons)

def pumpkin(st, x, y, s):
    o = [ell(st, x - 40 * s, y, 70 * s, 80 * s, 'Pumpkin'), ell(st, x + 40 * s, y, 70 * s, 80 * s, 'Pumpkin'),
         ell(st, x, y + 4 * s, 62 * s, 82 * s, 'Pumpkin'),
         shape(st, f'M{pt(x - 10 * s, y - 72 * s)} Q{pt(x - 14 * s, y - 110 * s)} {pt(x + 10 * s, y - 120 * s)} L{pt(x + 14 * s, y - 104 * s)} Q{pt(x + 6 * s, y - 96 * s)} {pt(x + 10 * s, y - 74 * s)}Z', 'Pumpkin stem'),
         shape(st, leaf_d(x + 8 * s, y - 100 * s, 70 * s, 22 * s, -20), 'Pumpkin leaf')]
    return ''.join(o)


def acorn(st, x, y, s=1.0, rot=0):
    return (f'<g transform="rotate({rot} {x} {y})">'
            + ell(st, x, y + 14 * s, 22 * s, 28 * s, 'Acorn')
            + shape(st, f'M{pt(x - 28 * s, y + 4 * s)} Q{pt(x - 28 * s, y - 24 * s)} {pt(x, y - 24 * s)} Q{pt(x + 28 * s, y - 24 * s)} {pt(x + 28 * s, y + 4 * s)}Z', 'Acorn cap')
            + '</g>')


def autumn_sheet():
    st = style(6)
    out = []
    with part('sky'):
        out.append(bg(st, 'Sky'))
    with part('sun'):
        out.append(sun(st, 1050, 170, 70, rays=8))
    with part('clouds'):
        out.append(ga.cloud(st, None, 620, 120, 1.4))
        out.append(ga.cloud(st, None, 900, 400, 1.0))
    with part('hills'):
        out.append(shape(st, 'M-20 1000 Q300 900 640 960 Q960 1010 1220 920 L1220 1520 L-20 1520Z', 'Far hill'))
        out.append(shape(st, 'M-20 1150 Q400 1080 760 1130 Q1000 1170 1220 1110 L1220 1520 L-20 1520Z', 'Meadow'))
    with part('tree'):
        out.append(shape(st, 'M300 1220 Q330 1000 320 860 Q260 760 160 720 L180 690 Q270 720 330 790 Q340 690 300 600 L330 590 Q380 690 372 800 '
                             'Q430 700 520 660 L536 690 Q440 740 400 860 Q392 1000 430 1220Z', 'Tree trunk'))
        for cx, cy, r in ((200, 560, 150), (380, 470, 180), (560, 580, 150), (300, 700, 120), (480, 740, 110)):
            out.append(shape(st, ga.blob(cx, cy, r, bumps=10, amp=.14, rot=cx * .01, squash=.9), 'Treetop'))
        out.append(ell(st, 360, 1050, 30, 42, 'Knot hole'))
    with part('falling-leaves'):
        for x, y, a in ((720, 520, 30), (860, 640, -40), (680, 820, 70), (960, 860, 10), (110, 960, -60), (800, 1010, 50),
                        (1080, 720, -20), (620, 380, -70)):
            bx, by = x - math.cos(math.radians(a)) * 55, y - math.sin(math.radians(a)) * 55
            out.append(shape(st, leaf_d(bx, by, 110, 38, a), 'Falling leaf'))
            out.append(line(st, f'M{pt(bx, by)} L{pt(x + math.cos(math.radians(a)) * 30, y + math.sin(math.radians(a)) * 30)}', 3))
    with part('leaf-pile'):
        out.append(shape(st, 'M440 1330 Q480 1210 600 1220 Q680 1170 760 1230 Q860 1220 880 1330Z', 'Leaf pile'))
        for x, y, a in ((520, 1270, 60), (620, 1240, -30), (720, 1265, 20), (800, 1300, -60)):
            out.append(shape(st, leaf_d(x - math.cos(math.radians(a)) * 45, y - math.sin(math.radians(a)) * 45, 90, 30, a), 'Leaf'))
    with part('rake'):
        out.append(shape(st, capsule_d(1000, 1000, 1110, 1380, 22), 'Rake handle'))
        out.append(shape(st, 'M960 960 L1080 920 L1090 950 L970 990Z', 'Rake head'))
        out.append(line(st, ''.join(f'M{pt(970 + k * 22, 985 - k * 7)} l-10 -46 ' for k in range(6)), 4))
    with part('pumpkins'):
        out.append(pumpkin(st, 1000, 1420, 1.0))
        out.append(pumpkin(st, 840, 1440, .7))
    with part('hedgehog'):
        spikes = []
        for i in range(19):
            a = math.pi + i / 18 * math.pi
            r = 130 if i % 2 == 0 else 100
            spikes.append((260 + math.cos(a) * r * 1.1, 1350 + math.sin(a) * r * .8))
        out.append(shape(st, poly_d(spikes), 'Spines'))
        out.append(shape(st, 'M330 1350 Q350 1270 420 1300 Q470 1330 470 1360 Q420 1380 330 1350Z', 'Face'))
        out.append(dot(470, 1356, 9))
        out.append(dot(415, 1316, 6))
        out.append(circ(st, 370, 1290, 16, 'Ear'))
        out.append(ell(st, 200, 1360, 34, 16, 'Foot'))
        out.append(ell(st, 330, 1366, 34, 16, 'Foot'))
    with part('acorns'):
        out.append(acorn(st, 120, 1440, 1.2, -20))
        out.append(acorn(st, 560, 1440, 1.1, 15))
        out.append(acorn(st, 640, 1460, 1.0, -10))
    return out


# ---------------------------------------------------------------- Medium: Snowy Day (Nature & Seasons)

def snowy_sheet():
    st = style(6)
    out = []
    with part('sky'):
        out.append(bg(st, 'Sky'))
    with part('snowflakes'):
        for x, y, r in ((120, 150, 34), (430, 90, 26), (760, 180, 30), (1060, 110, 38), (300, 360, 22), (980, 420, 26),
                        (620, 330, 20), (500, 520, 24)):
            out.append(shape(st, star_d(x, y, r, r * .42, n=6), 'Snowflake'))
    with part('hills'):
        out.append(shape(st, 'M-20 800 Q260 690 560 760 Q860 830 1220 720 L1220 1520 L-20 1520Z', 'Far snow hill'))
    with part('house'):
        out.append(rr(st, 880, 470, 50, 130, 0, 'Chimney'))
        out.append(rr(st, 868, 450, 74, 30, 10, 'Chimney snow'))
        out.append(tag('rect', x=640, y=640, width=340, height=230, **P(st, 'House wall')))
        out.append(shape(st, poly_d([(610, 650), (810, 470), (1010, 650)]), 'Roof'))
        out.append(shape(st, 'M600 660 Q620 640 640 650 L810 494 L980 650 Q1000 640 1020 660 Q1000 680 975 666 L810 516 L645 666 Q620 680 600 660Z', 'Roof snow'))
        out.append(shape(st, 'M770 870 V770 a40 40 0 0 1 80 0 V870Z', 'Door'))
        for x in (670, 880):
            out.append(rr(st, x, 700, 70, 70, 6, 'Window'))
            out.append(line(st, f'M{x + 35} 700 V770 M{x} 735 H{x + 70}', 4))
        out.append(line(st, 'M905 440 q-20 -40 10 -70 q30 -30 0 -70', 5))
    with part('trees'):
        out.append(pine(st, 130, 900, 380, tiers=3))
        out.append(pine(st, 330, 860, 300, tiers=3))
        out.append(pine(st, 1110, 960, 320, tiers=3))
    with part('fence'):
        out.append(tag('rect', x=740, y=990, width=300, height=24, rx=6, **P(st, 'Fence rail')))
        out.append(tag('rect', x=740, y=1050, width=300, height=24, rx=6, **P(st, 'Fence rail')))
        for k in range(3):
            px = 790 + k * 100
            out.append(shape(st, f'M{pt(px - 18, 1110)} V960 L{pt(px, 940)} L{pt(px + 18, 960)} V1110Z', 'Fence post'))
    with part('ground'):
        out.append(shape(st, 'M-20 1100 Q400 1040 700 1090 Q980 1130 1220 1070 L1220 1520 L-20 1520Z', 'Snowy ground'))
    with part('robin'):
        out.append(ell(st, 900, 950, 46, 36, 'Robin'))
        out.append(ell(st, 920, 962, 26, 22, 'Robin tummy'))
        out.append(shape(st, 'M860 942 Q880 926 910 934 Q890 960 860 942Z', 'Wing'))
        out.append(shape(st, poly_d([(944, 932), (968, 938), (944, 946)]), 'Beak'))
        out.append(dot(932, 930, 5))
        out.append(line(st, 'M900 985 V992 M912 985 V992', 4))
    with part('snowman'):
        out.append(line(st, 'M480 960 L340 860 L310 820 M360 875 L320 880 M720 960 L860 860 L890 822 M840 875 L880 882', 8))
        out.append(circ(st, 600, 1260, 190, 'Snowball'))
        out.append(circ(st, 600, 980, 140, 'Snowball'))
        out.append(circ(st, 600, 760, 100, 'Snowman head'))
        out.append(shape(st, 'M500 860 Q600 900 700 860 L706 900 Q600 942 494 900Z', 'Scarf'))
        out.append(shape(st, 'M640 896 L672 1030 L620 1036 L606 904Z', 'Scarf end'))
        out.append(shape(st, 'M600 770 L690 790 L600 800Z', 'Carrot nose'))
        out.append(dot(565, 735, 11))
        out.append(dot(635, 735, 11))
        for y in (950, 1010, 1070):
            out.append(dot(600, y, 12))
        out.append(line(st, 'M560 820 Q600 840 640 820', 5))
        out.append(rr(st, 480, 650, 240, 30, 12, 'Hat brim'))
        out.append(rr(st, 520, 540, 160, 120, 10, 'Top hat'))
        out.append(tag('rect', x=520, y=620, width=160, height=28, **P(st, 'Hat band')))
        out.append(circ(st, 312, 812, 24, 'Mitten'))
        out.append(circ(st, 892, 812, 24, 'Mitten'))
    with part('sled'):
        out.append(line(st, 'M840 1430 H1110 Q1150 1430 1150 1390', 8))
        out.append(shape(st, 'M860 1330 L1100 1330 L1080 1400 L880 1400Z', 'Sled'))
        out.append(line(st, 'M900 1400 V1430 M1060 1400 V1430', 8))
    return out


# ---------------------------------------------------------------- Medium: Harbour Lighthouse (Vehicles & Places)

def sailboat(st, x, y, s, flip=False):
    sx = -s if flip else s
    o = [f'<g transform="translate({fmt(float(x))} {fmt(float(y))}) scale({fmt(float(sx))} {fmt(float(s))})">']
    o.append(rr(st, -8, -380, 16, 380, 4, 'Mast'))
    o.append(shape(st, 'M-14 -370 Q-150 -200 -190 -30 L-14 -30Z', 'Main sail'))
    o.append(shape(st, 'M14 -330 Q110 -180 150 -30 L14 -30Z', 'Front sail'))
    o.append(shape(st, 'M8 -380 L70 -366 L8 -350Z', 'Flag'))
    o.append(shape(st, 'M-230 -10 L230 -10 Q200 70 150 80 L-150 80 Q-200 70 -230 -10Z', 'Hull'))
    o.append(shape(st, 'M-218 14 L218 14 Q212 30 206 36 L-206 36 Q-212 30 -218 14Z', 'Hull stripe'))
    for cx in (-80, 0, 80):
        o.append(circ(st, cx, 56, 16, 'Porthole'))
    o.append('</g>')
    return ''.join(o)


def harbour_sheet():
    st = style(6)
    out = []
    with part('sky'):
        out.append(bg(st, 'Sky'))
    with part('sun'):
        out.append(sun(st, 170, 180, 70, rays=8))
    with part('clouds'):
        out.append(ga.cloud(st, None, 420, 120, 1.3))
        out.append(ga.cloud(st, None, 700, 300, 1.0))
    with part('far-hills'):
        out.append(shape(st, 'M-20 820 Q160 700 360 760 Q520 700 700 790 L700 860 L-20 860Z', 'Far hill'))
    with part('sea'):
        out.append(shape(st, wave_band_d(820, 1530, 10, 160), 'Far water'))
        out.append(shape(st, wave_band_d(1020, 1530, 14, 200, 1), 'Water'))
        out.append(shape(st, wave_band_d(1260, 1530, 18, 240, 2), 'Near water'))
    with part('cliff'):
        out.append(shape(st, 'M760 1530 L790 1100 Q800 940 860 880 L1220 860 L1220 1530Z', 'Cliff'))
        out.append(shape(st, 'M840 900 Q860 850 920 840 L1220 830 L1220 880 L860 900Z', 'Grass'))
        for x, y in ((900, 1060), (1000, 1200), (880, 1300), (1100, 1050)):
            out.append(line(st, f'M{pt(x, y)} q30 -20 60 0', 4))
    with part('lighthouse'):
        tx, top, base = 1040, 420, 860
        def width_at(y):
            return 70 + (y - top) / (base - top) * 40
        bands = [top, top + 88, top + 176, top + 264, top + 352, base]
        for y1, y2 in zip(bands, bands[1:]):
            out.append(shape(st, poly_d([(tx - width_at(y1), y1), (tx + width_at(y1), y1), (tx + width_at(y2), y2), (tx - width_at(y2), y2)]), 'Lighthouse stripe'))
        out.append(shape(st, f'M{tx - 26} {base} V{base - 90} a26 26 0 0 1 52 0 V{base}Z', 'Door'))
        out.append(shape(st, f'M{tx - 16} 600 V570 a16 16 0 0 1 32 0 V600Z', 'Window'))
        out.append(tag('rect', x=tx - 92, y=top - 24, width=184, height=28, rx=6, **P(st, 'Balcony')))
        out.append(tag('rect', x=tx - 56, y=top - 130, width=112, height=106, **P(st, 'Lamp room')))
        out.append(line(st, f'M{tx - 20} {top - 130} V{top - 24} M{tx + 20} {top - 130} V{top - 24}', 4))
        out.append(shape(st, poly_d([(tx - 76, top - 128), (tx, top - 210), (tx + 76, top - 128)]), 'Lighthouse roof'))
        out.append(circ(st, tx, top - 222, 14, 'Roof knob'))
    with part('house'):
        out.append(tag('rect', x=860, y=760, width=100, height=90, **P(st, 'Cottage')))
        out.append(shape(st, poly_d([(848, 764), (910, 700), (972, 764)]), 'Cottage roof'))
        out.append(rr(st, 882, 790, 30, 30, 4, 'Cottage window'))
    with part('pier'):
        for x in (40, 160, 280, 400):
            out.append(rr(st, x, 1040, 34, 260, 6, 'Pier post'))
        out.append(tag('rect', x=-20, y=1010, width=470, height=40, **P(st, 'Pier deck')))
    with part('boats'):
        out.append(sailboat(st, 560, 1180, .9))
        out.append(sailboat(st, 300, 920, .38, flip=True))
    with part('buoy'):
        out.append(shape(st, 'M640 1370 Q640 1300 680 1290 Q720 1300 720 1370Z', 'Buoy'))
        out.append(tag('rect', x=628, y=1360, width=104, height=34, rx=10, **P(st, 'Buoy base')))
        out.append(circ(st, 680, 1272, 18, 'Buoy light'))
    with part('rocks'):
        out.append(shape(st, ga.blob(760, 1460, 70, bumps=5, amp=.1, squash=.6), 'Rock'))
        out.append(shape(st, ga.blob(120, 1440, 90, bumps=5, amp=.1, rot=.5, squash=.55), 'Rock'))
    with part('gulls'):
        out.append(line(st, 'M520 520 q20 -20 40 0 q20 -20 40 0 M640 470 q16 -16 32 0 q16 -16 32 0 M330 600 q14 -14 28 0 q14 -14 28 0', 5))
    return out


# ---------------------------------------------------------------- Medium: Shape Train (Learn & Play)

def wheel(st, x, y, r):
    return circ(st, x, y, r, 'Wheel') + circ(st, x, y, r * .38, 'Hub')


def shape_train_sheet():
    st = style(6)
    out = []
    with part('sky'):
        out.append(bg(st, 'Sky'))
    with part('sun'):
        out.append(sun(st, 1060, 160, 66, rays=10))
    with part('clouds'):
        out.append(ga.cloud(st, None, 90, 120, 1.3))
        out.append(ga.cloud(st, None, 520, 220, 1.0))
    with part('hills'):
        out.append(shape(st, 'M-20 900 Q300 780 640 860 Q960 930 1220 820 L1220 1520 L-20 1520Z', 'Hill'))
    with part('ground'):
        out.append(shape(st, 'M-20 1100 Q600 1070 1220 1100 L1220 1520 L-20 1520Z', 'Ground'))
    with part('track'):
        for k in range(12):
            x = -10 + k * 104
            out.append(shape(st, poly_d([(x, 1140), (x + 60, 1140), (x + 70, 1190), (x - 10, 1190)]), 'Sleeper'))
        out.append(line(st, 'M-20 1150 H1220 M-20 1172 H1220', 6))
    with part('smoke'):
        for x, y, r in ((1010, 520, 50), (930, 420, 64), (820, 340, 76)):
            out.append(shape(st, ga.blob(x, y, r, bumps=6, amp=.12, rot=x * .01), 'Smoke puff'))
    cars = [(530, ['circle', 'triangle']), (280, ['square', 'star']), (30, ['heart', 'diamond'])]
    for i, (x, cargo) in enumerate(cars):
        with part(f'car{i + 1}'):
            out.append(rr(st, x + 220, 1020, 70, 22, 6, 'Coupler'))
            for k, kind in enumerate(cargo):
                cx = x + 60 + k * 100
                if kind == 'circle':
                    out.append(circ(st, cx, 900, 52, 'Circle'))
                elif kind == 'triangle':
                    out.append(shape(st, poly_d([(cx - 56, 950), (cx + 56, 950), (cx, 846)]), 'Triangle'))
                elif kind == 'square':
                    out.append(tag('rect', x=cx - 48, y=854, width=96, height=96, **P(st, 'Square')))
                elif kind == 'star':
                    out.append(shape(st, star_d(cx, 896, 62, 26), 'Star'))
                elif kind == 'heart':
                    out.append(shape(st, heart_d(cx, 896, 110), 'Heart'))
                else:
                    out.append(shape(st, poly_d([(cx, 840), (cx + 46, 896), (cx, 952), (cx - 46, 896)]), 'Diamond'))
            out.append(rr(st, x, 940, 230, 120, 10, 'Train car'))
            out.append(tag('rect', x=x - 10, y=930, width=250, height=24, rx=8, **P(st, 'Car rim')))
            out.append(wheel(st, x + 55, 1102, 48))
            out.append(wheel(st, x + 175, 1102, 48))
    with part('engine'):
        out.append(rr(st, 780, 760, 150, 220, 8, 'Cab'))
        out.append(rr(st, 760, 730, 190, 40, 10, 'Cab roof'))
        out.append(rr(st, 810, 800, 90, 80, 8, 'Cab window'))
        out.append(rr(st, 930, 830, 200, 150, 40, 'Boiler'))
        out.append(shape(st, 'M990 830 L980 640 L1050 640 L1040 830Z', 'Chimney'))
        out.append(rr(st, 966, 610, 98, 36, 10, 'Chimney top'))
        out.append(circ(st, 1130, 905, 34, 'Headlight'))
        out.append(shape(st, poly_d([(1120, 980), (1180, 980), (1120, 1060)]), 'Cowcatcher'))
        out.append(tag('rect', x=770, y=975, width=370, height=40, **P(st, 'Engine base')))
        out.append(wheel(st, 850, 1070, 80))
        out.append(wheel(st, 1000, 1090, 60))
        out.append(wheel(st, 1100, 1100, 50))
    return out


# ---------------------------------------------------------------- Medium: Music Time (Learn & Play)

def music_sheet():
    st = style(6)
    out = []
    with part('room'):
        out.append(bg(st, 'Wall'))
        out.append(tag('rect', x=0, y=1180, width=W, height=H - 1180, **P(st, 'Floor')))
    with part('bunting'):
        out.append(line(st, 'M-20 120 Q600 300 1220 120', 5))
        for k in range(9):
            t = (k + .5) / 9
            x = -20 + t * 1240
            y = 120 + 360 * t * (1 - t)
            out.append(shape(st, poly_d([(x - 44, y - 4), (x + 44, y + 4), (x, y + 96)]), 'Flag'))
    with part('notes'):
        notes = [(180, 470), (300, 400), (930, 420), (1050, 520), (600, 330)]
        for x, y in notes:
            out.append(line(st, f'M{x + 24} {y} V{y - 120}', 6))
            out.append(ell(st, x, y, 30, 22, 'Note', rot=-20))
        out.append(line(st, 'M204 350 L324 280 M954 300 Q990 330 1000 360', 10))
    with part('tambourine'):
        out.append(circ(st, 600, 600, 120, 'Tambourine'))
        out.append(circ(st, 600, 600, 92, 'Drum skin'))
        for k in range(6):
            a = k / 6 * math.tau
            out.append(circ(st, 600 + math.cos(a) * 106, 600 + math.sin(a) * 106, 14, 'Jingle'))
    with part('guitar'):
        g = '<g transform="rotate(-14 330 900)">'
        parts_ = [
            rr(st, 300, 380, 60, 360, 8, 'Guitar neck'),
            shape(st, 'M290 390 L280 300 Q330 270 380 300 L370 390Z', 'Headstock'),
            shape(st, 'M330 700 Q440 700 440 800 Q440 850 400 880 Q470 920 470 1020 Q470 1150 330 1150 Q190 1150 190 1020 Q190 920 260 880 Q220 850 220 800 Q220 700 330 700Z', 'Guitar body'),
            circ(st, 330, 900, 48, 'Sound hole'),
            rr(st, 280, 1040, 100, 30, 8, 'Bridge'),
            line(st, 'M318 300 V1050 M330 300 V1050 M342 300 V1050', 2.5),
        ]
        for y in (320, 350):
            parts_.append(circ(st, 268, y, 12, 'Tuning peg'))
            parts_.append(circ(st, 392, y, 12, 'Tuning peg'))
        out.append(g + ''.join(parts_) + '</g>')
    with part('maracas'):
        for x, a in ((1000, 20), (1110, -10)):
            m = (f'<g transform="rotate({a} {x} 900)">' + shape(st, capsule_d(x, 900, x, 1080, 30), 'Maraca handle')
                 + ell(st, x, 840, 66, 90, 'Maraca') + shape(st, ellipse_band_d(x, 840, 66, 90, 820, 860), 'Maraca stripe') + '</g>')
            out.append(m)
    with part('xylophone'):
        out.append(shape(st, capsule_d(90, 1200, 640, 1150, 30), 'Frame'))
        out.append(shape(st, capsule_d(90, 1420, 640, 1370, 30), 'Frame'))
        for k in range(7):
            x = 110 + k * 74
            h = 300 - k * 26
            cy = 1300 - k * 5
            out.append(rr(st, x, cy - h / 2, 58, h, 12, 'Xylophone bar'))
            out.append(dot(x + 29, cy - h / 2 + 22, 6))
            out.append(dot(x + 29, cy + h / 2 - 22, 6))
        for x1, y1, x2, y2 in ((180, 1480, 360, 1440), (300, 1500, 470, 1470)):
            out.append(shape(st, capsule_d(x1, y1, x2, y2, 14), 'Mallet'))
            out.append(circ(st, x2 + 14, y2 - 4, 22, 'Mallet head'))
    with part('drum'):
        cx, top, bot, rx, ry = 920, 1180, 1400, 210, 56
        out.append(shape(st, f'M{cx - rx} {top} L{cx - rx} {bot} A{rx} {ry} 0 0 0 {cx + rx} {bot} L{cx + rx} {top}Z', 'Drum'))
        zig_top, zig_bot = top + 40, bot - 20
        xs = [cx - rx + k * rx / 3 for k in range(7)]
        for k in range(6):
            a, b = xs[k], xs[k + 1]
            if k % 2 == 0:
                out.append(shape(st, poly_d([(a, zig_top), (b, zig_top), ((a + b) / 2, zig_bot)]), 'Drum triangle'))
            else:
                out.append(shape(st, poly_d([(a, zig_bot), (b, zig_bot), ((a + b) / 2, zig_top)]), 'Drum triangle'))
        out.append(shape(st, f'M{cx - rx - 8} {bot - 30} A{rx + 8} {ry + 4} 0 0 0 {cx + rx + 8} {bot - 30} L{cx + rx + 8} {bot - 4} A{rx + 8} {ry + 4} 0 0 1 {cx - rx - 8} {bot - 4}Z', 'Drum rim'))
        out.append(ell(st, cx, top, rx, ry, 'Drum top'))
        for x1, y1, x2, y2 in ((760, 1060, 900, 1150), (1100, 1040, 960, 1150)):
            out.append(shape(st, capsule_d(x1, y1, x2, y2, 16), 'Drumstick'))
            out.append(circ(st, x1, y1, 20, 'Stick tip'))
    return out


# ---------------------------------------------------------------- Detailed: Farmyard (Animals)

def chicken(st, x, y, s=1.0, flip=False):
    sx = -s if flip else s
    o = [f'<g transform="translate({fmt(float(x))} {fmt(float(y))}) scale({fmt(float(sx))} {fmt(float(s))})">']
    o.append(line(st, 'M-10 40 V76 l-12 6 M14 40 V76 l12 6', st.sw))
    o.append(shape(st, 'M-70 -10 Q-90 -60 -60 -70 Q-40 -40 -30 -40 Q20 -40 40 -20 Q60 10 40 40 Q0 60 -40 40 Q-70 30 -70 -10Z', 'Chicken'))
    o.append(shape(st, 'M-40 0 Q0 -24 24 4 Q0 30 -40 0Z', 'Wing'))
    o.append(shape(st, 'M30 -60 Q36 -84 46 -70 Q52 -90 60 -70 Q70 -84 72 -60Z', 'Comb'))
    o.append(circ(st, 50, -40, 26, 'Chicken head'))
    o.append(shape(st, poly_d([(72, -46), (94, -38), (72, -30)]), 'Beak'))
    o.append(shape(st, 'M66 -28 Q74 -10 62 -10 Q56 -18 60 -28Z', 'Wattle'))
    o.append(dot(56, -46, 4))
    o.append('</g>')
    return ''.join(o)


def chick(st, x, y, s=1.0):
    return (ell(st, x, y, 30 * s, 24 * s, 'Chick') + circ(st, x + 22 * s, y - 22 * s, 17 * s, 'Chick head')
            + shape(st, poly_d([(x + 34 * s, y - 29 * s), (x + 55 * s, y - 20 * s), (x + 34 * s, y - 12 * s)]), 'Beak')
            + dot(x + 26 * s, y - 26 * s, 3))


def farm_sheet():
    st = style(4)
    out = []
    with part('sky'):
        out.append(bg(st, 'Sky'))
    with part('sun'):
        out.append(sun(st, 1060, 150, 62, rays=12, ray_len=.5))
    with part('clouds'):
        out.append(ga.cloud(st, None, 80, 110, 1.2))
        out.append(ga.cloud(st, None, 470, 160, .9))
        out.append(ga.cloud(st, None, 760, 80, 1.1))
    with part('hills'):
        out.append(shape(st, 'M-20 740 Q260 620 560 690 Q860 760 1220 640 L1220 1520 L-20 1520Z', 'Far hill'))
        out.append(shape(st, 'M640 820 Q900 740 1220 790 L1220 1520 L640 1520Z', 'Field'))
        for k in range(6):
            y = 820 + k * 30
            out.append(line(st, f'M{760 + k * 10} {y + 20} Q980 {y - 10} 1220 {y + 6}', 3))
    with part('trees'):
        plain = ga.Style(mode='line', sw=4, ink=INK, details=False)
        out.append(ga.tree(plain, None, 1100, 860, .55))
        out.append(ga.tree(plain, None, 90, 820, .5))
    with part('barn'):
        roof = [(160, 620), (230, 500), (390, 430), (550, 500), (620, 620)]

        def top_at(x):
            for (x1, y1), (x2, y2) in zip(roof, roof[1:]):
                if x1 <= x <= x2:
                    return y1 + (y2 - y1) * (x - x1) / (x2 - x1)
            return roof[-1][1]
        xs = [160 + k * 46 for k in range(11)]
        for a, b in zip(xs, xs[1:]):
            mids = [(x, y) for x, y in roof if a < x < b]
            out.append(shape(st, poly_d([(a, 1000), (a, top_at(a))] + mids + [(b, top_at(b)), (b, 1000)]), 'Barn plank'))
        outer = [(136, 640), (212, 486), (390, 404), (568, 486), (644, 640)]
        out.append(shape(st, poly_d(outer + list(reversed(roof))), 'Barn roof'))
        out.append(tag('rect', x=345, y=530, width=90, height=74, **P(st, 'Loft frame')))
        for px, py in ((353, 538), (393, 538), (353, 571), (393, 571)):
            out.append(tag('rect', x=px, y=py, width=34, height=27, **P(st, 'Loft pane')))
        out.append(tag('rect', x=290, y=750, width=200, height=250, **P(st, 'Door frame')))
        for lx in (302, 390):
            l, r, t, b = lx, lx + 88, 762, 1000
            c = ((l + r) / 2, (t + b) / 2)
            for tri in (((l, t), (r, t)), ((r, t), (r, b)), ((l, b), (r, b)), ((l, t), (l, b))):
                out.append(shape(st, poly_d([tri[0], tri[1], c]), 'Door panel'))
        out.append(tag('rect', x=160, y=640, width=460, height=24, **P(st, 'Barn trim')))
    with part('hay'):
        for x in (-10, 130):
            out.append(rr(st, x, 920, 120, 86, 10, 'Hay bale'))
            out.append(ell(st, x + 120, 963, 20, 43, 'Hay bale end'))
    with part('silo'):
        bands = [560, 640, 720, 800, 880, 960, 1000]
        out.append(shape(st, 'M650 562 Q650 470 705 470 Q760 470 760 562Z', 'Silo dome'))
        out.append(circ(st, 705, 462, 12, 'Silo cap'))
        for y1, y2 in zip(bands, bands[1:]):
            out.append(tag('rect', x=650, y=y1, width=110, height=y2 - y1, **P(st, 'Silo band')))
    with part('fence'):
        out.append(tag('rect', x=770, y=930, width=450, height=18, rx=4, **P(st, 'Fence rail')))
        out.append(tag('rect', x=770, y=980, width=450, height=18, rx=4, **P(st, 'Fence rail')))
        for k in range(7):
            px = 790 + k * 68
            out.append(shape(st, f'M{px - 12} 1030 V912 L{px} 896 L{px + 12} 912 V1030Z', 'Fence post'))
    with part('yard'):
        out.append(shape(st, 'M-20 1010 Q600 990 1220 1030 L1220 1520 L-20 1520Z', 'Farmyard'))
        out.append(shape(st, 'M300 1000 L480 1000 Q520 1200 640 1520 L160 1520 Q260 1200 300 1000Z', 'Path'))
        for x, y in ((380, 1100), (330, 1240), (450, 1300), (300, 1420), (520, 1440)):
            out.append(ell(st, x, y, 26, 12, 'Pebble'))
    with part('trough'):
        out.append(shape(st, 'M40 1110 L270 1110 L250 1180 L60 1180Z', 'Trough'))
        out.append(ell(st, 155, 1110, 115, 16, 'Water'))
    with part('cow'):
        out.append(line(st, 'M1000 1090 Q1040 1150 1030 1220', 6))
        out.append(shape(st, leaf_d(1030, 1214, 46, 14, 100), 'Tail tuft'))
        for lx in (725, 790, 900, 960):
            out.append(tag('rect', x=lx, y=1180, width=40, height=130, rx=10, **P(st, 'Cow leg')))
            out.append(tag('rect', x=lx - 2, y=1290, width=44, height=30, rx=6, **P(st, 'Hoof')))
        out.append(rr(st, 700, 1050, 310, 170, 72, 'Cow body'))
        out.append(ell(st, 880, 1226, 36, 20, 'Udder'))
        for cx, cy, r, rot in ((790, 1100, 46, .2), (930, 1140, 40, 1.1), (980, 1080, 26, .5)):
            out.append(shape(st, ga.blob(cx, cy, r, bumps=5, amp=.18, rot=rot, squash=.8), 'Cow spot'))
        out.append(shape(st, 'M640 990 Q610 960 618 940 Q640 960 656 984Z', 'Horn'))
        out.append(shape(st, 'M720 990 Q750 960 742 940 Q720 960 704 984Z', 'Horn'))
        out.append(ell(st, 610, 1010, 40, 18, 'Cow ear', rot=-20))
        out.append(ell(st, 750, 1010, 40, 18, 'Cow ear', rot=20))
        out.append(ell(st, 680, 1050, 66, 78, 'Cow head'))
        out.append(ell(st, 680, 1110, 60, 38, 'Muzzle'))
        out.append(dot(658, 1110, 7))
        out.append(dot(702, 1110, 7))
        out.append(dot(654, 1040, 8))
        out.append(dot(706, 1040, 8))
        out.append(shape(st, 'M640 1160 L720 1160 L716 1186 L644 1186Z', 'Collar'))
        out.append(shape(st, 'M668 1186 L692 1186 L700 1222 Q680 1236 660 1222Z', 'Cow bell'))
    with part('pig'):
        for lx in (150, 200, 300, 350):
            out.append(tag('rect', x=lx, y=1370, width=34, height=60, rx=8, **P(st, 'Pig leg')))
        out.append(line(st, 'M402 1310 q30 -10 24 -34 q-8 -20 -24 -4', 5))
        out.append(ell(st, 260, 1330, 150, 90, 'Pig body'))
        out.append(shape(st, poly_d([(118, 1236), (100, 1180), (150, 1214)]), 'Pig ear'))
        out.append(circ(st, 140, 1290, 70, 'Pig head'))
        out.append(shape(st, poly_d([(166, 1230), (196, 1184), (196, 1240)]), 'Pig ear'))
        out.append(ell(st, 90, 1310, 30, 24, 'Snout'))
        out.append(dot(82, 1310, 5))
        out.append(dot(98, 1310, 5))
        out.append(dot(130, 1270, 6))
        out.append(line(st, 'M110 1344 Q130 1356 150 1344', 4))
    with part('chickens'):
        out.append(chicken(st, 560, 1290, 1.0))
        out.append(chicken(st, 720, 1400, 1.1, flip=True))
        out.append(chicken(st, 1000, 1400, .9))
    with part('chicks'):
        out.append(chick(st, 580, 1430, 1.0))
        out.append(chick(st, 650, 1470, .9))
        out.append(chick(st, 860, 1460, 1.0))
    with part('flowers'):
        for x, y in ((40, 1080), (1140, 1110), (1100, 1260), (40, 1460), (1160, 1460), (440, 1080)):
            out.append(small_flower(st, x, y, 1.5, 4))
    return out


# ---------------------------------------------------------------- Detailed: Bookshelf (Books & Reading)

def bookshelf_sheet():
    st = style(4)
    out = []
    with part('room'):
        out.append(bg(st, 'Wall'))
        out.append(tag('rect', x=0, y=1300, width=W, height=H - 1300, **P(st, 'Floor')))
        out.append(tag('rect', x=-10, y=1280, width=W + 20, height=26, **P(st, 'Skirting board')))
        for k in range(7):
            out.append(line(st, f'M{-20 + k * 200} 1500 L{120 + k * 200} 1306', 3))
    with part('picture'):
        out.append(rr(st, 960, 180, 200, 160, 6, 'Picture frame'))
        out.append(tag('rect', x=978, y=198, width=164, height=124, **P(st, 'Picture')))
        out.append(shape(st, 'M978 322 L1030 250 L1060 286 L1090 240 L1142 322Z', 'Mountain'))
        out.append(circ(st, 1110, 225, 14, 'Picture sun'))
    with part('bookcase'):
        out.append(rr(st, 130, 220, 780, 1070, 8, 'Bookcase'))
        out.append(tag('rect', x=160, y=250, width=720, height=1010, **P(st, 'Bookcase back')))
        shelves = [480, 720, 960, 1200]
        for y in shelves:
            out.append(tag('rect', x=160, y=y - 20, width=720, height=20, **P(st, 'Shelf')))
        out.append(tag('rect', x=150, y=1240, width=740, height=40, **P(st, 'Plinth')))
    with part('books'):
        rows = [
            (460, [(38, 190, 0), (44, 176, 1), (32, 160, 2), (40, 196, 3), (46, 170, 0), (36, 186, 2), (42, 150, 1), (34, 180, 3)]),
            (700, [(40, 180, 2), (36, 196, 0), (48, 170, 1), (34, 160, 3), (40, 190, 0), (44, 176, 2), (38, 186, 1), (42, 166, 3),
                   (36, 196, 0), (46, 176, 2), (34, 150, 1), (40, 184, 0)]),
            (940, [(46, 196, 1), (38, 170, 3), (42, 186, 0), (36, 150, 2), (44, 196, 1), (40, 170, 0), (36, 180, 3), (42, 160, 2),
                   (38, 190, 1), (44, 176, 0), (36, 166, 3), (40, 186, 2)]),
        ]
        for base, books in rows:
            bx = 176
            for bw, bh, kind in books:
                out.append(book_spine(st, bx, base, bw, bh, kind))
                bx += bw + 3
        out.append(book_spine(st, 176 + 40 * 8 + 30, 460, 40, 170, 1, lean=-14))
        for k, (bw, bh, kind) in enumerate(((36, 180, 0), (40, 166, 2), (34, 190, 3))):
            out.append(book_spine(st, 600 + k * 40, 460, bw, bh, kind))
        # bottom shelf: books lying in stacks
        out.append(lying_book(st, 180, 1130, 230, 50))
        out.append(lying_book(st, 196, 1084, 200, 46))
        out.append(lying_book(st, 186, 1040, 214, 44))
        out.append(lying_book(st, 440, 1130, 200, 50))
        out.append(lying_book(st, 452, 1084, 180, 46))
    with part('globe'):
        out.append(shape(st, 'M760 460 L840 460 L820 440 L780 440Z', 'Globe stand'))
        out.append(line(st, 'M800 440 V420'))
        out.append(circ(st, 800, 350, 72, 'Globe'))
        out.append(shape(st, 'M760 320 Q780 290 810 300 Q830 330 800 350 Q770 360 760 320Z', 'Land'))
        out.append(shape(st, 'M806 380 Q830 360 850 380 Q846 410 820 412 Q800 404 806 380Z', 'Land'))
        out.append(line(st, 'M728 350 A72 72 0 0 0 872 350', 3))
    with part('plant'):
        px, base = 820, 700
        for a, l in ((-50, 110), (-20, 140), (10, 130), (40, 100), (-75, 80)):
            out.append(shape(st, leaf_d(px, base - 70, l, 22, a - 90), 'Plant leaf'))
        out.append(shape(st, f'M{px - 44} {base - 80} L{px + 44} {base - 80} L{px + 34} {base} L{px - 34} {base}Z', 'Plant pot'))
    with part('clock'):
        out.append(rr(st, 760, 820, 100, 120, 14, 'Clock'))
        out.append(circ(st, 810, 870, 36, 'Clock face'))
        out.append(line(st, 'M810 870 V846 M810 870 L828 880', 4))
    with part('toys'):
        out.append(tag('rect', x=700, y=1080, width=160, height=100, **P(st, 'Toy box')))
        out.append(tag('rect', x=690, y=1066, width=180, height=24, rx=6, **P(st, 'Toy box lid')))
        out.append(shape(st, star_d(780, 1134, 30, 13), 'Toy box star'))
        out.append(rr(st, 650, 1120, 46, 60, 8, 'Bookend'))
    with part('cat'):
        out.append(shape(st, 'M260 210 Q240 150 300 140 Q360 120 440 140 Q500 150 520 210Z', 'Cat body'))
        out.append(shape(st, 'M500 214 Q580 200 600 150 Q606 130 590 132 Q580 176 500 190Z', 'Cat tail'))
        out.append(shape(st, poly_d([(238, 160), (236, 112), (268, 140)]), 'Cat ear'))
        out.append(shape(st, poly_d([(300, 140), (318, 104), (326, 146)]), 'Cat ear'))
        out.append(ell(st, 280, 172, 56, 44, 'Cat head'))
        out.append(line(st, 'M252 172 q10 8 20 0 M290 172 q10 8 20 0 M270 190 q10 8 20 0', 3))
        for x in (360, 400, 440):
            out.append(line(st, f'M{x} 150 Q{x + 10} 175 {x} 200', 3))
    with part('lamp'):
        out.append(ell(st, 1060, 1280, 80, 18, 'Lamp base'))
        out.append(shape(st, capsule_d(1060, 1270, 1060, 560, 18), 'Lamp pole'))
        out.append(shape(st, 'M970 600 L1150 600 L1110 440 L1010 440Z', 'Lamp shade'))
        out.append(line(st, 'M1100 600 V660', 3))
        out.append(circ(st, 1100, 668, 8, 'Pull'))
    with part('rug'):
        out.append(ell(st, 560, 1410, 420, 70, 'Rug'))
        out.append(ell(st, 560, 1410, 330, 50, 'Rug border'))
        out.append(ell(st, 560, 1410, 230, 30, 'Rug centre'))
    with part('reading'):
        out.append(lying_book(st, 880, 1400, 220, 50))
        out.append(lying_book(st, 900, 1352, 180, 46))
        out.append(tag('path', d='M960 1352 L966 1290 Q1000 1282 1034 1290 L1040 1352Z', **P(st, 'Mug')))
        out.append(shape(st, 'M1036 1300 q34 4 30 26 q-4 20 -32 18 l2 -12 q18 0 20 -8 q2 -12 -20 -12Z', 'Mug handle'))
    return out


# ---------------------------------------------------------------- Detailed: Under the Sea (Nature & Seasons)

def fish(st, x, y, s, stripes=2, flip=False, name='Fish'):
    sx = -s if flip else s
    o = [f'<g transform="translate({fmt(float(x))} {fmt(float(y))}) scale({fmt(float(sx))} {fmt(float(s))})">']
    o.append(shape(st, 'M60 0 L110 -40 Q100 0 110 40Z', 'Tail'))
    o.append(shape(st, 'M-20 -40 Q0 -76 30 -44Z', 'Fin'))
    o.append(ell(st, 0, 0, 70, 44, name))
    for k in range(stripes):
        cx = -10 + k * 30
        o.append(shape(st, f'M{cx - 8} -42 Q{cx + 8} 0 {cx - 8} 42 L{cx + 8} 40 Q{cx + 24} 0 {cx + 8} -40Z', 'Stripe'))
    o.append(circ(st, -40, -8, 11, 'Eye'))
    o.append(dot(-42, -8, 5))
    o.append(line(st, 'M-62 14 q8 6 16 0', 3))
    o.append('</g>')
    return ''.join(o)


def sea_sheet():
    st = style(4)
    out = []
    with part('water'):
        out.append(bg(st, 'Sea'))
    with part('sand'):
        out.append(shape(st, 'M-20 1180 Q300 1110 620 1170 Q900 1220 1220 1140 L1220 1520 L-20 1520Z', 'Sand'))
        out.append(shape(st, 'M-20 1360 Q400 1300 760 1360 Q1000 1400 1220 1350 L1220 1520 L-20 1520Z', 'Near sand'))
    with part('rocks'):
        for cx, cy, r, rot in ((120, 1200, 120, .2), (1080, 1180, 140, .9), (560, 1240, 80, 1.6)):
            out.append(shape(st, ga.blob(cx, cy, r, bumps=6, amp=.1, rot=rot, squash=.7), 'Rock'))
    with part('seaweed'):
        for x, h, a in ((60, 520, -94), (240, 420, -86), (420, 380, -95), (760, 460, -84), (960, 400, -92), (1160, 520, -88)):
            out.append(shape(st, f'M{x - 20} 1260 Q{x - 70} {1260 - h * .35} {x} {1260 - h * .6} Q{x + 60} {1260 - h * .8} {x + 10} {1260 - h} '
                                 f'Q{x + 40} {1260 - h * .8} {x + 30} {1260 - h * .6} Q{x - 20} {1260 - h * .35} {x + 20} 1260Z', 'Seaweed'))
    with part('coral'):
        for cx, base, s in ((330, 1260, 1.0), (880, 1240, 1.15)):
            for dx, h, w in ((-62, 150, 44), (62, 180, 44), (0, 250, 50), (-30, 90, 40), (34, 110, 40)):
                x, top = cx + dx * s, base - h * s
                out.append(shape(st, f'M{pt(x - w * s / 2, base)} L{pt(x - w * s / 2, top)} A{fmt(w * s / 2)} {fmt(w * s / 5)} 0 0 1 {pt(x + w * s / 2, top)} L{pt(x + w * s / 2, base)}Z', 'Tube coral'))
                out.append(ell(st, x, top, w * s / 2 - 6, w * s / 5 - 3, 'Coral opening'))
        out.append(shape(st, ga.blob(680, 1250, 70, bumps=8, amp=.08, squash=.7), 'Brain coral'))
        out.append(line(st, 'M630 1250 q20 -20 40 0 q20 20 40 0 M640 1220 q20 -16 40 0 q20 16 30 0', 3))
        out.append(shape(st, 'M160 1260 L120 1040 Q200 980 280 1040 L240 1260Z', 'Fan coral'))
        out.append(line(st, 'M200 1260 L200 1010 M200 1200 L150 1060 M200 1200 L250 1060 M200 1130 L170 1030 M200 1130 L232 1030', 3))
    with part('chest'):
        out.append(tag('rect', x=420, y=1300, width=220, height=130, **P(st, 'Treasure chest')))
        out.append(shape(st, 'M420 1300 Q420 1220 530 1220 Q640 1220 640 1300Z', 'Chest lid'))
        for x in (450, 590):
            out.append(tag('rect', x=x, y=1222, width=22, height=208, **P(st, 'Chest band')))
        out.append(rr(st, 512, 1290, 36, 44, 6, 'Lock'))
        for x, y in ((460, 1210), (500, 1200), (560, 1206), (600, 1214)):
            out.append(circ(st, x, y, 14, 'Coin'))
    with part('shells'):
        for x, y in ((730, 1430), (980, 1460), (180, 1460)):
            out.append(shape(st, f'M{x - 40} {y} Q{x - 40} {y - 60} {x} {y - 64} Q{x + 40} {y - 60} {x + 40} {y}Z', 'Shell'))
            out.append(line(st, f'M{x} {y} V{y - 60} M{x} {y} L{x - 24} {y - 52} M{x} {y} L{x + 24} {y - 52}', 3))
            out.append(rr(st, x - 14, y - 4, 28, 14, 4, 'Shell hinge'))
    with part('starfish'):
        for x, y, r, rot in ((1100, 1400, 60, 10), (860, 1350, 44, -20), (320, 1420, 50, 30)):
            out.append(shape(st, star_d(x, y, r, r * .45, rot=-90 + rot), 'Starfish'))
    with part('crab'):
        out.append(line(st, 'M1000 1290 l-40 30 M1006 1300 l-34 40 M1080 1290 l40 30 M1074 1300 l34 40 M1020 1250 V1214 M1060 1250 V1214', 4))
        out.append(circ(st, 1020, 1206, 12, 'Crab eye'))
        out.append(circ(st, 1060, 1206, 12, 'Crab eye'))
        out.append(ell(st, 1040, 1280, 70, 44, 'Crab'))
        out.append(shape(st, 'M970 1260 Q920 1240 930 1200 L960 1220 L950 1180 Q990 1200 980 1250Z', 'Claw'))
        out.append(shape(st, 'M1110 1260 Q1160 1240 1150 1200 L1120 1220 L1130 1180 Q1090 1200 1100 1250Z', 'Claw'))
    with part('octopus'):
        for k in range(6):
            x = 860 + k * 32
            out.append(shape(st, f'M{x} 640 Q{x - 20 + k * 6} 740 {x + (k - 2.5) * 20} 800 Q{x + 10 + (k - 2.5) * 20} 806 {x + 20 + (k - 2.5) * 20} 796 '
                                 f'Q{x + 10 + k * 6} 740 {x + 24} 640Z', 'Tentacle'))
        out.append(shape(st, 'M840 650 Q830 480 950 470 Q1070 480 1060 650 Q950 680 840 650Z', 'Octopus'))
        out.append(circ(st, 915, 580, 16, 'Eye'))
        out.append(circ(st, 985, 580, 16, 'Eye'))
        out.append(dot(918, 582, 7))
        out.append(dot(988, 582, 7))
        out.append(line(st, 'M930 620 Q950 636 970 620', 4))
    with part('jellyfish'):
        for cx, cy in ((200, 380), (1080, 300)):
            out.append(line(st, f'M{cx - 30} {cy} q-12 60 6 110 M{cx} {cy} q12 70 -6 130 M{cx + 30} {cy} q12 60 -6 110', 4))
            out.append(shape(st, f'M{cx - 70} {cy} Q{cx - 70} {cy - 90} {cx} {cy - 90} Q{cx + 70} {cy - 90} {cx + 70} {cy} '
                                 f'Q{cx + 52} {cy - 14} {cx + 35} {cy} Q{cx + 17} {cy - 14} {cx} {cy} Q{cx - 17} {cy - 14} {cx - 35} {cy} Q{cx - 52} {cy - 14} {cx - 70} {cy}Z', 'Jellyfish'))
    with part('turtle'):
        out.append(f'<g transform="rotate(-12 540 520)">{turtle(st, 520, 540, .75)}</g>')
    with part('fish'):
        for x, y, s, n, flip in ((300, 700, 1.0, 2, False), (620, 860, .8, 1, True), (420, 980, .7, 2, False), (1000, 940, .9, 2, True),
                                 (760, 260, .7, 1, False), (460, 180, .6, 2, True), (140, 880, .6, 1, True), (1100, 760, .6, 2, False)):
            out.append(fish(st, x, y, s, n, flip))
    with part('bubbles'):
        bubbles = [(360, 560, 18), (380, 500, 12), (350, 450, 9), (700, 700, 16), (720, 650, 10), (690, 610, 7), (1160, 640, 20), (1140, 580, 13),
                   (1150, 530, 8), (90, 640, 14), (110, 590, 9), (640, 120, 16), (660, 70, 10), (960, 160, 14), (980, 110, 9), (300, 260, 12),
                   (320, 220, 8), (880, 380, 14), (900, 330, 9), (60, 200, 16), (80, 150, 10), (560, 1060, 12), (580, 1020, 8), (1000, 1080, 14),
                   (1020, 1040, 9)]
        for x, y, r in bubbles:
            out.append(circ(st, x, y, r, 'Bubble'))
    return out


# ---------------------------------------------------------------- Detailed: Busy Street (Vehicles & Places)

def building(st, x, w, top, base, cols, rows, kind):
    o = [tag('rect', x=x, y=top, width=w, height=base - top, **P(st, 'Building'))]
    o.append(tag('rect', x=x - 10, y=top - 24, width=w + 20, height=30, **P(st, 'Roof edge')))
    gap = (w - 30) / cols
    wy0, wy1 = top + 40, base - 210
    rh = (wy1 - wy0) / rows
    for r in range(rows):
        for c in range(cols):
            wx = x + 15 + c * gap + gap * .18
            wy = wy0 + r * rh + rh * .15
            if kind == 'arched':
                o.append(shape(st, f'M{pt(wx, wy + rh * .7)} V{fmt(wy + rh * .3)} A{fmt(gap * .32)} {fmt(gap * .32)} 0 0 1 {pt(wx + gap * .64, wy + rh * .3)} V{fmt(wy + rh * .7)}Z', 'Window'))
            else:
                o.append(tag('rect', x=wx, y=wy, width=gap * .64, height=rh * .6, **P(st, 'Window')))
    return ''.join(o)


def shopfront(st, x, w, base, stripes, door_left=True):
    o = []
    dw = 70
    dx = x + 20 if door_left else x + w - 20 - dw
    o.append(tag('rect', x=dx, y=base - 140, width=dw, height=140, **P(st, 'Door')))
    wx = x + 110 if door_left else x + 20
    o.append(tag('rect', x=wx, y=base - 130, width=w - 130, height=90, **P(st, 'Shop window')))
    sw = (w + 20) / stripes
    for k in range(stripes):
        sx = x - 10 + k * sw
        o.append(shape(st, f'M{pt(sx, base - 190)} L{pt(sx + sw, base - 190)} L{pt(sx + sw, base - 150)} Q{pt(sx + sw / 2, base - 136)} {pt(sx, base - 150)}Z', 'Awning stripe'))
    o.append(rr(st, x + w / 2 - 70, base - 236, 140, 36, 8, 'Shop sign'))
    return ''.join(o)


def street_sheet():
    st = style(4)
    out = []
    with part('sky'):
        out.append(bg(st, 'Sky'))
    with part('sun'):
        out.append(circ(st, 1080, 130, 60, 'Sun'))
    with part('clouds'):
        out.append(ga.cloud(st, None, 60, 80, 1.1))
        out.append(ga.cloud(st, None, 640, 60, 1.0))
    base = 1000
    specs = [(10, 230, 280, 2, 5, 'square'), (250, 230, 420, 3, 4, 'arched'), (490, 220, 220, 2, 6, 'square'), (720, 240, 360, 3, 4, 'square'),
             (970, 220, 300, 2, 5, 'arched')]
    for i, (x, w, top, cols, rows, kind) in enumerate(specs):
        with part(f'building{i + 1}'):
            out.append(building(st, x, w, top, base, cols, rows, kind))
            out.append(shopfront(st, x, w, base, 6 if w < 235 else 7, door_left=i % 2 == 0))
    with part('pavement'):
        out.append(tag('rect', x=-10, y=base, width=W + 20, height=110, **P(st, 'Pavement')))
        for k in range(12):
            out.append(line(st, f'M{k * 104} {base} L{k * 104 - 30} {base + 110}', 3))
        out.append(tag('rect', x=-10, y=base + 110, width=W + 20, height=22, **P(st, 'Kerb')))
    with part('road'):
        out.append(tag('rect', x=-10, y=base + 132, width=W + 20, height=H - base - 132 + 10, **P(st, 'Road')))
        for k in range(8):
            out.append(rr(st, -40 + k * 160, base + 148, 100, 14, 6, 'Road line'))
    with part('trees'):
        plain = ga.Style(mode='line', sw=4, ink=INK, details=False)
        out.append(ga.tree(plain, None, 230, base + 70, .48))
        out.append(ga.tree(plain, None, 940, base + 70, .48))
    with part('lamps'):
        for x in (460, 1150):
            out.append(shape(st, capsule_d(x, base + 80, x, base - 260, 14), 'Lamp post'))
            out.append(shape(st, f'M{x - 26} {base - 250} L{x + 26} {base - 250} L{x + 16} {base - 300} L{x - 16} {base - 300}Z', 'Lamp'))
    with part('traffic-light'):
        out.append(shape(st, capsule_d(700, base + 90, 700, base - 210, 16), 'Traffic light pole'))
        out.append(rr(st, 670, base - 370, 60, 170, 10, 'Traffic light'))
        for k in range(3):
            out.append(circ(st, 700, base - 338 + k * 52, 18, 'Light'))
    with part('bus'):
        bx, by = 80, 1180
        out.append(rr(st, bx, by, 560, 190, 26, 'Bus'))
        out.append(tag('rect', x=bx, y=by + 120, width=560, height=26, **P(st, 'Bus stripe')))
        for k in range(5):
            out.append(rr(st, bx + 30 + k * 96, by + 24, 80, 70, 8, 'Bus window'))
        out.append(rr(st, bx + 510, by + 24, 40, 100, 6, 'Windscreen'))
        out.append(circ(st, bx + 540, by + 160, 12, 'Headlight'))
        for wx in (bx + 110, bx + 450):
            out.append(circ(st, wx, by + 190, 44, 'Wheel'))
            out.append(circ(st, wx, by + 190, 18, 'Hub'))
    with part('car'):
        cx, cy = 760, 1360
        out.append(shape(st, f'M{cx + 70} {cy} Q{cx + 100} {cy - 70} {cx + 170} {cy - 74} Q{cx + 250} {cy - 70} {cx + 280} {cy}Z', 'Car roof'))
        out.append(rr(st, cx, cy - 10, 360, 90, 30, 'Car'))
        out.append(shape(st, f'M{cx + 92} {cy - 6} Q{cx + 112} {cy - 54} {cx + 168} {cy - 58} L{cx + 168} {cy - 6}Z', 'Car window'))
        out.append(shape(st, f'M{cx + 182} {cy - 6} L{cx + 182} {cy - 58} Q{cx + 238} {cy - 54} {cx + 258} {cy - 6}Z', 'Car window'))
        out.append(circ(st, cx + 340, cy + 20, 12, 'Car light'))
        for wx in (cx + 80, cx + 280):
            out.append(circ(st, wx, cy + 80, 40, 'Wheel'))
            out.append(circ(st, wx, cy + 80, 16, 'Hub'))
    return out


# ---------------------------------------------------------------- Detailed: Pattern Flower (Learn & Play)

def polar(cx, cy, r, deg):
    a = math.radians(deg)
    return cx + math.cos(a) * r, cy + math.sin(a) * r


def sector_d(cx, cy, r1, r2, a1, a2):
    return (f'M{pt(*polar(cx, cy, r1, a1))} A{fmt(float(r1))} {fmt(float(r1))} 0 0 1 {pt(*polar(cx, cy, r1, a2))} '
            f'L{pt(*polar(cx, cy, r2, a2))} A{fmt(float(r2))} {fmt(float(r2))} 0 0 0 {pt(*polar(cx, cy, r2, a1))}Z')


def arch_d(cx, cy, r1, r2, a, half):
    p1, p2 = polar(cx, cy, r1, a - half), polar(cx, cy, r1, a + half)
    c1, c2 = polar(cx, cy, r1 + (r2 - r1) * .75, a - half * .55), polar(cx, cy, r1 + (r2 - r1) * .75, a + half * .55)
    tip = polar(cx, cy, r2, a)
    return f'M{pt(*p1)} Q{pt(*c1)} {pt(*tip)} Q{pt(*c2)} {pt(*p2)} A{fmt(float(r1))} {fmt(float(r1))} 0 0 0 {pt(*p1)}Z'


def rosette(st, cx, cy, r):
    o = []
    for k in range(8):
        a = k * 45
        bx, by = polar(cx, cy, r * .25, a)
        o.append(shape(st, leaf_d(bx, by, r * .75, r * .2, a), 'Corner petal'))
    o.append(circ(st, cx, cy, r * .28, 'Corner centre'))
    return ''.join(o)


def mandala_sheet():
    st = style(4)
    out = []
    cx, cy = 600, 760
    with part('background'):
        out.append(bg(st, 'Background'))
    with part('corners'):
        for x, y in ((110, 110), (1090, 110), (110, 1390), (1090, 1390)):
            out.append(rosette(st, x, y, 100))
    with part('outer'):
        out.append(circ(st, cx, cy, 560, 'Outer circle'))
        for k in range(24):
            out.append(shape(st, arch_d(cx, cy, 480, 552, k * 15, 7.5), 'Outer point'))
        for k in range(24):
            out.append(circ(st, *polar(cx, cy, 462, k * 15 + 7.5), 12, 'Outer dot'))
    with part('big-petals'):
        for k in range(12):
            a = k * 30 - 90
            bx, by = polar(cx, cy, 300, a)
            out.append(shape(st, leaf_d(bx, by, 150, 62, a), 'Big petal'))
            ix, iy = polar(cx, cy, 320, a)
            out.append(shape(st, leaf_d(ix, iy, 92, 30, a), 'Inner petal'))
        for k in range(12):
            a = k * 30 - 75
            out.append(circ(st, *polar(cx, cy, 400, a), 16, 'Petal dot'))
    with part('band'):
        for k in range(24):
            out.append(shape(st, sector_d(cx, cy, 300, 268, k * 15, (k + 1) * 15), 'Band segment'))
    with part('mid-petals'):
        for k in range(16):
            a = k * 22.5
            bx, by = polar(cx, cy, 150, a)
            out.append(shape(st, leaf_d(bx, by, 116, 34, a), 'Middle petal'))
    with part('ring'):
        out.append(circ(st, cx, cy, 150, 'Inner ring'))
        for k in range(8):
            a = k * 45 + 22.5
            out.append(circ(st, *polar(cx, cy, 108, a), 18, 'Ring dot'))
    with part('centre-petals'):
        for k in range(8):
            a = k * 45
            bx, by = polar(cx, cy, 34, a)
            out.append(shape(st, leaf_d(bx, by, 88, 28, a), 'Centre petal'))
    with part('centre'):
        out.append(circ(st, cx, cy, 40, 'Centre'))
        out.append(circ(st, cx, cy, 18, 'Centre dot'))
    return out


# ---------------------------------------------------------------- Easy: Alphabet Blocks (Learn & Play)

def letter_d(letter, cx, cy, k):
    """Block letters as closed shapes (holes are extra subpaths, filled with the even-odd rule)."""
    def P_(pts):
        return poly_d([(cx + x * k, cy + y * k) for x, y in pts])
    if letter == 'A':
        return P_([(-50, 60), (-14, -60), (14, -60), (50, 60), (24, 60), (14, 28), (-14, 28), (-24, 60)]) + P_([(-8, 8), (8, 8), (0, -22)])
    if letter == 'B':
        q = lambda x, y: pt(cx + x * k, cy + y * k)
        return (f'M{q(-38, -60)} L{q(8, -60)} Q{q(44, -60)} {q(44, -30)} Q{q(44, -8)} {q(26, 0)} Q{q(50, 10)} {q(50, 32)} Q{q(50, 60)} {q(12, 60)} L{q(-38, 60)}Z'
                f'M{q(-14, -38)} L{q(4, -38)} Q{q(20, -38)} {q(20, -24)} Q{q(20, -12)} {q(4, -12)} L{q(-14, -12)}Z'
                f'M{q(-14, 12)} L{q(8, 12)} Q{q(26, 12)} {q(26, 25)} Q{q(26, 38)} {q(8, 38)} L{q(-14, 38)}Z')
    ro, ri = 60 * k, 32 * k
    p1, p2 = polar(cx, cy, ro, -40), polar(cx, cy, ro, 40)
    p3, p4 = polar(cx, cy, ri, 40), polar(cx, cy, ri, -40)
    return f'M{pt(*p1)} A{fmt(ro)} {fmt(ro)} 0 1 0 {pt(*p2)} L{pt(*p3)} A{fmt(ri)} {fmt(ri)} 0 1 1 {pt(*p4)}Z'


def block(st, x, y, size, letter):
    d = size * .24
    o = [shape(st, poly_d([(x, y), (x + size, y), (x + size + d, y - d * .85), (x + d, y - d * .85)]), 'Block top'),
         shape(st, poly_d([(x + size, y), (x + size + d, y - d * .85), (x + size + d, y + size - d * .85), (x + size, y + size)]), 'Block side'),
         tag('rect', x=x, y=y, width=size, height=size, **P(st, 'Block front')),
         rr(st, x + 16, y + 16, size - 32, size - 32, 10, 'Letter panel'),
         tag('path', d=letter_d(letter, x + size / 2, y + size / 2, size / 165), fill_rule='evenodd', **P(st, f'Letter {letter}'))]
    return ''.join(o)


def blocks_sheet():
    st = style(8)
    out = []
    with part('room'):
        out.append(bg(st, 'Wall'))
        out.append(tag('rect', x=0, y=1200, width=W, height=H - 1200, **P(st, 'Floor')))
    with part('stars'):
        for x, y, r in ((170, 220, 60), (1000, 300, 70), (620, 160, 40), (860, 620, 34)):
            out.append(shape(st, star_d(x, y, r, r * .45), 'Star'))
    with part('blocks'):
        out.append(block(st, 170, 1010, 270, 'A'))
        out.append(block(st, 530, 1010, 270, 'B'))
        out.append(block(st, 360, 745, 260, 'C'))
    with part('ball'):
        out.append(circ(st, 1000, 1290, 120, 'Ball'))
        out.append(shape(st, 'M900 1222 Q1000 1170 1100 1222 Q1112 1250 1116 1270 Q1000 1218 884 1270 Q888 1246 900 1222Z', 'Ball stripe'))
        out.append(shape(st, 'M884 1320 Q1000 1372 1116 1320 Q1110 1346 1098 1364 Q1000 1412 902 1364 Q890 1344 884 1320Z', 'Ball stripe'))
    with part('top'):
        out.append(shape(st, capsule_d(110, 1250, 110, 1300, 22), 'Top handle'))
        out.append(shape(st, 'M30 1330 Q110 1260 190 1330 Q150 1400 110 1440 Q70 1400 30 1330Z', 'Spinning top'))
        out.append(shape(st, 'M34 1326 Q110 1290 186 1326 Q182 1346 176 1352 Q110 1318 44 1352 Q38 1344 34 1326Z', 'Top band'))
    return out


SHEETS = [
    dict(id='leo-the-fox', version=1, title='Leo the Fox', level='easy', regions=(15, 45),
         alt='Leo the fox sitting in a sunny meadow with flowers, clouds and a butterfly', build=leo_sheet,
         labels={'sky': 'Sky', 'sun': 'Sun', 'clouds': 'Clouds', 'hills': 'Hills', 'flowers': 'Flowers', 'butterfly': 'Butterfly',
                 'leo': 'Leo the fox'}),
    dict(id='reading-corner', version=1, title='Reading Corner', level='medium', regions=(45, 130),
         alt='Mia reading a book beside a bookcase, a window and a stack of books, with Leo the fox on the rug', build=reading_sheet,
         labels={'room': 'Room', 'window': 'Window', 'picture': 'Picture', 'shelf': 'Bookcase', 'books': 'Books', 'plant': 'Plant',
                 'rug': 'Rug', 'stack': 'Book stack and mug', 'mia': 'Mia', 'leo': 'Leo the fox'}),
    dict(id='storybook-castle', version=1, title='Storybook Castle', level='detailed', regions=(130, 420),
         alt='A storybook castle on a hill with a winding path, a river and bridge, apple trees, Mia waving and Leo the fox',
         build=castle_sheet,
         labels={'sky': 'Sky', 'sun': 'Sun', 'clouds': 'Clouds', 'birds': 'Birds', 'hills': 'Hills', 'castle': 'Castle', 'forest': 'Forest',
                 'path': 'Path', 'river': 'River', 'bridge': 'Bridge', 'trees': 'Apple trees', 'fence': 'Fence', 'mushrooms': 'Mushrooms',
                 'flowers': 'Flowers', 'mia': 'Mia', 'leo': 'Leo the fox', 'butterflies': 'Butterflies'}),
    dict(id='sleepy-owl', version=1, title='Sleepy Owl', level='easy', regions=(15, 45),
         alt='A sleepy owl in a nightcap sitting on a branch under the moon and stars', build=owl_sheet,
         labels={'sky': 'Sky', 'moon': 'Moon', 'stars': 'Stars', 'clouds': 'Clouds', 'hills': 'Hills', 'tree': 'Tree', 'owl': 'Owl'}),
    dict(id='robot-friend', version=1, title='Robot Friend', level='easy', regions=(15, 45),
         alt='A friendly robot waving and holding a heart balloon, with a ball and a toy block', build=robot_sheet,
         labels={'room': 'Room', 'decorations': 'Sparkles', 'balloon': 'Balloon', 'robot': 'Robot', 'toys': 'Toys'}),
    dict(id='rocket-trip', version=1, title='Rocket Trip', level='easy', regions=(15, 45),
         alt='A rocket flying through space past a ringed planet, the moon and stars', build=rocket_sheet,
         labels={'space': 'Space', 'stars': 'Stars', 'planet': 'Planet', 'moon': 'Moon', 'rocket': 'Rocket'}),
    dict(id='hot-air-balloons', version=1, title='Hot-Air Balloons', level='easy', regions=(15, 45),
         alt='Three hot-air balloons floating over the hills with the sun, clouds and birds', build=balloons_sheet,
         labels={'sky': 'Sky', 'sun': 'Sun', 'clouds': 'Clouds', 'hills': 'Hills', 'small-balloons': 'Small balloons',
                 'big-balloon': 'Big balloon', 'birds': 'Birds'}),
    dict(id='open-book-adventure', version=1, title='Open Book Adventure', level='easy', regions=(15, 45),
         alt='A rainbow, balloons and stars rising out of an open book', build=open_book_sheet,
         labels={'sky': 'Sky', 'rainbow': 'Rainbow', 'clouds': 'Clouds', 'stars': 'Stars', 'balloons': 'Balloons', 'book': 'Book'}),
    dict(id='book-stack', version=1, title='Book Stack', level='easy', regions=(15, 45),
         alt='A tall stack of books with an apple and glasses on top, a pencil cup and a wall clock', build=book_stack_sheet,
         labels={'room': 'Wall', 'clock': 'Clock', 'table': 'Table', 'books': 'Books', 'apple': 'Apple', 'glasses': 'Glasses',
                 'pencils': 'Pencils'}),
    dict(id='spring-garden', version=1, title='Spring Garden', level='easy', regions=(15, 45),
         alt='Tulips and a big daisy by a garden fence, with a watering can, a snail and a ladybird', build=spring_sheet,
         labels={'sky': 'Sky', 'sun': 'Sun', 'clouds': 'Clouds', 'fence': 'Fence', 'ground': 'Grass', 'flowers': 'Flowers',
                 'watering-can': 'Watering can', 'snail': 'Snail', 'ladybird': 'Ladybird'}),
    dict(id='pond-friends', version=1, title='Pond Friends', level='medium', regions=(45, 130),
         alt='A frog on a lily pad, a turtle on a rock, ducks, a jumping fish and a dragonfly at the pond', build=pond_sheet,
         labels={'sky': 'Sky', 'sun': 'Sun', 'clouds': 'Clouds', 'trees': 'Trees', 'bank': 'Grass', 'pond': 'Pond', 'reeds': 'Reeds',
                 'lily-pads': 'Lily pads', 'lotus': 'Lotus flower', 'duck': 'Ducks', 'fish': 'Fish', 'frog': 'Frog', 'turtle': 'Turtle',
                 'dragonfly': 'Dragonfly'}),
    dict(id='friendly-dragon', version=1, title='Friendly Dragon', level='medium', regions=(45, 130),
         alt='A friendly dragon sitting in a meadow reading a book, with mountains and a castle tower behind', build=dragon_sheet,
         labels={'sky': 'Sky', 'clouds': 'Clouds', 'mountains': 'Mountains', 'hills': 'Hills', 'castle': 'Castle tower', 'ground': 'Meadow',
                 'rocks': 'Rocks', 'flowers': 'Flowers', 'dragon': 'Dragon'}),
    dict(id='little-wizard', version=1, title='Little Wizard', level='medium', regions=(45, 130),
         alt='Mia dressed as a wizard with a starry hat, cape and wand, under the moon with spell books and a potion', build=wizard_sheet,
         labels={'sky': 'Sky', 'moon': 'Moon', 'stars': 'Stars', 'hill': 'Hill', 'mushrooms': 'Mushrooms', 'cape': 'Cape',
                 'wizard': 'Mia the wizard', 'hat': 'Hat and wand', 'sparkles': 'Sparkles', 'spellbook': 'Spell books', 'potion': 'Potion'}),
    dict(id='autumn-leaves', version=1, title='Autumn Leaves', level='medium', regions=(45, 130),
         alt='A tree dropping its leaves over a leaf pile, with a hedgehog, pumpkins, acorns and a rake', build=autumn_sheet,
         labels={'sky': 'Sky', 'sun': 'Sun', 'clouds': 'Clouds', 'hills': 'Hills', 'tree': 'Tree', 'falling-leaves': 'Falling leaves',
                 'leaf-pile': 'Leaf pile', 'rake': 'Rake', 'pumpkins': 'Pumpkins', 'hedgehog': 'Hedgehog', 'acorns': 'Acorns'}),
    dict(id='snowy-day', version=1, title='Snowy Day', level='medium', regions=(45, 130),
         alt='A snowman in a top hat and scarf beside snowy pine trees, a cottage, a robin on the fence and a sled', build=snowy_sheet,
         labels={'sky': 'Sky', 'snowflakes': 'Snowflakes', 'hills': 'Hills', 'house': 'Cottage', 'trees': 'Pine trees', 'fence': 'Fence',
                 'ground': 'Snow', 'robin': 'Robin', 'snowman': 'Snowman', 'sled': 'Sled'}),
    dict(id='harbour-lighthouse', version=1, title='Harbour Lighthouse', level='medium', regions=(45, 130),
         alt='A striped lighthouse on a cliff above the harbour, with sailboats, a pier, a buoy and seagulls', build=harbour_sheet,
         labels={'sky': 'Sky', 'sun': 'Sun', 'clouds': 'Clouds', 'far-hills': 'Hills', 'sea': 'Sea', 'cliff': 'Cliff',
                 'lighthouse': 'Lighthouse', 'house': 'Cottage', 'pier': 'Pier', 'boats': 'Sailboats', 'buoy': 'Buoy', 'rocks': 'Rocks',
                 'gulls': 'Seagulls'}),
    dict(id='shape-train', version=1, title='Shape Train', level='medium', regions=(45, 130),
         alt='A steam train pulling three cars loaded with a circle, triangle, square, star, heart and diamond', build=shape_train_sheet,
         labels={'sky': 'Sky', 'sun': 'Sun', 'clouds': 'Clouds', 'hills': 'Hills', 'ground': 'Ground', 'track': 'Track', 'smoke': 'Smoke',
                 'engine': 'Engine', 'car1': 'First car', 'car2': 'Second car', 'car3': 'Third car'}),
    dict(id='music-time', version=1, title='Music Time', level='medium', regions=(45, 130),
         alt='A guitar, drum, xylophone, maracas and tambourine with music notes and bunting', build=music_sheet,
         labels={'room': 'Room', 'bunting': 'Bunting', 'notes': 'Music notes', 'tambourine': 'Tambourine', 'guitar': 'Guitar',
                 'maracas': 'Maracas', 'xylophone': 'Xylophone', 'drum': 'Drum'}),
    dict(id='farmyard', version=1, title='Farmyard', level='detailed', regions=(130, 420),
         alt='A red barn and silo with a cow, a pig, chickens and chicks, hay bales, a trough and a fenced field', build=farm_sheet,
         labels={'sky': 'Sky', 'sun': 'Sun', 'clouds': 'Clouds', 'hills': 'Hills and field', 'trees': 'Trees', 'hay': 'Hay bales',
                 'barn': 'Barn', 'silo': 'Silo', 'fence': 'Fence', 'yard': 'Farmyard', 'trough': 'Trough', 'cow': 'Cow', 'pig': 'Pig',
                 'chickens': 'Chickens', 'chicks': 'Chicks', 'flowers': 'Flowers'}),
    dict(id='bookshelf', version=1, title='Bookshelf', level='detailed', regions=(130, 420),
         alt='A tall bookcase full of books with a globe, plant, clock and toy box, a cat asleep on top, a lamp and a rug', build=bookshelf_sheet,
         labels={'room': 'Room', 'picture': 'Picture', 'bookcase': 'Bookcase', 'books': 'Books', 'globe': 'Globe', 'plant': 'Plant',
                 'clock': 'Clock', 'toys': 'Toy box', 'cat': 'Cat', 'lamp': 'Lamp', 'rug': 'Rug', 'reading': 'Book pile and mug'}),
    dict(id='under-the-sea', version=1, title='Under the Sea', level='detailed', regions=(130, 420),
         alt='A coral reef with fish, a turtle, an octopus, jellyfish, a crab, starfish, shells, bubbles and a treasure chest', build=sea_sheet,
         labels={'water': 'Sea', 'sand': 'Sand', 'rocks': 'Rocks', 'seaweed': 'Seaweed', 'coral': 'Coral', 'chest': 'Treasure chest',
                 'shells': 'Shells', 'starfish': 'Starfish', 'crab': 'Crab', 'octopus': 'Octopus', 'jellyfish': 'Jellyfish', 'turtle': 'Turtle',
                 'fish': 'Fish', 'bubbles': 'Bubbles'}),
    dict(id='busy-street', version=1, title='Busy Street', level='detailed', regions=(130, 420),
         alt='A town street with shops and tall buildings, a bus, a car, a zebra crossing, traffic lights, street lamps and trees', build=street_sheet,
         labels={'sky': 'Sky', 'sun': 'Sun', 'clouds': 'Clouds', 'building1': 'First building', 'building2': 'Second building',
                 'building3': 'Third building', 'building4': 'Fourth building', 'building5': 'Fifth building', 'pavement': 'Pavement',
                 'road': 'Road', 'trees': 'Trees', 'lamps': 'Street lamps', 'traffic-light': 'Traffic light', 'bus': 'Bus', 'car': 'Car'}),
    dict(id='pattern-flower', version=1, title='Pattern Flower', level='detailed', regions=(130, 420),
         alt='A round pattern flower made of rings of petals, points and dots, with a small flower in each corner', build=mandala_sheet,
         labels={'background': 'Background', 'corners': 'Corner flowers', 'outer': 'Outer ring', 'big-petals': 'Big petals', 'band': 'Band',
                 'mid-petals': 'Middle petals', 'ring': 'Inner ring', 'centre-petals': 'Centre petals', 'centre': 'Centre'}),
    dict(id='alphabet-blocks', version=1, title='Alphabet Blocks', level='easy', regions=(15, 45),
         alt='Three toy blocks showing the letters A, B and C, with a ball, a spinning top and stars', build=blocks_sheet,
         labels={'room': 'Room', 'stars': 'Stars', 'blocks': 'Blocks', 'ball': 'Ball', 'top': 'Spinning top'}),
]

# ---------------------------------------------------------------- split, sanitize, validate

SHAPES = {'path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 'line'}
GEOMETRY = {'d', 'x', 'y', 'width', 'height', 'rx', 'ry', 'cx', 'cy', 'r', 'points', 'x1', 'y1', 'x2', 'y2', 'fill-rule'}
STROKE = {'stroke', 'stroke-width', 'stroke-linejoin', 'stroke-linecap', 'stroke-dasharray'}
ALLOWED = GEOMETRY | STROKE | {'fill', 'fill-opacity', 'transform', 'data-part', 'data-name', 'data-fixed', 'filter'}
TRANSFORM = re.compile(r'^(\s*(translate|scale|rotate)\([-\d.\s,]+\))+\s*$')
NUMBER = re.compile(r'^-?[\d.]+$')
SVG_NS = '{http://www.w3.org/2000/svg}'


class BuildError(Exception):
    pass


def local(el):
    return el.tag.replace(SVG_NS, '')


def check_attrs(el):
    for key, value in el.attrib.items():
        if key not in ALLOWED:
            raise BuildError(f'attribute not allowed: {key} on <{local(el)}>')
        if key == 'transform' and not TRANSFORM.match(value):
            raise BuildError(f'transform not allowed: {value}')
        if key == 'filter':
            raise BuildError('filters are not allowed in coloring sheets')
        if key in GEOMETRY - {'d', 'points', 'fill-rule'} and not NUMBER.match(value):
            raise BuildError(f'{key}="{value}" is not a number')
        if key == 'd' and not re.fullmatch(r'[MmLlHhVvCcSsQqTtAaZz\d.,\s-]+', value):
            raise BuildError(f'unexpected characters in path data: {value[:40]}')


def is_closed(el):
    kind = local(el)
    if kind in {'rect', 'circle', 'ellipse', 'polygon'}:
        return True
    if kind != 'path':
        return False
    d = el.get('d', '')
    starts = len(re.findall(r'[Mm]', d))
    return starts > 0 and len(re.findall(r'[Zz]', d)) == starts


def split(svg, sheet):
    root = ET.fromstring(svg)
    counters, regions, names = {}, [], set()

    def walk(el):
        """Returns (region node, line node, highlight node), each None when the element isn't in that layer."""
        kind = local(el)
        if kind == 'g':
            check_attrs(el)
            parts = [walk(child) for child in el]
            base = {k: v for k, v in el.attrib.items() if k == 'transform'}
            layers = ([p[i] for p in parts if p[i]] for i in range(3))
            return tuple(['g', base, nodes] if nodes else None for nodes in layers)
        if kind not in SHAPES:
            raise BuildError(f'element not allowed: <{kind}>')
        check_attrs(el)
        a = dict(el.attrib)
        fill, stroke = a.get('fill', '#000000').lower(), a.get('stroke', 'none').lower()
        geometry = {k: v for k, v in a.items() if k in GEOMETRY or k == 'transform'}
        if fill == WHITE and stroke not in ('none', WHITE) and a.get('data-fixed') != 'true':
            if not is_closed(el):
                raise BuildError(f'open shape used as a region in {sheet["id"]}: {a.get("d", "")[:50]}')
            slug = a.get('data-part')
            if not slug or slug not in sheet['labels']:
                raise BuildError(f'region without a known part in {sheet["id"]}: <{kind}> part={slug}')
            counters[slug] = counters.get(slug, 0) + 1
            rid = f'{slug}-{counters[slug]:02d}'
            if rid in names:
                raise BuildError(f'duplicate region id {rid}')
            names.add(rid)
            regions.append({'id': rid, 'part': slug, 'name': a.get('data-name')})
            region = [kind, {**geometry, 'fill': WHITE, 'data-region': rid}, []]
            line = [kind, {**geometry, **{k: v for k, v in a.items() if k in STROKE}, 'fill': WHITE}, []]
            return region, line, None
        # everything else is fixed line art: loose lines and solid ink details; unoutlined white shapes are
        # highlights (eye shine), kept in the line layer so they hide what's beneath and repeated on top in white
        line = [kind, {k: v for k, v in a.items() if k not in ('data-part', 'data-name', 'data-fixed')}, []]
        return None, line, (line if fill == WHITE and stroke == 'none' else None)

    parts = [walk(child) for child in root]
    region_layer, line_layer, highlight_layer = ([p[i] for p in parts if p[i]] for i in range(3))
    low, high = sheet['regions']
    if not low <= len(regions) <= high:
        raise BuildError(f'{sheet["id"]}: {len(regions)} regions, expected {low}-{high} for {sheet["level"]}')
    return region_layer, line_layer, highlight_layer, regions


def to_markup(nodes):
    out = []
    for kind, attrs, children in nodes:
        a = ' '.join(f'{k}="{v}"' for k, v in attrs.items() if not k.startswith('data-'))
        out.append(f'<{kind} {a}>{to_markup(children)}</{kind}>' if children else f'<{kind} {a}/>')
    return ''.join(out)


def main(root):
    out = root / 'src' / 'assets' / 'coloring'
    (out / 'sheets').mkdir(parents=True, exist_ok=True)
    (out / 'thumbs').mkdir(parents=True, exist_ok=True)
    for sheet in SHEETS:
        svg = svg_body(''.join(sheet['build']()))
        region_layer, line_layer, highlight_layer, regions = split(svg, sheet)
        # Region names: the shape's own name, or its part's label; numbered when a name repeats.
        totals = {}
        for r in regions:
            base = r['name'] or sheet['labels'][r['part']]
            totals[base] = totals.get(base, 0) + 1
        seen = {}
        for r in regions:
            base = r.pop('name') or sheet['labels'][r['part']]
            seen[base] = seen.get(base, 0) + 1
            r['label'] = f'{base} {seen[base]}' if totals[base] > 1 else base
        data = {
            'id': sheet['id'], 'version': sheet['version'], 'title': sheet['title'], 'level': sheet['level'], 'alt': sheet['alt'],
            'width': W, 'height': H, 'parts': sheet['labels'], 'regions': regions,
            'regionLayer': region_layer, 'lineLayer': line_layer, 'highlightLayer': highlight_layer,
        }
        (out / 'sheets' / f'{sheet["id"]}.json').write_text(json.dumps(data, separators=(',', ':')), encoding='utf-8')
        thumb = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="480" height="600">'
                 f'<rect width="{W}" height="{H}" fill="#ffffff"/>{to_markup(line_layer)}{to_markup(highlight_layer)}</svg>\n')
        (out / 'thumbs' / f'{sheet["id"]}.svg').write_text(thumb, encoding='utf-8')
        size = (out / 'sheets' / f'{sheet["id"]}.json').stat().st_size
        print(f'{sheet["id"]:18s} {sheet["level"]:9s} {len(regions):4d} regions  json {size / 1024:6.1f} KB  thumb {len(thumb) / 1024:5.1f} KB')


if __name__ == '__main__':
    try:
        main(Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.'))
    except BuildError as error:
        sys.exit(f'coloring sheet validation failed: {error}')
