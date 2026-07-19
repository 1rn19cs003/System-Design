# Message Queues — Trade-offs

## Queues vs. direct calls
A direct call (like an HTTP request) gets an immediate response and is simpler to reason about, but couples the caller to the callee's availability and speed. A queue removes that coupling, at the cost of the caller no longer getting an immediate answer — the work happens asynchronously.

## More consumers vs. ordering guarantees
Adding consumer workers increases throughput, but once multiple workers are pulling from the same queue, messages are no longer guaranteed to be processed in the order they were sent. If strict ordering matters (e.g., events for a single user), messages usually need to be partitioned so the same worker always handles a given entity.

## At-least-once delivery vs. idempotency cost
Guaranteeing a message is never lost usually means it might be delivered twice. Handling that safely means making the consumer's processing idempotent (safe to run twice) — an extra design requirement that direct, synchronous calls don't usually force on you.

**What interviewers are listening for:** recognizing that a queue trades immediacy for resilience and scalability, and knowing that "more workers" isn't free — it specifically breaks strict ordering unless messages are partitioned by key.
