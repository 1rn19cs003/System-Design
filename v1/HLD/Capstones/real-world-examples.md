# Capstone: Rate Limiter — Real-World Examples

- **Stripe's API rate limits** — documented per-endpoint request limits using a token-bucket-style algorithm, explicitly to protect the platform from being overwhelmed by any single integration.
- **AWS API Gateway throttling** — configurable burst and steady-state rate limits per client, directly modeled as a token bucket (burst = capacity, steady-state = refill rate).
- **GitHub API rate limiting** — a fixed quota per hour per token, with response headers telling clients exactly how many requests remain and when the quota resets.
- **Nginx's `limit_req` module** — implements request rate limiting at the web server layer using a leaky-bucket variant, protecting upstream application servers from traffic spikes.
