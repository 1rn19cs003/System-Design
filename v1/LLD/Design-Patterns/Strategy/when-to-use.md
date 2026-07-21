# When to Use Strategy

## Reach for it when
- You have several interchangeable ways of doing the same conceptual operation, and you expect the list to grow.
- You want to swap the algorithm/behavior at runtime, not just at compile time.
- The current implementation uses a growing `if/else` or `switch` chain to pick between behaviors, and that chain has to be edited every time a new variant is added.

## Don't reach for it when
- There are only one or two variants that are genuinely unlikely to change — a plain conditional is more direct.
- The varying behavior is a single, stateless operation and your language has first-class functions — a plain function reference/lambda often replaces the whole interface hierarchy with less ceremony.

## What interviewers are actually listening for
Recognizing Strategy as "favor composition over inheritance" applied to an algorithm — instead of subclassing a base class per variant, you inject the varying behavior as a collaborator. Also, noticing that Strategy doesn't by itself solve *which* strategy to pick — that selection logic still has to live somewhere (often a factory), and conflating the two responsibilities is a common design smell interviewers probe for.
