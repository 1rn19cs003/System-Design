# Capstone: Rate Limiter

## Category
High-Level Design

## Why this is a good capstone
A rate limiter isn't its own separate topic in the earlier sections — it's a place where load balancing (protecting backends from overload), caching-like state tracking, and time-based algorithms all meet in one small, concrete system. It's also one of the most commonly asked system design interview questions on its own.

## The token bucket algorithm
A bucket holds up to `capacity` tokens. Tokens refill continuously at `refill_rate` tokens per second, capped at capacity. Every incoming request tries to take one token: if a token is available, the request is allowed and the token is spent; if not, the request is rejected.

## Why refill continuously instead of resetting per-second
A naive "N requests per second" counter that resets every second allows a burst of 2N requests right at the boundary between two seconds — N at the end of second one, N at the start of second two. A token bucket refills gradually, so it can't be gamed that way: burstiness is bounded strictly by the bucket's capacity, not by which second the requests happen to fall in.

## What this demonstrates end-to-end
Real wall-clock time drives real token refill math — a burst of requests larger than the bucket's capacity gets partially rejected immediately, and after waiting long enough for tokens to regenerate, subsequent requests are allowed again. Nothing here is simulated; it's the same time-based accounting a production rate limiter actually does.
