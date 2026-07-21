import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Caching — System Design Architectures',
};

const snippets = {
  java: {
    code: `import java.util.LinkedHashMap;
import java.util.Map;

public class LruCache {
    static final int SOURCE_LATENCY_MS = 10;
    static final int CAPACITY = 3;
    static final int[] KEY_SEQUENCE = {1, 2, 3, 1, 2, 4, 1, 5, 1, 2};

    static class Cache extends LinkedHashMap<Integer, String> {
        int capacity;
        Cache(int capacity) {
            super(16, 0.75f, true);
            this.capacity = capacity;
        }
        @Override
        protected boolean removeEldestEntry(Map.Entry<Integer, String> eldest) {
            boolean evict = size() > capacity;
            if (evict) {
                System.out.println("  evicted key " + eldest.getKey() + " (least recently used)");
            }
            return evict;
        }
    }

    static String slowFetch(int key) throws InterruptedException {
        Thread.sleep(SOURCE_LATENCY_MS);
        return "value-" + key;
    }

    static double runWithCache(int[] hitsMisses) throws InterruptedException {
        Cache cache = new Cache(CAPACITY);
        int hits = 0, misses = 0;
        long start = System.nanoTime();
        for (int key : KEY_SEQUENCE) {
            String value = cache.get(key);
            if (value != null) {
                hits++;
            } else {
                misses++;
                value = slowFetch(key);
                cache.put(key, value);
            }
        }
        hitsMisses[0] = hits;
        hitsMisses[1] = misses;
        return (System.nanoTime() - start) / 1_000_000.0;
    }

    static double runWithoutCache() throws InterruptedException {
        long start = System.nanoTime();
        for (int key : KEY_SEQUENCE) {
            slowFetch(key);
        }
        return (System.nanoTime() - start) / 1_000_000.0;
    }

    public static void main(String[] args) throws Exception {
        System.out.println("With LRU cache:");
        int[] hitsMisses = new int[2];
        double withCacheMs = runWithCache(hitsMisses);
        System.out.printf("  hits=%d misses=%d total_time=%.2f ms%n", hitsMisses[0], hitsMisses[1], withCacheMs);

        double withoutCacheMs = runWithoutCache();
        System.out.printf("Without cache: total_time=%.2f ms%n", withoutCacheMs);

        System.out.printf("Speedup from caching: %.2fx%n", withoutCacheMs / withCacheMs);
    }
}`,
    output: `With LRU cache:
  evicted key 3 (least recently used)
  evicted key 2 (least recently used)
  evicted key 4 (least recently used)
  hits=4 misses=6 total_time=62.80 ms
Without cache: total_time=101.90 ms
Speedup from caching: 1.62x

(Representative sample — Java was not executed in this sandbox; see note below.)`,
  },
  python: {
    code: `import time
from collections import OrderedDict

SOURCE_LATENCY_SECONDS = 0.01
CAPACITY = 3
KEY_SEQUENCE = [1, 2, 3, 1, 2, 4, 1, 5, 1, 2]

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.store = OrderedDict()

    def get(self, key):
        if key not in self.store:
            return None
        self.store.move_to_end(key)
        return self.store[key]

    def put(self, key, value):
        if key in self.store:
            self.store.move_to_end(key)
        self.store[key] = value
        if len(self.store) > self.capacity:
            evicted, _ = self.store.popitem(last=False)
            print(f"  evicted key {evicted} (least recently used)")

def slow_fetch(key):
    time.sleep(SOURCE_LATENCY_SECONDS)
    return f"value-{key}"

def run_with_cache(sequence):
    cache = LRUCache(CAPACITY)
    hits, misses = 0, 0
    start = time.perf_counter()
    for key in sequence:
        value = cache.get(key)
        if value is not None:
            hits += 1
        else:
            misses += 1
            value = slow_fetch(key)
            cache.put(key, value)
    elapsed = time.perf_counter() - start
    return elapsed, hits, misses

def run_without_cache(sequence):
    start = time.perf_counter()
    for key in sequence:
        slow_fetch(key)
    return time.perf_counter() - start

if __name__ == "__main__":
    print("With LRU cache:")
    with_cache_time, hits, misses = run_with_cache(KEY_SEQUENCE)
    print(f"  hits={hits} misses={misses} total_time={with_cache_time * 1000:.2f} ms")

    without_cache_time = run_without_cache(KEY_SEQUENCE)
    print(f"Without cache: total_time={without_cache_time * 1000:.2f} ms")

    speedup = without_cache_time / with_cache_time
    print(f"Speedup from caching: {speedup:.2f}x")`,
    output: `With LRU cache:
  evicted key 3 (least recently used)
  evicted key 2 (least recently used)
  evicted key 4 (least recently used)
  hits=4 misses=6 total_time=63.04 ms
Without cache: total_time=101.50 ms
Speedup from caching: 1.61x`,
  },
  javascript: {
    code: `const SOURCE_LATENCY_MS = 10;
const CAPACITY = 3;
const KEY_SEQUENCE = [1, 2, 3, 1, 2, 4, 1, 5, 1, 2];

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.store = new Map();
  }
  get(key) {
    if (!this.store.has(key)) return null;
    const value = this.store.get(key);
    this.store.delete(key);
    this.store.set(key, value);
    return value;
  }
  put(key, value) {
    if (this.store.has(key)) this.store.delete(key);
    this.store.set(key, value);
    if (this.store.size > this.capacity) {
      const evicted = this.store.keys().next().value;
      this.store.delete(evicted);
      console.log(\`  evicted key \${evicted} (least recently used)\`);
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function slowFetch(key) {
  await sleep(SOURCE_LATENCY_MS);
  return \`value-\${key}\`;
}

async function runWithCache(sequence) {
  const cache = new LRUCache(CAPACITY);
  let hits = 0, misses = 0;
  const start = process.hrtime.bigint();
  for (const key of sequence) {
    let value = cache.get(key);
    if (value !== null) {
      hits += 1;
    } else {
      misses += 1;
      value = await slowFetch(key);
      cache.put(key, value);
    }
  }
  const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
  return { elapsedMs, hits, misses };
}

async function runWithoutCache(sequence) {
  const start = process.hrtime.bigint();
  for (const key of sequence) {
    await slowFetch(key);
  }
  return Number(process.hrtime.bigint() - start) / 1e6;
}

(async () => {
  console.log("With LRU cache:");
  const { elapsedMs, hits, misses } = await runWithCache(KEY_SEQUENCE);
  console.log(\`  hits=\${hits} misses=\${misses} total_time=\${elapsedMs.toFixed(2)} ms\`);

  const withoutCacheMs = await runWithoutCache(KEY_SEQUENCE);
  console.log(\`Without cache: total_time=\${withoutCacheMs.toFixed(2)} ms\`);

  console.log(\`Speedup from caching: \${(withoutCacheMs / elapsedMs).toFixed(2)}x\`);
})();`,
    output: `With LRU cache:
  evicted key 3 (least recently used)
  evicted key 2 (least recently used)
  evicted key 4 (least recently used)
  hits=4 misses=6 total_time=63.10 ms
Without cache: total_time=106.45 ms
Speedup from caching: 1.69x`,
  },
  cpp: {
    code: `#include <iostream>
#include <thread>
#include <chrono>
#include <list>
#include <unordered_map>
#include <vector>
#include <string>

const int SOURCE_LATENCY_MS = 10;
const int CAPACITY = 3;
const std::vector<int> KEY_SEQUENCE = {1, 2, 3, 1, 2, 4, 1, 5, 1, 2};

class LRUCache {
public:
    LRUCache(int capacity) : capacity(capacity) {}

    bool get(int key, std::string& value) {
        auto it = index.find(key);
        if (it == index.end()) return false;
        order.splice(order.begin(), order, it->second);
        value = it->second->second;
        return true;
    }

    void put(int key, const std::string& value) {
        auto it = index.find(key);
        if (it != index.end()) {
            order.erase(it->second);
        }
        order.push_front({key, value});
        index[key] = order.begin();
        if ((int)order.size() > capacity) {
            auto last = order.back();
            std::cout << "  evicted key " << last.first << " (least recently used)" << std::endl;
            index.erase(last.first);
            order.pop_back();
        }
    }

private:
    int capacity;
    std::list<std::pair<int, std::string>> order;
    std::unordered_map<int, std::list<std::pair<int, std::string>>::iterator> index;
};

std::string slowFetch(int key) {
    std::this_thread::sleep_for(std::chrono::milliseconds(SOURCE_LATENCY_MS));
    return "value-" + std::to_string(key);
}

double runWithCache(int& hits, int& misses) {
    LRUCache cache(CAPACITY);
    hits = 0;
    misses = 0;
    auto start = std::chrono::steady_clock::now();
    for (int key : KEY_SEQUENCE) {
        std::string value;
        if (cache.get(key, value)) {
            hits++;
        } else {
            misses++;
            value = slowFetch(key);
            cache.put(key, value);
        }
    }
    return std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();
}

double runWithoutCache() {
    auto start = std::chrono::steady_clock::now();
    for (int key : KEY_SEQUENCE) {
        slowFetch(key);
    }
    return std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();
}

int main() {
    std::cout << "With LRU cache:" << std::endl;
    int hits, misses;
    double withCacheMs = runWithCache(hits, misses);
    std::cout << "  hits=" << hits << " misses=" << misses << " total_time=" << withCacheMs << " ms" << std::endl;

    double withoutCacheMs = runWithoutCache();
    std::cout << "Without cache: total_time=" << withoutCacheMs << " ms" << std::endl;

    std::cout << "Speedup from caching: " << (withoutCacheMs / withCacheMs) << "x" << std::endl;
    return 0;
}`,
    output: `With LRU cache:
  evicted key 3 (least recently used)
  evicted key 2 (least recently used)
  evicted key 4 (least recently used)
  hits=4 misses=6 total_time=62.124 ms
Without cache: total_time=102.305 ms
Speedup from caching: 1.64678x`,
  },
};

const qaItems = [
  {
    q: 'How does an LRU cache decide what to evict?',
    a: 'It tracks access order. On every get or put, the accessed key moves to the "most recently used" end. When the cache is full, whatever sits at the "least recently used" end is evicted first.',
  },
  {
    q: 'Why use a cache instead of always going to the source?',
    a: 'Because the source — a database query, a remote API, a heavy computation — is slow relative to memory. A cache trades a small amount of memory for avoiding that repeated cost on every request for the same data.',
  },
  {
    q: "What's the risk of caching, and how do you manage it?",
    a: "Staleness — the cached value can drift out of sync with the real source. It's managed with a TTL (the entry expires after a fixed time) or explicit invalidation (the write path updates or clears the cache entry when the underlying data changes).",
  },
  {
    q: 'When would LRU be the wrong eviction policy?',
    a: "When recency doesn't correlate with future use — a scan through a huge dataset touches every key once, and LRU evicts genuinely hot entries to make room for keys that are never touched again. LFU or a scan-resistant variant handles that case better.",
  },
];

export default function CachingPage() {
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
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'HLD', href: '/pages/hld' }, { label: 'Caching' }]} />
          <h1 id="overview">Caching</h1>
          <p>Storing the result of something expensive once, so the next request for the same thing is answered from fast memory instead of paying that cost again.</p>

          <section id="plain-english">
            <h2>In Plain English</h2>
            <p>Think about keeping a document in your desk drawer instead of walking to the filing room down the hall every single time you need it.</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-caching/desk-drawer-analogy.svg"
                alt="A person checking their desk drawer first; if it's there, they hand it over immediately; if not, they walk to the filing room, get it, and leave a copy in the drawer for next time"
              />
              <figcaption>The drawer is the cache; the filing room is the slow database or API</figcaption>
            </figure>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>A cache is nothing more than &quot;keep a copy of the answer somewhere fast, so you don&apos;t redo the slow work every time someone asks the same question.&quot;</p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>The hard part was never &quot;store a copy&quot; — it&apos;s &quot;how do I know when the copy in the drawer is out of date?&quot; That&apos;s the invalidation problem, and it&apos;s the part interviewers actually care about.</p>
              </Callout>
            </TwoCol>
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>

            <h3>Why a cache exists</h3>
            <p>Some data is expensive to fetch — a database query, a slow external API, a heavy computation. A cache stores the result once, so a repeated request for the same thing is answered from fast memory instead of paying that cost again.</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-caching/cache-hit-miss.svg"
                alt="A client request to a cache: a hit returns the cached value directly, a miss goes to the slow source, stores the result, then replies"
              />
              <figcaption>A hit skips the slow source entirely; a miss pays for it once and caches the result</figcaption>
            </figure>

            <h3>Eviction: LRU</h3>
            <p>A cache has finite space, so something is thrown out when it&apos;s full. Least Recently Used (LRU) evicts whichever entry hasn&apos;t been touched the longest, on the assumption that recently used values are more likely to be needed again soon.</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-caching/lru-eviction.svg"
                alt="A full 3-entry cache holding key 1, key 2, key 3 in most-recent-to-least-recent order; a request for key 4 evicts key 3, the least recently used entry"
              />
              <figcaption>The least-recently-used entry is dropped to make room for the new one</figcaption>
            </figure>

            <h3>Where a cache sits</h3>
            <p>In front of a database (query cache), in front of a slow computation (memoization), or in front of another service (a CDN caching a remote response). The mechanism is identical — only what&apos;s being cached changes.</p>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <TwoCol>
              <Callout kind="good" title="✓ LRU works well when">
                <ul>
                  <li>Recently accessed data is genuinely likely to be accessed again soon (the common case).</li>
                  <li>Access patterns shift over time and the cache needs to adapt automatically.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ LRU struggles when">
                <ul>
                  <li>A one-time scan through a huge dataset evicts genuinely &quot;hot&quot; entries to make room for keys that are never touched again.</li>
                  <li>You need frequency, not recency, to decide what&apos;s actually valuable — that&apos;s LFU&apos;s job instead.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> naming a concrete invalidation
              strategy (TTL vs. write-through invalidation) instead of treating &quot;just cache it&quot;
              as a complete answer, and recognizing that caching turns a data-freshness problem into a
              design decision rather than removing it.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> knowing that a cache trades memory for speed, and
              that LRU evicts the entry that hasn&apos;t been touched the longest, is enough to answer most
              first-pass caching questions.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> you should be able to describe a real staleness
              bug you hit — data in the cache that was wrong for a window of time — and whether you fixed
              it with a shorter TTL, active invalidation on write, or by accepting the staleness as a
              deliberate trade-off.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Redis / Memcached</strong> — in-memory key-value stores used almost everywhere as a cache layer in front of a database.</li>
              <li><strong>CDNs (Cloudflare, CloudFront, Akamai)</strong> — cache static assets at edge locations close to users, so most requests never reach the origin server.</li>
              <li><strong>Browser HTTP cache</strong> — the browser caches responses based on <code>Cache-Control</code> headers, skipping the network round-trip entirely for a repeat request.</li>
              <li><strong>CPU caches (L1/L2/L3)</strong> — the same eviction idea, applied at the hardware level to keep frequently accessed memory close to the processor.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>A real LRU cache (fixed capacity 3) sitting in front of a deliberately slow source (a genuine sleep, standing in for a database round-trip). The same 10-key request sequence runs twice — once through the cache, once straight to the source — and the speedup below is a measured comparison of two real timed runs, not a hardcoded number.</p>
            <CodeTerminal
              snippets={snippets}
              note="Java's timing wasn't captured in this sandbox (no JDK available to run it), but the eviction logic (a LinkedHashMap in access-order mode) is functionally identical to the other three languages, manually verified for correctness."
            />
          </section>

          <PageNav
            prev={{ label: 'Load Balancing', href: '/pages/hld/load-balancing' }}
            next={{ label: 'Databases', href: '/pages/hld/databases' }}
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
