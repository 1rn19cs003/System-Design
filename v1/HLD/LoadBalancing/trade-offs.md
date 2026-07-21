# Load Balancing — Trade-offs

## Round-robin vs. least connections
Round-robin is simpler and has zero bookkeeping cost, but it assumes every request is equally expensive — a bad assumption once request sizes vary. Least connections adapts to load in real time, but requires the load balancer to track live connection counts per backend, which is more state to keep consistent.

## Layer 4 vs. Layer 7 load balancing
A Layer 4 (TCP-level) load balancer routes based on IP/port alone — fast, but blind to what's inside the request. A Layer 7 (HTTP-level) load balancer can read the request path or headers and route `/api/*` differently from `/static/*` — more flexible, but it has to parse every request, which costs CPU.

## Sticky sessions
Routing a given client to the same backend every time (sticky sessions) simplifies in-memory session state, but defeats even load distribution — if that backend gets slow, that client is stuck with it. The common fix is moving session state out of the backend entirely (into a shared cache), which is a caching decision, not a load-balancing one.

**What interviewers are listening for:** knowing that a load balancer needs a way to detect a dead backend (health checks) or it will keep routing traffic into a black hole, and being able to name at least one situation where round-robin actively produces uneven load.
