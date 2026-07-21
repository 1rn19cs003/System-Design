import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout } from '@/components/Callout';

export const metadata = {
  title: 'Low-Level Design (LLD) — System Design Architectures',
};

export default function LldHubPage() {
  return (
    <>
      <Header />
      <div className="layout">
        <TopicSidebar
          backHref="/"
          backLabel="Back to guide"
          toc={[
            { id: 'overview', label: 'Overview' },
            { id: 'learn', label: "What You'll Learn" },
            { id: 'syllabus', label: 'The 3 Topics' },
          ]}
          jumpLinks={[
            { label: 'OOP Fundamentals', href: '/pages/lld/oop-fundamentals' },
            { label: 'SOLID Principles', href: '/pages/lld/solid-principles' },
            { label: 'Capstone', href: '/pages/lld/capstones' },
            { label: 'Design Patterns →', href: '/pages/lld/design-patterns' },
          ]}
        />

        <main className="content narrow">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'LLD' }]} />
          <h1 id="overview">Low-Level Design (LLD)</h1>
          <p>
            LLD is the &quot;zoomed-in&quot; half of system design: how you actually structure
            classes and objects so a system stays easy to change as requirements grow. This track
            builds the object-oriented vocabulary — OOP, then SOLID — that every design pattern in
            this guide is written in.
          </p>

          <section id="learn">
            <h2>What You&apos;ll Learn</h2>
            <p>
              By the end of this track you&apos;ll be able to design a class hierarchy from a
              plain-English problem (like a parking lot), explain why it&apos;s structured the way
              it is, and recognize when a design is about to become fragile before it actually
              breaks.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/shared/lld-track.svg"
                alt="LLD syllabus flowchart: OOP Fundamentals, then SOLID Principles, then a Parking Lot capstone combining both, with Design Patterns as the next step"
              />
              <figcaption>Two foundations, one capstone that uses both — then design patterns build on top</figcaption>
            </figure>
          </section>

          <section id="syllabus">
            <h2>The 3 Topics</h2>
            <ul className="syllabus">
              <li>
                <span className="num">1</span>
                <div>
                  <a className="topic-title" href="/pages/lld/oop-fundamentals">OOP Fundamentals</a>
                  <p>Encapsulation, abstraction, inheritance, and polymorphism — with a plain-English dashboard analogy before the technical version.</p>
                </div>
              </li>
              <li>
                <span className="num">2</span>
                <div>
                  <a className="topic-title" href="/pages/lld/solid-principles">SOLID Principles</a>
                  <p>Five rules for keeping a class hierarchy easy to extend without rewriting it — including a classic Liskov-violation example.</p>
                </div>
              </li>
              <li>
                <span className="num" style={{ background: 'var(--accent)', color: '#fff' }}>★</span>
                <div>
                  <a className="topic-title" href="/pages/lld/capstones">Capstone: Parking Lot</a>
                  <p>A worked, best-fit assignment design that puts OOP and SOLID to work together on one interview-shaped problem.</p>
                </div>
              </li>
            </ul>

            <Callout kind="good" title="Next step">
              <p>
                Once OOP and SOLID feel solid, move on to{' '}
                <a href="/pages/lld/design-patterns" style={{ color: '#2f8f4e', fontWeight: 600 }}>
                  Design Patterns →
                </a>{' '}
                — 23 named, recurring solutions built directly on the vocabulary from this track.
              </p>
            </Callout>
          </section>

          <PageNav
            prev={{ label: 'Core Principles', href: '/pages/core-principles' }}
            next={{ label: 'Start: OOP Fundamentals', href: '/pages/lld/oop-fundamentals' }}
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
