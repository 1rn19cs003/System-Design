import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'API & Communication Patterns — System Design Architectures',
};

const OUTPUT = `Call 1 (key=idem-001): processing charge... charged $42.00, chargeId=ch_1
Call 2 (key=idem-001): duplicate key, returning cached result -> chargeId=ch_1
Call 3 (key=idem-001): duplicate key, returning cached result -> chargeId=ch_1
Call 4 (key=idem-002): processing charge... charged $17.50, chargeId=ch_2`;

const snippets = {
  java: {
    code: `import java.util.*;

public class IdempotencyDemo {
    static Map<String, String> cache = new LinkedHashMap<>();
    static int nextChargeId = 1;

    static String charge(String idempotencyKey, double amount) {
        if (cache.containsKey(idempotencyKey)) {
            return "duplicate key, returning cached result -> " + cache.get(idempotencyKey);
        }
        String chargeId = "ch_" + nextChargeId++;
        cache.put(idempotencyKey, chargeId);
        return String.format("processing charge... charged $%.2f, chargeId=%s", amount, chargeId);
    }

    public static void main(String[] args) {
        System.out.println("Call 1 (key=idem-001): " + charge("idem-001", 42.00));
        System.out.println("Call 2 (key=idem-001): " + charge("idem-001", 42.00));
        System.out.println("Call 3 (key=idem-001): " + charge("idem-001", 42.00));
        System.out.println("Call 4 (key=idem-002): " + charge("idem-002", 17.50));
    }
}`,
    output: OUTPUT,
  },
  python: {
    code: `cache = {}
next_charge_id = 1

def charge(idempotency_key, amount):
    global next_charge_id
    if idempotency_key in cache:
        return f"duplicate key, returning cached result -> {cache[idempotency_key]}"
    charge_id = f"ch_{next_charge_id}"
    next_charge_id += 1
    cache[idempotency_key] = charge_id
    return f"processing charge... charged \${amount:.2f}, chargeId={charge_id}"

print("Call 1 (key=idem-001):", charge("idem-001", 42.00))
print("Call 2 (key=idem-001):", charge("idem-001", 42.00))
print("Call 3 (key=idem-001):", charge("idem-001", 42.00))
print("Call 4 (key=idem-002):", charge("idem-002", 17.50))`,
    output: OUTPUT,
  },
  javascript: {
    code: `const cache = new Map();
let nextChargeId = 1;

function charge(idempotencyKey, amount) {
  if (cache.has(idempotencyKey)) {
    return \`duplicate key, returning cached result -> \${cache.get(idempotencyKey)}\`;
  }
  const chargeId = \`ch_\${nextChargeId++}\`;
  cache.set(idempotencyKey, chargeId);
  return \`processing charge... charged $\${amount.toFixed(2)}, chargeId=\${chargeId}\`;
}

console.log("Call 1 (key=idem-001):", charge("idem-001", 42.00));
console.log("Call 2 (key=idem-001):", charge("idem-001", 42.00));
console.log("Call 3 (key=idem-001):", charge("idem-001", 42.00));
console.log("Call 4 (key=idem-002):", charge("idem-002", 17.50));`,
    output: OUTPUT,
  },
  cpp: {
    code: `#include <iostream>
#include <map>
#include <string>
#include <iomanip>
#include <sstream>

std::map<std::string, std::string> cache;
int nextChargeId = 1;

std::string charge(const std::string& idempotencyKey, double amount) {
    auto it = cache.find(idempotencyKey);
    if (it != cache.end()) {
        return "duplicate key, returning cached result -> " + it->second;
    }
    std::string chargeId = "ch_" + std::to_string(nextChargeId++);
    cache[idempotencyKey] = chargeId;
    std::ostringstream out;
    out << "processing charge... charged $" << std::fixed << std::setprecision(2)
        << amount << ", chargeId=" << chargeId;
    return out.str();
}

int main() {
    std::cout << "Call 1 (key=idem-001): " << charge("idem-001", 42.00) << std::endl;
    std::cout << "Call 2 (key=idem-001): " << charge("idem-001", 42.00) << std::endl;
    std::cout << "Call 3 (key=idem-001): " << charge("idem-001", 42.00) << std::endl;
    std::cout << "Call 4 (key=idem-002): " << charge("idem-002", 17.50) << std::endl;
    return 0;
}`,
    output: OUTPUT,
  },
};

const qaItems = [
  {
    q: 'Why does idempotency matter specifically because of network retries?',
    a: "A network failure can happen on either leg of a request: the request itself can be lost before reaching the server, or the response can be lost on the way back after the server already did the work. In the second case, the client has no way to distinguish \"it never arrived\" from \"it arrived and succeeded, but I never heard back\" — so a naive client that retries on any timeout risks re-submitting a request the server already fully processed. For a payment or order API, that difference is the difference between one charge and two. An idempotency key removes the ambiguity: the client generates one key per logical operation, sends it on every retry, and the server treats repeats of the same key as \"already handled\" rather than \"do it again.\"",
  },
  {
    q: 'What are the core trade-offs between REST and GraphQL?',
    a: "REST exposes multiple resource-based endpoints, each returning a server-defined, fixed shape of data; that fixed shape makes REST responses trivially cacheable by URL (a CDN or HTTP cache just keys on the URL) but it commonly causes over-fetching (getting fields you don't need) or under-fetching (needing several follow-up calls to assemble a full view, like a user, their posts, and their friends). GraphQL exposes a single endpoint where the client specifies exactly the fields it wants in one query, eliminating over/under-fetching and round trips, but it loses that easy URL-based caching (most GraphQL caching is done at the client, e.g. Apollo's normalized cache) and shifts real complexity onto the server, which now has to resolve arbitrary nested queries efficiently.",
  },
  {
    q: 'When would you choose WebSockets over long polling?',
    a: "Choose WebSockets when you need frequent, low-latency, bidirectional communication — chat apps, live dashboards, multiplayer games — because after one upgrade handshake, both sides can push data over the same open connection with almost no per-message overhead. Long polling is preferable when updates are infrequent, your infrastructure (proxies, load balancers, corporate firewalls) doesn't reliably support persistent connections, or you want to keep using plain stateless HTTP semantics without maintaining connection state on your servers. The practical cost of WebSockets is that an open connection consumes a server-side resource (a socket, some memory) for as long as the client is connected, which matters at very large scale.",
  },
  {
    q: 'What does an API gateway centralize, and what should stay inside each individual service?',
    a: "An API gateway centralizes cross-cutting concerns that are identical across every service and have nothing to do with business logic: authentication/token validation, rate limiting, TLS termination, request routing to the right backend, and sometimes response transformation or aggregation. What should stay inside each service is anything specific to that service's domain: business rules, data validation tied to that service's model, and authorization decisions that depend on domain-specific state (e.g. \"can this specific user cancel this specific order\") rather than just \"is this a valid, authenticated caller.\" The dividing line interviewers look for is: infrastructure concern versus domain concern.",
  },
  {
    q: 'What are the trade-offs between webhooks and polling for detecting an external event?',
    a: "Polling means you repeatedly ask a service \"anything new?\" on a fixed interval — simple to implement and works behind almost any network setup, but wastes requests when nothing has changed and adds latency up to your poll interval before you notice an event. Webhooks invert the relationship: the external service calls an endpoint you expose the moment an event happens, giving you near-instant notification with no wasted requests, but they require you to expose a public, reliable endpoint, handle retries and duplicate deliveries from the sender's side, and verify the caller is who it claims to be (e.g. via a signing secret) since anyone who finds your webhook URL could otherwise post fake events to it.",
  },
  {
    q: 'How does WebRTC avoid routing audio/video through a central server, and why does that matter?',
    a: "WebRTC negotiates a direct peer-to-peer connection between two browsers (using STUN/TURN servers only to help them discover reachable network paths through NAT, not to relay the actual media in the common case), so audio, video, and data flow directly between the participants' devices rather than through your application server. This matters because relaying every video frame through your own infrastructure would multiply your bandwidth costs and add a round trip of latency for every packet; a signaling server is still needed up front to help the two peers exchange connection details, but once the peer-to-peer link is established, that server is out of the media path entirely.",
  },
];

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
            { id: 'interview-questions', label: 'Interview Questions' },
            { id: 'code', label: 'Code & Output' },
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

          <section id="plain-english">
            <h2>In Plain English</h2>
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
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for GraphQL / WebSockets / webhooks when">
                <ul>
                  <li>Clients need precisely-shaped, multi-resource data in one round trip (GraphQL), or need frequent low-latency bidirectional updates (WebSockets), or need near-instant notification of external events without wasted polling (webhooks).</li>
                  <li>You control both ends well enough to handle the added complexity: query cost control on the server for GraphQL, connection state for WebSockets, endpoint security and retry handling for webhooks.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Reach for REST / long polling / polling when">
                <ul>
                  <li>You want simple, cacheable, resource-oriented endpoints (REST) or need to work reliably through infrastructure that doesn&apos;t support persistent connections well (long polling).</li>
                  <li>You don&apos;t control the calling side and can&apos;t expose a public endpoint at all (polling is sometimes the only option available to a client).</li>
                </ul>
              </Callout>
            </TwoCol>
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
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Stripe</strong> — requires an <code>Idempotency-Key</code> header on payment-creating API calls specifically so a network retry can never double-charge a customer.</li>
              <li><strong>Kong, AWS API Gateway, Apigee</strong> — dedicated API gateway products that handle routing, auth, and rate limiting in front of microservice backends at scale.</li>
              <li><strong>GitHub</strong> — offers both a REST API (v3) and a GraphQL API (v4), letting clients that need precisely-shaped, multi-resource data (e.g. an IDE plugin) avoid dozens of REST round trips.</li>
              <li><strong>Slack &amp; Discord</strong> — use WebSocket connections (a &quot;gateway&quot; connection, in Discord&apos;s own terminology) to push real-time messages, typing indicators, and presence updates to clients instantly.</li>
              <li><strong>Stripe &amp; GitHub webhooks</strong> — notify external systems the instant a payment event or a repository event happens, rather than making integrators poll for changes.</li>
              <li><strong>Google Meet &amp; Discord voice/video</strong> — use WebRTC to route audio and video directly between participants&apos; devices wherever possible, minimizing server relay cost and latency.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>
              A simplified idempotency-key cache for a &quot;charge&quot; endpoint. The first call
              with a given key processes the charge and stores the result; two further calls with the
              same key return the cached result without reprocessing; a call with a new key processes
              a new charge. The output is identical across all four languages.
            </p>
            <CodeTerminal snippets={snippets} />
          </section>

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
