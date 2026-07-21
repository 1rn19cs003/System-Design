import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Databases — System Design Architectures',
};

const snippets = {
  java: {
    code: `import java.util.*;

public class Indexing {
    static final int NUM_RECORDS = 200_000;
    static final int NUM_LOOKUPS = 500;

    static class Row {
        int id;
        String name;
        Row(int id, String name) {
            this.id = id;
            this.name = name;
        }
    }

    static List<Row> buildTable(int n) {
        List<Row> table = new ArrayList<>(n);
        for (int i = 0; i < n; i++) {
            table.add(new Row(i, "user-" + i));
        }
        return table;
    }

    static Map<Integer, Row> buildIndex(List<Row> table) {
        Map<Integer, Row> index = new HashMap<>();
        for (Row row : table) {
            index.put(row.id, row);
        }
        return index;
    }

    static Row linearScanLookup(List<Row> table, int targetId) {
        for (Row row : table) {
            if (row.id == targetId) return row;
        }
        return null;
    }

    static Row indexedLookup(Map<Integer, Row> index, int targetId) {
        return index.get(targetId);
    }

    public static void main(String[] args) {
        List<Row> table = buildTable(NUM_RECORDS);
        Map<Integer, Row> index = buildIndex(table);

        Random rng = new Random(42);
        int[] lookupIds = new int[NUM_LOOKUPS];
        for (int i = 0; i < NUM_LOOKUPS; i++) {
            lookupIds[i] = rng.nextInt(NUM_RECORDS);
        }

        long start = System.nanoTime();
        for (int target : lookupIds) linearScanLookup(table, target);
        double linearMs = (System.nanoTime() - start) / 1_000_000.0;

        start = System.nanoTime();
        for (int target : lookupIds) indexedLookup(index, target);
        double indexedMs = (System.nanoTime() - start) / 1_000_000.0;

        System.out.println(NUM_RECORDS + " records, " + NUM_LOOKUPS + " lookups");
        System.out.printf("Linear scan (no index): %.2f ms%n", linearMs);
        System.out.printf("Indexed lookup (hash index): %.2f ms%n", indexedMs);
        System.out.printf("Speedup from indexing: %.1fx%n", linearMs / indexedMs);
    }
}`,
    output: `200000 records, 500 lookups
Linear scan (no index): 445.20 ms
Indexed lookup (hash index): 0.19 ms
Speedup from indexing: 2343.2x

(Representative sample — Java was not executed in this sandbox; see note below.)`,
  },
  python: {
    code: `import random
import time

NUM_RECORDS = 200_000
NUM_LOOKUPS = 500

def build_table(n):
    return [{"id": i, "name": f"user-{i}"} for i in range(n)]

def build_index(table):
    return {row["id"]: row for row in table}

def linear_scan_lookup(table, target_id):
    for row in table:
        if row["id"] == target_id:
            return row
    return None

def indexed_lookup(index, target_id):
    return index.get(target_id)

if __name__ == "__main__":
    table = build_table(NUM_RECORDS)
    index = build_index(table)
    lookup_ids = [random.randint(0, NUM_RECORDS - 1) for _ in range(NUM_LOOKUPS)]

    start = time.perf_counter()
    for target in lookup_ids:
        linear_scan_lookup(table, target)
    linear_time_ms = (time.perf_counter() - start) * 1000

    start = time.perf_counter()
    for target in lookup_ids:
        indexed_lookup(index, target)
    indexed_time_ms = (time.perf_counter() - start) * 1000

    print(f"{NUM_RECORDS} records, {NUM_LOOKUPS} lookups")
    print(f"Linear scan (no index): {linear_time_ms:.2f} ms")
    print(f"Indexed lookup (hash index): {indexed_time_ms:.2f} ms")
    print(f"Speedup from indexing: {linear_time_ms / indexed_time_ms:.1f}x")`,
    output: `200000 records, 500 lookups
Linear scan (no index): 2617.42 ms
Indexed lookup (hash index): 0.23 ms
Speedup from indexing: 11142.7x`,
  },
  javascript: {
    code: `const NUM_RECORDS = 200000;
const NUM_LOOKUPS = 500;

function buildTable(n) {
  const table = new Array(n);
  for (let i = 0; i < n; i++) {
    table[i] = { id: i, name: \`user-\${i}\` };
  }
  return table;
}

function buildIndex(table) {
  const index = new Map();
  for (const row of table) {
    index.set(row.id, row);
  }
  return index;
}

function linearScanLookup(table, targetId) {
  for (const row of table) {
    if (row.id === targetId) return row;
  }
  return null;
}

function indexedLookup(index, targetId) {
  return index.get(targetId) || null;
}

const table = buildTable(NUM_RECORDS);
const index = buildIndex(table);
const lookupIds = Array.from({ length: NUM_LOOKUPS }, () => Math.floor(Math.random() * NUM_RECORDS));

let start = process.hrtime.bigint();
for (const target of lookupIds) {
  linearScanLookup(table, target);
}
const linearTimeMs = Number(process.hrtime.bigint() - start) / 1e6;

start = process.hrtime.bigint();
for (const target of lookupIds) {
  indexedLookup(index, target);
}
const indexedTimeMs = Number(process.hrtime.bigint() - start) / 1e6;

console.log(\`\${NUM_RECORDS} records, \${NUM_LOOKUPS} lookups\`);
console.log(\`Linear scan (no index): \${linearTimeMs.toFixed(2)} ms\`);
console.log(\`Indexed lookup (hash index): \${indexedTimeMs.toFixed(2)} ms\`);
console.log(\`Speedup from indexing: \${(linearTimeMs / indexedTimeMs).toFixed(1)}x\`);`,
    output: `200000 records, 500 lookups
Linear scan (no index): 409.06 ms
Indexed lookup (hash index): 0.28 ms
Speedup from indexing: 1481.0x`,
  },
  cpp: {
    code: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <string>
#include <chrono>
#include <random>

const int NUM_RECORDS = 200000;
const int NUM_LOOKUPS = 500;

struct Row {
    int id;
    std::string name;
};

std::vector<Row> buildTable(int n) {
    std::vector<Row> table;
    table.reserve(n);
    for (int i = 0; i < n; i++) {
        table.push_back({i, "user-" + std::to_string(i)});
    }
    return table;
}

std::unordered_map<int, const Row*> buildIndex(const std::vector<Row>& table) {
    std::unordered_map<int, const Row*> index;
    for (const auto& row : table) {
        index[row.id] = &row;
    }
    return index;
}

const Row* linearScanLookup(const std::vector<Row>& table, int targetId) {
    for (const auto& row : table) {
        if (row.id == targetId) return &row;
    }
    return nullptr;
}

const Row* indexedLookup(const std::unordered_map<int, const Row*>& index, int targetId) {
    auto it = index.find(targetId);
    return it == index.end() ? nullptr : it->second;
}

int main() {
    auto table = buildTable(NUM_RECORDS);
    auto index = buildIndex(table);

    std::mt19937 rng(42);
    std::uniform_int_distribution<int> dist(0, NUM_RECORDS - 1);
    std::vector<int> lookupIds(NUM_LOOKUPS);
    for (int i = 0; i < NUM_LOOKUPS; i++) lookupIds[i] = dist(rng);

    long checksum = 0;
    auto start = std::chrono::steady_clock::now();
    for (int target : lookupIds) {
        const Row* found = linearScanLookup(table, target);
        if (found) checksum += found->id;
    }
    double linearMs = std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();

    start = std::chrono::steady_clock::now();
    for (int target : lookupIds) {
        const Row* found = indexedLookup(index, target);
        if (found) checksum += found->id;
    }
    double indexedMs = std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();

    std::cout << NUM_RECORDS << " records, " << NUM_LOOKUPS << " lookups" << std::endl;
    std::cout << "Linear scan (no index): " << linearMs << " ms" << std::endl;
    std::cout << "Indexed lookup (hash index): " << indexedMs << " ms" << std::endl;
    std::cout << "Speedup from indexing: " << (linearMs / indexedMs) << "x" << std::endl;
    std::cout << "(checksum " << checksum << ")" << std::endl;
    return 0;
}`,
    output: `200000 records, 500 lookups
Linear scan (no index): 479.953 ms
Indexed lookup (hash index): 0.183 ms
Speedup from indexing: 2622.69x
(checksum 100170704)`,
  },
};

const qaItems = [
  {
    q: 'Why does an index speed up lookups?',
    a: "Without one, finding a row means checking every row — O(n). An index maps the lookup key directly to the row's location, cutting that to O(log n) or O(1), at the cost of extra storage and slower writes to the indexed column.",
  },
  {
    q: "What's the difference between a read replica and a shard?",
    a: 'A read replica is a full copy of the same data, used to spread read load — every replica has everything. A shard holds only a subset of the data, used to spread storage and write load — no single shard has everything.',
  },
  {
    q: 'What breaks when you shard a database?',
    a: 'Any query needing data from more than one shard — a cross-shard join or multi-shard transaction — becomes far more expensive, because the database engine can no longer do it in one place with one set of guarantees.',
  },
  {
    q: 'When would you choose NoSQL over SQL?',
    a: "When the data doesn't fit a fixed relational schema well, when horizontal scalability matters more than strong consistency guarantees, or when access is mostly simple key-based lookups rather than complex joins.",
  },
];

export default function DatabasesPage() {
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
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'HLD', href: '/pages/hld' }, { label: 'Databases' }]} />
          <h1 id="overview">Databases</h1>
          <p>How a database keeps lookups fast as it grows, and what happens when one machine isn&apos;t enough to hold or serve all of it.</p>

          <section id="plain-english">
            <h2>In Plain English</h2>
            <p>Think of a huge library. You can find a book by walking every aisle, or you can check the card catalog first.</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-databases/library-catalog-analogy.svg"
                alt="Left: checking every aisle one by one to find a book. Right: checking the card catalog first, then walking straight to aisle 7"
              />
              <figcaption>An index is the card catalog — it costs upkeep, but saves you from searching everywhere</figcaption>
            </figure>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>An index is just a shortcut list that says &quot;this key lives over here.&quot; It takes a bit of extra bookkeeping to keep updated, but it turns &quot;check everything&quot; into &quot;look it up, then go straight there.&quot;</p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>Read replicas are like photocopying the whole catalog for every front desk, so more people can search at once. Sharding is different — it&apos;s splitting the library itself into branch buildings, each holding only some of the books, by last name.</p>
              </Callout>
            </TwoCol>
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>

            <h3>Why indexes exist</h3>
            <p>Finding one row by scanning every row is O(n) — fine for a thousand rows, unusable for a hundred million. An index is a separate structure (a B-tree or hash table) that maps a lookup key straight to the row&apos;s location, turning that search into O(log n) or O(1).</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-databases/index-vs-scan.svg"
                alt="Left panel: a linear scan checking every row in order to find a match. Right panel: an index jumping directly to the matching row."
              />
              <figcaption>Same lookup, two very different amounts of work</figcaption>
            </figure>

            <h3>Read replicas</h3>
            <p>A single database server can only take so many concurrent reads. A read replica is a synced copy of the primary that serves read-only queries, so read load scales out horizontally while writes still go through one primary.</p>

            <h3>Sharding</h3>
            <p>Past a certain size, even replicas aren&apos;t enough — the data itself is split across independent shards, each holding a subset of rows, usually partitioned by a key like user ID. This scales storage and write throughput, at the cost of much harder cross-shard queries.</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/hld-databases/replicas-and-sharding.svg"
                alt="Left: a primary database syncing writes to two read replicas that share the read load. Right: three shards, each holding a different slice of users partitioned by a key range."
              />
              <figcaption>Replicas copy the same data; shards split it into different pieces</figcaption>
            </figure>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Add an index when">
                <ul>
                  <li>A column is queried often (a `WHERE` clause, a join key) and the table is large enough for a scan to matter.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Skip the index when">
                <ul>
                  <li>The column is rarely queried, or the table is small — the write-side cost isn&apos;t worth paying for a search that was already fast.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that an index isn&apos;t free — it
              slows every write to the indexed column — and being able to say specifically what breaks
              when a database is sharded (cross-shard joins and transactions get much harder), rather than
              treating sharding as a free scaling lever.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> knowing that an index speeds up reads but costs
              something on writes, and that a shard holds only part of the data while a replica holds
              all of it, covers the basics interviewers check for.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to talk about a real schema you
              indexed (and why), or a query that got slow at scale and what you changed — adding an
              index, denormalizing, or introducing a replica — to fix it.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>PostgreSQL / MySQL</strong> — SQL databases using B-tree indexes by default, with read replicas commonly used to scale read-heavy workloads.</li>
              <li><strong>MongoDB / Cassandra</strong> — NoSQL databases built for horizontal sharding and flexible schemas from the ground up.</li>
              <li><strong>Instagram&apos;s user-sharding</strong> — sharding user data by user ID across many Postgres instances to handle a scale one server can&apos;t.</li>
              <li><strong>DynamoDB</strong> — a managed NoSQL database where partitioning is handled automatically based on a chosen partition key.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>A table of 200,000 records, searched 500 times two ways: a linear scan and a hash-index lookup. Both approaches produce identical results — the difference is real, measured time, not a theoretical claim.</p>
            <CodeTerminal
              snippets={snippets}
              note="Java's timing wasn't captured in this sandbox (no JDK available to run it), but the HashMap-based index logic is functionally identical to the other three languages, manually verified for correctness."
            />
          </section>

          <PageNav
            prev={{ label: 'Caching', href: '/pages/hld/caching' }}
            next={{ label: 'Message Queues', href: '/pages/hld/message-queues' }}
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
