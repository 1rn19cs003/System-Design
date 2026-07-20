import type { Metadata } from 'next';
import SidebarTOC from '@/components/SidebarTOC';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Latency Numbers Every Computer Engineer Should Know',
  description: 'Peter Norvig / Jeff Dean latency numbers for L1 cache, RAM, SSD, and Network.',
};

const latencyData = [
  { operation: 'L1 cache reference', time: '0.5 ns', Human: '0.5s (1 heartbeat)' },
  { operation: 'Branch mispredict', time: '5 ns', Human: '5s' },
  { operation: 'L2 cache reference', time: '7 ns', Human: '7s' },
  { operation: 'Mutex lock/unlock', time: '25 ns', Human: '25s' },
  { operation: 'Main memory reference (RAM)', time: '100 ns', Human: '1.7 minutes' },
  { operation: 'Compress 1K bytes with ZStandard', time: '3,000 ns (3 µs)', Human: '50 minutes' },
  { operation: 'Send 2K bytes over 1 Gbps network', time: '20,000 ns (20 µs)', Human: '5.5 hours' },
  { operation: 'Read 1 MB sequentially from RAM', time: '250,000 ns (250 µs)', Human: '3 days' },
  { operation: 'SSD random read', time: '150,000 ns (150 µs)', Human: '1.7 days' },
  { operation: 'Read 1 MB sequentially from SSD', time: '1,000,000 ns (1 ms)', Human: '11.5 days' },
  { operation: 'Packet roundtrip within same datacenter', time: '500,000 ns (0.5 ms)', Human: '5.7 days' },
  { operation: 'Packet roundtrip CA to NY (USA)', time: '40,000,000 ns (40 ms)', Human: '1.2 years' },
  { operation: 'Packet roundtrip Netherlands to CA', time: '150,000,000 ns (150 ms)', Human: '4.7 years' },
];

const tocItems = [{ id: 'latency-table', label: 'Latency Comparison' }];

export default function LatencyNumbersPage() {
  return (
    <div className="layout">
      <SidebarTOC backLink={{ href: '/', label: '← Back to guide' }} items={tocItems} />
      <main className="content">
        <Breadcrumbs items={[{ label: 'Reference', href: '/' }, { label: 'Latency Numbers' }]} />

        <h1>Latency Numbers Every Engineer Should Know</h1>
        <p>Reference latency numbers (originally compiled by Jeff Dean) for hardware and network operations.</p>

        <section id="latency-table">
          <h2>Latency Comparison Table</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
              <thead>
                <tr style={{ background: 'var(--sidebar-bg)', textAlign: 'left' }}>
                  <th style={{ padding: '12px', border: '1px solid var(--border)' }}>Operation</th>
                  <th style={{ padding: '12px', border: '1px solid var(--border)' }}>Actual Time</th>
                  <th style={{ padding: '12px', border: '1px solid var(--border)' }}>Human Scaled Analogy</th>
                </tr>
              </thead>
              <tbody>
                {latencyData.map((row, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : 'var(--code-bg)' }}>
                    <td style={{ padding: '10px 12px', border: '1px solid var(--border)', fontWeight: 600 }}>
                      {row.operation}
                    </td>
                    <td style={{ padding: '10px 12px', border: '1px solid var(--border)', fontFamily: 'monospace' }}>
                      {row.time}
                    </td>
                    <td style={{ padding: '10px 12px', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                      {row.Human}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
