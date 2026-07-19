# Iterator — Real-World Examples

- **Java's `Iterable`/`Iterator` interfaces** — any class implementing `Iterable` can be used directly in a for-each loop via its `Iterator`.
- **Python's iterator protocol** (`__iter__` and `__next__`) — powers `for` loops, generators, and comprehensions over any custom object that implements it.
- **JavaScript's iterables** (`Symbol.iterator`) — what makes `for...of`, spread syntax, and destructuring work over arrays, Maps, Sets, and custom objects.
- **Database cursors** — a result set is traversed row by row via a cursor object without loading the entire result into memory at once.
- **Tree/graph traversal utilities** — depth-first and breadth-first iterators expose the same `hasNext()`/`next()` interface over fundamentally different underlying structures.
