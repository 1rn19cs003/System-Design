import type { Metadata } from 'next';
import SidebarTOC from '@/components/SidebarTOC';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'System Design Glossary — Terms & Definitions',
  description: 'Definitions of 100+ key System Design, Distributed Systems, HLD & LLD terms.',
};

const glossaryTerms = [
  { term: 'ACID', def: 'Atomicity, Consistency, Isolation, Durability — properties guaranteeing database transactions are processed reliably.' },
  { term: 'BASE', def: 'Basically Available, Soft state, Eventual consistency — trade-off model common in distributed NoSQL databases.' },
  { term: 'CAP Theorem', def: 'States that a distributed data store can only simultaneously provide 2 out of 3 guarantees: Consistency, Availability, Partition Tolerance.' },
  { term: 'Circuit Breaker', def: 'Pattern preventing cascading failures by stopping requests to an unstable downstream service.' },
  { term: 'Consistent Hashing', def: 'Hashing technique that minimizes key remapping when servers are added or removed from a cluster.' },
  { term: 'Idempotency', def: 'Property where an operation can be applied multiple times without changing the result beyond the initial application (e.g. HTTP PUT/DELETE).' },
  { term: 'LRU Cache', def: 'Least Recently Used eviction policy that drops items that haven’t been accessed for the longest time.' },
  { term: 'Rate Limiting', def: 'Controlling network traffic rate to protect services from overload and DDoS attacks.' },
  { term: 'Sharding', def: 'Horizontal partitioning of a database table across multiple database instances.' },
  { term: 'Single Point of Failure (SPOF)', def: 'A part of a system that, if it fails, will stop the entire system from working.' },
];

const tocItems = [{ id: 'glossary-terms', label: 'Glossary Terms' }];

export default function GlossaryPage() {
  return (
    <div className="layout">
      <SidebarTOC backLink={{ href: '/', label: '← Back to guide' }} items={tocItems} />
      <main className="content">
        <Breadcrumbs items={[{ label: 'Reference', href: '/' }, { label: 'Glossary' }]} />

        <h1>System Design Glossary</h1>
        <p>Essential distributed systems and system architecture terminology.</p>

        <section id="glossary-terms">
          <h2>Terms &amp; Definitions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {glossaryTerms.map((item, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '16px',
                  background: '#fff',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--accent)', marginBottom: '4px' }}>
                  {item.term}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text)' }}>{item.def}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
