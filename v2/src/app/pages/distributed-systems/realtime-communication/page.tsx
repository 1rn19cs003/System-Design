import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';

export const metadata = {
  title: 'Realtime Communication — System Design Architectures',
};

export default function RealtimeCommunicationPage() {
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
              { label: 'Realtime Communication' },
            ]}
          />
          <h1 id="overview">Realtime Communication</h1>
          <p>
            Once a client and server have found each other through a gateway, the next question is
            how they actually shape their conversation: does the client ask for a fixed, predictable
            shape of data (REST), or describe exactly what it wants across multiple resources in one
            round trip (GraphQL)? And when the server needs to tell the client about something new —
            a chat message, a live score, an incoming call — does the client keep asking &quot;anything
            yet?&quot; (long polling), keep one connection open that either side can push through
            (WebSockets), talk peer-to-peer without a server in the middle at all (WebRTC), or just get
            called the moment something happens (webhooks)? This page covers the patterns that answer
            those questions.
          </p>

          <section id="plain-english">
            <h2>In Plain English</h2>
            <p>
              Imagine ordering food. REST is like a restaurant with a fixed menu — you pick items off
              a set list, and each item comes exactly as described, no more, no less flexible. GraphQL
              is like telling a personal chef exactly which ingredients you want combined into one
              dish, and getting back precisely that, in one plate. Now imagine waiting for a delivery:
              long polling is calling the restaurant every five minutes asking &quot;is it here
              yet?&quot;; a WebSocket is staying on a call with them where they&apos;ll speak up the
              moment it arrives; a webhook is them calling you back when it&apos;s ready, so you don&apos;t
              have to ask at all. WebRTC is different again — it&apos;s like the restaurant introducing
              you directly to the delivery driver so the two of you can coordinate the handoff
              yourselves, without the restaurant relaying every message in between.
            </p>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  Every pattern here answers a version of &quot;how do I find out about something new
                  without constantly asking?&quot; REST vs. GraphQL is really about how much data
                  shape flexibility a client gets. WebSockets, long polling, and webhooks are three
                  different answers to &quot;who initiates the check-in, and how often?&quot; WebRTC
                  answers a related but distinct question: &quot;can the two ends just talk directly
                  instead of relaying through my server at all?&quot;
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  The interesting failure modes live at the edges: how does a poorly-designed GraphQL
                  query trigger a cascade of N+1 database calls hidden behind resolvers? What happens
                  when a webhook receiver is briefly down and the sender retries delivery — is your
                  handler actually idempotent, or will it double-process the same event? And what does
                  WebRTC fall back to when no direct peer-to-peer path can be found at all behind a
                  restrictive NAT? These are the follow-up questions that separate a surface-level
                  answer from one that shows you&apos;ve operated these systems.
                </p>
              </Callout>
            </TwoCol>
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>
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
              <li><strong>Simple mental model:</strong> a fixed set of endpoints, each returning a predictable shape, is easy for any client (including ones you don&apos;t control) to consume with nothing more than a standard HTTP client.</li>
              <li><strong>Uses HTTP semantics directly:</strong> status codes, verbs, and headers already carry meaning (404, 201, Cache-Control), so you get a lot of behavior for free instead of reinventing it inside a query language.</li>
              <li><strong>Simple server-side implementation:</strong> each endpoint resolves one predictable query, so there&apos;s no risk of a client submitting an expensive, deeply-nested query that the server has to protect itself against.</li>
            </ul>

            <h4>Disadvantages of REST</h4>
            <ul>
              <li><strong>Over-fetching:</strong> a fixed response shape often includes fields the client has no use for, wasting bandwidth, especially on mobile clients.</li>
              <li><strong>Under-fetching:</strong> assembling one screen&apos;s worth of data (a user, their posts, their friends) frequently needs several sequential round trips to different endpoints.</li>
              <li><strong>Endpoint sprawl:</strong> supporting every client&apos;s exact data needs tends to produce more and more specialized endpoints over time, each one more code to maintain.</li>
              <li><strong>Versioning is awkward:</strong> changing a resource&apos;s shape can break existing clients, usually forcing a new versioned endpoint (<code>/v2/users/1</code>) rather than a clean in-place evolution.</li>
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
              <li><strong>Loses simple HTTP caching:</strong> since every query goes to the same single endpoint (usually via POST), a CDN can&apos;t cache by URL the way it does for REST; caching has to be reimplemented at the client or via a persisted-query layer.</li>
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
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
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
              <strong>What interviewers are listening for:</strong> that you can name the actual
              trade-off (cacheability vs. precision) instead of just saying &quot;GraphQL is more
              flexible,&quot; and that you can reason about a WebSocket vs. long-polling vs. webhook
              choice against the real latency and infrastructure constraints of a given system, not
              just pick the newest-sounding option.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to explain the basic difference
              between REST&apos;s multiple endpoints and GraphQL&apos;s single endpoint, and why
              polling wastes requests compared to a webhook or WebSocket, covers most of what&apos;s
              checked here.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to justify a WebSocket vs.
              long-polling vs. webhook choice against actual latency and infrastructure constraints,
              and to explain why a WebRTC connection sometimes has to fall back to a TURN relay even
              though it&apos;s designed to be peer-to-peer.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>GitHub</strong> — offers both a REST API (v3) and a GraphQL API (v4), letting clients that need precisely-shaped, multi-resource data (e.g. an IDE plugin) avoid dozens of REST round trips.</li>
              <li><strong>Slack &amp; Discord</strong> — use WebSocket connections (a &quot;gateway&quot; connection, in Discord&apos;s own terminology) to push real-time messages, typing indicators, and presence updates to clients instantly.</li>
              <li><strong>Stripe &amp; GitHub webhooks</strong> — notify external systems the instant a payment event or a repository event happens, rather than making integrators poll for changes.</li>
              <li><strong>Google Meet &amp; Discord voice/video</strong> — use WebRTC to route audio and video directly between participants&apos; devices wherever possible, minimizing server relay cost and latency.</li>
              <li><strong>Shopify&apos;s Storefront API</strong> — a GraphQL API purpose-built so storefront clients can assemble complex product/collection views in a single request.</li>
            </ul>
          </section>

          <PageNav
            prev={{ label: 'API Gateways', href: '/pages/distributed-systems/api-gateways' }}
            next={{ label: 'Authentication Mechanisms', href: '/pages/distributed-systems/authentication-mechanisms' }}
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
