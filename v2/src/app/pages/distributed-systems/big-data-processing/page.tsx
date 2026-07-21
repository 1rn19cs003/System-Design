import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';

export const metadata = {
  title: 'Big Data & Streaming — System Design Architectures',
};

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
          ]}
        />

        <main className="content narrow">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Distributed Systems', href: '/pages/distributed-systems' },
              { label: 'Big Data & Streaming' },
            ]}
          />
          <h1 id="overview">Big Data &amp; Streaming</h1>
          <p>
            Once data outgrows what a single machine can store or process in a reasonable time, you
            need a different set of tools: ways to process huge volumes either on a schedule or
            continuously as it arrives, ways to move data from where it's produced to where it can be
            analyzed, a programming model for spreading a computation across a cluster of machines,
            and a place to actually store all of it. This page covers batch vs. stream processing,
            ETL/ELT pipelines, the MapReduce model, and the difference between a data lake and a data
            warehouse.
          </p>

          <section id="plain-english">
            <h2>In Plain English</h2>
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
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>
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

            <h4>Advantages of Batch Processing</h4>
            <ul>
              <li><strong>High throughput:</strong> Because a batch job works over a large, complete, static chunk of data, it can be heavily optimized for volume rather than per-record latency, processing millions of records efficiently in one pass.</li>
              <li><strong>Simple failure recovery:</strong> If a batch job fails partway through, the fix is almost always to just re-run it over the same input — there's no running state to reconstruct.</li>
              <li><strong>Lower operational complexity:</strong> There's no long-lived process to keep healthy around the clock, no backpressure to manage, and no out-of-order events to reconcile.</li>
              <li><strong>Cost-efficient for large volumes:</strong> Compute can be provisioned only for the scheduled run window instead of running continuously, which is cheaper for workloads that don't need a real-time answer.</li>
            </ul>

            <h4>Disadvantages of Batch Processing</h4>
            <ul>
              <li><strong>High latency:</strong> Results are only as fresh as the last scheduled run — a nightly job means insights are up to 24 hours stale.</li>
              <li><strong>Not suitable for time-sensitive decisions:</strong> Fraud detection, live pricing, and real-time alerting all need a reaction faster than any batch window can offer.</li>
              <li><strong>Wasted work on failure:</strong> If a large batch job fails near the end, the common recovery path is to re-run the entire job from the start, re-doing work that had already completed successfully.</li>
              <li><strong>Resource spikes:</strong> Because all the work is concentrated into a scheduled run, that window can demand a large burst of compute rather than a smooth, spread-out load.</li>
            </ul>

            <h4>Advantages of Stream Processing</h4>
            <ul>
              <li><strong>Low latency:</strong> Each event is handled within milliseconds of arriving, which is what makes real-time dashboards, fraud detection, and alerting possible at all.</li>
              <li><strong>Continuous freshness:</strong> The system's view of the world is always current — there's no waiting for the next scheduled run to see what just happened.</li>
              <li><strong>Smoother resource usage:</strong> Work arrives continuously and is processed continuously, rather than piling up into one large, spiky processing window.</li>
              <li><strong>Enables reactive systems:</strong> Downstream consumers can trigger actions the instant a condition is met, instead of discovering it hours later in a report.</li>
            </ul>

            <h4>Disadvantages of Stream Processing</h4>
            <ul>
              <li><strong>Operational complexity:</strong> A stream processor has to manage running state, handle out-of-order or late events, and decide on exactly-once vs. at-least-once processing semantics.</li>
              <li><strong>Harder failure recovery:</strong> Recovering a stateful, continuously running pipeline after a crash is far more involved than simply re-running a batch job over static input.</li>
              <li><strong>Higher always-on cost:</strong> The processing cluster typically has to run continuously to catch every event as it arrives, rather than only during a scheduled window.</li>
              <li><strong>Harder to reason about correctness:</strong> Debugging "why did this event produce the wrong result" is harder when state, ordering, and timing all interact, compared to re-running a deterministic batch job.</li>
            </ul>

            <p>
              In production, most teams don&apos;t actually pick one or the other — they run both,
              which is what the <strong>Lambda architecture</strong> formalizes. New data is written
              to both a <strong>batch layer</strong>, which periodically recomputes exact, complete
              views over the entire dataset, and a <strong>speed layer</strong>, which processes only
              the data that has arrived since the last batch run and produces approximate real-time
              views immediately. A <strong>serving layer</strong> answers queries by merging both:
              the batch view for everything the batch layer has already caught up to, patched with
              the speed layer&apos;s view of whatever has happened since. This gets you both
              correctness (the batch layer eventually corrects any approximation the speed layer
              made) and low latency (you never wait for the next batch run to see recent data) — at
              the real cost of having to write and maintain the same business logic twice, once for
              each layer, which is why some teams accept a simpler variant (Kappa architecture) that
              runs everything through a single stream-processing layer instead.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-bigdata/lambda-architecture.svg"
                alt="New data feeds both a batch layer that recomputes exact views over all data periodically and a speed layer that processes only recent data in real time, with a serving layer merging both views to answer queries"
              />
              <figcaption>Batch gets you correctness eventually; speed gets you an answer right now — serving merges both</figcaption>
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

            <p>
              A stream processor can&apos;t rely on a one-off shuffle step the way MapReduce does,
              because the input never ends — so it needs a standing unit of parallelism instead. That
              unit is the <strong>partition</strong>. A Kafka-style topic is split into a fixed number
              of partitions at creation time, and each partition is consumed by exactly one instance
              within a given consumer group at a time, which is what lets multiple consumer instances
              process a topic in parallel without stepping on each other&apos;s messages. This is also
              the mechanism&apos;s hard ceiling: a consumer group can scale out to at most as many
              active consumers as there are partitions — a topic with 4 partitions caps out at 4
              usefully-busy consumers, and a 5th instance simply sits idle with nothing assigned. The
              common production mistake is under-provisioning partition count early on and then
              discovering, once traffic grows, that repartitioning an existing topic is disruptive and
              can reorder or duplicate in-flight messages for consumers relying on partition-level
              ordering.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/distributed-systems-bigdata/kafka-partition-scaling.svg"
                alt="A Kafka-style topic with 4 partitions, each owned by exactly one consumer instance in a consumer group; a 5th consumer instance sits idle because there is no partition left to assign it"
              />
              <figcaption>Partitions are the unit of parallelism, not consumers — a 5th consumer with no partition left just idles</figcaption>
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
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <p>
              Batch and stream processing solve the same problem — turning raw data into something
              useful — on fundamentally different clocks. Here&apos;s how they actually compare, and
              when to reach for each.
            </p>

            <h3>Difference Between Batch Processing and Stream Processing</h3>
            <table className="estimate-table">
              <thead>
                <tr>
                  <th>Aspect</th>
                  <th>Batch Processing</th>
                  <th>Stream Processing</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Latency</td>
                  <td>Minutes to hours (bound by schedule)</td>
                  <td>Milliseconds to seconds</td>
                </tr>
                <tr>
                  <td>Data scope per run</td>
                  <td>A large, complete, static chunk</td>
                  <td>One event at a time, unbounded stream</td>
                </tr>
                <tr>
                  <td>Cost model</td>
                  <td>Compute provisioned for scheduled windows only</td>
                  <td>Cluster runs continuously, always-on cost</td>
                </tr>
                <tr>
                  <td>Operational complexity</td>
                  <td>Low — re-run the job on failure</td>
                  <td>High — state, ordering, exactly-once semantics</td>
                </tr>
                <tr>
                  <td>Failure recovery</td>
                  <td>Re-run over the same static input</td>
                  <td>Must checkpoint and resume running state</td>
                </tr>
                <tr>
                  <td>Typical use case</td>
                  <td>Billing runs, daily reports, historical analytics</td>
                  <td>Fraud detection, live dashboards, alerting</td>
                </tr>
                <tr>
                  <td>Real system example</td>
                  <td>Hadoop MapReduce, nightly Spark batch jobs</td>
                  <td>Kafka Streams, Apache Flink</td>
                </tr>
              </tbody>
            </table>

            <h3>Why Choose Stream Processing Over Batch Processing?</h3>
            <ol>
              <li><strong>Immediate reaction to events:</strong> Stream processing reacts the instant an event arrives instead of waiting for the next scheduled run. Analogy: It&apos;s like a smoke detector that goes off the moment it senses smoke, instead of a fire inspector who only checks the building once a night.</li>
              <li><strong>Always-fresh state:</strong> A live dashboard fed by a stream always reflects what&apos;s happening right now. Analogy: It&apos;s like watching a live scoreboard at a stadium instead of reading the final score in tomorrow&apos;s newspaper.</li>
              <li><strong>Prevents costly delays:</strong> Catching a fraudulent transaction before it clears avoids a loss that a next-morning report can only document after the fact. Analogy: It&apos;s like a bouncer stopping trouble at the door, rather than reviewing the security footage the next day.</li>
              <li><strong>Smoother load on infrastructure:</strong> Processing each event as it comes in spreads work evenly instead of piling it into one big nightly spike. Analogy: It&apos;s like a toll booth processing cars continuously as they arrive, instead of letting them all queue up and clearing the line once an hour.</li>
              <li><strong>Enables real-time automation:</strong> Downstream systems can trigger actions immediately, without a human or a scheduled job in the loop. Analogy: It&apos;s like a sprinkler system that activates the second it detects fire, rather than waiting for someone to notice and manually turn it on.</li>
            </ol>

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
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Apache Spark &amp; Apache Flink</strong> — widely used engines for both batch and stream processing, with Flink built stream-first and Spark historically batch-first before adding Structured Streaming.</li>
              <li><strong>Hadoop MapReduce</strong> — the original open-source implementation of the MapReduce model, historically the backbone of large-scale batch processing before Spark became the more common default.</li>
              <li><strong>Apache Airflow</strong> — the standard tool for orchestrating ETL/ELT pipelines as directed acyclic graphs of scheduled tasks.</li>
              <li><strong>Amazon S3 with Redshift or Snowflake</strong> — a common architecture pairing S3 as the raw data lake with Redshift or Snowflake as the structured, query-optimized data warehouse layer built on top of it.</li>
              <li><strong>Kafka Streams</strong> — a library for building real-time stream processing applications directly on top of Kafka topics, without needing a separate processing cluster.</li>
            </ul>
          </section>

          <PageNav
            prev={{ label: 'Authentication Mechanisms', href: '/pages/distributed-systems/authentication-mechanisms' }}
            next={{ label: 'System Architectures', href: '/pages/distributed-systems/architectural-patterns' }}
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
