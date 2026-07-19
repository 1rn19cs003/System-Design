# [System Design Architectures — Complete Study Guide](https://1rn19cs003.github.io/System-Design/)

A structured, folder-by-folder path for learning system design: principles, theory, diagrams, real-world examples, and where each concept is actually used in production.

System design splits into two levels, and this guide is organized around that split:

- **HLD/ (High-Level Design)** — the big picture: how components talk to each other, how the system scales, stays available, and stores data.
- **LLD/ (Low-Level Design)** — the detailed picture: how individual components/classes are built internally, using OOP principles and design patterns.

## Open this guide

**Open `index.html` (in this folder) in a browser — that's the front door.** It has a sticky sidebar with every topic in the guide, and links to whichever pages are finished so far.

## Folder layout

```
System-Design-Architectures/
├── index.html                  ← open this — the home page / navigation hub
├── README.md                   ← this file
├── pages/                      ← the rendered website, mirrors the HLD/LLD/pattern categories
│   └── lld/design-patterns/creational/singleton.html
├── assets/                     ← images used by the website, one subfolder per topic
│   └── singleton/ (class-diagram.svg, sequence-diagram.svg)
├── HLD/                        ← source content: theory notes + working code, by topic
└── LLD/
    └── Design-Patterns/
        └── Singleton/
            ├── theory.md, when-to-use.md, real-world-examples.md, diagram.md
            └── code/ (Singleton.java, singleton.py, singleton.js, Singleton.cpp)
```

`HLD/` and `LLD/` hold the raw source material (prose notes + standalone runnable code) organized by topic. `pages/` and `assets/` hold the polished, browsable version of that same content — the two exist side by side on purpose: one is for editing/reference, the other is what you actually read.

## How each topic is documented

Each topic folder (inside `HLD/` or `LLD/`) contains:
- `theory.md` — core concepts, explained the way it actually gets asked or used, not just definitions
- `diagram.md` — pointer to the rendered SVG diagram(s) under `assets/<topic>/`
- `real-world-examples.md` — which companies/products use this and how
- `when-to-use.md` — decision criteria: when this pattern applies vs. when it doesn't
- `code/` — **working, runnable code** for every example given, in **Java, Python, JavaScript, and C++**. No pseudocode-only topics — if a concept is demoed, there's code that actually runs alongside it, and its corresponding page has an interview-questions section too.

## Core Principles (apply across both HLD and LLD)

1. **Scalability** — vertical vs. horizontal scaling, stateless vs. stateful services
2. **Availability** — redundancy, failover, uptime targets (SLA/SLO/SLI)
3. **Reliability & Fault Tolerance** — graceful degradation, retries, circuit breakers
4. **Consistency** — strong vs. eventual consistency, CAP theorem, ACID vs. BASE
5. **Performance & Latency** — throughput vs. latency trade-offs, caching, async processing
6. **Maintainability** — separation of concerns, modularity, loose coupling, high cohesion
7. **Security** — least privilege, defense in depth, encryption at rest/in transit
8. **Cost Efficiency** — right-sizing resources, build vs. buy trade-offs
9. **Simplicity (KISS)** — avoid over-engineering, design for the problem you have
10. **Extensibility (YAGNI vs. future-proofing)** — designing for change without speculative complexity
11. **DRY (Don't Repeat Yourself)** — eliminate duplication in logic and data
12. **Single Source of Truth** — one authoritative place for each piece of data/state

## HLD/ — High-Level Design topics (suggested study order)

1. **Fundamentals** — client-server model, IP/DNS/HTTP basics, latency vs. throughput
2. **Networking & Communication** — REST vs. RPC vs. GraphQL, WebSockets, HTTP/2 & HTTP/3, API Gateways
3. **Load Balancing** — L4 vs. L7, round robin, least connections, consistent hashing
4. **Caching** — CDN, reverse proxy cache, Redis/Memcached, cache invalidation strategies
5. **Databases** — SQL vs. NoSQL, indexing, replication, sharding/partitioning, CAP theorem
6. **Consistency & Availability** — quorum reads/writes, consensus algorithms (Raft/Paxos)
7. **Message Queues & Streaming** — Kafka, RabbitMQ, SQS, pub/sub, event-driven architecture
8. **Microservices & APIs** — service discovery, API gateway, service mesh, circuit breakers
9. **Storage Systems** — object storage (S3), block storage, distributed file systems
10. **Scalability Patterns** — rate limiting, backpressure, bulkheads, idempotency
11. **Reliability & Fault Tolerance** — redundancy, health checks, chaos engineering
12. **Search & Indexing** — inverted index, Elasticsearch, full-text search
13. **Notification Systems** — push/email/SMS pipelines, fan-out architecture
14. **Real-Time Systems** — chat systems, live location tracking, CRDTs
15. **Security in System Design** — OAuth/JWT, rate limiting for abuse prevention
16. **Observability** — logging, metrics, distributed tracing, alerting
17. **HLD Capstone Case Studies** — URL shortener, Twitter feed, Uber, Netflix, WhatsApp, Instagram, payment systems

## LLD/ — Low-Level Design topics (suggested study order)

1. **OOP Fundamentals** — encapsulation, abstraction, inheritance, polymorphism
2. **SOLID Principles** — Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
3. **UML Diagrams** — class diagrams, sequence diagrams, use-case diagrams
4. **Design-Patterns/** — all 23 GoF patterns, each with theory, diagram, and working code (see breakdown below)
5. **API & Class Design** — designing clean interfaces, method signatures, data models
6. **Concurrency Design** — thread safety, locks, producer-consumer patterns
7. **Error Handling & Validation Design** — exception hierarchies, input validation strategy
8. **LLD Capstone Case Studies** — Parking Lot, Elevator System, Tic-Tac-Toe, Splitwise, Library Management, Chess Engine, Vending Machine, BookMyShow/Ticket Booking, Rate Limiter (code-level), LRU Cache

## LLD/Design-Patterns/ — full pattern list (each with working code)

**Creational** — Singleton, Factory Method, Abstract Factory, Builder, Prototype

**Structural** — Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy

**Behavioral** — Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor

Every pattern folder gets: `theory.md` (intent, problem it solves, trade-offs), `diagram.md` (UML class diagram), `code/` (working implementations in Java, Python, JavaScript, and C++), and `real-world-examples.md` (e.g., Singleton in logging frameworks, Observer in event listeners/pub-sub systems, Strategy in payment method selection, Decorator in Java I/O streams).

## Capstone case studies planned

**HLD:** URL Shortener, Rate Limiter, Chat App (WhatsApp-style), News Feed (Twitter/Instagram-style), Ride-Sharing (Uber-style), Video Streaming (Netflix/YouTube-style), E-commerce Checkout & Payments, Distributed File Storage (Dropbox-style), Search Autocomplete, Notification System

**LLD:** Parking Lot, Elevator System, Splitwise, Library Management System, Chess Engine, Vending Machine, Ticket Booking (BookMyShow-style), LRU Cache, Tic-Tac-Toe, Snake & Ladder

## Code policy

Every example anywhere in this guide — HLD architecture demos, LLD capstones, and every design pattern — ships with working, runnable code, not just diagrams or pseudocode, in **Java, Python, JavaScript, and C++**.

## Current Status & Progress

The guide is actively being developed. Below is the current completion status:

### 🌟 Creational Design Patterns (100% Completed & Hosted)
All 5 creational design patterns are fully documented, including **theory, UML diagrams, real-world examples, interview questions, and working code** (in Java, Python, JavaScript, and C++). You can view them on the hosted site:

- 🟢 [Singleton Pattern](https://1rn19cs003.github.io/System-Design/pages/lld/design-patterns/creational/singleton.html)
- 🟢 [Factory Method Pattern](https://1rn19cs003.github.io/System-Design/pages/lld/design-patterns/creational/factory-method.html)
- 🟢 [Abstract Factory Pattern](https://1rn19cs003.github.io/System-Design/pages/lld/design-patterns/creational/abstract-factory.html)
- 🟢 [Builder Pattern](https://1rn19cs003.github.io/System-Design/pages/lld/design-patterns/creational/builder.html)
- 🟢 [Prototype Pattern](https://1rn19cs003.github.io/System-Design/pages/lld/design-patterns/creational/prototype.html)

---

### ⏳ Upcoming Sections (In Progress / Planned)
- **High-Level Design (HLD)** — Fundamentals, Load Balancing, Caching, Databases, Message Queues, Microservices, and Capstones (Soon)
- **Low-Level Design (LLD)** — OOP Fundamentals, SOLID Principles, and LLD Capstones (Soon)
- **Structural Design Patterns** — Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy (Soon)
- **Behavioral Design Patterns** — Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor (Soon)
