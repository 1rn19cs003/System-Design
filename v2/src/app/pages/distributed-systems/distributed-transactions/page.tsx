import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';

export const metadata = {
  title: 'Distributed Transactions — System Design Architectures',
};

export default function DistributedTransactionsPage() {
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
              { label: 'Distributed Transactions' },
            ]}
          />
          <h1 id="overview">Distributed Transactions</h1>
          <p>
            A single database gives you transactions for free — an operation either fully commits or
            fully rolls back, and the engine handles it. The moment a &quot;transaction&quot; spans
            multiple services or multiple machines, that guarantee stops being free: there is no
            single engine watching over all the pieces, any one of them can fail independently, and
            the network between them can delay or drop messages at the worst possible moment. This
            page covers the mechanisms distributed systems use to keep state consistent anyway — from
            protocols that try to make a multi-node write atomic (2PC, 3PC), to patterns that accept
            it can&apos;t be perfectly atomic and instead make it reversible (SAGA), to techniques for
            tracking and resolving conflicting writes after the fact (vector clocks, CRDTs).
          </p>

          <section id="plain-english">
            <h2>In Plain English</h2>
            <p>
              Imagine booking a vacation that requires a flight, a hotel, and a rental car, each
              booked through a different company. There is no single &quot;undo everything&quot;
              button that spans all three companies — if the car rental fails after you&apos;ve
              already paid for the flight and hotel, you have to manually cancel those bookings
              yourself. That&apos;s the core problem this whole page is about: once a transaction
              crosses a system boundary, there&apos;s no free atomic rollback, so you either force
              every party to wait for a group decision (2PC/3PC — everyone agrees before anyone
              commits), or you let each step commit on its own and keep a list of &quot;undo&quot;
              actions ready in case a later step fails (SAGA). Vector clocks and CRDTs solve a
              related but different problem: when two people edit the same shared document while
              offline, how do you even know their edits conflict, and how do you merge them back
              together automatically when they don&apos;t?
            </p>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  Every idea on this page is really answering: &quot;what happens to the other steps
                  of a multi-step operation if one step fails partway through?&quot; 2PC and 3PC
                  answer it by making everyone vote before anyone commits. SAGA answers it by letting
                  each step commit immediately and cleaning up afterward if something later goes
                  wrong. Vector clocks and CRDTs answer a sibling question — &quot;two people changed
                  the same thing at the same time, now what?&quot;
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  The interesting failure isn&apos;t the individual step failing — it&apos;s the
                  coordinator or a single node disappearing at the exact moment between two phases of
                  a protocol, leaving the system in an ambiguous state. Be ready to reason precisely
                  about what a participant does when it has voted &quot;yes&quot; but never receives
                  the final decision, and why availability-favoring systems (SAGA, CRDTs) sidestep
                  that failure mode entirely by never requiring a synchronous, cluster-wide vote in
                  the first place.
                </p>
              </Callout>
            </TwoCol>
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>
            <h3>Two-Phase Commit (2PC)</h3>
            <p>
              2PC makes a multi-node write atomic by introducing a coordinator that drives two
              rounds of communication. In the <strong>prepare</strong> phase, the coordinator asks
              every participant &quot;can you commit this?&quot; and each participant does whatever
              work is needed to guarantee it <em>can</em> commit if told to — validating constraints,
              acquiring locks, writing the change to a durable but not-yet-visible log — then replies
              yes or no. Only if every participant votes yes does the coordinator move to the{' '}
              <strong>commit</strong> phase and tell everyone to make the change permanent; if any
              participant votes no, or times out, the coordinator tells everyone to abort instead.
              The protocol guarantees atomicity as long as the coordinator survives, but it has a
              well-known failure mode: if the coordinator crashes after collecting votes but before
              sending the final decision, participants that voted yes are <strong>blocked</strong> —
              holding locks and undecided state indefinitely, unable to safely commit or abort on
              their own, because they don&apos;t know what the other participants were told.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-transactions/two-phase-commit.svg"
                alt="A coordinator asking two participants to prepare, both voting yes, then the coordinator sending commit to both; a note explains that a coordinator crash after prepare leaves participants blocked"
              />
              <figcaption>Every participant must agree before anyone commits — which is exactly what makes a coordinator crash so dangerous</figcaption>
            </figure>

            <p>
              In practice the coordinator doesn&apos;t just vanish and reappear cleanly — recovery
              depends entirely on what it managed to write to durable storage before it went down.
              A correctly built coordinator persists its decision (commit or abort) to a
              write-ahead log <em>before</em> sending the first commit message to any participant,
              so that when it restarts it can read that log and simply resend the same decision to
              every participant, rather than trying to re-decide anything. The common production
              pitfall is skipping or delaying that durable write to save latency: if the
              coordinator crashes before the decision is safely on disk, there is genuinely no way
              to know what it would have decided, and participants are left relying on a
              timeout-and-escalate runbook — often a paged on-call engineer manually deciding
              whether to force-commit or force-abort each stuck transaction, which is exactly the
              operational cost 2PC is infamous for.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-transactions/coordinator-crash-blocking.svg"
                alt="A detailed timeline showing the coordinator crashing after both participants voted yes and acquired locks, leaving both participants blocked holding their locks for an unknown duration until the coordinator recovers and resends its durable decision"
              />
              <figcaption>Both participants are stuck holding locks the instant the coordinator disappears mid-decision</figcaption>
            </figure>

            <h4>Advantages of Two-Phase Commit</h4>
            <ul>
              <li><strong>True atomicity:</strong> Either every participant commits or every participant aborts — there is no in-between state where some nodes applied the change and others didn&apos;t.</li>
              <li><strong>Strong consistency:</strong> Because nothing becomes visible until every participant has voted yes, readers never see a partially-applied multi-node write.</li>
              <li><strong>Well-suited to tightly coupled systems:</strong> Inside a single distributed database engine that controls all its own shards, 2PC is a clean, provably correct way to keep cross-shard writes atomic.</li>
              <li><strong>Simple mental model:</strong> The two-phase vote-then-commit structure is easy to reason about compared to reconciling state after the fact.</li>
            </ul>

            <h4>Disadvantages of Two-Phase Commit</h4>
            <ul>
              <li><strong>Blocking on coordinator failure:</strong> A coordinator crash between the prepare and commit phases leaves every participant that voted yes stuck holding locks indefinitely.</li>
              <li><strong>Poor availability across services:</strong> Every participant must be reachable and responsive during the vote — one slow or down service stalls the entire transaction.</li>
              <li><strong>Doesn&apos;t fit independently owned services:</strong> Most HTTP/REST or message-based microservices don&apos;t expose a 2PC-compatible transactional resource manager, so it&apos;s rarely usable across service boundaries.</li>
              <li><strong>Operational burden during incidents:</strong> Recovering a stuck transaction often needs a paged on-call engineer to manually decide whether to force-commit or force-abort.</li>
            </ul>

            <h3>Three-Phase Commit (3PC)</h3>
            <p>
              3PC addresses 2PC&apos;s blocking problem by splitting the second phase in two: after
              collecting unanimous yes votes, the coordinator sends a{' '}
              <strong>pre-commit</strong> message and waits for participants to acknowledge it, and
              only then sends the final commit. The key benefit is that once a participant has
              acknowledged pre-commit, it knows the entire cluster voted yes — so if the coordinator
              then disappears, that participant can safely time out and commit on its own, instead of
              blocking forever, because no other participant could have received an abort. This
              genuinely reduces the blocking window compared to 2PC, but it doesn&apos;t eliminate the
              underlying risk: 3PC assumes the network can delay messages but not partition into
              isolated groups, and under a real partition two separated groups of participants could
              still time out and reach different decisions — which is why 3PC is taught more than
              it&apos;s deployed.
            </p>

            <h3>SAGA pattern</h3>
            <p>
              SAGA takes a fundamentally different approach: instead of trying to make the whole
              transaction atomic, it accepts that each step commits independently and instead makes
              the overall transaction <strong>reversible</strong>. A saga is a sequence of local
              transactions, each of which has a corresponding <strong>compensating action</strong> —
              an explicit &quot;undo&quot; step that semantically reverses it (e.g. &quot;refund the
              payment&quot; rather than a literal database rollback, since the payment may already be
              in another system entirely). If any step fails, the saga runs the compensating actions
              for every step that already succeeded, in reverse order, bringing the system back to a
              consistent (though not identical) state. There are two ways to coordinate a saga:{' '}
              <strong>choreography</strong>, where each service publishes an event on completing its
              step and the next service reacts to it with no central coordinator at all, and{' '}
              <strong>orchestration</strong>, where a dedicated saga orchestrator explicitly calls
              each step in sequence and is responsible for triggering compensations on failure.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-transactions/saga-orchestration.svg"
                alt="A saga orchestrator calling reserve inventory, then charge payment, then create shipment which fails; the orchestrator then runs compensating actions in reverse order, refunding the payment and releasing the inventory"
              />
              <figcaption>Nothing is undone atomically — each compensation is its own explicit, semantically reversing action</figcaption>
            </figure>

            <p>
              The example above is orchestration, where a dedicated service explicitly drives the
              workflow. <strong>Choreography</strong> reaches the same end state a different way:
              there&apos;s no dedicated saga service at all — each participant simply publishes an
              event when it finishes its own step, and whichever other services care about that
              event react to it independently. The failure path becomes a chain reaction: a
              ShipmentFailed event is consumed by the Payment service&apos;s own event handler,
              which issues a refund and publishes PaymentRefunded, which the Inventory
              service&apos;s handler in turn consumes to release its hold. This keeps every service
              fully decoupled from the others, but it comes at a real debugging cost — there is no
              single place to look to see the whole saga&apos;s state, only a trail of events
              scattered across every service&apos;s own logs.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-transactions/saga-choreography.svg"
                alt="Three services — Inventory, Payment, and Shipping — publishing and reacting to each other's events directly through an event bus with no central coordinator; a shipment failure event cascades backward through Payment and Inventory's own handlers to trigger compensations"
              />
              <figcaption>No central coordinator — just services reacting to each other&apos;s events, for better and for worse</figcaption>
            </figure>

            <h4>Advantages of the SAGA pattern</h4>
            <ul>
              <li><strong>High availability:</strong> Each service commits its own local transaction immediately, with no cross-service lock held while waiting on anyone else.</li>
              <li><strong>Fits independently deployed services:</strong> SAGA doesn&apos;t require every participant to expose a shared transactional resource manager, so it works naturally across service boundaries owned by different teams.</li>
              <li><strong>Failure is recoverable, not catastrophic:</strong> A failed step triggers well-defined compensating actions rather than leaving the system in an ambiguous, blocked state.</li>
              <li><strong>Scales independently:</strong> Because there&apos;s no synchronous cluster-wide vote, each service can scale and fail independently of the others.</li>
            </ul>

            <h4>Disadvantages of the SAGA pattern</h4>
            <ul>
              <li><strong>No true atomicity:</strong> There&apos;s a real window where some steps have committed and others haven&apos;t — anyone reading state mid-saga can see a partially-applied transaction.</li>
              <li><strong>Compensating actions must be designed explicitly:</strong> Every step needs a corresponding &quot;undo&quot; (e.g. refund a payment) that the engineering team has to design and test — it doesn&apos;t come for free like a database rollback.</li>
              <li><strong>Debugging is harder with choreography:</strong> When each service reacts to events independently with no central coordinator, there&apos;s no single place to see the whole saga&apos;s current state.</li>
              <li><strong>Compensations aren&apos;t always perfectly reversible:</strong> Some actions (e.g. sending a notification, charging a card that&apos;s later refunded with a fee) can&apos;t be undone as cleanly as a database write, leaving edge cases the design must account for.</li>
            </ul>

            <h3>Vector clocks</h3>
            <p>
              Wall-clock timestamps are unreliable for ordering events across machines — clocks
              drift, and even with NTP synchronization you can&apos;t reliably tell whether two
              nearly-simultaneous writes on different nodes were actually causally related. A{' '}
              <strong>vector clock</strong> solves this without relying on time at all: every node
              keeps a counter for itself (and every other node it knows about), incrementing its own
              counter on every local event, and whenever it sends a message it attaches its full
              vector; the receiving node merges the sender&apos;s vector into its own by taking the
              element-wise max. Comparing two vector clocks then tells you about causality directly —
              if one clock&apos;s counters are all greater than or equal to another&apos;s, the first
              event causally happened after the second. If neither dominates the other, the two
              events are <strong>concurrent</strong> — neither node could have known about the
              other&apos;s write when it made its own — which is precisely the signature of a real
              conflict that needs resolving, not just a timing coincidence.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-transactions/vector-clocks.svg"
                alt="Node 1 writing twice locally while offline, reaching vector clock R1:2, R2:0, while Node 2 writes once locally reaching R1:0, R2:1; on sync neither vector dominates the other, so a conflict is detected"
              />
              <figcaption>Neither clock dominates the other — that's how the system knows the writes actually conflict</figcaption>
            </figure>

            <h3>CRDTs (Conflict-free Replicated Data Types)</h3>
            <p>
              A CRDT is a data structure specifically designed so that concurrent updates from
              different replicas always merge into the same consistent result, with no coordination,
              no locking, and no conflict-resolution logic required at merge time. This works because
              every CRDT&apos;s merge operation is mathematically commutative, associative, and
              idempotent — the result doesn&apos;t depend on the order updates arrive in, or whether
              the same update is applied more than once (which matters enormously for systems with
              at-least-once message delivery). A <strong>G-Counter</strong> (grow-only counter) is the
              simplest example: each replica only increments its own slot in a per-replica counter
              map, and merging two replicas&apos; maps just takes the max of each slot and sums the
              result — no replica&apos;s increments can ever be lost or double-counted, regardless of
              merge order. A <strong>Last-Writer-Wins register</strong> is a slightly different flavor
              — it tags every write with a timestamp (or a vector clock) and, on conflict, deterministically
              picks the write with the highest tag, trading a bit of data loss (the losing write is
              discarded) for simplicity. CRDTs are the backbone of offline-first and collaborative
              editing systems, where replicas frequently diverge while disconnected and must
              reconcile automatically once they reconnect.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-transactions/crdt-merge.svg"
                alt="Replica 1 with G-Counter state R1:3, R2:0 and Replica 2 with state R1:0, R2:5 merging via element-wise max into R1:3, R2:5, totaling 8 on both replicas"
              />
              <figcaption>The merge function itself guarantees convergence — there's no separate conflict-resolution step</figcaption>
            </figure>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <p>
              The two approaches above solve the same problem — keeping a multi-step operation
              consistent across independent nodes — in fundamentally different ways. Here&apos;s
              how they actually compare, and when to reach for each.
            </p>

            <h3>Difference Between Two-Phase Commit and SAGA</h3>
            <table className="estimate-table">
              <thead>
                <tr>
                  <th>Aspect</th>
                  <th>Two-Phase Commit</th>
                  <th>SAGA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Consistency guarantee</td>
                  <td>Strong — all-or-nothing atomicity across every participant</td>
                  <td>Eventual — reaches a consistent state via compensations, not instantly</td>
                </tr>
                <tr>
                  <td>Coordinator required?</td>
                  <td>Yes — a central coordinator drives prepare and commit phases</td>
                  <td>Optional — orchestration uses one, choreography has none</td>
                </tr>
                <tr>
                  <td>Fault tolerance / what happens on failure</td>
                  <td>Participants that voted yes block, holding locks until the coordinator recovers</td>
                  <td>Already-committed steps are undone via explicit compensating actions</td>
                </tr>
                <tr>
                  <td>Latency/overhead</td>
                  <td>Higher — every write waits on a full round of votes before committing</td>
                  <td>Lower — each local transaction commits immediately, no cross-service wait</td>
                </tr>
                <tr>
                  <td>Scalability</td>
                  <td>Poor across independently owned services — one slow participant blocks all</td>
                  <td>Scales well — each service commits and fails independently</td>
                </tr>
                <tr>
                  <td>Typical use case</td>
                  <td>Cross-shard transactions inside one tightly controlled distributed database</td>
                  <td>Multi-service business workflows like checkout, booking, and order fulfillment</td>
                </tr>
                <tr>
                  <td>Real system example</td>
                  <td>CockroachDB and Spanner-style distributed SQL engines use 2PC-style protocols under the hood</td>
                  <td>Stripe-style e-commerce checkout flows (reserve inventory, charge card, ship order)</td>
                </tr>
              </tbody>
            </table>

            <h3>Why Choose SAGA Over Two-Phase Commit?</h3>
            <ol>
              <li><strong>Availability:</strong> SAGA never requires a service to hold a cross-service lock while waiting on a vote. Analogy: it&apos;s like each vendor at a wedding (caterer, florist, band) handling their own booking independently rather than all three needing to say &quot;yes&quot; in the same phone call before any of them can confirm.</li>
              <li><strong>No blocking on a single coordinator:</strong> A crashed orchestrator doesn&apos;t leave every service frozen holding resources. Analogy: it&apos;s like a relay race where each runner keeps their baton once they&apos;ve run their leg, instead of the whole team having to freeze in place until the coach blows a whistle.</li>
              <li><strong>Fits independently owned services:</strong> SAGA doesn&apos;t require every participant to expose a shared transactional resource manager. Analogy: it&apos;s like coordinating with separate companies through polite emails and refund policies, rather than requiring them all to share one joint bank account.</li>
              <li><strong>Recoverable failure path:</strong> A failed step triggers well-defined compensations instead of an ambiguous stuck state. Analogy: it&apos;s like a store&apos;s return policy — if a purchase doesn&apos;t work out, there&apos;s a known, explicit process to undo it, rather than the transaction hanging in limbo forever.</li>
              <li><strong>Independent scaling:</strong> Each service commits and fails on its own schedule, without a synchronous cluster-wide vote gating every write. Analogy: it&apos;s like separate departments in a company each hitting their own deadlines, instead of the entire company waiting for one all-hands meeting to approve every decision.</li>
            </ol>

            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that you can name 2PC&apos;s
              blocking failure mode precisely — a coordinator crash between prepare and commit — and
              explain why SAGA sidesteps it entirely by never requiring participants to hold a
              cross-service lock while waiting on a vote. Bonus points for recognizing that vector
              clocks and CRDTs are solving a different problem (detecting/resolving conflicting
              concurrent writes) than 2PC/SAGA (keeping a multi-step operation consistent).
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to explain, in your own words, why
              a multi-service &quot;transaction&quot; can&apos;t just use a normal database
              transaction, and walking through what a compensating action is with a concrete example
              (refund a payment, release a reservation), covers most of what&apos;s checked here.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to design a saga for a real
              multi-step flow end to end — naming each local transaction and its exact compensating
              action — and to explain when you&apos;d choose choreography vs. orchestration as the
              number of steps grows.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Stripe and e-commerce order flows</strong> — a checkout that reserves inventory, charges a card, and creates a shipment is a textbook SAGA: each step is its own local transaction, and a failed payment or shipment triggers explicit compensations like releasing the inventory hold or issuing a refund.</li>
              <li><strong>Google Docs &amp; Figma</strong> — collaborative editors use CRDT-like or Operational Transformation approaches so that concurrent edits from multiple users (or from a user who was briefly offline) merge automatically into a consistent document without a central lock on every keystroke.</li>
              <li><strong>Amazon DynamoDB</strong> — historically used vector clocks internally to detect concurrent, conflicting writes to the same item across replicas, surfacing multiple versions to the application (or a resolution policy) instead of silently picking a winner.</li>
              <li><strong>CockroachDB &amp; Spanner-style distributed SQL databases</strong> — implement cross-shard transactions using a two-phase-commit-style protocol under the hood, layered with additional mechanisms (like Spanner&apos;s TrueTime) to provide strong consistency guarantees across shards.</li>
              <li><strong>Redis CRDTs (Active-Active / CRDB)</strong> — Redis Enterprise&apos;s active-active geo-replication uses CRDTs for common data types so multiple regions can accept writes simultaneously and converge without conflict, even across a wide-area network with high latency.</li>
            </ul>
          </section>

          <PageNav
            prev={{ label: 'Consensus & Leader Election', href: '/pages/distributed-systems/consensus-coordination' }}
            next={{ label: 'DevOps Concepts', href: '/pages/distributed-systems/devops-concepts' }}
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
