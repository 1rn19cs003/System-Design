# Proxy — Real-World Examples

- **Java's `java.rmi` remote proxies** — a local stub object implements the same interface as a remote object, forwarding calls across the network while looking like a normal local method call.
- **Spring AOP proxies** — Spring wraps beans in dynamic proxies to add cross-cutting behavior (transactions, security checks, logging) around method calls, without the underlying bean class knowing anything about it.
- **Lazy-loading ORMs** (Hibernate lazy associations, Django's lazy querysets) — a proxy object stands in for a related entity/collection and only hits the database when the data is actually accessed.
- **CDNs / caching reverse proxies** (e.g., Varnish, CloudFront) — sit in front of the real origin server, serving cached responses when possible and only forwarding to the real server when necessary.
- **Virtual proxies in image/document viewers** — a placeholder stands in for a large image or document, loading the real content only when it's scrolled into view or opened.
