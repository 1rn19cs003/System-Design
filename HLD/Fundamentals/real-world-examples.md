# Fundamentals — Real-World Examples

- **Every web page load** — your browser resolves a domain via DNS, opens a TCP connection, sends an HTTP request, and renders whatever HTML/JSON comes back.
- **CDN edge resolution** — services like Cloudflare and CloudFront use DNS itself to route a client to the geographically nearest server, folding load-balancing decisions into the DNS lookup step.
- **Mobile apps under poor network conditions** — apps explicitly design around latency (showing cached/optimistic UI immediately) because round-trip time to the server can be hundreds of milliseconds on cellular networks.
- **Batch data pipelines** (Spark jobs, nightly ETL) — explicitly optimized for throughput, accepting that any single record might take a while to process as long as the total volume clears in the batch window.
- **Real-time trading systems** — obsessively optimized for latency, since microseconds of round-trip time can matter more than the total number of trades processed.
