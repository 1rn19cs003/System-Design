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
  title: 'Big Data Processing — System Design Architectures',
};

const OUTPUT = `Mapped: [(the,1), (quick,1), (fox,1), (the,1), (lazy,1), (dog,1), (the,1), (fox,1), (ran,1)]
Word frequencies (sorted alphabetically):
dog: 1
fox: 2
lazy: 1
quick: 1
ran: 1
the: 3`;

const snippets = {
  java: {
    code: `import java.util.*;

public class MapReduceWordCount {
    public static void main(String[] args) {
        String[] texts = { "the quick fox", "the lazy dog", "the fox ran" };

        // Map: split each text into (word, 1) pairs
        StringBuilder mappedStr = new StringBuilder();
        List<String> words = new ArrayList<>();
        for (String text : texts) {
            for (String word : text.split(" ")) {
                words.add(word);
            }
        }
        for (int i = 0; i < words.size(); i++) {
            mappedStr.append("(").append(words.get(i)).append(",1)");
            if (i != words.size() - 1) mappedStr.append(", ");
        }
        System.out.println("Mapped: [" + mappedStr + "]");

        // Reduce: sum counts per word
        Map<String, Integer> freq = new TreeMap<>();
        for (String word : words) {
            freq.merge(word, 1, Integer::sum);
        }

        System.out.println("Word frequencies (sorted alphabetically):");
        for (Map.Entry<String, Integer> e : freq.entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
        }
    }
}`,
    output: OUTPUT,
  },
  python: {
    code: `texts = ["the quick fox", "the lazy dog", "the fox ran"]

# Map: split each text into (word, 1) pairs
words = []
for text in texts:
    words.extend(text.split(" "))

mapped_str = ", ".join(f"({w},1)" for w in words)
print(f"Mapped: [{mapped_str}]")

# Reduce: sum counts per word
freq = {}
for word in words:
    freq[word] = freq.get(word, 0) + 1

print("Word frequencies (sorted alphabetically):")
for word in sorted(freq):
    print(f"{word}: {freq[word]}")`,
    output: OUTPUT,
  },
  javascript: {
    code: `const texts = ["the quick fox", "the lazy dog", "the fox ran"];

// Map: split each text into (word, 1) pairs
const words = [];
for (const text of texts) {
  words.push(...text.split(" "));
}

const mappedStr = words.map((w) => \`(\${w},1)\`).join(", ");
console.log(\`Mapped: [\${mappedStr}]\`);

// Reduce: sum counts per word
const freq = {};
for (const word of words) {
  freq[word] = (freq[word] || 0) + 1;
}

console.log("Word frequencies (sorted alphabetically):");
for (const word of Object.keys(freq).sort()) {
  console.log(\`\${word}: \${freq[word]}\`);
}`,
    output: OUTPUT,
  },
  cpp: {
    code: `#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <map>

int main() {
    std::vector<std::string> texts = { "the quick fox", "the lazy dog", "the fox ran" };

    // Map: split each text into (word, 1) pairs
    std::vector<std::string> words;
    for (auto& text : texts) {
        std::istringstream iss(text);
        std::string word;
        while (iss >> word) words.push_back(word);
    }

    std::string mappedStr;
    for (size_t i = 0; i < words.size(); i++) {
        mappedStr += "(" + words[i] + ",1)";
        if (i + 1 < words.size()) mappedStr += ", ";
    }
    std::cout << "Mapped: [" << mappedStr << "]" << std::endl;

    // Reduce: sum counts per word (std::map keeps keys sorted)
    std::map<std::string, int> freq;
    for (auto& word : words) freq[word]++;

    std::cout << "Word frequencies (sorted alphabetically):" << std::endl;
    for (auto& [word, count] : freq) {
        std::cout << word << ": " << count << std::endl;
    }
    return 0;
}`,
    output: OUTPUT,
  },
};

const qaItems = [
  {
    q: 'How do you decide between batch and stream processing for a given problem?',
    a: "The decision comes down to how quickly you need to react to new data and how much that latency actually matters to the business. Batch processing accumulates data over a window (hourly, nightly) and processes it all at once, which is efficient and simple for anything that only needs to be right by tomorrow morning — billing reports, daily aggregates, historical analytics. Stream processing handles each event as it arrives, which is necessary when a delayed reaction has real cost — fraud detection needs to block a suspicious transaction before it clears, not in tomorrow's report; a live dashboard needs to reflect what's happening now. The trade-off is that stream processing is architecturally more complex (state management, out-of-order events, exactly-once semantics) for a latency guarantee batch simply doesn't need to make.",
  },
  {
    q: "What does MapReduce's shuffle step actually do, and why is it necessary?",
    a: "After the map phase, every mapper has produced key-value pairs scattered across whatever machine happened to run it — one mapper might emit a few (\"the\", 1) pairs, another mapper might emit different (\"the\", 1) pairs from a different chunk of input. The shuffle (and sort) step is the redistribution phase: it takes every emitted pair across the whole cluster and routes all pairs sharing the same key to the same reducer, so that a single reducer sees the complete list of values for a key (e.g. every (\"the\", 1) pair from every mapper) and can correctly aggregate them. Without shuffle, each reducer would only see a partial, machine-local view of each key's values, and the final counts would be wrong.",
  },
  {
    q: 'What is the difference between ETL and ELT, and why did ELT become more common?',
    a: "ETL (Extract, Transform, Load) transforms data into its final, clean shape before loading it into the destination — the transformation happens on a separate processing layer, and only structured, ready-to-query data ever lands in the warehouse. ELT (Extract, Load, Transform) loads the raw data into the destination first and performs the transformation afterward, using the destination's own compute. ELT became more common as cloud data warehouses (Snowflake, BigQuery, Redshift) got cheap, elastic compute — it's now often simpler and faster to dump raw data in immediately and transform it with SQL inside the warehouse than to maintain a separate transformation pipeline, and keeping the raw data around also means you can always re-derive a different transformation later without re-extracting from the source.",
  },
  {
    q: 'How would you choose between a data lake and a data warehouse for a given use case?',
    a: "Choose a data lake when you need to cheaply store large volumes of raw or semi-structured data whose eventual use isn't fully known yet — ML training data, raw event logs, video/image archives — because a lake imposes no schema at write time (schema-on-read) and storage is cheap. Choose a data warehouse when you have well-understood, structured data that business users or dashboards will query repeatedly and need fast, predictable performance for — sales figures, user metrics, financial reports — because a warehouse's schema-on-write and columnar storage are specifically optimized for that kind of repeated analytical query. Many real architectures use both: a lake as the durable raw store, feeding a warehouse via an ETL/ELT pipeline for the curated, query-optimized layer.",
  },
  {
    q: "How does a data warehouse's schema-on-write trade flexibility for query speed?",
    a: "Schema-on-write means every row is validated against a predefined structure — column names, types, constraints — at the moment it's written, so the warehouse always knows exactly what shape of data lives where. That upfront rigidity is precisely what lets the warehouse use structure-dependent optimizations: columnar storage layouts that only read the columns a query actually needs, pre-computed statistics for query planning, and indexes built around known column types. The cost is flexibility — if the source data's shape changes or doesn't fit the schema, it's rejected or requires a schema migration before it can be loaded, whereas a schema-on-read system (a data lake) would have simply accepted the data as-is and dealt with structure only when something eventually queried it.",
  },
];

export default function BigDataProcessingPage() {
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
              { label: 'Big Data Processing' },
            ]}
          />
          <h1 id="overview">Big Data Processing</h1>
          <p>
            Once data outgrows what a single machine can store or process in a reasonable time, you
            need a different set of tools: ways to process huge volumes either on a schedule or
            continuously as it arrives, ways to move data from where it's produced to where it can be
            analyzed, a programming model for spreading a computation across a cluster of machines,
            and a place to actually store all of it. This page covers batch vs. stream processing,
            ETL/ELT pipelines, the MapReduce model, and the difference between a data lake and a data
            warehouse.
          </p>

          <FlowStep id="plain-english" step={1} total={TOTAL_STEPS} title="In Plain English" defaultOpen>
            <p>
              Imagine a warehouse receiving deliveries all day. Batch processing is like closing the
              doors at 6pm and having one team sort and log everything that arrived that day, all at
              once, overnight — thorough but nothing is available until morning. Stream processing is
              like having a person at the loading dock who logs each delivery the instant it arrives —
              slightly more effort per item, but you always know the current state in real time.
              MapReduce is like handing a giant pile of documents to ten people (map: each person
              tallies word counts in their own stack), then having them combine their tally sheets by
              word (shuffle) before a few people do the final addition (reduce). And a data lake is a
              storage unit where you can dump anything in any box, versus a data warehouse, which is
              more like a filing cabinet — everything has to already be labeled and sorted into the
              right drawer before it goes in.
            </p>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  Every concept here answers &quot;how do we handle more data than one machine, or one
                  moment, can handle?&quot; Batch vs. stream answers &quot;when do we process
                  it?&quot;, MapReduce answers &quot;how do we spread the computation across many
                  machines?&quot;, and lake vs. warehouse answers &quot;where and in what shape do we
                  store it?&quot;
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  The interesting complexity in stream processing is handling events that arrive
                  out of order or late (a mobile event queued offline and sent hours later), and
                  deciding on exactly-once vs. at-least-once processing semantics — both of which
                  have real cost trade-offs that batch processing mostly sidesteps by working over a
                  complete, static chunk of data.
                </p>
              </Callout>
            </TwoCol>
            <FlowContinue nextId="theory" label="Theory & Diagrams" />
          </FlowStep>

          <FlowStep id="theory" step={2} total={TOTAL_STEPS} title="Theory & Diagrams">
            <h3>Batch vs. stream processing</h3>
            <p>
              <strong>Batch processing</strong> accumulates data over a window of time and processes
              the entire accumulated chunk at once, typically on a fixed schedule — a nightly job that
              reads a full day's transactions and produces a report by morning. It favors throughput
              and simplicity: you can optimize heavily for processing a large, known, static chunk of
              data efficiently, and failures are easy to reason about (just re-run the job).{' '}
              <strong>Stream processing</strong> processes each record continuously as it arrives,
              typically within milliseconds, which is necessary whenever a delayed reaction has real
              cost — detecting a fraudulent transaction before it clears, updating a live dashboard,
              triggering an alert the moment a threshold is crossed. The cost is added complexity:
              a stream processor has to manage running state, handle events arriving out of order, and
              decide how many times a given event is allowed to be processed if something fails
              mid-stream.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-bigdata/batch-vs-stream.svg"
                alt="A batch job accumulates a full day of data and processes it all at once on a schedule producing a report by morning, while a stream processor consumes events continuously as they arrive and produces results within milliseconds"
              />
              <figcaption>Process it all at once on a schedule, or process each record the moment it shows up</figcaption>
            </figure>

            <h3>ETL pipelines</h3>
            <p>
              An <strong>ETL</strong> pipeline moves data from where it's produced to where it can be
              analyzed in three steps: <strong>Extract</strong> data from one or more source systems
              (a production database, application logs, a third-party API), <strong>Transform</strong>{' '}
              it into a clean, consistent, analysis-ready shape (deduplicating, joining, converting
              types, filtering bad records), then <strong>Load</strong> the result into a destination
              — usually a data warehouse. The modern <strong>ELT</strong> variant reorders the last two
              steps: raw data is loaded into the destination first, and the transformation happens
              afterward using the destination's own compute (typically SQL running inside the
              warehouse). ELT has become more common as cloud warehouses got cheap, elastic compute —
              it's simpler to keep raw data around and transform it flexibly later than to commit to
              one fixed transformation before the data ever lands.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-bigdata/etl-pipeline.svg"
                alt="Multiple source systems feed into an extract step, then a transform step, then a load step into a data warehouse, with an ELT variant showing raw data loaded first and transformed inside the warehouse"
              />
              <figcaption>ETL cleans before it lands; ELT lands raw and transforms afterward, inside the warehouse</figcaption>
            </figure>

            <h3>MapReduce</h3>
            <p>
              MapReduce is a programming model for processing huge datasets in parallel across a
              cluster in two steps. The <strong>map</strong> step applies a function to each input
              record independently and in parallel, transforming or filtering it into key-value pairs
              — for word count, each mapper splits its chunk of text into individual words and emits a
              <code>(word, 1)</code> pair for each. A <strong>shuffle</strong> step then redistributes
              all emitted pairs across the cluster so every pair sharing the same key ends up on the
              same machine. The <strong>reduce</strong> step then aggregates all the values for each
              key — summing the 1s per word to get the total count. The model's power is that map and
              reduce are both embarrassingly parallel: thousands of machines can each work on their
              own slice of data with no coordination needed until the shuffle step.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-bigdata/mapreduce-wordcount.svg"
                alt="Two mappers independently split their input text into (word, 1) pairs, a shuffle-and-sort step groups all pairs by word key across the cluster, and reducers sum the counts for each key to produce the final word frequencies"
              />
              <figcaption>Map splits and transforms in parallel; shuffle regroups by key; reduce aggregates each group</figcaption>
            </figure>

            <h3>Data lakes vs. data warehouses</h3>
            <p>
              A <strong>data lake</strong> stores data in its raw, original format — structured,
              semi-structured, or entirely unstructured (JSON logs, images, sensor streams) — at low
              cost and at any scale, applying structure only when something eventually reads the data
              (<strong>schema-on-read</strong>). A <strong>data warehouse</strong> stores processed,
              structured data organized around a predefined schema that's enforced the moment data is
              written (<strong>schema-on-write</strong>), and is specifically optimized — often via
              columnar storage and precomputed statistics — for fast analytical queries over that
              structured data. Lakes favor flexibility and cheap storage of anything, at the cost of
              needing more work at query time; warehouses favor fast, predictable queries, at the cost
              of requiring data to already be clean and structured before it's usable.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-bigdata/lake-vs-warehouse.svg"
                alt="A data lake stores raw, unstructured data of any format cheaply with structure applied only at query time, while a data warehouse enforces a strict predefined schema on write and is optimized for fast structured analytical queries"
              />
              <figcaption>Structure it when you read it, or structure it when you write it — the trade-off is flexibility versus query speed</figcaption>
            </figure>
            <FlowContinue nextId="trade-offs" label="Trade-offs" />
          </FlowStep>

          <FlowStep id="trade-offs" step={3} total={TOTAL_STEPS} title="Trade-offs">
            <TwoCol>
              <Callout kind="good" title="✓ Reach for stream processing / a data lake when">
                <ul>
                  <li>You need to react within seconds or less (fraud detection, live dashboards, alerting), or you're storing large volumes of raw/semi-structured data whose eventual use isn't fully known yet.</li>
                  <li>You can afford the added operational complexity of managing running state, out-of-order events, and processing-guarantee semantics.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Reach for batch processing / a data warehouse when">
                <ul>
                  <li>Being right by tomorrow morning is genuinely fine (daily reports, billing runs, historical analytics), or the data is well-understood, structured, and queried repeatedly by dashboards/BI tools.</li>
                  <li>You want the operational simplicity of re-running a job over a static, complete chunk of data rather than managing a continuously running pipeline.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that you can justify a batch vs.
              stream choice against actual latency requirements rather than defaulting to
              &quot;stream is more modern,&quot; and that you understand shuffle as the mechanism that
              makes distributed aggregation correct — not just a black-box step between map and
              reduce.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to explain the batch vs. stream
              distinction in your own words, and why a data warehouse requires structured data while
              a data lake doesn&apos;t, covers most of what&apos;s checked here.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to reason about the operational
              cost of a streaming pipeline (state management, exactly-once vs. at-least-once
              processing, backpressure) versus the simplicity of re-running a batch job, and to design
              a lake-plus-warehouse architecture where raw data lands in a lake and a curated,
              query-optimized layer is derived into a warehouse.
            </p>
            <FlowContinue nextId="real-world" label="Real-World Examples" />
          </FlowStep>

          <FlowStep id="real-world" step={4} total={TOTAL_STEPS} title="Real-World Examples">
            <ul>
              <li><strong>Apache Spark &amp; Apache Flink</strong> — widely used engines for both batch and stream processing, with Flink built stream-first and Spark historically batch-first before adding Structured Streaming.</li>
              <li><strong>Hadoop MapReduce</strong> — the original open-source implementation of the MapReduce model, historically the backbone of large-scale batch processing before Spark became the more common default.</li>
              <li><strong>Apache Airflow</strong> — the standard tool for orchestrating ETL/ELT pipelines as directed acyclic graphs of scheduled tasks.</li>
              <li><strong>Amazon S3 with Redshift or Snowflake</strong> — a common architecture pairing S3 as the raw data lake with Redshift or Snowflake as the structured, query-optimized data warehouse layer built on top of it.</li>
              <li><strong>Kafka Streams</strong> — a library for building real-time stream processing applications directly on top of Kafka topics, without needing a separate processing cluster.</li>
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
              A simplified, deterministic MapReduce-style word count over three fixed text strings.
              The map step splits each string into individual words with a count of 1; the reduce
              step sums the counts per word into a final frequency map, printed sorted alphabetically.
              The output is identical across all four languages.
            </p>
            <CodeTerminal snippets={snippets} />
          </FlowStep>

          <PageNav
            prev={{ label: 'API & Communication Patterns', href: '/pages/distributed-systems/api-communication-patterns' }}
            next={{ label: 'Architectural Patterns', href: '/pages/distributed-systems/architectural-patterns' }}
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
