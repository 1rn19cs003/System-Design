import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';

export const metadata = {
  title: 'API Gateways — System Design Architectures',
};

export default function ApiGatewaysPage() {
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
              { label: 'API Gateways' },
            ]}
          />
          <h1 id="overview">API Gateways</h1>
          <p>
            Every distributed system needs a front door: a single place where a client&apos;s request
            first lands before it reaches any backend service. This page covers what lives at that
            front door — how an API gateway centralizes routing, auth, and rate limiting instead of
            making every service reimplement them; how idempotency keeps a retried request from
            silently corrupting state; how a token bucket keeps one noisy client from drowning out
            everyone else; and how a client decides whether to wait for an answer right now or come
            back for it later.
          </p>

          <section id="plain-english">
            <h2>In Plain English</h2>
            <p>
              Imagine a large office building with dozens of departments. Instead of visitors
              wandering the halls trying to find the right department, guessing at security rules
              along the way, there&apos;s a single reception desk at the entrance — that&apos;s an
              API gateway. If you hand the receptionist a form and don&apos;t hear back, you don&apos;t
              resubmit a duplicate form and risk being processed twice; you show your claim ticket
              number again and they hand you the same receipt — that&apos;s idempotency. And the
              receptionist only lets so many people through per minute so the departments
              aren&apos;t overwhelmed by a sudden crowd — that&apos;s rate limiting. Some requests get
              answered on the spot (synchronous); others — &quot;come back in an hour, we&apos;ll have
              your report ready&quot; — hand you a claim ticket and let you leave (asynchronous).
            </p>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  Every pattern here answers a version of &quot;how do I protect and organize the
                  front door to my services?&quot; An API gateway answers &quot;where do I send my
                  request, and who checks it before it goes further?&quot;, idempotency answers
                  &quot;what happens if I ask twice by accident?&quot;, and rate limiting answers
                  &quot;how much traffic is one client allowed to send?&quot;
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  The interesting failure modes live at the edges: what happens to an idempotency
                  key&apos;s cached result after it expires but the original request is still
                  in-flight? How does a gateway avoid becoming a single point of failure or a
                  bottleneck it was meant to prevent? Why would a long-running operation like video
                  processing be designed as an async API rather than making the caller hold a
                  connection open for minutes? These are the follow-up questions that separate a
                  surface-level answer from one that shows you&apos;ve operated these systems.
                </p>
              </Callout>
            </TwoCol>
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>
            <h3>API gateways</h3>
            <p>
              An API gateway is a single entry point that sits in front of a set of backend services
              and handles concerns that would otherwise have to be reimplemented, inconsistently, in
              every one of those services: routing a request to the correct backend, authenticating
              and authorizing the caller, enforcing rate limits per client or API key, terminating
              TLS, and sometimes transforming the request or response shape (e.g. aggregating several
              backend calls into one response for a mobile client). Centralizing these concerns means
              an individual service&apos;s code can stay focused purely on its own business logic,
              trusting that anything reaching it has already passed through auth and rate limiting.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-api/api-gateway.svg"
                alt="An API gateway sitting in front of three backend microservices — Users, Orders, and Payments — centrally handling routing, auth, rate limiting, and request/response transformation"
              />
              <figcaption>Cross-cutting concerns live once, at the edge, instead of being copy-pasted into every service</figcaption>
            </figure>

            <h3>Idempotency</h3>
            <p>
              A request is <strong>idempotent</strong> if making it once has the same effect as
              making it multiple times. GET requests are naturally idempotent (reading data twice
              doesn&apos;t change anything), but a POST that creates a payment or an order is not —
              calling it twice naturally creates two charges or two orders. The standard fix is an{' '}
              <code>Idempotency-Key</code> header: the client generates a unique key per logical
              operation (often a UUID) and sends it with the request; the server stores the result
              of the first successful call keyed by that value, and if it sees the same key again —
              because the client retried after a timeout, not knowing whether the first attempt
              succeeded — it returns the original stored result instead of processing the request a
              second time.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-api/idempotency-key-flow.svg"
                alt="A client's request times out after the server already processed it; the client retries with the same Idempotency-Key header, and the server recognizes the key and returns the cached original result instead of double-processing"
              />
              <figcaption>The client can&apos;t tell a lost response from a lost request — the idempotency key resolves the ambiguity server-side</figcaption>
            </figure>

            <h3>Rate limiting</h3>
            <p>
              Rate limiting caps how much load a single client, API key, or IP can place on a
              service over time, and it&apos;s one of the concerns an API gateway centralizes rather
              than leaving to individual services. The most common algorithm is the{' '}
              <strong>token bucket</strong>: a bucket holds up to some maximum number of tokens,
              tokens are added back at a fixed rate (say, 2 per second up to a cap of 10), and each
              incoming request consumes one token to proceed. As long as tokens are available,
              requests pass through immediately — including short bursts, since a client that has
              been quiet can accumulate a full bucket and spend it all at once. Once the bucket is
              empty, further requests are rejected outright (typically with an HTTP 429) without ever
              reaching a backend service. This is why rate limiting belongs at the gateway rather
              than in each service: a bad client can be stopped once, at the edge, instead of every
              backend having to independently defend itself against the same abusive traffic pattern.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-api/token-bucket-rate-limiting.svg"
                alt="A token bucket with capacity 10 refilling at 2 tokens per second; requests that find an available token are forwarded to the backend with 200 OK, while a request arriving when the bucket is empty is rejected at the gateway with 429 Too Many Requests"
              />
              <figcaption>Bursts are fine as long as tokens are available — the bucket, not a fixed rate, is what&apos;s actually enforced</figcaption>
            </figure>

            <h3>Synchronous vs. asynchronous APIs</h3>
            <p>
              A <strong>synchronous</strong> API is the default mental model: the caller sends a
              request and blocks, holding the connection open, until the server has the full answer
              ready to send back. That&apos;s fine when the work behind the endpoint takes
              milliseconds — fetching a user profile, validating a login. It falls apart once the
              real work takes seconds or minutes: transcoding a video, generating a large report,
              training a model. Holding an HTTP connection open that long wastes a server thread or
              worker for the entire duration, and it&apos;s fragile — a dropped connection midway
              means the client has no idea whether the work even finished. An <strong>asynchronous</strong>{' '}
              API instead accepts the request, immediately hands back a reference — typically a job ID
              — and lets the caller either poll a status endpoint with that ID or receive a webhook
              once the real result is ready. The gateway still does the same job of routing,
              authenticating, and rate-limiting the initial request; what changes is that the
              response the caller gets back immediately is a receipt, not the answer.
            </p>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <p>
              A recurring design decision at the API layer isn&apos;t just which pattern to use, but{' '}
              <em>where</em> to enforce it: at a shared gateway sitting in front of every service, or
              independently inside each service. Here&apos;s how that choice actually plays out.
            </p>

            <h3>Difference Between Centralizing at the Gateway and Handling Per-Service</h3>
            <table className="estimate-table">
              <thead>
                <tr>
                  <th>Aspect</th>
                  <th>Centralized at the Gateway</th>
                  <th>Handled Per-Service</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>What it solves</td>
                  <td>One consistent place to enforce auth, rate limits, and routing for every service</td>
                  <td>Each service tailors the concern exactly to its own traffic and risk profile</td>
                </tr>
                <tr>
                  <td>Consistency</td>
                  <td>Every service gets the same behavior automatically, with nothing to forget</td>
                  <td>Prone to drift — one team&apos;s service ends up unprotected or inconsistently configured</td>
                </tr>
                <tr>
                  <td>Single point of failure risk</td>
                  <td>A gateway outage can take down access to every service behind it at once</td>
                  <td>One service misbehaving doesn&apos;t affect any other service&apos;s availability</td>
                </tr>
                <tr>
                  <td>Operational overhead</td>
                  <td>One system to scale, monitor, and harden instead of dozens of copies</td>
                  <td>Every service repeats (and maintains) its own auth/rate-limit logic</td>
                </tr>
                <tr>
                  <td>Flexibility</td>
                  <td>Harder for one service to deviate from the shared policy when it genuinely needs to</td>
                  <td>Easy to special-case a service&apos;s specific needs (e.g. a much stricter limit)</td>
                </tr>
                <tr>
                  <td>Typical use case</td>
                  <td>Public-facing microservice architectures with many independently built services</td>
                  <td>A small number of services, or one with genuinely unique protection needs</td>
                </tr>
                <tr>
                  <td>Real system example</td>
                  <td>Kong / AWS API Gateway in front of a microservice fleet</td>
                  <td>A single monolith enforcing its own auth and throttling in application code</td>
                </tr>
              </tbody>
            </table>

            <h3>Why Choose a Centralized Gateway Over Per-Service Handling?</h3>
            <ol>
              <li><strong>One place to get it right:</strong> auth, rate limiting, and routing are implemented and hardened once, not reinvented, inconsistently, by every team. Analogy: it&apos;s like a building having one security checkpoint at the entrance instead of every floor running its own separate metal detector, each configured slightly differently.</li>
              <li><strong>Services stay focused on business logic:</strong> individual services can trust that anything reaching them already passed through auth and rate limiting. Analogy: it&apos;s like a restaurant kitchen trusting the host has already seated only paying customers, so the kitchen never has to check IDs itself.</li>
              <li><strong>Consistent policy enforcement:</strong> a rate-limit or auth rule change applies everywhere at once instead of needing a coordinated rollout across every service. Analogy: it&apos;s like updating one master rulebook at the front desk, instead of mailing an amended copy to every department and hoping they all update it.</li>
              <li><strong>Bad traffic is stopped once, at the edge:</strong> an abusive client is rejected before it ever reaches a backend, instead of every service independently absorbing and then rejecting the same load. Analogy: it&apos;s like a bouncer turning someone away at the door, rather than every room in the building having to eject them individually.</li>
            </ol>

            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that you understand idempotency
              as a direct consequence of the fact that a network can lose a <em>response</em> just as
              easily as it loses a <em>request</em> — and that you can name the specific mechanism
              (a client-generated key, stored server-side) rather than just saying &quot;make it
              idempotent&quot; without explaining how. For the gateway question specifically, they
              want to hear that you&apos;ve considered the gateway itself becoming a bottleneck or
              single point of failure, not just that centralizing is &quot;obviously better.&quot;
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to explain why retrying a
              non-idempotent POST is dangerous, and the basic idea of why a gateway centralizes
              cross-cutting concerns, covers most of what&apos;s checked here.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to reason about gateway
              bottlenecks and failure isolation (does the gateway itself need to be horizontally
              scaled and made redundant?), and to justify when a long-running operation should be
              exposed as an asynchronous API instead of forcing a synchronous caller to wait.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Kong, AWS API Gateway, Apigee</strong> — dedicated API gateway products that handle routing, auth, and rate limiting in front of microservice backends at scale.</li>
              <li><strong>Stripe</strong> — requires an <code>Idempotency-Key</code> header on payment-creating API calls specifically so a network retry can never double-charge a customer.</li>
              <li><strong>Cloudflare &amp; AWS WAF/rate limiting</strong> — enforce token-bucket-style rate limits at the edge, well before traffic ever reaches origin servers.</li>
              <li><strong>YouTube &amp; video-processing platforms</strong> — accept an uploaded video synchronously but process/transcode it asynchronously, notifying the uploader (or letting them poll) once processing completes.</li>
              <li><strong>AWS Step Functions &amp; job-queue APIs</strong> — expose long-running workflows as async APIs, returning an execution ID immediately and letting callers poll or subscribe for the final result.</li>
            </ul>
          </section>

          <PageNav
            prev={{ label: 'DevOps Concepts', href: '/pages/distributed-systems/devops-concepts' }}
            next={{ label: 'Realtime Communication', href: '/pages/distributed-systems/realtime-communication' }}
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
