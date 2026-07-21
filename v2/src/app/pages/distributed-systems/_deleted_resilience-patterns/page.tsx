import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import FlowStep from '@/components/FlowStep';
import FlowContinue from '@/components/FlowContinue';

const TOTAL_STEPS = 4;

export const metadata = {
  title: 'Resilience Patterns — System Design Architectures',
};

export default function ResiliencePatternsPage() {
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
              { label: 'Resilience Patterns' },
            ]}
          />
          <h1 id="overview">Resilience Patterns</h1>
          <p>
            In a distributed system, failure isn&apos;t an edge case — it&apos;s a constant, ambient
            condition. Networks drop packets, disks fill up, a downstream dependency has a bad
            deploy, and any of these can happen at any moment to any one of dozens of services your
            request touches. The patterns on this page aren&apos;t about preventing failure (you
            can&apos;t), they&apos;re about containing it — stopping one component&apos;s bad day
            from becoming everyone&apos;s bad day. That means detecting a failing dependency and
            backing off from it (circuit breakers), applying cross-cutting protection uniformly
            without touching application code (sidecars, service mesh), and understanding precisely
            how a single slow component turns into a full outage so you can interrupt that chain
            (cascading failures, bulkheads, timeouts).
          </p>

          <FlowStep id="plain-english" step={1} total={TOTAL_STEPS} title="In Plain English" defaultOpen>
            <p>
              Picture calling a friend who never picks up. The first few times, you call, let it
              ring out, and hang up — that costs you a little time each try. After enough unanswered
              calls, you stop trying altogether for a while — you&apos;ve effectively &quot;opened the
              circuit&quot; on that friend — and only try again occasionally to check if they&apos;re
              back. That&apos;s a circuit breaker. A sidecar is like a personal assistant who
              travels everywhere with one specific employee, handling their calls, note-taking, and
              scheduling without the employee having to change how they do their actual job; a
              service mesh is what you get when every employee in the company has that same kind of
              assistant, all coordinated by one central office that sets consistent policy for
              everyone. And a cascading failure is the classic story of one clogged highway lane
              causing gridlock for miles behind it — a bulkhead is the equivalent of having separate
              lanes reserved for different types of traffic, so congestion in one lane doesn&apos;t
              stop the others from moving.
            </p>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  The core idea behind every pattern here is the same: don&apos;t let a problem in one
                  place spread everywhere else. Circuit breakers stop a caller from repeatedly hitting
                  a service that&apos;s already struggling. Bulkheads and timeouts stop one slow
                  dependency from starving resources needed by unrelated requests. Sidecars and
                  service meshes are really about consistency — applying the same protective behavior
                  (retries, timeouts, TLS) everywhere without every team reimplementing it.
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  The interesting design question isn&apos;t &quot;should I add a circuit breaker,&quot;
                  it&apos;s where in the call graph the breaker, bulkhead, and timeout boundaries
                  should sit, and what their thresholds should be — too aggressive and you trip on
                  normal load spikes and reduce availability yourself; too lenient and you don&apos;t
                  contain the failure before it cascades. Be ready to reason about the interaction
                  between retries, backoff/jitter, and circuit breakers together, since a naive retry
                  policy can actively defeat a circuit breaker&apos;s purpose.
                </p>
              </Callout>
            </TwoCol>
            <FlowContinue nextId="theory" label="Theory & Diagrams" />
          </FlowStep>

          <FlowStep id="theory" step={2} total={TOTAL_STEPS} title="Theory & Diagrams">
            <h3>Circuit breaker</h3>
            <p>
              A circuit breaker wraps calls to a downstream dependency and tracks their outcomes. In
              the <strong>closed</strong> state, calls pass through normally while the breaker counts
              consecutive (or rate-based) failures; once that count crosses a configured{' '}
              <strong>failure threshold</strong>, the breaker trips to <strong>open</strong>, and every
              subsequent call is short-circuited immediately — failing fast without ever touching the
              downstream service — for a configured timeout window. After that window elapses, the
              breaker moves to <strong>half-open</strong> and allows a small number of trial calls
              through: if they succeed, the breaker closes again and normal traffic resumes; if they
              fail, it reopens and the timeout starts over. This gives you both protection (stop
              hammering a failing service, stop your own threads from piling up waiting on it) and
              automatic recovery detection, without a human having to flip anything manually.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-resilience/circuit-breaker-states.svg"
                alt="A state machine with closed transitioning to open after a failure threshold is reached, open transitioning to half-open after a timeout, and half-open transitioning back to closed on a successful trial call or back to open on a failed trial call"
              />
              <figcaption>Half-open is the controlled, low-risk way to test whether a dependency has actually recovered</figcaption>
            </figure>

            <p>
              A subtlety worth internalizing: the failure threshold and the reset timeout are two
              separate knobs that trade off in opposite directions. A low failure threshold trips
              the breaker fast, which protects the dependency quickly but also means a handful of
              unlucky, unrelated blips (a single slow garbage-collection pause, one dropped packet)
              can trip it on otherwise-healthy traffic — that&apos;s a self-inflicted availability
              hit, not a real outage. A short reset timeout, on the other hand, sends trial traffic
              back too soon, before a genuinely overloaded service has actually recovered, so the
              trial call fails, the breaker reopens, and you&apos;ve gained nothing but an extra
              round trip of latency on top of the outage. In production, breakers are usually tuned
              against rate-based failure counts (e.g. &quot;50% of the last 20 calls failed&quot;)
              rather than raw consecutive-failure counts, precisely so a couple of stray errors in an
              otherwise-healthy stream don&apos;t trip the breaker on their own.
            </p>

            <h4>Advantages of the Circuit Breaker pattern</h4>
            <ul>
              <li><strong>Fail fast instead of hanging:</strong> once the breaker is open, callers get an immediate failure instead of waiting out a full timeout on every single request, which keeps the caller's own latency predictable even while the dependency is down.</li>
              <li><strong>Protects a struggling dependency from pile-on traffic:</strong> short-circuiting calls means a service that's already failing doesn't also have to process (and fail) a continued flood of requests on top of whatever caused it to degrade in the first place.</li>
              <li><strong>Automatic recovery detection:</strong> the half-open state tests recovery with a small trial batch on its own schedule, so no human has to watch a dashboard and manually flip traffic back on once a dependency comes back.</li>
              <li><strong>Contains blast radius:</strong> combined with timeouts, it stops one dependency's failure from exhausting the caller's own threads or connections, which is usually the first domino in a cascading failure.</li>
            </ul>

            <h4>Disadvantages of the Circuit Breaker pattern</h4>
            <ul>
              <li><strong>Threshold tuning is genuinely hard:</strong> too sensitive and normal transient blips (a GC pause, one dropped packet) trip the breaker and cause a self-inflicted outage; too lenient and it doesn't protect anything before the dependency is already in serious trouble.</li>
              <li><strong>Adds a new failure mode of its own:</strong> a misconfigured breaker that never resets, or resets too eagerly into a still-unhealthy dependency, can make an outage last longer or flap repeatedly instead of recovering cleanly.</li>
              <li><strong>State needs to live somewhere:</strong> in a horizontally scaled service, each instance can have its own breaker state unless you centralize it, so different instances may make different open/closed decisions about the same dependency at the same time.</li>
              <li><strong>Doesn't fix the underlying problem:</strong> a circuit breaker only contains the blast radius of a failing dependency — it does nothing to actually make that dependency healthy again.</li>
            </ul>

            <h3>Retry storms vs. backoff and jitter</h3>
            <p>
              Retries are often the thing that turns a brief blip into a full outage, and the
              mechanism is worth spelling out precisely. If every client retries failed calls after
              exactly the same fixed delay, then all of them retry at the same moment — and if the
              downstream service was already struggling, that synchronized wave of retries lands on
              top of the previous wave that hasn&apos;t even finished processing yet. Each retry
              round adds more concurrent load than the last, because it&apos;s the sum of new
              traffic plus every previous round&apos;s retries, so the service that might have
              recovered from a transient blip instead gets pushed further into overload. This is the
              exact failure mode a naive &quot;just add a retry&quot; fix can create on its own.
              <strong> Exponential backoff</strong> (doubling the delay after each failed attempt)
              spreads a single client&apos;s retries out over time instead of hammering immediately;{' '}
              <strong>jitter</strong> (adding a small random offset to that delay) staggers different
              clients away from each other so they stop retrying in lockstep. Without jitter, even
              exponential backoff can leave every client synchronized on the same schedule if they
              all failed at the same instant — jitter is what actually breaks the synchronization,
              not the exponential curve by itself.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-resilience/retry-storm-vs-backoff-jitter.svg"
                alt="Two scenarios: naive fixed-interval retries with no jitter stack on top of each other and drive load far past service capacity, while exponential backoff with jitter spreads retries out over widening randomized gaps so load stays under capacity"
              />
              <figcaption>The fix for a retry storm isn&apos;t "retry less" — it&apos;s "retry spread out, not synchronized"</figcaption>
            </figure>

            <h3>Bulkheads</h3>
            <p>
              A bulkhead isolates the resources one dependency consumes — most commonly a thread
              pool or connection pool — so that exhausting the resources used to call one dependency
              can&apos;t starve calls to a completely unrelated dependency. Without this isolation, a
              common production failure mode looks like: a service has one shared thread pool for
              all outbound calls, one downstream dependency (say, a recommendations service) starts
              responding slowly, calls to it pile up holding threads from the shared pool, and once
              that pool is exhausted, requests that only needed to call a completely healthy
              payments or inventory service also fail — not because those services are unhealthy,
              but because there are no threads left to make the call at all. Giving each dependency
              its own dedicated pool means a slow dependency can only ever exhaust its own pool, and
              every other code path keeps working normally.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-resilience/bulkhead-pattern.svg"
                alt="Service A calling three downstream dependencies through three separate thread pools; the Recommendations pool is fully exhausted by a slow Recommendations service, but the separate Payments and Inventory pools remain healthy and unaffected"
              />
              <figcaption>One shared thread pool means one slow dependency can starve requests that never even call it</figcaption>
            </figure>

            <h4>Advantages of the Bulkhead pattern</h4>
            <ul>
              <li><strong>Failure isolation:</strong> one dependency exhausting its own pool can never starve calls to a completely unrelated, healthy dependency, unlike a shared pool where every code path shares the same fate.</li>
              <li><strong>Predictable degradation:</strong> when something does go wrong, only the feature that depends on the struggling service degrades — the rest of the application keeps working exactly as before.</li>
              <li><strong>Pairs naturally with circuit breakers:</strong> each bulkheaded pool can have its own breaker, so the blast radius of both the resource exhaustion and the failure detection stay scoped to one dependency at a time.</li>
              <li><strong>Makes capacity planning explicit:</strong> giving each dependency a fixed pool size forces you to reason about how much concurrency each one actually needs, instead of one shared pool masking that question.</li>
            </ul>

            <h4>Disadvantages of the Bulkhead pattern</h4>
            <ul>
              <li><strong>Resource overhead:</strong> reserving separate pools per dependency means some capacity sits idle for a low-traffic dependency instead of being available to a busier one, which a single shared pool would have handled more efficiently.</li>
              <li><strong>Sizing every pool is extra operational work:</strong> each dependency's pool needs its own capacity number, and getting it wrong (too small) can throttle a healthy dependency even though the service as a whole has spare capacity elsewhere.</li>
              <li><strong>More moving parts to monitor:</strong> instead of watching one thread pool's utilization, you now need per-dependency visibility into every pool, or you can miss one quietly saturating while dashboards show healthy aggregate numbers.</li>
              <li><strong>Doesn't help if the exhausted resource is shared lower down:</strong> if every pool ultimately bottlenecks on the same database connection limit or CPU, isolating threads at the application layer doesn't fully contain the failure.</li>
            </ul>

            <h3>Sidecar pattern</h3>
            <p>
              A sidecar is a separate helper process deployed alongside a service instance — typically
              in the same pod in Kubernetes — that handles cross-cutting concerns like proxying
              traffic, collecting metrics, enforcing mTLS, or centralized logging, entirely outside the
              service&apos;s own codebase. The service talks to its sidecar over localhost, and the
              sidecar is the thing that actually talks to the network on the service&apos;s behalf
              (both for inbound requests and outbound calls to other services). The benefit is
              separation of concerns at the deployment level: the same sidecar binary can be attached
              to services written in completely different languages, and upgrading retry logic or TLS
              behavior means upgrading the sidecar, not redeploying every service that uses it.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-resilience/sidecar-pattern.svg"
                alt="A pod containing a service container and a sidecar proxy container; all inbound and outbound network traffic for the service flows through the sidecar rather than directly"
              />
              <figcaption>The service's own code never touches the network directly — the sidecar does that for it</figcaption>
            </figure>

            <h3>Service mesh</h3>
            <p>
              A service mesh is what you get when the sidecar pattern is applied to every service in a
              fleet uniformly, coordinated by a central <strong>control plane</strong>. Each service
              gets its own sidecar proxy (the collective sidecars are called the &quot;data
              plane&quot;), and the control plane pushes configuration to all of them — routing rules,
              retry and timeout policy, mTLS certificates, traffic-shaping rules for canary
              deployments — so that every service-to-service call in the system gets the same
              observability, security, and resilience behavior without any individual service having
              to implement it. Istio and Linkerd are the two most common service mesh implementations;
              both are built around exactly this sidecar-plus-control-plane architecture.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-resilience/service-mesh.svg"
                alt="Three services, each paired with a sidecar proxy, communicating with each other through their sidecars, with a central control plane pushing configuration to all three sidecars"
              />
              <figcaption>Uniform behavior across the fleet, centrally configured — no per-service reimplementation</figcaption>
            </figure>

            <h3>Cascading failures and their defenses</h3>
            <p>
              A cascading failure begins with one component becoming slow or unavailable, which
              increases load on (or exhausts resources in) the components that depend on it, which in
              turn causes those components to slow down or fail for <em>their</em> callers, and so on
              up the call graph until a single component&apos;s bad day becomes a full outage. The
              standard defenses each interrupt this chain at a different point:{' '}
              <strong>timeouts</strong> stop a caller from waiting indefinitely on a slow dependency;{' '}
              <strong>retries with exponential backoff and jitter</strong> avoid hammering an already
              struggling service with synchronized retry storms (backoff spaces retries out, jitter
              randomizes them so many clients don&apos;t retry in lockstep); <strong>bulkheads</strong>{' '}
              isolate resource pools per dependency so one failing dependency can&apos;t exhaust
              threads or connections needed by unrelated requests; and{' '}
              <strong>rate limiting</strong> caps how much load any single client or code path can
              place on a shared resource in the first place. A circuit breaker sits on top of all of
              this as the mechanism that actually stops sending traffic once a dependency is clearly
              unhealthy, rather than continuing to retry into it.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-resilience/cascading-failure.svg"
                alt="Two side-by-side scenarios: without a circuit breaker, a slow Service C exhausts Service B's threads which then exhausts Service A's threads too, causing a full outage; with a circuit breaker, Service B fails fast on calls to C, keeping A and B healthy"
              />
              <figcaption>A circuit breaker is the difference between "one service is down" and "the whole system is down"</figcaption>
            </figure>

            <p>
              This connects directly back to the idea of a <strong>single point of failure
              (SPOF)</strong> covered on the Core Principles page: an unprotected dependency that
              everything else calls synchronously, with no timeout, bulkhead, or breaker around it, is
              effectively a SPOF even if it&apos;s &quot;just one service among many&quot; — its
              failure mode is capable of taking the rest of the system down with it.
            </p>
            <FlowContinue nextId="trade-offs" label="Trade-offs" />
          </FlowStep>

          <FlowStep id="trade-offs" step={3} total={TOTAL_STEPS} title="Trade-offs">
            <p>
              Circuit breakers and bulkheads solve the same broad problem — stop one failing
              dependency from taking down everything else — but they attack it from different angles.
              Here&apos;s how they actually compare, and when to reach for each.
            </p>

            <h3>Difference Between Circuit Breaker and Bulkhead</h3>
            <table className="estimate-table">
              <thead>
                <tr>
                  <th>Aspect</th>
                  <th>Circuit Breaker</th>
                  <th>Bulkhead</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>What it protects against</td>
                  <td>Repeatedly calling a dependency that is already failing or degraded</td>
                  <td>One dependency&apos;s resource usage starving calls to unrelated dependencies</td>
                </tr>
                <tr>
                  <td>Mechanism</td>
                  <td>Tracks failure rate over time, trips a state machine (closed/open/half-open)</td>
                  <td>Allocates a fixed, separate resource pool (threads/connections) per dependency</td>
                </tr>
                <tr>
                  <td>Overhead</td>
                  <td>Low — a counter and a state check per call</td>
                  <td>Moderate — reserved capacity per dependency can sit idle when unused</td>
                </tr>
                <tr>
                  <td>Failure behavior</td>
                  <td>Fails fast (short-circuits) once the threshold trips, no call attempted</td>
                  <td>Degrades gracefully — the affected pool saturates, other pools keep serving</td>
                </tr>
                <tr>
                  <td>Configuration complexity</td>
                  <td>Two coupled knobs (failure threshold, reset timeout) that trade off against each other</td>
                  <td>One knob per dependency (pool size), but multiplied across every dependency you isolate</td>
                </tr>
                <tr>
                  <td>Scalability concern</td>
                  <td>State is per-instance unless centralized, so instances can disagree on breaker state</td>
                  <td>Pool sizing must account for total instance count, or aggregate capacity is wrong</td>
                </tr>
                <tr>
                  <td>Typical use case</td>
                  <td>A single flaky downstream API that occasionally goes fully unhealthy</td>
                  <td>A service that calls several independent dependencies (payments, inventory, recommendations)</td>
                </tr>
                <tr>
                  <td>Real system example</td>
                  <td>Netflix Hystrix wrapping each dependency call with a breaker</td>
                  <td>Hystrix&apos;s own thread-pool-per-dependency isolation, used alongside its breakers</td>
                </tr>
              </tbody>
            </table>

            <h3>Why Choose Circuit Breaker Over Bulkhead (or use both)?</h3>
            <ol>
              <li><strong>Fail fast on a known-bad dependency:</strong> a breaker stops calls the instant a dependency is confirmed unhealthy, rather than just limiting how many resources a struggling call can consume. Analogy: it&apos;s like a security guard turning people away at the door of a store that&apos;s already on fire, instead of just capping how many people can be inside at once.</li>
              <li><strong>Automatic recovery testing:</strong> the half-open state probes recovery on its own schedule, so traffic resumes the moment the dependency is healthy again without a human watching a dashboard. Analogy: it&apos;s like a smoke detector that periodically re-checks the air instead of requiring someone to manually walk back in and check.</li>
              <li><strong>Cheaper to run at scale:</strong> a breaker is just a counter and a state check, with no reserved capacity sitting idle. Analogy: it&apos;s a light switch you flip off, versus a bulkhead's dedicated hallway that has to exist whether or not anyone's using it right now.</li>
              <li><strong>Bulkheads are what stop the bleeding when you don't have a breaker yet:</strong> isolating pools protects unrelated request paths even before you've built failure-rate tracking. Analogy: it's the watertight doors on a ship — they contain a flood even if no one has sounded an alarm yet.</li>
              <li><strong>In practice, you rarely choose one — you layer both:</strong> a bulkhead gives each dependency its own pool, and a circuit breaker sits in front of each pool deciding when to stop sending calls into it at all. Analogy: think of a building with fire doors between wings (bulkhead) and a sprinkler system that shuts off gas to a specific wing once smoke is detected there (circuit breaker) — together they contain damage far better than either alone.</li>
            </ol>

            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that you understand these patterns
              compose — a well-designed call to a downstream dependency typically has a timeout, sits
              behind a circuit breaker, draws from a bulkheaded resource pool, and is retried (if at
              all) with backoff and jitter, not any single one of these in isolation.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to describe the three circuit
              breaker states and walk through why half-open exists, plus explaining in your own words
              how one slow service can take down services that don&apos;t even call it directly, covers
              the core of what&apos;s usually checked here.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to design the specific resilience
              boundaries for a given call graph — where you&apos;d put timeouts, breakers, and
              bulkheads, and how you&apos;d choose thresholds — plus explain the sidecar/service mesh
              trade-off (operational uniformity vs. added infrastructure complexity and latency).
            </p>
            <FlowContinue nextId="real-world" label="Real-World Examples" />
          </FlowStep>

          <FlowStep id="real-world" step={4} total={TOTAL_STEPS} title="Real-World Examples">
            <ul>
              <li><strong>Netflix Hystrix</strong> — the library that popularized the circuit breaker pattern for microservices, wrapping calls to dependencies with configurable failure thresholds, fallbacks, and bulkheaded thread pools per dependency; though now in maintenance mode, its design heavily influenced later resilience libraries (like resilience4j).</li>
              <li><strong>Istio &amp; Linkerd</strong> — the two dominant service mesh implementations, both built on the sidecar-plus-control-plane architecture to provide uniform mTLS, retries, and observability across a Kubernetes fleet.</li>
              <li><strong>AWS/cloud load balancer health checks</strong> — periodically probing backend instances and automatically removing unhealthy ones from rotation is effectively an automatic, infrastructure-level form of circuit breaking, done per-instance rather than per-dependency-call.</li>
              <li><strong>Thread-pool-per-dependency designs</strong> — a classic bulkhead implementation where each downstream dependency gets its own dedicated, isolated thread pool, so exhausting the pool for one slow dependency can&apos;t starve calls to any other dependency.</li>
              <li><strong>API gateways with rate limiting</strong> — gateways like Kong, Envoy, or a cloud provider's own API gateway enforce per-client and per-route rate limits, which caps how much load any single caller can place on downstream services before a cascading failure even has a chance to start.</li>
            </ul>
          </FlowStep>

          <PageNav
            prev={{ label: 'Distributed Transactions & State', href: '/pages/distributed-systems/distributed-transactions' }}
            next={{ label: 'API & Communication Patterns', href: '/pages/distributed-systems/api-communication-patterns' }}
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
