import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';

export const metadata = {
  title: 'High-Level Design (HLD) — System Design Architectures',
};

export default function HldHubPage() {
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
            { label: 'Fundamentals', href: '/pages/hld/fundamentals' },
            { label: 'Load Balancing', href: '/pages/hld/load-balancing' },
            { label: 'Caching', href: '/pages/hld/caching' },
            { label: 'Databases', href: '/pages/hld/databases' },
            { label: 'Message Queues', href: '/pages/hld/message-queues' },
            { label: 'Microservices', href: '/pages/hld/microservices' },
            { label: 'Capstone', href: '/pages/hld/capstones' },
          ]}
        />

        <main className="content narrow">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'HLD' }]} />
          <h1 id="overview">High-Level Design (HLD)</h1>
          <p>
            HLD is the &quot;zoomed-out&quot; half of system design: how a request gets from a
            user to a working system and back, and how that system stays fast and available as
            traffic grows. This track has 7 topics, each building on the last, ending in a worked
            capstone.
          </p>

          <section id="learn">
            <h2>What You&apos;ll Learn</h2>
            <p>
              By the end of this track you&apos;ll be able to answer the question every system
              design interview starts with: &quot;walk me through what happens when a user hits
              this system,&quot; and back it up with real trade-offs at each step — not just
              name-dropping &quot;load balancer&quot; or &quot;cache,&quot; but knowing why and
              when each one earns its complexity.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/shared/hld-track.svg"
                alt="HLD syllabus flowchart: Fundamentals, Load Balancing, Caching, Databases, Message Queues, Microservices, then a Rate Limiter capstone"
              />
              <figcaption>Seven topics, one order — each assumes you&apos;ve read the ones before it</figcaption>
            </figure>
          </section>

          <section id="syllabus">
            <h2>The 7 Topics</h2>
            <ul className="syllabus">
              <li>
                <span className="num">1</span>
                <div>
                  <a className="topic-title" href="/pages/hld/fundamentals">Fundamentals</a>
                  <p>The client-server model, DNS, HTTP, and latency vs. throughput — the vocabulary every other HLD topic assumes you already have.</p>
                </div>
              </li>
              <li>
                <span className="num">2</span>
                <div>
                  <a className="topic-title" href="/pages/hld/load-balancing">Load Balancing</a>
                  <p>Once one server isn&apos;t enough, how do you spread traffic across many without any single one becoming the new bottleneck?</p>
                </div>
              </li>
              <li>
                <span className="num">3</span>
                <div>
                  <a className="topic-title" href="/pages/hld/caching">Caching</a>
                  <p>The cheapest way to make a system faster: don&apos;t redo work you already did. Where caches live, and what happens when they&apos;re wrong.</p>
                </div>
              </li>
              <li>
                <span className="num">4</span>
                <div>
                  <a className="topic-title" href="/pages/hld/databases">Databases</a>
                  <p>SQL vs. NoSQL, replication, and sharding — how the system&apos;s actual data survives growth and failure.</p>
                </div>
              </li>
              <li>
                <span className="num">5</span>
                <div>
                  <a className="topic-title" href="/pages/hld/message-queues">Message Queues</a>
                  <p>Decoupling services in time — so a slow or failed downstream service doesn&apos;t take the whole request down with it.</p>
                </div>
              </li>
              <li>
                <span className="num">6</span>
                <div>
                  <a className="topic-title" href="/pages/hld/microservices">Microservices</a>
                  <p>Splitting one system into many services on purpose — and the very real coordination cost that comes with it.</p>
                </div>
              </li>
              <li>
                <span className="num" style={{ background: 'var(--accent)', color: '#fff' }}>★</span>
                <div>
                  <a className="topic-title" href="/pages/hld/capstones">Capstone: Rate Limiter</a>
                  <p>A worked, timed example that pulls the previous six topics together into one interview-shaped design problem.</p>
                </div>
              </li>
            </ul>
          </section>

          <PageNav
            prev={{ label: 'Core Principles', href: '/pages/core-principles' }}
            next={{ label: 'Start: Fundamentals', href: '/pages/hld/fundamentals' }}
          />
        </main>
      </div>

      <Footer
        sectionColumn={{
          title: 'HLD',
          links: [
            { label: 'Fundamentals', href: '/pages/hld/fundamentals' },
            { label: 'Load Balancing', href: '/pages/hld/load-balancing' },
            { label: 'Caching', href: '/pages/hld/caching' },
            { label: 'Capstones', href: '/pages/hld/capstones' },
          ],
        }}
      />
    </>
  );
}
