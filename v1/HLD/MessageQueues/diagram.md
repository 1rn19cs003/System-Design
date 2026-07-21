# Message Queues — Diagrams

- `assets/hld-message-queues/queue-fanout.svg` — a producer enqueueing messages that three consumer workers pull and process concurrently
- `assets/hld-message-queues/ordering-partitioning.svg` — unpartitioned messages for the same key landing on different workers out of order, vs. partitioning by key keeping them on one worker in order

See them in context at: `pages/hld/message-queues.html`
