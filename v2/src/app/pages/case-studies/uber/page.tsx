import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';

export const metadata = {
  title: 'Design Uber — System Design Architectures',
};

const qaItems = [
  {
    q: 'Why can\'t you just query "drivers within 2km" directly against a table of lat/long coordinates?',
    a: "Raw lat/long values don't have a natural ordering that keeps nearby points close together in an index, so a \"within X km\" query would require scanning a large fraction of all rows and computing distance for each one — far too slow at millions of drivers. A geospatial index (geohash or quadtree) encodes location so that nearby points are also \"nearby\" in the index, turning the search into a fast prefix or range lookup instead of a full scan.",
  },
  {
    q: 'Why is geographic partitioning a natural fit for this system?',
    a: "A rider in one city will only ever be matched with drivers in that same city (or a small surrounding area) — cross-region matches never happen. This means each geographic region's data can live on its own set of servers with no coordination needed between regions, giving close-to-linear scalability as new cities are added, unlike a sharding key that might require cross-shard queries.",
  },
  {
    q: 'Why does the system rank drivers by ETA instead of straight-line distance?',
    a: "The closest driver in a straight line might be on the other side of a river with no direct bridge, or blocked by heavy traffic — straight-line distance doesn't reflect actual travel time. Ranking by estimated time to arrival (using real road networks and current traffic data) gives a much more accurate picture of which driver can genuinely reach the rider fastest.",
  },
  {
    q: "What happens if the top-ranked driver doesn't accept the trip request?",
    a: "The system waits a short timeout (a few seconds) for a response, and if the driver doesn't accept in time (or explicitly declines), the trip offer moves to the next-best candidate from the ranked list. This keeps the rider's wait time bounded without requiring every nearby driver to be asked simultaneously.",
  },
];

export default function UberPage() {
  return (
    <>
      <Header />
      <div className="layout">
        <TopicSidebar
          backHref="/pages/case-studies"
          backLabel="Back to Case Studies"
          toc={[
            { id: 'overview', label: 'Overview' },
            { id: 'requirements', label: 'Requirements' },
            { id: 'estimation', label: 'Capacity Estimation' },
            { id: 'design', label: 'High-Level Design' },
            { id: 'deep-dive', label: 'Deep Dive' },
            { id: 'trade-offs', label: 'Trade-offs' },
            { id: 'interview-questions', label: 'Interview Questions' },
          ]}
        />

        <main className="content narrow">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Case Studies', href: '/pages/case-studies' },
              { label: 'Uber' },
            ]}
          />
          <h1 id="overview">Design Uber</h1>
          <p>
            Design a ride-hailing service: riders request a trip, the system finds a nearby available
            driver, and both parties track the trip in real time. The core hard problem is
            geospatial — continuously tracking millions of moving drivers and being able to answer
            &quot;who&apos;s nearby, right now?&quot; in milliseconds.
          </p>

          <section id="requirements">
            <h2>Requirements</h2>
            <TwoCol>
              <Callout kind="good" title="Functional">
                <ul>
                  <li>Driver apps continuously report GPS location.</li>
                  <li>Rider requests a trip; system matches them to a nearby available driver.</li>
                  <li>Both parties see live location updates during the trip.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="Non-functional">
                <ul>
                  <li>Matching must happen in low hundreds of milliseconds — riders won&apos;t wait long for a match.</li>
                  <li>Location data is high-volume and constantly changing — freshness matters more than perfect history.</li>
                  <li>Must work correctly at city scale and be geographically partitionable (matching in Delhi never needs data from Tokyo).</li>
                </ul>
              </Callout>
            </TwoCol>
          </section>

          <section id="estimation">
            <h2>Capacity Estimation</h2>
            <table className="estimate-table">
              <tbody>
                <tr>
                  <th>Assumption</th>
                  <th>Value</th>
                </tr>
                <tr>
                  <td>Drivers online at peak</td>
                  <td className="num">~1 million</td>
                </tr>
                <tr>
                  <td>Location ping frequency</td>
                  <td className="num">every ~4 seconds</td>
                </tr>
                <tr>
                  <td>Location update QPS</td>
                  <td className="num">~250,000 / sec</td>
                </tr>
                <tr>
                  <td>Ride requests per day</td>
                  <td className="num">~5 million</td>
                </tr>
                <tr>
                  <td>Match request QPS (average)</td>
                  <td className="num">~58 / sec</td>
                </tr>
                <tr>
                  <td>Location record size</td>
                  <td className="num">~50 bytes</td>
                </tr>
              </tbody>
            </table>
            <p>
              The ratio here is the whole story:{' '}
              <strong>location writes (~250K/sec) vastly outnumber match reads (~58/sec)</strong>. The
              system has to be built primarily to absorb an enormous, continuous write firehose, with
              matching as a comparatively rare (but latency-critical) read against that data.
            </p>
          </section>

          <section id="design">
            <h2>High-Level Design</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/case-studies/uber-architecture.svg"
                alt="Driver apps continuously write location updates into a location service that maintains a geospatial index, which a matching service queries when a rider requests a trip to find and rank nearby available drivers"
              />
              <figcaption>Constant location writes on one side, occasional but latency-critical match reads on the other</figcaption>
            </figure>
            <p>
              A driver&apos;s location update is written into a geospatial index, geographically
              partitioned so a city (or region) is handled by servers responsible for that area. A
              rider&apos;s request queries that same index for drivers in nearby cells, ranks
              candidates by estimated time to reach the rider, and offers the trip to the best match.
            </p>
          </section>

          <section id="deep-dive">
            <h2>Deep Dive</h2>

            <h3>Geospatial indexing: geohash and quadtrees</h3>
            <p>
              A naive &quot;find drivers within X km&quot; query against raw lat/long coordinates
              requires scanning huge numbers of rows. Geohashing solves this by encoding a lat/long
              pair into a string where nearby locations share string prefixes — so &quot;find drivers
              near me&quot; becomes &quot;find drivers whose geohash starts with this prefix,&quot; a
              fast, indexable lookup. A quadtree (recursively dividing the map into quadrants until
              each contains a small number of points) achieves something similar and adapts better to
              uneven driver density (dense in city centers, sparse in suburbs).
            </p>

            <h3>Why location data is partitioned geographically</h3>
            <p>
              A ride in Mumbai will never be matched with a driver in São Paulo, so there&apos;s no
              reason for those two cities&apos; location data to live on the same servers or even be
              queried together. Partitioning the geospatial index by region (rather than, say, by
              driver ID) means each partition only has to handle the write and query load of its own
              city — a natural, load-proportional sharding key.
            </p>

            <h3>Matching and ranking</h3>
            <p>
              Once nearby available drivers are found via the geospatial index, they&apos;re ranked —
              not just by straight-line distance, but by estimated time to reach the rider (accounting
              for road networks and traffic), and the top candidate is offered the trip. If that
              driver doesn&apos;t accept within a short timeout, the system offers it to the
              next-best candidate.
            </p>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Geohash">
                <ul>
                  <li>Simple to implement, works well with standard key-value/database indexes.</li>
                  <li>Grid cells are fixed-size, so density varies a lot between cells (city center vs. suburbs).</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Quadtree">
                <ul>
                  <li>Adapts cell size to actual driver density — more uniform load per cell.</li>
                  <li>More complex to implement and to keep balanced as drivers move.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that you recognize this as
              fundamentally a geospatial indexing problem before jumping to generic &quot;add a
              database&quot; solutions, and that you can explain why geographic partitioning is the
              natural sharding key here.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> explaining what a geohash is and why
              &quot;nearby&quot; queries need a spatial index (not a plain SQL WHERE clause on
              lat/long) is a strong starting answer.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> you should be ready to discuss the
              write-heavy vs. read-light load profile, and how ranking by ETA (not just distance)
              changes the matching logic.
            </p>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <PageNav
            prev={{ label: 'WhatsApp', href: '/pages/case-studies/whatsapp' }}
            next={{ label: 'Design Netflix / YouTube', href: '/pages/case-studies/netflix' }}
          />
        </main>
      </div>

      <Footer
        sectionColumn={{
          title: 'Case Studies',
          links: [
            { label: 'URL Shortener', href: '/pages/case-studies/url-shortener' },
            { label: 'Twitter / X', href: '/pages/case-studies/twitter' },
            { label: 'WhatsApp', href: '/pages/case-studies/whatsapp' },
            { label: 'Netflix / YouTube', href: '/pages/case-studies/netflix' },
          ],
        }}
      />
    </>
  );
}
