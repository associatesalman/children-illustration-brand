"""Generate the studio's original sample artwork as SVG files.

Every illustration on the homepage comes from this script, so the cast
(Mia and her fox friend Leo), palette and line quality stay consistent.
Run with:  python scripts/generate_artwork.py src/assets/artwork
Standard library only.
"""

import math
import os
import random
import sys

C = dict(
    ink='#1d1a17', red='#d62828', reddk='#a61d1d', yellow='#ffc72c', yellowlt='#ffe39a',
    cream='#fff6e0', paper='#f6f2e9', white='#ffffff', sky='#cde9f4', teal='#2f9c95',
    tealdk='#23756f', leaf='#6dbe6a', leafdk='#3e8e5a', leafdeep='#2d6b45', skin='#c98b5f',
    hair='#3b2418', fox='#e8772e', foxdk='#b9541a', blue='#3a6ea5', pink='#f08c8c',
    brown='#8a5a3b', gray='#d9d2c3', mouth='#7a1414', night='#1f3a5f', nightlt='#2f5583',
    tear='#7cc3e8', screen='#2a2a2a',
)

SERIF = "Georgia, 'Times New Roman', serif"


def fmt(v):
    if isinstance(v, float):
        s = f'{v:.1f}'
        return s[:-2] if s.endswith('.0') else s
    return str(v)


def attrs(d):
    return ' '.join(f'{k.rstrip("_").replace("_", "-")}="{fmt(v)}"' for k, v in d.items() if v is not None)


def tag(name, **a):
    return f'<{name} {attrs(a)}/>'


def shade(hexcolor, amount):
    """amount > 0 lightens toward white, < 0 darkens toward black."""
    r, g, b = (int(hexcolor[i:i + 2], 16) for i in (1, 3, 5))
    t = 255 if amount > 0 else 0
    a = abs(amount)
    r, g, b = (round(c + (t - c) * a) for c in (r, g, b))
    return f'#{r:02x}{g:02x}{b:02x}'


class Defs:
    def __init__(self):
        self.items = {}

    def add(self, key, svg):
        self.items.setdefault(key, svg)

    def grad(self, color):
        gid = 'g' + color[1:]
        self.add(gid, (
            f'<radialGradient id="{gid}" cx="35%" cy="30%" r="80%">'
            f'<stop offset="0" stop-color="{shade(color, .45)}"/>'
            f'<stop offset=".55" stop-color="{color}"/>'
            f'<stop offset="1" stop-color="{shade(color, -.28)}"/></radialGradient>'))
        return f'url(#{gid})'

    def watercolor(self):
        self.add('wc', (
            '<filter id="wc" x="-10%" y="-10%" width="120%" height="120%">'
            '<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="4" result="n"/>'
            '<feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G"/>'
            '</filter>'))
        return 'url(#wc)'

    def pencil(self):
        self.add('pencil', (
            '<filter id="pencil" x="-5%" y="-5%" width="110%" height="110%">'
            '<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2" result="n"/>'
            '<feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G"/>'
            '</filter>'))
        return 'url(#pencil)'

    def grain(self):
        self.add('grain', (
            '<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" stitchTiles="stitch"/>'
            '<feColorMatrix type="saturate" values="0"/>'
            '<feComponentTransfer><feFuncA type="table" tableValues="0 .10"/></feComponentTransfer></filter>'))
        return 'url(#grain)'

    def dots(self, color, gap=16, r=3.4):
        pid = 'dots' + color[1:]
        self.add(pid, (
            f'<pattern id="{pid}" width="{gap}" height="{gap}" patternUnits="userSpaceOnUse">'
            f'<circle cx="{gap / 2}" cy="{gap / 2}" r="{r}" fill="{color}"/></pattern>'))
        return f'url(#{pid})'

    def render(self):
        return '<defs>' + ''.join(self.items.values()) + '</defs>' if self.items else ''


class Style:
    """How shapes are painted: outline weight, fill treatment and detail level."""

    def __init__(self, outline=True, sw=4.0, ink=C['ink'], mode='flat', details=True, group_filter=None):
        self.outline = outline
        self.sw = sw
        self.ink = ink
        self.mode = mode  # flat | line | grad | wash
        self.details = details
        self.group_filter = group_filter

    def paint(self, color, D):
        a = {}
        if self.mode == 'line':
            a['fill'] = C['white']
        elif self.mode == 'grad':
            a['fill'] = D.grad(color)
        elif self.mode == 'wash':
            a['fill'] = color
            a['fill_opacity'] = .86
        else:
            a['fill'] = color
        if self.outline:
            a.update(stroke=self.ink, stroke_width=self.sw, stroke_linejoin='round', stroke_linecap='round')
        return a

    def flat_color(self, color):
        return C['white'] if self.mode == 'line' else color


CARTOON = Style()
LINE = Style(mode='line', sw=3.5, ink='#2a2522')


def svg_doc(w, h, body, D, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" '
            f'role="img" aria-label="{title}">{D.render()}{body}</svg>\n')


# ---------------------------------------------------------------- primitives

def blob(cx, cy, r, bumps=7, amp=.12, rot=0.0, squash=1.0):
    pts = []
    n = bumps * 2
    for i in range(n):
        t = rot + i / n * math.tau
        rr = r * (1 + (amp if i % 2 == 0 else -amp * .3))
        pts.append((cx + math.cos(t) * rr, cy + math.sin(t) * rr * squash))
    mids = [((pts[i][0] + pts[(i + 1) % n][0]) / 2, (pts[i][1] + pts[(i + 1) % n][1]) / 2) for i in range(n)]
    d = f'M{fmt(mids[-1][0])} {fmt(mids[-1][1])}'
    for i in range(n):
        d += f' Q{fmt(pts[i][0])} {fmt(pts[i][1])} {fmt(mids[i][0])} {fmt(mids[i][1])}'
    return d + 'Z'


def sparkle(x, y, r):
    return f'M{x} {y - r} Q{x} {y} {x + r} {y} Q{x} {y} {x} {y + r} Q{x} {y} {x - r} {y} Q{x} {y} {x} {y - r}Z'


def cloud(st, D, x, y, s=1.0):
    d = (f'M{x} {y + 40 * s} a{30 * s} {30 * s} 0 0 1 {30 * s} {-30 * s} a{40 * s} {40 * s} 0 0 1 {72 * s} {-12 * s} '
         f'a{30 * s} {30 * s} 0 0 1 {48 * s} {42 * s}Z')
    return tag('path', d=d, **st.paint(C['white'], D))


def tree(st, D, x, y, s=1.0, color=None):
    color = color or C['leaf']
    out = [tag('rect', x=x - 14 * s, y=y - 150 * s, width=28 * s, height=150 * s, rx=10 * s, **st.paint(C['brown'], D))]
    out.append(tag('path', d=blob(x, y - 210 * s, 95 * s, bumps=6, amp=.1, rot=.3, squash=.9), **st.paint(color, D)))
    if st.details:
        out.append(tag('path', d=blob(x + 30 * s, y - 230 * s, 38 * s, bumps=5, amp=.1), **st.paint(shade(color, .18), D)))
    return ''.join(out)


def hills(st, D, w, y, colors, seed=1):
    rnd = random.Random(seed)
    out = []
    for i, col in enumerate(colors):
        base = y + i * 60
        h1, h2 = rnd.randint(40, 90), rnd.randint(30, 80)
        d = (f'M-20 {base + 40} Q{w * .25} {base - h1} {w * .5} {base + 10} '
             f'Q{w * .78} {base - h2 - 40} {w + 20} {base + 30} L{w + 20} {base + 900} L-20 {base + 900}Z')
        out.append(tag('path', d=d, **st.paint(col, D)))
    return ''.join(out)


def flower(st, D, x, y, color):
    out = [tag('path', d=f'M{x} {y} L{x} {y + 34}', stroke=st.ink if st.outline else C['leafdk'], stroke_width=3, fill='none')]
    for k in range(5):
        a = k / 5 * math.tau
        out.append(tag('circle', cx=x + math.cos(a) * 9, cy=y + math.sin(a) * 9, r=7, **st.paint(color, D)))
    out.append(tag('circle', cx=x, cy=y, r=5, **st.paint(C['yellow'], D)))
    return ''.join(out)


def butterfly(st, D, x, y, color, s=1.0):
    return ''.join([
        tag('ellipse', cx=x - 11 * s, cy=y, rx=12 * s, ry=16 * s, transform=f'rotate(-25 {x} {y})', **st.paint(color, D)),
        tag('ellipse', cx=x + 11 * s, cy=y, rx=12 * s, ry=16 * s, transform=f'rotate(25 {x} {y})', **st.paint(color, D)),
        tag('rect', x=x - 2.5 * s, y=y - 12 * s, width=5 * s, height=24 * s, rx=2.5 * s, fill=st.ink),
    ])


# ---------------------------------------------------------------- Mia

def mia_head(st, D, cx, cy, expr='happy', view='front'):
    P = lambda c: st.paint(c, D)
    out = [
        tag('circle', cx=cx, cy=cy, r=84, **P(C['hair'])),
        tag('circle', cx=cx - 78, cy=cy + 24, r=30, **P(C['hair'])),
        tag('circle', cx=cx + 78, cy=cy + 24, r=30, **P(C['hair'])),
        tag('circle', cx=cx, cy=cy - 92, r=36, **P(C['hair'])),
        tag('rect', x=cx - 24, y=cy - 70, width=48, height=16, rx=8, **P(C['red'])),
    ]
    if view == 'back':
        if st.details:
            out.append(tag('path', d=f'M{cx} {cy - 70} Q{cx - 6} {cy} {cx} {cy + 60}', fill='none',
                           stroke=st.ink if st.outline else shade(C['hair'], .25), stroke_width=3, stroke_linecap='round'))
        return ''.join(out)

    dx = -18 if view == 'three' else 0
    fx = cx + dx
    if view == 'front':
        out.append(tag('circle', cx=cx - 70, cy=cy + 12, r=15, **P(C['skin'])))
    out.append(tag('circle', cx=cx + 70 + dx * .3, cy=cy + 12, r=15, **P(C['skin'])))
    out.append(tag('circle', cx=cx + dx * .25, cy=cy, r=72, **P(C['skin'])))
    fringe = (f'M{cx - 74 + dx * .2} {cy - 2} Q{cx - 62 + dx} {cy - 82} {fx} {cy - 82} '
              f'Q{cx + 62 + dx} {cy - 82} {cx + 74 + dx * .2} {cy - 2} '
              f'Q{cx + 42 + dx} {cy - 52} {fx + 6} {cy - 44} Q{fx - 30} {cy - 60} {cx - 74 + dx * .2} {cy - 2}Z')
    out.append(tag('path', d=fringe, **P(C['hair'])))
    out.append(face(st, D, fx, cy, expr, view))
    return ''.join(out)


def face(st, D, fx, cy, expr, view):
    out = []
    ink = st.ink if st.mode == 'line' else C['ink']
    brow_col = st.ink if st.mode == 'line' else C['hair']
    ey = cy + 12
    eyes = [(fx - 27, 1.0), (fx + 27, 1.0)]
    if view == 'three':
        eyes = [(fx - 24, .78), (fx + 26, 1.0)]
    ry = {'surprised': 12}.get(expr, 9.5)
    for ex, k in eyes:
        if not st.details:
            out.append(tag('circle', cx=ex, cy=ey, r=6, fill=ink))
            continue
        out.append(tag('ellipse', cx=ex, cy=ey, rx=7.5 * k, ry=ry, fill=ink))
        out.append(tag('circle', cx=ex - 2.5 * k, cy=ey - 4, r=2.8, fill=C['white']))
    # Eyebrows: inner/outer heights per expression.
    brows = {
        'happy': (-24, -27, 'arc'), 'sad': (-18, -28, 'line'), 'angry': (-28, -16, 'line'),
        'surprised': (-36, -38, 'arc'), 'calm': (-24, -25, 'arc'),
    }[expr]
    outer, inner, kind = brows
    for ex, k in eyes:
        side = -1 if ex < fx else 1
        x_out, x_in = ex + side * 13 * k, ex - side * 9 * k
        if kind == 'arc':
            d = f'M{fmt(x_out)} {ey + outer + 4} Q{fmt(ex)} {ey + inner - 6} {fmt(x_in)} {ey + inner + 4}'
        else:
            d = f'M{fmt(x_out)} {ey + outer} L{fmt(x_in)} {ey + inner}'
        out.append(tag('path', d=d, fill='none', stroke=brow_col, stroke_width=5, stroke_linecap='round'))
    if st.details and st.mode != 'line':
        cheek_op = .8 if expr == 'angry' else .55
        for ex in (fx - 42, fx + 42):
            out.append(tag('ellipse', cx=ex, cy=cy + 36, rx=12, ry=7, fill=C['pink'], fill_opacity=cheek_op))
    my = cy + 44
    mouth_fill = C['white'] if st.mode == 'line' else C['mouth']
    if expr == 'happy':
        out.append(tag('path', d=f'M{fx - 17} {my - 4} Q{fx} {my + 22} {fx + 17} {my - 4} Q{fx} {my + 2} {fx - 17} {my - 4}Z',
                       fill=mouth_fill, stroke=ink, stroke_width=3, stroke_linejoin='round'))
    elif expr == 'calm':
        out.append(tag('path', d=f'M{fx - 13} {my - 2} Q{fx} {my + 10} {fx + 13} {my - 2}', fill='none',
                       stroke=ink, stroke_width=4, stroke_linecap='round'))
    elif expr == 'sad':
        out.append(tag('path', d=f'M{fx - 14} {my + 6} Q{fx} {my - 6} {fx + 14} {my + 6}', fill='none',
                       stroke=ink, stroke_width=4, stroke_linecap='round'))
        out.append(tag('path', d=f'M{fx + 30} {ey + 14} q-7 12 0 16 q7 -4 0 -16Z', fill=C['tear'], stroke=ink, stroke_width=1.5))
    elif expr == 'angry':
        out.append(tag('path', d=f'M{fx - 14} {my + 4} Q{fx} {my - 4} {fx + 14} {my + 4} L{fx + 14} {my + 6} L{fx - 14} {my + 6}Z',
                       fill=mouth_fill, stroke=ink, stroke_width=3, stroke_linejoin='round'))
    elif expr == 'surprised':
        out.append(tag('ellipse', cx=fx, cy=my + 4, rx=9, ry=12, fill=mouth_fill, stroke=ink, stroke_width=3))
    return ''.join(out)


def limb(st, x1, y1, x2, y2, w, color):
    d = f'M{fmt(x1)} {fmt(y1)} L{fmt(x2)} {fmt(y2)}'
    out = []
    if st.outline:
        out.append(tag('path', d=d, stroke=st.ink, stroke_width=w + 2 * st.sw, stroke_linecap='round', fill='none'))
    out.append(tag('path', d=d, stroke=st.flat_color(color), stroke_width=w, stroke_linecap='round', fill='none'))
    return ''.join(out)


ARMS = {
    'down': ((156, 300, 114, 424), (244, 300, 286, 424)),
    'wave': ((156, 300, 114, 424), (244, 300, 318, 196)),
    'hold': ((156, 300, 178, 404), (244, 300, 222, 404)),
    'pencil': ((156, 300, 114, 424), (244, 300, 304, 352)),
}


def mia(st, D, x, y, s=1.0, expr='happy', view='front', pose='down', prop=None):
    """Mia's full figure in a 400 x 620 box; (x, y) is the top-left corner."""
    P = lambda c: st.paint(c, D)
    out = []
    (l1, l2) = ARMS[pose]
    # legs and shoes
    for lx in (167, 205):
        out.append(tag('rect', x=lx, y=466, width=28, height=108, rx=14, **P(C['skin'])))
    for sx in (180, 222):
        out.append(tag('ellipse', cx=sx, cy=582, rx=31, ry=15, **P(C['blue'])))
    out.append(tag('rect', x=186, y=230, width=28, height=62, **P(C['skin'])))
    out.append(tag('path', d='M150 284 Q200 268 250 284 L294 474 Q200 496 106 474Z', **P(C['red'])))
    if view != 'back' and st.details:
        out.append(tag('circle', cx=176, cy=320, r=7, **P(C['yellow'])))
        out.append(tag('circle', cx=224, cy=320, r=7, **P(C['yellow'])))
        out.append(tag('rect', x=178, y=384, width=44, height=34, rx=8, **P(C['yellow'])))
    for (x1, y1, x2, y2) in (l1, l2):
        out.append(limb(st, x1, y1, x2, y2, 26, C['skin']))
    out.append(tag('ellipse', cx=200, cy=284, rx=32, ry=12, **P(C['yellow'])))
    out.append(tag('circle', cx=156, cy=298, r=28, **P(C['yellow'])))
    out.append(tag('circle', cx=244, cy=298, r=28, **P(C['yellow'])))
    if prop == 'pencil':
        out.append(pencil_prop(st, D, 304, 352))
    if prop == 'book':
        out.append(tag('path', d='M150 380 L200 392 L250 380 L250 440 L200 452 L150 440Z', **P(C['teal'])))
        out.append(tag('path', d='M156 384 L200 395 L200 446 L156 435Z', **P(C['cream'])))
        out.append(tag('path', d='M244 384 L200 395 L200 446 L244 435Z', **P(C['cream'])))
    if prop == 'letter':
        out.append(tag('rect', x=140, y=366, width=120, height=80, rx=6, **P(C['white'])))
        out.append(tag('path', d='M140 372 L200 412 L260 372', fill='none', stroke=st.ink, stroke_width=st.sw, stroke_linejoin='round'))
        out.append(tag('path', d='M200 404 c-8 -10 -22 -2 -14 9 l14 13 l14 -13 c8 -11 -6 -19 -14 -9Z', fill=C['red']))
    for (_, _, x2, y2) in (l1, l2):
        out.append(tag('circle', cx=x2, cy=y2, r=16, **P(C['skin'])))
    out.append(mia_head(st, D, 200, 176, expr, view))
    body = ''.join(out)
    filt = f' filter="{st.group_filter}"' if st.group_filter else ''
    return f'<g transform="translate({fmt(x)} {fmt(y)}) scale({fmt(s)})"{filt}>{body}</g>'


def pencil_prop(st, D, hx, hy):
    P = lambda c: st.paint(c, D)
    return (f'<g transform="rotate(-50 {hx} {hy})">'
            + tag('rect', x=hx - 12, y=hy - 120, width=24, height=170, **P(C['yellow']))
            + tag('rect', x=hx - 12, y=hy - 150, width=24, height=32, rx=6, **P(C['pink']))
            + tag('path', d=f'M{hx - 12} {hy + 50} L{hx} {hy + 86} L{hx + 12} {hy + 50}Z', **P(C['cream']))
            + tag('path', d=f'M{hx - 4} {hy + 74} L{hx} {hy + 86} L{hx + 4} {hy + 74}Z', fill=C['ink'])
            + '</g>')


# ---------------------------------------------------------------- Leo the fox

def leo(st, D, x, y, s=1.0, flip=False, expr='happy'):
    """Leo in a 260 x 240 box; (x, y) is the top-left corner."""
    P = lambda c: st.paint(c, D)
    ink = st.ink if st.mode == 'line' else C['ink']
    out = [
        tag('ellipse', cx=205, cy=160, rx=30, ry=72, transform='rotate(38 205 160)', **P(C['fox'])),
        tag('ellipse', cx=240, cy=116, rx=19, ry=24, transform='rotate(38 240 116)', **P(C['cream'])),
        tag('ellipse', cx=130, cy=180, rx=58, ry=58, **P(C['fox'])),
        tag('ellipse', cx=130, cy=194, rx=30, ry=40, **P(C['cream'])),
        tag('ellipse', cx=104, cy=234, rx=22, ry=10, **P(C['foxdk'])),
        tag('ellipse', cx=156, cy=234, rx=22, ry=10, **P(C['foxdk'])),
        tag('path', d='M80 84 L90 20 L130 62Z', **P(C['fox'])),
        tag('path', d='M180 84 L170 20 L130 62Z', **P(C['fox'])),
    ]
    if st.details:
        out.append(tag('path', d='M92 70 L96 38 L116 62Z', fill=C['white'] if st.mode == 'line' else C['foxdk']))
        out.append(tag('path', d='M168 70 L164 38 L144 62Z', fill=C['white'] if st.mode == 'line' else C['foxdk']))
    out += [
        tag('ellipse', cx=130, cy=102, rx=62, ry=50, **P(C['fox'])),
        tag('path', d='M78 112 Q104 104 130 122 Q156 104 182 112 Q170 150 130 152 Q90 150 78 112Z', **P(C['cream'])),
        tag('ellipse', cx=108, cy=98, rx=5.5, ry=7.5, fill=ink),
        tag('ellipse', cx=152, cy=98, rx=5.5, ry=7.5, fill=ink),
        tag('ellipse', cx=130, cy=122, rx=9, ry=6.5, fill=ink),
        tag('path', d='M122 136 Q130 142 138 136', fill='none', stroke=ink, stroke_width=3, stroke_linecap='round'),
    ]
    tf = f'translate({fmt(x)} {fmt(y)}) scale({fmt(s)})'
    if flip:
        tf = f'translate({fmt(x + 260 * s)} {fmt(y)}) scale({fmt(-s)} {fmt(s)})'
    filt = f' filter="{st.group_filter}"' if st.group_filter else ''
    return f'<g transform="{tf}"{filt}>{"".join(out)}</g>'


# ---------------------------------------------------------------- book helpers

def open_book(st, D, cx, top, w, h, cover=C['red']):
    P = lambda c: st.paint(c, D)
    half = w / 2
    out = [tag('path', d=(f'M{cx - half - 18} {top + 6} L{cx + half + 18} {top + 6} L{cx + half + 18} {top + h + 30} '
                          f'Q{cx} {top + h + 10} {cx - half - 18} {top + h + 30}Z'), **P(cover))]
    for sgn in (-1, 1):
        edge = cx + sgn * half
        out.append(tag('path', d=(f'M{cx} {top + 14} Q{cx + sgn * half * .5} {top - 16} {edge} {top} '
                                  f'L{edge} {top + h} Q{cx + sgn * half * .5} {top + h - 26} {cx} {top + h + 12}Z'),
                       **P(C['cream'])))
    return ''.join(out)


def mini_cover(st, D, x, y, w, h, bg):
    """Small version of the sample cover, used on book formats and screens."""
    P = lambda c: st.paint(c, D)
    clip = f'clip{int(x)}{int(y)}'
    D.add(clip, f'<clipPath id="{clip}"><rect x="{fmt(x)}" y="{fmt(y)}" width="{fmt(w)}" height="{fmt(h)}"/></clipPath>')
    inner = [
        tag('rect', x=x, y=y, width=w, height=h, fill=bg),
        tag('circle', cx=x + w * .62, cy=y + h * .42, r=w * .26, fill=C['yellowlt']),
        tag('path', d=f'M{x - 10} {y + h * .78} Q{x + w * .4} {y + h * .6} {x + w + 10} {y + h * .74} L{x + w + 10} {y + h + 10} L{x - 10} {y + h + 10}Z',
            fill=C['leafdk']),
        tag('rect', x=x + w * .12, y=y + h * .1, width=w * .62, height=h * .06, rx=h * .03, fill=C['cream']),
        tag('rect', x=x + w * .12, y=y + h * .2, width=w * .4, height=h * .04, rx=h * .02, fill=C['cream'], fill_opacity=.7),
        tag('circle', cx=x + w * .38, cy=y + h * .7, r=w * .08, fill=C['red']),
        tag('circle', cx=x + w * .38, cy=y + h * .6, r=w * .07, fill=C['hair']),
    ]
    return f'<g clip-path="url(#{clip})">{"".join(inner)}</g>' + tag('rect', x=x, y=y, width=w, height=h, fill='none',
                                                                     stroke=st.ink, stroke_width=st.sw)


# ---------------------------------------------------------------- compositions

def hero():
    D, st, P = Defs(), CARTOON, None
    P = lambda c: st.paint(c, D)
    W, H = 1200, 1000
    b = [
        tag('circle', cx=640, cy=420, r=330, fill=C['white']),
        tag('path', d=sparkle(250, 210, 30), fill=C['red']),
        tag('path', d=sparkle(1080, 170, 24), fill=C['red']),
        tag('path', d=sparkle(1010, 560, 18), fill=C['white']),
        tag('path', d=sparkle(210, 520, 16), fill=C['white']),
        cloud(st, D, 330, 300, 1.1),
        cloud(st, D, 880, 220, .85),
        tag('path', d='M300 700 Q470 470 700 600 Q880 470 1040 620 L1040 760 L300 760Z', **P(C['leaf'])),
        tag('path', d='M360 720 Q560 590 760 690 Q900 620 1000 700 L1000 780 L360 780Z', **P(C['leafdk'])),
        tree(st, D, 420, 640, .82),
        flower(st, D, 860, 640, C['red']),
        flower(st, D, 905, 662, C['yellow']),
        butterfly(st, D, 930, 420, C['red'], 1.3),
        butterfly(st, D, 340, 470, C['yellow'], 1.0),
        open_book(st, D, 660, 700, 900, 220),
        tag('path', d='M330 760 L560 750 M330 790 L590 784 M330 820 L520 818', stroke=C['gray'], stroke_width=8, stroke_linecap='round', fill='none'),
        tag('path', d='M760 750 L990 760 M740 784 L990 790 M800 818 L990 820', stroke=C['gray'], stroke_width=8, stroke_linecap='round', fill='none'),
        mia(st, D, 440, 160, .95, 'happy', 'front', 'wave'),
        leo(st, D, 760, 520, 1.05),
    ]
    return svg_doc(W, H, ''.join(b), D, 'Illustration of Mia waving and Leo the fox standing on an open storybook')


def kite(st, D, kx, ky):
    P = lambda c: st.paint(c, D)
    tail = f'M{kx} {ky + 70} q-30 40 0 80 q30 40 0 80'
    bows = ''.join(tag('path', d=f'M{kx - 12} {ky + y - 8} L{kx + 12} {ky + y + 8} L{kx + 12} {ky + y - 8} L{kx - 12} {ky + y + 8}Z',
                       **P(c)) for y, c in ((110, C['yellow']), (160, C['teal']), (215, C['yellow'])))
    return (tag('path', d=tail, fill='none', stroke=st.ink, stroke_width=3)
            + bows
            + tag('path', d=f'M{kx} {ky - 62} L{kx + 44} {ky} L{kx} {ky + 72} L{kx - 44} {ky}Z', **P(C['red']))
            + tag('path', d=f'M{kx} {ky - 62} V{ky + 72} M{kx - 44} {ky} H{kx + 44}', stroke=C['yellow'], stroke_width=5, fill='none'))


def castle(st, D, cx, by):
    P = lambda c: st.paint(c, D)
    out = [
        tag('rect', x=cx - 21, y=by - 160, width=42, height=80, **P(C['cream'])),
        tag('path', d=f'M{cx - 29} {by - 158} L{cx} {by - 214} L{cx + 29} {by - 158}Z', **P(C['red'])),
        tag('path', d=f'M{cx} {by - 214} V{by - 248}', stroke=st.ink, stroke_width=3),
        tag('path', d=f'M{cx} {by - 248} l30 9 l-30 9Z', **P(C['yellow'])),
        tag('rect', x=cx - 64, y=by - 96, width=128, height=96, **P(C['cream'])),
    ]
    for tx in (cx - 92, cx + 56):
        out.append(tag('rect', x=tx, y=by - 128, width=36, height=128, **P(C['cream'])))
        out.append(tag('path', d=f'M{tx - 7} {by - 126} L{tx + 18} {by - 176} L{tx + 43} {by - 126}Z', **P(C['red'])))
        out.append(tag('rect', x=tx + 12, y=by - 100, width=12, height=18, rx=6, fill=C['ink']))
    out.append(tag('path', d=f'M{cx - 18} {by} V{by - 34} a18 18 0 0 1 36 0 V{by}Z', fill=C['ink']))
    out.append(tag('rect', x=cx - 8, y=by - 140, width=16, height=22, rx=8, fill=C['ink']))
    return ''.join(out)


def hero_scene():
    """Wide storybook scene for the hero; the left of the sky stays clear for the headline."""
    D, st = Defs(), CARTOON
    P = lambda c: st.paint(c, D)
    W, H = 1600, 1000
    mia_x, mia_y, mia_s = 720, 300, .86
    hand = (mia_x + 318 * mia_s, mia_y + 196 * mia_s)
    kx, ky = 1070, 200
    b = [
        tag('rect', x=0, y=0, width=W, height=H, fill=C['yellow']),
        tag('circle', cx=1290, cy=360, r=250, fill=C['cream']),
        cloud(st, D, 1400, 140, .9),
        tag('path', d='M1420 250 q10 -10 20 0 q10 -10 20 0 M1470 290 q8 -8 16 0 q8 -8 16 0', stroke=C['ink'], stroke_width=3,
            fill='none', stroke_linecap='round'),
        castle(st, D, 1290, 420),
        cloud(st, D, 1160, 380, 1.55),
        tag('path', d='M560 880 Q900 640 1290 720 Q1480 680 1620 700 L1620 1020 L560 1020Z', **P(C['leaf'])),
        tree(st, D, 1530, 760, .95),
        tag('path', d='M-20 900 Q420 830 820 860 Q1220 770 1620 830 L1620 1020 L-20 1020Z', **P(C['leafdk'])),
        open_book(st, D, 1150, 760, 380, 120),
        tag('path', d='M1060 790 L1120 784 M1060 816 L1130 812 M1180 784 L1240 790 M1172 812 L1240 816', stroke=C['gray'],
            stroke_width=6, stroke_linecap='round', fill='none'),
        tag('path', d='M1150 740 Q1040 600 1150 520 Q1230 470 1230 440', fill='none', stroke=C['white'], stroke_width=9,
            stroke_linecap='round', stroke_dasharray='1 22'),
        tag('path', d=sparkle(1100, 640, 18), fill=C['white'], stroke=C['ink'], stroke_width=2.5),
        tag('path', d=sparkle(1185, 560, 13), fill=C['red'], stroke=C['ink'], stroke_width=2.5),
        tag('path', d=sparkle(1060, 520, 10), fill=C['white'], stroke=C['ink'], stroke_width=2),
        tag('path', d=f'M{fmt(hand[0])} {fmt(hand[1])} Q{kx - 120} {ky + 260} {kx} {ky + 72}', fill='none', stroke=C['ink'],
            stroke_width=2.5),
        kite(st, D, kx, ky),
        mia(st, D, mia_x, mia_y, mia_s, 'happy', 'three', 'wave'),
        leo(st, D, 1310, 640, .86),
        flower(st, D, 640, 900, C['red']),
        flower(st, D, 680, 925, C['cream']),
        flower(st, D, 1460, 880, C['red']),
        butterfly(st, D, 1420, 560, C['red'], 1.2),
    ]
    return svg_doc(W, H, ''.join(b), D, 'Mia flies a kite beside an open storybook while Leo the fox watches a sparkle trail rise to a castle in the clouds')


def night_spread():
    D, st = Defs(), CARTOON
    P = lambda c: st.paint(c, D)
    W, H = 1600, 860
    rnd = random.Random(7)
    D.add('pages', '<clipPath id="pages"><rect x="34" y="30" width="1532" height="800" rx="6"/></clipPath>')
    stars = ''.join(tag('path', d=sparkle(rnd.randint(60, 1540), rnd.randint(50, 430), rnd.choice((6, 8, 11, 14))),
                        fill=rnd.choice((C['yellowlt'], C['white']))) for _ in range(46))
    scene = [
        tag('rect', x=0, y=0, width=W, height=H, fill=C['night']),
        tag('circle', cx=1220, cy=230, r=170, fill=C['nightlt']),
        stars,
        tag('circle', cx=1220, cy=230, r=110, **P(C['yellowlt'])),
        tag('circle', cx=1180, cy=200, r=18, fill=C['yellow']),
        tag('circle', cx=1252, cy=262, r=12, fill=C['yellow']),
        tag('path', d='M-20 640 Q380 470 820 600 Q1200 470 1640 590 L1640 900 L-20 900Z', **P(C['nightlt'])),
        tag('path', d='M-20 700 Q420 560 900 720 Q1250 630 1640 700 L1640 900 L-20 900Z', **P(C['leafdeep'])),
        tree(st, D, 190, 660, .9, C['leafdk']),
        mia(st, D, 420, 300, .72, 'happy', 'back', 'down'),
        leo(st, D, 650, 560, .82, flip=True),
        f'<text x="900" y="760" font-family="{SERIF}" font-size="29" fill="{C["cream"]}">Every night, Mia and Leo counted the stars.</text>',
        f'<text x="900" y="802" font-family="{SERIF}" font-size="29" fill="{C["cream"]}" font-style="italic">Tonight, one was missing.</text>',
    ]
    b = [
        tag('rect', x=0, y=0, width=W, height=H, rx=16, fill=C['reddk']),
        f'<g clip-path="url(#pages)">{"".join(scene)}</g>',
        tag('rect', x=788, y=30, width=24, height=800, fill=C['ink'], fill_opacity=.22),
        tag('rect', x=799, y=30, width=2, height=800, fill=C['ink'], fill_opacity=.35),
    ]
    return svg_doc(W, H, ''.join(b), D, 'Sample picture book spread: Mia and Leo look up at the moon on a starry night')


def cover():
    D, st = Defs(), CARTOON
    P = lambda c: st.paint(c, D)
    W, H = 900, 1200
    b = [
        tag('rect', x=0, y=0, width=W, height=H, fill=C['teal']),
        tag('circle', cx=450, cy=640, r=300, fill=C['tealdk']),
        tag('circle', cx=450, cy=640, r=220, **P(C['yellowlt'])),
        tag('path', d=sparkle(140, 470, 22), fill=C['cream']),
        tag('path', d=sparkle(780, 420, 28), fill=C['cream']),
        tag('path', d=sparkle(740, 860, 16), fill=C['cream']),
        tag('path', d='M-20 1000 Q300 860 520 960 Q720 880 920 960 L920 1220 L-20 1220Z', **P(C['leafdk'])),
        mia(st, D, 160, 470, .82, 'happy', 'front', 'wave'),
        leo(st, D, 500, 790, .95),
        f'<text x="450" y="150" text-anchor="middle" font-family="{SERIF}" font-size="52" fill="{C["cream"]}" font-style="italic">Mia and the</text>',
        f'<text x="450" y="262" text-anchor="middle" font-family="{SERIF}" font-size="120" font-weight="700" fill="{C["cream"]}">Moon Fox</text>',
        tag('rect', x=0, y=1110, width=W, height=90, fill=C['ink']),
        f'<text x="450" y="1166" text-anchor="middle" font-family="{SERIF}" font-size="30" letter-spacing="3" fill="{C["yellow"]}">STUDIO SAMPLE COVER</text>',
    ]
    return svg_doc(W, H, ''.join(b), D, 'Sample cover illustration titled Mia and the Moon Fox')


def garden_scene(st, D, w, h):
    P = lambda c: st.paint(c, D)
    return ''.join([
        tag('rect', x=0, y=0, width=w, height=h, **{'fill': st.flat_color(C['sky'])}),
        tag('circle', cx=w - 150, cy=150, r=80, **P(C['yellow'])),
        cloud(st, D, 90, 140, 1.0),
        cloud(st, D, 420, 90, .8),
        hills(st, D, w, h - 260, [C['leaf'], C['leafdk']], seed=3),
        tree(st, D, 160, h - 140, .9),
        flower(st, D, 560, h - 110, C['red']),
        flower(st, D, 610, h - 80, C['yellow']),
        flower(st, D, 820, h - 100, C['pink']),
        butterfly(st, D, 700, 300, C['yellow'], 1.4),
        butterfly(st, D, 560, 230, C['red'], 1.1),
        mia(st, D, 200, h - 610, .85, 'happy', 'three', 'wave'),
        leo(st, D, 520, h - 280, .95),
    ])


def story_page(mode):
    D = Defs()
    st = LINE if mode == 'line' else CARTOON
    W, H = 900, 1200
    D.add('art', '<clipPath id="art"><rect x="60" y="60" width="780" height="820" rx="4"/></clipPath>')
    b = [
        tag('rect', x=0, y=0, width=W, height=H, fill=C['white'] if mode == 'line' else C['cream']),
        f'<g clip-path="url(#art)"><g transform="translate(60 60)">{garden_scene(st, D, 780, 820)}</g></g>',
        tag('rect', x=60, y=60, width=780, height=820, rx=4, fill='none', stroke=st.ink, stroke_width=st.sw),
    ]
    if mode == 'line':
        b.append(f'<text x="450" y="980" text-anchor="middle" font-family="{SERIF}" font-size="44" font-weight="700" fill="{C["ink"]}">Color Mia and Leo&#8217;s garden</text>')
        b.append(f'<text x="450" y="1040" text-anchor="middle" font-family="{SERIF}" font-size="28" fill="#555">Coloring page sample</text>')
        title = 'Sample coloring page: line art of Mia and Leo in a garden'
    else:
        b.append(f'<text x="80" y="970" font-family="{SERIF}" font-size="36" fill="{C["ink"]}">Leo chased a yellow butterfly all</text>')
        b.append(f'<text x="80" y="1018" font-family="{SERIF}" font-size="36" fill="{C["ink"]}">the way to the old oak tree.</text>')
        b.append(f'<text x="450" y="1130" text-anchor="middle" font-family="{SERIF}" font-size="24" fill="#8a7f6c">12</text>')
        title = 'Sample storybook page: Mia and Leo play in a sunny garden'
    return svg_doc(W, H, ''.join(b), D, title)


def maze_page():
    D, st = Defs(), LINE
    W, H = 900, 1200
    cols, rows, cell = 10, 11, 66
    ox, oy = (W - cols * cell) / 2, 250
    rnd = random.Random(11)
    walls = {(c, r): {'N', 'S', 'E', 'W'} for c in range(cols) for r in range(rows)}
    seen, stack = {(0, 0)}, [(0, 0)]
    moves = {'N': (0, -1, 'S'), 'S': (0, 1, 'N'), 'E': (1, 0, 'W'), 'W': (-1, 0, 'E')}
    while stack:
        c, r = stack[-1]
        options = [(k, c + dc, r + dr, opp) for k, (dc, dr, opp) in moves.items()
                   if 0 <= c + dc < cols and 0 <= r + dr < rows and (c + dc, r + dr) not in seen]
        if not options:
            stack.pop()
            continue
        k, nc, nr, opp = rnd.choice(options)
        walls[(c, r)].discard(k)
        walls[(nc, nr)].discard(opp)
        seen.add((nc, nr))
        stack.append((nc, nr))
    walls[(0, 0)].discard('W')
    walls[(cols - 1, rows - 1)].discard('E')
    d = []
    for (c, r), ws in walls.items():
        x, y = ox + c * cell, oy + r * cell
        if 'N' in ws: d.append(f'M{fmt(x)} {fmt(y)}h{cell}')
        if 'W' in ws: d.append(f'M{fmt(x)} {fmt(y)}v{cell}')
        if r == rows - 1 and 'S' in ws: d.append(f'M{fmt(x)} {fmt(y + cell)}h{cell}')
        if c == cols - 1 and 'E' in ws: d.append(f'M{fmt(x + cell)} {fmt(y)}v{cell}')
    b = [
        tag('rect', x=0, y=0, width=W, height=H, fill=C['white']),
        f'<text x="450" y="130" text-anchor="middle" font-family="{SERIF}" font-size="52" font-weight="700" fill="{C["ink"]}">Help Leo find Mia</text>',
        f'<text x="450" y="185" text-anchor="middle" font-family="{SERIF}" font-size="28" fill="#555">Activity page sample</text>',
        tag('path', d=''.join(d), fill='none', stroke=C['ink'], stroke_width=6, stroke_linecap='round'),
        leo(CARTOON, D, ox - 120, oy - 40, .42),
        f'<g transform="translate({fmt(ox + cols * cell + 6)} {fmt(oy + rows * cell - 120)}) scale(.5)">{mia_head(CARTOON, D, 100, 120, "happy")}</g>',
        tag('path', d=sparkle(140, 1080, 20), fill=C['yellow'], stroke=C['ink'], stroke_width=3),
        tag('path', d=sparkle(760, 1100, 26), fill=C['red'], stroke=C['ink'], stroke_width=3),
    ]
    return svg_doc(W, H, ''.join(b), D, 'Sample activity page: a maze to help Leo the fox reach Mia')


def character_sheet():
    D, st = Defs(), CARTOON
    W, H = 1600, 1000
    grid = ''.join(f'M{x} 0V{H}' for x in range(0, W, 40)) + ''.join(f'M0 {y}H{W}' for y in range(0, H, 40))
    label = lambda x, y, t, size=26: f'<text x="{x}" y="{y}" text-anchor="middle" font-family="{SERIF}" font-size="{size}" fill="{C["ink"]}">{t}</text>'
    b = [
        tag('rect', x=0, y=0, width=W, height=H, fill=C['white']),
        tag('path', d=grid, stroke='#efe9dc', stroke_width=1.5, fill='none'),
        f'<text x="60" y="92" font-family="{SERIF}" font-size="46" font-weight="700" fill="{C["ink"]}">Mia</text>',
        f'<text x="160" y="92" font-family="{SERIF}" font-size="28" fill="#6b6255">character sheet · studio sample</text>',
        tag('path', d='M60 870 H920', stroke=C['ink'], stroke_width=3),
        mia(st, D, 30, 210, .98, 'calm', 'front', 'down'),
        mia(st, D, 320, 210, .98, 'calm', 'three', 'down'),
        mia(st, D, 610, 210, .98, 'calm', 'back', 'down'),
        label(226, 930, 'Front'), label(516, 930, 'Three-quarter'), label(806, 930, 'Back'),
        tag('rect', x=980, y=150, width=560, height=740, rx=12, fill=C['paper']),
    ]
    for i, (ex, name) in enumerate((('happy', 'Happy'), ('sad', 'Sad'), ('angry', 'Angry'), ('surprised', 'Surprised'))):
        cx, cy = 1125 + (i % 2) * 270, 330 + (i // 2) * 330
        b.append(f'<g transform="translate({cx - 100} {cy - 110}) scale(1.0)">{mia_head(st, D, 100, 110, ex)}</g>')
        b.append(label(cx, cy + 135, name))
    for i, col in enumerate((C['hair'], C['skin'], C['red'], C['yellow'], C['blue'])):
        b.append(tag('circle', cx=1040 + i * 56, cy=110, r=20, fill=col, stroke=C['ink'], stroke_width=3))
    return svg_doc(W, H, ''.join(b), D, 'Sample character sheet for Mia: front, three-quarter and back views with four expressions')


def style_tiles():
    tiles = {}
    specs = {
        'cartoon': (Style(), C['yellowlt']),
        'watercolor': (Style(outline=False, mode='wash'), '#fbf6ea'),
        'flat': (Style(outline=False, details=False), C['sky']),
        'comic': (Style(sw=6.5), C['yellow']),
        'line-art': (Style(mode='line', sw=3, ink='#2a2522'), C['white']),
        'soft-3d': (Style(outline=False, mode='grad'), '#f3eee4'),
    }
    for name, (st, bg) in specs.items():
        D = Defs()
        W, H = 600, 720
        b = [tag('rect', x=0, y=0, width=W, height=H, fill=bg)]
        if name == 'comic':
            b.append(tag('rect', x=0, y=0, width=W, height=H, fill=D.dots(C['red'], 18, 3.6), fill_opacity=.5))
            rays = ''.join(f'M300 330 L{fmt(300 + math.cos(a) * 700)} {fmt(330 + math.sin(a) * 700)} '
                           f'L{fmt(300 + math.cos(a + .14) * 700)} {fmt(330 + math.sin(a + .14) * 700)}Z'
                           for a in [i * math.tau / 18 for i in range(18)])
            b.append(tag('path', d=rays, fill=C['white'], fill_opacity=.45))
        if name == 'watercolor':
            st.group_filter = D.watercolor()
            b.append(tag('path', d=blob(300, 330, 230, bumps=9, amp=.08), fill=C['sky'], fill_opacity=.6, filter=D.watercolor()))
        if name == 'line-art':
            st.group_filter = D.pencil()
        if name == 'soft-3d':
            b.append(tag('ellipse', cx=300, cy=668, rx=150, ry=22, fill=C['ink'], fill_opacity=.12))
        if name == 'flat':
            b.append(tag('circle', cx=300, cy=310, r=220, fill=C['white'], fill_opacity=.7))
        b.append(mia(st, D, 108, 60, .96, 'happy', 'front', 'wave'))
        if name in ('watercolor', 'line-art'):
            b.append(tag('rect', x=0, y=0, width=W, height=H, filter=D.grain()))
        tiles[f'style-{name}.svg'] = svg_doc(W, H, ''.join(b), D, f'Mia drawn in a {name.replace("-", " ")} style')
    return tiles


def formats():
    D, st = Defs(), CARTOON
    P = lambda c: st.paint(c, D)
    W, H = 1200, 860
    b = [
        tag('ellipse', cx=600, cy=780, rx=540, ry=34, fill=C['ink'], fill_opacity=.08),
        # hardcover with spine
        tag('rect', x=90, y=220, width=60, height=540, rx=8, **P(C['reddk'])),
        mini_cover(st, D, 140, 210, 360, 560, C['teal']),
        # paperback
        mini_cover(st, D, 560, 330, 280, 430, C['red']),
        # e-reader
        tag('rect', x=890, y=180, width=250, height=580, rx=34, **P(C['screen'])),
        mini_cover(st, D, 912, 230, 206, 330, C['teal']),
        tag('rect', x=912, y=580, width=206, height=14, rx=7, fill='#5a5a5a'),
        tag('rect', x=912, y=610, width=150, height=14, rx=7, fill='#5a5a5a'),
        tag('circle', cx=1015, cy=712, r=16, fill='#444'),
    ]
    return svg_doc(W, H, ''.join(b), D, 'Hardcover, paperback and eBook editions of a sample picture book')


def marketing():
    D, st = Defs(), CARTOON
    P = lambda c: st.paint(c, D)
    W, H = 1200, 860
    b = [
        # laptop with author website
        tag('rect', x=80, y=160, width=720, height=470, rx=20, **P(C['screen'])),
        tag('rect', x=108, y=188, width=664, height=414, fill=C['white']),
        tag('rect', x=108, y=188, width=664, height=50, fill=C['paper']),
        tag('rect', x=130, y=204, width=110, height=18, rx=9, fill=C['ink']),
        *[tag('rect', x=500 + i * 70, y=207, width=50, height=12, rx=6, fill='#bdb4a3') for i in range(4)],
        mini_cover(st, D, 140, 270, 200, 300, C['teal']),
        tag('rect', x=380, y=290, width=320, height=30, rx=8, fill=C['ink']),
        tag('rect', x=380, y=344, width=340, height=14, rx=7, fill='#cfc7b8'),
        tag('rect', x=380, y=372, width=300, height=14, rx=7, fill='#cfc7b8'),
        tag('rect', x=380, y=400, width=320, height=14, rx=7, fill='#cfc7b8'),
        tag('rect', x=380, y=460, width=170, height=50, rx=10, fill=C['red']),
        tag('path', d='M30 640 H850 L800 690 H80Z', **P('#bfb8ab')),
        # phone with a launch post
        tag('rect', x=850, y=250, width=260, height=520, rx=36, **P(C['ink'])),
        tag('rect', x=868, y=300, width=224, height=420, rx=8, fill=C['white']),
        tag('circle', cx=900, cy=332, r=18, fill=C['yellow']),
        tag('rect', x=928, y=324, width=110, height=14, rx=7, fill='#cfc7b8'),
        mini_cover(st, D, 884, 366, 192, 230, C['red']),
        tag('path', d='M900 640 c-12-14 -30 0 -18 16 l18 18 l18-18 c12-16 -6-30 -18-16Z', fill=C['red']),
        tag('rect', x=940, y=632, width=120, height=14, rx=7, fill='#cfc7b8'),
        # megaphone
        f'<g transform="translate(-60 -24) rotate(-18 1000 140)">'
        + tag('path', d='M930 110 L1070 50 L1070 230 L930 170Z', **P(C['red']))
        + tag('rect', x=890, y=104, width=50, height=72, rx=10, **P(C['yellow']))
        + tag('rect', x=905, y=172, width=26, height=60, rx=8, **P(C['ink'])) + '</g>',
        tag('path', d='M1050 46 L1100 16 M1060 106 L1120 106 M1050 166 L1100 196', stroke=C['ink'], stroke_width=8, stroke_linecap='round', fill='none'),
    ]
    return svg_doc(W, H, ''.join(b), D, 'Author website on a laptop and a book launch post on a phone')


def sample_sketch():
    D = Defs()
    P = lambda c: CARTOON.paint(c, D)
    W, H = 1000, 860
    b = [
        tag('circle', cx=500, cy=430, r=380, fill=C['white']),
        # sketch pad on an easel
        tag('path', d='M210 760 L300 200 M450 760 L360 200 M330 760 L330 300', stroke=C['brown'], stroke_width=16, stroke_linecap='round', fill='none'),
        tag('rect', x=150, y=170, width=360, height=440, rx=10, **P(C['white'])),
        tag('rect', x=150, y=170, width=360, height=34, rx=10, **P(C['red'])),
        leo(LINE, D, 200, 300, 1.0),
        tag('path', d=sparkle(470, 260, 16), fill=C['yellow'], stroke=C['ink'], stroke_width=3),
        mia(CARTOON, D, 520, 190, .92, 'happy', 'three', 'pencil', prop='pencil'),
    ]
    return svg_doc(W, H, ''.join(b), D, 'Mia sketching Leo the fox on an easel')


# ---------------------------------------------------------------- About page

def floating_page(st, D, x, y, w, h, rot, mark=None):
    """A loose manuscript page with text lines, tilted by rot degrees."""
    P = lambda c: st.paint(c, D)
    lines = ''.join(f'M{x + 24} {y + 40 + i * 26}H{x + w - (24 if i % 3 else 60)}' for i in range(int((h - 60) / 26)))
    out = [tag('rect', x=x, y=y, width=w, height=h, rx=6, **P(C['cream'])),
           tag('path', d=lines, stroke=C['gray'], stroke_width=8, stroke_linecap='round', fill='none')]
    if mark == 'star':
        out.append(tag('path', d=sparkle(x + w - 46, y + h - 50, 22), fill=C['red'], stroke=C['ink'], stroke_width=2.5))
    if mark == 'circle':
        out.append(tag('ellipse', cx=x + w / 2, cy=y + 66, rx=w / 2 - 14, ry=20, fill='none', stroke=C['red'], stroke_width=4))
    return f'<g transform="rotate({rot} {x + w / 2} {y + h / 2})">{"".join(out)}</g>'


def book_block(st, D, x, y, w, h, color):
    """A closed book lying flat, seen from the front: cover edge, page block and spine bands."""
    P = lambda c: st.paint(c, D)
    return ''.join([
        tag('rect', x=x, y=y, width=w, height=h, rx=8, **P(color)),
        tag('rect', x=x + w - 46, y=y + 12, width=34, height=h - 24, rx=4, **P(C['cream'])),
        tag('path', d=f'M{x + 40} {y + 14}V{y + h - 14} M{x + 62} {y + 14}V{y + h - 14}', stroke=C['yellowlt'] if color != C['yellow'] else C['reddk'],
            stroke_width=6, stroke_linecap='round'),
    ])


def about_hero():
    """Mia reads on top of a stack of books while Leo looks up and manuscript pages drift around them."""
    D, st = Defs(), CARTOON
    P = lambda c: st.paint(c, D)
    W, H = 1200, 1050
    b = [
        tag('rect', x=0, y=0, width=W, height=H, fill=C['yellow']),
        tag('circle', cx=620, cy=470, r=390, fill=C['cream']),
        floating_page(st, D, 120, 170, 200, 260, -12, 'circle'),
        floating_page(st, D, 900, 140, 190, 250, 9, 'star'),
        floating_page(st, D, 950, 470, 150, 190, -5),
        tag('path', d=sparkle(380, 120, 22), fill=C['red']),
        tag('path', d=sparkle(820, 90, 16), fill=C['white'], stroke=C['ink'], stroke_width=2.5),
        tag('path', d=sparkle(250, 560, 14), fill=C['white'], stroke=C['ink'], stroke_width=2.5),
        butterfly(st, D, 860, 420, C['red'], 1.2),
        tag('path', d='M-20 900 Q400 860 620 880 Q900 860 1220 900 L1220 1070 L-20 1070Z', **P(C['leafdk'])),
        book_block(st, D, 330, 820, 560, 84, C['red']),
        book_block(st, D, 370, 740, 480, 80, C['teal']),
        book_block(st, D, 410, 668, 400, 72, C['yellow']),
        mia(st, D, 432, 132, .88, 'happy', 'front', 'hold', prop='book'),
        leo(st, D, 70, 668, 1.0),
        f'<g transform="translate(150 -170)">{pencil_prop(st, D, 960, 860)}</g>',
        flower(st, D, 1010, 930, C['red']),
        flower(st, D, 1060, 960, C['cream']),
        flower(st, D, 180, 950, C['red']),
    ]
    return svg_doc(W, H, ''.join(b), D, 'Mia reads on top of a stack of books while Leo the fox looks up and manuscript pages drift around them')


def journey_panels(D):
    """Four 400 x 500 pages showing one spread move from manuscript to finished illustration."""
    sketch = Style(mode='line', sw=3, ink='#4a4440', details=False, group_filter=D.pencil())
    flats = Style(outline=False, details=False)
    panels = []
    for i, (kind, st) in enumerate((('manuscript', None), ('sketch', sketch), ('flats', flats), ('final', CARTOON))):
        out = [tag('rect', x=0, y=0, width=400, height=500, rx=8, fill=C['white'], stroke=C['ink'], stroke_width=4)]
        if kind == 'manuscript':
            out.append(f'<text x="34" y="78" font-family="{SERIF}" font-size="30" font-weight="700" fill="{C["ink"]}">Leo and the</text>')
            out.append(f'<text x="34" y="116" font-family="{SERIF}" font-size="30" font-weight="700" fill="{C["ink"]}">Yellow Butterfly</text>')
            lines = ''.join(f'M34 {170 + k * 34}H{366 - (k * 37) % 120}' for k in range(8))
            out.append(tag('path', d=lines, stroke=C['gray'], stroke_width=10, stroke_linecap='round', fill='none'))
            out.append(tag('ellipse', cx=150, cy=238, rx=120, ry=24, fill='none', stroke=C['red'], stroke_width=4))
            out.append(tag('path', d='M282 232 q40 -40 70 -10', fill='none', stroke=C['red'], stroke_width=4, stroke_linecap='round'))
            out.append(tag('path', d='M50 452 q30 -18 60 0 t60 0', fill='none', stroke=C['red'], stroke_width=4, stroke_linecap='round'))
        else:
            clip = f'jp{i}'
            D.add(clip, f'<clipPath id="{clip}"><rect x="20" y="20" width="360" height="360" rx="4"/></clipPath>')
            out.append(f'<g clip-path="url(#{clip})"><g transform="translate(20 20) scale(.4615)">{garden_scene(st, D, 780, 780)}</g></g>')
            out.append(tag('rect', x=20, y=20, width=360, height=360, rx=4, fill='none', stroke=C['ink'], stroke_width=3))
            if kind == 'final':
                out.append(f'<text x="34" y="430" font-family="{SERIF}" font-size="24" fill="{C["ink"]}">Leo chased a yellow butterfly</text>')
                out.append(f'<text x="34" y="462" font-family="{SERIF}" font-size="24" fill="{C["ink"]}">all the way to the old oak tree.</text>')
            else:
                out.append(tag('path', d='M34 424H340 M34 456H280', stroke=C['gray'], stroke_width=10, stroke_linecap='round', fill='none'))
        panels.append(''.join(out))
    return panels


def about_journey(layout):
    D = Defs()
    panels = journey_panels(D)
    if layout == 'wide':
        W, H, gap = 2080, 620, 120
        b = [tag('rect', x=0, y=0, width=W, height=H, fill=C['yellow'])]
        for i, p in enumerate(panels):
            x = 60 + i * (400 + gap)
            b.append(f'<g transform="translate({x} 60)">{p}</g>')
            if i < 3:
                ax = x + 400 + 22
                b.append(tag('path', d=f'M{ax} 310 H{ax + 70} M{ax + 52} 292 L{ax + 72} 310 L{ax + 52} 328', fill='none',
                             stroke=C['ink'], stroke_width=6, stroke_linecap='round', stroke_linejoin='round'))
    else:
        W, H = 1000, 1240
        b = [tag('rect', x=0, y=0, width=W, height=H, fill=C['yellow'])]
        for i, p in enumerate(panels):
            b.append(f'<g transform="translate({60 + (i % 2) * 480} {80 + (i // 2) * 580})">{p}</g>')
    return svg_doc(W, H, ''.join(b), D, 'One picture book page moving from manuscript to pencil sketch, flat color and finished illustration')


def about_layouts():
    """Three page layouts with short read-aloud text: full bleed, vignette and split."""
    D, st = Defs(), CARTOON
    P = lambda c: st.paint(c, D)
    W, H = 1460, 680
    rnd = random.Random(5)
    pw, ph = 400, 540
    pages = []

    # Full bleed: the art fills the page and the words sit on the night sky.
    stars = ''.join(tag('path', d=sparkle(rnd.randint(20, 380), rnd.randint(30, 200), rnd.choice((5, 7, 9))), fill=C['yellowlt'])
                    for _ in range(16))
    full = [
        tag('rect', x=0, y=0, width=pw, height=ph, fill=C['night']),
        stars,
        tag('circle', cx=300, cy=120, r=56, fill=C['yellowlt']),
        tag('path', d='M-10 330 Q200 250 410 330 L410 560 L-10 560Z', fill=C['leafdeep']),
        mia(st, D, 60, 150, .42, 'happy', 'back', 'down'),
        leo(st, D, 210, 300, .42, flip=True),
        f'<text x="200" y="460" text-anchor="middle" font-family="{SERIF}" font-size="34" fill="{C["cream"]}">The moon was round.</text>',
        f'<text x="200" y="504" text-anchor="middle" font-family="{SERIF}" font-size="34" font-style="italic" fill="{C["yellow"]}">Where was Leo?</text>',
    ]
    # Vignette: a small round picture and large, simple words.
    D.add('vig', '<clipPath id="vig"><circle cx="200" cy="200" r="140"/></clipPath>')
    vignette = [
        tag('rect', x=0, y=0, width=pw, height=ph, fill=C['white']),
        f'<g clip-path="url(#vig)">'
        + tag('rect', x=60, y=60, width=280, height=280, fill=C['sky'])
        + tag('path', d='M40 270 Q200 220 360 270 L360 360 L40 360Z', fill=C['leaf'])
        + tree(st, D, 130, 300, .6)
        + leo(st, D, 170, 190, .55)
        + '</g>',
        tag('circle', cx=200, cy=200, r=140, fill='none', stroke=C['ink'], stroke_width=4),
        f'<text x="200" y="430" text-anchor="middle" font-family="{SERIF}" font-size="40" fill="{C["ink"]}">Leo hid behind</text>',
        f'<text x="200" y="482" text-anchor="middle" font-family="{SERIF}" font-size="40" fill="{C["ink"]}">the old oak tree.</text>',
    ]
    # Split: picture on top, words below.
    split = [
        tag('rect', x=0, y=0, width=pw, height=ph, fill=C['cream']),
        tag('rect', x=0, y=0, width=pw, height=330, fill=C['sky']),
        tag('circle', cx=330, cy=70, r=36, fill=C['yellow']),
        tag('path', d='M-10 250 Q160 200 410 260 L410 330 L-10 330Z', fill=C['leaf']),
        butterfly(st, D, 300, 150, C['yellow'], 1.3),
        mia(st, D, 50, 60, .42, 'surprised', 'three', 'wave'),
        tag('path', d='M0 330 H400', stroke=C['ink'], stroke_width=3),
        f'<text x="36" y="410" font-family="{SERIF}" font-size="36" fill="{C["ink"]}">&#8220;Look!&#8221; said Mia.</text>',
        f'<text x="36" y="460" font-family="{SERIF}" font-size="36" fill="{C["ink"]}">The butterfly flew</text>',
        f'<text x="36" y="510" font-family="{SERIF}" font-size="36" fill="{C["ink"]}">up, up, up.</text>',
    ]
    b = []  # transparent, so the page shows through
    for i, page in enumerate((full, vignette, split)):
        x, y = 60 + i * (pw + 70), 70
        clip = f'lp{i}'
        D.add(clip, f'<clipPath id="{clip}"><rect width="{pw}" height="{ph}" rx="6"/></clipPath>')
        pages.append(f'<g transform="translate({x} {y})"><g clip-path="url(#{clip})">{"".join(page)}</g>'
                     + tag('rect', x=0, y=0, width=pw, height=ph, rx=6, fill='none', stroke=C['ink'], stroke_width=4) + '</g>')
    b += pages
    return svg_doc(W, H, ''.join(b), D, 'Three sample page layouts: a full-bleed night scene, a round vignette, and a picture above the words')


def about_series():
    """Three finished books of a series on a shelf, with the fourth still a pencil sketch."""
    D, st = Defs(), CARTOON
    P = lambda c: st.paint(c, D)
    W, H = 1400, 1000
    sketch = Style(mode='line', sw=3, ink='#4a4440', group_filter=D.pencil())
    badge = lambda x, y, n: (tag('circle', cx=x, cy=y, r=30, **P(C['yellow']))
                             + f'<text x="{x}" y="{y + 12}" text-anchor="middle" font-family="{SERIF}" font-size="34" font-weight="700" fill="{C["ink"]}">{n}</text>')
    b = [
        tag('circle', cx=700, cy=460, r=400, fill=C['yellow']),
        tag('path', d=sparkle(250, 170, 22), fill=C['red']),
        tag('path', d=sparkle(1170, 220, 18), fill=C['white'], stroke=C['ink'], stroke_width=2.5),
        # shelf
        tag('rect', x=90, y=780, width=1220, height=40, rx=8, **P(C['brown'])),
        tag('path', d='M180 820 L210 900 M1220 820 L1190 900', stroke=C['ink'], stroke_width=8, stroke_linecap='round'),
        mini_cover(st, D, 150, 380, 260, 400, C['teal']), badge(370, 730, 1),
        mini_cover(st, D, 440, 350, 260, 430, C['red']), badge(660, 730, 2),
        mini_cover(st, D, 730, 400, 240, 380, C['night']), badge(930, 730, 3),
        # book four, still a sketch on loose paper
        f'<g transform="rotate(6 1140 600)">'
        + tag('rect', x=1010, y=430, width=250, height=340, rx=6, fill=C['white'], stroke=C['ink'], stroke_width=4)
        + f'<g filter="{sketch.group_filter}">'
        + tag('rect', x=1040, y=460, width=190, height=280, fill='none', stroke='#4a4440', stroke_width=3, stroke_dasharray='14 8')
        + tag('path', d='M1060 490 H1200 M1060 520 H1160', stroke='#4a4440', stroke_width=5, stroke_linecap='round')
        + leo(sketch, D, 1060, 560, .55)
        + '</g>'
        + '</g>',
        badge(1240, 740, 4),
    ]
    return svg_doc(W, H, ''.join(b), D, 'Three finished books in a picture book series on a shelf, with the fourth book still a pencil sketch')


def paper_plane(st, D, x, y, s=1.0, rot=0):
    P = lambda c: st.paint(c, D)
    return (f'<g transform="translate({x} {y}) rotate({rot}) scale({s})">'
            + tag('path', d='M0 0 L150 50 L40 70Z', **P(C['white']))
            + tag('path', d='M40 70 L150 50 L58 104Z', **P(C['gray']))
            + tag('path', d='M40 70 L58 104 L66 82', fill='none', stroke=st.ink, stroke_width=st.sw, stroke_linejoin='round')
            + '</g>')


def contact_scene():
    """Mia holds a letter while a paper plane carries another one off and Leo watches. Transparent background."""
    D, st = Defs(), CARTOON
    P = lambda c: st.paint(c, D)
    W, H = 1000, 900
    D.add('cscene', '<clipPath id="cscene"><circle cx="500" cy="450" r="400"/></clipPath>')
    b = [
        tag('circle', cx=500, cy=450, r=400, fill=C['cream']),
        '<g clip-path="url(#cscene)">'
        + cloud(st, D, 210, 190, .9)
        + tag('path', d='M60 760 Q330 650 560 720 Q780 650 960 730 L960 900 L60 900Z', **P(C['leaf']))
        + tag('path', d='M60 820 Q420 760 960 810 L960 900 L60 900Z', **P(C['leafdk']))
        + flower(st, D, 210, 780, C['red'])
        + flower(st, D, 250, 805, C['yellow'])
        + flower(st, D, 820, 790, C['red'])
        + '</g>',
        tag('path', d='M430 420 Q560 300 640 340 Q720 380 780 250', fill='none', stroke=C['ink'], stroke_width=4,
            stroke_linecap='round', stroke_dasharray='2 18'),
        paper_plane(st, D, 760, 170, 1.0, -18),
        tag('path', d=sparkle(700, 140, 18), fill=C['red']),
        tag('path', d=sparkle(880, 330, 14), fill=C['white'], stroke=C['ink'], stroke_width=2.5),
        tag('path', d=sparkle(170, 420, 16), fill=C['yellow'], stroke=C['ink'], stroke_width=2.5),
        mia(st, D, 170, 236, .86, 'happy', 'front', 'hold', prop='letter'),
        leo(st, D, 560, 580, .92, flip=True),
    ]
    return svg_doc(W, H, ''.join(b), D, 'Mia holds a letter while a paper plane flies off with another and Leo the fox watches')


def main(out_dir):
    os.makedirs(out_dir, exist_ok=True)
    files = {
        'hero-scene.svg': hero_scene(),
        'spread-night.svg': night_spread(),
        'cover-moon-fox.svg': cover(),
        'page-story.svg': story_page('color'),
        'page-coloring.svg': story_page('line'),
        'page-maze.svg': maze_page(),
        'character-sheet.svg': character_sheet(),
        'formats.svg': formats(),
        'marketing.svg': marketing(),
        'sample-sketch.svg': sample_sketch(),
        **style_tiles(),
        'about-hero.svg': about_hero(),
        'about-journey-wide.svg': about_journey('wide'),
        'about-journey-stacked.svg': about_journey('stacked'),
        'about-layouts.svg': about_layouts(),
        'about-series.svg': about_series(),
        'contact-scene.svg': contact_scene(),
    }
    for name, svg in files.items():
        with open(os.path.join(out_dir, name), 'w', encoding='utf-8') as fh:
            fh.write(svg)
        print(f'{name:28s} {len(svg.encode()) / 1024:6.1f} KB')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'src/assets/artwork')
