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
  title: 'Consensus & Coordination — System Design Architectures',
};

const OUTPUT = `Round 1: A knows. Informed: {A}
Round 2: A told B, D. Informed: {A, B, D}
Round 3: B told C, D told E. Informed: {A, B, C, D, E}
Full cluster informed after 3 rounds (5 nodes).`;

const snippets = {
  java: {
    code: `import java.util.*;

public class GossipDemo {
    public static void main(String[] args) {
        // Fixed "random" fanout per round for a deterministic, illustrative run.
        Set<String> informed = new LinkedHashSet<>(List.of("A"));
        Map<String, List<String>> fanout = Map.of(
            "A", List.of("B", "D"),
            "B", List.of("C"),
            "D", List.of("E")
        );

        System.out.println("Round 1: A knows. Informed: " + setToStr(informed));

        List<String> round2New = new ArrayList<>();
        for (String node : List.copyOf(informed)) {
            for (String target : fanout.getOrDefault(node, List.of())) {
                if (informed.add(target)) round2New.add(target);
            }
        }
        System.out.println("Round 2: A told B, D. Informed: " + setToStr(informed));

        List<String> round3New = new ArrayList<>();
        for (String node : round2New) {
            for (String target : fanout.getOrDefault(node, List.of())) {
                if (informed.add(target)) round3New.add(target);
            }
        }
        System.out.println("Round 3: B told C, D told E. Informed: " + setToStr(informed));
        System.out.printf("Full cluster informed after 3 rounds (%d nodes).%n", 5);
    }

    static String setToStr(Set<String> s) {
        return "{" + String.join(", ", s) + "}";
    }
}`,
    output: OUTPUT,
  },
  python: {
    code: `# Fixed "random" fanout per round for a deterministic, illustrative run.
informed = ["A"]
fanout = {"A": ["B", "D"], "B": ["C"], "D": ["E"]}

print(f"Round 1: A knows. Informed: {{{', '.join(informed)}}}")

round2_new = []
for node in list(informed):
    for target in fanout.get(node, []):
        if target not in informed:
            informed.append(target)
            round2_new.append(target)
print(f"Round 2: A told B, D. Informed: {{{', '.join(informed)}}}")

round3_new = []
for node in round2_new:
    for target in fanout.get(node, []):
        if target not in informed:
            informed.append(target)
            round3_new.append(target)
print(f"Round 3: B told C, D told E. Informed: {{{', '.join(informed)}}}")
print("Full cluster informed after 3 rounds (5 nodes).")`,
    output: OUTPUT,
  },
  javascript: {
    code: `// Fixed "random" fanout per round for a deterministic, illustrative run.
const informed = ["A"];
const fanout = { A: ["B", "D"], B: ["C"], D: ["E"] };

console.log(\`Round 1: A knows. Informed: {\${informed.join(", ")}}\`);

const round2New = [];
for (const node of [...informed]) {
  for (const target of fanout[node] || []) {
    if (!informed.includes(target)) {
      informed.push(target);
      round2New.push(target);
    }
  }
}
console.log(\`Round 2: A told B, D. Informed: {\${informed.join(", ")}}\`);

const round3New = [];
for (const node of round2New) {
  for (const target of fanout[node] || []) {
    if (!informed.includes(target)) {
      informed.push(target);
      round3New.push(target);
    }
  }
}
console.log(\`Round 3: B told C, D told E. Informed: {\${informed.join(", ")}}\`);
console.log("Full cluster informed after 3 rounds (5 nodes).");`,
    output: OUTPUT,
  },
  cpp: {
    code: `#include <iostream>
#include <vector>
#include <map>
#include <string>
#include <algorithm>

std::string setToStr(const std::vector<std::string>& v) {
    std::string out = "{";
    for (size_t i = 0; i < v.size(); i++) {
        out += v[i];
        if (i + 1 < v.size()) out += ", ";
    }
    return out + "}";
}

int main() {
    std::vector<std::string> informed = {"A"};
    std::map<std::string, std::vector<std::string>> fanout = {
        {"A", {"B", "D"}}, {"B", {"C"}}, {"D", {"E"}}
    };

    std::cout << "Round 1: A knows. Informed: " << setToStr(informed) << std::endl;

    std::vector<std::string> round2New;
    for (auto& node : std::vector<std::string>(informed)) {
        for (auto& target : fanout[node]) {
            if (std::find(informed.begin(), informed.end(), target) == informed.end()) {
                informed.push_back(target);
                round2New.push_back(target);
            }
        }
    }
    std::cout << "Round 2: A told B, D. Informed: " << setToStr(informed) << std::endl;

    std::vector<std::string> round3New;
    for (auto& node : round2New) {
        for (auto& target : fanout[node]) {
            if (std::find(informed.begin(), informed.end(), target) == informed.end()) {
                informed.push_back(target);
                round3New.push_back(target);
            }
        }
    }
    std::cout << "Round 3: B told C, D told E. Informed: " << setToStr(informed) << std::endl;
    std::cout << "Full cluster informed after 3 rounds (5 nodes)." << std::endl;
    return 0;
}`,
    output: OUTPUT,
  },
};

const qaItems = [
  {
    q: 'What is leader election and why do distributed systems need it?',
    a: "Leader election is the process by which a cluster of nodes agrees on exactly one node to act as coordinator for a given task or time period. It's needed because some jobs (writing to a replicated log, assigning work, breaking ties) only make sense if exactly one node is doing them — without a single agreed leader, two nodes could both think they're in charge and issue conflicting decisions.",
  },
  {
    q: 'Explain the core idea behind the Raft consensus algorithm.',
    a: "Raft replicates a log of operations from a single elected leader to a set of followers. The leader appends a new entry, sends it to followers, and considers the entry committed once a majority (not all) of nodes have acknowledged it. This majority requirement means the system can keep making progress even if a minority of nodes are slow, partitioned, or down, while guaranteeing that any two committed logs agree with each other.",
  },
  {
    q: "What's the difference between a gossip protocol and a leader-based consensus protocol?",
    a: "Leader-based protocols (Raft, Paxos) have a single coordinator driving agreement, which gives strong, immediate consistency guarantees but requires re-electing a leader if it fails. Gossip protocols have no coordinator at all — nodes periodically share state with random peers, and information eventually reaches everyone. Gossip is simpler and more resilient to any single node failing, but only offers eventual consistency, not the immediate agreement a leader-based protocol provides.",
  },
  {
    q: 'How does a heartbeat mechanism detect a failed node, and what can go wrong with a naive implementation?',
    a: "Each node periodically sends a lightweight 'I'm alive' signal to a monitor or its peers; if the monitor doesn't receive a heartbeat within an expected window (usually a few missed intervals, not just one), it marks the node as failed. The naive failure mode is false positives: a node that's alive but briefly slow (GC pause, network blip) can get marked dead and removed from service, then come back and conflict with whatever took over its role — this is why real systems use both a grace period and a proper leader-election handoff rather than an instant cutover.",
  },
];

export default function ConsensusCoordinationPage() {
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
              { label: 'Consensus & Coordination' },
            ]}
          />
          <h1 id="overview">Consensus &amp; Coordination</h1>
          <p>
            The moment a system has more than one server, you inherit a new question that a single
            machine never has to ask: how do independent nodes, each with their own view of the
            world and no shared memory, agree on one truth? This page covers the mechanisms that
            make that possible — detecting failure, electing a coordinator, and reaching agreement
            even when some nodes are slow, unreachable, or actively wrong.
          </p>

          <FlowStep id="plain-english" step={1} total={TOTAL_STEPS} title="In Plain English" defaultOpen>
            <p>
              Think of a group project with five people and no manager. Someone has to decide who
              submits the final file — that&apos;s leader election. If that person goes silent for a
              week, the group needs a way to notice and pick someone new — that&apos;s failure
              detection via heartbeats. And if there&apos;s no single leader at all, information
              still needs to reach everyone eventually, the way gossip spreads through a friend
              group one conversation at a time — that&apos;s a gossip protocol.
            </p>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  Every idea on this page answers one question: &quot;how do machines that
                  can&apos;t fully trust each other or the network still agree on something?&quot;
                  Heartbeats answer &quot;is it still there?&quot;, leader election answers
                  &quot;who&apos;s in charge?&quot;, and consensus algorithms answer &quot;what did
                  we actually agree to?&quot;
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  The hard part isn&apos;t the happy path — it&apos;s reasoning about what happens
                  during a network partition, when two groups of nodes can each talk internally but
                  not to each other. A correct consensus protocol must guarantee that at most one
                  side makes progress, or you end up with two &quot;leaders&quot; issuing
                  contradictory decisions (a split-brain scenario).
                </p>
              </Callout>
            </TwoCol>
            <FlowContinue nextId="theory" label="Theory & Diagrams" />
          </FlowStep>

          <FlowStep id="theory" step={2} total={TOTAL_STEPS} title="Theory & Diagrams">
            <h3>Heartbeats &amp; failure detection</h3>
            <p>
              A heartbeat is a small, periodic signal a node sends to prove it&apos;s still alive
              and reachable. A monitor (or the node&apos;s peers directly) tracks the time since the
              last heartbeat from each node; missing several consecutive intervals is treated as a
              failure, triggering removal from a load balancer&apos;s pool, a failover, or a new
              leader election.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-consensus/heartbeat-monitoring.svg"
                alt="A monitor tracking heartbeats from three nodes; two are sending regular heartbeats and marked alive, while the third has missed several consecutive beats and is marked dead"
              />
              <figcaption>Failure detection is really just &quot;how long has it been since we last heard from you?&quot;</figcaption>
            </figure>

            <h3>Leader election</h3>
            <p>
              Leader election lets a cluster of otherwise-equal nodes agree on exactly one
              coordinator, usually via a voting process where a candidate needs a <strong>majority</strong>{' '}
              of votes to win. Using a majority (rather than unanimous agreement) is the key trick —
              it means the system can keep electing leaders and making progress even if a minority
              of nodes are down or unreachable, as long as more than half are healthy and can
              communicate.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-consensus/leader-election.svg"
                alt="Five equal peer nodes before an election, then after: three of the five voted for Node C, making it the leader, with the rest becoming followers"
              />
              <figcaption>A majority, not unanimity, is what makes the system fault-tolerant</figcaption>
            </figure>

            <h3>Consensus algorithms: Raft and Paxos</h3>
            <p>
              Once a leader exists, <strong>consensus algorithms</strong> like Raft and Paxos define
              exactly how it replicates operations (a write, a config change) to the rest of the
              cluster while guaranteeing every node that commits an entry agrees on the same value —
              even across leader crashes and network partitions. Raft is generally taught first
              because it was explicitly designed to be more understandable than Paxos while giving
              the same core guarantees: a leader proposes an entry, followers acknowledge it, and
              the entry is committed once a majority have persisted it.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-consensus/raft-consensus.svg"
                alt="A leader replicating a log entry to three followers; two acknowledge quickly and the entry is committed on reaching a majority, while a third, slow follower has not yet responded"
              />
              <figcaption>The entry is safely committed the instant a majority acknowledges — the slow follower catches up later</figcaption>
            </figure>

            <h3>Gossip protocols</h3>
            <p>
              Gossip (epidemic) protocols take the opposite approach to leader-based consensus: there
              is no coordinator at all. Each round, every node that knows a piece of information
              shares it with a small, random subset of peers. Information spreads exponentially — the
              same mathematical pattern as a rumor or a virus — reaching the whole cluster in
              O(log N) rounds without any single point of coordination or failure.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-consensus/gossip-protocol.svg"
                alt="Round 1: only Node A knows an update. Round 3: after nodes randomly gossip with peers each round, all five nodes know the update, with no central coordinator involved"
              />
              <figcaption>No leader required — just make sure information keeps spreading</figcaption>
            </figure>
            <FlowContinue nextId="trade-offs" label="Trade-offs" />
          </FlowStep>

          <FlowStep id="trade-offs" step={3} total={TOTAL_STEPS} title="Trade-offs">
            <TwoCol>
              <Callout kind="good" title="✓ Reach for leader-based consensus (Raft/Paxos) when">
                <ul>
                  <li>You need strong consistency — every committed value must be immediately agreed upon (a replicated log, a distributed lock, cluster configuration).</li>
                  <li>The cluster is small to moderate in size — consensus protocols don&apos;t scale well past dozens of nodes due to the coordination overhead.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Reach for gossip protocols when">
                <ul>
                  <li>You&apos;re propagating loosely-time-sensitive state (cluster membership, node health) across a very large number of nodes.</li>
                  <li>Eventual consistency is acceptable, and you want a protocol with no single point of failure and near-zero coordination overhead.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that you understand
              <em> why</em> a majority quorum (not unanimity) is the mechanism that makes these
              systems fault-tolerant, and that you can name the actual failure mode being defended
              against — a network partition producing two isolated groups that could otherwise both
              elect a leader and diverge (split-brain).
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to explain, in your own words,
              why a distributed system needs a leader at all — and that heartbeats are how failure
              gets detected in the first place — covers the core of what most interviews check for
              here.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to reason about what happens
              during a network partition specifically — which side (if either) keeps making
              progress, and why a majority-based protocol prevents both sides from committing
              conflicting writes simultaneously.
            </p>
            <FlowContinue nextId="real-world" label="Real-World Examples" />
          </FlowStep>

          <FlowStep id="real-world" step={4} total={TOTAL_STEPS} title="Real-World Examples">
            <ul>
              <li><strong>etcd &amp; Kubernetes</strong> — etcd uses Raft to replicate cluster state consistently across nodes; Kubernetes relies on etcd as its source of truth for the entire cluster&apos;s configuration.</li>
              <li><strong>Apache ZooKeeper</strong> — uses a Paxos-inspired protocol (ZAB) for leader election and coordination, historically the backbone of Kafka&apos;s and Hadoop&apos;s cluster coordination before Kafka moved to its own Raft-based controller (KRaft).</li>
              <li><strong>Cassandra</strong> — uses a gossip protocol for cluster membership and failure detection, letting nodes discover and track each other&apos;s state without any central coordinator.</li>
              <li><strong>Amazon DynamoDB</strong> — uses gossip-style protocols internally for membership and failure detection, prioritizing availability over immediate strong consistency by design.</li>
              <li><strong>Redis Sentinel &amp; Redis Cluster</strong> — use heartbeats and a quorum-based voting process to detect a failed primary and promote a replica automatically.</li>
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
              A simplified, deterministic simulation of gossip propagation across 5 nodes. Real
              gossip protocols pick peers randomly each round; this demo uses a fixed fanout so the
              output is identical every run, in every language, while still showing the same
              exponential spread — 1 node informed, then 3, then all 5, in three rounds.
            </p>
            <CodeTerminal snippets={snippets} />
          </FlowStep>

          <PageNav
            prev={{ label: 'Distributed Systems', href: '/pages/distributed-systems' }}
            next={{ label: 'Distributed Transactions & State', href: '/pages/distributed-systems/distributed-transactions' }}
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
