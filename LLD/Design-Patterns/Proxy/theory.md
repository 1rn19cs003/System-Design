# Proxy Pattern

## Category
Structural

## The problem, in plain terms
You have an `Image` class that loads a large file from disk when constructed — expensive. If your gallery app creates an `Image` object for every photo the moment the gallery loads, you pay that loading cost for a hundred photos even though the user might only ever scroll past ten of them. You want the loading to happen lazily, only when a photo is actually displayed — but you don't want every piece of calling code to manually check "has this been loaded yet?" before using it.

A Proxy solves this by implementing the same interface as the real object (`Image`) and standing in for it. Calling code holds a reference to the Proxy and calls methods on it exactly as if it were the real thing. The Proxy decides when to actually create/delegate to the real object — in this case, only on first access (`display()`), and reuses it after that. The caller never has to know a proxy was involved.

## How it's built
A `Subject` interface (`Image`) is implemented both by the `RealSubject` (the expensive, real image loader) and by a `Proxy` class that also implements `Subject`. The proxy holds a reference to (or lazily creates) the real subject, and forwards calls to it — but can add logic before or after forwarding: lazy initialization, access control, logging, caching, or making a remote call look local.

## Common Proxy variants
**Virtual proxy** — defers expensive object creation until it's actually needed (the lazy-loading image example). **Protection proxy** — checks permissions before allowing a call through to the real object. **Remote proxy** — represents an object that lives in a different address space (another process, another machine) and makes calling it look like a normal local method call. **Caching proxy** — stores results of expensive calls and returns the cached result for repeated identical requests.

## Proxy vs. Decorator (same shape, different purpose)
Structurally near-identical — both implement the same interface as what they wrap and delegate to it. The difference is *intent*: Decorator's entire purpose is adding new behavior/responsibility, typically stackable, usually created explicitly by client code that wants the extra behavior. Proxy's purpose is controlling access to the real subject — the client often doesn't even know it's holding a proxy instead of the real thing, and there's usually exactly one proxy in front of one real subject, not a stack.

## Where it bites you
A proxy adds a layer of indirection for every call, however thin. If overused for things that don't actually need access control, laziness, or remote indirection, it's needless complexity. Proxies that silently change behavior (e.g., silently caching stale data) can also introduce surprising bugs if the caller genuinely expected the real object's live behavior.
