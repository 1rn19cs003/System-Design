# When to Use Iterator

## Reach for it when
- You're building a custom collection type and want client code to traverse it without depending on its internal storage structure.
- You want to support multiple simultaneous, independent traversals of the same collection (each with its own iterator and cursor position).
- You want a uniform way to traverse different collection types (arrays, trees, graphs) through the same `hasNext()`/`next()` interface.

## Don't reach for it when
- Your language's built-in iteration protocol (Python's iterator protocol, Java's `Iterable`, JavaScript's `Symbol.iterator`, C++ ranges) already covers your case — implement that protocol instead of hand-rolling a bespoke Iterator class.
- The collection is simple and traversal is always the same, direct loop — introducing a separate Iterator object adds no real value.

## What interviewers are actually listening for
Recognizing that Iterator is largely already built into the language you're using, and being able to explain how (Python's `__iter__`/`__next__`, Java's `Iterable`/`Iterator` interfaces, JavaScript's iterables). Also, understanding the "concurrent modification" risk — mutating a collection while iterating over it is a classic bug, and knowing why it happens (the iterator's cursor/state assumptions no longer match the collection) demonstrates real understanding rather than rote pattern recall.
