# When to Use Factory Method

## Reach for it when
- You don't know ahead of time exactly which class you'll need to instantiate — it depends on config, user input, or subclassing.
- You want to add new product types without touching the code that uses existing products.
- Object creation involves enough setup logic that it deserves its own method/class instead of being inlined at every call site.

## Don't reach for it when
- You only ever have one or two product types and they're not going to grow — a simple `if/else` or a plain constructor is more honest about the complexity of the problem.
- The "products" don't share a meaningful common interface — Factory Method only pays off when callers can treat every product the same way afterward.

## What interviewers are actually listening for
Being able to explain the difference between Factory Method (subclasses override a creation method) and a "simple factory" (one method with a switch statement) shows you understand the pattern isn't just "a function that returns objects" — it's specifically about letting subclasses decide, via polymorphism, what gets created.
