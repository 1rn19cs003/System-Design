# Builder — Interview Questions

**Why not just give the constructor default parameter values instead of writing a Builder?**
In languages with named/default parameters, that works fine for simple cases. Builder earns its place when there's real validation logic between steps (some field combinations are invalid), when you want the product to be genuinely immutable and never observable in a partially-built state, or when the sheer number of optional fields makes even named parameters hard to read at the call site.

**What's the role of a Director in the Builder pattern, and is it required?**
The Director encapsulates common construction *recipes* — fixed sequences of builder calls, like "build a gaming PC." It's optional; plenty of real-world fluent builders (like HTTP request builders) skip the Director entirely and let the caller decide which steps to call directly. Use a Director when the same configurations get built repeatedly and it's worth naming them.

**How do you make the built object actually immutable?**
The Builder itself is mutable (it's tracking in-progress state), but `.build()` should construct the final product's fields once, typically via a constructor that takes the builder's accumulated values, and that product class should expose no setters afterward — only getters. The mutability lives in the builder, not the product.

**How does Builder differ from Factory Method for constructing complex objects?**
Factory Method is about which *class* gets instantiated (polymorphism over types). Builder is about *how* a single, often complex, object gets assembled step by step. They can be combined — a factory could return different builders depending on context — but they solve different problems.
