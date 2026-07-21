# Iterator — Interview Questions

**What problem does Iterator solve?**
It lets client code traverse a collection's elements one at a time using a uniform `hasNext()`/`next()` interface, without needing to know or depend on how the collection stores its elements internally (array, linked list, tree, etc). Changing the internal storage doesn't break traversal code.

**How does Iterator support multiple simultaneous traversals of the same collection?**
Because each iterator holds its own cursor/position state separate from the collection itself, you can create several independent iterators over the same collection, each tracking its own progress, without them interfering with each other.

**Do you need to implement Iterator by hand in modern languages?**
Rarely, for standard use — most modern languages have Iterator baked directly into their syntax (Python's `__iter__`/`__next__`, Java's `Iterable`, JavaScript's `Symbol.iterator`, C++ ranges), so implementing that language's iteration protocol is usually preferable to hand-rolling a custom Iterator class from scratch, unless you have a niche traversal need the built-in protocol doesn't cover.

**What is "concurrent modification" and how does it relate to Iterator?**
It's the bug that occurs when a collection is mutated (elements added or removed) while an iterator is mid-traversal over it — the iterator's cursor and internal assumptions about the collection's size/structure no longer match reality, which can cause skipped elements, repeated elements, or a thrown exception depending on the language/implementation.
