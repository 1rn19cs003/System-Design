# When to Use Adapter

## Reach for it when
- You need to integrate a third-party library or legacy code whose interface doesn't match what your code expects, and you can't (or shouldn't) modify its source.
- You want your core code to depend only on your own interface, keeping third-party specifics isolated in one translation layer instead of scattered throughout the codebase.

## Don't reach for it when
- You control both interfaces — just change one of them to match the other; an adapter adds a layer of indirection you don't need.
- The mismatch is more than skin-deep (fundamentally different behavior, not just different method names/signatures) — an adapter can hide the difference but can't fix it.

## What interviewers are actually listening for
Whether you can clearly distinguish Adapter from Facade and from Decorator. Adapter changes an interface to match one your code already expects (compatibility). Facade simplifies access to a complex subsystem (ease of use). Decorator adds new responsibility to an object while keeping its original interface intact (enhancement). Confusing these three in an interview is a common tell that the patterns were memorized, not understood.
