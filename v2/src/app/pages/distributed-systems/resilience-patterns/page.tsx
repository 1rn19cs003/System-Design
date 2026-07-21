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
  title: 'Resilience Patterns — System Design Architectures',
};

const OUTPUT = `Threshold: 3 consecutive failures trip the breaker. Reset window: 3 calls while open before a trial.
Call 1: FAIL | state: CLOSED | ALLOWED (call attempted, failed)
Call 2: FAIL | state: CLOSED | ALLOWED (call attempted, failed)
Call 3: FAIL | state: CLOSED -> OPEN | ALLOWED (call attempted, failed, threshold reached)
Call 4: FAIL | state: OPEN | SHORT-CIRCUITED (no call attempted)
Call 5: FAIL | state: OPEN | SHORT-CIRCUITED (no call attempted)
Call 6: SUCCESS | state: OPEN -> HALF_OPEN -> CLOSED | ALLOWED (trial call)
Call 7: SUCCESS | state: CLOSED | ALLOWED (call attempted, succeeded)
Call 8: SUCCESS | state: CLOSED | ALLOWED (call attempted, succeeded)
Final state: CLOSED`;

const snippets = {
  java: {
    code: `import java.util.*;

public class CircuitBreakerDemo {
    enum State { CLOSED, OPEN, HALF_OPEN }

    static class CircuitBreaker {
        final int failureThreshold;
        final int resetAfterCalls; // simplified: "timeout" modeled as a call count, for determinism
        State state = State.CLOSED;
        int consecutiveFailures = 0;
        int callsSinceOpened = 0;

        CircuitBreaker(int failureThreshold, int resetAfterCalls) {
            this.failureThreshold = failureThreshold;
            this.resetAfterCalls = resetAfterCalls;
        }

        // Returns [outcome, pathTaken] describing what happened for this call.
        String[] call(boolean wouldSucceed) {
            State before = state;
            State mid = state;
            if (state == State.OPEN) {
                callsSinceOpened++;
                if (callsSinceOpened >= resetAfterCalls) {
                    state = State.HALF_OPEN;
                    mid = State.HALF_OPEN;
                } else {
                    return new String[]{"SHORT-CIRCUITED (no call attempted)", pathStr(before, mid, state)};
                }
            }
            String outcome = attempt(wouldSucceed);
            return new String[]{outcome, pathStr(before, mid, state)};
        }

        private String attempt(boolean wouldSucceed) {
            if (wouldSucceed) {
                if (state == State.HALF_OPEN) {
                    state = State.CLOSED;
                    consecutiveFailures = 0;
                    return "ALLOWED (trial call)";
                }
                consecutiveFailures = 0;
                return "ALLOWED (call attempted, succeeded)";
            } else {
                consecutiveFailures++;
                if (consecutiveFailures >= failureThreshold) {
                    state = State.OPEN;
                    callsSinceOpened = 0;
                    return "ALLOWED (call attempted, failed, threshold reached)";
                }
                return "ALLOWED (call attempted, failed)";
            }
        }

        private String pathStr(State a, State b, State c) {
            if (a == b && b == c) return a.toString();
            if (a == b) return a + " -> " + c;
            return a + " -> " + b + " -> " + c;
        }
    }

    public static void main(String[] args) {
        boolean[] results = {false, false, false, false, false, true, true, true};
        System.out.println("Threshold: 3 consecutive failures trip the breaker. Reset window: 3 calls while open before a trial.");
        CircuitBreaker cb = new CircuitBreaker(3, 3);
        for (int i = 0; i < results.length; i++) {
            String[] res = cb.call(results[i]);
            String label = results[i] ? "SUCCESS" : "FAIL";
            System.out.println("Call " + (i + 1) + ": " + label + " | state: " + res[1] + " | " + res[0]);
        }
        System.out.println("Final state: " + cb.state);
    }
}`,
    output: OUTPUT,
  },
  python: {
    code: `class CircuitBreaker:
    # Simplified breaker: "timeout" is modeled as a fixed number of
    # calls while OPEN, so the demo stays deterministic.
    def __init__(self, failure_threshold, reset_after_calls):
        self.failure_threshold = failure_threshold
        self.reset_after_calls = reset_after_calls
        self.state = "CLOSED"
        self.consecutive_failures = 0
        self.calls_since_opened = 0

    def call(self, would_succeed):
        before = self.state
        mid = self.state
        if self.state == "OPEN":
            self.calls_since_opened += 1
            if self.calls_since_opened >= self.reset_after_calls:
                self.state = "HALF_OPEN"
                mid = "HALF_OPEN"
            else:
                return "SHORT-CIRCUITED (no call attempted)", self._path(before, mid, self.state)
        outcome = self._attempt(would_succeed)
        return outcome, self._path(before, mid, self.state)

    def _attempt(self, would_succeed):
        if would_succeed:
            if self.state == "HALF_OPEN":
                self.state = "CLOSED"
                self.consecutive_failures = 0
                return "ALLOWED (trial call)"
            self.consecutive_failures = 0
            return "ALLOWED (call attempted, succeeded)"
        else:
            self.consecutive_failures += 1
            if self.consecutive_failures >= self.failure_threshold:
                self.state = "OPEN"
                self.calls_since_opened = 0
                return "ALLOWED (call attempted, failed, threshold reached)"
            return "ALLOWED (call attempted, failed)"

    @staticmethod
    def _path(a, b, c):
        if a == b == c:
            return a
        if a == b:
            return f"{a} -> {c}"
        return f"{a} -> {b} -> {c}"


results = [False, False, False, False, False, True, True, True]
print("Threshold: 3 consecutive failures trip the breaker. Reset window: 3 calls while open before a trial.")
cb = CircuitBreaker(3, 3)
for i, would_succeed in enumerate(results, start=1):
    outcome, path = cb.call(would_succeed)
    label = "SUCCESS" if would_succeed else "FAIL"
    print(f"Call {i}: {label} | state: {path} | {outcome}")
print(f"Final state: {cb.state}")`,
    output: OUTPUT,
  },
  javascript: {
    code: `class CircuitBreaker {
  // Simplified breaker: "timeout" is modeled as a fixed number of
  // calls while OPEN, so the demo stays deterministic.
  constructor(failureThreshold, resetAfterCalls) {
    this.failureThreshold = failureThreshold;
    this.resetAfterCalls = resetAfterCalls;
    this.state = "CLOSED";
    this.consecutiveFailures = 0;
    this.callsSinceOpened = 0;
  }

  call(wouldSucceed) {
    const before = this.state;
    let mid = this.state;
    if (this.state === "OPEN") {
      this.callsSinceOpened++;
      if (this.callsSinceOpened >= this.resetAfterCalls) {
        this.state = "HALF_OPEN";
        mid = "HALF_OPEN";
      } else {
        return ["SHORT-CIRCUITED (no call attempted)", this.path(before, mid, this.state)];
      }
    }
    const outcome = this.attempt(wouldSucceed);
    return [outcome, this.path(before, mid, this.state)];
  }

  attempt(wouldSucceed) {
    if (wouldSucceed) {
      if (this.state === "HALF_OPEN") {
        this.state = "CLOSED";
        this.consecutiveFailures = 0;
        return "ALLOWED (trial call)";
      }
      this.consecutiveFailures = 0;
      return "ALLOWED (call attempted, succeeded)";
    } else {
      this.consecutiveFailures++;
      if (this.consecutiveFailures >= this.failureThreshold) {
        this.state = "OPEN";
        this.callsSinceOpened = 0;
        return "ALLOWED (call attempted, failed, threshold reached)";
      }
      return "ALLOWED (call attempted, failed)";
    }
  }

  path(a, b, c) {
    if (a === b && b === c) return a;
    if (a === b) return \`\${a} -> \${c}\`;
    return \`\${a} -> \${b} -> \${c}\`;
  }
}

const results = [false, false, false, false, false, true, true, true];
console.log("Threshold: 3 consecutive failures trip the breaker. Reset window: 3 calls while open before a trial.");
const cb = new CircuitBreaker(3, 3);
results.forEach((wouldSucceed, i) => {
  const [outcome, path] = cb.call(wouldSucceed);
  const label = wouldSucceed ? "SUCCESS" : "FAIL";
  console.log(\`Call \${i + 1}: \${label} | state: \${path} | \${outcome}\`);
});
console.log(\`Final state: \${cb.state}\`);`,
    output: OUTPUT,
  },
  cpp: {
    code: `#include <iostream>
#include <vector>
#include <string>

class CircuitBreaker {
public:
    // Simplified breaker: "timeout" is modeled as a fixed number of
    // calls while OPEN, so the demo stays deterministic.
    CircuitBreaker(int failureThreshold, int resetAfterCalls)
        : failureThreshold(failureThreshold), resetAfterCalls(resetAfterCalls) {}

    std::string state = "CLOSED";

    std::pair<std::string, std::string> call(bool wouldSucceed) {
        std::string before = state;
        std::string mid = state;
        if (state == "OPEN") {
            callsSinceOpened++;
            if (callsSinceOpened >= resetAfterCalls) {
                state = "HALF_OPEN";
                mid = "HALF_OPEN";
            } else {
                return {"SHORT-CIRCUITED (no call attempted)", path(before, mid, state)};
            }
        }
        std::string outcome = attempt(wouldSucceed);
        return {outcome, path(before, mid, state)};
    }

private:
    int failureThreshold;
    int resetAfterCalls;
    int consecutiveFailures = 0;
    int callsSinceOpened = 0;

    std::string attempt(bool wouldSucceed) {
        if (wouldSucceed) {
            if (state == "HALF_OPEN") {
                state = "CLOSED";
                consecutiveFailures = 0;
                return "ALLOWED (trial call)";
            }
            consecutiveFailures = 0;
            return "ALLOWED (call attempted, succeeded)";
        } else {
            consecutiveFailures++;
            if (consecutiveFailures >= failureThreshold) {
                state = "OPEN";
                callsSinceOpened = 0;
                return "ALLOWED (call attempted, failed, threshold reached)";
            }
            return "ALLOWED (call attempted, failed)";
        }
    }

    static std::string path(const std::string& a, const std::string& b, const std::string& c) {
        if (a == b && b == c) return a;
        if (a == b) return a + " -> " + c;
        return a + " -> " + b + " -> " + c;
    }
};

int main() {
    std::vector<bool> results = {false, false, false, false, false, true, true, true};
    std::cout << "Threshold: 3 consecutive failures trip the breaker. Reset window: 3 calls while open before a trial." << std::endl;
    CircuitBreaker cb(3, 3);
    for (size_t i = 0; i < results.size(); i++) {
        auto [outcome, path] = cb.call(results[i]);
        std::string label = results[i] ? "SUCCESS" : "FAIL";
        std::cout << "Call " << (i + 1) << ": " << label << " | state: " << path << " | " << outcome << std::endl;
    }
    std::cout << "Final state: " << cb.state << std::endl;
    return 0;
}`,
    output: OUTPUT,
  },
};

const qaItems = [
  {
    q: "What are the three circuit breaker states, and why does half-open need to exist at all — why not just go straight from open back to closed?",
    a: "A circuit breaker has three states: closed (calls flow through normally, failures are counted), open (calls are short-circuited immediately without touching the downstream service, protecting both the caller and the already-struggling dependency), and half-open (a small number of trial calls are allowed through to test whether the dependency has recovered). Half-open exists because going straight from open back to closed would mean blindly resuming full traffic to a service that might still be down — if it's still failing, you'd immediately re-trip the breaker after dumping a full load of retries on it, which is exactly the thundering-herd problem you were trying to avoid. Half-open lets the breaker test recovery with a small, controlled trial before committing to full traffic again.",
  },
  {
    q: "How is a circuit breaker different from just adding retries with backoff?",
    a: "Retries and circuit breakers solve different problems and are normally used together, not as alternatives. A retry is a per-call decision: \"this specific request failed, try it again (perhaps with backoff),\" and it still hits the downstream service every time, which is fine for transient blips but actively harmful when the service is genuinely down or overloaded — retries just add more load to a struggling system. A circuit breaker is a cross-call, stateful decision: it watches the failure rate over many calls and, once it crosses a threshold, stops sending traffic to the dependency entirely for a period, protecting both the caller's resources (threads, connections) and the downstream service from being hit with a wave of retries while it's trying to recover.",
  },
  {
    q: "What does a bulkhead actually protect against, and how does the name relate to its function?",
    a: "The name comes from a ship's bulkheads — physical partitions that divide the hull into separate watertight compartments, so a hull breach in one compartment floods only that section instead of sinking the entire ship. In software, a bulkhead means isolating resource pools (thread pools, connection pools, semaphores) per dependency, so that if calls to one slow or failing downstream service exhaust their allotted pool, requests to unrelated dependencies still have their own separate pool of threads/connections available and keep working normally. Without bulkheads, a single shared thread pool means one bad dependency can starve every other code path in the service, turning a partial outage into a total one.",
  },
  {
    q: "Walk through how a cascading failure actually propagates from one slow service to a full outage.",
    a: "It starts with one service (say, C) becoming slow — not necessarily down, just responding much more slowly than usual. Its callers (B) are making synchronous calls to C and, without a timeout or with too generous a timeout, their request-handling threads sit blocked waiting on C's response. Because B has a finite thread or connection pool, enough concurrent slow calls to C exhaust that pool entirely, so B can no longer serve any request — including ones that don't depend on C at all. B's callers (A) now experience the same thing one level up: their calls to B start timing out or hanging, exhausting A's own thread pool. This repeats at each layer of the call graph, and what began as one component being slow becomes a full outage across every service that transitively depends on it. Timeouts, retries with exponential backoff and jitter, bulkheads, and circuit breakers each interrupt this chain at a different point — timeouts and circuit breakers stop calls from hanging or continuing to a known-bad dependency, and bulkheads stop one dependency's exhaustion from starving unrelated request paths.",
  },
  {
    q: "What's the distinction between a sidecar and a service mesh?",
    a: "A sidecar is a single deployment pattern: a helper process (a proxy, a logging agent, a metrics collector) deployed alongside one service instance, typically in the same pod, intercepting that instance's network traffic without requiring any change to the service's own code. A service mesh is the larger system built on top of that pattern: it's the combination of a sidecar proxy attached to every service in the fleet (the \"data plane\") plus a central control plane that configures all of those sidecars uniformly — pushing routing rules, mTLS certificates, and retry/timeout policy to every proxy at once. In short, a sidecar is the building block; a service mesh (like Istio or Linkerd) is the fleet-wide system of sidecars plus centralized control that makes cross-cutting networking concerns consistent across every service, instead of each team configuring retries and TLS independently per service.",
  },
];

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
            { id: 'interview-questions', label: 'Interview Questions' },
            { id: 'code', label: 'Code & Output' },
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
            <TwoCol>
              <Callout kind="good" title="✓ Circuit breakers and bulkheads are worth the complexity when">
                <ul>
                  <li>A dependency call is synchronous and on a critical request path, where a hang or failure can consume caller resources or block unrelated requests.</li>
                  <li>The dependency has a realistic chance of degrading independently of the caller (a different team, different deploy cadence, different failure domain).</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Be careful about over-applying resilience machinery when">
                <ul>
                  <li>Thresholds are set too aggressively — a breaker that trips on normal transient blips reduces your own availability instead of protecting it.</li>
                  <li>You add retries on top of a circuit breaker without backoff/jitter, which can itself generate the retry storm that overwhelms a recovering dependency.</li>
                </ul>
              </Callout>
            </TwoCol>
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
            <FlowContinue nextId="interview-questions" label="Interview Questions" />
          </FlowStep>

          <FlowStep id="interview-questions" step={5} total={TOTAL_STEPS} title="Interview Questions">
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
            <FlowContinue nextId="code" label="Code & Output" />
          </FlowStep>

          <FlowStep id="code" step={6} total={TOTAL_STEPS} title="Code & Output">
            <p>
              A deterministic circuit breaker simulation. The breaker trips after 3 consecutive
              failures, short-circuits calls while open, and (to keep the demo deterministic) treats
              a fixed number of calls while open as the equivalent of a timeout elapsing before moving
              to half-open. The fixed sequence of 8 calls — 5 failures, then 3 successes — walks
              through every transition: closed to open, open short-circuiting, open to half-open, and
              half-open back to closed.
            </p>
            <CodeTerminal snippets={snippets} />
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
