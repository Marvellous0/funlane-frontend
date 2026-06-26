"""
One-off: turn public/background-image.png (which ships with a baked-in
transparency *checkerboard* — alternating #FFFFFF / #EEEFEF, no real alpha)
into a clean cut-out so the vehicles float on the auth hero's navy gradient.

Strategy: magic-wand flood fill from the border. The outer background is one
connected region, so flooding inward only clears it and leaves the white
interiors of the train / plane intact (they're walled off by darker outlines).
A short feather pass softens the anti-aliased rim so there's no sticker halo.
"""
from collections import deque
from PIL import Image

SRC = "public/background-image.png"
OUT = "public/hero-illustration.png"

im = Image.open(SRC).convert("RGBA")
w, h = im.size
px = im.load()


def is_bg(p):
    r, g, b, a = p
    mx, mn = max(r, g, b), min(r, g, b)
    # light + near-neutral => checkerboard / white surround
    return mn >= 210 and (mx - mn) <= 26


visited = bytearray(w * h)
dq = deque()
for x in range(w):
    dq.append((x, 0))
    dq.append((x, h - 1))
for y in range(h):
    dq.append((0, y))
    dq.append((w - 1, y))

while dq:
    x, y = dq.popleft()
    if x < 0 or y < 0 or x >= w or y >= h:
        continue
    i = y * w + x
    if visited[i]:
        continue
    visited[i] = 1
    if not is_bg(px[x, y]):
        continue
    r, g, b, _ = px[x, y]
    px[x, y] = (r, g, b, 0)
    dq.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])


def transparent(x, y):
    return 0 <= x < w and 0 <= y < h and px[x, y][3] == 0


# Feather: fade light, anti-aliased rim pixels that border the cleared area.
for _ in range(2):
    edits = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            mx, mn = max(r, g, b), min(r, g, b)
            if mn >= 196 and (mx - mn) <= 34 and (
                transparent(x + 1, y) or transparent(x - 1, y)
                or transparent(x, y + 1) or transparent(x, y - 1)
            ):
                edits.append((x, y, r, g, b))
    for x, y, r, g, b in edits:
        px[x, y] = (r, g, b, 90)

cleared = sum(1 for y in range(h) for x in range(w) if px[x, y][3] == 0)
im.save(OUT)
print(f"saved {OUT} — cleared {cleared}/{w*h} px ({100*cleared/(w*h):.1f}%)")
