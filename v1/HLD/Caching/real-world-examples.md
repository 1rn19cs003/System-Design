# Caching — Real-World Examples

- **Redis / Memcached** — in-memory key-value stores used almost everywhere as a cache layer in front of a database.
- **CDNs (Cloudflare, CloudFront, Akamai)** — cache static assets (images, JS, CSS) at edge locations close to users, so most requests never reach the origin server.
- **Browser HTTP cache** — the browser itself caches responses based on `Cache-Control` headers, avoiding a network round-trip entirely for a repeat request.
- **CPU caches (L1/L2/L3)** — the same LRU-style eviction idea, applied at the hardware level to keep frequently accessed memory close to the processor.
