# HLD Fundamentals

## Category
High-Level Design

## The client-server model
Almost everything in system design sits on top of one basic shape: a client sends a request, a server does some work and sends back a response. The client is usually the thing initiating contact (a browser, a mobile app, another service), and the server is the thing that owns some resource or capability the client wants (data, computation, a file). This is deliberately asymmetric — the server doesn't know a client exists until that client reaches out, and a single server can be reached by many different clients over time. Almost every "bigger" pattern in system design (load balancers, caches, databases, message queues) is really just refining or scaling this one basic request/response relationship.

## How a client actually finds a server: DNS
A client doesn't usually know a server's raw network address (its IP address) up front — it knows a human-readable name, like `api.example.com`. DNS (Domain Name System) is the system that translates that name into an IP address. When a client wants to talk to `api.example.com`, it first asks a DNS resolver "what's the IP for this name?", gets back something like `93.184.216.34`, and only then opens an actual network connection to that IP. This lookup is usually cached for a while (controlled by a TTL — time to live) so the same translation doesn't have to be repeated for every single request.

## What HTTP actually is
Once a client has an IP address, it needs an agreed-upon format for the request and response — that's HTTP. HTTP is a text-based (in HTTP/1.1) request/response protocol: a request has a method (GET, POST, PUT, DELETE...), a path, headers (metadata like content type, authentication tokens), and optionally a body; a response has a status code (200, 404, 500...), headers, and optionally a body. Underneath HTTP sits TCP, which handles the actual reliable delivery of bytes over the network (retransmitting lost packets, keeping data in order) — HTTP doesn't have to worry about packet loss because TCP already solved that problem one layer down.

## Latency vs. throughput
These two numbers get conflated constantly, but they measure genuinely different things. Latency is how long a single request takes, from the moment it's sent to the moment the response arrives — measured in milliseconds. Throughput is how many requests a system can handle per unit of time — measured in requests per second. A system can have low latency but low throughput (a single fast worker handling one request at a time) or high latency but high throughput (many slow workers running in parallel, so lots of total work gets done even though each individual request takes a while). Optimizing for one doesn't automatically improve the other, and most real system-design trade-offs eventually come down to which of the two actually matters more for the use case at hand.
