import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';

export const metadata = {
  title: 'Reference — System Design Architectures',
};

export default function ReferenceHubPage() {
  return (
    <>
      <Header />
      <div className="layout">
        <TopicSidebar
          backHref="/"
          backLabel="Back to guide"
          toc={[
            { id: 'overview', label: 'Overview' },
            { id: 'tools', label: 'The 2 Reference Tools' },
          ]}
          jumpLinks={[
            { label: 'Latency Numbers', href: '/pages/reference/latency-numbers' },
            { label: 'Glossary', href: '/pages/reference/glossary' },
          ]}
        />

        <main className="content">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Reference' }]} />
          <h1 id="overview">Reference</h1>
          <p>
            Two quick-lookup tools for when you already know the theory and just need the number or
            the term, fast — during a mock interview, while sketching a design on a whiteboard, or as
            a last pass the night before the real thing. Not meant to be read start to finish; meant
            to be scanned.
          </p>

          <section id="tools">
            <h2>The 2 Reference Tools</h2>

            <figure>
              <img
                className="diagram-img"
                src="/assets/shared/reference-track.svg"
                alt="Two reference tools: a latency and capacity numbers cheat sheet, and an A-Z glossary of system design terms"
              />
              <figcaption>Use the latency numbers to justify a design choice with math; use the glossary to speak the vocabulary fluently</figcaption>
            </figure>

            <ul className="syllabus">
              <li>
                <span className="num">1</span>
                <div>
                  <a className="topic-title" href="/pages/reference/latency-numbers">Numbers Every Engineer Should Know</a>
                  <p>The latency ladder from L1 cache to a cross-continent network call, plus throughput, capacity, and storage-size rules of thumb for back-of-envelope estimation.</p>
                  <div className="tag-row"><span className="tag">Latency</span><span className="tag">Capacity planning</span><span className="tag">Estimation</span></div>
                </div>
              </li>
              <li>
                <span className="num">2</span>
                <div>
                  <a className="topic-title" href="/pages/reference/glossary">System Design Glossary</a>
                  <p>60+ terms from HLD, LLD, and design patterns defined in one or two sentences each, grouped A to Z, with links back to the full topic pages.</p>
                  <div className="tag-row"><span className="tag">A–Z</span><span className="tag">Definitions</span><span className="tag">Cheat sheet</span></div>
                </div>
              </li>
            </ul>
          </section>

          <PageNav
            prev={{ label: 'Netflix / YouTube', href: '/pages/case-studies/netflix' }}
            next={{ label: 'Start: Latency Numbers', href: '/pages/reference/latency-numbers' }}
          />
        </main>
      </div>

      <Footer
        sectionColumn={{
          title: 'Reference',
          links: [
            { label: 'Latency Numbers', href: '/pages/reference/latency-numbers' },
            { label: 'Glossary', href: '/pages/reference/glossary' },
          ],
        }}
      />
    </>
  );
}
