# Composite — Interview Questions

**What problem does Composite solve, concretely?**
It lets client code treat individual objects (leaves) and groups of objects (composites) uniformly through one shared interface. Without it, computing something recursive (total size, total cost, rendering) requires manually checking "is this a leaf or a container?" and branching at every level of the tree. With Composite, a container's implementation of the operation just delegates to its children's implementations — the recursion is built into the class hierarchy, not into calling code.

**Where should add/remove-child operations live — on the shared Component interface, or only on Composite?**
Both are valid, with a trade-off. Putting them on Component maximizes uniformity (any Component can theoretically have children added) but forces Leaf classes to implement or throw on methods that don't make sense for them (e.g., `File.add()`). Putting them only on Composite keeps Leaf clean, but client code needs to type-check or downcast before it can add a child to something. Many real implementations choose the second option specifically to avoid meaningless methods on leaves.

**How does Composite typically pair with other patterns like Visitor or Iterator?**
Visitor is commonly layered on top of Composite to add new operations across the whole tree (rendering, exporting, validating) without modifying the Component/Leaf/Composite classes themselves. Iterator is often used to traverse a Composite's structure (e.g., depth-first) without exposing the tree's internal representation to client code.

**Can a Composite tree have mixed depth — some branches shallow, some deep?**
Yes, and that's part of the point. Because every node (leaf or composite) implements the same Component interface, client code recursing through the tree doesn't need to know or care how deep any particular branch goes — the recursion naturally bottoms out at leaves regardless of depth.
