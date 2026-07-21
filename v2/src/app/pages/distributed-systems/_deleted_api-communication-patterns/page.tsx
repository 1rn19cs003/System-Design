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
  title: 'API & Communication Patterns — System Design Architectures',
};

export default function ApiCommunicationPatternsPage() {
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
              { label: 'API & Communication Patterns' },
            ]}
          />
          <h1 id="overview">API &amp; Communication Patterns</h1>
          <p>
            Every distributed system eventually reduces to the same question: how do two pieces of
            software, running on different machines, exchange information reliably? This page covers
            the patterns that answer that question at the API layer — how a client finds and talks to
            the right backend service through an API gateway, how requests survive network retries
            without corrupting state via idempotency, how REST and GraphQL differ in shaping that
            conversation, and how WebSockets, long polling, WebRTC, and webhooks each solve a
            different flavor of &quot;who talks first, and how often.&quot;
          </p>

          <FlowStep id="plain-english" step={1} total={TOTAL_STEPS} title="In Plain English" defaultOpen>
            <p>
              Imagine a large office building with dozens of departments. Instead of visitors
              wandering the halls trying to find the right department, guessing at security rules
              along the way, there&apos;s a single reception desk at the entrance — that&apos;s an
              API gateway. If you hand the receptionist a form and don&apos;t hear back, you don&apos;t
              resubmit a duplicate form and risk being processed twice; you show your claim ticket
              number again and they hand you the same receipt — that&apos;s idempotency. And instead
              of you calling the office every five minutes to ask &quot;is my request done yet?&quot;
              (polling), it&apos;s far more efficient if they just call you the moment it&apos;s
              ready — that&apos;s a webhook.
            </p>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  Every pattern here answers a version of &quot;how do two systems talk without
                  wasting effort or corrupting data?&quot; An API gateway answers &quot;where do I
                  send my request?&quot;, idempotency answers &quot;what happens if I ask twice by
                  accident?&quot;, and WebSockets/long polling/webhooks each answer &quot;how do I
                  find out about something new without constantly asking?&quot;
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  The interesting failure modes live at the edges: what happens to an idempotency
                  key&apos;s cached result after it expires but the original request is still
                  in-flight? How does a gateway avoid becoming a single point of failure or a
                  bottleneck it was meant to prevent? These are the follow-up questions that separate
                  a surface-level answer from one that shows you&apos;ve operated these systems.
                </p>
              </Callout>
            </TwoCol>
            <FlowContinue nextId="theory" label="Theory & Diagrams" />
          </FlowStep>

          <FlowStep id="theory" step={2} total={TOTAL_STEPS} title="Theory & Diagrams">
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

            <h3>REST vs. GraphQL</h3>
            <p>
              REST models an API as a set of resources, each with its own URL and a server-defined
              response shape (<code>GET /users/1</code>, <code>GET /users/1/posts</code>). This
              fixed shape is simple to reason about and trivially cacheable by URL, but assembling a
              view that spans multiple resources often needs several round trips, and any single
              response tends to include fields the client doesn&apos;t need (over-fetching) or force
              a follow-up call for fields it does (under-fetching). GraphQL exposes a single endpoint
              where the client sends a query describing exactly the fields it wants, across multiple
              related resources, and gets back exactly that shape in one round trip — at the cost of
              losing simple URL-based HTTP caching and pushing query-resolution complexity onto the
              server.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-api/rest-vs-graphql.svg"
                alt="REST requires four separate fixed-shape endpoint calls to assemble a user's posts, friends, and comments, while GraphQL sends one query to a single endpoint and gets back exactly the fields requested"
              />
              <figcaption>REST trades round trips for cacheability; GraphQL trades cacheability for precision in one round trip</figcaption>
            </figure>

            <h4>Advantages of REST</h4>
            <ul>
              <li><strong>Trivial HTTP caching:</strong> because each resource has its own stable URL, CDNs and browser caches can key on that URL directly, with no extra caching layer to build.</li>
              <li><strong>Simple mental model:</strong> a fixed set of endpoints, each returning a predictable shape, is easy for any client (including ones you don't control) to consume with nothing more than a standard HTTP client.</li>
              <li><strong>Uses HTTP semantics directly:</strong> status codes, verbs, and headers already carry meaning (404, 201, Cache-Control), so you get a lot of behavior for free instead of reinventing it inside a query language.</li>
              <li><strong>Simple server-side implementation:</strong> each endpoint resolves one predictable query, so there's no risk of a client submitting an expensive, deeply-nested query that the server has to protect itself against.</li>
            </ul>

            <h4>Disadvantages of REST</h4>
            <ul>
              <li><strong>Over-fetching:</strong> a fixed response shape often includes fields the client has no use for, wasting bandwidth, especially on mobile clients.</li>
              <li><strong>Under-fetching:</strong> assembling one screen's worth of data (a user, their posts, their friends) frequently needs several sequential round trips to different endpoints.</li>
              <li><strong>Endpoint sprawl:</strong> supporting every client's exact data needs tends to produce more and more specialized endpoints over time, each one more code to maintain.</li>
              <li><strong>Versioning is awkward:</strong> changing a resource's shape can break existing clients, usually forcing a new versioned endpoint (<code>/v2/users/1</code>) rather than a clean in-place evolution.</li>
            </ul>

            <h4>Advantages of GraphQL</h4>
            <ul>
              <li><strong>No over- or under-fetching:</strong> the client asks for exactly the fields it needs, across multiple related resources, and gets exactly that shape back in one response.</li>
              <li><strong>One round trip for complex views:</strong> a single query can pull a user, their posts, and their friends together, replacing what would be several REST calls.</li>
              <li><strong>Schema acts as a contract:</strong> the type system is self-documenting and lets tooling (autocomplete, validation) catch mistakes before a request is even sent.</li>
              <li><strong>Evolves without versioning:</strong> new fields can be added to the schema without breaking existing queries, since clients only ever ask for the fields they already know about.</li>
            </ul>

            <h4>Disadvantages of GraphQL</h4>
            <ul>
              <li><strong>Loses simple HTTP caching:</strong> since every query goes to the same single endpoint (usually via POST), a CDN can't cache by URL the way it does for REST; caching has to be reimplemented at the client or via a persisted-query layer.</li>
              <li><strong>Server-side complexity goes up:</strong> the server must resolve arbitrary nested queries efficiently and guard against expensive or malicious ones (deeply nested queries, N+1 database calls hidden behind resolvers).</li>
              <li><strong>Harder to rate-limit or monitor per-operation:</strong> because every request hits the same endpoint, you need query-aware tooling to tell one expensive query apart from another, instead of just watching per-URL metrics.</li>
              <li><strong>Steeper learning curve:</strong> teams need to learn schema design, resolvers, and query cost analysis, which is more upfront investment than standing up a REST endpoint.</li>
            </ul>

            <h3>WebSockets vs. long polling</h3>
            <p>
              A <strong>WebSocket</strong> starts as a normal HTTP request that both sides agree to
              &quot;upgrade&quot; into a persistent, full-duplex TCP connection — after that one
              handshake, either side can push messages at any time with minimal per-message overhead,
              making it well suited to chat, live dashboards, and multiplayer games. <strong>Long
              polling</strong> stays within plain HTTP semantics: the client sends a request that the
              server intentionally holds open until either new data is available or a timeout elapses,
              then the client immediately sends a new request to repeat the cycle. Long polling works
              anywhere plain HTTP works (simpler infrastructure, no special proxy support needed) but
              pays repeated connection and header overhead on every cycle, where a WebSocket pays that
              cost only once.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-api/websocket-vs-long-polling.svg"
                alt="WebSocket opens one persistent full-duplex connection that either side can push through at any time, while long polling repeats a cycle of held-open HTTP requests, each paying fresh connection and header overhead"
              />
              <figcaption>One handshake and stay open, versus plain HTTP repeated on a loop</figcaption>
            </figure>

            <h3>WebRTC</h3>
            <p>
              WebRTC lets two browsers exchange audio, video, or arbitrary data directly,
              peer-to-peer, instead of relaying every packet through an application server. A small
              signaling server is still needed up front so the two peers can exchange connection
              metadata (session descriptions, candidate network paths), and STUN/TURN servers help
              each peer discover a reachable address through NAT — but once the direct connection is
              established, media flows browser-to-browser, which avoids the bandwidth cost and extra
              latency of relaying every frame through your own infrastructure.
            </p>

            <p>
              The handshake itself has two distinct phases, and mixing them up is a common source of
              confusion. Phase one is pure signaling: the two peers exchange <strong>SDP</strong>{' '}
              (Session Description Protocol) offers and answers describing what media/codecs they
              support, plus a set of <strong>ICE</strong> candidates — possible network paths
              (local IP, public IP discovered via a STUN server, or a relayed path through a TURN
              server as a last resort) where each peer might be reachable. None of this negotiation
              carries actual audio or video; it&apos;s purely metadata relayed through the signaling
              server, which can be a plain WebSocket or even a REST endpoint you already run. Phase
              two only begins once ICE candidate pairs are tested and a working path is found: the
              peers open a direct connection over whichever candidate path succeeded, and every
              subsequent audio, video, or data-channel packet flows over that path without touching
              your server again. The practical failure mode to know: on restrictive corporate
              networks or behind symmetric NATs, no direct path can be found at all, and WebRTC falls
              back to relaying media through a TURN server — at that point you&apos;re paying the
              bandwidth cost you were trying to avoid, just via a different relay than your own
              application server.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-api/webrtc-signaling-handshake.svg"
                alt="Phase one: a signaling server relays SDP offer/answer and ICE candidates between two peers. Phase two: once negotiation completes, the peers connect directly and audio/video/data flows browser-to-browser with the signaling server out of the path"
              />
              <figcaption>The signaling server brokers the introduction, then gets out of the way entirely</figcaption>
            </figure>

            <h3>Webhooks</h3>
            <p>
              A webhook inverts the usual client-initiates-every-request model: instead of your
              application repeatedly polling a third-party service asking &quot;anything new?&quot;,
              you register a URL with that service, and it calls your URL the moment a relevant event
              happens (a payment succeeded, a pull request was merged). This eliminates wasted polling
              requests and gets you near-instant notification, but shifts the burden onto you to
              expose a reliable, publicly reachable endpoint, verify the caller&apos;s identity
              (typically via a signature the sender computes over the payload with a shared secret),
              and handle the sender potentially retrying delivery if your endpoint doesn&apos;t
              acknowledge in time.
            </p>

            <p>
              What actually goes wrong with webhooks in production is almost always on the receiving
              end: your endpoint is briefly down for a deploy, or your handler throws before it
              finishes processing, so the sender never gets an acknowledgment. A well-built sender
              (Stripe, GitHub) treats that as a delivery failure and retries with backoff over a
              window that can stretch to hours or days — which means your endpoint must be{' '}
              <strong>idempotent</strong> for exactly the same reason a payment API is: you will
              receive the same event more than once, and processing it twice (e.g. crediting an
              account twice for one payment event) is a real bug, not a hypothetical. The other
              production trap is verifying events at all — a webhook URL is, by definition, a public
              endpoint, so without checking the sender&apos;s signature (a hash computed over the raw
              payload using a shared secret) anyone who discovers the URL can POST a forged event and
              have your system act on it as if it came from the real provider.
            </p>

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
              <figcaption>Bursts are fine as long as tokens are available — the bucket, not a fixed rate, is what's actually enforced</figcaption>
            </figure>
            <FlowContinue nextId="trade-offs" label="Trade-offs" />
          </FlowStep>

          <FlowStep id="trade-offs" step={3} total={TOTAL_STEPS} title="Trade-offs">
            <p>
              REST and GraphQL both answer &quot;how does a client get data from the server,&quot; but
              they shape that conversation very differently. Here&apos;s how they actually compare, and
              when to reach for each.
            </p>

            <h3>Difference Between REST and GraphQL</h3>
            <table className="estimate-table">
              <thead>
                <tr>
                  <th>Aspect</th>
                  <th>REST</th>
                  <th>GraphQL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>What it solves</td>
                  <td>Simple, cacheable access to individually-addressable resources</td>
                  <td>Precisely-shaped, multi-resource data in a single request</td>
                </tr>
                <tr>
                  <td>Endpoint shape</td>
                  <td>Many endpoints, one per resource (<code>/users/1</code>, <code>/users/1/posts</code>)</td>
                  <td>One endpoint (<code>/graphql</code>), query shape decided by the client</td>
                </tr>
                <tr>
                  <td>Overhead</td>
                  <td>Low per-request overhead, but often several round trips to assemble one view</td>
                  <td>One round trip, but higher server-side cost resolving nested fields</td>
                </tr>
                <tr>
                  <td>Caching</td>
                  <td>Trivial — CDNs and browsers cache by URL out of the box</td>
                  <td>Hard — same endpoint for every query, needs client-side or persisted-query caching</td>
                </tr>
                <tr>
                  <td>Failure/complexity behavior</td>
                  <td>A malformed request fails one predictable endpoint call</td>
                  <td>A poorly-designed query can trigger deep resolver chains or N+1 database calls</td>
                </tr>
                <tr>
                  <td>Scalability lever</td>
                  <td>Scale by adding CDN/cache layers in front of endpoints</td>
                  <td>Scale by adding query cost limits, batching (DataLoader), and persisted queries</td>
                </tr>
                <tr>
                  <td>Typical use case</td>
                  <td>Public APIs, simple CRUD services, anything needing wide client compatibility</td>
                  <td>Mobile/IDE clients assembling complex, multi-resource views efficiently</td>
                </tr>
                <tr>
                  <td>Real system example</td>
                  <td>GitHub REST API v3, Stripe&apos;s core payments API</td>
                  <td>GitHub GraphQL API v4, Shopify&apos;s Storefront API</td>
                </tr>
              </tbody>
            </table>

            <h3>Why Choose GraphQL Over REST?</h3>
            <ol>
              <li><strong>Eliminates over-fetching and under-fetching:</strong> the client specifies exactly the fields it needs, nothing more, nothing less. Analogy: it&apos;s like ordering à la carte instead of being served a fixed set menu where half the dishes go untouched.</li>
              <li><strong>One round trip for complex views:</strong> a single query can pull a user, their posts, and their friends together instead of chaining several REST calls. Analogy: it&apos;s one trip through a drive-through window with everything bagged together, instead of circling back multiple times for each item.</li>
              <li><strong>Strongly-typed schema as a contract:</strong> the schema documents itself and lets tooling catch mistakes before the request is even sent. Analogy: it&apos;s like a restaurant menu that also tells you exactly what ingredients are in every dish, instead of guessing.</li>
              <li><strong>Faster client iteration:</strong> frontend teams can change what data they need without waiting on the backend to ship a new endpoint. Analogy: it&apos;s like being handed a full pantry and cooking whatever recipe you want, rather than waiting for the kitchen to prepare a new fixed dish for you.</li>
              <li><strong>Schema evolves without breaking clients:</strong> new fields can be added freely since existing queries only ask for fields they already know about. Analogy: it&apos;s like adding new aisles to a supermarket — shoppers who never visit them are completely unaffected.</li>
            </ol>

            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that you understand idempotency
              as a direct consequence of the fact that a network can lose a <em>response</em> just as
              easily as it loses a <em>request</em> — and that you can name the specific mechanism
              (a client-generated key, stored server-side) rather than just saying &quot;make it
              idempotent&quot; without explaining how.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to explain why retrying a
              non-idempotent POST is dangerous, and the basic difference between REST&apos;s multiple
              endpoints and GraphQL&apos;s single endpoint, covers most of what&apos;s checked here.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to reason about gateway
              bottlenecks and failure isolation (does the gateway itself need to be horizontally
              scaled and made redundant?), and to justify a WebSocket vs. long-polling vs. webhook
              choice against the actual latency and infrastructure constraints of a given system.
            </p>
            <FlowContinue nextId="real-world" label="Real-World Examples" />
          </FlowStep>

          <FlowStep id="real-world" step={4} total={TOTAL_STEPS} title="Real-World Examples">
            <ul>
              <li><strong>Stripe</strong> — requires an <code>Idempotency-Key</code> header on payment-creating API calls specifically so a network retry can never double-charge a customer.</li>
              <li><strong>Kong, AWS API Gateway, Apigee</strong> — dedicated API gateway products that handle routing, auth, and rate limiting in front of microservice backends at scale.</li>
              <li><strong>GitHub</strong> — offers both a REST API (v3) and a GraphQL API (v4), letting clients that need precisely-shaped, multi-resource data (e.g. an IDE plugin) avoid dozens of REST round trips.</li>
              <li><strong>Slack &amp; Discord</strong> — use WebSocket connections (a &quot;gateway&quot; connection, in Discord&apos;s own terminology) to push real-time messages, typing indicators, and presence updates to clients instantly.</li>
              <li><strong>Stripe &amp; GitHub webhooks</strong> — notify external systems the instant a payment event or a repository event happens, rather than making integrators poll for changes.</li>
              <li><strong>Google Meet &amp; Discord voice/video</strong> — use WebRTC to route audio and video directly between participants&apos; devices wherever possible, minimizing server relay cost and latency.</li>
            </ul>
          </FlowStep>

          <PageNav
            prev={{ label: 'Resilience Patterns', href: '/pages/distributed-systems/resilience-patterns' }}
            next={{ label: 'Big Data Processing', href: '/pages/distributed-systems/big-data-processing' }}
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
