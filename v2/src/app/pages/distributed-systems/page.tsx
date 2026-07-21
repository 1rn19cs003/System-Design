import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';

export const metadata = {
  title: 'Distributed Systems — System Design Architectures',
};

export default function DistributedSystemsHubPage() {
  return (
    <>
      <Header />
      <div className="layout">
        <TopicSidebar
          backHref="/"
          backLabel="Back to guide"
          toc={[
            { id: 'overview', label: 'Overview' },
            { id: 'learn', label: "What You'll Learn" },
            { id: 'syllabus', label: 'The 10 Topics' },
            { id: 'also-covered', label: 'Already Covered Elsewhere' },
          ]}
          jumpLinks={[
            { label: 'Consistency vs. Availability', href: '/pages/distributed-systems/consistency-vs-availability' },
            { label: 'Consensus & Leader Election', href: '/pages/distributed-systems/consensus-coordination' },
            { label: 'Distributed Transactions', href: '/pages/distributed-systems/distributed-transactions' },
            { label: 'DevOps Concepts', href: '/pages/distributed-systems/devops-concepts' },
            { label: 'API Gateways', href: '/pages/distributed-systems/api-gateways' },
            { label: 'Realtime Communication', href: '/pages/distributed-systems/realtime-communication' },
            { label: 'Authentication Mechanisms', href: '/pages/distributed-systems/authentication-mechanisms' },
            { label: 'Big Data & Streaming', href: '/pages/distributed-systems/big-data-processing' },
            { label: 'System Architectures', href: '/pages/distributed-systems/architectural-patterns' },
            { label: 'System Design Tradeoffs', href: '/pages/distributed-systems/system-design-tradeoffs' },
          ]}
        />

        <main className="content">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Distributed Systems' }]} />
          <h1 id="overview">Distributed Systems</h1>
          <p>
            Once a system spans more than one machine, a whole new class of problems shows up that
            single-server thinking never has to deal with: nodes disagreeing about the truth, network
            calls that time out silently, and one failing dependency dragging down everything around
            it. This section is the toolkit for exactly those problems — the concepts that separate a
            &quot;it works on my laptop&quot; design from one that survives real production traffic
            and real hardware failure. It builds directly on <a href="/pages/core-principles">Core
            Principles</a> and the <a href="/pages/hld">HLD</a> track, so if either of those still
            feel shaky, start there first.
          </p>

          <section id="learn">
            <h2>What You&apos;ll Learn</h2>
            <p>
              Ten focused topics, each named for what it actually is rather than how academic it
              sounds — no required order, so pick whatever&apos;s closest to your next interview, or
              work through all ten. A few closely related basics (load balancing, caching, message
              queues, and so on) already have their own deep-dive pages under HLD, so this section
              doesn&apos;t repeat them — see &quot;Already Covered Elsewhere&quot; below for direct
              links to those.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/shared/distributed-systems-track.svg"
                alt="Ten Distributed Systems topics, building on the HLD and Core Principles tracks"
              />
              <figcaption>No required order — pick the topic closest to your next interview, or work through all ten</figcaption>
            </figure>
          </section>

          <section id="syllabus">
            <h2>The 10 Topics</h2>
            <ul className="syllabus">
              <li>
                <span className="num">1</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/consistency-vs-availability">Consistency vs. Availability</a>
                  <p>The CAP theorem in practice — strong vs. eventual consistency, causal and read-your-writes consistency, and transaction isolation levels.</p>
                </div>
              </li>
              <li>
                <span className="num">2</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/consensus-coordination">Consensus &amp; Leader Election</a>
                  <p>How a cluster of independent nodes agrees on one truth — heartbeats, leader election, Raft/Paxos-style consensus, and gossip protocols.</p>
                </div>
              </li>
              <li>
                <span className="num">3</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/distributed-transactions">Distributed Transactions</a>
                  <p>Keeping a logical transaction correct when it spans multiple services or databases — Two-Phase and Three-Phase Commit, the SAGA pattern, vector clocks, and CRDTs.</p>
                </div>
              </li>
              <li>
                <span className="num">4</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/devops-concepts">DevOps Concepts</a>
                  <p>Keeping a live system healthy — single points of failure, containers, service discovery, circuit breakers, bulkheads, monitoring, and chaos engineering.</p>
                </div>
              </li>
              <li>
                <span className="num">5</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/api-gateways">API Gateways</a>
                  <p>The front door to your services — API gateway design, idempotency, rate limiting, and synchronous vs. asynchronous APIs.</p>
                </div>
              </li>
              <li>
                <span className="num">6</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/realtime-communication">Realtime Communication</a>
                  <p>Talking to clients live — REST vs. GraphQL, WebSockets vs. long polling, WebRTC, and webhooks.</p>
                </div>
              </li>
              <li>
                <span className="num">7</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/authentication-mechanisms">Authentication Mechanisms</a>
                  <p>Proving who someone is and controlling what they can do — OAuth 2.0, JWT vs. session-based auth, RBAC, and TLS.</p>
                </div>
              </li>
              <li>
                <span className="num">8</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/big-data-processing">Big Data &amp; Streaming</a>
                  <p>Processing data too large for one machine — batch vs. stream processing, ETL pipelines, MapReduce, and data lakes vs. data warehouses.</p>
                </div>
              </li>
              <li>
                <span className="num">9</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/architectural-patterns">System Architectures</a>
                  <p>Choosing the overall shape of a system — serverless, event-driven architecture, and peer-to-peer, with a comparison back to client-server and microservices.</p>
                </div>
              </li>
              <li>
                <span className="num">10</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/system-design-tradeoffs">System Design Tradeoffs</a>
                  <p>The trade-off dichotomies that come up in almost every interview — pull vs. push, memory vs. latency, throughput vs. latency, latency vs. accuracy, and SQL vs. NoSQL.</p>
                </div>
              </li>
            </ul>
          </section>

          <section id="also-covered">
            <h2>Already Covered Elsewhere</h2>
            <p>
              These fundamentals come up on most system design roadmaps, but this site already has a
              dedicated deep-dive page for each one under HLD (or another section) — rather than
              duplicate that content here, this is a direct shortcut to it.
            </p>
            <ul className="syllabus">
              <li>
                <span className="num">→</span>
                <div>
                  <a className="topic-title" href="/pages/hld/fundamentals">Basics</a>
                  <p>What is System Design, horizontal vs. vertical scaling, capacity estimation, HTTP, TCP/IP — see HLD Fundamentals.</p>
                </div>
              </li>
              <li>
                <span className="num">→</span>
                <div>
                  <a className="topic-title" href="/pages/hld/load-balancing">Load Balancing</a>
                  <p>Load balancing algorithms, consistent hashing, sharding — see HLD Load Balancing.</p>
                </div>
              </li>
              <li>
                <span className="num">→</span>
                <div>
                  <a className="topic-title" href="/pages/hld/databases">DataStores</a>
                  <p>Relational and NoSQL databases, replication, indexing — see HLD Databases.</p>
                </div>
              </li>
              <li>
                <span className="num">→</span>
                <div>
                  <a className="topic-title" href="/pages/hld/message-queues">Message Queues</a>
                  <p>Publisher-subscriber model, event-driven basics — see HLD Message Queues.</p>
                </div>
              </li>
              <li>
                <span className="num">→</span>
                <div>
                  <a className="topic-title" href="/pages/hld/caching">Caching</a>
                  <p>Distributed caching, CDNs, write and replacement policies — see HLD Caching.</p>
                </div>
              </li>
              <li>
                <span className="num">→</span>
                <div>
                  <a className="topic-title" href="/pages/hld/microservices">Microservices</a>
                  <p>Microservices vs. monoliths, migration strategies — see HLD Microservices.</p>
                </div>
              </li>
              <li>
                <span className="num">→</span>
                <div>
                  <a className="topic-title" href="/pages/case-studies">Practice Problems</a>
                  <p>Full system design walkthroughs (URL Shortener, Twitter, WhatsApp, Uber, Netflix) — see Case Studies.</p>
                </div>
              </li>
              <li>
                <span className="num">→</span>
                <div>
                  <a className="topic-title" href="/pages/reference">Additional Resources</a>
                  <p>Latency numbers every engineer should know, and a glossary of terms — see Reference.</p>
                </div>
              </li>
            </ul>
          </section>

          <PageNav
            prev={{ label: 'HLD Capstone', href: '/pages/hld/capstones' }}
            next={{ label: 'Start: Consistency vs. Availability', href: '/pages/distributed-systems/consistency-vs-availability' }}
          />
        </main>
      </div>

      <Footer
        sectionColumn={{
          title: 'Distributed Systems',
          links: [
            { label: 'Consistency vs. Availability', href: '/pages/distributed-systems/consistency-vs-availability' },
            { label: 'Consensus & Leader Election', href: '/pages/distributed-systems/consensus-coordination' },
            { label: 'DevOps Concepts', href: '/pages/distributed-systems/devops-concepts' },
            { label: 'System Design Tradeoffs', href: '/pages/distributed-systems/system-design-tradeoffs' },
          ],
        }}
      />
    </>
  );
}
