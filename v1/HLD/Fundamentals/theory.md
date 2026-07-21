# HLD Fundamentals

## Category
High-Level Design

## Client-server model
A client sends a request, a server does the work and replies. The server never initiates contact — it waits to be reached, and many different clients can reach the same server over time. Almost every other HLD topic (load balancers, caches, databases, queues) is a refinement of this one relationship.

## DNS: how a client finds a server
A client knows a name (`api.example.com`), not an IP. DNS translates the name into an address before any connection opens. That translation is cached for a while (a TTL controls how long) so it isn't repeated on every request. See the diagram below.

## HTTP over TCP
HTTP defines the request/response shape (method, path, headers, body → status code, headers, body). TCP, underneath it, guarantees the bytes actually arrive in order — HTTP never has to think about retransmission. See the request/response diagram below for where each step sits in the sequence.

## Latency vs. throughput
Latency: how long one request takes. Throughput: how many requests get done per second. A system can be fast-per-request but low-volume, or slower-per-request but far higher volume overall — see the comparison diagram below.
