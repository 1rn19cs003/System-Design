export interface ContentItem {
  id: string;
  title: string;
  description: string;
  href: string;
  tag: string;
  category: 'core' | 'hld' | 'lld' | 'patterns' | 'case-studies' | 'reference';
}

export interface CategoryGroup {
  id: string;
  title: string;
  description: string;
  items: ContentItem[];
}

export const CATEGORIES: CategoryGroup[] = [
  {
    id: 'core-section',
    title: 'Core Principles & Overview',
    description: 'Foundational concepts, trade-offs, consistency models, and system maps.',
    items: [
      {
        id: 'core-principles',
        title: 'Core Principles',
        description: 'Scalability, reliability, consistency models, and topic roadmap.',
        href: '/pages/core-principles',
        tag: 'Start Here',
        category: 'core',
      },
    ],
  },
  {
    id: 'hld-section',
    title: 'High-Level Design (HLD)',
    description: 'System architecture, distributed systems, caching, databases, and microservices.',
    items: [
      {
        id: 'hld-fundamentals',
        title: 'HLD Fundamentals',
        description: 'Client-server, DNS, HTTP, latency vs. throughput, and trade-offs.',
        href: '/pages/hld/fundamentals',
        tag: 'HLD · Start Here',
        category: 'hld',
      },
      {
        id: 'hld-load-balancing',
        title: 'Load Balancing',
        description: 'L4 vs. L7 load balancing, algorithms (RR, Least Conn, Hashing), and health checks.',
        href: '/pages/hld/load-balancing',
        tag: 'HLD · Traffic',
        category: 'hld',
      },
      {
        id: 'hld-caching',
        title: 'Caching Strategies',
        description: 'Cache-aside, write-through, write-back, eviction policies (LRU, LFU), and Redis.',
        href: '/pages/hld/caching',
        tag: 'HLD · Performance',
        category: 'hld',
      },
      {
        id: 'hld-databases',
        title: 'Databases & Scaling',
        description: 'SQL vs. NoSQL, sharding, replication, ACID vs. BASE, and CAP theorem.',
        href: '/pages/hld/databases',
        tag: 'HLD · Storage',
        category: 'hld',
      },
      {
        id: 'hld-microservices',
        title: 'Microservices Architecture',
        description: 'API Gateways, service discovery, saga pattern, circuit breakers, and event-driven design.',
        href: '/pages/hld/microservices',
        tag: 'HLD · Architecture',
        category: 'hld',
      },
      {
        id: 'hld-message-queues',
        title: 'Message Queues & Streaming',
        description: 'Kafka, RabbitMQ, pub/sub, dead letter queues, and idempotent consumers.',
        href: '/pages/hld/message-queues',
        tag: 'HLD · Messaging',
        category: 'hld',
      },
      {
        id: 'hld-capstones',
        title: 'Rate Limiter Capstone',
        description: 'Token bucket, leaky bucket, sliding window rate limiter design with timed code.',
        href: '/pages/hld/capstones',
        tag: 'HLD · Capstone',
        category: 'hld',
      },
    ],
  },
  {
    id: 'lld-section',
    title: 'Low-Level Design (LLD)',
    description: 'Object-oriented programming, SOLID principles, and clean code fundamentals.',
    items: [
      {
        id: 'lld-oop',
        title: 'OOP Fundamentals',
        description: 'Encapsulation, abstraction, inheritance, and polymorphism with multi-language code.',
        href: '/pages/lld/oop-fundamentals',
        tag: 'LLD · Start Here',
        category: 'lld',
      },
      {
        id: 'lld-solid',
        title: 'SOLID Principles',
        description: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
        href: '/pages/lld/solid-principles',
        tag: 'LLD · Clean Code',
        category: 'lld',
      },
      {
        id: 'lld-capstones',
        title: 'LLD Capstones',
        description: 'Parking Lot system design, Elevators, and LRU Cache LLD with working code.',
        href: '/pages/lld/capstones',
        tag: 'LLD · Capstone',
        category: 'lld',
      },
    ],
  },
  {
    id: 'patterns-section',
    title: 'Design Patterns',
    description: 'Gang of Four (GoF) Creational, Structural, and Behavioral patterns with working code in 4 languages.',
    items: [
      {
        id: 'singleton',
        title: 'Singleton Pattern',
        description: 'Thread-safe Singleton implementation in Java, Python, JS, C++ with double-checked locking.',
        href: '/pages/lld/design-patterns/creational/singleton',
        tag: 'Creational',
        category: 'patterns',
      },
      {
        id: 'factory-method',
        title: 'Factory Method',
        description: 'Decoupling object creation from business logic via factory interfaces.',
        href: '/pages/lld/design-patterns/creational/factory-method',
        tag: 'Creational',
        category: 'patterns',
      },
      {
        id: 'abstract-factory',
        title: 'Abstract Factory',
        description: 'Creating families of related objects without specifying concrete classes.',
        href: '/pages/lld/design-patterns/creational/abstract-factory',
        tag: 'Creational',
        category: 'patterns',
      },
      {
        id: 'builder',
        title: 'Builder Pattern',
        description: 'Constructing complex objects step-by-step with fluent interfaces.',
        href: '/pages/lld/design-patterns/creational/builder',
        tag: 'Creational',
        category: 'patterns',
      },
      {
        id: 'prototype',
        title: 'Prototype Pattern',
        description: 'Cloning existing objects without coupling to their specific classes.',
        href: '/pages/lld/design-patterns/creational/prototype',
        tag: 'Creational',
        category: 'patterns',
      },
      {
        id: 'adapter',
        title: 'Adapter Pattern',
        description: 'Translating incompatible interfaces so classes can work together.',
        href: '/pages/lld/design-patterns/structural/adapter',
        tag: 'Structural',
        category: 'patterns',
      },
      {
        id: 'decorator',
        title: 'Decorator Pattern',
        description: 'Attaching new behaviors to objects dynamically without altering code.',
        href: '/pages/lld/design-patterns/structural/decorator',
        tag: 'Structural',
        category: 'patterns',
      },
      {
        id: 'facade',
        title: 'Facade Pattern',
        description: 'Providing a simplified interface to a complex library or subsystem.',
        href: '/pages/lld/design-patterns/structural/facade',
        tag: 'Structural',
        category: 'patterns',
      },
      {
        id: 'observer',
        title: 'Observer Pattern',
        description: 'Subscription mechanism to notify multiple objects of any events.',
        href: '/pages/lld/design-patterns/behavioral/observer',
        tag: 'Behavioral',
        category: 'patterns',
      },
      {
        id: 'strategy',
        title: 'Strategy Pattern',
        description: 'Defining a family of algorithms, encapsulating each, and making them interchangeable.',
        href: '/pages/lld/design-patterns/behavioral/strategy',
        tag: 'Behavioral',
        category: 'patterns',
      },
    ],
  },
  {
    id: 'case-studies-section',
    title: 'Real-World Case Studies',
    description: 'Architectural breakdowns of production-scale systems.',
    items: [
      {
        id: 'netflix',
        title: 'Netflix Video Streaming',
        description: 'CDN edge playback, adaptive bitrate streaming, encoding pipelines, microservices.',
        href: '/pages/case-studies/netflix',
        tag: 'Case Study',
        category: 'case-studies',
      },
      {
        id: 'twitter',
        title: 'Twitter Timeline Engine',
        description: 'Fanout-on-write vs. fanout-on-read, Redis timeline caches, real-time push.',
        href: '/pages/case-studies/twitter',
        tag: 'Case Study',
        category: 'case-studies',
      },
      {
        id: 'uber',
        title: 'Uber Driver Location Tracking',
        description: 'Geohashing, Quadtrees, real-time WebSocket location updates, dispatch algorithms.',
        href: '/pages/case-studies/uber',
        tag: 'Case Study',
        category: 'case-studies',
      },
      {
        id: 'url-shortener',
        title: 'TinyURL / Shortener',
        description: 'Base62 encoding, MD5 hashing, key generation service (KGS), cache lookups.',
        href: '/pages/case-studies/url-shortener',
        tag: 'Case Study',
        category: 'case-studies',
      },
      {
        id: 'whatsapp',
        title: 'WhatsApp Chat System',
        description: 'E2E encryption, WebSockets, XMPP/custom protocol, offline message queues, media storage.',
        href: '/pages/case-studies/whatsapp',
        tag: 'Case Study',
        category: 'case-studies',
      },
    ],
  },
  {
    id: 'reference-section',
    title: 'Reference & Utilities',
    description: 'Glossary of terms and latency numbers every engineer should know.',
    items: [
      {
        id: 'latency-numbers',
        title: 'Latency Numbers',
        description: 'L1 cache vs. RAM vs. SSD vs. Network roundtrips — every engineer should know.',
        href: '/pages/reference/latency-numbers',
        tag: 'Reference',
        category: 'reference',
      },
      {
        id: 'glossary',
        title: 'System Design Glossary',
        description: 'Definitions of 100+ terms: Idempotency, Split-Brain, Gossip Protocol, Backpressure, etc.',
        href: '/pages/reference/glossary',
        tag: 'Reference',
        category: 'reference',
      },
    ],
  },
];
