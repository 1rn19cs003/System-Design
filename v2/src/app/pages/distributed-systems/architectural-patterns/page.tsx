import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';

export const metadata = {
  title: 'System Architectures — System Design Architectures',
};

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
          ]}
        />

        <main className="content narrow">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Distributed Systems', href: '/pages/distributed-systems' },
              { label: 'System Architectures' },
            ]}
          />
          <h1 id="overview">System Architectures</h1>
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

          <section id="plain-english">
            <h2>In Plain English</h2>
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
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>
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

            <h4>Advantages of Serverless Architecture</h4>
            <ul>
              <li><strong>No server management:</strong> The cloud provider handles provisioning, patching, and scaling, so your team never touches an OS or a capacity-planning spreadsheet.</li>
              <li><strong>Pay-per-invocation billing:</strong> You're billed for actual execution time and memory used, not for idle server hours — a function that runs once a day costs almost nothing.</li>
              <li><strong>Automatic scaling:</strong> A function handling one request a day and one handling a thousand a second both scale up and down without you provisioning anything ahead of time.</li>
              <li><strong>Faster iteration:</strong> Deploying a single function is a much smaller unit of change than redeploying an entire running service.</li>
            </ul>

            <h4>Disadvantages of Serverless Architecture</h4>
            <ul>
              <li><strong>Cold-start latency:</strong> A fresh instance has to be provisioned and initialized before it can serve its first request, which can add hundreds of milliseconds to seconds of unpredictable latency.</li>
              <li><strong>Execution time limits:</strong> Most providers cap how long a single invocation may run (AWS Lambda tops out at 15 minutes), ruling out long-running or persistently-stateful workloads.</li>
              <li><strong>Vendor lock-in:</strong> Functions are often written against a specific provider's runtime, triggers, and tooling, making a later migration to another provider or to self-hosted infrastructure costly.</li>
              <li><strong>Harder local debugging:</strong> Reproducing the exact provider-managed environment, cold starts, and trigger wiring locally is harder than debugging a normal long-running server process.</li>
            </ul>

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

            <h4>Advantages of Event-Driven Architecture</h4>
            <ul>
              <li><strong>Loose coupling:</strong> Consumers can be added, removed, or changed without ever touching the publisher's code.</li>
              <li><strong>Independent scalability:</strong> Each consumer scales its own instance count based on its own load, so a slow consumer never blocks the publisher or other consumers.</li>
              <li><strong>Resilience to partial failure:</strong> If one consumer goes down, the publisher and every other consumer keep working unaffected, since none of them call each other directly.</li>
              <li><strong>Natural fit for fan-out:</strong> Adding a tenth downstream service that cares about the same event costs nothing extra on the publisher's side.</li>
            </ul>

            <h4>Disadvantages of Event-Driven Architecture</h4>
            <ul>
              <li><strong>No synchronous confirmation:</strong> The publisher never learns whether a consumer actually succeeded, so it can't return "yes, the email was sent" the way a direct call could.</li>
              <li><strong>Eventual consistency:</strong> The system as a whole trades immediate consistency for a window in which different services haven't yet caught up with the same fact.</li>
              <li><strong>Harder debugging:</strong> A single logical operation fans out across services on different schedules, so there's no single stack trace or log file that tells the whole story.</li>
              <li><strong>More operational surface area:</strong> Broker health, retries, dead-letter queues, and ordering guarantees all become things that can independently break.</li>
            </ul>

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
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <p>
              Serverless and event-driven solve different problems — where code runs versus how
              services talk to each other — but interviews usually push on the same question for
              both: what are you actually trading away for the flexibility they buy you? Here&apos;s
              how they compare against the alternative each one replaces.
            </p>

            <h3>Difference Between Serverless Architecture and Event-Driven Architecture</h3>
            <table className="estimate-table">
              <thead>
                <tr>
                  <th>Aspect</th>
                  <th>Serverless Architecture</th>
                  <th>Event-Driven Architecture</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>What it changes</td>
                  <td>Where your code physically runs</td>
                  <td>How services communicate with each other</td>
                </tr>
                <tr>
                  <td>Latency profile</td>
                  <td>15ms warm, 100ms-2s+ on a cold start</td>
                  <td>No added compute latency, but no sync confirmation either</td>
                </tr>
                <tr>
                  <td>Cost model</td>
                  <td>Pay per invocation/execution time</td>
                  <td>Pay for broker throughput and consumer compute</td>
                </tr>
                <tr>
                  <td>Coupling</td>
                  <td>N/A — a deployment/runtime concern, not a coupling concern</td>
                  <td>Loose — publisher never knows who's listening</td>
                </tr>
                <tr>
                  <td>Failure visibility</td>
                  <td>Invocation either errors or succeeds, visible immediately</td>
                  <td>Consumer failures are invisible to the publisher by default</td>
                </tr>
                <tr>
                  <td>Operational complexity</td>
                  <td>Low — no servers to patch, but cold starts and time limits to design around</td>
                  <td>Higher — broker health, retries, dead-letter queues, ordering</td>
                </tr>
                <tr>
                  <td>Real system example</td>
                  <td>AWS Lambda behind an API Gateway</td>
                  <td>Kafka topics feeding independent microservice consumers</td>
                </tr>
              </tbody>
            </table>

            <h3>Why Choose Event-Driven Over Direct Request-Response?</h3>
            <ol>
              <li><strong>Loose coupling:</strong> A publisher never needs to know who&apos;s listening or how many consumers exist. Analogy: It&apos;s like a radio station broadcasting a signal — it doesn&apos;t need to know how many radios are tuned in.</li>
              <li><strong>Independent scalability:</strong> Each consumer scales based on its own load, without the publisher having to coordinate capacity for anyone else. Analogy: It&apos;s like a newspaper printing one edition and letting each newsstand decide how many copies it needs, rather than the printer delivering a fixed number to every stand.</li>
              <li><strong>Resilience to partial failure:</strong> If one consumer goes down, the publisher and every other consumer carry on unaffected. Analogy: It&apos;s like a group chat where one person's phone dies — the conversation continues fine for everyone else.</li>
              <li><strong>Easy extensibility:</strong> Adding a new consumer of an existing event stream costs nothing on the publisher's side. Analogy: It&apos;s like adding another subscriber to a mailing list — the sender's job doesn't change at all.</li>
              <li><strong>Natural fit for fan-out workflows:</strong> One event can trigger inventory, payment, and shipping to react independently and in parallel. Analogy: It&apos;s like ringing one bell in a firehouse and having every relevant crew grab their own gear at once, instead of running to notify each one by hand.</li>
            </ol>

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
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>AWS Lambda, Vercel Functions, Cloudflare Workers</strong> — the major serverless compute platforms, each with different cold-start characteristics (Cloudflare Workers, built on V8 isolates rather than containers, has near-zero cold starts compared to container-based Lambda).</li>
              <li><strong>Netflix and Uber&apos;s event-driven backends</strong> — both run large parts of their platforms on Kafka, publishing domain events (a stream started, a trip completed) that dozens of independent downstream services consume for recommendations, billing, analytics, and fraud detection.</li>
              <li><strong>BitTorrent</strong> — the textbook P2P system: a file is distributed across many peers, each uploading pieces to others while downloading pieces it&apos;s missing, with no central file server required after the initial torrent metadata is found.</li>
              <li><strong>Blockchain networks</strong> (Bitcoin, Ethereum) — P2P networks where every full node maintains and verifies its own copy of the ledger and gossips new transactions/blocks to its peers, with consensus rules (not a central authority) determining the agreed-upon state.</li>
              <li><strong>Skype&apos;s original architecture</strong> — early Skype routed voice calls through a P2P network of &quot;supernodes&quot; (ordinary users&apos; machines with enough bandwidth) rather than centralized servers, which is part of why it scaled so cheaply early on; Microsoft later moved it to centralized, cloud-hosted infrastructure for reliability and control.</li>
            </ul>
          </section>

          <PageNav
            prev={{ label: 'Big Data & Streaming', href: '/pages/distributed-systems/big-data-processing' }}
            next={{ label: 'System Design Tradeoffs', href: '/pages/distributed-systems/system-design-tradeoffs' }}
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
