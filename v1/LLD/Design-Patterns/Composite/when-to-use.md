# When to Use Composite

## Reach for it when
- You're modeling a part-whole hierarchy (file systems, UI component trees, org charts, menu structures) where individual items and groups of items need to be treated the same way by client code.
- You want operations (size, render, total cost) to work correctly and uniformly regardless of how deep the tree goes, without client code manually recursing and branching on node type.

## Don't reach for it when
- Leaves and containers have fundamentally different operations that client code genuinely needs to distinguish between — forcing a shared interface would mean stubbing out meaningless methods on one side or the other.
- The structure isn't recursive/tree-shaped at all — a flat list doesn't need this pattern.

## What interviewers are actually listening for
Whether you can explain *why* uniform treatment matters — usually via a concrete recursive operation (total size, total price, rendering) that would otherwise require type-checking and manual recursion at every call site. Also worth mentioning: the trade-off of putting child-management methods (add/remove child) on the shared Component interface (maximizes uniformity, but leaves get meaningless methods) versus only on Composite (cleaner leaves, but client code needs a type check or cast to add children).
