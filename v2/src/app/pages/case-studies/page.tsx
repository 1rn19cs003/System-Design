import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';

export const metadata = {
  title: 'Case Studies — System Design Architectures',
};

export default function CaseStudiesHubPage() {
  return (
    <>
      <Header />
      <div className="layout">
        <TopicSidebar
          backHref="/"
          backLabel="Back to guide"
          toc={[
            { id: 'overview', label: 'Overview' },
            { id: 'studies', label: 'The 5 Case Studies' },
          ]}
          jumpLinks={[
            { label: 'URL Shortener', href: '/pages/case-studies/url-shortener' },
            { label: 'Twitter / X', href: '/pages/case-studies/twitter' },
            { label: 'WhatsApp', href: '/pages/case-studies/whatsapp' },
            { label: 'Uber', href: '/pages/case-studies/uber' },
            { label: 'Netflix / YouTube', href: '/pages/case-studies/netflix' },
          ]}
        />

        <main className="content">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Case Studies' }]} />
          <h1 id="overview">Case Studies</h1>
          <p>
            Five system design interview questions asked, almost verbatim, at real companies — each
            solved end to end with requirements gathering, capacity estimation (the back-of-envelope
            math interviewers actually want to see), a high-level architecture, a deep dive into the
            hardest part, and trade-offs. This is where HLD, LLD, and Core Principles come together
            on one problem at a time.
          </p>

          <section id="studies">
            <h2>The 5 Case Studies</h2>

            <figure>
              <img
                className="diagram-img"
                src="/assets/shared/case-studies-track.svg"
                alt="Five case study boxes: URL Shortener, Twitter/X, WhatsApp, Uber, Netflix/YouTube, each tagged with its core system design challenge"
              />
              <figcaption>No required order — pick the one closest to your next interview, or work through all five</figcaption>
            </figure>

            <ul className="syllabus">
              <li>
                <span className="num">1</span>
                <div>
                  <a className="topic-title" href="/pages/case-studies/url-shortener">Design a URL Shortener</a>
                  <p>The &quot;hello world&quot; of system design — but the details (encoding, redirect latency, read-heavy caching) show up everywhere else.</p>
                  <div className="tag-row"><span className="tag">Easy</span><span className="tag">Read-heavy</span><span className="tag">Caching</span></div>
                </div>
              </li>
              <li>
                <span className="num">2</span>
                <div>
                  <a className="topic-title" href="/pages/case-studies/twitter">Design Twitter / X</a>
                  <p>Feed generation at scale — the fan-out-on-write vs. fan-out-on-read trade-off that defines every social feed.</p>
                  <div className="tag-row"><span className="tag">Medium</span><span className="tag">Fan-out</span><span className="tag">Feeds</span></div>
                </div>
              </li>
              <li>
                <span className="num">3</span>
                <div>
                  <a className="topic-title" href="/pages/case-studies/whatsapp">Design WhatsApp</a>
                  <p>Real-time delivery, message ordering, and the &quot;online/offline&quot; problem — persistent connections at massive scale.</p>
                  <div className="tag-row"><span className="tag">Medium</span><span className="tag">Real-time</span><span className="tag">Messaging</span></div>
                </div>
              </li>
              <li>
                <span className="num">4</span>
                <div>
                  <a className="topic-title" href="/pages/case-studies/uber">Design Uber</a>
                  <p>Geospatial indexing and matching riders to nearby drivers in real time, at city-then-global scale.</p>
                  <div className="tag-row"><span className="tag">Hard</span><span className="tag">Geospatial</span><span className="tag">Matching</span></div>
                </div>
              </li>
              <li>
                <span className="num">5</span>
                <div>
                  <a className="topic-title" href="/pages/case-studies/netflix">Design Netflix / YouTube</a>
                  <p>Storing and serving huge video files worldwide — transcoding, chunking, and CDN delivery.</p>
                  <div className="tag-row"><span className="tag">Hard</span><span className="tag">CDN</span><span className="tag">Storage</span></div>
                </div>
              </li>
            </ul>
          </section>

          <PageNav
            prev={{ label: 'HLD Capstone', href: '/pages/hld/capstones' }}
            next={{ label: 'Start: URL Shortener', href: '/pages/case-studies/url-shortener' }}
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
            { label: 'Netflix / YouTube', href: '/pages/case-studies/netflix' },
          ],
        }}
      />
    </>
  );
}
