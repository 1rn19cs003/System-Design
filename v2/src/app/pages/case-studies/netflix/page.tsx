import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';

export const metadata = {
  title: 'Design Netflix / YouTube — System Design Architectures',
};

const qaItems = [
  {
    q: 'Why is video split into small chunks instead of stored as one file per resolution?',
    a: 'Chunking enables adaptive bitrate streaming: the client can switch to a different quality version for the very next chunk if network conditions change, without re-downloading anything already played. It also makes seeking fast (jump straight to the chunk containing that timestamp) and lets a CDN cache and serve individual popular chunks independently rather than entire large files.',
  },
  {
    q: 'Who decides which video quality to stream — the client or the server?',
    a: 'The client decides, chunk by chunk, based on its own real-time measurement of download speed and how full its playback buffer is. The server (or CDN edge) simply serves whichever quality version the client requests — this is what "adaptive bitrate streaming" means, and it keeps the decision close to the actual, fast-changing network conditions the client is experiencing.',
  },
  {
    q: "Why can't this be solved by just building a bigger, more powerful central data center?",
    a: 'Network latency is fundamentally limited by physical distance and the speed of light — no amount of server power fixes the round-trip time for a viewer thousands of kilometers from a single data center. A CDN solves the actual bottleneck by physically distributing copies of content to edge locations near viewers everywhere, so most requests travel a short distance instead of crossing the globe.',
  },
  {
    q: 'How does a CDN edge server decide what content to keep cached locally?',
    a: 'Typically based on popularity and recency, similar to any cache: content that\'s frequently requested in a given region stays cached at edges serving that region (a new blockbuster release, for instance, gets pre-positioned proactively), while rarely-requested content is evicted and, on a cache miss, fetched from origin storage and cached going forward.',
  },
];

export default function NetflixPage() {
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
              { label: 'Netflix / YouTube' },
            ]}
          />
          <h1 id="overview">Design Netflix / YouTube</h1>
          <p>
            Design a service that stores massive video files and streams them smoothly to hundreds
            of millions of viewers worldwide, on connections ranging from fiber to spotty mobile
            data. Unlike the other case studies here, the bottleneck isn&apos;t really compute or a
            database — it&apos;s raw bandwidth, and getting bytes physically close to the viewer.
          </p>

          <section id="requirements">
            <h2>Requirements</h2>
            <TwoCol>
              <Callout kind="good" title="Functional">
                <ul>
                  <li>Upload a video; process it into a form ready for streaming.</li>
                  <li>Stream video to a viewer, adjusting quality to their current network.</li>
                  <li>Resume playback from where a viewer left off.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="Non-functional">
                <ul>
                  <li>Playback must start quickly and not buffer/stutter under normal conditions.</li>
                  <li>Must serve viewers globally with low latency, not just near one data center.</li>
                  <li>Storage and especially egress bandwidth costs must scale sanely with viewership.</li>
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
                  <td>Subscribers / active viewers</td>
                  <td className="num">~250 million</td>
                </tr>
                <tr>
                  <td>Average daily watch time per viewer</td>
                  <td className="num">~2 hours</td>
                </tr>
                <tr>
                  <td>Concurrent streams at peak</td>
                  <td className="num">~20 million</td>
                </tr>
                <tr>
                  <td>Average bitrate per stream (mixed quality)</td>
                  <td className="num">~3 Mbps</td>
                </tr>
                <tr>
                  <td>Peak egress bandwidth</td>
                  <td className="num">~7.5 Tbps</td>
                </tr>
                <tr>
                  <td>New video storage per title (multiple resolutions)</td>
                  <td className="num">tens of GB</td>
                </tr>
              </tbody>
            </table>
            <p>
              That peak bandwidth number — <strong>terabits per second</strong> — is the whole design
              problem. No single data center&apos;s internet connection can serve that; the traffic
              has to be physically distributed to servers near viewers, everywhere in the world,
              simultaneously.
            </p>
          </section>

          <section id="design">
            <h2>High-Level Design</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/case-studies/netflix-architecture.svg"
                alt="An offline upload path transcodes raw video into many bitrates and pushes chunks to CDN edge servers; the real-time playback path serves each chunk from the nearest CDN edge, with the client's adaptive bitrate logic choosing quality per chunk"
              />
              <figcaption>Two separate paths: upload/processing happens once per video; playback happens millions of times per video, from the edge</figcaption>
            </figure>
            <p>
              There are two almost entirely independent pipelines. The <strong>upload path</strong>{' '}
              runs once per video: transcode the raw file into multiple resolutions and bitrates,
              split each into small chunks, and push those chunks out to CDN edge servers positioned
              close to viewers worldwide. The <strong>playback path</strong> runs on every single
              view: the viewer&apos;s client requests chunks from the nearest edge server, adjusting
              requested quality chunk-by-chunk based on current network conditions.
            </p>
          </section>

          <section id="deep-dive">
            <h2>Deep Dive</h2>

            <h3>Transcoding: one upload, many versions</h3>
            <p>
              A single uploaded video is transcoded into a whole matrix of resolution/bitrate
              combinations (e.g., 240p at low bitrate up through 4K at high bitrate) because viewers
              have wildly different screens and network speeds, and the right choice can even change
              mid-playback as someone&apos;s WiFi weakens. Each version is also split into short
              chunks (a few seconds each) rather than stored as one giant file, which is what makes
              adaptive quality switching and seeking possible.
            </p>

            <h3>Adaptive bitrate streaming</h3>
            <p>
              The client — not the server — decides which quality version to request for each
              upcoming chunk, based on its own measurement of recent download speed and buffer
              health. This pushes the hard, fast-changing decision (what quality can this specific
              connection sustain, right now) to the edge, where the freshest information about the
              actual network conditions lives.
            </p>

            <h3>Why a CDN, and not just &quot;a bigger data center&quot;</h3>
            <p>
              Physics, not just cost, is the real constraint: data takes real time to travel long
              distances, and no amount of server capacity in one location fixes that for a viewer on
              the other side of the planet. A CDN solves this by replicating popular content across
              edge servers physically close to viewers everywhere, so the vast majority of playback
              requests are served from a nearby edge and never have to reach the origin storage at
              all.
            </p>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Pre-transcode everything">
                <ul>
                  <li>Playback is instant — no processing delay when a viewer hits play.</li>
                  <li>Storage cost multiplies by the number of resolution/bitrate versions kept.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Transcode on demand">
                <ul>
                  <li>Saves storage — only generate versions actually requested.</li>
                  <li>Adds real latency before playback can start; a much worse fit for a &quot;click and watch&quot; experience.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that you correctly identify
              bandwidth/CDN distribution — not database scaling — as the central challenge here, and
              that you understand adaptive bitrate streaming as a client-driven decision, not a
              server push.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> explaining why video is chunked and stored at
              multiple bitrates, and what a CDN is for, covers the essentials.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> you should be able to discuss the
              storage-vs-latency trade-off of pre-transcoding, and how popularity-based caching
              decides what content an edge server actually keeps.
            </p>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <PageNav
            prev={{ label: 'Uber', href: '/pages/case-studies/uber' }}
            next={{ label: 'Reference', href: '/pages/reference' }}
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
            { label: 'Uber', href: '/pages/case-studies/uber' },
          ],
        }}
      />
    </>
  );
}
