import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';

export const metadata = {
  title: 'Consistency vs. Availability — System Design Architectures',
};

export default function ConsistencyVsAvailabilityPage() {
  return (
    <>
      <Header />
      <div className="layout">
        <TopicSidebar
          backHref="/pages/distributed-systems"
          backLabel="Back to Distributed Systems"
          toc={[
            { id: 'overview', label: 'Overview' },
            { id: 'plain-english', label: 'In Plain English' },
            { id: 'theory', label: 'Theory & Diagrams' },
            { id: 'trade-offs', label: 'Trade-offs' },
            { id: 'real-world', label: 'Real-World Examples' },
          ]}
        />

        <main className="content narrow">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Distributed Systems', href: '/pages/distributed-systems' },
              { label: 'Consistency vs. Availability' },
            ]}
          />
          <h1 id="overview">Consistency vs. Availability</h1>
          <p>
            Every distributed system eventually runs into the same wall: the network between its
            nodes will occasionally fail, delaying or dropping messages, and when that happens the
            system has to pick one of two uncomfortable options — keep answering requests and risk
            giving out stale or conflicting data, or refuse to answer until it can guarantee the
            answer is correct. This page covers the CAP theorem that formalizes that trade-off, the
            spectrum of consistency levels between &quot;always correct&quot; and &quot;eventually
            correct,&quot; and the transaction isolation levels that apply the same idea inside a
            single database.
          </p>

          <section id="plain-english">
            <h2>In Plain English</h2>
            <p>
              Imagine a bank with branches in different cities, connected by a shared ledger system.
              One day the network link between two branches goes down. A customer walks into Branch
              A and asks to withdraw money. Branch A has two choices: let the withdrawal go through
              using whatever balance it last knew about (available, but the balance might be stale
              if Branch B posted a deposit it hasn&apos;t heard about yet), or refuse the withdrawal
              until it can confirm the real-time balance with Branch B (consistent, but the customer
              walks away without their money). Neither choice is wrong — they&apos;re just optimizing
              for a different promise, and which one you pick depends entirely on what&apos;s worse
              for your business: a stale balance, or a customer who can&apos;t transact at all.
            </p>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  CAP theorem is really just asking one question: &quot;when part of the network
                  can&apos;t talk to the rest, do you keep serving requests (Availability) or do you
                  refuse them until you&apos;re sure the answer is correct (Consistency)?&quot;
                  Consistency levels (strong, eventual, causal) describe how stale an answer is
                  allowed to be. Isolation levels apply that exact same idea, just inside a single
                  database instead of across a network.
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  CAP is usually taught as &quot;pick 2 of 3,&quot; but that framing is a little
                  misleading. Partition tolerance isn&apos;t optional — any system with more than one
                  node over a real network will experience partitions eventually, so you can&apos;t
                  meaningfully choose to give it up. The actual choice only exists{' '}
                  <em>during a partition</em>: do you sacrifice Consistency (stay available, risk
                  stale/conflicting reads) or sacrifice Availability (refuse requests, stay
                  correct)? Outside of a partition, a well-built system can usually give you both.
                </p>
              </Callout>
            </TwoCol>
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>
            <h3>The CAP theorem</h3>
            <p>
              CAP theorem states that a distributed data store can provide at most two of three
              guarantees at once: <strong>Consistency</strong> — every read receives the most recent
              write or an error, so all nodes see the same data at the same time;{' '}
              <strong>Availability</strong> — every request receives a (non-error) response, without
              a guarantee that it contains the most recent write; and{' '}
              <strong>Partition tolerance</strong> — the system continues to operate despite an
              arbitrary number of messages being dropped or delayed by the network between nodes.
              In practice, Partition tolerance isn&apos;t a design choice — real networks drop
              packets, switches fail, and cables get cut, so any distributed system spanning more
              than one machine must tolerate partitions or it isn&apos;t really distributed. That
              means the meaningful trade-off is not a 3-way pick, but a 2-way one that only kicks in{' '}
              <em>while a partition is actually happening</em>: does the system stay{' '}
              <strong>CP</strong> (Consistent, refusing requests it can&apos;t guarantee are correct)
              or <strong>AP</strong> (Available, answering with whatever data it locally has and
              reconciling later)?
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-consistency/cp-vs-ap-partition.svg"
                alt="A network partition splitting three nodes: a CP system lets the majority side accept writes while the minority side refuses writes to stay correct; an AP system lets both sides keep accepting writes independently and reconciles the divergence once the partition heals"
              />
              <figcaption>The partition is the same in both systems — what differs is which promise gets broken while it lasts</figcaption>
            </figure>

            <h4>Advantages of choosing Consistency (CP)</h4>
            <ul>
              <li><strong>Correctness is guaranteed:</strong> Every read reflects the latest acknowledged write, so applications never have to reason about stale or conflicting data.</li>
              <li><strong>Simpler application logic:</strong> Developers don&apos;t need to write conflict-resolution or reconciliation code, since the system never exposes divergent state.</li>
              <li><strong>Safe for correctness-critical operations:</strong> Financial transfers, inventory counts, and anything where two conflicting answers would cause real harm are naturally suited to CP.</li>
              <li><strong>Predictable failure behavior:</strong> When the system can&apos;t guarantee correctness, it fails loudly (an error or timeout) rather than silently returning a wrong answer.</li>
            </ul>

            <h4>Disadvantages of choosing Consistency (CP)</h4>
            <ul>
              <li><strong>Reduced availability during partitions:</strong> The minority side of a partition must refuse requests entirely, even if every node on that side is perfectly healthy.</li>
              <li><strong>Higher write latency in general:</strong> Guaranteeing every replica agrees before acknowledging a write typically requires a quorum round-trip, adding latency compared to a single-node write.</li>
              <li><strong>Poor fit for globally distributed, low-latency reads:</strong> Serving a consistent read from a data center far from the writer either adds latency or requires routing all reads through one region.</li>
              <li><strong>User-facing errors during network issues:</strong> A CP system&apos;s honest response to a partition is to reject some requests, which is a worse user experience than silently serving a slightly stale answer.</li>
            </ul>

            <h3>Data consistency levels</h3>
            <p>
              Between &quot;always the latest data&quot; and &quot;eventually the latest data&quot;
              sits a spectrum of consistency models, each making a different promise about how stale
              a read is allowed to be. <strong>Strong consistency</strong> guarantees every read
              returns the most recent write, as if there were only one copy of the data — e.g. reading
              your bank balance immediately after a deposit always shows the new total.{' '}
              <strong>Eventual consistency</strong> guarantees only that, if no new writes occur, all
              replicas will <em>eventually</em> converge to the same value — e.g. a &quot;likes&quot;
              counter on a social post that briefly shows different counts to different users before
              settling. <strong>Causal consistency</strong> guarantees that operations which are
              causally related (one happened because of another) are seen by everyone in the same
              order, while unrelated operations can be seen in different orders — e.g. everyone sees
              a comment reply after the comment it&apos;s replying to, even if they see unrelated
              comments in a different order. <strong>Read-your-writes consistency</strong> guarantees
              that a user always sees their own writes immediately, even if other users might not
              yet — e.g. you edit your profile picture and immediately see the new one on your own
              screen, even while a friend viewing your profile from a different data center briefly
              sees the old one.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-consistency/strong-vs-eventual-consistency.svg"
                alt="Strong consistency: a write to x=5 is acknowledged only once every replica has it, so any read anywhere immediately returns 5. Eventual consistency: the write is acknowledged as soon as one node has it, so a read from Node 2 or 3 mid-flight returns the stale value 3 until replication catches up and all nodes converge on 5"
              />
              <figcaption>Same three nodes, same write — the only difference is when the other two are guaranteed to agree</figcaption>
            </figure>

            <h4>Advantages of Eventual Consistency</h4>
            <ul>
              <li><strong>High availability:</strong> Any replica can accept a read or write without waiting on a quorum or a distant coordinator, even during a partition.</li>
              <li><strong>Low latency:</strong> Reads and writes are served from the nearest replica instead of waiting for a cross-region round-trip to confirm agreement.</li>
              <li><strong>Scales horizontally with ease:</strong> Adding more replicas doesn&apos;t add coordination overhead to every write, since replicas sync independently in the background.</li>
              <li><strong>Tolerates partitions gracefully:</strong> Both sides of a network split can keep serving traffic, with reconciliation handled once connectivity returns.</li>
            </ul>

            <h4>Disadvantages of Eventual Consistency</h4>
            <ul>
              <li><strong>Stale reads are possible:</strong> A client can read a value that&apos;s already been overwritten elsewhere, simply because replication hasn&apos;t caught up yet.</li>
              <li><strong>Conflicting writes need resolution:</strong> Two replicas that each accepted a different write to the same key need an explicit merge strategy (last-writer-wins, vector clocks, CRDTs).</li>
              <li><strong>Harder to reason about correctness:</strong> Application developers must explicitly account for &quot;what if this read is stale?&quot; instead of assuming a single, always-current truth.</li>
              <li><strong>Unsuitable for correctness-critical data:</strong> Account balances, inventory counts, and anything where a stale read could cause a real-world error are a poor fit for pure eventual consistency.</li>
            </ul>

            <h3>Transaction isolation levels</h3>
            <p>
              Isolation levels apply the same consistency-vs-performance trade-off inside a single
              database, defining which anomalies concurrent transactions are allowed to see.{' '}
              <strong>Read Uncommitted</strong> allows a transaction to see another transaction&apos;s
              uncommitted changes — a <strong>dirty read</strong> — which can vanish moments later if
              that transaction rolls back. <strong>Read Committed</strong> prevents dirty reads by
              only ever showing committed data, but running the same query twice within one
              transaction can return different results if another transaction commits in between — a{' '}
              <strong>non-repeatable read</strong>. <strong>Repeatable Read</strong> fixes that by
              guaranteeing the same row read twice returns the same value for the duration of the
              transaction, but a range query re-run later can still see new rows that another
              transaction inserted and committed — a <strong>phantom read</strong>.{' '}
              <strong>Serializable</strong>, the strictest level, guarantees the outcome of concurrent
              transactions is identical to running them one after another in some order, preventing
              dirty reads, non-repeatable reads, and phantom reads entirely, at the cost of the most
              locking or conflict-checking overhead.
            </p>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <p>
              The two approaches above trade the same currency — how strict a correctness guarantee
              you demand versus how much latency and availability you&apos;re willing to give up for
              it. Here&apos;s how they actually compare, and when to reach for each.
            </p>

            <h3>Difference Between Strong Consistency and Eventual Consistency</h3>
            <table className="estimate-table">
              <thead>
                <tr>
                  <th>Aspect</th>
                  <th>Strong Consistency</th>
                  <th>Eventual Consistency</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Guarantee</td>
                  <td>Every read reflects the most recent acknowledged write</td>
                  <td>All replicas converge eventually, given no new writes</td>
                </tr>
                <tr>
                  <td>Read latency</td>
                  <td>Higher — may require a quorum read or routing to the primary</td>
                  <td>Lower — served from the nearest replica, no coordination needed</td>
                </tr>
                <tr>
                  <td>Write availability during partition</td>
                  <td>Minority side refuses writes to avoid disagreement</td>
                  <td>Both sides accept writes independently, reconciled later</td>
                </tr>
                <tr>
                  <td>Conflict handling</td>
                  <td>Not needed — writes are serialized through quorum agreement</td>
                  <td>Explicit merge logic required (last-writer-wins, vector clocks, CRDTs)</td>
                </tr>
                <tr>
                  <td>Typical use case</td>
                  <td>Bank balances, inventory counts, distributed locks/config</td>
                  <td>Social media like/view counts, DNS records, shopping cart contents</td>
                </tr>
                <tr>
                  <td>Real system example</td>
                  <td>Google Spanner, CockroachDB, ZooKeeper</td>
                  <td>Amazon DynamoDB (default), Apache Cassandra, DNS</td>
                </tr>
                <tr>
                  <td>Cost of the guarantee</td>
                  <td>Higher write latency and reduced availability under partition</td>
                  <td>Possible stale reads and the engineering cost of conflict resolution</td>
                </tr>
              </tbody>
            </table>

            <h3>Why Choose Eventual Consistency Over Strong Consistency?</h3>
            <ol>
              <li><strong>Lower latency for global users:</strong> A read served from a nearby replica avoids a round-trip to a distant primary. Analogy: it&apos;s like checking today&apos;s weather from a local forecast app instead of calling a single national weather office and waiting on hold.</li>
              <li><strong>Higher availability during network issues:</strong> Replicas keep serving traffic even when they can&apos;t reach each other. Analogy: it&apos;s like independent franchise stores that keep selling merchandise even if the phone line to corporate headquarters is temporarily down.</li>
              <li><strong>Better horizontal scalability:</strong> Adding more replicas doesn&apos;t add cross-replica coordination cost to every write. Analogy: it&apos;s like adding more cashiers at a busy store — each one works independently instead of all needing to confer before ringing up a sale.</li>
              <li><strong>Matches data that doesn&apos;t need to be exact:</strong> A like count that&apos;s off by a few for a moment causes no real harm. Analogy: it&apos;s like a stadium&apos;s attendance estimate on a scoreboard — nobody needs the exact headcount to the person, just a number that&apos;s close and updates over time.</li>
              <li><strong>Graceful degradation instead of hard failure:</strong> The system keeps functioning in a reduced way rather than refusing requests outright. Analogy: it&apos;s like a store staying open on a cash-only basis when its card reader loses connection, instead of shutting its doors until the connection is restored.</li>
            </ol>

            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that you understand CAP isn&apos;t
              a free 3-way choice — partition tolerance is a given in any real distributed system —
              so the real question is what happens <em>specifically during a partition</em>: which
              side keeps serving traffic, what a stale read looks like to the application, and how
              conflicting writes eventually get resolved.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to state the CAP theorem
              correctly, explain in your own words why partition tolerance can&apos;t really be
              dropped, and give one real example each of a CP system and an AP system covers most of
              what&apos;s checked here.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to name the four transaction
              isolation levels in order, state exactly which anomaly (dirty read, non-repeatable
              read, phantom read) each one prevents, and connect that back to CAP by explaining that
              isolation levels are the same trade-off applied inside a single database rather than
              across a network.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Amazon DynamoDB &amp; Apache Cassandra</strong> — both are AP systems by design, prioritizing availability and low latency, but expose tunable consistency (e.g. DynamoDB&apos;s eventually-consistent vs. strongly-consistent reads, Cassandra&apos;s per-query consistency level like QUORUM) so applications can opt into stronger guarantees where needed.</li>
              <li><strong>Google Spanner &amp; CockroachDB</strong> — CP-leaning distributed SQL databases that provide strong, externally-consistent transactions across globally distributed nodes, using synchronized clocks (Spanner&apos;s TrueTime) and consensus protocols to make it possible.</li>
              <li><strong>PostgreSQL&apos;s default isolation level</strong> — Read Committed, meaning dirty reads are prevented but non-repeatable reads and phantom reads are possible unless you explicitly request a stricter level.</li>
              <li><strong>MySQL InnoDB&apos;s default isolation level</strong> — Repeatable Read, which additionally prevents non-repeatable reads (and, via InnoDB&apos;s next-key locking, most phantom reads in practice) compared to Postgres&apos;s default.</li>
              <li><strong>Banking systems vs. social media feeds</strong> — a balance transfer needs strong consistency because a stale or conflicting balance can cause real financial harm, while a &quot;likes&quot; or &quot;views&quot; counter on a social post can tolerate eventual consistency because a momentarily-off number causes no real damage.</li>
            </ul>
          </section>

          <PageNav
            prev={{ label: 'HLD Capstone', href: '/pages/hld/capstones' }}
            next={{ label: 'Consensus & Leader Election', href: '/pages/distributed-systems/consensus-coordination' }}
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
