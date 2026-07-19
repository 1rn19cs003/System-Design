# Message Queues — Interview Questions

## Why put a queue between a producer and a consumer instead of calling directly?
A direct call couples the caller to the callee's speed and availability — if the callee is slow or down, the caller is stuck waiting. A queue lets the producer enqueue and move on immediately; the consumer processes at its own pace, and a slow or temporarily-down consumer doesn't block the producer.

## How does adding more consumers increase throughput?
Each consumer independently pulls the next available message off the queue, so more consumers means more messages processed in parallel. Throughput scales with worker count until something else (the queue itself, a downstream resource) becomes the bottleneck.

## Why does adding more consumers risk breaking message ordering?
If multiple workers pull from the same queue, whichever worker happens to be free next takes the next message — there's no guarantee the same worker handles messages in the order they were produced, especially if some messages take longer to process than others.

## How do you preserve ordering while still scaling consumers?
Partition messages by a key (e.g., user ID) so that all messages for the same key always go to the same worker or partition. Different keys can still be processed in parallel across workers, but ordering is preserved within each key.

## What does "at-least-once delivery" mean, and why do most queues default to it?
It means a message is guaranteed to be delivered, but might occasionally be delivered more than once (e.g., if a worker crashes after processing but before acknowledging). Exactly-once delivery is possible but expensive to guarantee end-to-end, so most systems accept at-least-once and make consumers idempotent instead.
