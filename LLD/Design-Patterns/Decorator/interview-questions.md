# Decorator — Interview Questions

**How does Decorator differ from just using inheritance to add behavior?**
Inheritance fixes behavior combinations at compile time — one subclass per combination, which explodes as options grow. Decorator adds behavior at runtime by wrapping objects, so any combination and any order is possible without pre-declaring a subclass for it. You compose behavior dynamically instead of statically.

**How is Decorator different from Adapter, given both wrap another object?**
Decorator preserves the same interface as the object it wraps — a decorated Coffee is still usable anywhere a Coffee is expected, and you can stack any number of decorators. Adapter changes the interface specifically because the wrapped object's original interface doesn't match what the caller needs. Decorator is about adding behavior while staying interchangeable; Adapter is about translating incompatible shapes.

**Does the order in which you apply decorators matter?**
Yes, often. Wrapping a "10% discount" decorator around a "tax" decorator gives a different final price than wrapping tax around discount — whether tax is calculated before or after the discount changes the result. This is a common follow-up question to test whether a candidate has actually implemented the pattern, not just memorized the diagram.

**Give a real-world example where Decorator is used outside of "coffee shop" toy examples.**
Java's I/O stream classes: `new BufferedReader(new InputStreamReader(new FileInputStream(...)))`. Each wrapper class adds one capability (buffering, byte-to-character decoding) while implementing the same stream interface as what it wraps, and any of these layers could be added, omitted, or reordered depending on what's needed.
