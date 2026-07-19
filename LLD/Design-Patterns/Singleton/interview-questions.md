# Singleton — Interview Questions

**What is the Singleton pattern, and what problem does it actually solve?**
It guarantees a class has exactly one instance and gives the whole application one place to reach that instance. It matters whenever creating a second instance would cause real problems — two connection pools fighting over the same database, two loggers writing to the same file out of order, or paying twice to load a config file that never changes.

**Why does the instance field need to be `volatile` in double-checked locking?**
Without `volatile`, the JVM is allowed to reorder the instructions inside `new Singleton()` — allocate memory, then hand back the reference, then run the constructor. Another thread can see a non-null reference before the constructor has actually finished, and start using a half-built object. `volatile` prevents that reordering and makes the write visible to every thread immediately.

**Can you break a Java Singleton using reflection or serialization?**
Yes, both are real ways to defeat it. Reflection can call the private constructor directly via `setAccessible(true)`, creating a second instance. Deserializing a Singleton with default `readObject()` behavior also creates a brand-new object instead of reusing the existing one. Fixes: throw from the constructor if an instance already exists (blocks reflection), and implement `readResolve()` to return the existing instance instead of the deserialized one.

**How would you implement a Singleton in Python without writing a metaclass?**
Just use the module itself. Define your state and functions at module level in a file, and import that module wherever you need it — Python caches modules after the first import, so every importer gets the same object.

**Is Node's `require()` caching really a Singleton? Any caveats?**
Functionally yes — the first `require('./thing')` evaluates the module and caches the exported object; every later `require` returns that same cached object. Caveats: the cache key is the resolved file path, so requiring the same logical module via two different paths (or two different `node_modules` copies) gives you two separate "singletons." ES modules also use a different module registry than CommonJS, so mixing the two can quietly break the guarantee.

**How does Spring's singleton scope differ from the classic Singleton pattern?**
The classic pattern enforces "one instance" inside the class via a private constructor. Spring's singleton scope enforces it from the outside — the container creates one instance per bean definition and hands that instance to every class asking for it via dependency injection. The class itself stays a normal, easily-testable class with no idea it's being treated as a singleton.
