# Message Queues — Real-World Examples

- **RabbitMQ / Amazon SQS** — classic message queues used to decouple services, commonly for background job processing (sending emails, resizing images, generating reports).
- **Apache Kafka** — a distributed log-based streaming platform, often used for event pipelines where many consumers need to independently read the same stream of events.
- **Order processing systems** — an e-commerce checkout enqueues an "order placed" message, and separate consumers handle payment, inventory, and shipping without the checkout request waiting on all three.
- **Video/image processing pipelines** — an upload enqueues a "process this file" message, and a pool of worker consumers picks it up and does the actual (slow) transcoding or resizing work asynchronously.
