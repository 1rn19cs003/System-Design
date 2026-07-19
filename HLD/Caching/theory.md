# Caching

## Category
High-Level Design

## Why a cache exists
Some data is expensive to fetch — a database query, a slow external API, a computed result. A cache stores the result once, so a repeated request for the same thing is answered from fast memory instead of paying that cost again.

## Eviction: LRU
A cache has finite space, so something has to be thrown out when it's full. Least Recently Used (LRU) evicts whichever entry hasn't been touched the longest, on the assumption that a value used recently is more likely to be needed again soon than one that's been sitting untouched.

## Cache hit vs. cache miss
A hit means the value was already in the cache — fast. A miss means it wasn't, so the real (slow) source has to be queried, and the result is usually stored in the cache on the way back so the next request for that key is a hit.

## Where a cache sits
In front of a database (query cache), in front of a slow computation (memoization), or in front of another service entirely (a CDN caching a remote server's response). The mechanism is identical in all three — only what's being cached changes.
