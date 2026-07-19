# When to Use Flyweight

## Reach for it when
- You need a very large number of objects, and most of their state is actually shared/identical across many of them (character glyphs, tree/particle instances in a game, map tile types).
- Memory footprint is a real, measured concern — not a hypothetical one — for the scale you're operating at.
- The shared (intrinsic) state can genuinely be made immutable once created, so sharing one instance across many logical "objects" is safe.

## Don't reach for it when
- You don't have a large number of objects — the factory/caching machinery is pure overhead for a small object count.
- Most of each object's state is actually unique per instance — there's little to share, so there's little memory to save.
- Objects need to be mutable and independent — Flyweight's entire safety argument relies on shared state staying immutable.

## What interviewers are actually listening for
Whether you can clearly define intrinsic vs. extrinsic state with a concrete example (a character's glyph/font is intrinsic and shared; its position on the page is extrinsic and unique) rather than describing Flyweight as vague "object caching." A strong answer also states the actual trigger — a measured or clearly anticipated memory problem from a huge object count — rather than reaching for it just because objects happen to look similar.
