# Composite Pattern

## Category
Structural

## The problem, in plain terms
You're modeling a file system: files and folders. A folder can contain files and other folders. If you want to compute the total size of a folder, you need to sum the sizes of every file inside it — including files nested three folders deep. The awkward part: your code that calculates size has to treat a `File` and a `Folder` differently, checking "is this a file or a folder?" at every level, recursing manually, and duplicating that branching logic everywhere size gets calculated (or renamed, or deleted, or listed).

Composite fixes this by giving both `File` and `Folder` the same interface — say, `getSize()` — so calling code never has to ask "is this a leaf or a container?" A `Folder`'s `getSize()` just sums `getSize()` over its children, whether those children are files or more folders. The recursion is baked into the container's implementation, not scattered through calling code.

## How it's built
A `Component` interface declares the operations common to both leaves and containers (`getSize()`, `render()`, whatever the domain needs). `Leaf` (a `File`) implements it directly. `Composite` (a `Folder`) also implements it, but its implementation delegates to a collection of child `Component`s — which might themselves be leaves or further composites. Because a Composite treats its children uniformly as `Component`, the tree can be arbitrarily deep, and the calling code that walks it never needs to know how deep.

## Composite vs. a plain tree data structure
Every tree has parent/child relationships, but Composite specifically means leaves and containers share one interface so client code is uniform. If your tree's nodes have genuinely different operations depending on whether they're a leaf or a branch (and your code needs to know which is which to act correctly), you don't have a Composite — you have a tree, which is a fine data structure on its own, just not this pattern.

## Where it bites you
Giving leaves and composites the exact same interface sometimes means a leaf has to implement (or throw on) operations that only make sense for composites — e.g., a `File.addChild()` that has nothing meaningful to do. Some implementations solve this by putting child-management operations only on `Composite`, sacrificing perfect interface uniformity for cleaner leaf classes — a real trade-off between "treat everything the same" and "don't force meaningless methods onto leaves."
