# When to Use Prototype

## Reach for it when
- Constructing an object from scratch is expensive (I/O, heavy computation, complex initialization) and you already have a similar, fully-built object to copy from.
- You need to create objects without knowing their exact concrete class ahead of time — clone whatever prototype you were handed.
- You need many near-identical objects that differ only slightly (game entities, document templates, configuration presets).

## Don't reach for it when
- Construction is cheap — a plain constructor is simpler and just as fast.
- The object graph has circular references or wraps live external resources (open sockets, file handles, DB connections) that genuinely can't be cloned — you'll spend more effort special-casing the clone logic than you'd spend just constructing fresh.

## What interviewers are actually listening for
Whether you understand the shallow-vs-deep copy distinction cold, and can explain exactly which fields need deep copying in a specific example (a nested list or nested object) versus which are safe to share (immutable value types like strings or numbers). Handwaving "clone() copies the object" without addressing this is a red flag.
