# Microservices

## Category
High-Level Design

## What a microservice is
A small, independently deployable service that owns one piece of the business (orders, payments, inventory) and talks to other services over the network, usually HTTP or gRPC. No shared codebase or database with other services — that separation is the whole point.

## Why split a monolith into services
A monolith deploys as one unit — a bug in one feature can require redeploying everything, and one team's code change can break another team's feature. Splitting into services lets each one be built, deployed, and scaled independently, at the cost of every cross-service call now going over a real network instead of an in-process function call.

## Cascading latency
When one service's request handler calls another service to do part of the work, the caller's total latency includes its own processing time plus the callee's full round-trip time. Chain enough services together and a single client request can end up waiting on several sequential network hops before it gets a response.

## API gateways
Rather than have every client know the address of every microservice, an API gateway sits in front of all of them as a single entry point, routing each incoming request to the right backend service and often handling auth, rate limiting, and logging in one place.
