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
            { id: 'syllabus', label: 'The Full Journey' },
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
            it. This page lays out the full learning journey in the order most people actually study
            it — starting from the basics, through the topics that are unique to this section, ending
            with practice problems that pull everything together.
          </p>

          <section id="learn">
            <h2>What You&apos;ll Learn</h2>
            <p>
              18 stops, in the order below — some link to their own dedicated deep-dive elsewhere on
              this site (marked <span className="tag">HLD</span>, <span className="tag">Case Studies</span>,
              or <span className="tag">Reference</span>), most link to a page built specifically for
              this section (marked <span className="tag">Distributed Systems</span>). There&apos;s no
              requirement to go in order — jump straight to whatever&apos;s closest to your next
              interview — but if you&apos;re starting from zero, going top to bottom is the intended
              path.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/shared/distributed-systems-track.svg"
                alt="The full Distributed Systems learning journey, building on the HLD and Core Principles tracks"
              />
              <figcaption>One continuous journey — the topics unique to this section are woven in alongside the fundamentals they build on</figcaption>
            </figure>
          </section>

          <section id="syllabus">
            <h2>The Full Journey</h2>
            <ul className="syllabus">
              <li>
                <span className="num">1</span>
                <div>
                  <a className="topic-title" href="/pages/hld/fundamentals">Basics</a>
                  <span className="tag-row"><span className="tag">HLD</span></span>
                  <p>What is System Design, horizontal vs. vertical scaling, capacity estimation, HTTP, TCP/IP.</p>
                </div>
              </li>
              <li>
                <span className="num">2</span>
                <div>
                  <a className="topic-title" href="/pages/hld/load-balancing">Load Balancing</a>
                  <span className="tag-row"><span className="tag">HLD</span></span>
                  <p>Load balancing algorithms, consistent hashing, sharding.</p>
                </div>
              </li>
              <li>
                <span className="num">3</span>
                <div>
                  <a className="topic-title" href="/pages/hld/databases">DataStores</a>
                  <span className="tag-row"><span className="tag">HLD</span></span>
                  <p>Relational and NoSQL databases, replication, indexing.</p>
                </div>
              </li>
              <li>
                <span className="num">4</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/consistency-vs-availability">Consistency vs. Availability</a>
                  <span className="tag-row"><span className="tag">Distributed Systems</span></span>
                  <p>The CAP theorem in practice — strong vs. eventual consistency, causal and read-your-writes consistency, and transaction isolation levels.</p>
                </div>
              </li>
              <li>
                <span className="num">5</span>
                <div>
                  <a className="topic-title" href="/pages/hld/message-queues">Message Queues</a>
                  <span className="tag-row"><span className="tag">HLD</span></span>
                  <p>Publisher-subscriber model, event-driven basics.</p>
                </div>
              </li>
              <li>
                <span className="num">6</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/devops-concepts">DevOps Concepts</a>
                  <span className="tag-row"><span className="tag">Distributed Systems</span></span>
                  <p>Keeping a live system healthy — single points of failure, containers, service discovery, circuit breakers, bulkheads, monitoring, and chaos engineering.</p>
                </div>
              </li>
              <li>
                <span className="num">7</span>
                <div>
                  <a className="topic-title" href="/pages/hld/caching">Caching</a>
                  <span className="tag-row"><span className="tag">HLD</span></span>
                  <p>Distributed caching, CDNs, write and replacement policies.</p>
                </div>
              </li>
              <li>
                <span className="num">8</span>
                <div>
                  <a className="topic-title" href="/pages/hld/microservices">Microservices</a>
                  <span className="tag-row"><span className="tag">HLD</span></span>
                  <p>Microservices vs. monoliths, migration strategies.</p>
                </div>
              </li>
              <li>
                <span className="num">9</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/api-gateways">API Gateways</a>
                  <span className="tag-row"><span className="tag">Distributed Systems</span></span>
                  <p>The front door to your services — API gateway design, idempotency, rate limiting, and synchronous vs. asynchronous APIs.</p>
                </div>
              </li>
              <li>
                <span className="num">10</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/realtime-communication">Realtime Communication</a>
                  <span className="tag-row"><span className="tag">Distributed Systems</span></span>
                  <p>Talking to clients live — REST vs. GraphQL, WebSockets vs. long polling, WebRTC, and webhooks.</p>
                </div>
              </li>
              <li>
                <span className="num">11</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/authentication-mechanisms">Authentication Mechanisms</a>
                  <span className="tag-row"><span className="tag">Distributed Systems</span></span>
                  <p>Proving who someone is and controlling what they can do — OAuth 2.0, JWT vs. session-based auth, RBAC, and TLS.</p>
                </div>
              </li>
              <li>
                <span className="num">12</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/consensus-coordination">Consensus &amp; Leader Election</a>
                  <span className="tag-row"><span className="tag">Distributed Systems</span></span>
                  <p>How a cluster of independent nodes agrees on one truth — heartbeats, leader election, Raft/Paxos-style consensus, and gossip protocols.</p>
                </div>
              </li>
              <li>
                <span className="num">13</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/distributed-transactions">Distributed Transactions</a>
                  <span className="tag-row"><span className="tag">Distributed Systems</span></span>
                  <p>Keeping a logical transaction correct when it spans multiple services or databases — Two-Phase and Three-Phase Commit, the SAGA pattern, vector clocks, and CRDTs.</p>
                </div>
              </li>
              <li>
                <span className="num">14</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/big-data-processing">Big Data &amp; Streaming</a>
                  <span className="tag-row"><span className="tag">Distributed Systems</span></span>
                  <p>Processing data too large for one machine — batch vs. stream processing, ETL pipelines, MapReduce, and data lakes vs. data warehouses.</p>
                </div>
              </li>
              <li>
                <span className="num">15</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/architectural-patterns">System Architectures</a>
                  <span className="tag-row"><span className="tag">Distributed Systems</span></span>
                  <p>Choosing the overall shape of a system — serverless, event-driven architecture, and peer-to-peer, with a comparison back to client-server and microservices.</p>
                </div>
              </li>
              <li>
                <span className="num">16</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/system-design-tradeoffs">System Design Tradeoffs</a>
                  <span className="tag-row"><span className="tag">Distributed Systems</span></span>
                  <p>The trade-off dichotomies that come up in almost every interview — pull vs. push, memory vs. latency, throughput vs. latency, latency vs. accuracy, and SQL vs. NoSQL.</p>
                </div>
              </li>
              <li>
                <span className="num">17</span>
                <div>
                  <a className="topic-title" href="/pages/case-studies">Practice Problems</a>
                  <span className="tag-row"><span className="tag">Case Studies</span></span>
                  <p>Full system design walkthroughs — URL Shortener, Twitter, WhatsApp, Uber, Netflix — pulling the entire journey together.</p>
                </div>
              </li>
              <li>
                <span className="num">18</span>
                <div>
                  <a className="topic-title" href="/pages/reference">Additional Resources</a>
                  <span className="tag-row"><span className="tag">Reference</span></span>
                  <p>Latency numbers every engineer should know, and a glossary of terms.</p>
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
