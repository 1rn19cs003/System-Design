# Load Balancing — Interview Questions

## How does round-robin load balancing work, and when does it fall short?
It cycles through backends in a fixed order, one request per backend, wrapping back to the start. It falls short when requests have very different costs — a backend can end up loaded even though it "took its fair share" by count, not by actual work.

## What's the difference between round-robin and least-connections?
Round-robin decides purely by rotation order; least-connections decides by checking how many requests each backend is currently handling and picking the least-loaded one. Least-connections needs live state, round-robin doesn't.

## Why does a load balancer need health checks?
Without them, a dead backend keeps receiving its rotation share of traffic forever — every request routed there simply fails. A health check lets the load balancer detect the failure and stop sending traffic there until it recovers.

## What's the difference between Layer 4 and Layer 7 load balancing?
Layer 4 routes based on IP and port only, without looking at the request contents — fast, protocol-agnostic. Layer 7 reads the actual HTTP request (path, headers) and can route different paths to different backend pools, at the cost of having to parse every request.
