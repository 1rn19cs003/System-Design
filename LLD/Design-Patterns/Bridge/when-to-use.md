# When to Use Bridge

## Reach for it when
- You have two independent dimensions of variation (shape × renderer, device × remote control, database logic × database vendor) and inheritance would force you to create a class per combination.
- You want to be able to add new variants on either side without touching the other side or the combinations that already exist.
- You need to swap the implementation at runtime (e.g., switch renderers) rather than have it fixed at compile time by class hierarchy.

## Don't reach for it when
- There's really only one dimension of variation, or the second dimension isn't genuinely expected to grow — the extra indirection isn't earning its cost.
- The number of combinations is small and stable (2×2, unlikely to grow) — plain inheritance may be simpler to read even if slightly less "pure."

## What interviewers are actually listening for
Being able to name the specific problem Bridge solves — class explosion from two independent dimensions — rather than just describing "an abstraction holds an implementor." A strong answer gives a concrete example of the multiplication (2 shapes × 3 renderers = 6 classes without Bridge, 2+3 = 5 classes with it, and it only gets more one-sided as either side grows) and explains why Adapter would be the wrong pattern for this specific problem (it's a design decision made upfront, not a retrofit for incompatibility).
