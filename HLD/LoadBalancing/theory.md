# Load Balancing

## Category
High-Level Design

## Why a load balancer exists
One server has a ceiling — CPU, memory, open connections. Past that ceiling, adding more servers only helps if something decides which server handles each incoming request. That decision-maker sits in front of the servers and is called a load balancer: clients only ever talk to it, and it forwards each request to one of several backend servers behind it.

## Round-robin
The simplest strategy: cycle through the backend list in order — server 1, then 2, then 3, then back to 1. It needs no information about server load, and it distributes requests evenly when every backend is roughly equal in capacity and every request costs about the same to serve.

## Least connections
Track how many requests each backend is currently handling, and send the next request to whichever backend has the fewest active connections. This handles uneven request costs better than round-robin — a backend stuck on a slow request won't keep receiving new ones just because it's "next in line."

## Health checks
A load balancer periodically pings each backend (or watches for failed requests) and stops routing to any backend that's unresponsive. Without this, round-robin would keep sending a fraction of all traffic straight into a dead server.
