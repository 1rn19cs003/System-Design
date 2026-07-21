# Caching — Interview Questions

## How does an LRU cache decide what to evict?
It tracks access order. On every get or put, the accessed key moves to the "most recently used" end. When the cache is full and a new key needs space, whatever sits at the "least recently used" end is evicted first.

## Why use a cache at all instead of always going to the source?
Because the source (a database query, a remote API, a heavy computation) is slow relative to memory. A cache trades a small amount of memory for avoiding that repeated cost on every request for the same data.

## What's the risk of caching, and how do you manage it?
Staleness — the cached value can drift out of sync with the real source. It's managed with either a TTL (the entry expires after a fixed time) or explicit invalidation (the write path actively updates or clears the cache entry when the underlying data changes).

## When would LRU be the wrong eviction policy?
When recency doesn't correlate with future use — for example, a scan through a huge dataset touches every key exactly once, and LRU will evict useful "hot" entries to make room for items that are never touched again. LFU or a scan-resistant variant handles that case better.
