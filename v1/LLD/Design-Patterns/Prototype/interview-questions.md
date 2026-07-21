# Prototype — Interview Questions

**What's the difference between a shallow copy and a deep copy, concretely?**
A shallow copy duplicates the object's own fields, but any field that's a reference to another object still points at the *same* nested object as the original. A deep copy recursively clones those nested objects too, so the copy is fully independent. If you mutate a nested object through a shallow copy, that change is visible through the original as well — that's the bug signature to watch for.

**When would you choose Prototype over just calling the constructor?**
When construction is expensive — heavy computation, file/network I/O, complex initialization — and you already have a similar, fully-built object to copy from. Also useful when you need to create an object without knowing its exact concrete class, since cloning works polymorphically off whatever prototype instance you were handed.

**What are the practical pitfalls of implementing `clone()` in Java specifically?**
`Object.clone()` performs a shallow copy by default and its checked-exception, `Cloneable`-marker-interface design is famously awkward (Josh Bloch's "Effective Java" recommends avoiding it in favor of a copy constructor or a static factory method that does the copying explicitly). If you do implement `clone()`, you must manually deep-copy any mutable reference fields yourself inside the override.

**How would you handle cloning an object that holds a live resource, like an open database connection?**
You generally don't clone the resource itself — you clone the object's configuration/state and re-establish a fresh connection using that state. Trying to literally copy a live socket or file handle doesn't make sense; the clone should re-acquire its own resource rather than share the original's.
