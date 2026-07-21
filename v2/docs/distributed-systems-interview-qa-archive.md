# Distributed Systems — Archived Interview Q&A

This file preserves the "Interview Questions" content that was removed from the 7
Distributed Systems topic pages when they were restructured into the
TakeUForward-style article format (Advantages/Disadvantages + comparison tables +
"Why choose X over Y"). Nothing here was deleted — it's kept for the future
**Use Case** tab.

Source pages: `src/app/pages/distributed-systems/*/page.tsx`

---

## Consensus & Coordination

**Q: What is leader election and why do distributed systems need it?**
A: Leader election is the process by which a cluster of nodes agrees on exactly one node to act as coordinator for a given task or time period. It's needed because some jobs (writing to a replicated log, assigning work, breaking ties) only make sense if exactly one node is doing them — without a single agreed leader, two nodes could both think they're in charge and issue conflicting decisions.

**Q: Explain the core idea behind the Raft consensus algorithm.**
A: Raft replicates a log of operations from a single elected leader to a set of followers. The leader appends a new entry, sends it to followers, and considers the entry committed once a majority (not all) of nodes have acknowledged it. This majority requirement means the system can keep making progress even if a minority of nodes are slow, partitioned, or down, while guaranteeing that any two committed logs agree with each other.

**Q: What's the difference between a gossip protocol and a leader-based consensus protocol?**
A: Leader-based protocols (Raft, Paxos) have a single coordinator driving agreement, which gives strong, immediate consistency guarantees but requires re-electing a leader if it fails. Gossip protocols have no coordinator at all — nodes periodically share state with random peers, and information eventually reaches everyone. Gossip is simpler and more resilient to any single node failing, but only offers eventual consistency, not the immediate agreement a leader-based protocol provides.

**Q: How does a heartbeat mechanism detect a failed node, and what can go wrong with a naive implementation?**
A: Each node periodically sends a lightweight "I'm alive" signal to a monitor or its peers; if the monitor doesn't receive a heartbeat within an expected window (usually a few missed intervals, not just one), it marks the node as failed. The naive failure mode is false positives: a node that's alive but briefly slow (GC pause, network blip) can get marked dead and removed from service, then come back and conflict with whatever took over its role — this is why real systems use both a grace period and a proper leader-election handoff rather than an instant cutover.

---

## Distributed Transactions & State

**Q: What exactly goes wrong when a Two-Phase Commit coordinator crashes between the prepare and commit phases?**
A: Once a participant votes "yes" in the prepare phase, it must hold its locks and its uncommitted changes in a prepared state, ready to go either way, until it hears back from the coordinator. If the coordinator crashes before sending the final commit/abort decision, every participant that voted yes is stuck: it can't unilaterally commit (the coordinator might have decided abort because another participant said no) and it can't unilaterally abort (the coordinator might have already decided commit and told other participants). This is the blocking problem — participants hold locks and resources indefinitely until the coordinator recovers or a human intervenes, which can stall an entire cluster.

**Q: How does Three-Phase Commit reduce the blocking window compared to 2PC, and why doesn't it eliminate it?**
A: 3PC inserts a pre-commit phase between prepare and commit: after all participants vote yes, the coordinator broadcasts "pre-commit" and waits for acknowledgments before sending the final "commit." Because every participant that reaches pre-commit knows the whole cluster voted yes, participants can use a timeout to safely commit on their own if the coordinator disappears after pre-commit — that's the improvement. But 3PC still assumes the network only fails by delaying messages, not by partitioning it into groups that can each proceed independently; under a real network partition, two isolated groups could still reach different decisions, so blocking (and worse, inconsistency) isn't fully solved, which is a large part of why 3PC saw little real-world adoption.

**Q: SAGA choreography vs. orchestration — what's the actual trade-off, and when would you pick one over the other?**
A: In choreography, each service publishes an event when it finishes its local step, and the next service in line reacts to that event — there's no central coordinator, which keeps services decoupled and avoids a single component that needs to know the whole workflow. The cost is that the overall flow becomes implicit, scattered across every service's event handlers, which gets hard to trace, test, and reason about as the number of steps grows. Orchestration puts a dedicated saga orchestrator in charge, explicitly calling each step and running compensations on failure — this makes the workflow visible in one place and much easier to debug and extend, at the cost of introducing a central component (though it's simpler to make highly available than a 2PC coordinator, since it doesn't hold locks on other services' resources). Most teams reach for choreography for a small number of steps (two or three services) and switch to orchestration once a saga's step count or branching complexity grows.

**Q: What does a vector clock actually track, and what does it mean when two vector clocks are incomparable?**
A: A vector clock is a map of counters, one per node in the system, that each node increments locally on every event and attaches to messages it sends; when a node receives a message, it merges the sender's clock into its own by taking the element-wise max. Comparing two vector clocks tells you about causality, not wall-clock time: if every counter in clock A is greater than or equal to the corresponding counter in clock B (and at least one is strictly greater), then the event with clock A causally happened after the event with clock B. If neither clock dominates the other — some counters are higher in A, others higher in B — the two events are concurrent, meaning neither could have known about the other, which is exactly the signature of a genuine write-write conflict that the application (or the user, via a merge UI) needs to resolve.

**Q: Why don't CRDTs need coordination to stay consistent, when a naive replicated data structure would?**
A: A CRDT is designed so that every operation on it is representable in a form that is commutative, associative, and idempotent when merged — meaning the order replicas receive updates in, and how many times they see the same update, doesn't change the final result. A G-Counter only ever increments a replica's own slot and merges other replicas' slots via max, so two replicas that diverge while offline and later exchange state always converge to the same total regardless of which one merges first or how many times a message gets redelivered. A naive shared counter ("replica sends +1, apply it") isn't safe this way — duplicate delivery double-counts, and out-of-order delivery of increments and decrements can produce different results on different replicas, which is exactly the class of bug CRDTs are engineered to make structurally impossible.

**Q: In a microservices architecture, when would you reach for SAGA instead of Two-Phase Commit?**
A: 2PC requires every participant to hold locks on its own database while the coordinator collects votes, which works inside a single database engine's distributed transaction manager but becomes a severe availability and latency problem across independently-owned microservices — one slow or down service blocks the whole transaction, and you'd need every service to expose a 2PC-compatible transactional resource manager, which most HTTP/REST or message-based services simply don't. SAGA trades strict atomicity for availability: each service commits its own local transaction immediately (no cross-service locks held), and consistency is restored after the fact via compensating actions if a later step fails. The practical rule of thumb: reach for 2PC only when all participants are transactional resources you fully control within a tightly coupled system (e.g. a distributed SQL engine coordinating its own shards); reach for SAGA whenever the transaction spans independently deployed, independently owned services.

---

## Resilience Patterns

**Q: What are the three circuit breaker states, and why does half-open need to exist at all — why not just go straight from open back to closed?**
A: A circuit breaker has three states: closed (calls flow through normally, failures are counted), open (calls are short-circuited immediately without touching the downstream service, protecting both the caller and the already-struggling dependency), and half-open (a small number of trial calls are allowed through to test whether the dependency has recovered). Half-open exists because going straight from open back to closed would mean blindly resuming full traffic to a service that might still be down — if it's still failing, you'd immediately re-trip the breaker after dumping a full load of retries on it, which is exactly the thundering-herd problem you were trying to avoid. Half-open lets the breaker test recovery with a small, controlled trial before committing to full traffic again.

**Q: How is a circuit breaker different from just adding retries with backoff?**
A: Retries and circuit breakers solve different problems and are normally used together, not as alternatives. A retry is a per-call decision: "this specific request failed, try it again (perhaps with backoff)," and it still hits the downstream service every time, which is fine for transient blips but actively harmful when the service is genuinely down or overloaded — retries just add more load to a struggling system. A circuit breaker is a cross-call, stateful decision: it watches the failure rate over many calls and, once it crosses a threshold, stops sending traffic to the dependency entirely for a period, protecting both the caller's resources (threads, connections) and the downstream service from being hit with a wave of retries while it's trying to recover.

**Q: What does a bulkhead actually protect against, and how does the name relate to its function?**
A: The name comes from a ship's bulkheads — physical partitions that divide the hull into separate watertight compartments, so a hull breach in one compartment floods only that section instead of sinking the entire ship. In software, a bulkhead means isolating resource pools (thread pools, connection pools, semaphores) per dependency, so that if calls to one slow or failing downstream service exhaust their allotted pool, requests to unrelated dependencies still have their own separate pool of threads/connections available and keep working normally. Without bulkheads, a single shared thread pool means one bad dependency can starve every other code path in the service, turning a partial outage into a total one.

**Q: Walk through how a cascading failure actually propagates from one slow service to a full outage.**
A: It starts with one service (say, C) becoming slow — not necessarily down, just responding much more slowly than usual. Its callers (B) are making synchronous calls to C and, without a timeout or with too generous a timeout, their request-handling threads sit blocked waiting on C's response. Because B has a finite thread or connection pool, enough concurrent slow calls to C exhaust that pool entirely, so B can no longer serve any request — including ones that don't depend on C at all. B's callers (A) now experience the same thing one level up: their calls to B start timing out or hanging, exhausting A's own thread pool. This repeats at each layer of the call graph, and what began as one component being slow becomes a full outage across every service that transitively depends on it. Timeouts, retries with exponential backoff and jitter, bulkheads, and circuit breakers each interrupt this chain at a different point.

**Q: What's the distinction between a sidecar and a service mesh?**
A: A sidecar is a single deployment pattern: a helper process (a proxy, a logging agent, a metrics collector) deployed alongside one service instance, typically in the same pod, intercepting that instance's network traffic without requiring any change to the service's own code. A service mesh is the larger system built on top of that pattern: it's the combination of a sidecar proxy attached to every service in the fleet (the "data plane") plus a central control plane that configures all of those sidecars uniformly. In short, a sidecar is the building block; a service mesh (like Istio or Linkerd) is the fleet-wide system of sidecars plus centralized control.

---

## API & Communication Patterns

**Q: Why does idempotency matter specifically because of network retries?**
A: A network failure can happen on either leg of a request: the request itself can be lost before reaching the server, or the response can be lost on the way back after the server already did the work. In the second case, the client has no way to distinguish "it never arrived" from "it arrived and succeeded, but I never heard back" — so a naive client that retries on any timeout risks re-submitting a request the server already fully processed. An idempotency key removes the ambiguity: the client generates one key per logical operation, sends it on every retry, and the server treats repeats of the same key as "already handled" rather than "do it again."

**Q: What are the core trade-offs between REST and GraphQL?**
A: REST exposes multiple resource-based endpoints, each returning a server-defined, fixed shape of data; that fixed shape makes REST responses trivially cacheable by URL but commonly causes over-fetching or under-fetching. GraphQL exposes a single endpoint where the client specifies exactly the fields it wants in one query, eliminating over/under-fetching and round trips, but it loses that easy URL-based caching and shifts real complexity onto the server, which now has to resolve arbitrary nested queries efficiently.

**Q: When would you choose WebSockets over long polling?**
A: Choose WebSockets when you need frequent, low-latency, bidirectional communication — chat apps, live dashboards, multiplayer games — because after one upgrade handshake, both sides can push data over the same open connection with almost no per-message overhead. Long polling is preferable when updates are infrequent, your infrastructure doesn't reliably support persistent connections, or you want to keep using plain stateless HTTP semantics. The practical cost of WebSockets is that an open connection consumes a server-side resource for as long as the client is connected, which matters at very large scale.

**Q: What does an API gateway centralize, and what should stay inside each individual service?**
A: An API gateway centralizes cross-cutting concerns identical across every service and unrelated to business logic: authentication/token validation, rate limiting, TLS termination, request routing, and sometimes response aggregation. What should stay inside each service is anything specific to that service's domain: business rules, data validation, and authorization decisions that depend on domain-specific state. The dividing line: infrastructure concern versus domain concern.

**Q: What are the trade-offs between webhooks and polling for detecting an external event?**
A: Polling means you repeatedly ask a service "anything new?" on a fixed interval — simple and works behind almost any network setup, but wastes requests when nothing has changed and adds latency up to your poll interval. Webhooks invert the relationship: the external service calls an endpoint you expose the moment an event happens, giving near-instant notification with no wasted requests, but they require you to expose a public, reliable endpoint, handle retries/duplicate deliveries, and verify the caller's identity (e.g. via a signing secret).

**Q: How does WebRTC avoid routing audio/video through a central server, and why does that matter?**
A: WebRTC negotiates a direct peer-to-peer connection between two browsers (using STUN/TURN servers only to help them discover reachable network paths through NAT, not to relay media in the common case), so audio, video, and data flow directly between participants' devices rather than through your application server. This matters because relaying every frame through your own infrastructure would multiply bandwidth costs and add latency; a signaling server is only needed up front to help peers exchange connection details.

---

## Big Data Processing

**Q: How do you decide between batch and stream processing for a given problem?**
A: The decision comes down to how quickly you need to react to new data and how much that latency actually matters to the business. Batch processing accumulates data over a window and processes it all at once — efficient and simple for anything that only needs to be right by tomorrow morning. Stream processing handles each event as it arrives, necessary when a delayed reaction has real cost (fraud detection, live dashboards). The trade-off is that stream processing is architecturally more complex for a latency guarantee batch doesn't need to make.

**Q: What does MapReduce's shuffle step actually do, and why is it necessary?**
A: After the map phase, every mapper has produced key-value pairs scattered across whatever machine ran it. The shuffle (and sort) step redistributes every emitted pair across the cluster so all pairs sharing the same key route to the same reducer, letting a single reducer see the complete list of values for a key and correctly aggregate them. Without shuffle, each reducer would only see a partial, machine-local view of each key's values, and the final counts would be wrong.

**Q: What is the difference between ETL and ELT, and why did ELT become more common?**
A: ETL transforms data into its final, clean shape before loading it into the destination — transformation happens on a separate processing layer. ELT loads raw data into the destination first and performs transformation afterward, using the destination's own compute. ELT became more common as cloud data warehouses (Snowflake, BigQuery, Redshift) got cheap, elastic compute — it's now often simpler to dump raw data in immediately and transform it with SQL inside the warehouse, and keeping raw data around means you can re-derive different transformations later.

**Q: How would you choose between a data lake and a data warehouse for a given use case?**
A: Choose a data lake when you need to cheaply store large volumes of raw or semi-structured data whose eventual use isn't fully known yet (ML training data, raw event logs), because a lake imposes no schema at write time and storage is cheap. Choose a data warehouse when you have well-understood, structured data that business users or dashboards will query repeatedly and need fast, predictable performance for. Many real architectures use both: a lake as the durable raw store, feeding a warehouse via an ETL/ELT pipeline.

**Q: How does a data warehouse's schema-on-write trade flexibility for query speed?**
A: Schema-on-write means every row is validated against a predefined structure at the moment it's written, so the warehouse always knows exactly what shape of data lives where. That upfront rigidity is what lets the warehouse use structure-dependent optimizations: columnar storage layouts, pre-computed statistics, and indexes built around known column types. The cost is flexibility — if the source data's shape changes, it's rejected or requires a schema migration, whereas a schema-on-read system (a data lake) accepts data as-is.

---

## Architectural Patterns

**Q: What is a cold start, and when does it actually matter?**
A: A cold start is the extra latency paid the first time a serverless function runs on a fresh instance — the platform has to provision a container, load the runtime, and initialize your code before it can handle the request. It matters most for latency-sensitive, user-facing endpoints with spiky or infrequent traffic; it matters far less for background jobs or high-traffic endpoints that stay warm.

**Q: What are the real trade-offs between event-driven and request-response (direct call) communication?**
A: Request-response is simple to reason about — the caller gets an immediate result or error. Event-driven trades that immediacy for loose coupling: a publisher doesn't need to know who's listening, and consumers can be added/removed or scaled independently. The cost is that the publisher no longer gets a synchronous answer, and the system now has eventual consistency and more moving parts to fail (a broker, retries, dead-letter queues).

**Q: Why are P2P systems hard to keep consistent?**
A: There's no single node holding the authoritative state, so there's nothing to synchronously check a write against. Every node has its own local view that can lag or conflict with others depending on which peers it has recently talked to. Reconciling those views requires a lot of gossip-style propagation and conflict resolution, or accepting a weaker (eventual) consistency model from the outset.

**Q: When is serverless a poor fit?**
A: Serverless struggles with long-running processes, since most providers cap execution time per invocation (AWS Lambda tops out at 15 minutes). It's also a poor fit for workloads that need to hold state or a persistent connection in memory between requests (a WebSocket server, a stateful game server), because each invocation may run on a freshly-provisioned instance. Predictable, sustained, high-volume traffic is often cheaper on always-on servers too.

**Q: How does event-driven architecture change how you debug a single request's path?**
A: In request-response, one request maps to one call stack, and a stack trace usually tells the whole story. In event-driven systems, a single logical operation fans out into multiple independent, asynchronously-processed events handled by different services on different schedules — there's no single stack trace spanning all of it. This is why event-driven systems lean heavily on distributed tracing (a correlation/trace ID propagated through every consumer) and centralized log aggregation.

**Q: How do serverless, event-driven, and P2P relate to microservices and client-server, which this site already covers?**
A: They're additional shapes a system can take, and most real systems combine several. Client-server is the baseline relationship almost everything else refines. Microservices split a monolith into independently deployable services that still mostly talk over direct request-response calls. Serverless is about where code runs rather than about decomposition. Event-driven is about how services communicate and is often layered on top of microservices. P2P is the most radical departure — it removes the client/server distinction and any central authority entirely.

---

## Observability & Security

**Q: What exactly is the difference between authentication and authorization?**
A: Authentication answers "who are you?" Authorization answers "what are you allowed to do?" They're sequential and distinct: a system authenticates you once (you log in), then authorizes every subsequent action against that established identity. A 401 Unauthorized response means "you're not authenticated," while a 403 Forbidden means "you're authenticated, but not authorized for this."

**Q: Why do JWTs enable stateless authentication, and what do you give up for that?**
A: A JWT is self-contained and cryptographically signed — the payload carries the claims directly, and any server holding the shared secret can verify the signature and trust the claims without querying a database. The trade-off is revocation: since there's no central session record, you can't simply "delete" a JWT — a compromised token stays valid until it naturally expires, unless you build extra infrastructure (a blocklist, short expiries with refresh tokens).

**Q: What does chaos engineering prove that testing alone doesn't?**
A: Traditional tests verify that code behaves correctly under conditions you thought to write a test for, in an environment that's usually not production. Chaos engineering verifies that a system's actual, production-scale redundancy and failover mechanisms work when a real, unplanned failure happens — because production has scale, traffic, and configuration drift that staging rarely replicates exactly.

**Q: What are the four golden signals of monitoring, and why those four specifically?**
A: Latency, traffic, errors, and saturation. Together they cover the questions that matter most for spotting user-facing problems early: is it slow, is it getting hit with unusual load, is it actually failing, and is it about to run out of headroom.

**Q: Why does TLS matter beyond just "encrypting traffic"?**
A: TLS also provides data integrity (tampering in transit is detected) and server authentication: the server presents a certificate, issued by a trusted certificate authority, that cryptographically proves it is who it claims to be. Without that certificate check, encryption alone wouldn't stop a man-in-the-middle attacker from impersonating the real server.

**Q: Concretely, how does the TLS handshake establish a secure connection?**
A: The client connects and the server presents its certificate (containing its public key, signed by a trusted CA). The client verifies that certificate chain, then client and server use asymmetric cryptography just long enough to securely agree on a shared symmetric session key. From that point on, both sides encrypt and decrypt traffic using the fast, shared symmetric key.
