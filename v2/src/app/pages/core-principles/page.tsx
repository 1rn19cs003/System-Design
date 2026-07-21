import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Core Principles — System Design Architectures',
};

const OUTPUT = `Single DB (no redundancy):
  System availability: 99.3011%
  Estimated downtime/year: 3673.4 minutes

Redundant DB pair (2x, independent):
  System availability: 99.7976%
  Estimated downtime/year: 1063.8 minutes

Redundancy cut yearly downtime by about 71%.`;

const snippets = {
  java: {
    code: `public class Reliability {

    public static void main(String[] args) {
        double web = 0.999;
        double db = 0.995;
        double cache = 0.999;
        double minutesPerYear = 525600.0;

        double seriesAvail = web * db * cache;
        double downtimeSeries = (1 - seriesAvail) * minutesPerYear;

        double redundantDb = 1 - (1 - db) * (1 - db);
        double newAvail = web * redundantDb * cache;
        double downtimeNew = (1 - newAvail) * minutesPerYear;

        double reductionPct = (downtimeSeries - downtimeNew) / downtimeSeries * 100;

        System.out.println("Single DB (no redundancy):");
        System.out.printf("  System availability: %.4f%%%n", seriesAvail * 100);
        System.out.printf("  Estimated downtime/year: %.1f minutes%n", downtimeSeries);
        System.out.println();
        System.out.println("Redundant DB pair (2x, independent):");
        System.out.printf("  System availability: %.4f%%%n", newAvail * 100);
        System.out.printf("  Estimated downtime/year: %.1f minutes%n", downtimeNew);
        System.out.println();
        System.out.printf("Redundancy cut yearly downtime by about %.0f%%.%n", reductionPct);
    }
}`,
    output: OUTPUT,
  },
  python: {
    code: `web = 0.999
db = 0.995
cache = 0.999
minutes_per_year = 525600.0

series_avail = web * db * cache
downtime_series = (1 - series_avail) * minutes_per_year

redundant_db = 1 - (1 - db) * (1 - db)
new_avail = web * redundant_db * cache
downtime_new = (1 - new_avail) * minutes_per_year

reduction_pct = (downtime_series - downtime_new) / downtime_series * 100

print("Single DB (no redundancy):")
print(f"  System availability: {series_avail * 100:.4f}%")
print(f"  Estimated downtime/year: {downtime_series:.1f} minutes")
print()
print("Redundant DB pair (2x, independent):")
print(f"  System availability: {new_avail * 100:.4f}%")
print(f"  Estimated downtime/year: {downtime_new:.1f} minutes")
print()
print(f"Redundancy cut yearly downtime by about {reduction_pct:.0f}%.")`,
    output: OUTPUT,
  },
  javascript: {
    code: `const web = 0.999;
const db = 0.995;
const cache = 0.999;
const minutesPerYear = 525600.0;

const seriesAvail = web * db * cache;
const downtimeSeries = (1 - seriesAvail) * minutesPerYear;

const redundantDb = 1 - (1 - db) * (1 - db);
const newAvail = web * redundantDb * cache;
const downtimeNew = (1 - newAvail) * minutesPerYear;

const reductionPct = (downtimeSeries - downtimeNew) / downtimeSeries * 100;

console.log("Single DB (no redundancy):");
console.log(\`  System availability: \${(seriesAvail * 100).toFixed(4)}%\`);
console.log(\`  Estimated downtime/year: \${downtimeSeries.toFixed(1)} minutes\`);
console.log();
console.log("Redundant DB pair (2x, independent):");
console.log(\`  System availability: \${(newAvail * 100).toFixed(4)}%\`);
console.log(\`  Estimated downtime/year: \${downtimeNew.toFixed(1)} minutes\`);
console.log();
console.log(\`Redundancy cut yearly downtime by about \${reductionPct.toFixed(0)}%.\`);`,
    output: OUTPUT,
  },
  cpp: {
    code: `#include <iostream>
#include <iomanip>

int main() {
    double web = 0.999;
    double db = 0.995;
    double cache = 0.999;
    double minutesPerYear = 525600.0;

    double seriesAvail = web * db * cache;
    double downtimeSeries = (1 - seriesAvail) * minutesPerYear;

    double redundantDb = 1 - (1 - db) * (1 - db);
    double newAvail = web * redundantDb * cache;
    double downtimeNew = (1 - newAvail) * minutesPerYear;

    double reductionPct = (downtimeSeries - downtimeNew) / downtimeSeries * 100;

    std::cout << std::fixed;
    std::cout << "Single DB (no redundancy):" << std::endl;
    std::cout << "  System availability: " << std::setprecision(4) << seriesAvail * 100 << "%" << std::endl;
    std::cout << "  Estimated downtime/year: " << std::setprecision(1) << downtimeSeries << " minutes" << std::endl;
    std::cout << std::endl;
    std::cout << "Redundant DB pair (2x, independent):" << std::endl;
    std::cout << "  System availability: " << std::setprecision(4) << newAvail * 100 << "%" << std::endl;
    std::cout << "  Estimated downtime/year: " << std::setprecision(1) << downtimeNew << " minutes" << std::endl;
    std::cout << std::endl;
    std::cout << "Redundancy cut yearly downtime by about " << std::setprecision(0) << reductionPct << "%." << std::endl;
    return 0;
}`,
    output: OUTPUT,
  },
};

const qaItems = [
  {
    q: "What's the difference between vertical and horizontal scaling, and when would you choose one over the other?",
    a: "Vertical scaling adds resources (CPU, RAM) to one machine — simple, no architecture changes, but bounded by the largest machine available and still a single point of failure. Horizontal scaling adds more machines behind a load balancer — effectively unbounded and fault-tolerant, but requires the application to handle shared or replicated state instead of relying on one process's memory. Early-stage systems often start vertical for simplicity and move horizontal once load or reliability requirements demand it.",
  },
  {
    q: 'Explain the CAP theorem in your own words.',
    a: "In a distributed system, when a network partition occurs (some nodes can't communicate with others), you must choose between consistency (every node returns the same, most up-to-date data) and availability (every request gets a response, even if it might be stale). Partition tolerance isn't optional on a real network, so CAP is really about what a system does during a partition: refuse some requests to stay consistent, or answer everything and risk returning stale data.",
  },
  {
    q: 'What does "99.99% availability" actually mean, and why is each additional nine harder to get?',
    a: 'It means the system is expected to be down no more than about 52.6 minutes per year (0.01% of ~525,600 minutes). Each additional nine (99.9% → 99.99% → 99.999%) reduces allowed downtime by roughly 10x, which usually requires disproportionately more redundancy, automation, and operational maturity — the cost doesn\'t scale linearly with the number of nines.',
  },
  {
    q: "How does redundancy improve reliability, and what's the catch?",
    a: 'Running multiple independent instances of a component means one instance failing doesn\'t take down the whole system, especially if a load balancer or health check automatically routes around the failed instance. The catch: redundancy only helps against independent failures — if all instances share a single dependency (one database, one power source, one region), that shared dependency is still a single point of failure, and redundancy adds cost and coordination complexity (e.g., keeping replicas in sync).',
  },
  {
    q: "Give an example of a system that intentionally chooses eventual consistency, and explain why that's the right call.",
    a: "DNS is a good example: when a DNS record changes, it can take minutes to hours to propagate everywhere because of caching (TTLs). This is intentional — DNS needs to be extremely available and fast to look up, and the cost of that is that changes aren't seen instantly everywhere. For DNS's use case, a briefly stale answer is far less costly than making every lookup wait for global agreement.",
  },
];

export default function CorePrinciplesPage() {
  return (
    <>
      <Header />
      <div className="layout">
        <TopicSidebar
          backHref="/"
          backLabel="Back to guide"
          toc={[
            { id: 'overview', label: 'Overview' },
            { id: 'plain-english', label: 'In Plain English' },
            { id: 'theory', label: 'Theory & Diagrams' },
            { id: 'trade-offs', label: 'Trade-offs' },
            { id: 'real-world', label: 'Real-World Examples' },
            { id: 'interview-questions', label: 'Interview Questions' },
            { id: 'code', label: 'Code & Output' },
          ]}
        />

        <main className="content narrow">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Core Principles' }]} />
          <h1 id="overview">Core Principles</h1>
          <p>
            Scalability, reliability, and consistency — the three ideas that show up, in some form,
            in every HLD topic and every LLD capstone in this guide. This page also lays out the
            full map of what&apos;s here and one sensible order to learn it in.
          </p>

          <section id="plain-english">
            <h2>In Plain English</h2>
            <p>
              Three questions, asked about any system you build: can it handle more people
              (scalability)? does it keep working when something breaks (reliability)? and when
              data changes, do all the copies agree, and how quickly (consistency)? Everything else
              in HLD is really answering one of these three questions in more detail.
            </p>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  Think of a single food stall that becomes a restaurant chain. <strong>Scaling</strong>{' '}
                  is opening more locations. <strong>Reliability</strong> is having a backup chef so
                  one sick day doesn&apos;t close a branch. <strong>Consistency</strong> is making sure
                  the menu price you saw online matches what every branch actually charges today.
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  The honest version of each question has a trade-off attached: scaling costs
                  coordination, reliability costs redundancy (money), and strong consistency costs
                  availability during a network partition. Naming the trade-off, not just the
                  concept, is what separates a fresher answer from a senior one.
                </p>
              </Callout>
            </TwoCol>
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>

            <h3>How this guide fits together</h3>
            <p>
              Before the theory, the map. This diagram shows every topic in this guide and one
              reasonable path through it — start at Core Principles, then follow the HLD track and
              the LLD track (in either order, or interleaved), and both converge on a capstone that
              ties the whole thing together.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/core-principles/learning-path.svg"
                alt="Flowchart: Core Principles feeds an HLD track (Fundamentals, Load Balancing, Caching, Databases, Message Queues, Microservices) and an LLD track (OOP Fundamentals, SOLID Principles, then Creational, Structural, and Behavioral design patterns), both converging on an LLD capstone (Parking Lot) and an HLD capstone (Rate Limiter)"
              />
              <figcaption>Every topic in this guide, and the order they build on each other</figcaption>
            </figure>

            <h3>Scalability: vertical vs. horizontal</h3>
            <p>
              <strong>Vertical scaling</strong> means making one machine bigger — more CPU, more RAM.
              It&apos;s simple (no code changes) but has a hard ceiling (there&apos;s a biggest
              machine money can buy) and doesn&apos;t fix the single-point-of-failure problem.{' '}
              <strong>Horizontal scaling</strong> means adding more machines of the same size behind
              a load balancer. It has effectively no ceiling, but now the system has to handle state
              that&apos;s shared or replicated across machines instead of living in one process&apos;s
              memory.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/core-principles/scaling-diagram.svg"
                alt="Side by side: vertical scaling shown as one box growing from 2 CPU to 32 CPU, versus horizontal scaling shown as three same-sized servers behind a load balancer"
              />
              <figcaption>Same goal — handle more load — two different shapes of solution</figcaption>
            </figure>

            <TwoCol>
              <Callout kind="good" title="✓ Reach for vertical scaling when">
                <p>
                  The system is early-stage, the codebase assumes a single process (e.g., an
                  in-memory cache or a monolith with local state), or the team&apos;s priority is
                  shipping fast, not maximum scale.
                </p>
              </Callout>
              <Callout kind="bad" title="✕ Its limits show up when">
                <p>
                  Load exceeds what any single machine can serve, or the business needs zero-downtime
                  deploys and failover — a single box can&apos;t do either no matter how large it
                  gets.
                </p>
              </Callout>
            </TwoCol>

            <h3>Reliability: redundancy and failover</h3>
            <p>
              A system is reliable if it keeps working when a part of it fails — not if it never
              fails, which is unrealistic at scale. The standard fix is redundancy: run more than one
              of anything that can fail, and put something in front of it (a load balancer, a
              leader-election process) that detects a failure and routes around it automatically.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/core-principles/reliability-redundancy.svg"
                alt="Side by side: a single server as a single point of failure, versus two servers behind a health-checking load balancer where traffic shifts to the standby if the active one fails"
              />
              <figcaption>Redundancy turns &quot;the server crashed&quot; from an outage into a non-event</figcaption>
            </figure>

            <p>
              Reliability is usually talked about in terms of <strong>availability</strong> — the
              fraction of time a system is usable, often written as a string of nines (99.9%, 99.99%,
              and so on). Each additional nine is an order of magnitude less allowed downtime per
              year, and gets progressively more expensive to achieve.
            </p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>
                  Combine redundancy with automated health checks — redundant servers only help if
                  something is actually watching them and re-routing traffic within seconds, not
                  minutes.
                </p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>
                  Adding a second server but keeping a single shared database with no replica — that
                  database is still one unhandled failure away from the same outage.
                </p>
              </Callout>
            </TwoCol>

            <h3>Consistency models and the CAP theorem</h3>
            <p>
              <strong>Strong consistency</strong> means every read sees the most recent write,
              everywhere, immediately — simple to reason about, but it requires coordination between
              replicas on every write, which costs latency and can block reads during a network
              issue. <strong>Eventual consistency</strong> means replicas are allowed to briefly
              disagree after a write, but will converge given enough time with no new writes — faster
              and more available, at the cost of occasionally reading stale data.
            </p>

            <p>
              The CAP theorem formalizes the trade-off: during a network partition (some nodes
              can&apos;t reach others — and on a real network, this <em>will</em> happen), a system
              can guarantee <strong>C</strong>onsistency or <strong>A</strong>vailability, but not
              both. Partition tolerance isn&apos;t really a choice you get to opt out of, so CAP in
              practice is a choice between C and A when things go wrong.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/core-principles/cap-theorem.svg"
                alt="CAP triangle with Consistency, Availability, and Partition tolerance at the corners, and a note that partition tolerance is mandatory so the real choice is between consistency and availability"
              />
              <figcaption>You don&apos;t pick two out of three in the abstract — you pick C or A the moment a partition actually happens</figcaption>
            </figure>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Favor strong consistency when">
                <ul>
                  <li>Correctness matters more than latency — bank balances, inventory counts, seat reservations.</li>
                  <li>Stale reads would cause a real, visible problem (double-booking a seat, overselling the last item in stock).</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Favor eventual consistency when">
                <ul>
                  <li>A slightly stale read is harmless — a social media like count, a view counter, a recommendation feed.</li>
                  <li>The system needs to stay available even when some replicas are unreachable (global, multi-region systems).</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that you don&apos;t treat
              &quot;scale it up,&quot; &quot;make it reliable,&quot; and &quot;keep it consistent&quot;
              as free — that each one is a trade against something else (cost, complexity, latency,
              or availability), and that you can name which trade-off applies to the specific system
              in the question.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to define scalability,
              reliability, and consistency in one sentence each, with a real-world example, clears
              the bar for most entry-level system design conversations.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> you should be able to say which model
              (strong or eventual) a system you&apos;ve actually worked on uses, why, and what would
              break if it used the other one.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Bank account balances</strong> — strongly consistent by necessity; an eventually-consistent balance could let someone overdraw an account before the system notices.</li>
              <li><strong>Social media like/view counts</strong> — eventually consistent; a like count that&apos;s a few seconds stale costs nothing, and the availability trade-off is worth it at that scale.</li>
              <li><strong>DNS</strong> — a real-world eventually consistent system: a record change propagates over minutes to hours as caches expire, and that&apos;s an accepted, designed-for trade-off.</li>
              <li><strong>Cloud auto-scaling groups</strong> — horizontal scaling in practice: identical server instances added or removed behind a load balancer based on current traffic.</li>
              <li><strong>Multi-AZ database deployments</strong> — reliability in practice: a standby replica in a different data center takes over automatically if the primary&apos;s entire data center goes down.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>
              This demo puts a number on &quot;redundancy improves reliability.&quot; It models a
              simple system made of three components in series (a web tier, a database tier, and a
              cache tier, each with an independent uptime probability), computes the overall
              availability when all three must be up, then adds a second, independent database
              replica in parallel and recomputes. Pure arithmetic on fixed probabilities —
              deterministic, identical output in every language.
            </p>
            <CodeTerminal snippets={snippets} />
          </section>

          <PageNav
            prev={{ label: 'Home', href: '/' }}
            next={{ label: 'HLD Fundamentals', href: '/pages/hld/fundamentals' }}
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
