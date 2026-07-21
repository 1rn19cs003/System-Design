# When to Use Singleton

## Reach for it when
- Something in your system genuinely must exist exactly once — a connection pool, a print spooler, a config object read from disk one time.
- The object is expensive to build (opens a socket, parses a large file) and there's no reason to pay that cost more than once.
- You need one well-known place to coordinate access to a shared resource, and passing that object through every constructor in the app would be more awkward than useful.

## Don't reach for it when
- You care about unit testing this class in isolation. Singletons are notoriously hard to mock — the global instance leaks state between tests unless you're careful to reset it, and that reset logic is itself a code smell.
- You already have a DI container in the project. Let it manage singleton scope instead of hand-rolling `getInstance()` — you get the same guarantee with none of the testing pain.
- Different callers might legitimately need different configurations of the "shared" thing. That's usually a sign you need a factory handing out configured instances, not one instance for everybody.
- Multiple threads will mutate the singleton's internal state and you haven't thought hard about synchronization. A shared mutable singleton without proper locking is a textbook race condition waiting to happen.

## What interviewers are actually listening for
Anyone can say "make the constructor private and add a static getInstance()." What separates a strong answer is knowing the thread-safety story (why double-checked locking needs `volatile`) and being willing to say "honestly, I'd let Spring manage this instead of writing it by hand" when that's true. Reciting the pattern isn't the point — recognizing when it's the wrong tool is.
