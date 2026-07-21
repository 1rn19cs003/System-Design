# Fundamentals — Interview Questions

**Walk through what happens between typing a URL and seeing the page.**
The browser first checks its DNS cache, then (if needed) queries a DNS resolver to translate the hostname into an IP address. It then opens a TCP connection to that IP (a three-way handshake), performs a TLS handshake if the connection is HTTPS, sends an HTTP request over that connection, and waits for the server to send back an HTTP response, which the browser then parses and renders.

**What's the difference between latency and throughput, concretely?**
Latency is the time for a single request to complete, start to finish (measured in milliseconds). Throughput is how many requests a system can process per unit of time (measured in requests/second). A system can be tuned to minimize one at the expense of the other — for example, batching many requests together often improves throughput but increases the latency of any individual request in the batch.

**Why does DNS use a TTL, and what's the trade-off in setting it?**
A TTL (time-to-live) tells clients/resolvers how long they're allowed to cache a DNS answer before re-querying. A longer TTL reduces DNS query volume and average latency (fewer lookups), but means it takes longer for clients to notice if the underlying IP changes (e.g., during a failover). A shorter TTL makes changes propagate faster at the cost of more frequent lookups.

**Why is TCP relevant to HTTP even though HTTP doesn't mention packets or retransmission?**
Because HTTP is layered on top of TCP, which already guarantees reliable, ordered delivery of bytes. HTTP's request/response model only has to think in terms of "send these bytes, receive those bytes" — TCP is what silently handles retransmitting lost packets and keeping everything in the correct order underneath.
