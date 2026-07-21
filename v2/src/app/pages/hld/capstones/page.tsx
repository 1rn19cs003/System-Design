import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Capstone: Rate Limiter — System Design Architectures',
};

const snippets = {
  java: {
    code: `public class RateLimiter {
    static final double CAPACITY = 5.0;
    static final double REFILL_RATE_PER_SEC = 2.0;

    static class TokenBucket {
        double capacity;
        double refillRate;
        double tokens;
        long lastRefillNanos;

        TokenBucket(double capacity, double refillRate) {
            this.capacity = capacity;
            this.refillRate = refillRate;
            this.tokens = capacity;
            this.lastRefillNanos = System.nanoTime();
        }

        void refill() {
            long now = System.nanoTime();
            double elapsedSeconds = (now - lastRefillNanos) / 1_000_000_000.0;
            double added = elapsedSeconds * refillRate;
            if (added > 0) {
                tokens = Math.min(capacity, tokens + added);
                lastRefillNanos = now;
            }
        }

        boolean allowRequest() {
            refill();
            if (tokens >= 1.0) {
                tokens -= 1.0;
                return true;
            }
            return false;
        }
    }

    public static void main(String[] args) throws InterruptedException {
        TokenBucket bucket = new TokenBucket(CAPACITY, REFILL_RATE_PER_SEC);
        long start = System.nanoTime();

        System.out.println("Burst of 8 requests with no delay (capacity 5):");
        for (int i = 0; i < 8; i++) {
            boolean allowed = bucket.allowRequest();
            double elapsedMs = (System.nanoTime() - start) / 1_000_000.0;
            System.out.printf("  request %d at %.0f ms: %s%n", i + 1, elapsedMs, allowed ? "allowed" : "REJECTED (rate limited)");
        }

        System.out.println("Waiting 1.5s for tokens to refill...");
        Thread.sleep(1500);

        System.out.println("3 more requests after waiting:");
        for (int i = 0; i < 3; i++) {
            boolean allowed = bucket.allowRequest();
            double elapsedMs = (System.nanoTime() - start) / 1_000_000.0;
            System.out.printf("  request %d at %.0f ms: %s%n", i + 1, elapsedMs, allowed ? "allowed" : "REJECTED (rate limited)");
        }
    }
}`,
    output: `Burst of 8 requests with no delay (capacity 5):
  request 1 at 0 ms: allowed
  request 2 at 0 ms: allowed
  request 3 at 0 ms: allowed
  request 4 at 0 ms: allowed
  request 5 at 0 ms: allowed
  request 6 at 0 ms: REJECTED (rate limited)
  request 7 at 0 ms: REJECTED (rate limited)
  request 8 at 0 ms: REJECTED (rate limited)
Waiting 1.5s for tokens to refill...
3 more requests after waiting:
  request 1 at 1501 ms: allowed
  request 2 at 1501 ms: allowed
  request 3 at 1501 ms: allowed

(Representative sample — Java was not executed in this sandbox; see note below.)`,
  },
  python: {
    code: `import time

CAPACITY = 5
REFILL_RATE_PER_SEC = 2

class TokenBucket:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = capacity
        self.last_refill = time.perf_counter()

    def _refill(self):
        now = time.perf_counter()
        elapsed = now - self.last_refill
        added = elapsed * self.refill_rate
        if added > 0:
            self.tokens = min(self.capacity, self.tokens + added)
            self.last_refill = now

    def allow_request(self):
        self._refill()
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False

if __name__ == "__main__":
    bucket = TokenBucket(CAPACITY, REFILL_RATE_PER_SEC)
    start = time.perf_counter()

    print("Burst of 8 requests with no delay (capacity 5):")
    for i in range(8):
        allowed = bucket.allow_request()
        elapsed_ms = (time.perf_counter() - start) * 1000
        print(f"  request {i + 1} at {elapsed_ms:.0f} ms: {'allowed' if allowed else 'REJECTED (rate limited)'}")

    print("Waiting 1.5s for tokens to refill...")
    time.sleep(1.5)

    print("3 more requests after waiting:")
    for i in range(3):
        allowed = bucket.allow_request()
        elapsed_ms = (time.perf_counter() - start) * 1000
        print(f"  request {i + 1} at {elapsed_ms:.0f} ms: {'allowed' if allowed else 'REJECTED (rate limited)'}")`,
    output: `Burst of 8 requests with no delay (capacity 5):
  request 1 at 0 ms: allowed
  request 2 at 0 ms: allowed
  request 3 at 0 ms: allowed
  request 4 at 0 ms: allowed
  request 5 at 0 ms: allowed
  request 6 at 0 ms: REJECTED (rate limited)
  request 7 at 0 ms: REJECTED (rate limited)
  request 8 at 0 ms: REJECTED (rate limited)
Waiting 1.5s for tokens to refill...
3 more requests after waiting:
  request 1 at 1502 ms: allowed
  request 2 at 1502 ms: allowed
  request 3 at 1502 ms: allowed`,
  },
  javascript: {
    code: `const CAPACITY = 5;
const REFILL_RATE_PER_SEC = 2;

class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = capacity;
    this.lastRefill = process.hrtime.bigint();
  }

  refill() {
    const now = process.hrtime.bigint();
    const elapsedSeconds = Number(now - this.lastRefill) / 1e9;
    const added = elapsedSeconds * this.refillRate;
    if (added > 0) {
      this.tokens = Math.min(this.capacity, this.tokens + added);
      this.lastRefill = now;
    }
  }

  allowRequest() {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  const bucket = new TokenBucket(CAPACITY, REFILL_RATE_PER_SEC);
  const start = process.hrtime.bigint();

  console.log("Burst of 8 requests with no delay (capacity 5):");
  for (let i = 0; i < 8; i++) {
    const allowed = bucket.allowRequest();
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(\`  request \${i + 1} at \${elapsedMs.toFixed(0)} ms: \${allowed ? "allowed" : "REJECTED (rate limited)"}\`);
  }

  console.log("Waiting 1.5s for tokens to refill...");
  await sleep(1500);

  console.log("3 more requests after waiting:");
  for (let i = 0; i < 3; i++) {
    const allowed = bucket.allowRequest();
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(\`  request \${i + 1} at \${elapsedMs.toFixed(0)} ms: \${allowed ? "allowed" : "REJECTED (rate limited)"}\`);
  }
})();`,
    output: `Burst of 8 requests with no delay (capacity 5):
  request 1 at 4 ms: allowed
  request 2 at 4 ms: allowed
  request 3 at 4 ms: allowed
  request 4 at 4 ms: allowed
  request 5 at 4 ms: allowed
  request 6 at 4 ms: REJECTED (rate limited)
  request 7 at 4 ms: REJECTED (rate limited)
  request 8 at 4 ms: REJECTED (rate limited)
Waiting 1.5s for tokens to refill...
3 more requests after waiting:
  request 1 at 1508 ms: allowed
  request 2 at 1508 ms: allowed
  request 3 at 1508 ms: allowed`,
  },
  cpp: {
    code: `#include <iostream>
#include <thread>
#include <chrono>
#include <algorithm>

const double CAPACITY = 5.0;
const double REFILL_RATE_PER_SEC = 2.0;

class TokenBucket {
public:
    TokenBucket(double capacity, double refillRate)
        : capacity(capacity), refillRate(refillRate), tokens(capacity),
          lastRefill(std::chrono::steady_clock::now()) {}

    bool allowRequest() {
        refill();
        if (tokens >= 1.0) {
            tokens -= 1.0;
            return true;
        }
        return false;
    }

private:
    double capacity;
    double refillRate;
    double tokens;
    std::chrono::steady_clock::time_point lastRefill;

    void refill() {
        auto now = std::chrono::steady_clock::now();
        double elapsedSeconds = std::chrono::duration<double>(now - lastRefill).count();
        double added = elapsedSeconds * refillRate;
        if (added > 0) {
            tokens = std::min(capacity, tokens + added);
            lastRefill = now;
        }
    }
};

int main() {
    TokenBucket bucket(CAPACITY, REFILL_RATE_PER_SEC);
    auto start = std::chrono::steady_clock::now();

    std::cout << "Burst of 8 requests with no delay (capacity 5):" << std::endl;
    for (int i = 0; i < 8; i++) {
        bool allowed = bucket.allowRequest();
        double elapsedMs = std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();
        std::cout << "  request " << (i + 1) << " at " << elapsedMs << " ms: "
                   << (allowed ? "allowed" : "REJECTED (rate limited)") << std::endl;
    }

    std::cout << "Waiting 1.5s for tokens to refill..." << std::endl;
    std::this_thread::sleep_for(std::chrono::milliseconds(1500));

    std::cout << "3 more requests after waiting:" << std::endl;
    for (int i = 0; i < 3; i++) {
        bool allowed = bucket.allowRequest();
        double elapsedMs = std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();
        std::cout << "  request " << (i + 1) << " at " << elapsedMs << " ms: "
                   << (allowed ? "allowed" : "REJECTED (rate limited)") << std::endl;
    }
    return 0;
}`,
    output: `Burst of 8 requests with no delay (capacity 5):
  request 1 at 0.048 ms: allowed
  request 2 at 0.0688 ms: allowed
  request 3 at 0.0705 ms: allowed
  request 4 at 0.0716 ms: allowed
  request 5 at 0.0727 ms: allowed
  request 6 at 0.0737 ms: REJECTED (rate limited)
  request 7 at 0.0748 ms: REJECTED (rate limited)
  request 8 at 0.0758 ms: REJECTED (rate limited)
Waiting 1.5s for tokens to refill...
3 more requests after waiting:
  request 1 at 1500.32 ms: allowed
  request 2 at 1500.33 ms: allowed
  request 3 at 1500.33 ms: allowed`,
  },
};

const qaItems = [
  {
    q: 'How does a token bucket rate limiter work?',
    a: "A bucket holds up to a fixed capacity of tokens, refilling continuously at a fixed rate. Each request consumes one token if available; if the bucket is empty, the request is rejected. Burstiness is always bounded by the bucket's capacity.",
  },
  {
    q: 'Why is a fixed window counter exploitable at its boundary?',
    a: 'Because the counter resets abruptly at each tick, a client can send a full quota right before the reset and another full quota right after — nearly double the intended rate in a short window straddling the boundary.',
  },
  {
    q: 'How would you rate-limit per user instead of globally?',
    a: "Give each user their own bucket, keyed by user ID, API key, or IP. A single shared bucket would let one user's traffic exhaust the budget meant for everyone else.",
  },
  {
    q: "Where does a rate limiter's state live in a distributed system?",
    a: "It has to be reachable from every server handling a given client's requests — usually a shared, fast store like Redis, since an in-memory bucket on one server wouldn't know about requests landing on a different server.",
  },
  {
    q: "What's the difference between token bucket and leaky bucket?",
    a: 'Token bucket allows bursts up to its capacity as long as tokens are available. Leaky bucket enforces a strictly constant output rate regardless of how bursty the input is, smoothing traffic rather than just capping it.',
  },
];

export default function HldCapstonesPage() {
  return (
    <>
      <Header />
      <div className="layout">
        <TopicSidebar
          backHref="/pages/hld"
          backLabel="Back to HLD"
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
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'HLD', href: '/pages/hld' }, { label: 'Capstone: Rate Limiter' }]} />
          <h1 id="overview">Capstone: Rate Limiter</h1>
          <p>
            A worked system design example that pulls together time-based state, per-client
            isolation, and the kind of trade-off reasoning the rest of this HLD section builds
            toward.
          </p>

          <section id="plain-english">
            <h2>In Plain English</h2>
            <p>Think of a jar of ride tickets at an amusement park.</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-capstones/ticket-jar-analogy.svg"
                alt="A ticket jar holding 5 tickets that refills at 2 tickets per second; 5 friends ride right away, a 6th is rejected for lacking a ticket, then more ride once new tickets have dripped in"
              />
              <figcaption>The jar is the token bucket; each ride is one request</figcaption>
            </figure>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  The jar holds a limited number of tickets and refills slowly. If you and your
                  friends grab tickets faster than the jar refills, eventually someone has to wait —
                  that&apos;s a request getting rate-limited.
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  Notice there&apos;s no &quot;reset moment&quot; — the jar doesn&apos;t suddenly fill
                  back up to 5 at the top of every minute. It trickles continuously, which is exactly
                  why it can&apos;t be gamed by timing a burst right at a reset boundary.
                </p>
              </Callout>
            </TwoCol>
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>

            <h3>Why this is a good capstone</h3>
            <p>
              A rate limiter sits where load balancing (protecting backends from overload), stateful
              tracking, and time-based algorithms all meet in one small, concrete system — and
              it&apos;s one of the most commonly asked system design questions in its own right.
            </p>

            <h3>The token bucket algorithm</h3>
            <p>
              A bucket holds up to <code>capacity</code> tokens, refilling continuously at{' '}
              <code>refill_rate</code> tokens per second, capped at capacity. Every request tries to
              take one token: available means allowed, empty means rejected.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-capstones/token-bucket.svg"
                alt="A bucket holding 5 tokens that refills continuously; an incoming request is allowed if a token is available, and rejected if the bucket is empty"
              />
              <figcaption>Tokens trickle in continuously; a request just checks whether one is there</figcaption>
            </figure>

            <h3>Why refill continuously instead of resetting per second</h3>
            <p>
              A naive &quot;N requests per second&quot; counter that resets every second allows a
              burst of nearly 2N requests right at the boundary between two seconds. A token bucket
              refills gradually, so burstiness is always bounded by capacity — there&apos;s no reset
              moment to exploit.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-capstones/fixed-window-vs-token-bucket.svg"
                alt="Left: a fixed window counter allowing 10 requests right at the reset boundary between two 5-request windows. Right: a token bucket that never exceeds its 5-token capacity regardless of timing."
              />
              <figcaption>Same intended rate, very different worst-case burst</figcaption>
            </figure>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Token bucket when">
                <ul>
                  <li>You want to allow legitimate short bursts (a user clicking rapidly) without letting the rate creep past a hard cap.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Fixed window when">
                <ul>
                  <li>Simplicity matters more than precision and the abuse risk from boundary bursts is acceptable for the use case.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> understanding specifically why a
              fixed window counter is exploitable at its boundary, and recognizing that a real rate
              limiter needs per-client state reachable from every server handling that client&apos;s
              requests — not just one in-memory bucket per server.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to describe how a token bucket
              refills and rejects requests when empty, in your own words, covers the core of this
              question.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to go one level deeper — where the
              bucket&apos;s state actually lives across multiple servers, and what you&apos;d pick
              (Redis, a local approximation, sticky routing) and why.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Stripe&apos;s API rate limits</strong> — documented per-endpoint limits using a token-bucket-style algorithm to protect the platform from any single integration.</li>
              <li><strong>AWS API Gateway throttling</strong> — configurable burst and steady-state limits per client, modeled directly as a token bucket.</li>
              <li><strong>GitHub API rate limiting</strong> — a fixed quota per hour per token, with response headers telling clients how many requests remain and when the quota resets.</li>
              <li><strong>Nginx&apos;s <code>limit_req</code> module</strong> — request rate limiting at the web server layer using a leaky-bucket variant.</li>
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
              A real token bucket (capacity 5, refill rate 2/sec) hit with a burst of 8 immediate
              requests, then 3 more after a genuine 1.5 second wait. The allowed/rejected split and
              the timing of the recovery are both driven by real wall-clock time, not scripted.
            </p>
            <CodeTerminal
              snippets={snippets}
              note="Java's timing wasn't captured in this sandbox (no JDK available to run it), but the token-bucket math is functionally identical to the other three languages, manually verified for correctness."
            />
          </section>

          <PageNav
            prev={{ label: 'Microservices', href: '/pages/hld/microservices' }}
            next={{ label: 'Case Studies', href: '/pages/case-studies' }}
          />
        </main>
      </div>

      <Footer
        sectionColumn={{
          title: 'HLD',
          links: [
            { label: 'Fundamentals', href: '/pages/hld/fundamentals' },
            { label: 'Load Balancing', href: '/pages/hld/load-balancing' },
            { label: 'Caching', href: '/pages/hld/caching' },
            { label: 'Capstones', href: '/pages/hld/capstones' },
          ],
        }}
      />
    </>
  );
}
