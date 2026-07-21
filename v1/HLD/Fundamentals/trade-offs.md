# Fundamentals — Key Trade-offs & Decision Points

## Optimize for latency when
- The user is actively waiting on the response (a page load, an autocomplete suggestion, a payment confirmation).
- Each individual request matters more than the aggregate volume of requests.

## Optimize for throughput when
- You're processing a large backlog of work where no single item is time-sensitive (batch analytics, bulk email sends, log processing).
- The system's value comes from total work completed over time, not the speed of any one unit of work.

## DNS caching trade-off
A longer TTL means fewer DNS lookups (faster, on average, for clients) but slower propagation if the underlying IP address changes — clients keep using the stale IP until their cached entry expires. A shorter TTL means faster failover/updates but more DNS lookup traffic and slightly higher average latency per request.

## What interviewers are actually listening for
Being able to state, concretely, what latency and throughput actually measure (not just "one is speed, one is volume") and give an example of a system that's optimized for one at the expense of the other. Also, understanding that DNS resolution and TCP connection setup both add latency before the "real" request even starts — a full request's latency budget includes DNS lookup + TCP handshake + TLS handshake (if HTTPS) + the actual request/response, not just the server's processing time.
