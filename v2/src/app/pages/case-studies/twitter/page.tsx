import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';

export const metadata = {
  title: 'Design Twitter / X — System Design Architectures',
};

const qaItems = [
  {
    q: 'What breaks if you use pure fan-out-on-write for every account?',
    a: "An account with tens of millions of followers would trigger tens of millions of cache writes for a single tweet, all at once — a massive, unpredictable write spike that can overwhelm the timeline cache tier and delay delivery to everyone, not just that account's followers.",
  },
  {
    q: 'How does the hybrid approach decide who gets fan-out-on-write vs. fan-out-on-read?',
    a: 'A follower-count threshold (e.g., 1 million) tags accounts as "celebrity." Regular accounts\' tweets are pushed into followers\' precomputed timelines immediately. Celebrity accounts\' tweets are stored once and merged into each follower\'s timeline at load time, avoiding a massive write fan-out for the accounts that would otherwise trigger it.',
  },
  {
    q: 'Why store tweet IDs in the timeline cache instead of full tweet content?',
    a: "Storing only IDs keeps each timeline cache entry small (a list of IDs vs. a list of full tweet objects with text and media references), which reduces memory pressure on the cache tier and avoids duplicating the same tweet's content across every follower's cache. Full content is fetched in bulk from a separate tweet store only when a timeline is actually rendered.",
  },
  {
    q: "Why is eventual consistency acceptable here, when it wouldn't be for, say, a bank balance?",
    a: 'A social feed has no correctness requirement that depends on perfect real-time ordering across users — a tweet appearing a few seconds late causes no real harm and is barely noticeable. A bank balance, by contrast, has a real consequence (overdrawing an account) if a stale read is acted on. The acceptable cost of staleness is what should drive the consistency choice, not a blanket rule.',
  },
];

export default function TwitterPage() {
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
              { label: 'Twitter / X' },
            ]}
          />
          <h1 id="overview">Design Twitter / X</h1>
          <p>
            Design a service where users post short text updates (&quot;tweets&quot;), follow other
            users, and see a chronological feed of tweets from everyone they follow. The
            functionality is simple; the hard problem is entirely about scale — specifically, how do
            you build millions of personalized feeds fast, when some accounts have hundreds of
            millions of followers?
          </p>

          <section id="requirements">
            <h2>Requirements</h2>
            <TwoCol>
              <Callout kind="good" title="Functional">
                <ul>
                  <li>Post a tweet (text, optionally media).</li>
                  <li>Follow / unfollow other users.</li>
                  <li>View a home timeline: tweets from everyone you follow, newest first.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="Non-functional">
                <ul>
                  <li>Timeline reads must be fast — this is the most-loaded endpoint in the whole system.</li>
                  <li>Eventual consistency is acceptable — a tweet appearing a few seconds late is fine.</li>
                  <li>Must handle wildly uneven follower counts (most users: hundreds; a few: tens of millions).</li>
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
                  <td>Daily active users</td>
                  <td className="num">150 million</td>
                </tr>
                <tr>
                  <td>Average followers per user</td>
                  <td className="num">~200</td>
                </tr>
                <tr>
                  <td>Tweets posted per day</td>
                  <td className="num">~300 million</td>
                </tr>
                <tr>
                  <td>Write QPS (new tweets)</td>
                  <td className="num">~3,500 / sec</td>
                </tr>
                <tr>
                  <td>Timeline loads per day (5 per DAU)</td>
                  <td className="num">~750 million</td>
                </tr>
                <tr>
                  <td>Read QPS (timeline loads)</td>
                  <td className="num">~8,700 / sec</td>
                </tr>
                <tr>
                  <td>Naive fan-out writes/day (tweets × avg followers)</td>
                  <td className="num">~60 billion</td>
                </tr>
              </tbody>
            </table>
            <p>
              That last row is the whole problem in one number: pre-computing every follower&apos;s
              timeline on every tweet means <strong>60 billion</strong> timeline-cache writes a day on
              average — and for one celebrity tweet alone, tens of millions of writes in seconds.
            </p>
          </section>

          <section id="design">
            <h2>High-Level Design</h2>
            <p>
              The two candidate approaches for building a timeline, and the trade-off between them,
              are the entire crux of this problem:
            </p>
            <figure>
              <img
                className="diagram-img"
                src="/assets/case-studies/twitter-fanout.svg"
                alt="Side by side: fan-out on write pushes a new tweet into every follower's precomputed timeline immediately, versus fan-out on read which stores the tweet once and builds each timeline by pulling from followed accounts at load time"
              />
              <figcaption>Push at write time (fast reads, expensive for celebrities) vs. pull at read time (cheap writes, slower reads)</figcaption>
            </figure>
            <p>
              Production systems use a <strong>hybrid</strong>: fan-out on write for the vast majority
              of users (whose follower counts are small enough that pre-computing their
              followers&apos; timelines is cheap), and fan-out on read for celebrity/high-follower
              accounts (merging their tweets into a timeline at load time instead of pushing to
              millions of caches).
            </p>
          </section>

          <section id="deep-dive">
            <h2>Deep Dive</h2>

            <h3>The hybrid fan-out in detail</h3>
            <p>
              Each user is tagged as &quot;regular&quot; or &quot;celebrity&quot; past a
              follower-count threshold (e.g., 1 million). A regular user&apos;s tweet is pushed into
              every follower&apos;s precomputed timeline cache immediately — cheap, because follower
              counts are small. A celebrity&apos;s tweet is <em>not</em> pushed anywhere; instead,
              it&apos;s stored once, and every follower&apos;s timeline load separately checks
              &quot;does anyone I follow who&apos;s a celebrity have new tweets?&quot; and merges those
              in at read time.
            </p>

            <h3>Storing the timeline cache</h3>
            <p>
              Each user&apos;s precomputed timeline is a bounded list (say, the most recent 800 tweet
              IDs) stored in a fast key-value store (Redis), not a full copy of tweet content — just
              IDs, with the actual tweet text/media fetched from a separate tweet store in bulk when
              the timeline is rendered. This keeps the timeline cache small and cheap to update.
            </p>

            <h3>Why eventual consistency is the right call</h3>
            <p>
              If a tweet takes a few seconds to reach every follower&apos;s timeline, essentially
              nobody notices — feeds aren&apos;t a place where users expect millisecond-precision
              ordering across different people&apos;s screens. This is exactly the trade a
              CAP-theorem-style system should make: favor availability and low latency over strict,
              immediate consistency, because the cost of being briefly stale here is close to zero.
            </p>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Fan-out on write, when">
                <ul>
                  <li>The account has a normal-sized follower count — the write cost stays small.</li>
                  <li>Read latency matters more than write cost (true for almost everyone, almost all the time).</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Falls apart when">
                <ul>
                  <li>An account has millions of followers — one post would mean millions of cache writes.</li>
                  <li>This is exactly why a pure fan-out-on-write design is a known interview trap.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that you spot the celebrity
              problem yourself (rather than needing it pointed out), and that you can articulate the
              hybrid solution, not just describe &quot;fan-out&quot; as if it were one approach.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to explain fan-out-on-write vs.
              fan-out-on-read as a read-cost-vs-write-cost trade-off, with an example of each, is a
              strong answer.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> you should be able to propose the hybrid
              threshold approach unprompted, and discuss how you&apos;d pick the celebrity cutoff.
            </p>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <PageNav
            prev={{ label: 'URL Shortener', href: '/pages/case-studies/url-shortener' }}
            next={{ label: 'Design WhatsApp', href: '/pages/case-studies/whatsapp' }}
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
