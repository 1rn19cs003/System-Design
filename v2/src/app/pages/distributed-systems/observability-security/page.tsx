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
  title: 'Observability & Security — System Design Architectures',
};

export default function ObservabilitySecurityPage() {
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
              { label: 'Observability & Security' },
            ]}
          />
          <h1 id="overview">Observability &amp; Security</h1>
          <p>
            A distributed system you can&apos;t see into is a system you can only guess about, and a
            system that doesn&apos;t verify who&apos;s asking and what they&apos;re allowed to do is
            a system you can&apos;t trust with real data. This page covers two halves of running a
            distributed system safely in the real world: <strong>observability</strong> — logging,
            monitoring, alerting, and chaos engineering, the tools that tell you what your system is
            actually doing — and <strong>security</strong> — authentication, authorization, OAuth,
            JWTs, RBAC, and TLS, the mechanisms that decide who gets to do what.
          </p>

          <FlowStep id="plain-english" step={1} total={TOTAL_STEPS} title="In Plain English" defaultOpen>
            <p>
              Think of running a large building. <strong>Logging</strong> is the building&apos;s
              written incident log — every notable event, timestamped, so you can look back and
              reconstruct what happened. <strong>Monitoring</strong> is the building&apos;s live
              dashboard of vital signs — temperature, foot traffic, elevator load — with an alarm
              that goes off before things get dangerous, not after. <strong>Chaos engineering</strong>{' '}
              is a fire drill you run on a random Tuesday specifically because you want to find out
              whether the fire doors actually work, instead of assuming they do because they&apos;re
              installed. On the security side, <strong>authentication</strong> is the security guard
              checking your ID at the door (who are you?), while <strong>authorization</strong> is the
              keycard system deciding which floors that ID can actually access (what are you allowed
              to do?). <strong>OAuth</strong> is like a hotel handing your friend a one-time guest
              keycard to your room, without ever handing over your actual house key. <strong>TLS</strong>{' '}
              is a sealed, tamper-evident envelope for every message sent through the building&apos;s
              mail system, stamped with a notarized seal proving who really sent it.
            </p>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  Two questions cover almost everything on this page. For observability: &quot;how do
                  we know something&apos;s wrong before a user tells us?&quot; (logging, monitoring,
                  alerting). For security: &quot;how do we prove who someone is, and then control what
                  they can do?&quot; (authentication, then authorization).
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  The deeper theme is that both halves of this page are about not trusting the happy
                  path. Chaos engineering assumes your failover will fail unless you prove otherwise.
                  JWTs assume a token might leak, so they&apos;re short-lived by convention. TLS
                  assumes a network path might be hostile, so it authenticates the server, not just
                  encrypts the bytes. Good distributed-systems engineering is largely about designing
                  for the case where something you assumed would work, doesn&apos;t.
                </p>
              </Callout>
            </TwoCol>
            <FlowContinue nextId="theory" label="Theory & Diagrams" />
          </FlowStep>

          <FlowStep id="theory" step={2} total={TOTAL_STEPS} title="Theory & Diagrams">
            <h3>Logging</h3>
            <p>
              Logging records discrete events as they happen — a request came in, a payment failed,
              a background job started. <strong>Unstructured logs</strong> are free-text lines meant
              for a human to read (&quot;Payment failed for order 1001&quot;); <strong>structured
              logs</strong> emit the same information as key-value fields (typically JSON) so a
              machine can query, filter, and aggregate them reliably — <code>{'{'}"event":"payment_failed","order_id":1001{'}'}</code>{' '}
              is far easier to search across millions of log lines than parsing free text. In a
              distributed system, a single logical request can touch a dozen services, so logs from
              all of them are typically shipped to a <strong>centralized aggregation</strong> layer
              (the ELK stack — Elasticsearch, Logstash, Kibana — is the classic open-source example)
              so an engineer can search across every service&apos;s logs in one place instead of SSHing
              into a dozen machines individually.
            </p>

            <h3>Monitoring &amp; alerting</h3>
            <p>
              Monitoring is the continuous collection of numeric system metrics — latency, error
              rate, CPU, memory, queue depth — sampled over time, distinct from logging&apos;s
              discrete events. Alerting sits on top of monitoring: rules that watch those metrics and
              notify a human (or trigger an automated response) the moment a threshold is crossed,
              ideally before users notice degraded service. Google&apos;s Site Reliability Engineering
              practice names four metrics worth knowing explicitly as the <strong>four golden
              signals</strong>: <strong>latency</strong> (how long requests take),{' '}
              <strong>traffic</strong> (demand on the system), <strong>errors</strong> (rate of
              failures), and <strong>saturation</strong> (how full a constrained resource is). Most
              well-designed alerting for any service is built by defining sane thresholds on these
              four rather than trying to alert on every metric that exists.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-observability-security/observability-stack.svg"
                alt="Multiple services emitting logs, metrics, and traces to a central aggregation layer, which feeds dashboards and triggers alerts to an on-call engineer"
              />
              <figcaption>Logs, metrics, and traces are different lenses on the same underlying system behavior</figcaption>
            </figure>

            <h3>Distributed tracing</h3>
            <p>
              Logs and metrics tell you a service is slow; they rarely tell you which of the several
              services a single request touched is actually responsible. <strong>Distributed
              tracing</strong> solves this by generating a unique <strong>trace ID</strong> the moment
              a request enters the system, then propagating that same ID through every downstream
              call — in an HTTP header, a message-queue attribute, whatever the transport is — so every
              service the request touches can tag its own logs and timing data with it. Each
              service&apos;s unit of work is recorded as a <strong>span</strong>: a start time, an end
              time, and metadata about what happened, nested or sequenced under the parent span that
              called it. Stitching every span sharing a trace ID back together produces a waterfall
              view of the entire request — exactly how much of the total latency each hop consumed,
              and, critically, how much of a slow service&apos;s own span was actually spent waiting on
              something further downstream rather than its own logic. The common pitfall in practice is
              partial adoption: if even one service in the call chain doesn&apos;t propagate the
              incoming trace header (a common oversight when a new service is bolted on quickly), the
              trace breaks at that hop and you're back to manually correlating timestamps across
              disconnected logs for that segment.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-observability-security/distributed-tracing-waterfall.svg"
                alt="A single request's trace ID propagates across API Gateway, Auth, Order, and Payment services, each rendered as a span bar on a shared timeline, revealing that a third-party fraud-check call inside Payment Service is the actual latency bottleneck"
              />
              <figcaption>One trace ID, four spans — the waterfall shows exactly which hop, or which call inside a hop, owns the latency</figcaption>
            </figure>

            <h3>Chaos engineering</h3>
            <p>
              Chaos engineering is the practice of deliberately injecting failure into a production
              or production-like system — killing a server, cutting network access to a dependency,
              adding artificial latency — to verify that the redundancy and failover mechanisms you
              built actually work, instead of trusting they will because they&apos;re present in the
              architecture diagram. Netflix pioneered this with <strong>Chaos Monkey</strong> (part of
              a broader &quot;Simian Army&quot; of failure-injection tools), which randomly terminates
              production instances during business hours specifically so that engineers are forced to
              build services that tolerate individual instance failure as a routine, expected event
              rather than a rare emergency.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-observability-security/chaos-engineering.svg"
                alt="A chaos tool randomly terminates a running instance in production; the load balancer reroutes traffic to healthy instances, and monitoring confirms whether the system's redundancy actually held up"
              />
              <figcaption>Prove the failover works by causing the failure, on purpose, before it happens by accident</figcaption>
            </figure>

            <h3>Authentication vs. authorization</h3>
            <p>
              <strong>Authentication</strong> establishes identity — proving you are who you claim to
              be, typically via a password, an API key, a certificate, or a token issued after an
              earlier login. <strong>Authorization</strong> comes after, and on every subsequent
              request: given a known, authenticated identity, is this specific action on this
              specific resource permitted? Conflating the two is a common source of security bugs —
              checking that a request is authenticated is not the same as checking that this
              particular authenticated user is allowed to delete this particular record.
            </p>

            <h3>OAuth 2.0 and JWTs</h3>
            <p>
              <strong>OAuth 2.0</strong> is an authorization framework, not an authentication
              protocol by itself — it defines how a third-party application can be granted limited,
              scoped access to a resource on a user&apos;s behalf, without that application ever
              seeing the user&apos;s actual password. When you click &quot;Sign in with Google,&quot;
              you&apos;re redirected to Google, you authenticate directly with Google, and Google
              hands the requesting app a token representing a limited grant of access — the app never
              touches your Google password. <strong>JWT (JSON Web Token)</strong> is a common token
              format used to carry the result of that process (or of a normal login): a compact,
              self-contained string of three base64url-encoded parts — a header, a payload of claims
              (user ID, roles, expiry), and a cryptographic signature — that any server holding the
              signing secret (or the corresponding public key) can verify without a database lookup,
              which is what makes JWT-based auth <strong>stateless</strong> and easy to scale
              horizontally.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-observability-security/oauth-flow.svg"
                alt="A user is redirected from your app to an auth provider like Google or GitHub, logs in directly with the provider, a token is issued back to your app, and your app calls the resource API using that token without ever seeing the user's password"
              />
              <figcaption>Your app receives a scoped, revocable token — never the user&apos;s actual credentials</figcaption>
            </figure>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-observability-security/jwt-structure.svg"
                alt="A JWT's three segments — header.payload.signature — where the header and payload are readable base64 (not encrypted) and the signature is an HMAC that lets any node verify the token without a database lookup"
              />
              <figcaption>Readable, not secret — the signature is what makes it trustworthy, not the encoding</figcaption>
            </figure>

            <p>
              The full token lifecycle is what actually resolves the tension between statelessness and
              revocation: a JWT-based system typically issues a short-lived <strong>access
              token</strong> (often 5-15 minutes) alongside a longer-lived <strong>refresh
              token</strong> stored separately and more securely. The access token is what gets sent
              with every request and verified statelessly; when it expires, the client presents the
              refresh token to a dedicated endpoint to get a new access token, without forcing the user
              to log in again. This keeps the &quot;stolen token stays valid until it expires&quot;
              exposure window small (minutes, not days) while still avoiding a database check on every
              single request — only the occasional refresh call touches a stateful store, which is
              exactly where revocation becomes possible again, since the server can maintain a
              refresh-token blocklist without giving up statelessness for the far more frequent access
              token checks. A common production mistake is treating the JWT payload as if it were
              confidential: it&apos;s only base64-encoded, not encrypted, so anyone holding the token
              can read the claims directly — putting a password or another secret in the payload
              instead of just an opaque user ID and a signature is a real, recurring bug.
            </p>

            <h4>Advantages of JWT-based Authentication</h4>
            <ul>
              <li><strong>Stateless verification:</strong> Any node in a horizontally-scaled fleet can verify a signed token without a database lookup or shared session store.</li>
              <li><strong>Scales horizontally with zero coordination:</strong> Adding more servers behind a load balancer doesn't require replicating a session store, since every server can validate a token independently.</li>
              <li><strong>Works naturally across domains/services:</strong> A single token can be presented to multiple independent APIs or microservices without each one needing to share a session backend.</li>
              <li><strong>Self-contained claims:</strong> The token itself carries the user's roles and expiry, so a service doesn't need a round-trip to know who it's talking to.</li>
            </ul>

            <h4>Disadvantages of JWT-based Authentication</h4>
            <ul>
              <li><strong>Hard to revoke early:</strong> There's no central record to delete, so a compromised token stays valid until it naturally expires unless you build extra infrastructure (a blocklist, short expiries) around it.</li>
              <li><strong>Payload isn't encrypted:</strong> A JWT's claims are only base64-encoded, not encrypted, so anyone holding the token can read them directly.</li>
              <li><strong>Token size overhead:</strong> A JWT carrying several claims is larger than a small opaque session ID, adding a little weight to every request that carries it.</li>
              <li><strong>Stale claims risk:</strong> If a user's role changes mid-session, the token still carries the old role until it's refreshed, unlike a session store that can be updated immediately.</li>
            </ul>

            <h3>Session-based authentication</h3>
            <p>
              The natural counterpart to JWT-based auth is the older, still widely used{' '}
              <strong>session-based</strong> model. Instead of issuing a self-contained, signed token,
              the server creates a session record in a shared store (a database or an in-memory cache
              like Redis) the moment a user logs in, and hands the client back only a small, opaque{' '}
              <strong>session ID</strong> — usually stored in a cookie. On every subsequent request,
              the server looks up that session ID in the shared store to find out who the user is and
              whether the session is still valid. Because the authoritative record lives entirely on
              the server side, revoking access is immediate: deleting the session record from the
              store instantly invalidates that session ID everywhere, which is exactly the guarantee
              JWTs give up in exchange for statelessness.
            </p>

            <h4>Advantages of Session-based Authentication</h4>
            <ul>
              <li><strong>Instant revocation:</strong> Deleting the session record from the store immediately invalidates it — no waiting for an expiry window.</li>
              <li><strong>Small, opaque identifiers:</strong> A session ID carries no readable claims at all, so there's nothing sensitive to leak if it's intercepted (beyond impersonation itself).</li>
              <li><strong>Centralized control:</strong> Updating a user's permissions mid-session takes effect on their very next request, since the server looks the record up fresh each time.</li>
              <li><strong>Simple mental model:</strong> One record, one source of truth, easy to inspect and reason about for a small-to-medium system.</li>
            </ul>

            <h4>Disadvantages of Session-based Authentication</h4>
            <ul>
              <li><strong>Requires shared state:</strong> Every server needs access to the same session store, adding a dependency and a potential bottleneck that stateless JWTs avoid entirely.</li>
              <li><strong>Extra lookup cost:</strong> Every authenticated request pays a database or cache round-trip to validate the session, unlike a JWT's local signature check.</li>
              <li><strong>Harder to scale across services:</strong> Sharing one session store across multiple independent APIs or third-party services is more awkward than just passing along a portable token.</li>
              <li><strong>Session store becomes a single point of failure:</strong> If the shared store goes down, authentication for the entire fleet can go down with it.</li>
            </ul>

            <h3>RBAC (Role-Based Access Control)</h3>
            <p>
              RBAC assigns permissions to <strong>roles</strong> (viewer, editor, admin), and assigns{' '}
              <strong>users</strong> to one or more of those roles, rather than granting permissions
              to individual users directly. This one layer of indirection is the entire point: when a
              new employee joins, you assign them the &quot;editor&quot; role instead of manually
              re-deriving which of the dozens of individual permissions an editor should have; when
              the definition of what an editor can do changes, you update the role once instead of
              updating every editor&apos;s individual permission list. AWS IAM is a large-scale
              real-world example — permissions are defined in policies, policies are attached to
              roles, and users/services assume roles rather than being granted raw permissions one by
              one.
            </p>

            <h3>SSL/TLS</h3>
            <p>
              TLS (the modern successor to SSL) is the cryptographic protocol underlying HTTPS,
              providing three guarantees at once: <strong>encryption in transit</strong> (an
              eavesdropper on the network can&apos;t read the data), <strong>data integrity</strong>{' '}
              (tampering with the data in transit is detectable), and <strong>server
              authentication</strong> (the server proves its identity via a certificate signed by a
              trusted certificate authority, so the client knows it&apos;s actually talking to the
              real server, not an impersonator). At a conceptual level, the handshake works by having
              the server present its certificate first; the client verifies it against a trusted CA,
              then the two sides use asymmetric cryptography just long enough to securely agree on a
              shared symmetric session key, and switch to that faster symmetric encryption for the
              rest of the connection.
            </p>
            <FlowContinue nextId="trade-offs" label="Trade-offs" />
          </FlowStep>

          <FlowStep id="trade-offs" step={3} total={TOTAL_STEPS} title="Trade-offs">
            <p>
              JWT-based and session-based authentication solve the same problem — remembering that a
              user already proved who they are — with opposite answers to where the source of truth
              lives. Here&apos;s how they actually compare, and when to reach for each.
            </p>

            <h3>Difference Between JWT-based Authentication and Session-based Authentication</h3>
            <table className="estimate-table">
              <thead>
                <tr>
                  <th>Aspect</th>
                  <th>JWT-based Authentication</th>
                  <th>Session-based Authentication</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Where state lives</td>
                  <td>Entirely in the signed token itself</td>
                  <td>Server-side session store (DB or Redis)</td>
                </tr>
                <tr>
                  <td>Per-request cost</td>
                  <td>Local signature check, no DB round-trip</td>
                  <td>A store lookup on every request</td>
                </tr>
                <tr>
                  <td>Revocation</td>
                  <td>Hard — valid until natural expiry unless blocklisted</td>
                  <td>Instant — delete the session record</td>
                </tr>
                <tr>
                  <td>Horizontal scaling</td>
                  <td>Trivial — any node can verify independently</td>
                  <td>Requires a shared store accessible to every node</td>
                </tr>
                <tr>
                  <td>Failure mode</td>
                  <td>No single point of failure for verification</td>
                  <td>Session store outage can break auth fleet-wide</td>
                </tr>
                <tr>
                  <td>Typical use case</td>
                  <td>Public APIs, mobile clients, microservices</td>
                  <td>Traditional server-rendered web apps, banking-grade revocation needs</td>
                </tr>
                <tr>
                  <td>Real system example</td>
                  <td>Auth0/Firebase-issued JWTs across a microservices fleet</td>
                  <td>Classic Express/Django session middleware backed by Redis</td>
                </tr>
              </tbody>
            </table>

            <h3>Why Choose JWT-based Authentication Over Session-based?</h3>
            <ol>
              <li><strong>Statelessness at scale:</strong> Any server can verify a token with just its signing key, no shared store needed. Analogy: It&apos;s like a concert wristband that any gate staff can check on sight, instead of everyone having to radio a central desk to confirm your ticket.</li>
              <li><strong>No extra database round-trip:</strong> Verifying a signature is a local, in-memory operation, not a network call. Analogy: It&apos;s like checking a notarized seal on a document yourself, instead of calling the notary's office to confirm it every time.</li>
              <li><strong>Portable across services:</strong> The same token can be presented to several independent APIs without them sharing a session backend. Analogy: It&apos;s like a passport that any country's border officer can check, rather than each country needing to call your home country to verify you.</li>
              <li><strong>No single shared dependency:</strong> There's no central session store that, if it goes down, takes authentication down with it for every service. Analogy: It&apos;s like each security checkpoint having its own working badge scanner, instead of all of them depending on one central server that might crash.</li>
              <li><strong>Simple horizontal scaling:</strong> Adding more servers behind a load balancer needs no coordination step for auth. Analogy: It&apos;s like handing out more copies of the same rulebook to new staff, instead of wiring every new hire into one shared filing cabinet.</li>
            </ol>

            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> a clean separation between
              authentication and authorization in your explanation, the specific trade-off JWTs make
              (statelessness vs. hard revocation), and an understanding that observability
              tools exist to answer &quot;is something wrong right now&quot; before a customer files a
              support ticket — not just to produce logs nobody reads.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to define authentication vs.
              authorization correctly, and explain RBAC in one sentence (&quot;permissions go on
              roles, users get roles&quot;), covers most of what&apos;s asked at the entry level.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to discuss what happens when a JWT
              needs to be revoked before it expires (short expiries plus refresh tokens, or a
              server-side blocklist that partially reintroduces state), and why chaos engineering is
              a deliberate practice rather than just &quot;waiting for things to break in production
              anyway.&quot;
            </p>
            <FlowContinue nextId="real-world" label="Real-World Examples" />
          </FlowStep>

          <FlowStep id="real-world" step={4} total={TOTAL_STEPS} title="Real-World Examples">
            <ul>
              <li><strong>Netflix&apos;s Chaos Monkey / Simian Army</strong> — randomly terminates production instances (and simulates broader failures like an entire availability zone going down) to continuously verify the platform&apos;s redundancy actually holds up.</li>
              <li><strong>Datadog, Grafana, Prometheus</strong> — the dominant monitoring and dashboarding stack for tracking metrics like the four golden signals and driving alerting rules in production.</li>
              <li><strong>The ELK stack (Elasticsearch, Logstash, Kibana)</strong> — a widely used open-source pipeline for centralizing, searching, and visualizing logs across many services.</li>
              <li><strong>&quot;Sign in with Google/GitHub&quot;</strong> — the most common real-world encounter with OAuth 2.0, letting a third-party app authenticate you via an identity provider without ever seeing your password.</li>
              <li><strong>Auth0 and Firebase Auth</strong> — managed authentication services that issue JWTs as stateless session tokens, letting client apps and backend APIs verify a user&apos;s identity without a shared session database.</li>
              <li><strong>AWS IAM</strong> — a production-scale RBAC (and more broadly, policy-based) system: permissions are defined in policies, attached to roles, and users or services assume roles to gain exactly the access those policies grant.</li>
            </ul>
          </FlowStep>

          <PageNav
            prev={{ label: 'Architectural Patterns', href: '/pages/distributed-systems/architectural-patterns' }}
            next={{ label: 'Case Studies', href: '/pages/case-studies' }}
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
