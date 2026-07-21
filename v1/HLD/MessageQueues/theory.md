# Message Queues

## Category
High-Level Design

## Why a queue exists
A producer creates work faster than a consumer can process it, or the producer simply doesn't want to wait around for the work to finish. A queue sits between them: the producer drops a message in and moves on immediately, and one or more consumers pull messages off and process them at their own pace.

## Decoupling producer from consumer
The producer never talks to the consumer directly — it only ever talks to the queue. This means the consumer can be slow, temporarily down, or scaled to many instances, and none of that is the producer's problem. It just keeps enqueueing.

## Scaling consumption
Because the queue holds messages until they're picked up, adding more consumer workers directly increases how fast the backlog drains — each worker independently pulls the next available message, so throughput scales roughly with worker count (until something else becomes the bottleneck).

## At-least-once vs. exactly-once delivery
Most real queues guarantee at-least-once delivery: a message might be delivered twice if a worker crashes after processing but before acknowledging. Exactly-once delivery is possible but expensive to guarantee end-to-end, so most systems design consumers to be idempotent instead of chasing exactly-once.
