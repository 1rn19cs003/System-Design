# Proxy — Interview Questions

**Name the common variants of Proxy and what each solves.**
Virtual proxy defers expensive object creation until actually needed. Protection proxy checks permissions before letting a call through to the real object. Remote proxy represents an object living in another process/machine, making the call look local. Caching proxy stores results of expensive operations and returns cached results for repeat requests.

**How is Proxy different from Decorator, given both implement the same interface as what they wrap?**
Intent. Decorator's purpose is adding new behavior/responsibility, typically stackable and explicitly chosen by the client for the extra behavior. Proxy's purpose is controlling access to the real subject — the client often doesn't even know it's holding a proxy, and usually there's exactly one proxy in front of one real subject rather than a stack of them.

**In a virtual proxy for lazy loading, where does the "real" object get created?**
Inside the proxy's method that requires it, on first access — the proxy holds a reference (often null initially) to the real subject, and creates it the first time a method is called that actually needs the real data. Subsequent calls reuse the already-created real object.

**How does Proxy relate to how ORMs implement lazy loading?**
An ORM often returns a proxy object in place of a related entity or collection. That proxy looks and behaves like the real entity/collection to calling code, but the actual database query to fetch the real data only fires the first time a property on it is actually accessed — deferring the cost exactly like a virtual proxy.
