# Iterator Pattern

## Category
Behavioral

## The problem, in plain terms
You've built a `Playlist` class that stores songs internally as an array. Client code that wants to loop through the songs currently has to know it's an array and use array indexing directly — `playlist.songs[i]`. If you later switch the internal storage to a linked list or a tree (say, to support efficient insertion in the middle), every piece of client code that iterated over `playlist.songs[i]` breaks, because it was relying on the internal representation rather than just "give me the songs one at a time."

Iterator solves this by giving the collection a method that returns a separate `Iterator` object, which exposes only `hasNext()` and `next()`. Client code loops using just those two methods, with zero knowledge of whether the underlying storage is an array, a linked list, or something else entirely. The traversal logic and position-tracking live inside the Iterator, not scattered across every piece of code that needs to loop over the collection.

## How it's built
An `Aggregate` interface (`Playlist`) declares a method like `createIterator()` that returns an `Iterator`. The `Iterator` interface declares `hasNext()` and `next()`. A concrete iterator (`PlaylistIterator`) holds a reference to the collection and an internal position/cursor, incrementing it on each `next()` call and checking bounds in `hasNext()`. Client code calls `iterator.hasNext()` in a loop condition and `iterator.next()` to advance, never touching the collection's internal storage directly.

## Where it bites you
Most modern languages bake iteration directly into the language (`for...of` in JavaScript, `for` over anything implementing `Iterable` in Python/Java, range-based `for` in C++) via this exact pattern under the hood — so explicitly hand-rolling your own `Iterator` class is usually unnecessary unless you're building a custom collection type that needs to support this built-in iteration syntax. Also, if the underlying collection is mutated while an iterator is mid-traversal (elements added or removed), the iterator can behave unpredictably or throw — a real, common bug class often called "concurrent modification."
