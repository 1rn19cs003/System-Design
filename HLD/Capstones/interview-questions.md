# Capstone: Rate Limiter — Interview Questions

## How does a token bucket rate limiter work?
A bucket holds up to a fixed capacity of tokens, refilling continuously at a fixed rate. Each request consumes one token if available; if the bucket is empty, the request is rejected. Because tokens refill gradually, burstiness is always bounded by the bucket's capacity.

## Why is a fixed window counter exploitable at its boundary?
Because the counter resets abruptly at each tick, a client can send a full quota's worth of requests right before the reset and another full quota right after — effectively getting nearly double the intended rate in a very short window straddling the boundary.

## How would you rate-limit per user instead of globally?
Give each user their own bucket, keyed by user ID (or API key, or IP). A single shared bucket would let one user's traffic exhaust the budget meant for everyone else.

## Where does a rate limiter's state live in a distributed system?
It has to be reachable from every server handling a given client's requests — usually a shared, fast store like Redis, since an in-memory bucket on one server wouldn't know about requests that landed on a different server.

## What's the difference between token bucket and leaky bucket?
Token bucket allows bursts up to its capacity, as long as tokens are available. Leaky bucket enforces a strictly constant output rate regardless of how bursty the input is, smoothing traffic rather than just capping it.
