# Singleton Pattern

## Category
Creational

## The problem, in plain terms
Say you're building a logger. Every part of your app needs to write to the same log file, in the same order, without two threads fighting over the file handle. If every class that needs logging just does `new Logger()`, you end up with five different Logger objects, each thinking it owns the file, each with its own buffer, and log lines start arriving out of order or getting clobbered. What you actually want is: there's exactly one Logger in the whole process, and everyone talks to that one.

That's the entire idea behind Singleton. It's not really about "restricting object creation" for its own sake — it's about resources that genuinely don't make sense to duplicate: a connection pool, a hardware driver, a config loader that read a file once and shouldn't re-read it on every call.

## How you actually build one
Three moving parts:

1. The constructor is private. Nobody outside the class can type `new Singleton()`.
2. There's a static field holding the one instance the class has ever created.
3. There's a static method — usually `getInstance()` — that hands that instance back. First call creates it, every call after just returns the same reference.

That's it. The interesting part is *when* you create the instance and how you keep it safe under concurrency.

## The variants, and why they exist
**Eager**: create the instance the moment the class is loaded, whether anyone asked for it or not. Dead simple, and thread-safety is basically free because the JVM (or runtime) handles class loading atomically. Downside: if the object is expensive and nobody ends up using it, you paid for nothing.

**Lazy**: don't create it until someone actually calls `getInstance()`. Saves resources, but now you have a race — two threads can both see `instance == null` at the same time and both create one.

**Double-checked locking**: the fix for the lazy race. Check `if (instance == null)` outside a lock first (fast path, no lock contention once it's built), then lock and check again before actually constructing it. This is the version worth knowing cold for interviews — and yes, in Java it only works correctly if the field is `volatile`. Skip that and you can get a partially-constructed object handed to another thread.

**The "free" singleton**: if you're in Python or JavaScript, a module is only evaluated once no matter how many times it's imported. So a plain object sitting at module scope already behaves like a singleton — no metaclass or private-constructor trick required. Worth knowing so you don't over-engineer something the language already gives you.

## Where it bites you
The honest downside: Singleton smuggles global state into your program. A class that calls `Logger.getInstance()` internally has a hidden dependency that doesn't show up in its constructor — you can't tell from the outside what it needs, and you can't swap in a fake one for a test without some ugly workaround (reflection, a reset method you added just for tests, etc.). It also tempts people into stuffing unrelated shared state into one object because "well, it's already global."

If you're working in a codebase with a DI container (Spring, NestJS, Guice), you rarely need to write this pattern by hand — mark the bean/service as singleton-scoped and let the container own the lifecycle. You get the "one instance" guarantee without the testing headache, because the container can hand you a different instance in tests.
