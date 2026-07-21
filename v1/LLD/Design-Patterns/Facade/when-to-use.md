# When to Use Facade

## Reach for it when
- A task genuinely requires coordinating several subsystems in a specific order, and most callers only care about the end result, not the coordination details.
- You want to reduce how many classes/APIs external code needs to know about to accomplish a common task, without removing access to the subsystems for the cases that need finer control.
- You're introducing a new, cleaner API in front of a legacy or third-party system you don't want to rewrite.

## Don't reach for it when
- There's really only one subsystem involved — there's nothing to "simplify," you'd just be adding an extra layer of indirection.
- Every caller actually needs fine-grained control over the subsystems individually — a facade that gets bypassed by everyone isn't earning its keep.

## What interviewers are actually listening for
Whether you can clearly separate Facade's job (simplifying access to something complex) from Adapter's job (fixing an interface mismatch) and from Decorator's job (adding behavior while preserving an interface). A strong answer also mentions that Facade doesn't remove access to the underlying subsystems — it's an added convenience layer, not a replacement API that hides everything else.
