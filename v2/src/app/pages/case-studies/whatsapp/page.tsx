import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';

export const metadata = {
  title: 'Design WhatsApp — System Design Architectures',
};

const qaItems = [
  {
    q: 'Why store the message durably before attempting delivery, rather than after?',
    a: 'If the message were delivered first and stored afterward, a crash between those two steps could lose the message with no record it ever existed. Storing first means that even if the delivery attempt fails or the server crashes immediately after, the message is safely recorded and can be retried — durability is guaranteed before anything else happens.',
  },
  {
    q: 'How would you guarantee messages in a single conversation arrive in the order they were sent?',
    a: 'Route all messages belonging to the same conversation (or the same sender, depending on design) through the same partition or shard, and attach an incrementing per-conversation sequence number. The receiving client can then detect gaps or out-of-order arrivals using that sequence number and reorder or request retransmission as needed — this is far cheaper than trying to guarantee a single global ordering across the entire system.',
  },
  {
    q: "Why is holding persistent connections harder than it sounds at WhatsApp's scale?",
    a: 'Hundreds of millions of concurrent open sockets consume memory and file descriptors even while completely idle, and connections drop constantly (phones losing signal, switching networks, going to sleep) requiring fast reconnection and re-authentication. This turns connection management itself into a major piece of infrastructure — load balancing which chat server holds which user\'s connection, and routing messages to whichever server currently holds the recipient.',
  },
  {
    q: 'How does a "read receipt" (blue checkmark) actually get from the receiver back to the sender?',
    a: "It's a small message traveling in the opposite direction, through the same store-and-forward pipeline as a normal chat message: the receiver's client sends a \"read\" acknowledgment to its chat server, which is durably stored and forwarded to the sender's chat server, then pushed to the sender's device — exactly the same reliable-delivery machinery, just carrying a status update instead of message content.",
  },
];

export default function WhatsappPage() {
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
              { label: 'WhatsApp' },
            ]}
          />
          <h1 id="overview">Design WhatsApp</h1>
          <p>
            Design a one-on-one and group messaging service: messages must be delivered reliably and
            in order, work whether the receiver is online or offline, and confirm delivery back to
            the sender (the familiar single/double checkmarks). The hard part isn&apos;t sending a
            message — it&apos;s guaranteeing delivery over an inherently unreliable network, at
            billions of messages a day.
          </p>

          <section id="requirements">
            <h2>Requirements</h2>
            <TwoCol>
              <Callout kind="good" title="Functional">
                <ul>
                  <li>Send/receive one-on-one and group messages.</li>
                  <li>Deliver messages to offline users once they reconnect.</li>
                  <li>Show delivery status: sent, delivered, read.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="Non-functional">
                <ul>
                  <li>Low latency for online-to-online delivery (feels &quot;instant&quot;).</li>
                  <li>No message loss, even across server restarts or network blips.</li>
                  <li>Messages from one sender to one receiver arrive in the order they were sent.</li>
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
                  <td className="num">2 billion</td>
                </tr>
                <tr>
                  <td>Messages sent per day</td>
                  <td className="num">~100 billion</td>
                </tr>
                <tr>
                  <td>Average message write QPS</td>
                  <td className="num">~1.16 million / sec</td>
                </tr>
                <tr>
                  <td>Average message size (text)</td>
                  <td className="num">~100 bytes</td>
                </tr>
                <tr>
                  <td>Concurrent open connections (persistent sockets)</td>
                  <td className="num">~500 million+</td>
                </tr>
                <tr>
                  <td>Fraction of receivers offline at send time</td>
                  <td className="num">~5–10%</td>
                </tr>
              </tbody>
            </table>
            <p>
              Two numbers dominate the design here: <strong>~1.16M writes/sec</strong> means the
              message path has to be extremely cheap per message, and{' '}
              <strong>hundreds of millions of concurrent open connections</strong> means this is
              fundamentally a connection-management problem, not just a database problem.
            </p>
          </section>

          <section id="design">
            <h2>High-Level Design</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/case-studies/whatsapp-architecture.svg"
                alt="Sender's phone holds a persistent connection to Chat Server A, which durably stores the message before forwarding to Chat Server B (holding the receiver's connection), which delivers instantly if the receiver is online or queues it with a push notification if offline"
              />
              <figcaption>Every message is durably stored before delivery is attempted — that&apos;s what makes retries and offline delivery possible</figcaption>
            </figure>
            <p>
              Each user&apos;s device holds one long-lived connection (WebSocket or a custom TCP
              protocol) to a chat server. Because there are far more users than any one server can
              hold connections for, users are spread across many chat servers, and a message often
              has to hop from the sender&apos;s server to the receiver&apos;s server before it can be
              delivered.
            </p>
          </section>

          <section id="deep-dive">
            <h2>Deep Dive</h2>

            <h3>Store-and-forward: durability before delivery</h3>
            <p>
              The moment a chat server accepts a message from the sender, it&apos;s written durably
              (to a fast, replicated store) <em>before</em> the server attempts to deliver it — and
              only then does the sender see a single checkmark (&quot;sent&quot;). This ordering is
              what guarantees no message is silently lost if a chat server crashes mid-delivery: on
              recovery, undelivered messages are simply retried from the durable store.
            </p>

            <h3>Delivery status: single, double, and blue checkmarks</h3>
            <p>
              Each status is a separate acknowledgment traveling back to the sender: &quot;sent&quot;
              fires once the message is durably stored server-side; &quot;delivered&quot; fires once
              the receiver&apos;s device acknowledges receipt; &quot;read&quot; fires once the
              receiver&apos;s client reports the message was opened. Each of these is itself a small
              message that has to be reliably delivered back to the sender — the same delivery
              problem, recursively.
            </p>

            <h3>Message ordering per conversation</h3>
            <p>
              Ordering only has to be guaranteed within a single sender→receiver (or group)
              conversation, not globally across the whole system — a much weaker, cheaper requirement.
              This is typically achieved by routing all messages for a given conversation through the
              same partition/shard, so a simple incrementing sequence number per conversation is
              enough to detect and correct out-of-order delivery.
            </p>

            <h3>Handling offline receivers</h3>
            <p>
              If the receiver&apos;s device has no open connection, the message sits in that
              user&apos;s durable mailbox and a push notification (via APNs/FCM) is sent to wake the
              app. When the user&apos;s device reconnects, it fetches everything queued in its mailbox
              since its last sync point, in order.
            </p>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Persistent connections">
                <ul>
                  <li>Enables true low-latency, server-initiated delivery (&quot;push,&quot; not &quot;poll&quot;).</li>
                  <li>Expensive to hold at scale — hundreds of millions of idle sockets need dedicated infrastructure.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Polling instead">
                <ul>
                  <li>Simpler infrastructure, no long-lived connections to manage.</li>
                  <li>Either wastes resources (frequent polling) or adds real latency (infrequent polling) — a bad fit for &quot;instant&quot; messaging.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> that you treat message durability
              as non-negotiable (write before delivery, not after), and that you separate &quot;how do
              online users get instant delivery&quot; from &quot;how do offline users eventually get
              their messages&quot; as two distinct sub-problems.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> describing the store-and-forward flow and why
              persistent connections beat polling for this use case covers the core of this question.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> you should be ready to discuss
              per-conversation ordering/sharding and how delivery-status acknowledgments themselves
              need reliable delivery.
            </p>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <PageNav
            prev={{ label: 'Twitter / X', href: '/pages/case-studies/twitter' }}
            next={{ label: 'Design Uber', href: '/pages/case-studies/uber' }}
          />
        </main>
      </div>

      <Footer
        sectionColumn={{
          title: 'Case Studies',
          links: [
            { label: 'URL Shortener', href: '/pages/case-studies/url-shortener' },
            { label: 'Twitter / X', href: '/pages/case-studies/twitter' },
            { label: 'Uber', href: '/pages/case-studies/uber' },
            { label: 'Netflix / YouTube', href: '/pages/case-studies/netflix' },
          ],
        }}
      />
    </>
  );
}
