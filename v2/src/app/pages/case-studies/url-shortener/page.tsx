import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';

export const metadata = {
  title: 'Design a URL Shortener — System Design Architectures',
};

const qaItems = [
  {
    q: 'Why use a counter + base62 encoding instead of hashing the URL?',
    a: "Hashing a URL (e.g., MD5 truncated to 7 characters) can produce collisions — two different long URLs mapping to the same short code — which then requires a collision-detection-and-retry loop. A global counter encoded in base62 guarantees uniqueness by construction: every ID is assigned exactly once, so there's never a collision to detect.",
  },
  {
    q: "How would you scale the ID generator so it isn't a single point of failure or bottleneck?",
    a: 'Pre-allocate blocks of IDs to each app server (e.g., server A gets IDs 1–1000, server B gets 1001–2000) so servers can generate codes locally without contacting a central counter on every request, only when a block runs out. This trades a small amount of ID-space "waste" (unused IDs if a server restarts) for removing the counter as a per-request bottleneck.',
  },
  {
    q: 'Why is this system read-heavy, and how does that shape the design?',
    a: 'Every shortened link gets clicked far more often than it gets created — a 100:1 read:write ratio is a reasonable assumption. This pushes the design toward aggressive caching (an LRU cache absorbs most reads thanks to the power-law popularity of links) and toward optimizing the redirect path for latency, since that\'s the path users actually experience.',
  },
  {
    q: 'How would you support custom aliases (user-chosen short codes) without breaking the uniqueness guarantee?',
    a: 'Custom aliases go through a separate check-and-insert path: attempt an atomic "insert if not exists" against the database keyed on the requested alias. If it already exists, reject the request and ask the user to pick another. This is independent of the counter-based path used for auto-generated codes, since custom aliases aren\'t sequential.',
  },
];

export default function UrlShortenerPage() {
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
              { label: 'URL Shortener' },
            ]}
          />
          <h1 id="overview">Design a URL Shortener</h1>
          <p>
            Design a service like bit.ly or TinyURL: given a long URL, return a short one that
            redirects back to the original. It&apos;s the &quot;hello world&quot; of system design
            interviews — small enough to finish in 45 minutes, but it touches encoding, caching,
            database sharding, and read/write asymmetry, all of which show up again in every harder
            case study on this site.
          </p>

          <section id="requirements">
            <h2>Requirements</h2>
            <TwoCol>
              <Callout kind="good" title="Functional">
                <ul>
                  <li>Given a long URL, generate a unique short URL.</li>
                  <li>Given a short URL, redirect to the original long URL.</li>
                  <li>Optionally: let users pick a custom alias, and expire links after a set time.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="Non-functional">
                <ul>
                  <li>Redirects must be low-latency — this sits on the critical path of someone&apos;s click.</li>
                  <li>Highly available — a shortener that&apos;s down breaks every link that uses it.</li>
                  <li>Read-heavy: far more redirects happen than new links get created.</li>
                </ul>
              </Callout>
            </TwoCol>
          </section>

          <section id="estimation">
            <h2>Capacity Estimation</h2>
            <p>
              This is the step interviewers are actually listening for — not perfect numbers, just
              that you can turn a vague scale (&quot;popular service&quot;) into concrete traffic and
              storage figures.
            </p>
            <table className="estimate-table">
              <tbody>
                <tr>
                  <th>Assumption</th>
                  <th>Value</th>
                </tr>
                <tr>
                  <td>New URLs shortened per month</td>
                  <td className="num">500 million</td>
                </tr>
                <tr>
                  <td>Read : write ratio</td>
                  <td className="num">100 : 1</td>
                </tr>
                <tr>
                  <td>Write QPS (new links)</td>
                  <td className="num">~193 / sec</td>
                </tr>
                <tr>
                  <td>Read QPS (redirects)</td>
                  <td className="num">~19,300 / sec</td>
                </tr>
                <tr>
                  <td>Average record size (long URL + metadata)</td>
                  <td className="num">~500 bytes</td>
                </tr>
                <tr>
                  <td>Storage over 5 years</td>
                  <td className="num">~15 TB</td>
                </tr>
                <tr>
                  <td>Short code length needed (base62)</td>
                  <td className="num">7 characters</td>
                </tr>
              </tbody>
            </table>
            <p>
              The write QPS is trivial for a single well-indexed database. The{' '}
              <strong>read QPS is the real number</strong> — 19K redirects/sec is exactly the kind of
              load that turns &quot;add a cache&quot; from a nice-to-have into a requirement.
            </p>
          </section>

          <section id="design">
            <h2>High-Level Design</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/case-studies/url-shortener-architecture.svg"
                alt="Architecture diagram: client through a load balancer to stateless app servers, which check a Redis cache first on reads and fall back to a sharded database, with an ID generator producing new base62 short codes on writes"
              />
              <figcaption>Reads go cache-first; writes go through an ID generator into a sharded database</figcaption>
            </figure>
            <p>
              A write (<code>POST /shorten</code>) asks the ID generator for a unique code, stores{' '}
              <code>{'{short_code → long_url}'}</code> in the database, and returns the short URL. A
              read (<code>GET /{'{code}'}</code>) checks the cache first; on a hit it issues an HTTP
              302 redirect immediately; on a miss it falls back to the database, redirects, and
              populates the cache for next time.
            </p>
          </section>

          <section id="deep-dive">
            <h2>Deep Dive</h2>

            <h3>Generating unique short codes</h3>
            <p>
              The core trick: maintain a global auto-incrementing counter (via a dedicated counter
              service, or a database sequence), then encode that integer in base62 (<code>a-z</code>,{' '}
              <code>A-Z</code>, <code>0-9</code>) to get a short, unique, URL-safe string. A
              7-character base62 code covers 62<sup>7</sup> ≈ 3.5 trillion values — far more than the
              ~30 billion URLs this system will store over 5 years.
            </p>

            <pre>
              <code>{`def encode(id: int) -> str:
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if id == 0:
        return chars[0]
    short = []
    while id > 0:
        id, rem = divmod(id, 62)
        short.append(chars[rem])
    return "".join(reversed(short))

def decode(short: str) -> int:
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    id = 0
    for ch in short:
        id = id * 62 + chars.index(ch)
    return id

# encode(125) -> "cb"   decode("cb") -> 125`}</code>
            </pre>

            <p>
              The alternative — hashing the long URL (e.g., MD5, take first 7 chars) — seems simpler
              but risks collisions (two different URLs producing the same short code), which the
              counter approach avoids entirely by construction.
            </p>

            <h3>Why redirects should be a 301 or 302, and why it matters</h3>
            <p>
              A 302 (temporary redirect) forces every click to hit the shortener service, which is
              what makes analytics (click counts) possible, at the cost of extra load. A 301
              (permanent redirect) lets browsers cache the redirect and skip the shortener on repeat
              visits — faster for the user, but the service loses visibility into repeat clicks. Most
              production shorteners choose 302 specifically to keep click analytics.
            </p>

            <h3>Why the cache matters more than it looks</h3>
            <p>
              URL access follows a strong power-law distribution — a small fraction of links (viral
              posts, popular campaigns) account for a large fraction of all reads. An LRU cache
              naturally keeps exactly those hot links in memory, so even a cache sized for a small
              fraction of total URLs can absorb the overwhelming majority of read traffic.
            </p>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Counter + base62">
                <ul>
                  <li>Guaranteed no collisions, short codes, simple to reason about.</li>
                  <li>Needs a coordinated counter (single point unless sharded/batched).</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Hash-based codes">
                <ul>
                  <li>No coordination needed — any server can compute a code independently.</li>
                  <li>Collisions are possible and must be detected and retried, adding complexity.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that you estimate before you
              design (traffic numbers should drive whether you even need a cache or sharding), and
              that you can defend the counter-vs-hash choice instead of just picking one.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to sketch the cache-first read
              path and the counter-based write path, with rough traffic numbers, is a strong answer
              on its own.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> you should be ready to discuss counter
              sharding (e.g., pre-allocating ID ranges per server to avoid a single bottleneck) and
              custom-alias handling without breaking uniqueness guarantees.
            </p>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <PageNav
            prev={{ label: 'Case Studies', href: '/pages/case-studies' }}
            next={{ label: 'Design Twitter / X', href: '/pages/case-studies/twitter' }}
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
