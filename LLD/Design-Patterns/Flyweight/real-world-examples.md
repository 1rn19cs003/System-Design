# Flyweight — Real-World Examples

- **Text/word processor rendering** (the textbook example) — glyph/font data is shared (intrinsic) across every occurrence of the same character; position on the page is per-instance (extrinsic).
- **Java's `Integer.valueOf()` caching** — small integer values (typically -128 to 127) are cached and reused rather than creating a new `Integer` object every time, since they're immutable and safe to share.
- **String interning** (Java, Python) — identical string literals can share the same underlying memory rather than each being a separate allocation, since strings are immutable.
- **Game engines rendering large numbers of similar entities** — trees, grass, bullets, or particles sharing mesh/texture data (intrinsic) while each instance only stores position/rotation/scale (extrinsic).
- **Map/tile-based game rendering** — a tile map storing references to a small set of shared tile-type objects (grass, water, rock) rather than a full object per grid cell.
