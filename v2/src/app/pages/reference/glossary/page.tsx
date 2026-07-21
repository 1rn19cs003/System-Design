import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import Link from 'next/link';

export const metadata = {
  title: 'System Design Glossary — System Design Architectures',
};

const azBarStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 4,
  margin: '14px 0 28px',
  padding: 12,
  background: 'var(--sidebar-bg)',
  border: '1px solid var(--border)',
  borderRadius: 8,
};

const azLinkStyle: React.CSSProperties = {
  width: 26,
  height: 26,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 6,
  textDecoration: 'none',
  color: 'var(--text)',
  fontSize: 13,
  fontWeight: 600,
};

const azDisabledStyle: React.CSSProperties = {
  ...azLinkStyle,
  color: 'var(--border)',
  pointerEvents: 'none',
};

const letterGroupStyle: React.CSSProperties = {
  marginBottom: 30,
  scrollMarginTop: 110,
};

const letterH2Style: React.CSSProperties = {
  fontSize: 22,
  color: 'var(--accent)',
  borderBottom: '1px solid var(--border)',
  paddingBottom: 6,
  margin: '0 0 14px',
};

const dtStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 15,
  marginTop: 14,
};

const dtFirstStyle: React.CSSProperties = { ...dtStyle, marginTop: 0 };

const ddStyle: React.CSSProperties = {
  margin: '3px 0 0',
  fontSize: 14.5,
  color: 'var(--text)',
};

function Term({ term, first, children }: { term: string; first?: boolean; children: React.ReactNode }) {
  return (
    <>
      <dt style={first ? dtFirstStyle : dtStyle}>{term}</dt>
      <dd style={ddStyle}>{children}</dd>
    </>
  );
}

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Z'];

export default function GlossaryPage() {
  return (
    <>
      <Header />
      <div className="layout">
        <TopicSidebar
          backHref="/pages/reference"
          backLabel="Back to Reference"
          toc={letters.map((l) => ({ id: l, label: l }))}
        />

        <main className="content">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Reference', href: '/pages/reference' },
              { label: 'Glossary' },
            ]}
          />
          <h1 id="overview">System Design Glossary</h1>
          <p>
            Sixty-plus terms from HLD, LLD, and design patterns, defined in one or two sentences
            each. Meant for scanning, not reading top to bottom — use the A&ndash;Z bar or your
            browser&apos;s find (Ctrl/Cmd+F) to jump straight to a term.
          </p>

          <div style={azBarStyle}>
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W'].map((l) => (
              <a key={l} href={`#${l}`} style={azLinkStyle}>
                {l}
              </a>
            ))}
            <span style={azDisabledStyle}>X</span>
            <span style={azDisabledStyle}>Y</span>
            <a href="#Z" style={azLinkStyle}>
              Z
            </a>
          </div>

          <div id="A" style={letterGroupStyle}>
            <h2 style={letterH2Style}>A</h2>
            <dl style={{ margin: 0 }}>
              <Term term="ACID" first>
                Atomicity, Consistency, Isolation, Durability — the four guarantees a traditional
                relational transaction makes, so a multi-step operation either fully completes or
                fully rolls back.
              </Term>
              <Term term="API Gateway">
                A single entry point in front of a set of services that handles routing, auth, rate
                limiting, and request shaping, so clients don&apos;t talk to each backend service
                directly.
              </Term>
              <Term term="At-least-once delivery">
                A messaging guarantee that a message will be delivered one or more times, never zero
                — safe against loss, but requires the consumer to handle duplicates (idempotency).
              </Term>
              <Term term="At-most-once delivery">
                A messaging guarantee that a message is delivered zero or one times, never more —
                safe against duplicates, but can silently lose messages.
              </Term>
              <Term term="Availability">
                The fraction of time a system is usable, often expressed as a string of nines (99.9%,
                99.99%). See{' '}
                <Link href="/pages/core-principles">Core Principles</Link>.
              </Term>
            </dl>
          </div>

          <div id="B" style={letterGroupStyle}>
            <h2 style={letterH2Style}>B</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Back-of-envelope estimation" first>
                Quick, order-of-magnitude math (traffic → QPS → storage → servers) used early in a
                system design interview to size the problem before designing. See the{' '}
                <Link href="/pages/reference/latency-numbers">Numbers Every Engineer Should Know</Link> page.
              </Term>
              <Term term="Backpressure">
                A mechanism where a slow downstream consumer signals an upstream producer to slow
                down, preventing the consumer from being overwhelmed.
              </Term>
              <Term term="Bloom filter">
                A space-efficient probabilistic structure that can say &quot;definitely not
                present&quot; or &quot;maybe present&quot; for set membership, used to avoid
                expensive lookups for keys that don&apos;t exist.
              </Term>
              <Term term="Bounded context">
                A domain-driven design boundary within which a particular model and its terms have
                one consistent meaning — often maps directly onto a microservice boundary.
              </Term>
            </dl>
          </div>

          <div id="C" style={letterGroupStyle}>
            <h2 style={letterH2Style}>C</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Cache-aside" first>
                A caching pattern where the application checks the cache first, and on a miss reads
                from the database and populates the cache itself. See{' '}
                <Link href="/pages/hld/caching">Caching</Link>.
              </Term>
              <Term term="CAP theorem">
                During a network partition, a distributed system must choose between Consistency and
                Availability — partition tolerance itself isn&apos;t optional on a real network. See{' '}
                <Link href="/pages/core-principles">Core Principles</Link>.
              </Term>
              <Term term="CDN (Content Delivery Network)">
                A geographically distributed network of caching servers that serve static (and some
                dynamic) content from a location physically close to the requester, cutting latency
                and origin load.
              </Term>
              <Term term="Circuit breaker">
                A pattern that stops calling a failing downstream dependency for a cooldown period
                after repeated failures, preventing cascading failure and giving the dependency time
                to recover.
              </Term>
              <Term term="Consensus">
                The problem of getting a set of distributed nodes to agree on a single value or
                decision even in the presence of failures — solved by algorithms like Paxos and Raft.
              </Term>
              <Term term="Consistent hashing">
                A hashing scheme that minimizes data movement when nodes are added or removed from a
                distributed cache or database, by mapping both keys and nodes onto the same ring. See{' '}
                <Link href="/pages/hld/databases">Databases</Link>.
              </Term>
              <Term term="Cursor-based pagination">
                Pagination that uses an opaque pointer to the last-seen item instead of an
                offset/page number, avoiding the performance and consistency problems of large
                offsets.
              </Term>
            </dl>
          </div>

          <div id="D" style={letterGroupStyle}>
            <h2 style={letterH2Style}>D</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Denormalization" first>
                Deliberately duplicating data across tables/documents to avoid expensive joins at
                read time, trading storage and write complexity for read speed.
              </Term>
              <Term term="Distributed lock">
                A lock coordinated across multiple machines (often via a service like ZooKeeper,
                etcd, or Redis) so only one node performs a critical section of work at a time.
              </Term>
              <Term term="DNS (Domain Name System)">
                The distributed, eventually-consistent system that translates human-readable domain
                names into IP addresses. See{' '}
                <Link href="/pages/hld/fundamentals">HLD Fundamentals</Link>.
              </Term>
              <Term term="Durability">
                The guarantee that once a write is acknowledged, it survives crashes, power loss, or
                restarts — usually achieved by writing to disk and/or replicating before
                acknowledging.
              </Term>
            </dl>
          </div>

          <div id="E" style={letterGroupStyle}>
            <h2 style={letterH2Style}>E</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Eventual consistency" first>
                A model where replicas may briefly disagree after a write but converge given enough
                time and no new writes — trades immediate correctness for availability and speed.
              </Term>
              <Term term="Exponential backoff">
                A retry strategy where the wait time between retries grows exponentially (often with
                random jitter added) to avoid overwhelming a recovering service.
              </Term>
            </dl>
          </div>

          <div id="F" style={letterGroupStyle}>
            <h2 style={letterH2Style}>F</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Fan-out" first>
                Delivering one piece of data to many recipients — e.g., pushing a new tweet to every
                follower&apos;s feed. See the{' '}
                <Link href="/pages/case-studies/twitter">Twitter / X case study</Link>.
              </Term>
              <Term term="Fault tolerance">
                A system&apos;s ability to keep functioning correctly even when one or more of its
                components fail.
              </Term>
              <Term term="Federation">
                Splitting a single large database into multiple databases by function (e.g., users
                DB, orders DB) rather than by row — a simpler alternative to full sharding.
              </Term>
            </dl>
          </div>

          <div id="G" style={letterGroupStyle}>
            <h2 style={letterH2Style}>G</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Gossip protocol" first>
                A peer-to-peer communication style where nodes periodically exchange state with a
                few random peers, spreading information across a cluster without central
                coordination.
              </Term>
            </dl>
          </div>

          <div id="H" style={letterGroupStyle}>
            <h2 style={letterH2Style}>H</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Heartbeat" first>
                A periodic signal a node sends to indicate it&apos;s still alive; missed heartbeats
                are how load balancers and cluster managers detect failures.
              </Term>
              <Term term="Horizontal scaling">
                Adding more machines to handle more load, as opposed to making one machine bigger.
                See <Link href="/pages/core-principles">Core Principles</Link>.
              </Term>
              <Term term="Hot partition / hotspot">
                A single shard or key that receives disproportionately more traffic than the others,
                becoming a bottleneck even though the system is &quot;scaled.&quot;
              </Term>
            </dl>
          </div>

          <div id="I" style={letterGroupStyle}>
            <h2 style={letterH2Style}>I</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Idempotency" first>
                A property where performing the same operation multiple times has the same effect as
                performing it once — critical for safely retrying requests.
              </Term>
              <Term term="Indexing">
                A data structure (commonly a B-tree or hash index) that lets a database find rows
                without scanning the whole table, at the cost of extra storage and slower writes.
              </Term>
              <Term term="Isolation level">
                How much one database transaction is shielded from the effects of concurrent
                transactions (e.g., Read Committed, Repeatable Read, Serializable) — stronger
                isolation costs concurrency.
              </Term>
            </dl>
          </div>

          <div id="J" style={letterGroupStyle}>
            <h2 style={letterH2Style}>J</h2>
            <dl style={{ margin: 0 }}>
              <Term term="JWT (JSON Web Token)" first>
                A signed, self-contained token format commonly used to carry authentication/authorization
                claims between services without a shared session store.
              </Term>
            </dl>
          </div>

          <div id="K" style={letterGroupStyle}>
            <h2 style={letterH2Style}>K</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Key-value store" first>
                A database that maps unique keys to values with no required schema on the value —
                optimized for very fast lookups by key (e.g., Redis, DynamoDB).
              </Term>
            </dl>
          </div>

          <div id="L" style={letterGroupStyle}>
            <h2 style={letterH2Style}>L</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Latency" first>
                The time it takes for a single request to complete, from sent to received. See the{' '}
                <Link href="/pages/reference/latency-numbers">Latency Numbers</Link> reference.
              </Term>
              <Term term="Leader election">
                The process by which a distributed cluster picks one node to act as the
                coordinator/primary, so writes or decisions aren&apos;t made by multiple nodes at
                once.
              </Term>
              <Term term="Load balancer">
                A component that distributes incoming requests across multiple backend servers,
                improving both throughput and fault tolerance. See{' '}
                <Link href="/pages/hld/load-balancing">Load Balancing</Link>.
              </Term>
              <Term term="Long polling">
                A technique where the client requests data and the server holds the connection open
                until new data is available (or a timeout), simulating push over plain HTTP.
              </Term>
              <Term term="LRU cache">
                &quot;Least Recently Used&quot; — a cache eviction policy that discards the item that
                hasn&apos;t been accessed in the longest time when the cache is full. See{' '}
                <Link href="/pages/hld/caching">Caching</Link>.
              </Term>
            </dl>
          </div>

          <div id="M" style={letterGroupStyle}>
            <h2 style={letterH2Style}>M</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Message queue" first>
                An intermediary that buffers messages between producers and consumers, decoupling
                them in time and allowing async, resilient processing. See{' '}
                <Link href="/pages/hld/message-queues">Message Queues</Link>.
              </Term>
              <Term term="Microservices">
                An architecture style that splits an application into small, independently
                deployable services, each owning its own data. See{' '}
                <Link href="/pages/hld/microservices">Microservices</Link>.
              </Term>
              <Term term="Monolith">
                An application built and deployed as a single unit — simpler to develop and deploy
                early on, harder to scale specific parts independently.
              </Term>
              <Term term="MTBF / MTTR">
                Mean Time Between Failures and Mean Time To Recovery — the two numbers that together
                describe how often a system fails and how fast it comes back.
              </Term>
            </dl>
          </div>

          <div id="N" style={letterGroupStyle}>
            <h2 style={letterH2Style}>N</h2>
            <dl style={{ margin: 0 }}>
              <Term term="N+1 problem" first>
                A performance bug where code issues one query to fetch a list, then one additional
                query per item to fetch related data, instead of a single joined/batched query.
              </Term>
              <Term term="Normalization">
                Structuring relational data to minimize duplication by splitting it into related
                tables — the opposite trade-off from denormalization.
              </Term>
            </dl>
          </div>

          <div id="O" style={letterGroupStyle}>
            <h2 style={letterH2Style}>O</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Optimistic locking" first>
                A concurrency strategy that lets multiple transactions proceed without locking, then
                checks for conflicts (e.g., via a version number) at commit time.
              </Term>
              <Term term="Outbox pattern">
                Writing a state change and the event describing it in the same local database
                transaction, then reliably publishing the event separately — avoids the dual-write
                problem between a DB and a message broker.
              </Term>
            </dl>
          </div>

          <div id="P" style={letterGroupStyle}>
            <h2 style={letterH2Style}>P</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Pagination" first>
                Returning a large result set in smaller pages instead of all at once — see also
                cursor-based pagination.
              </Term>
              <Term term="Partitioning / sharding">
                Splitting a dataset across multiple database nodes by some key, so no single node
                has to hold or serve all the data. See{' '}
                <Link href="/pages/hld/databases">Databases</Link>.
              </Term>
              <Term term="Pessimistic locking">
                A concurrency strategy that locks a row/resource before modifying it, blocking other
                transactions until the lock is released — safer under contention, costs throughput.
              </Term>
              <Term term="Polling">
                A client repeatedly asking a server &quot;is there anything new?&quot; on a fixed
                interval, as opposed to the server pushing updates.
              </Term>
              <Term term="Publish-subscribe (pub/sub)">
                A messaging pattern where publishers send messages to a topic without knowing the
                subscribers, and any number of subscribers can receive them independently. See{' '}
                <Link href="/pages/lld/design-patterns/behavioral/observer">Observer pattern</Link>.
              </Term>
            </dl>
          </div>

          <div id="Q" style={letterGroupStyle}>
            <h2 style={letterH2Style}>Q</h2>
            <dl style={{ margin: 0 }}>
              <Term term="QPS (Queries Per Second)" first>
                The number of requests a system handles per second — the core unit of throughput
                used in capacity estimation.
              </Term>
              <Term term="Quorum">
                The minimum number of nodes in a distributed system that must agree (or acknowledge)
                for a read or write to be considered successful, used to balance consistency and
                availability.
              </Term>
            </dl>
          </div>

          <div id="R" style={letterGroupStyle}>
            <h2 style={letterH2Style}>R</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Rate limiting" first>
                Restricting how many requests a client can make in a given time window, protecting a
                system from overload or abuse. See{' '}
                <Link href="/pages/hld/capstones">HLD Capstones</Link>.
              </Term>
              <Term term="Read replica">
                A copy of a database that serves read traffic, kept in sync with a primary that
                handles writes, so read load can scale independently of write load.
              </Term>
              <Term term="Retry with jitter">
                Adding a small random delay to retry backoff timing so that many clients retrying
                after the same failure don&apos;t all hit the server at exactly the same moment (the
                &quot;thundering herd&quot;).
              </Term>
              <Term term="Reverse proxy">
                A server that sits in front of one or more backend servers and forwards client
                requests to them, often also handling TLS termination, caching, and load balancing.
              </Term>
            </dl>
          </div>

          <div id="S" style={letterGroupStyle}>
            <h2 style={letterH2Style}>S</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Sharding" first>
                See Partitioning.
              </Term>
              <Term term="Singleton">
                A design pattern that restricts a class to a single instance with a global access
                point. See the{' '}
                <Link href="/pages/lld/design-patterns/creational/singleton">Singleton pattern page</Link>.
              </Term>
              <Term term="SLA / SLO / SLI">
                Service Level Agreement (the promise, often contractual), Objective (the internal
                target, e.g., 99.9% uptime), and Indicator (the actual measured metric) — three
                layers of the same reliability conversation.
              </Term>
              <Term term="Sticky session">
                A load balancing behavior where all requests from a given client are routed to the
                same backend server, often used to keep session state in server memory.
              </Term>
              <Term term="Strong consistency">
                A model where every read reflects the most recent write, everywhere, immediately —
                simpler to reason about, but costs coordination and latency.
              </Term>
            </dl>
          </div>

          <div id="T" style={letterGroupStyle}>
            <h2 style={letterH2Style}>T</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Throughput" first>
                The total amount of work a system completes per unit of time (e.g., requests/second)
                — distinct from latency, which is about a single request&apos;s speed.
              </Term>
              <Term term="TTL (Time To Live)">
                How long a piece of cached or DNS data is considered valid before it must be
                refreshed or re-fetched.
              </Term>
              <Term term="Two-phase commit">
                A protocol for committing a transaction across multiple nodes atomically: a
                &quot;prepare&quot; phase where all nodes vote, then a &quot;commit&quot; phase
                where all apply the change (or all abort).
              </Term>
            </dl>
          </div>

          <div id="U" style={letterGroupStyle}>
            <h2 style={letterH2Style}>U</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Upsert" first>
                A single database operation that inserts a row if it doesn&apos;t exist, or updates
                it if it does — avoids a separate check-then-write round trip.
              </Term>
              <Term term="UUID">
                A 128-bit identifier that&apos;s globally unique with extremely high probability
                without needing a central coordinator to assign it — common for distributed ID
                generation.
              </Term>
            </dl>
          </div>

          <div id="V" style={letterGroupStyle}>
            <h2 style={letterH2Style}>V</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Vertical scaling" first>
                Adding more resources (CPU, RAM) to a single machine rather than adding more
                machines. See <Link href="/pages/core-principles">Core Principles</Link>.
              </Term>
              <Term term="Vector clock">
                A mechanism for tracking causality between events across distributed nodes without
                relying on synchronized wall-clock time.
              </Term>
            </dl>
          </div>

          <div id="W" style={letterGroupStyle}>
            <h2 style={letterH2Style}>W</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Webhook" first>
                A server-to-server HTTP callback: instead of polling for an update, a service POSTs
                to a URL you registered the moment an event happens.
              </Term>
              <Term term="WebSocket">
                A protocol providing a persistent, full-duplex connection between client and server,
                used for real-time features like chat. See the{' '}
                <Link href="/pages/case-studies/whatsapp">WhatsApp case study</Link>.
              </Term>
              <Term term="Write-ahead log (WAL)">
                A durability technique where a change is written to an append-only log before
                it&apos;s applied to the main data structure, so a crash mid-write can be recovered
                from by replaying the log.
              </Term>
            </dl>
          </div>

          <div id="Z" style={letterGroupStyle}>
            <h2 style={letterH2Style}>Z</h2>
            <dl style={{ margin: 0 }}>
              <Term term="Zero-downtime deployment" first>
                A deployment strategy (e.g., rolling or blue-green) where new versions of a service
                replace old ones without any window of unavailability for users.
              </Term>
            </dl>
          </div>

          <PageNav
            prev={{ label: 'Latency Numbers', href: '/pages/reference/latency-numbers' }}
            next={{ label: 'Back to Reference', href: '/pages/reference' }}
          />
        </main>
      </div>

      <Footer
        sectionColumn={{
          title: 'Reference',
          links: [
            { label: 'Overview', href: '/pages/reference' },
            { label: 'Latency Numbers', href: '/pages/reference/latency-numbers' },
            { label: 'Glossary', href: '/pages/reference/glossary' },
          ],
        }}
      />
    </>
  );
}
