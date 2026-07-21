# Caching — Trade-offs

## LRU vs. LFU
LRU evicts by recency; LFU (Least Frequently Used) evicts by access count. LRU adapts quickly to changing access patterns; LFU protects genuinely "hot" items from being evicted by a short burst of unrelated requests, at the cost of tracking frequency counts.

## Cache size vs. hit rate
A bigger cache holds more entries and produces more hits, but costs more memory and, past a certain size, keeps entries around long after they stop being useful — diminishing returns. Sizing a cache is a measurement problem: watch the real hit rate, don't guess it.

## Staleness
A cached value can go stale the moment the real source changes underneath it. Fixing this means picking an invalidation strategy: a time-based expiry (simple, but stale for up to that duration), or explicit invalidation on write (accurate, but couples every writer to the cache).

**What interviewers are listening for:** naming a concrete invalidation strategy (TTL vs. write-through invalidation) rather than treating "just cache it" as the whole answer, and recognizing that a cache turns a data-freshness problem into a design decision, not something that goes away for free.
