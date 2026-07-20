export interface CaseStudyData {
  slug: string;
  title: string;
  tag: string;
  description: string;
  overview: string;
  architecturePoints: string[];
  diagramSvg?: string;
  keyDesignDecisions: { decision: string; why: string }[];
}

export const CASE_STUDIES_DATA: Record<string, CaseStudyData> = {
  netflix: {
    slug: 'netflix',
    title: 'Netflix Video Streaming System Architecture',
    tag: 'Case Study · Media Streaming',
    description: 'CDN playback, adaptive bitrate streaming (ABR), microservices architecture, and encoding pipelines.',
    overview:
      'Netflix accounts for a significant portion of worldwide internet traffic. Its system is split into two main subsystems: the Control Plane (microservices in AWS handling auth, recommendations, search) and the Data Plane (Open Connect CDN serving video chunks).',
    architecturePoints: [
      'Open Connect Custom CDN: Appliances deployed directly inside ISPs globally to minimize latency and transit costs.',
      'Adaptive Bitrate Streaming (HLS/DASH): Video is encoded into multiple resolutions and bitrates. Client monitors buffer health and switches streams seamlessly.',
      'Chaos Engineering (Chaos Monkey): Randomly terminating production instances to ensure resilient self-healing microservices.',
    ],
    diagramSvg: '/assets/case-studies/netflix-architecture.svg',
    keyDesignDecisions: [
      {
        decision: 'Pre-positioning video content during off-peak hours',
        why: 'Avoids network congestion during peak viewing hours by pushing top titles to local CDN nodes overnight.',
      },
      {
        decision: 'Microservices on AWS + Custom CDN for playback',
        why: 'Leverages cloud elasticity for compute/analytics while taking direct control over high-bandwidth video traffic delivery.',
      },
    ],
  },
  twitter: {
    slug: 'twitter',
    title: 'Twitter Timeline System Architecture',
    tag: 'Case Study · Social Network',
    description: 'Fanout-on-write vs. fanout-on-read, Redis timeline caches, real-time push feeds.',
    overview:
      'Designing a home timeline for hundreds of millions of active users requires handling extreme read-to-write ratios (e.g. 100k reads/sec vs 5k tweets/sec).',
    architecturePoints: [
      'Fanout Service: When a user tweets, the tweet ID is injected directly into the Redis timeline caches of all followers (Fanout-on-Write).',
      'Celebrity Exception (High-fanout): Users with millions of followers (e.g., Barack Obama) skip fanout-on-write to prevent cache write-storms. Their tweets are merged dynamically at read time (Hybrid approach).',
      'Timeline Cache: Redis clusters storing arrays of tweet IDs per user.',
    ],
    diagramSvg: '/assets/case-studies/twitter-fanout.svg',
    keyDesignDecisions: [
      {
        decision: 'Hybrid Fanout Strategy',
        why: 'Optimizes read latency for 99.9% of users while keeping write amplification under control for high-follower accounts.',
      },
    ],
  },
  uber: {
    slug: 'uber',
    title: 'Uber Driver Location & Match Architecture',
    tag: 'Case Study · Real-time Geospatial',
    description: 'Geohashing, Quadtrees, real-time WebSocket location updates, dispatch algorithms.',
    overview:
      'Uber tracks millions of active drivers sending location updates every 4 seconds and matches rider requests with nearby available drivers in real-time.',
    architecturePoints: [
      'Geospatial Indexing (H3 / Quadtree): Divides the world into hexagonal grid cells for O(1) spatial proximity queries.',
      'DISPATCH Service: State machine matching rider requests to candidate drivers using Ringpop consistent hashing.',
      'WebSockets / gRPC: Persistent dual-directional channels between mobile apps and backend gateways.',
    ],
    diagramSvg: '/assets/case-studies/uber-architecture.svg',
    keyDesignDecisions: [
      {
        decision: 'H3 Spatial Indexing',
        why: 'Hexagonal grid systems offer equal distances between neighbor centers, eliminating edge distortion in distance calculations.',
      },
    ],
  },
  'url-shortener': {
    slug: 'url-shortener',
    title: 'URL Shortener System Architecture (TinyURL)',
    tag: 'Case Study · Web Service',
    description: 'Base62 encoding, MD5 hashing, key generation service (KGS), Redis caching.',
    overview:
      'A classic system design interview question: converting long URLs (e.g. 100+ chars) into short 7-character URLs (e.g. tinyurl.com/y8x9z2a) with high availability and low latency.',
    architecturePoints: [
      'Base62 Encoding: [a-z, A-Z, 0-9] allows 62^7 = ~3.5 Trillion unique short URLs.',
      'Key Generation Service (KGS): Pre-generates random 7-character strings in advance to guarantee zero collision and instant O(1) allocation.',
      'Cache-Aside (Redis): 80/20 rule applied to cache top 20% viral shortened links in memory.',
    ],
    diagramSvg: '/assets/case-studies/url-shortener-architecture.svg',
    keyDesignDecisions: [
      {
        decision: 'Pre-generating Keys with KGS',
        why: 'Eliminates database lookup overhead and lock contention during live URL shortening requests.',
      },
    ],
  },
  whatsapp: {
    slug: 'whatsapp',
    title: 'WhatsApp Real-time Messenger Architecture',
    tag: 'Case Study · Messaging',
    description: 'End-to-End Encryption (Signal protocol), Erlang/Elixir WebSockets, offline store-and-forward queues.',
    overview:
      'WhatsApp serves over 2 Billion users sending 100+ Billion messages daily with tiny engineering team overhead.',
    architecturePoints: [
      'Erlang / EJABBERD: Highly concurrent lightweight process model handling 2+ Million active WebSocket connections per single server instance.',
      'Store and Forward: Messages are delivered to the recipient immediately if online, or queued transiently in DB until device reconnects, then deleted from server.',
      'Signal Protocol: End-to-End Encryption (E2EE) where keys reside strictly on user devices.',
    ],
    diagramSvg: '/assets/case-studies/whatsapp-architecture.svg',
    keyDesignDecisions: [
      {
        decision: 'Transient Message Storage',
        why: 'Once delivered, messages are deleted from servers, drastically reducing database storage overhead and security liability.',
      },
    ],
  },
};
