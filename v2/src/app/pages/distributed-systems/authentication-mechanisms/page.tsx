import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';

export const metadata = {
  title: 'Authentication Mechanisms — System Design Architectures',
};

export default function AuthenticationMechanismsPage() {
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
              { label: 'Authentication Mechanisms' },
            ]}
          />
          <h1 id="overview">Authentication Mechanisms</h1>
          <p>
            A system that doesn&apos;t verify who&apos;s asking, and what they&apos;re allowed to do,
            is a system you can&apos;t trust with real data. This page covers the mechanisms that
            decide who gets to do what across a distributed system: proving identity in the first
            place (authentication), deciding what an already-proven identity is allowed to do
            (authorization), the two dominant ways of remembering that someone already logged in
            (JWT-based and session-based auth), delegating limited access without handing over a
            password (OAuth 2.0), managing permissions at scale (RBAC), and securing the connection
            itself (TLS).
          </p>

          <section id="plain-english">
            <h2>In Plain English</h2>
            <p>
              <strong>Authentication</strong> is the security guard checking your ID at the door (who
              are you?), while <strong>authorization</strong> is the keycard system deciding which
              floors that ID can actually access (what are you allowed to do?).{' '}
              <strong>OAuth</strong> is like a hotel handing your friend a one-time guest keycard to
              your room, without ever handing over your actual house key. A <strong>JWT</strong> is
              like a concert wristband — any gate staff can glance at it and verify it&apos;s
              legitimate without radioing a central desk. A <strong>session</strong>, by contrast, is
              like a coat-check ticket — the ticket itself means nothing without the coat-check desk
              looking up what it corresponds to, but the desk can revoke it instantly by just removing
              the coat. <strong>RBAC</strong> is a keycard tied to a job title rather than a specific
              person — when the person changes roles, you swap which badge they carry instead of
              redesigning every door&apos;s lock. <strong>TLS</strong> is a sealed, tamper-evident
              envelope for every message sent through the building&apos;s mail system, stamped with a
              notarized seal proving who really sent it.
            </p>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  Two questions cover almost everything on this page: &quot;how do we prove who
                  someone is?&quot; (authentication — passwords, OAuth, tokens), and then &quot;given
                  that we know who they are, what are they allowed to do?&quot; (authorization, RBAC).
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  The deeper theme is designing for a token or credential that might leak. JWTs assume
                  a token might be stolen, so they&apos;re short-lived by convention and paired with a
                  separately-stored refresh token. TLS assumes the network path might be hostile, so it
                  authenticates the server, not just encrypts the bytes. Good security design is
                  largely about assuming the thing you hoped wouldn&apos;t happen, will.
                </p>
              </Callout>
            </TwoCol>
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>

            <h3>Authentication vs. authorization</h3>
            <p>
              <strong>Authentication</strong> establishes identity — proving you are who you claim to
              be, typically via a password, an API key, a certificate, or a token issued after an
              earlier login. <strong>Authorization</strong> comes after, and on every subsequent
              request: given a known, authenticated identity, is this specific action on this specific
              resource permitted? Conflating the two is a common source of security bugs — checking
              that a request is authenticated is not the same as checking that this particular
              authenticated user is allowed to delete this particular record.
            </p>

            <h3>OAuth 2.0 and JWTs</h3>
            <p>
              <strong>OAuth 2.0</strong> is an authorization framework, not an authentication protocol
              by itself — it defines how a third-party application can be granted limited, scoped
              access to a resource on a user&apos;s behalf, without that application ever seeing the
              user&apos;s actual password. When you click &quot;Sign in with Google,&quot; you&apos;re
              redirected to Google, you authenticate directly with Google, and Google hands the
              requesting app a token representing a limited grant of access — the app never touches
              your Google password. <strong>JWT (JSON Web Token)</strong> is a common token format used
              to carry the result of that process (or of a normal login): a compact, self-contained
              string of three base64url-encoded parts — a header, a payload of claims (user ID, roles,
              expiry), and a cryptographic signature — that any server holding the signing secret (or
              the corresponding public key) can verify without a database lookup, which is what makes
              JWT-based auth <strong>stateless</strong> and easy to scale horizontally.
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
              <strong>users</strong> to one or more of those roles, rather than granting permissions to
              individual users directly. This one layer of indirection is the entire point: when a new
              employee joins, you assign them the &quot;editor&quot; role instead of manually
              re-deriving which of the dozens of individual permissions an editor should have; when the
              definition of what an editor can do changes, you update the role once instead of updating
              every editor&apos;s individual permission list. AWS IAM is a large-scale real-world
              example — permissions are defined in policies, policies are attached to roles, and
              users/services assume roles rather than being granted raw permissions one by one.
            </p>

            <h3>SSL/TLS</h3>
            <p>
              TLS (the modern successor to SSL) is the cryptographic protocol underlying HTTPS,
              providing three guarantees at once: <strong>encryption in transit</strong> (an
              eavesdropper on the network can&apos;t read the data), <strong>data integrity</strong>{' '}
              (tampering with the data in transit is detectable), and <strong>server
              authentication</strong> (the server proves its identity via a certificate signed by a
              trusted certificate authority, so the client knows it&apos;s actually talking to the real
              server, not an impersonator). At a conceptual level, the handshake works by having the
              server present its certificate first; the client verifies it against a trusted CA, then
              the two sides use asymmetric cryptography just long enough to securely agree on a shared
              symmetric session key, and switch to that faster symmetric encryption for the rest of the
              connection.
            </p>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
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
              authentication and authorization in your explanation, and the specific trade-off JWTs
              make (statelessness vs. hard revocation) stated in your own words rather than recited.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to define authentication vs.
              authorization correctly, and explain RBAC in one sentence (&quot;permissions go on roles,
              users get roles&quot;), covers most of what&apos;s asked at the entry level.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to discuss what happens when a JWT
              needs to be revoked before it expires (short expiries plus refresh tokens, or a
              server-side blocklist that partially reintroduces state), and why OAuth is an
              authorization framework rather than an authentication mechanism, strictly speaking.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>&quot;Sign in with Google/GitHub&quot;</strong> — the most common real-world encounter with OAuth 2.0, letting a third-party app authenticate you via an identity provider without ever seeing your password.</li>
              <li><strong>Auth0 and Firebase Auth</strong> — managed authentication services that issue JWTs as stateless session tokens, letting client apps and backend APIs verify a user&apos;s identity without a shared session database.</li>
              <li><strong>AWS IAM</strong> — a production-scale RBAC (and more broadly, policy-based) system: permissions are defined in policies, attached to roles, and users or services assume roles to gain exactly the access those policies grant.</li>
              <li><strong>Classic Express/Django session middleware</strong> — a widely used session-based authentication setup, typically backed by Redis, that favors instant revocation over statelessness.</li>
              <li><strong>Every HTTPS website</strong> — TLS certificates signed by a trusted certificate authority (Let&apos;s Encrypt being the dominant free one) are what make the padlock icon in a browser meaningful.</li>
            </ul>
          </section>

          <PageNav
            prev={{ label: 'Realtime Communication', href: '/pages/distributed-systems/realtime-communication' }}
            next={{ label: 'Big Data & Streaming', href: '/pages/distributed-systems/big-data-processing' }}
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
