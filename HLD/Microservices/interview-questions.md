# Microservices — Interview Questions

## What's the core difference between a monolith and microservices?
A monolith is one deployable unit where modules call each other in-process. Microservices split those modules into independently deployable services that call each other over the network — real latency and real failure modes that in-process calls never have.

## Why does cascading latency matter in a microservices chain?
If service A calls service B to complete a request, A's total response time includes B's full round-trip time on top of A's own processing. Chain several services together and a single client request can end up waiting on multiple sequential network hops.

## What does an API gateway do?
It's a single entry point in front of all the backend microservices, routing each incoming request to the right service and often handling cross-cutting concerns like authentication, rate limiting, and logging in one place instead of duplicating them in every service.

## What's a real cost of splitting a monolith into microservices?
Operational complexity: instead of deploying and monitoring one thing, there are now many services to deploy, version, and keep API-compatible with each other, and debugging a single user request often means tracing it across several services.
