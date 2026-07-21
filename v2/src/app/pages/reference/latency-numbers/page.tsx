import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';

export const metadata = {
  title: 'Numbers Every Engineer Should Know — System Design Architectures',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  margin: '10px 0 20px',
  fontSize: 14,
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '9px 12px',
  borderBottom: '1px solid var(--border)',
  fontSize: 11.5,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--muted)',
  fontWeight: 600,
};

const thNumStyle: React.CSSProperties = { ...thStyle, textAlign: 'right' };

const tdStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '9px 12px',
  borderBottom: '1px solid var(--border)',
};

const tdNumStyle: React.CSSProperties = {
  ...tdStyle,
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
};

const qaItems = [
  {
    q: "Why does the gap between memory and disk matter more than the gap between L1 and L2 cache, even though both are \"slower vs. faster\"?",
    a: 'Magnitude. L1 to L2 is roughly a 14× difference (0.5 ns to 7 ns) — both are effectively instant from an application’s perspective. Memory to disk is roughly a 100,000× difference (100 ns to 10 ms) — that gap is large enough to be the dominant cost in almost any request path that touches disk, which is exactly why caching (keeping hot data in memory) is one of the highest-leverage optimizations in system design.',
  },
  {
    q: "You're told a service handles 50 million requests per day. Walk through estimating the servers needed.",
    a: '50M requests / ~86,400 seconds/day ≈ ~580 average QPS. Assume peak is 2–3× average ≈ ~1,200–1,700 peak QPS. If a single app server handles ~2,000 QPS for this workload, roughly 1 server covers peak load with no headroom — so in practice you’d provision 2–3 servers behind a load balancer for redundancy and headroom, not just raw peak capacity.',
  },
  {
    q: 'How would you estimate storage needs for a system storing 10 million user profiles, each about 2 KB?',
    a: '10,000,000 × 2 KB = 20,000,000 KB = 20 GB of raw data. Add index overhead (commonly 20–50% more) and replication (commonly 2–3 copies for durability), and a realistic planning number lands somewhere around 60–100 GB total — comfortably within a single modern database cluster, which is the kind of quick math that tells you this part of the design doesn’t need special-case sharding yet.',
  },
  {
    q: 'Why is "read 4 KB randomly from SSD" listed separately from "read 1 MB sequentially from SSD," and why does the random read take longer for less data?',
    a: 'Random reads pay a seek/lookup cost for each access regardless of how little data is requested, while sequential reads amortize that cost across a large contiguous block. This is the same reason indexes and B-trees matter for databases: they turn what would be many small random lookups into fewer, more sequential-friendly accesses.',
  },
  {
    q: 'A teammate says "let\'s just add more cache" to fix high latency. What follow-up questions test whether that\'s the right call?',
    a: 'What’s the current cache hit rate, and where is the miss going (memory, SSD, disk, or a cross-region network call)? A miss that falls back to another datacenter (hundreds of microseconds) is a very different problem from one that falls back to a cross-continent call (hundreds of milliseconds) — the fix (more cache, a closer replica, or a smarter query) depends entirely on which layer the miss is actually hitting.',
  },
];

export default function LatencyNumbersPage() {
  return (
    <>
      <Header />
      <div className="layout">
        <TopicSidebar
          backHref="/pages/reference"
          backLabel="Back to Reference"
          toc={[
            { id: 'overview', label: 'Overview' },
            { id: 'latency-ladder', label: 'The Latency Ladder' },
            { id: 'human-scale', label: 'Human-Scale Comparison' },
            { id: 'throughput', label: 'Throughput & Capacity Numbers' },
            { id: 'storage', label: 'Storage & Size Conversions' },
            { id: 'using-it', label: 'Using These In an Interview' },
            { id: 'interview-questions', label: 'Interview Questions' },
          ]}
        />

        <main className="content">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Reference', href: '/pages/reference' },
              { label: 'Latency Numbers' },
            ]}
          />
          <h1 id="overview">Numbers Every Engineer Should Know</h1>
          <p>
            Every &quot;why did you choose X over Y&quot; question in a system design interview
            eventually comes down to a number: how much slower is a disk than memory, how many
            requests per second can one server actually handle, how big is a million rows. These are
            the reference numbers — approximate, order-of-magnitude, and more than accurate enough to
            reason with on a whiteboard.
          </p>

          <section id="latency-ladder">
            <h2>The Latency Ladder</h2>
            <p>
              This table (based on the numbers popularized by Jeff Dean at Google, still the standard
              reference used in interviews) shows the cost of moving data at each layer of the stack,
              from an on-chip cache reference to a network round trip to another continent.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/reference/latency-ladder.svg"
                alt="Latency ladder bar chart from L1 cache reference (0.5 ns) through main memory (100 ns), SSD reads (150 microseconds to 1 millisecond), disk seek (10 milliseconds), to a cross-continent network round trip (150 milliseconds)"
              />
              <figcaption>Six orders of magnitude separate an in-memory operation from a cross-continent network call</figcaption>
            </figure>

            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={thStyle}>Operation</th>
                  <th style={thNumStyle}>Approx. latency</th>
                </tr>
                <tr>
                  <td style={tdStyle}>L1 cache reference</td>
                  <td style={tdNumStyle}><code>0.5 ns</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Branch mispredict</td>
                  <td style={tdNumStyle}><code>5 ns</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>L2 cache reference</td>
                  <td style={tdNumStyle}><code>7 ns</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Mutex lock/unlock</td>
                  <td style={tdNumStyle}><code>25 ns</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Main memory reference</td>
                  <td style={tdNumStyle}><code>100 ns</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Compress 1 KB with a fast compressor</td>
                  <td style={tdNumStyle}><code>3 µs</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Send 1 KB over a 1 Gbps network</td>
                  <td style={tdNumStyle}><code>10 µs</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Read 4 KB randomly from SSD</td>
                  <td style={tdNumStyle}><code>150 µs</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Read 1 MB sequentially from memory</td>
                  <td style={tdNumStyle}><code>250 µs</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Round trip within the same datacenter</td>
                  <td style={tdNumStyle}><code>500 µs</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Read 1 MB sequentially from SSD</td>
                  <td style={tdNumStyle}><code>1 ms</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Disk seek</td>
                  <td style={tdNumStyle}><code>10 ms</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Read 1 MB sequentially from spinning disk</td>
                  <td style={tdNumStyle}><code>20 ms</code></td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, borderBottom: 'none' }}>Send packet CA → Netherlands → CA</td>
                  <td style={{ ...tdNumStyle, borderBottom: 'none' }}><code>150 ms</code></td>
                </tr>
              </tbody>
            </table>

            <TwoCol>
              <Callout kind="good" title="✓ The one thing to remember">
                <p>
                  Everything before &quot;read 4 KB randomly from SSD&quot; is nanoseconds and
                  effectively free. Everything from there down is microseconds to milliseconds — a
                  gap of roughly a million times. That gap is why caching, indexing, and avoiding
                  unnecessary network hops matter more than almost any other optimization.
                </p>
              </Callout>
              <Callout kind="bad" title="✕ Don't over-trust exact values">
                <p>
                  Modern NVMe SSDs and 10/25/100 Gbps datacenter networks beat several of these
                  classic numbers today (SSD random reads can be well under 50 µs). Treat the table
                  as relative order-of-magnitude truth, not a literal spec sheet for current hardware.
                </p>
              </Callout>
            </TwoCol>
          </section>

          <section id="human-scale">
            <h2>Human-Scale Comparison</h2>
            <p>
              The raw nanosecond numbers are hard to feel intuitively, so stretch them: if an L1
              cache reference (0.5 ns) took <strong>1 second</strong>, here&apos;s how long
              everything else would take at that same scale.
            </p>

            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={thStyle}>Operation</th>
                  <th style={thNumStyle}>At human scale</th>
                </tr>
                <tr>
                  <td style={tdStyle}>L1 cache reference</td>
                  <td style={tdNumStyle}><code>1 second</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>L2 cache reference</td>
                  <td style={tdNumStyle}><code>14 seconds</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Main memory reference</td>
                  <td style={tdNumStyle}><code>~3.3 minutes</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Compress 1 KB</td>
                  <td style={tdNumStyle}><code>~1.7 hours</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Send 1 KB over 1 Gbps network</td>
                  <td style={tdNumStyle}><code>~5.6 hours</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Read 4 KB randomly from SSD</td>
                  <td style={tdNumStyle}><code>~3.5 days</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Round trip within the datacenter</td>
                  <td style={tdNumStyle}><code>~11.6 days</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Read 1 MB sequentially from SSD</td>
                  <td style={tdNumStyle}><code>~23 days</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Disk seek</td>
                  <td style={tdNumStyle}><code>~7.6 months</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Read 1 MB sequentially from disk</td>
                  <td style={tdNumStyle}><code>~1.3 years</code></td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, borderBottom: 'none' }}>Packet to Netherlands and back</td>
                  <td style={{ ...tdNumStyle, borderBottom: 'none' }}><code>~9.5 years</code></td>
                </tr>
              </tbody>
            </table>
            <p>
              Put another way: if reading from your CPU&apos;s cache is a one-second glance across
              the room, a disk seek is going on an eight-month expedition, and a round trip across
              the Atlantic is most of a decade. That&apos;s the intuition to carry into any design
              discussion about where to put a cache.
            </p>
          </section>

          <section id="throughput">
            <h2>Throughput &amp; Capacity Numbers</h2>
            <p>
              Rules of thumb for the back-of-envelope math interviewers expect during capacity
              estimation — enough precision to reason about order of magnitude, not enough to be
              mistaken for a benchmark.
            </p>

            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={thStyle}>Quantity</th>
                  <th style={thNumStyle}>Rule of thumb</th>
                </tr>
                <tr>
                  <td style={tdStyle}>Seconds in a day</td>
                  <td style={tdNumStyle}><code>~86,400 (round to 100,000)</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Seconds in a month</td>
                  <td style={tdNumStyle}><code>~2.6 million</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>1M requests/day, average QPS</td>
                  <td style={tdNumStyle}><code>~12 QPS</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Peak QPS vs. average QPS</td>
                  <td style={tdNumStyle}><code>2–3× average, typically</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Single app server, simple cached reads</td>
                  <td style={tdNumStyle}><code>~1,000–10,000 QPS</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Single relational DB node, indexed reads</td>
                  <td style={tdNumStyle}><code>~1,000–5,000 QPS</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Single relational DB node, writes</td>
                  <td style={tdNumStyle}><code>~100s–low 1,000s QPS</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Read:write ratio, typical read-heavy app</td>
                  <td style={tdNumStyle}><code>100:1 or higher</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>CDN offload for static/cacheable content</td>
                  <td style={tdNumStyle}><code>often &gt;90% of requests</code></td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, borderBottom: 'none' }}>Capacity headroom to design for</td>
                  <td style={{ ...tdNumStyle, borderBottom: 'none' }}><code>2–3× estimated peak</code></td>
                </tr>
              </tbody>
            </table>
          </section>

          <section id="storage">
            <h2>Storage &amp; Size Conversions</h2>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={thStyle}>Unit / object</th>
                  <th style={thNumStyle}>Approx. size</th>
                </tr>
                <tr>
                  <td style={tdStyle}>1 character (ASCII)</td>
                  <td style={tdNumStyle}><code>1 byte</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>1 KB (decimal / binary)</td>
                  <td style={tdNumStyle}><code>1,000 B / 1,024 B</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>1 MB</td>
                  <td style={tdNumStyle}><code>~10⁶ bytes</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>1 GB</td>
                  <td style={tdNumStyle}><code>~10⁹ bytes</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>1 TB</td>
                  <td style={tdNumStyle}><code>~10¹² bytes</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Short text message / tweet</td>
                  <td style={tdNumStyle}><code>~0.3–1 KB with metadata</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Typical DB row (small object)</td>
                  <td style={tdNumStyle}><code>~100 B–1 KB</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>Compressed profile photo</td>
                  <td style={tdNumStyle}><code>~200 KB–2 MB</code></td>
                </tr>
                <tr>
                  <td style={tdStyle}>1 minute of 1080p video (~5 Mbps)</td>
                  <td style={tdNumStyle}><code>~35–40 MB</code></td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, borderBottom: 'none' }}>Thousand / Million / Billion / Trillion</td>
                  <td style={{ ...tdNumStyle, borderBottom: 'none' }}><code>10³ / 10⁶ / 10⁹ / 10¹²</code></td>
                </tr>
              </tbody>
            </table>
            <Callout kind="good" title="✓ Quick sanity check">
              <p>
                500 million users × 1 KB of profile data each ≈ 500 GB — small enough to fit (with
                room to spare) on a handful of modern DB nodes, which is exactly the kind of one-line
                justification interviewers want to see you produce out loud.
              </p>
            </Callout>
          </section>

          <section id="using-it">
            <h2>Using These In an Interview</h2>
            <p>
              The numbers themselves rarely matter as much as showing you reach for them naturally. A
              strong answer sounds like: &quot;a cache hit here saves us a datacenter round trip,
              which is roughly a thousand times slower than the cache read — so even a modest cache
              hit rate meaningfully reduces our p99 latency.&quot; Interviewers are listening for the
              habit of connecting a design decision to an order-of-magnitude number, not for a
              memorized digit.
            </p>
            <p>
              <strong>If you&apos;re a fresher:</strong> memorize the shape of the ladder (cache &lt;
              memory &lt; SSD &lt; disk &lt; network) more than the exact values — knowing memory
              beats disk by roughly 1,000×, and disk beats a cross-continent network call by roughly
              10×, covers most interview moments.
            </p>
            <p>
              <strong>If you&apos;re ~3 years in:</strong> you should be able to run a full capacity
              estimate live — daily active users → QPS → storage per year → number of servers needed
              — using only the rules of thumb above and simple arithmetic, out loud, in under two
              minutes.
            </p>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <PageNav
            prev={{ label: 'Reference', href: '/pages/reference' }}
            next={{ label: 'Glossary', href: '/pages/reference/glossary' }}
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
