# Microservices — Trade-offs

## Independent deployability vs. network overhead
Splitting a monolith lets teams deploy independently and scale only the services that need it, but every function call that used to be in-process is now a real network call — slower, and now able to fail in ways an in-process call never could (timeouts, partial failures, retries).

## Team autonomy vs. operational complexity
Each service can pick its own stack and release schedule, but now there are N services to deploy, monitor, and keep compatible with each other's APIs, instead of one. Distributed tracing and centralized logging become necessary just to debug a single user request that touched five services.

## Cascading latency vs. a monolith's single hop
A monolith's request handler calls other code in the same process — effectively free. A microservice chain pays real network latency at every hop, and that latency adds up sequentially unless calls are made in parallel where possible.

**What interviewers are listening for:** recognizing that microservices aren't "free" scalability — they trade a monolith's simplicity for real operational cost, and being able to explain concretely how a chain of service calls accumulates latency hop by hop.
