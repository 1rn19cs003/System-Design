# When to Use Decorator

## Reach for it when
- You need to add optional, combinable behavior to an object at runtime, and subclassing for every combination would explode the class count.
- The added behavior should be transparent — code using the decorated object shouldn't need to know or care that it's decorated, since the decorator implements the same interface.
- You want to add/remove responsibilities dynamically, per-instance, rather than fix them at compile time for a whole class.

## Don't reach for it when
- There are only one or two fixed combinations that never change — a couple of subclasses or a configuration flag is simpler to read.
- The "decoration" isn't actually optional/combinable behavior but a fundamentally different interface — that's Adapter, not Decorator.
- Deep decorator chains would make the resulting behavior genuinely hard to trace — sometimes one class with a small set of boolean flags communicates the same thing more clearly.

## What interviewers are actually listening for
Whether you understand that Decorator preserves the original interface (unlike Adapter, which changes it) and that it solves combination explosion at runtime rather than requiring one subclass per combination at compile time. The coffee shop / pizza toppings example is a classic prompt specifically to test whether you reach for subclassing (wrong) or object wrapping (right).
