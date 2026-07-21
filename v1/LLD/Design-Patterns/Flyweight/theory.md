# Flyweight Pattern

## Category
Structural

## The problem, in plain terms
You're building a text editor that needs to render a million characters on screen. If every single character on screen is its own object holding its own font, size, color, and glyph bitmap, you're duplicating identical font/glyph data a million times over — most characters share the exact same font and formatting. That's a huge amount of memory spent storing the same information redundantly.

Flyweight splits each object's data into two categories: **intrinsic state** (data that's shared and identical across many instances — the font, the glyph shape for the letter 'a') and **extrinsic state** (data that's unique per instance — the position on screen, which specific character it is at that position). You create and cache one shared Flyweight object per unique combination of intrinsic state, and every "instance" that needs that data just references the shared object while supplying its own extrinsic state (position) separately.

## How it's built
A `FlyweightFactory` maintains a pool of Flyweight objects, keyed by their intrinsic state. When something requests a Flyweight for a given combination of shared data, the factory returns an existing cached instance if one already exists for that combination, or creates and caches a new one if not. Client code then calls operations on the Flyweight, passing in the extrinsic (per-instance) state as arguments rather than storing it inside the Flyweight itself.

## Flyweight vs. plain caching/object pooling
They're related ideas but not identical. A generic object pool reuses objects to avoid allocation cost, often mutating and resetting them between uses. Flyweight specifically separates state into shared (intrinsic, immutable, safe to reuse) and per-context (extrinsic, supplied at call time) — the shared objects are never mutated once created, which is what makes safely sharing a single instance across thousands of "logical" instances possible.

## Where it bites you
Flyweight only pays off when you actually have a large number of objects with substantial shared state — for a few dozen objects, the factory/cache machinery is pure overhead. It also pushes complexity onto the caller, who now has to track and pass in extrinsic state correctly every time, instead of an object just holding its own data. Get the intrinsic/extrinsic split wrong (accidentally sharing something that should have been per-instance) and you get subtle, hard-to-trace bugs where unrelated instances appear to affect each other.
