# When to Use Template Method

## Reach for it when
- Several classes implement the same overall algorithm/sequence, differing only in specific steps.
- You want to enforce a fixed order of operations across all variants, so subclasses can't accidentally skip or reorder steps.
- You want an easy way to add a new variant by implementing only the steps that differ, without duplicating the shared steps.

## Don't reach for it when
- The variants don't actually share a common sequence — forcing them into one template method just because they're conceptually related creates an artificial, awkward abstraction.
- Composition-based alternatives (like Strategy, injecting the varying behavior as a collaborator instead of subclassing) fit better — Template Method relies on inheritance, which is a tighter coupling than composition.

## What interviewers are actually listening for
Recognizing the "Hollywood principle" (don't call us, we'll call you) — the base class controls the flow and calls into the subclass, rather than the subclass controlling when the shared steps run. Also, distinguishing Template Method (inheritance-based, fixed algorithm skeleton with pluggable steps) from Strategy (composition-based, an entire algorithm swapped as one unit) — a very commonly confused pair given both address "vary part of a behavior."
