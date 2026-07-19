# Capstone: Rate Limiter — Trade-offs

## Token bucket vs. fixed window counter
A fixed window counter (reset every second) is simpler to implement but allows a burst of nearly 2x the intended rate right at a window boundary. A token bucket bounds burstiness strictly to its capacity regardless of timing, at the cost of slightly more bookkeeping (tracking fractional tokens and elapsed time).

## Per-client state vs. a shared limiter
A real system needs one bucket per client (per user, per API key, per IP) — a single shared bucket would let one abusive client exhaust the whole budget for everyone. That means the limiter's state has to live somewhere all requests for that client can reach it, which in a distributed system usually means a shared store like Redis rather than in-process memory.

## Capacity and refill rate as product decisions
A larger capacity tolerates bigger bursts but permits more abuse in a short window; a higher refill rate raises sustained throughput but raises the abuse ceiling too. These aren't purely technical numbers — they're a product decision about how much burst behavior is legitimate for real users.

**What interviewers are listening for:** understanding specifically why a fixed window counter is exploitable at its boundary, and recognizing that a real rate limiter needs per-client state that's reachable from every server handling that client's requests — not just one in-memory bucket per server.
