import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';
import FlowStep from '@/components/FlowStep';
import FlowContinue from '@/components/FlowContinue';

const TOTAL_STEPS = 6;

export const metadata = {
  title: 'Distributed Transactions & State — System Design Architectures',
};

const OUTPUT = `Replica 1 increments: R1=1, R1=2, R1=3 (local state {R1: 3, R2: 0})
Replica 2 increments: R2=1, R2=2, R2=3, R2=4, R2=5 (local state {R1: 0, R2: 5})
Merging replica 1 and replica 2 (element-wise max per node)...
Merged vector: {R1: 3, R2: 5}
Total count = sum(merged vector) = 8
Merge is commutative: merging in the opposite order gives the same vector: {R1: 3, R2: 5}
Final converged total on both replicas: 8`;

const snippets = {
  java: {
    code: `import java.util.*;

public class GCounterDemo {
    // A G-Counter CRDT: each replica only increments its own slot.
    // Merging takes the element-wise max across replicas, which is
    // commutative, associative, and idempotent -- no coordination needed.
    static Map<String, Integer> merge(Map<String, Integer> a, Map<String, Integer> b) {
        Map<String, Integer> out = new LinkedHashMap<>();
        Set<String> keys = new LinkedHashSet<>();
        keys.addAll(a.keySet());
        keys.addAll(b.keySet());
        for (String k : keys) {
            out.put(k, Math.max(a.getOrDefault(k, 0), b.getOrDefault(k, 0)));
        }
        return out;
    }

    static int total(Map<String, Integer> v) {
        int sum = 0;
        for (int x : v.values()) sum += x;
        return sum;
    }

    public static void main(String[] args) {
        Map<String, Integer> r1 = new LinkedHashMap<>(Map.of("R1", 0, "R2", 0));
        for (int i = 1; i <= 3; i++) r1.put("R1", i);
        System.out.println("Replica 1 increments: R1=1, R1=2, R1=3 (local state {R1: 3, R2: 0})");

        Map<String, Integer> r2 = new LinkedHashMap<>(Map.of("R1", 0, "R2", 0));
        for (int i = 1; i <= 5; i++) r2.put("R2", i);
        System.out.println("Replica 2 increments: R2=1, R2=2, R2=3, R2=4, R2=5 (local state {R1: 0, R2: 5})");

        System.out.println("Merging replica 1 and replica 2 (element-wise max per node)...");
        Map<String, Integer> merged = merge(r1, r2);
        System.out.println("Merged vector: {R1: " + merged.get("R1") + ", R2: " + merged.get("R2") + "}");
        System.out.println("Total count = sum(merged vector) = " + total(merged));

        Map<String, Integer> mergedReverse = merge(r2, r1);
        System.out.println("Merge is commutative: merging in the opposite order gives the same vector: {R1: "
            + mergedReverse.get("R1") + ", R2: " + mergedReverse.get("R2") + "}");
        System.out.println("Final converged total on both replicas: " + total(mergedReverse));
    }
}`,
    output: OUTPUT,
  },
  python: {
    code: `# A G-Counter CRDT: each replica only increments its own slot.
# Merging takes the element-wise max across replicas, which is
# commutative, associative, and idempotent -- no coordination needed.

def merge(a, b):
    keys = list(dict.fromkeys(list(a.keys()) + list(b.keys())))
    return {k: max(a.get(k, 0), b.get(k, 0)) for k in keys}

def total(v):
    return sum(v.values())

r1 = {"R1": 0, "R2": 0}
for i in range(1, 4):
    r1["R1"] = i
print("Replica 1 increments: R1=1, R1=2, R1=3 (local state {R1: 3, R2: 0})")

r2 = {"R1": 0, "R2": 0}
for i in range(1, 6):
    r2["R2"] = i
print("Replica 2 increments: R2=1, R2=2, R2=3, R2=4, R2=5 (local state {R1: 0, R2: 5})")

print("Merging replica 1 and replica 2 (element-wise max per node)...")
merged = merge(r1, r2)
print(f"Merged vector: {{R1: {merged['R1']}, R2: {merged['R2']}}}")
print(f"Total count = sum(merged vector) = {total(merged)}")

merged_reverse = merge(r2, r1)
print(f"Merge is commutative: merging in the opposite order gives the same vector: "
      f"{{R1: {merged_reverse['R1']}, R2: {merged_reverse['R2']}}}")
print(f"Final converged total on both replicas: {total(merged_reverse)}")`,
    output: OUTPUT,
  },
  javascript: {
    code: `// A G-Counter CRDT: each replica only increments its own slot.
// Merging takes the element-wise max across replicas, which is
// commutative, associative, and idempotent -- no coordination needed.

function merge(a, b) {
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
  const out = {};
  for (const k of keys) out[k] = Math.max(a[k] || 0, b[k] || 0);
  return out;
}

function total(v) {
  return Object.values(v).reduce((s, x) => s + x, 0);
}

const r1 = { R1: 0, R2: 0 };
for (let i = 1; i <= 3; i++) r1.R1 = i;
console.log("Replica 1 increments: R1=1, R1=2, R1=3 (local state {R1: 3, R2: 0})");

const r2 = { R1: 0, R2: 0 };
for (let i = 1; i <= 5; i++) r2.R2 = i;
console.log("Replica 2 increments: R2=1, R2=2, R2=3, R2=4, R2=5 (local state {R1: 0, R2: 5})");

console.log("Merging replica 1 and replica 2 (element-wise max per node)...");
const merged = merge(r1, r2);
console.log(\`Merged vector: {R1: \${merged.R1}, R2: \${merged.R2}}\`);
console.log(\`Total count = sum(merged vector) = \${total(merged)}\`);

const mergedReverse = merge(r2, r1);
console.log(\`Merge is commutative: merging in the opposite order gives the same vector: {R1: \${mergedReverse.R1}, R2: \${mergedReverse.R2}}\`);
console.log(\`Final converged total on both replicas: \${total(mergedReverse)}\`);`,
    output: OUTPUT,
  },
  cpp: {
    code: `#include <iostream>
#include <map>
#include <string>
#include <algorithm>

// A G-Counter CRDT: each replica only increments its own slot.
// Merging takes the element-wise max across replicas, which is
// commutative, associative, and idempotent -- no coordination needed.

std::map<std::string, int> merge(const std::map<std::string, int>& a, const std::map<std::string, int>& b) {
    std::map<std::string, int> out;
    for (auto& [k, v] : a) out[k] = std::max(out.count(k) ? out[k] : 0, v);
    for (auto& [k, v] : b) out[k] = std::max(out.count(k) ? out[k] : 0, v);
    return out;
}

int total(const std::map<std::string, int>& v) {
    int sum = 0;
    for (auto& [k, val] : v) sum += val;
    return sum;
}

int main() {
    std::map<std::string, int> r1 = {{"R1", 0}, {"R2", 0}};
    for (int i = 1; i <= 3; i++) r1["R1"] = i;
    std::cout << "Replica 1 increments: R1=1, R1=2, R1=3 (local state {R1: 3, R2: 0})" << std::endl;

    std::map<std::string, int> r2 = {{"R1", 0}, {"R2", 0}};
    for (int i = 1; i <= 5; i++) r2["R2"] = i;
    std::cout << "Replica 2 increments: R2=1, R2=2, R2=3, R2=4, R2=5 (local state {R1: 0, R2: 5})" << std::endl;

    std::cout << "Merging replica 1 and replica 2 (element-wise max per node)..." << std::endl;
    auto merged = merge(r1, r2);
    std::cout << "Merged vector: {R1: " << merged["R1"] << ", R2: " << merged["R2"] << "}" << std::endl;
    std::cout << "Total count = sum(merged vector) = " << total(merged) << std::endl;

    auto mergedReverse = merge(r2, r1);
    std::cout << "Merge is commutative: merging in the opposite order gives the same vector: {R1: "
              << mergedReverse["R1"] << ", R2: " << mergedReverse["R2"] << "}" << std::endl;
    std::cout << "Final converged total on both replicas: " << total(mergedReverse) << std::endl;
    return 0;
}`,
    output: OUTPUT,
  },
};

const qaItems = [
  {
    q: "What exactly goes wrong when a Two-Phase Commit coordinator crashes between the prepare and commit phases?",
    a: "Once a participant votes \"yes\" in the prepare phase, it must hold its locks and its uncommitted changes in a prepared state, ready to go either way, until it hears back from the coordinator. If the coordinator crashes before sending the final commit/abort decision, every participant that voted yes is stuck: it can't unilaterally commit (the coordinator might have decided abort because another participant said no) and it can't unilaterally abort (the coordinator might have already decided commit and told other participants). This is the blocking problem — participants hold locks and resources indefinitely until the coordinator recovers or a human intervenes, which can stall an entire cluster.",
  },
  {
    q: "How does Three-Phase Commit reduce the blocking window compared to 2PC, and why doesn't it eliminate it?",
    a: "3PC inserts a pre-commit phase between prepare and commit: after all participants vote yes, the coordinator broadcasts \"pre-commit\" and waits for acknowledgments before sending the final \"commit.\" Because every participant that reaches pre-commit knows the whole cluster voted yes, participants can use a timeout to safely commit on their own if the coordinator disappears after pre-commit — that's the improvement. But 3PC still assumes the network only fails by delaying messages, not by partitioning it into groups that can each proceed independently; under a real network partition, two isolated groups could still reach different decisions, so blocking (and worse, inconsistency) isn't fully solved, which is a large part of why 3PC saw little real-world adoption.",
  },
  {
    q: "SAGA choreography vs. orchestration — what's the actual trade-off, and when would you pick one over the other?",
    a: "In choreography, each service publishes an event when it finishes its local step, and the next service in line reacts to that event — there's no central coordinator, which keeps services decoupled and avoids a single component that needs to know the whole workflow. The cost is that the overall flow becomes implicit, scattered across every service's event handlers, which gets hard to trace, test, and reason about as the number of steps grows. Orchestration puts a dedicated saga orchestrator in charge, explicitly calling each step and running compensations on failure — this makes the workflow visible in one place and much easier to debug and extend, at the cost of introducing a central component (though it's simpler to make highly available than a 2PC coordinator, since it doesn't hold locks on other services' resources). Most teams reach for choreography for a small number of steps (two or three services) and switch to orchestration once a saga's step count or branching complexity grows.",
  },
  {
    q: "What does a vector clock actually track, and what does it mean when two vector clocks are incomparable?",
    a: "A vector clock is a map of counters, one per node in the system, that each node increments locally on every event and attaches to messages it sends; when a node receives a message, it merges the sender's clock into its own by taking the element-wise max. Comparing two vector clocks tells you about causality, not wall-clock time: if every counter in clock A is greater than or equal to the corresponding counter in clock B (and at least one is strictly greater), then the event with clock A causally happened after the event with clock B. If neither clock dominates the other — some counters are higher in A, others higher in B — the two events are concurrent, meaning neither could have known about the other, which is exactly the signature of a genuine write-write conflict that the application (or the user, via a merge UI) needs to resolve.",
  },
  {
    q: "Why don't CRDTs need coordination to stay consistent, when a naive replicated data structure would?",
    a: "A CRDT is designed so that every operation on it is representable in a form that is commutative, associative, and idempotent when merged — meaning the order replicas receive updates in, and how many times they see the same update, doesn't change the final result. A G-Counter only ever increments a replica's own slot and merges other replicas' slots via max, so two replicas that diverge while offline and later exchange state always converge to the same total regardless of which one merges first or how many times a message gets redelivered. A naive shared counter (\"replica sends +1, apply it\") isn't safe this way — duplicate delivery double-counts, and out-of-order delivery of increments and decrements can produce different results on different replicas, which is exactly the class of bug CRDTs are engineered to make structurally impossible.",
  },
  {
    q: "In a microservices architecture, when would you reach for SAGA instead of Two-Phase Commit?",
    a: "2PC requires every participant to hold locks on its own database while the coordinator collects votes, which works inside a single database engine's distributed transaction manager but becomes a severe availability and latency problem across independently-owned microservices — one slow or down service blocks the whole transaction, and you'd need every service to expose a 2PC-compatible transactional resource manager, which most HTTP/REST or message-based services simply don't. SAGA trades strict atomicity for availability: each service commits its own local transaction immediately (no cross-service locks held), and consistency is restored after the fact via compensating actions if a later step fails. The practical rule of thumb: reach for 2PC only when all participants are transactional resources you fully control within a tightly coupled system (e.g. a distributed SQL engine coordinating its own shards); reach for SAGA whenever the transaction spans independently deployed, independently owned services.",
  },
];

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
            { id: 'interview-questions', label: 'Interview Questions' },
            { id: 'code', label: 'Code & Output' },
          ]}
        />

        <main className="content narrow">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Distributed Systems', href: '/pages/distributed-systems' },
              { label: 'Distributed Transactions & State' },
            ]}
          />
          <h1 id="overview">Distributed Transactions &amp; State</h1>
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

          <FlowStep id="plain-english" step={1} total={TOTAL_STEPS} title="In Plain English" defaultOpen>
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
            <FlowContinue nextId="theory" label="Theory & Diagrams" />
          </FlowStep>

          <FlowStep id="theory" step={2} total={TOTAL_STEPS} title="Theory & Diagrams">
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
            <FlowContinue nextId="trade-offs" label="Trade-offs" />
          </FlowStep>

          <FlowStep id="trade-offs" step={3} total={TOTAL_STEPS} title="Trade-offs">
            <TwoCol>
              <Callout kind="good" title="✓ Reach for 2PC/3PC-style atomic protocols when">
                <ul>
                  <li>All participants are transactional resources within a system you tightly control (e.g. shards of one distributed database), not independently owned microservices.</li>
                  <li>You genuinely need all-or-nothing atomicity and can accept the availability cost of participants blocking on the coordinator.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Reach for SAGA / CRDTs when">
                <ul>
                  <li>The transaction spans independently deployed services, and you&apos;d rather trade strict atomicity for availability and a reversible (not instantaneous) consistency guarantee.</li>
                  <li>Replicas need to keep working while disconnected (offline-first, multi-region, collaborative editing) and reconcile automatically once reconnected, without a synchronous coordination step.</li>
                </ul>
              </Callout>
            </TwoCol>
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
            <FlowContinue nextId="real-world" label="Real-World Examples" />
          </FlowStep>

          <FlowStep id="real-world" step={4} total={TOTAL_STEPS} title="Real-World Examples">
            <ul>
              <li><strong>Stripe and e-commerce order flows</strong> — a checkout that reserves inventory, charges a card, and creates a shipment is a textbook SAGA: each step is its own local transaction, and a failed payment or shipment triggers explicit compensations like releasing the inventory hold or issuing a refund.</li>
              <li><strong>Google Docs &amp; Figma</strong> — collaborative editors use CRDT-like or Operational Transformation approaches so that concurrent edits from multiple users (or from a user who was briefly offline) merge automatically into a consistent document without a central lock on every keystroke.</li>
              <li><strong>Amazon DynamoDB</strong> — historically used vector clocks internally to detect concurrent, conflicting writes to the same item across replicas, surfacing multiple versions to the application (or a resolution policy) instead of silently picking a winner.</li>
              <li><strong>CockroachDB &amp; Spanner-style distributed SQL databases</strong> — implement cross-shard transactions using a two-phase-commit-style protocol under the hood, layered with additional mechanisms (like Spanner&apos;s TrueTime) to provide strong consistency guarantees across shards.</li>
              <li><strong>Redis CRDTs (Active-Active / CRDB)</strong> — Redis Enterprise&apos;s active-active geo-replication uses CRDTs for common data types so multiple regions can accept writes simultaneously and converge without conflict, even across a wide-area network with high latency.</li>
            </ul>
            <FlowContinue nextId="interview-questions" label="Interview Questions" />
          </FlowStep>

          <FlowStep id="interview-questions" step={5} total={TOTAL_STEPS} title="Interview Questions">
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
            <FlowContinue nextId="code" label="Code & Output" />
          </FlowStep>

          <FlowStep id="code" step={6} total={TOTAL_STEPS} title="Code & Output">
            <p>
              A deterministic simulation of a G-Counter CRDT. Replica 1 increments its own slot three
              times while offline; Replica 2 increments its own slot five times while offline. When
              they reconnect, merging by taking the element-wise max per replica (then summing) always
              converges to the correct total of 8 — regardless of merge order — with no coordination
              or conflict resolution required.
            </p>
            <CodeTerminal snippets={snippets} />
          </FlowStep>

          <PageNav
            prev={{ label: 'Consensus & Coordination', href: '/pages/distributed-systems/consensus-coordination' }}
            next={{ label: 'Resilience Patterns', href: '/pages/distributed-systems/resilience-patterns' }}
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
