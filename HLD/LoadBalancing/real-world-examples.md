# Load Balancing — Real-World Examples

- **NGINX / HAProxy** — the two most common software load balancers, sitting in front of application servers in countless production stacks, supporting round-robin, least-connections, and weighted variants.
- **AWS Elastic Load Balancer / Google Cloud Load Balancing** — managed Layer 4/7 load balancers that also perform health checks and auto-scale the backend fleet based on load.
- **DNS-based load balancing** — some systems balance load before a TCP connection even exists, by returning a different backend IP for the same hostname on different DNS queries.
- **Database read replicas** — a load balancer (or client-side driver logic) spreads read queries across multiple replicas while writes go to a single primary, a load-balancing decision applied to storage rather than compute.
