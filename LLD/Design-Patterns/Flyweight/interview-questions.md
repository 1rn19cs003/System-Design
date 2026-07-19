# Flyweight — Interview Questions

**What's the difference between intrinsic and extrinsic state?**
Intrinsic state is data shared identically across many instances — immutable, safe to reuse, stored inside the shared Flyweight object (a character's font/glyph, a tree's mesh/texture). Extrinsic state is unique per logical instance — supplied by the caller at the point of use rather than stored in the Flyweight (a character's position on the page, a tree's x/y coordinates on the map).

**Why must intrinsic state be immutable?**
Because a single Flyweight instance is shared across potentially thousands of logical "objects." If intrinsic state could be mutated, changing it for one logical instance would change it for every other instance sharing that same Flyweight — a bug that's extremely hard to trace because unrelated objects would appear to affect each other.

**How is Flyweight different from a generic object pool?**
An object pool reuses objects to avoid allocation cost, typically resetting/mutating pooled objects between uses. Flyweight specifically separates state into shared-and-immutable (intrinsic) versus per-context (extrinsic, passed in as arguments) — the shared objects are never mutated once created, which is precisely what makes safe sharing across many logical instances possible.

**When would Flyweight actively hurt rather than help?**
When the object count is small, or when most state is actually unique per instance rather than shared — in both cases the factory/caching machinery adds complexity and indirection without meaningfully reducing memory use. It also pushes bookkeeping onto the caller, who must now track and correctly supply extrinsic state on every call instead of an object simply holding its own data.
