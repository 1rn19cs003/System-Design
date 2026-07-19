# Bridge — Interview Questions

**What specific problem does Bridge solve that plain inheritance doesn't?**
Class explosion from two independent dimensions of variation. If shapes and renderers each vary independently and you model them with a single inheritance tree, you need one class per combination (shapes × renderers). Bridge splits them into two hierarchies connected by composition, so you need one class per shape plus one class per renderer — addition instead of multiplication.

**How is Bridge different from Adapter, given both delegate to another object?**
Timing and intent. Adapter is retrofitted after the fact to make an existing, incompatible interface work with code that expects something else. Bridge is designed in from the start, specifically so two hierarchies (abstraction and implementor) can vary independently — there's no pre-existing incompatibility being worked around.

**Can the "implementor" side of a Bridge be swapped at runtime?**
Yes, and that's one of the pattern's practical benefits — since the abstraction holds a reference to the implementor (composition, not inheritance), you can swap in a different concrete implementor object at runtime, not just at compile time via a fixed class hierarchy.

**Give a concrete example of when NOT to use Bridge.**
If you have exactly one shape type and one rendering engine with no realistic plan to add more, splitting into two hierarchies adds indirection for no payoff — a single concrete class is simpler and just as correct. Bridge earns its complexity specifically when both dimensions are expected to grow.
