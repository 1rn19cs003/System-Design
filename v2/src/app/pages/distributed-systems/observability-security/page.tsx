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
  title: 'Observability & Security — System Design Architectures',
};

const OUTPUT = `Check 1: can viewer read_report? -> ALLOW (role 'viewer' has 'read_report')
Check 2: can viewer delete_report? -> DENY (role 'viewer' lacks 'delete_report')
Check 3: can editor read_report? -> ALLOW (role 'editor' has 'read_report')
Check 4: can editor write_report? -> ALLOW (role 'editor' has 'write_report')
Check 5: can editor delete_report? -> DENY (role 'editor' lacks 'delete_report')
Check 6: can admin delete_report? -> ALLOW (role 'admin' has 'delete_report')
Check 7: can guest write_report? -> DENY (role 'guest' lacks 'write_report')
5 of 7 checks allowed, 2 denied.`;

const snippets = {
  java: {
    code: `import java.util.*;

public class RbacDemo {
    public static void main(String[] args) {
        // Permissions assigned to roles, not directly to users.
        Map<String, Set<String>> rolePermissions = new LinkedHashMap<>();
        rolePermissions.put("viewer", Set.of("read_report"));
        rolePermissions.put("editor", Set.of("read_report", "write_report"));
        rolePermissions.put("admin", Set.of("read_report", "write_report", "delete_report"));
        rolePermissions.put("guest", Set.of());

        // Users assigned to roles (a user could hold more than one role in a real system).
        Map<String, String> userRoles = Map.of(
            "alice", "viewer",
            "bob", "editor",
            "carol", "admin",
            "dave", "guest"
        );

        record Check(String user, String action) {}
        List<Check> checks = List.of(
            new Check("alice", "read_report"),
            new Check("alice", "delete_report"),
            new Check("bob", "read_report"),
            new Check("bob", "write_report"),
            new Check("bob", "delete_report"),
            new Check("carol", "delete_report"),
            new Check("dave", "write_report")
        );

        int allowed = 0, denied = 0;
        int i = 1;
        for (Check c : checks) {
            String role = userRoles.get(c.user());
            boolean can = rolePermissions.getOrDefault(role, Set.of()).contains(c.action());
            String verdict = can ? "ALLOW" : "DENY";
            String reason = can
                ? "role '" + role + "' has '" + c.action() + "'"
                : "role '" + role + "' lacks '" + c.action() + "'";
            System.out.printf("Check %d: can %s %s? -> %s (%s)%n", i++, role, c.action(), verdict, reason);
            if (can) allowed++; else denied++;
        }
        System.out.printf("%d of %d checks allowed, %d denied.%n", allowed, checks.size(), denied);
    }
}`,
    output: OUTPUT,
  },
  python: {
    code: `# Permissions assigned to roles, not directly to users.
role_permissions = {
    "viewer": {"read_report"},
    "editor": {"read_report", "write_report"},
    "admin": {"read_report", "write_report", "delete_report"},
    "guest": set(),
}

# Users assigned to roles (a user could hold more than one role in a real system).
user_roles = {
    "alice": "viewer",
    "bob": "editor",
    "carol": "admin",
    "dave": "guest",
}

checks = [
    ("alice", "read_report"),
    ("alice", "delete_report"),
    ("bob", "read_report"),
    ("bob", "write_report"),
    ("bob", "delete_report"),
    ("carol", "delete_report"),
    ("dave", "write_report"),
]

def can(user, action):
    role = user_roles[user]
    return role, action in role_permissions.get(role, set())

allowed, denied = 0, 0
for i, (user, action) in enumerate(checks, start=1):
    role, ok = can(user, action)
    verdict = "ALLOW" if ok else "DENY"
    reason = f"role '{role}' has '{action}'" if ok else f"role '{role}' lacks '{action}'"
    print(f"Check {i}: can {role} {action}? -> {verdict} ({reason})")
    if ok:
        allowed += 1
    else:
        denied += 1

print(f"{allowed} of {len(checks)} checks allowed, {denied} denied.")`,
    output: OUTPUT,
  },
  javascript: {
    code: `// Permissions assigned to roles, not directly to users.
const rolePermissions = {
  viewer: new Set(["read_report"]),
  editor: new Set(["read_report", "write_report"]),
  admin: new Set(["read_report", "write_report", "delete_report"]),
  guest: new Set(),
};

// Users assigned to roles (a user could hold more than one role in a real system).
const userRoles = {
  alice: "viewer",
  bob: "editor",
  carol: "admin",
  dave: "guest",
};

const checks = [
  ["alice", "read_report"],
  ["alice", "delete_report"],
  ["bob", "read_report"],
  ["bob", "write_report"],
  ["bob", "delete_report"],
  ["carol", "delete_report"],
  ["dave", "write_report"],
];

let allowed = 0;
let denied = 0;

checks.forEach(([user, action], idx) => {
  const role = userRoles[user];
  const ok = (rolePermissions[role] || new Set()).has(action);
  const verdict = ok ? "ALLOW" : "DENY";
  const reason = ok ? \`role '\${role}' has '\${action}'\` : \`role '\${role}' lacks '\${action}'\`;
  console.log(\`Check \${idx + 1}: can \${role} \${action}? -> \${verdict} (\${reason})\`);
  ok ? allowed++ : denied++;
});

console.log(\`\${allowed} of \${checks.length} checks allowed, \${denied} denied.\`);`,
    output: OUTPUT,
  },
  cpp: {
    code: `#include <iostream>
#include <map>
#include <set>
#include <string>
#include <vector>

int main() {
    // Permissions assigned to roles, not directly to users.
    std::map<std::string, std::set<std::string>> rolePermissions = {
        {"viewer", {"read_report"}},
        {"editor", {"read_report", "write_report"}},
        {"admin", {"read_report", "write_report", "delete_report"}},
        {"guest", {}}
    };

    // Users assigned to roles (a user could hold more than one role in a real system).
    std::map<std::string, std::string> userRoles = {
        {"alice", "viewer"}, {"bob", "editor"}, {"carol", "admin"}, {"dave", "guest"}
    };

    std::vector<std::pair<std::string, std::string>> checks = {
        {"alice", "read_report"}, {"alice", "delete_report"},
        {"bob", "read_report"}, {"bob", "write_report"}, {"bob", "delete_report"},
        {"carol", "delete_report"}, {"dave", "write_report"}
    };

    int allowed = 0, denied = 0;
    for (size_t i = 0; i < checks.size(); i++) {
        std::string user = checks[i].first;
        std::string action = checks[i].second;
        std::string role = userRoles[user];
        bool ok = rolePermissions[role].count(action) > 0;
        std::string verdict = ok ? "ALLOW" : "DENY";
        std::string reason = ok
            ? "role '" + role + "' has '" + action + "'"
            : "role '" + role + "' lacks '" + action + "'";
        std::cout << "Check " << (i + 1) << ": can " << role << " " << action << "? -> "
                   << verdict << " (" << reason << ")" << std::endl;
        ok ? allowed++ : denied++;
    }
    std::cout << allowed << " of " << checks.size() << " checks allowed, " << denied << " denied." << std::endl;
    return 0;
}`,
    output: OUTPUT,
  },
};

const qaItems = [
  {
    q: 'What exactly is the difference between authentication and authorization?',
    a: "Authentication answers \"who are you?\" — verifying identity, typically via a password, a token, or a biometric. Authorization answers \"what are you allowed to do?\" — checking whether an already-identified user has permission for a specific action or resource. They're sequential and distinct: a system authenticates you once (you log in), then authorizes every subsequent action against that established identity (can this user delete this report?). Mixing them up is a common interview trip-wire — a 401 Unauthorized response actually means \"you're not authenticated,\" while a 403 Forbidden means \"you're authenticated, but not authorized for this.\"",
  },
  {
    q: 'Why do JWTs enable stateless authentication, and what do you give up for that?',
    a: "A JWT is self-contained and cryptographically signed — the payload carries the claims (user ID, roles, expiry) directly, and any server holding the shared secret (or public key, for asymmetric signing) can verify the signature and trust the claims without querying a database or session store. That's what makes it stateless: any node in a horizontally-scaled fleet can validate a request with zero shared state or coordination. The trade-off is revocation: since there's no central session record, you can't simply \"delete\" a JWT the way you'd delete a server-side session — a compromised or logged-out token stays valid until it naturally expires, unless you build extra infrastructure (a blocklist, short expiries with refresh tokens) specifically to work around this.",
  },
  {
    q: "What does chaos engineering prove that testing alone doesn't?",
    a: "Traditional tests verify that code behaves correctly under conditions you thought to write a test for, in an environment that's usually not production. Chaos engineering verifies that a system's actual, production-scale redundancy and failover mechanisms work when a real, unplanned failure happens — because production has scale, traffic patterns, and configuration drift that staging environments rarely replicate exactly. Netflix built Chaos Monkey on the premise that failures are inevitable at scale, so the only way to be confident your failover actually works is to trigger it deliberately, under controlled conditions, before an uncontrolled outage does it for you.",
  },
  {
    q: 'What are the four golden signals of monitoring, and why those four specifically?',
    a: "Latency (how long requests take), traffic (how much demand the system is under), errors (the rate of failed requests), and saturation (how \"full\" a resource is — CPU, memory, queue depth, connection pool). Together they cover the questions that matter most for spotting user-facing problems early: is it slow, is it getting hit with unusual load, is it actually failing, and is it about to run out of headroom. Most alerting strategies are built by defining thresholds on these four per service rather than trying to monitor every possible metric.",
  },
  {
    q: "Why does TLS matter beyond just \"encrypting traffic\"?",
    a: "Encryption in transit is the part people default to, but TLS also provides data integrity (a tampering attempt in transit is detected, since the data is authenticated, not just scrambled) and — critically — server authentication: the server presents a certificate, issued by a trusted certificate authority, that cryptographically proves it is who it claims to be. Without that certificate check, encryption alone wouldn't stop a man-in-the-middle attacker from impersonating the real server and relaying (or altering) traffic while still being encrypted end-to-end from the client's perspective — the certificate is what lets the client actually trust who it's encrypting the conversation with.",
  },
  {
    q: 'Concretely, how does the TLS handshake establish a secure connection?',
    a: "At a conceptual level: the client connects and the server presents its certificate (containing its public key, signed by a CA the client already trusts). The client verifies that certificate chain, then client and server use asymmetric cryptography just long enough to securely agree on a shared symmetric session key — asymmetric crypto is too slow to encrypt an entire session, so it's only used for this initial key exchange. From that point on, both sides encrypt and decrypt traffic using the fast, shared symmetric key, until the connection closes.",
  },
];

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
            { id: 'interview-questions', label: 'Interview Questions' },
            { id: 'code', label: 'Code & Output' },
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
            <TwoCol>
              <Callout kind="good" title="✓ Reach for JWT-based stateless auth when">
                <ul>
                  <li>You need to verify requests across many horizontally-scaled nodes without a shared session store or extra database round-trip per request.</li>
                  <li>Tokens are short-lived and paired with a refresh-token flow, keeping the &quot;can&apos;t revoke early&quot; window small.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Reach for server-side sessions when">
                <ul>
                  <li>Immediate, reliable revocation matters more than statelessness — a banking app that must be able to instantly kill a session on suspected fraud.</li>
                  <li>You&apos;re fine with the extra lookup cost of checking a session store on every request in exchange for that control.</li>
                </ul>
              </Callout>
            </TwoCol>
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
            <FlowContinue nextId="interview-questions" label="Interview Questions" />
          </FlowStep>

          <FlowStep id="interview-questions" step={5} total={TOTAL_STEPS} title="Interview Questions">
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
            <FlowContinue nextId="code" label="Code & Output" />
          </FlowStep>

          <FlowStep id="code" step={6} total={TOTAL_STEPS} title="Code & Output">
            <p>
              A minimal, deterministic RBAC permission check: a fixed set of roles (viewer, editor,
              admin, guest) each with a fixed list of permissions, a fixed mapping of users to roles,
              and a function that checks &quot;can this user perform this action?&quot; The demo runs
              7 fixed checks and prints ALLOW or DENY for each, along with the reason. Output is
              identical across all four languages.
            </p>
            <CodeTerminal snippets={snippets} />
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
