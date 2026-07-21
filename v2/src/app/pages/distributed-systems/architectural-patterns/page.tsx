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
  title: 'Architectural Patterns — System Design Architectures',
};

const OUTPUT = `[email-notifier] OrderPlaced(order=1001) -> sending confirmation email to user 42
[analytics-logger] OrderPlaced(order=1001) -> logged event OrderPlaced for order 1001
[email-notifier] PaymentFailed(order=1001) -> sending payment-failed alert to user 42
[analytics-logger] PaymentFailed(order=1001) -> logged event PaymentFailed for order 1001
[email-notifier] OrderShipped(order=1001) -> sending shipping notification to user 42
[analytics-logger] OrderShipped(order=1001) -> logged event OrderShipped for order 1001
Both subscribers independently processed all 3 events. Publisher never called either one directly.`;

const snippets = {
  java: {
    code: `import java.util.*;
import java.util.function.Consumer;

public class EventDrivenDemo {
    record Event(String type, int orderId) {}

    public static void main(String[] args) {
        List<Event> events = List.of(
            new Event("OrderPlaced", 1001),
            new Event("PaymentFailed", 1001),
            new Event("OrderShipped", 1001)
        );

        // Two independent subscribers - neither knows the other exists.
        Consumer<Event> emailNotifier = e -> {
            String action = switch (e.type()) {
                case "OrderPlaced" -> "sending confirmation email to user 42";
                case "PaymentFailed" -> "sending payment-failed alert to user 42";
                case "OrderShipped" -> "sending shipping notification to user 42";
                default -> "ignoring unknown event";
            };
            System.out.printf("[email-notifier] %s(order=%d) -> %s%n", e.type(), e.orderId(), action);
        };

        Consumer<Event> analyticsLogger = e ->
            System.out.printf("[analytics-logger] %s(order=%d) -> logged event %s for order %d%n",
                e.type(), e.orderId(), e.type(), e.orderId());

        List<Consumer<Event>> subscribers = List.of(emailNotifier, analyticsLogger);

        // Publisher pushes to a topic; it never calls a subscriber directly.
        for (Event event : events) {
            for (Consumer<Event> subscriber : subscribers) {
                subscriber.accept(event);
            }
        }

        System.out.println("Both subscribers independently processed all 3 events. Publisher never called either one directly.");
    }
}`,
    output: OUTPUT,
  },
  python: {
    code: `from dataclasses import dataclass

@dataclass
class Event:
    type: str
    order_id: int

events = [
    Event("OrderPlaced", 1001),
    Event("PaymentFailed", 1001),
    Event("OrderShipped", 1001),
]

# Two independent subscribers - neither knows the other exists.
def email_notifier(e: Event):
    actions = {
        "OrderPlaced": "sending confirmation email to user 42",
        "PaymentFailed": "sending payment-failed alert to user 42",
        "OrderShipped": "sending shipping notification to user 42",
    }
    action = actions.get(e.type, "ignoring unknown event")
    print(f"[email-notifier] {e.type}(order={e.order_id}) -> {action}")

def analytics_logger(e: Event):
    print(f"[analytics-logger] {e.type}(order={e.order_id}) -> logged event {e.type} for order {e.order_id}")

subscribers = [email_notifier, analytics_logger]

# Publisher pushes to a topic; it never calls a subscriber directly.
for event in events:
    for subscriber in subscribers:
        subscriber(event)

print("Both subscribers independently processed all 3 events. Publisher never called either one directly.")`,
    output: OUTPUT,
  },
  javascript: {
    code: `const events = [
  { type: "OrderPlaced", orderId: 1001 },
  { type: "PaymentFailed", orderId: 1001 },
  { type: "OrderShipped", orderId: 1001 },
];

// Two independent subscribers - neither knows the other exists.
function emailNotifier(e) {
  const actions = {
    OrderPlaced: "sending confirmation email to user 42",
    PaymentFailed: "sending payment-failed alert to user 42",
    OrderShipped: "sending shipping notification to user 42",
  };
  const action = actions[e.type] || "ignoring unknown event";
  console.log(\`[email-notifier] \${e.type}(order=\${e.orderId}) -> \${action}\`);
}

function analyticsLogger(e) {
  console.log(\`[analytics-logger] \${e.type}(order=\${e.orderId}) -> logged event \${e.type} for order \${e.orderId}\`);
}

const subscribers = [emailNotifier, analyticsLogger];

// Publisher pushes to a topic; it never calls a subscriber directly.
for (const event of events) {
  for (const subscriber of subscribers) {
    subscriber(event);
  }
}

console.log("Both subscribers independently processed all 3 events. Publisher never called either one directly.");`,
    output: OUTPUT,
  },
  cpp: {
    code: `#include <iostream>
#include <vector>
#include <functional>
#include <string>
#include <map>

struct Event {
    std::string type;
    int orderId;
};

int main() {
    std::vector<Event> events = {
        {"OrderPlaced", 1001},
        {"PaymentFailed", 1001},
        {"OrderShipped", 1001}
    };

    // Two independent subscribers - neither knows the other exists.
    auto emailNotifier = [](const Event& e) {
        std::map<std::string, std::string> actions = {
            {"OrderPlaced", "sending confirmation email to user 42"},
            {"PaymentFailed", "sending payment-failed alert to user 42"},
            {"OrderShipped", "sending shipping notification to user 42"}
        };
        std::string action = actions.count(e.type) ? actions[e.type] : "ignoring unknown event";
        std::cout << "[email-notifier] " << e.type << "(order=" << e.orderId << ") -> " << action << std::endl;
    };

    auto analyticsLogger = [](const Event& e) {
        std::cout << "[analytics-logger] " << e.type << "(order=" << e.orderId << ") -> logged event "
                   << e.type << " for order " << e.orderId << std::endl;
    };

    std::vector<std::function<void(const Event&)>> subscribers = {emailNotifier, analyticsLogger};

    // Publisher pushes to a topic; it never calls a subscriber directly.
    for (const auto& event : events) {
        for (auto& subscriber : subscribers) {
            subscriber(event);
        }
    }

    std::cout << "Both subscribers independently processed all 3 events. Publisher never called either one directly." << std::endl;
    return 0;
}`,
    output: OUTPUT,
  },
};

const qaItems = [
  {
    q: 'What is a cold start, and when does it actually matter?',
    a: "A cold start is the extra latency paid the first time a serverless function runs on a fresh instance — the platform has to provision a container, load the runtime, and initialize your code before it can handle the request, which can add anywhere from tens of milliseconds to a couple of seconds depending on runtime and package size. It matters most for latency-sensitive, user-facing endpoints with spiky or infrequent traffic (an API that goes idle between bursts); it matters far less for background jobs, scheduled tasks, or high-traffic endpoints that stay warm because instances are constantly reused.",
  },
  {
    q: 'What are the real trade-offs between event-driven and request-response (direct call) communication?',
    a: "Request-response is simple to reason about — the caller gets an immediate result or error, and a single stack trace usually shows you the whole path. Event-driven trades that immediacy for loose coupling: a publisher doesn't need to know who's listening, consumers can be added or removed without touching the publisher, and each consumer can scale independently. The cost is that the publisher no longer gets a synchronous answer (did the email actually send? you don't know from the publish call), and the system now has eventual consistency and more moving parts to fail (a broker, retries, dead-letter queues) instead of one HTTP call.",
  },
  {
    q: 'Why are P2P systems hard to keep consistent?',
    a: "There's no single node holding the authoritative state, so there's nothing to synchronously check a write against the way you'd check a single database. Every node has its own local view, and that view can lag or conflict with other nodes' views depending on which peers it has recently talked to. Reconciling those views requires either a lot of gossip-style propagation and conflict resolution, or accepting a weaker consistency model (eventual consistency) from the outset — you generally can't get single-writer-style strong consistency in a leaderless, fully decentralized system without some coordination layer bolted back on.",
  },
  {
    q: 'When is serverless a poor fit?',
    a: "Serverless struggles with long-running processes, since most providers cap execution time per invocation (AWS Lambda tops out at 15 minutes) — a video transcoding job or a long batch computation doesn't fit that model well. It's also a poor fit for workloads that need to hold state or a persistent connection in memory between requests (a WebSocket server, an in-memory cache warmed over time, a stateful game server), because each invocation may run on a different, freshly-provisioned instance with no guarantee of reusing prior in-memory state. Predictable, sustained, high-volume traffic is often cheaper on always-on servers too, since per-invocation billing stops being an advantage once you're invoking constantly.",
  },
  {
    q: "How does event-driven architecture change how you debug a single request's path?",
    a: "In a request-response system, one request maps to one call stack, and a stack trace or a single log file usually tells the whole story. In an event-driven system, a single logical operation (e.g., placing an order) fans out into multiple independent, asynchronously-processed events handled by different services on different schedules — there's no single stack trace spanning all of it. This is why event-driven systems lean heavily on distributed tracing (a correlation/trace ID attached to the original event and propagated through every consumer) and centralized log aggregation — without them, reconstructing 'what happened to this one order' means manually cross-referencing logs across several unrelated services.",
  },
  {
    q: 'How do serverless, event-driven, and P2P relate to microservices and client-server, which this site already covers?',
    a: "They're not a replacement for those two, they're additional shapes a system can take, and most real systems combine several. Client-server is the baseline relationship almost everything else refines. Microservices split a monolith into independently deployable, independently owned services that still mostly talk over direct request-response calls. Serverless is really about *where* code runs (provider-managed, ephemeral, pay-per-invocation) rather than about how services are decomposed — you can build a microservice's individual endpoints as Lambda functions. Event-driven is about *how* services communicate (through events on a broker rather than direct calls) and is very often layered on top of a microservices decomposition. P2P is the most radical departure — it removes the client/server distinction and any central authority entirely, which is why it's used for narrower use cases (file sharing, blockchain) rather than typical backend systems.",
  },
];

export default function ArchitecturalPatternsPage() {
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
              { label: 'Architectural Patterns' },
            ]}
          />
          <h1 id="overview">Architectural Patterns</h1>
          <p>
            &quot;Client-server&quot; and &quot;microservices&quot; (covered on their own pages
            elsewhere in this guide) are two shapes a system can take, not the only two. This page
            rounds out the full picture: <strong>serverless</strong> architecture, which changes
            <em> where</em> your code physically runs; <strong>event-driven</strong> architecture,
            which changes <em>how</em> services talk to each other; and{' '}
            <strong>peer-to-peer</strong> architecture, which removes the client/server split
            entirely. Almost every real production system is a blend of several of these, not a
            pure instance of one.
          </p>

          <FlowStep id="plain-english" step={1} total={TOTAL_STEPS} title="In Plain English" defaultOpen>
            <p>
              Imagine three different ways to run a restaurant kitchen. <strong>Serverless</strong> is
              like a shared commercial kitchen you only pay for by the hour you actually cook in —
              you show up, the stove is ready (or takes a minute to preheat if it&apos;s been cold),
              you cook, and you leave; you never own or maintain the kitchen itself.{' '}
              <strong>Event-driven</strong> is like a kitchen where the chef just calls out
              &quot;order up!&quot; to the room, and whichever staff care about that ticket — the
              expediter, the dishwasher tracking volume, the inventory clerk — react on their own,
              without the chef personally walking over and telling each one individually.{' '}
              <strong>Peer-to-peer</strong> is like a potluck dinner with no host kitchen at all —
              everyone brings a dish and shares directly with whoever&apos;s nearby, and the dinner
              carries on fine even if any one person doesn&apos;t show up.
            </p>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  You don&apos;t need to memorize every trade-off yet. Just come away knowing that
                  &quot;serverless&quot; is about who manages the machine (the cloud provider, not
                  you), &quot;event-driven&quot; is about services talking through a shared mailbox
                  instead of calling each other&apos;s phone directly, and &quot;P2P&quot; means
                  there&apos;s no dedicated server at all — every participant is also a server to
                  everyone else.
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  The interesting design question is almost never &quot;which one pattern should
                  this whole system use&quot; — it&apos;s where the boundaries fall. A typical modern
                  backend might run its API on containers (not serverless), fire domain events onto
                  Kafka for a handful of downstream consumers (event-driven), and use a serverless
                  function only for one bursty, infrequent job like image thumbnailing. Knowing which
                  parts of a system benefit from which shape is the actual skill being tested.
                </p>
              </Callout>
            </TwoCol>
            <FlowContinue nextId="theory" label="Theory & Diagrams" />
          </FlowStep>

          <FlowStep id="theory" step={2} total={TOTAL_STEPS} title="Theory & Diagrams">
            <h3>Serverless architecture</h3>
            <p>
              In a serverless architecture, you deploy individual functions rather than a running
              server process — the cloud provider (AWS Lambda, Google Cloud Functions, Cloudflare
              Workers, Vercel Functions) is responsible for provisioning, scaling, and tearing down
              the actual compute that runs your code. Requests typically arrive through a managed
              entry point like an API Gateway, which routes each call to a function instance; if no
              warm instance is available, the platform provisions a brand-new one on the spot. You
              pay per invocation (and per unit of execution time/memory), not for idle server hours —
              a function that handles one request a day and one that handles a thousand a second both
              scale automatically without you provisioning capacity ahead of time.
            </p>
            <p>
              The catch is the <strong>cold start</strong>: a fresh instance has to be provisioned,
              the runtime initialized, and your code&apos;s top-level initialization executed before
              it can process its first request, adding latency that a warm, already-running instance
              doesn&apos;t pay. Most providers also cap how long a single invocation may run (AWS
              Lambda&apos;s hard limit is 15 minutes), which rules out serverless for long-running or
              persistently-stateful workloads.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-architecture/serverless-architecture.svg"
                alt="A client calls an API Gateway, which routes to ephemeral function instances that spin up on demand, with one instance shown paying a cold-start penalty and a managed database behind them"
              />
              <figcaption>Instances scale to zero and back — the price is a cold-start tax on the first request to a fresh one</figcaption>
            </figure>

            <p>
              Concretely, a cold start is three sequential costs stacked before your code ever runs: the
              platform has to <strong>provision a container</strong> (allocate compute, pull or mount
              the deployment package), then <strong>initialize the language runtime</strong> (start the
              JVM, the Python interpreter, the Node.js process), then execute your own{' '}
              <strong>top-level initialization code</strong> — opening a database connection pool,
              loading a config file, instantiating an SDK client — before it can finally hand your
              handler function the actual request. A warm invocation skips all three and goes straight
              to handling the request, which is why the same endpoint can respond in 15ms on one call
              and 800ms+ on the next if the platform happened to spin up a fresh instance for it. The
              production pitfall this causes is invisible p99 latency spikes that don&apos;t reproduce
              in a load test: a load test keeps instances warm through sustained traffic, while real
              user traffic that&apos;s bursty or has long idle gaps keeps triggering fresh cold starts
              that never show up until the feature is already live.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-architecture/cold-start-timeline.svg"
                alt="A cold invocation pays container provisioning, runtime init, and application init-code time before handling the request, while a warm invocation on a reused instance skips straight to handling the request"
              />
              <figcaption>Same request-handling cost either way — the entire difference is the setup paid before it</figcaption>
            </figure>

            <h3>Event-driven architecture</h3>
            <p>
              This site&apos;s HLD Message Queues page already covers the mechanics of publish/subscribe
              and message brokers — event-driven architecture is the system-wide design philosophy
              built on top of that plumbing. Instead of one service calling another directly (and
              having to know its address, its API shape, and being blocked waiting on its response),
              services publish <strong>events</strong> — facts about something that already happened,
              like &quot;OrderPlaced&quot; — to a broker or topic. Any number of other services can
              subscribe to that event stream and react independently, without the publisher knowing
              or caring who&apos;s listening, how many consumers there are, or what they do with the
              event.
            </p>
            <p>
              This buys <strong>loose coupling</strong> (consumers can be added, removed, or changed
              without touching the publisher) and <strong>independent scalability</strong> (a slow
              consumer doesn&apos;t block the publisher or other consumers, and each can scale its own
              instance count based on its own load). The cost is that the publisher gets no
              synchronous confirmation that a consumer actually succeeded, and the system as a whole
              trades immediate consistency for eventual consistency and more operational surface area
              (broker health, retries, dead-letter queues, ordering guarantees).
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-architecture/event-driven-architecture.svg"
                alt="Contrast between a direct-call architecture where a service must call each downstream consumer individually, and an event-driven architecture where a service publishes one event to a broker and independent subscribers each consume it on their own"
              />
              <figcaption>The publisher writes to a topic once — it never needs to know who, or how many, are listening</figcaption>
            </figure>

            <p>
              There are two distinct styles of coordinating an event-driven flow, and interviews often
              probe whether you know the difference. <strong>Choreography</strong> is the fully
              decentralized style: every service subscribes directly to the events it cares about and
              decides its own reaction, with no service directing the others — an{' '}
              <code>OrderPlaced</code> event might be independently picked up by an inventory service
              (reserve stock), a payment service (charge the card), and a shipping service (schedule a
              pickup), none of which call each other or know the others exist.{' '}
              <strong>Orchestration</strong> keeps a central coordinator that explicitly calls each
              service in sequence and tracks the overall workflow&apos;s state. Choreography maximizes
              decoupling but makes the overall business process harder to see in one place — the
              actual production pitfall is that when payment fails after inventory has already
              reserved stock, nothing automatically undoes the reservation, because no single service
              has visibility into the whole flow; someone has to explicitly build a compensating
              action (listening for a <code>PaymentFailed</code> event and releasing the reserved
              stock) rather than relying on a rollback the way a single database transaction would give
              you for free.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-architecture/event-choreography.svg"
                alt="Order Service publishes one OrderPlaced event to a broker, and Inventory, Payment, and Shipping services each independently subscribe and react without calling each other directly, with no central orchestrator coordinating the sequence"
              />
              <figcaption>Choreography: every service reacts on its own — no conductor, and no free rollback if one step fails</figcaption>
            </figure>

            <h3>Peer-to-peer (P2P) architecture</h3>
            <p>
              A P2P architecture removes the client/server distinction entirely: every node
              (&quot;peer&quot;) can act as both a client, requesting resources from others, and a
              server, providing resources to others. There is no central authority coordinating the
              network — peers discover each other (via a bootstrap list, a distributed hash table, or
              a tracker) and exchange data directly. BitTorrent is the canonical example: a file is
              split into pieces, and peers download different pieces from different peers
              simultaneously while also uploading pieces they already have to others, rather than
              every participant downloading the whole file from one central server.
            </p>
            <p>
              The upside is resilience and scalability that don&apos;t depend on any single machine —
              there&apos;s no single point of failure, and the network&apos;s total capacity actually
              grows as more peers join, since each new peer adds both demand and supply. The downside
              is that consistency and discovery become genuinely hard problems: with no central node
              holding the authoritative state, reconciling what different peers believe to be true
              requires its own protocols (gossip, consensus, or accepting eventual consistency), and
              finding peers in the first place usually still needs at least a lightweight bootstrapping
              mechanism.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-architecture/p2p-network.svg"
                alt="Client-server model where every peer depends on one central server, contrasted with a peer-to-peer mesh where nodes connect directly to each other with no central server"
              />
              <figcaption>No central server to depend on — but also no central place to ask &quot;what&apos;s actually true?&quot;</figcaption>
            </figure>

            <h3>Where this fits alongside client-server and microservices</h3>
            <p>
              This site&apos;s HLD Fundamentals page covers the client-server model, and the HLD
              Microservices page covers splitting a system into independently owned services — both
              foundational, and both worth reading first if you haven&apos;t already. The patterns on
              this page aren&apos;t competitors to those two so much as additional axes a system can
              move along: serverless changes who manages your compute, event-driven changes how
              services communicate, and P2P removes centralization altogether. Most production
              systems combine several — a microservices backend that communicates partly via direct
              calls and partly via events, with one or two bursty jobs handled serverlessly.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-architecture/architecture-spectrum.svg"
                alt="A spectrum from centralized to distributed: Monolith, Client-Server, Microservices, Serverless, Event-Driven, and Peer-to-Peer, with more distributed shapes trading simplicity for independent scalability and resilience"
              />
              <figcaption>Not a ladder to climb — a set of tools, most systems use several at once</figcaption>
            </figure>
            <FlowContinue nextId="trade-offs" label="Trade-offs" />
          </FlowStep>

          <FlowStep id="trade-offs" step={3} total={TOTAL_STEPS} title="Trade-offs">
            <TwoCol>
              <Callout kind="good" title="✓ Reach for serverless / event-driven when">
                <ul>
                  <li>Workloads are short-lived, bursty, or infrequent — you don&apos;t want to pay for idle capacity (serverless).</li>
                  <li>You want to add new consumers of an existing data stream without touching the producer, or let each consumer scale independently (event-driven).</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Avoid them when">
                <ul>
                  <li>The workload is long-running, needs a persistent connection, or holds significant in-memory state between calls — serverless execution limits and cold, stateless instances fight you.</li>
                  <li>You need a synchronous, immediate answer with a single traceable call path — event-driven&apos;s asynchronous, fan-out nature adds debugging overhead you may not need.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that you pick the pattern based
              on the actual traffic shape and coupling needs of the problem, not by default — and
              that you can name the concrete cost of each choice (cold starts for serverless, lost
              synchronous confirmation and harder tracing for event-driven, consistency and discovery
              complexity for P2P) rather than treating any of them as a free upgrade.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to explain what &quot;serverless
              doesn&apos;t mean no servers&quot; actually means (you don&apos;t manage them, someone
              else does), and that event-driven means services communicate through events rather than
              direct calls, covers most of what gets asked here at the entry level.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to reason about where in a real
              system you&apos;d draw the event-driven boundary — which interactions genuinely benefit
              from decoupling versus which ones just need a normal API call — and why P2P is rarely
              chosen for typical backend services despite its resilience story.
            </p>
            <FlowContinue nextId="real-world" label="Real-World Examples" />
          </FlowStep>

          <FlowStep id="real-world" step={4} total={TOTAL_STEPS} title="Real-World Examples">
            <ul>
              <li><strong>AWS Lambda, Vercel Functions, Cloudflare Workers</strong> — the major serverless compute platforms, each with different cold-start characteristics (Cloudflare Workers, built on V8 isolates rather than containers, has near-zero cold starts compared to container-based Lambda).</li>
              <li><strong>Netflix and Uber&apos;s event-driven backends</strong> — both run large parts of their platforms on Kafka, publishing domain events (a stream started, a trip completed) that dozens of independent downstream services consume for recommendations, billing, analytics, and fraud detection.</li>
              <li><strong>BitTorrent</strong> — the textbook P2P system: a file is distributed across many peers, each uploading pieces to others while downloading pieces it&apos;s missing, with no central file server required after the initial torrent metadata is found.</li>
              <li><strong>Blockchain networks</strong> (Bitcoin, Ethereum) — P2P networks where every full node maintains and verifies its own copy of the ledger and gossips new transactions/blocks to its peers, with consensus rules (not a central authority) determining the agreed-upon state.</li>
              <li><strong>Skype&apos;s original architecture</strong> — early Skype routed voice calls through a P2P network of &quot;supernodes&quot; (ordinary users&apos; machines with enough bandwidth) rather than centralized servers, which is part of why it scaled so cheaply early on; Microsoft later moved it to centralized, cloud-hosted infrastructure for reliability and control.</li>
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
              A minimal, deterministic simulation of an event-driven system: a fixed list of 3
              events is &quot;published&quot; to a topic, and two independent subscribers — an
              email-notifier and an analytics-logger — each process every event on their own,
              printing what they did. Neither subscriber calls the other, and the publisher never
              calls either subscriber directly; both simply react to the same event stream. Output is
              identical across all four languages.
            </p>
            <CodeTerminal snippets={snippets} />
          </FlowStep>

          <PageNav
            prev={{ label: 'Big Data Processing', href: '/pages/distributed-systems/big-data-processing' }}
            next={{ label: 'Observability & Security', href: '/pages/distributed-systems/observability-security' }}
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
