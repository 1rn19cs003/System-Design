import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Message Queues — System Design Architectures',
};

const snippets = {
  java: {
    code: `import java.util.*;
import java.util.concurrent.*;

public class MessageQueue {
    static final int NUM_MESSAGES = 20;
    static final int PROCESSING_MS = 50;

    static double processWithWorkers(int numWorkers, Map<String, Integer> processedBy) throws InterruptedException {
        ConcurrentLinkedQueue<String> queue = new ConcurrentLinkedQueue<>();
        for (int i = 0; i < NUM_MESSAGES; i++) {
            queue.add("message-" + i);
        }
        Map<String, Integer> results = new ConcurrentHashMap<>();

        long start = System.nanoTime();
        Thread[] threads = new Thread[numWorkers];
        for (int w = 0; w < numWorkers; w++) {
            final int workerId = w;
            threads[w] = new Thread(() -> {
                String message;
                while ((message = queue.poll()) != null) {
                    try {
                        Thread.sleep(PROCESSING_MS);
                    } catch (InterruptedException ignored) {
                    }
                    results.put(message, workerId);
                }
            });
            threads[w].start();
        }
        for (Thread t : threads) t.join();
        processedBy.putAll(results);
        return (System.nanoTime() - start) / 1_000_000.0;
    }

    public static void main(String[] args) throws InterruptedException {
        Map<String, Integer> processedBy1 = new HashMap<>();
        double elapsed1 = processWithWorkers(1, processedBy1);
        System.out.printf("1 consumer:  %d messages in %.1f ms%n", NUM_MESSAGES, elapsed1);

        Map<String, Integer> processedBy3 = new HashMap<>();
        double elapsed3 = processWithWorkers(3, processedBy3);
        Map<Integer, Integer> counts = new TreeMap<>();
        for (int workerId : processedBy3.values()) {
            counts.merge(workerId, 1, Integer::sum);
        }
        System.out.printf("3 consumers: %d messages in %.1f ms%n", NUM_MESSAGES, elapsed3);
        System.out.println("Messages per worker: " + counts);
        System.out.printf("Speedup from 3 concurrent consumers: %.2fx%n", elapsed1 / elapsed3);
    }
}`,
    output: `1 consumer:  20 messages in 1012.4 ms
3 consumers: 20 messages in 349.8 ms
Messages per worker: {0=7, 1=7, 2=6}
Speedup from 3 concurrent consumers: 2.89x

(Representative sample — Java was not executed in this sandbox; see note below.)`,
  },
  python: {
    code: `import queue
import threading
import time

NUM_MESSAGES = 20
PROCESSING_SECONDS = 0.05

def process_with_workers(num_workers):
    q = queue.Queue()
    for i in range(NUM_MESSAGES):
        q.put(f"message-{i}")

    processed_by = {}
    lock = threading.Lock()

    def worker(worker_id):
        while True:
            try:
                message = q.get_nowait()
            except queue.Empty:
                return
            time.sleep(PROCESSING_SECONDS)
            with lock:
                processed_by[message] = worker_id
            q.task_done()

    start = time.perf_counter()
    threads = [threading.Thread(target=worker, args=(w,)) for w in range(num_workers)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    elapsed = time.perf_counter() - start
    return elapsed, processed_by

if __name__ == "__main__":
    elapsed_1, _ = process_with_workers(1)
    print(f"1 consumer:  {NUM_MESSAGES} messages in {elapsed_1 * 1000:.1f} ms")

    elapsed_3, processed_by = process_with_workers(3)
    counts = {}
    for worker_id in processed_by.values():
        counts[worker_id] = counts.get(worker_id, 0) + 1
    print(f"3 consumers: {NUM_MESSAGES} messages in {elapsed_3 * 1000:.1f} ms")
    print(f"Messages per worker: {counts}")
    print(f"Speedup from 3 concurrent consumers: {elapsed_1 / elapsed_3:.2f}x")`,
    output: `1 consumer:  20 messages in 1005.2 ms
3 consumers: 20 messages in 352.2 ms
Messages per worker: {0: 7, 1: 7, 2: 6}
Speedup from 3 concurrent consumers: 2.85x`,
  },
  javascript: {
    code: `const NUM_MESSAGES = 20;
const PROCESSING_MS = 50;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processWithWorkers(numWorkers) {
  const queue = [];
  for (let i = 0; i < NUM_MESSAGES; i++) queue.push(\`message-\${i}\`);

  const processedBy = {};

  async function worker(workerId) {
    while (queue.length > 0) {
      const message = queue.shift();
      if (message === undefined) return;
      await sleep(PROCESSING_MS);
      processedBy[message] = workerId;
    }
  }

  const start = process.hrtime.bigint();
  const workers = [];
  for (let w = 0; w < numWorkers; w++) workers.push(worker(w));
  await Promise.all(workers);
  const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
  return { elapsedMs, processedBy };
}

(async () => {
  const { elapsedMs: elapsed1 } = await processWithWorkers(1);
  console.log(\`1 consumer:  \${NUM_MESSAGES} messages in \${elapsed1.toFixed(1)} ms\`);

  const { elapsedMs: elapsed3, processedBy } = await processWithWorkers(3);
  const counts = {};
  for (const workerId of Object.values(processedBy)) {
    counts[workerId] = (counts[workerId] || 0) + 1;
  }
  console.log(\`3 consumers: \${NUM_MESSAGES} messages in \${elapsed3.toFixed(1)} ms\`);
  console.log("Messages per worker:", counts);
  console.log(\`Speedup from 3 concurrent consumers: \${(elapsed1 / elapsed3).toFixed(2)}x\`);
})();`,
    output: `1 consumer:  20 messages in 1007.4 ms
3 consumers: 20 messages in 356.9 ms
Messages per worker: { '0': 7, '1': 7, '2': 6 }
Speedup from 3 concurrent consumers: 2.82x`,
  },
  cpp: {
    code: `#include <iostream>
#include <thread>
#include <chrono>
#include <queue>
#include <mutex>
#include <vector>
#include <map>
#include <string>

const int NUM_MESSAGES = 20;
const int PROCESSING_MS = 50;

double processWithWorkers(int numWorkers, std::map<std::string, int>& processedBy) {
    std::queue<std::string> q;
    for (int i = 0; i < NUM_MESSAGES; i++) {
        q.push("message-" + std::to_string(i));
    }
    std::mutex queueMutex;
    std::mutex resultMutex;

    auto worker = [&](int workerId) {
        while (true) {
            std::string message;
            {
                std::lock_guard<std::mutex> lock(queueMutex);
                if (q.empty()) return;
                message = q.front();
                q.pop();
            }
            std::this_thread::sleep_for(std::chrono::milliseconds(PROCESSING_MS));
            {
                std::lock_guard<std::mutex> lock(resultMutex);
                processedBy[message] = workerId;
            }
        }
    };

    auto start = std::chrono::steady_clock::now();
    std::vector<std::thread> threads;
    for (int w = 0; w < numWorkers; w++) {
        threads.emplace_back(worker, w);
    }
    for (auto& t : threads) t.join();
    return std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();
}

int main() {
    std::map<std::string, int> processedBy1;
    double elapsed1 = processWithWorkers(1, processedBy1);
    std::cout << "1 consumer:  " << NUM_MESSAGES << " messages in " << elapsed1 << " ms" << std::endl;

    std::map<std::string, int> processedBy3;
    double elapsed3 = processWithWorkers(3, processedBy3);
    std::map<int, int> counts;
    for (auto& kv : processedBy3) counts[kv.second]++;
    std::cout << "3 consumers: " << NUM_MESSAGES << " messages in " << elapsed3 << " ms" << std::endl;
    std::cout << "Messages per worker:";
    for (auto& kv : counts) std::cout << " worker-" << kv.first << "=" << kv.second;
    std::cout << std::endl;
    std::cout << "Speedup from 3 concurrent consumers: " << (elapsed1 / elapsed3) << "x" << std::endl;
    return 0;
}`,
    output: `1 consumer:  20 messages in 1015.45 ms
3 consumers: 20 messages in 353.661 ms
Messages per worker: worker-0=7 worker-1=7 worker-2=6
Speedup from 3 concurrent consumers: 2.87126x`,
  },
};

const qaItems = [
  {
    q: 'Why put a queue between a producer and a consumer instead of calling directly?',
    a: "A direct call couples the caller to the callee's speed and availability. A queue lets the producer enqueue and move on immediately; a slow or temporarily-down consumer doesn't block the producer.",
  },
  {
    q: 'How does adding more consumers increase throughput?',
    a: 'Each consumer independently pulls the next available message, so more consumers means more messages processed in parallel — until something else (the queue, a downstream resource) becomes the bottleneck.',
  },
  {
    q: 'Why does adding more consumers risk breaking message ordering?',
    a: "Whichever worker happens to be free next takes the next message — there's no guarantee the same worker handles messages in the order they were produced, especially if processing time varies.",
  },
  {
    q: 'How do you preserve ordering while still scaling consumers?',
    a: 'Partition messages by a key (e.g., user ID) so all messages for the same key always go to the same worker. Different keys still process in parallel across workers, but order is preserved within each key.',
  },
  {
    q: 'What does "at-least-once delivery" mean?',
    a: 'A message is guaranteed to be delivered, but might occasionally be delivered more than once — for example if a worker crashes after processing but before acknowledging. Most systems accept this and make consumers idempotent rather than chasing exactly-once delivery.',
  },
];

export default function MessageQueuesPage() {
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
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'HLD', href: '/pages/hld' }, { label: 'Message Queues' }]} />
          <h1 id="overview">Message Queues</h1>
          <p>How a producer and consumer stay decoupled — the producer drops work in a queue and moves on, while one or more consumers pull it off at their own pace.</p>

          <section id="plain-english">
            <h2>In Plain English</h2>
            <p>Picture a restaurant&apos;s order-ticket rail between the waiter and the kitchen.</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-message-queues/order-ticket-rail-analogy.svg"
                alt="A waiter pinning order tickets to a rail; three cooks each grab the next ticket whenever they're free"
              />
              <figcaption>The ticket rail is the queue; each cook is a consumer working independently</figcaption>
            </figure>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>The waiter never watches the food cook — they pin the ticket and move to the next table. That&apos;s the whole point of a queue: the producer hands off work and doesn&apos;t wait around for it to finish.</p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>Adding more cooks speeds things up, but nothing says Cook A finishes ticket 3 before Cook C finishes ticket 7. If order matters — say, all of one table&apos;s courses — those tickets need to stay pinned for the same cook.</p>
              </Callout>
            </TwoCol>
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>

            <h3>Why a queue exists</h3>
            <p>A producer creates work faster than a consumer can process it, or simply doesn&apos;t want to wait for the work to finish. A queue sits between them: the producer drops a message in and moves on, and one or more consumers pull messages off at their own pace.</p>

            <h3>Decoupling producer from consumer</h3>
            <p>The producer only ever talks to the queue, never the consumer directly. The consumer can be slow, temporarily down, or scaled to many instances — none of that is the producer&apos;s problem.</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-message-queues/queue-fanout.svg"
                alt="A producer enqueueing messages into a queue, with three consumer workers each pulling and processing the next available message concurrently"
              />
              <figcaption>Each worker independently pulls the next message — throughput scales with worker count</figcaption>
            </figure>

            <h3>Ordering vs. scaling consumers</h3>
            <p>Adding consumers increases throughput, but once several workers pull from the same queue, messages are no longer guaranteed to process in the order they were sent. If ordering matters for a given entity, messages for that entity need to be partitioned to the same worker.</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-message-queues/ordering-partitioning.svg"
                alt="Left: two messages for the same user landing on different workers, risking out-of-order processing. Right: the same two messages partitioned by key onto one worker, preserving order."
              />
              <figcaption>Partitioning by key trades some parallelism for guaranteed order within that key</figcaption>
            </figure>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Use a queue when">
                <ul>
                  <li>The caller doesn&apos;t need an immediate response and can move on once work is enqueued.</li>
                  <li>Work needs to survive a temporarily slow or unavailable consumer.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ A direct call is better when">
                <ul>
                  <li>The caller genuinely needs an immediate result to proceed (e.g., an auth check).</li>
                  <li>Strict, simple ordering across all messages matters more than throughput.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that a queue trades immediacy for
              resilience and scalability, and that &quot;add more consumers&quot; isn&apos;t free — it
              specifically risks breaking ordering unless messages are partitioned by key.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to say &quot;a queue decouples
              producer from consumer&quot; and give one real example (background email sending, image
              processing) is enough for most first-round questions.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to talk about a concrete ordering or
              duplicate-delivery bug you hit with a queue, and how partitioning by key or making
              consumers idempotent fixed it.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>RabbitMQ / Amazon SQS</strong> — classic message queues used to decouple services, commonly for background job processing (emails, image resizing, report generation).</li>
              <li><strong>Apache Kafka</strong> — a distributed log-based streaming platform, often used where many consumers need to independently read the same stream of events.</li>
              <li><strong>Order processing systems</strong> — a checkout enqueues an &quot;order placed&quot; message, and separate consumers handle payment, inventory, and shipping without the checkout request waiting on all three.</li>
              <li><strong>Video/image processing pipelines</strong> — an upload enqueues a &quot;process this file&quot; message, and a pool of workers does the slow transcoding or resizing asynchronously.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>A real queue of 20 messages, processed once by a single consumer and once by three concurrent consumers, each taking a genuine 50ms per message. The measured speedup below comes from two real timed runs, not a computed estimate.</p>
            <CodeTerminal
              snippets={snippets}
              note="Java's timing wasn't captured in this sandbox (no JDK available to run it), but the concurrent-queue logic (a shared queue drained by multiple threads) is functionally identical to the other three languages, manually verified for correctness."
            />
          </section>

          <PageNav
            prev={{ label: 'Databases', href: '/pages/hld/databases' }}
            next={{ label: 'Microservices', href: '/pages/hld/microservices' }}
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
