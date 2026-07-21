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
            { id: 'syllabus', label: 'The 7 Topics' },
          ]}
          jumpLinks={[
            { label: 'Consensus & Coordination', href: '/pages/distributed-systems/consensus-coordination' },
            { label: 'Distributed Transactions', href: '/pages/distributed-systems/distributed-transactions' },
            { label: 'Resilience Patterns', href: '/pages/distributed-systems/resilience-patterns' },
            { label: 'API & Communication', href: '/pages/distributed-systems/api-communication-patterns' },
            { label: 'Big Data Processing', href: '/pages/distributed-systems/big-data-processing' },
            { label: 'Architectural Patterns', href: '/pages/distributed-systems/architectural-patterns' },
            { label: 'Observability & Security', href: '/pages/distributed-systems/observability-security' },
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
              Seven topics, grouped by the kind of problem they solve: getting a cluster of nodes to
              agree on something, keeping a transaction correct across service boundaries, stopping
              one failure from becoming everyone&apos;s failure, designing APIs that survive retries
              and network flakiness, processing data at a scale no single machine can hold, choosing
              an overall architectural shape, and knowing your system is healthy (and who&apos;s
              allowed to touch it) once it&apos;s live.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/shared/distributed-systems-track.svg"
                alt="Seven topics: Consensus and Coordination, Distributed Transactions, Resilience Patterns, API and Communication, Big Data Processing, Architectural Patterns, and Observability and Security"
              />
              <figcaption>No required order — pick the topic closest to your next interview, or work through all seven</figcaption>
            </figure>
          </section>

          <section id="syllabus">
            <h2>The 7 Topics</h2>
            <ul className="syllabus">
              <li>
                <span className="num">1</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/consensus-coordination">Consensus &amp; Coordination</a>
                  <p>How a cluster of independent nodes agrees on one truth — heartbeats, leader election, Raft/Paxos-style consensus, and gossip protocols.</p>
                </div>
              </li>
              <li>
                <span className="num">2</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/distributed-transactions">Distributed Transactions &amp; State</a>
                  <p>Keeping a logical transaction correct when it spans multiple services or databases — Two-Phase and Three-Phase Commit, the SAGA pattern, vector clocks, and CRDTs.</p>
                </div>
              </li>
              <li>
                <span className="num">3</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/resilience-patterns">Resilience Patterns</a>
                  <p>Stopping one failing dependency from taking down the whole system — circuit breakers, the sidecar pattern, service mesh, and cascading-failure defenses.</p>
                </div>
              </li>
              <li>
                <span className="num">4</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/api-communication-patterns">API &amp; Communication Patterns</a>
                  <p>Designing APIs and protocols that survive retries and network flakiness — API gateways, idempotency, REST vs. GraphQL, WebSockets, WebRTC, and webhooks.</p>
                </div>
              </li>
              <li>
                <span className="num">5</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/big-data-processing">Big Data Processing</a>
                  <p>Processing data too large for one machine — batch vs. stream processing, ETL pipelines, MapReduce, and data lakes vs. data warehouses.</p>
                </div>
              </li>
              <li>
                <span className="num">6</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/architectural-patterns">Architectural Patterns</a>
                  <p>Choosing the overall shape of a system — serverless, event-driven architecture, and peer-to-peer, with a comparison back to client-server and microservices.</p>
                </div>
              </li>
              <li>
                <span className="num">7</span>
                <div>
                  <a className="topic-title" href="/pages/distributed-systems/observability-security">Observability &amp; Security</a>
                  <p>Knowing your system is healthy and controlling who can touch it — logging, monitoring, chaos engineering, OAuth/JWT, RBAC, and TLS.</p>
                </div>
              </li>
            </ul>
          </section>

          <PageNav
            prev={{ label: 'HLD Capstone', href: '/pages/hld/capstones' }}
            next={{ label: 'Start: Consensus & Coordination', href: '/pages/distributed-systems/consensus-coordination' }}
          />
        </main>
      </div>

      <Footer
        sectionColumn={{
          title: 'Distributed Systems',
          links: [
            { label: 'Consensus & Coordination', href: '/pages/distributed-systems/consensus-coordination' },
            { label: 'Resilience Patterns', href: '/pages/distributed-systems/resilience-patterns' },
            { label: 'Big Data Processing', href: '/pages/distributed-systems/big-data-processing' },
            { label: 'Observability & Security', href: '/pages/distributed-systems/observability-security' },
          ],
        }}
      />
    </>
  );
}
