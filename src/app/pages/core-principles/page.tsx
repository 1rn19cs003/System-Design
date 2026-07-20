import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SidebarTOC from '@/components/SidebarTOC';
import Breadcrumbs from '@/components/Breadcrumbs';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata: Metadata = {
  title: 'Core Principles — System Design Architectures',
  description:
    'Scalability, reliability, and consistency models — the foundational trade-offs of system design.',
};

const tocItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'plain-english', label: 'In Plain English' },
  { id: 'theory', label: 'Theory & Diagrams' },
  { id: 'trade-offs', label: 'Trade-offs' },
  { id: 'real-world', label: 'Real-World Examples' },
  { id: 'interview-questions', label: 'Interview Questions' },
  { id: 'code', label: 'Code & Output' },
];

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
    output: `Single DB (no redundancy):
  System availability: 99.3011%
  Estimated downtime/year: 3673.4 minutes

Redundant DB pair (2x, independent):
  System availability: 99.7976%
  Estimated downtime/year: 1063.8 minutes

Redundancy cut yearly downtime by about 71%.`,
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
    output: `Single DB (no redundancy):
  System availability: 99.3011%
  Estimated downtime/year: 3673.4 minutes

Redundant DB pair (2x, independent):
  System availability: 99.7976%
  Estimated downtime/year: 1063.8 minutes

Redundancy cut yearly downtime by about 71%.`,
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
    output: `Single DB (no redundancy):
  System availability: 99.3011%
  Estimated downtime/year: 3673.4 minutes

Redundant DB pair (2x, independent):
  System availability: 99.7976%
  Estimated downtime/year: 1063.8 minutes

Redundancy cut yearly downtime by about 71%.`,
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
    output: `Single DB (no redundancy):
  System availability: 99.3011%
  Estimated downtime/year: 3673.4 minutes

Redundant DB pair (2x, independent):
  System availability: 99.7976%
  Estimated downtime/year: 1063.8 minutes

Redundancy cut yearly downtime by about 71%.`,
  },
};

export default function CorePrinciplesPage() {
  return (
    <div className="layout">
      <SidebarTOC backLink={{ href: '/', label: '← Back to guide' }} items={tocItems} />
      <main className="content">
        <Breadcrumbs items={[{ label: 'Core Principles' }]} />

        <h1 id="overview">Core Principles</h1>
        <p>
          Scalability, reliability, and consistency &mdash; the three ideas that show up, in some
          form, in every HLD topic and every LLD capstone in this guide.
        </p>

        <section id="plain-english">
          <h2>In Plain English</h2>
          <p>
            Three questions, asked about any system you build: can it handle more people
            (scalability)? does it keep working when something breaks (reliability)? and when data
            changes, do all the copies agree, and how quickly (consistency)?
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div className="callout" style={{ background: '#eef8f0', borderColor: '#bfe3c6' }}>
              <div style={{ fontWeight: 600, color: '#2f8f4e', marginBottom: '6px' }}>New to this? Start here</div>
              <p>
                Think of a single food stall that becomes a restaurant chain. <strong>Scaling</strong> is opening more locations. <strong>Reliability</strong> is having a backup chef. <strong>Consistency</strong> is making sure the menu price matches across all branches.
              </p>
            </div>
            <div className="callout" style={{ background: '#fdedec', borderColor: '#f3bcb8' }}>
              <div style={{ fontWeight: 600, color: '#c0392b', marginBottom: '6px' }}>Already comfortable? Push further</div>
              <p>
                The honest version has a trade-off attached: scaling costs coordination, reliability costs redundancy, and strong consistency costs availability during a network partition.
              </p>
            </div>
          </div>
        </section>

        <section id="theory">
          <h2>Theory &amp; Diagrams</h2>

          <h3>How this guide fits together</h3>
          <p>
            Before the theory, the map. This diagram shows every topic in this guide and one
            reasonable path through it.
          </p>

          <figure>
            <img
              className="diagram-img"
              src="/assets/core-principles/learning-path.svg"
              alt="Flowchart of System Design Learning Path"
            />
            <figcaption>Every topic in this guide, and the order they build on each other</figcaption>
          </figure>

          <h3>Scalability: vertical vs. horizontal</h3>
          <p>
            <strong>Vertical scaling</strong> means making one machine bigger (more CPU/RAM).{' '}
            <strong>Horizontal scaling</strong> means adding more machines behind a load balancer.
          </p>

          <figure>
            <img
              className="diagram-img"
              src="/assets/core-principles/scaling-diagram.svg"
              alt="Vertical vs Horizontal Scaling Diagram"
            />
            <figcaption>Same goal &mdash; handle more load &mdash; two different shapes of solution</figcaption>
          </figure>

          <h3>Reliability: redundancy and failover</h3>
          <p>
            A system is reliable if it keeps working when a part of it fails. The standard fix is
            redundancy: run more than one instance of anything that can fail.
          </p>

          <figure>
            <img
              className="diagram-img"
              src="/assets/core-principles/reliability-redundancy.svg"
              alt="Redundancy and Failover Diagram"
            />
            <figcaption>Redundancy turns server crash into a non-event</figcaption>
          </figure>

          <h3>Consistency models and the CAP theorem</h3>
          <p>
            <strong>Strong consistency</strong> means every read sees the most recent write.{' '}
            <strong>Eventual consistency</strong> means replicas briefly disagree but converge over time.
          </p>

          <figure>
            <img
              className="diagram-img"
              src="/assets/core-principles/cap-theorem.svg"
              alt="CAP Theorem Triangle"
            />
            <figcaption>Consistency vs Availability under network partition</figcaption>
          </figure>
        </section>

        <section id="trade-offs">
          <h2>Trade-offs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div className="callout" style={{ background: '#eef8f0', borderColor: '#bfe3c6' }}>
              <div style={{ fontWeight: 600, color: '#2f8f4e', marginBottom: '6px' }}>✓ Favor strong consistency when</div>
              <ul>
                <li>Correctness matters more than latency (bank balances, seat reservations).</li>
                <li>Stale reads cause visible business bugs (overselling stock).</li>
              </ul>
            </div>
            <div className="callout" style={{ background: '#fdedec', borderColor: '#f3bcb8' }}>
              <div style={{ fontWeight: 600, color: '#c0392b', marginBottom: '6px' }}>✕ Favor eventual consistency when</div>
              <ul>
                <li>A slightly stale read is harmless (like counts, social feeds).</li>
                <li>High availability across global regions is required.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="real-world">
          <h2>Real-World Examples</h2>
          <ul>
            <li><strong>Bank account balances</strong> &mdash; Strongly consistent by necessity.</li>
            <li><strong>Social media like counts</strong> &mdash; Eventually consistent.</li>
            <li><strong>DNS</strong> &mdash; Propagation over TTLs is designed eventual consistency.</li>
            <li><strong>Auto-scaling groups</strong> &mdash; Horizontal scaling in practice.</li>
          </ul>
        </section>

        <section id="interview-questions">
          <h2>Interview Questions</h2>
          <details className="qa" style={{ border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '12px', padding: '12px 16px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
              What&apos;s the difference between vertical and horizontal scaling?
            </summary>
            <p style={{ marginTop: '8px' }}>
              Vertical scaling adds CPU/RAM to a single box (has hard ceiling, single point of failure). Horizontal scaling adds multiple servers behind a load balancer (unbounded scale, fault-tolerant, requires state coordination).
            </p>
          </details>

          <details className="qa" style={{ border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '12px', padding: '12px 16px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
              Explain the CAP theorem in your own words.
            </summary>
            <p style={{ marginTop: '8px' }}>
              During a network partition, a distributed system must choose between Consistency (all nodes return latest data) and Availability (every request gets a non-error response, possibly stale). Partition tolerance is mandatory on real networks.
            </p>
          </details>
        </section>

        <section id="code">
          <h2>Code &amp; Output</h2>
          <p>
            This code calculates uptime availability across series and parallel database replicas.
          </p>
          <CodeTerminal snippets={snippets} defaultLang="java" />
        </section>
      </main>
    </div>
  );
}
