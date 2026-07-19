# Template Method — Interview Questions

**What is the "Hollywood principle" and how does Template Method use it?**
"Don't call us, we'll call you" — the base class owns and controls the algorithm's sequence, and calls into subclass-provided steps at the right points, rather than the subclass driving when the shared logic executes. Subclasses provide pieces, but the base class remains in charge of the order.

**Why is the template method itself usually marked final/non-overridable?**
To guarantee the fixed sequence of steps can't be silently reordered, skipped, or broken by a subclass — the whole point of the pattern is that the algorithm's structure is shared and protected, while only specific, clearly-designated steps are left open for customization.

**What's a "hook" method in Template Method, and why use one?**
A hook is a method with a default (often no-op) implementation in the base class that a subclass can optionally override to opt into extra behavior — like a `wantsCondiments()` check a subclass can override to skip a step — without needing to change the template method's logic itself.

**How is Template Method different from Strategy?**
Template Method uses inheritance: subclasses fill in specific steps of an algorithm whose overall shape lives in a shared base class. Strategy uses composition: an entire algorithm/behavior is swapped as one self-contained unit via a collaborator object injected into a Context, with no shared base-class control flow. Template Method fixes the skeleton and varies the details; Strategy varies the whole algorithm at once.
