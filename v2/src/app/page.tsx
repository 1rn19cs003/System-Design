import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomeSidebar from '@/components/HomeSidebar';

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="layout">
        <HomeSidebar />

        <main className="content">
          <div className="hero">
            <h2>Welcome</h2>
            <p>
              A self-study guide for system design and object-oriented design — theory, diagrams,
              trade-offs, interview questions, and working code in Java, Python, JavaScript, and
              C++ for every topic. Start with a category below, or use the sidebar to jump straight
              to a topic. Sidebar sections expand and collapse, so you can keep only what you're
              working on in view.
            </p>
          </div>

          <div className="section-heading">Browse by category</div>
          <div className="category-grid">
            <Link className="category-card" id="hld-section" href="/pages/hld">
              <span className="cat-icon">HL</span>
              <h3>High-Level Design (HLD)</h3>
              <p>
                Client-server fundamentals, load balancing, caching, databases, message queues,
                microservices, and a worked capstone — each with an &quot;In Plain English&quot;
                analogy for freshers and deeper trade-off notes for engineers with a few years in.
              </p>
              <span className="cat-meta">7 topics ready →</span>
            </Link>

            <Link className="category-card" id="lld-section" href="/pages/lld">
              <span className="cat-icon">LL</span>
              <h3>Low-Level Design (LLD)</h3>
              <p>
                OOP fundamentals, SOLID principles, and a Parking Lot capstone — the
                object-oriented design skills that sit underneath every design pattern below.
              </p>
              <span className="cat-meta">3 topics ready →</span>
            </Link>

            <Link className="category-card" id="patterns-section" href="/pages/lld/design-patterns">
              <span className="cat-icon">DP</span>
              <h3>Design Patterns</h3>
              <p>
                All 23 classic Gang of Four patterns — creational, structural, and behavioral —
                each with theory, a UML diagram, when to use it, real-world examples, interview
                questions, and working code in four languages.
              </p>
              <span className="cat-meta">23 patterns ready →</span>
            </Link>

            <Link className="category-card" href="/pages/core-principles">
              <span className="cat-icon">CP</span>
              <h3>Core Principles</h3>
              <p>
                Scalability, reliability, consistency models, and a complete map of every topic in
                this guide — start here if you&apos;re not sure where to begin.
              </p>
              <span className="cat-meta">1 topic ready →</span>
            </Link>

            <Link className="category-card" id="case-studies-section" href="/pages/case-studies">
              <span className="cat-icon">CS</span>
              <h3>Case Studies</h3>
              <p>
                Design a URL Shortener, Twitter, WhatsApp, Uber, and Netflix — real, named
                interview questions solved end to end with capacity estimation, architecture, and
                trade-offs.
              </p>
              <span className="cat-meta">5 case studies ready →</span>
            </Link>

            <Link className="category-card" id="reference-section" href="/pages/reference">
              <span className="cat-icon">RF</span>
              <h3>Reference</h3>
              <p>
                A latency-and-capacity numbers cheat sheet for back-of-envelope math, plus an A–Z
                glossary of 60+ system design terms — built for scanning during prep, not reading
                start to finish.
              </p>
              <span className="cat-meta">2 tools ready →</span>
            </Link>
          </div>

          <div className="section-heading">Start here</div>
          <div className="card-grid">
            <div className="card">
              <span className="tag">Start here</span>
              <h3>
                <Link href="/pages/core-principles">Core Principles →</Link>
              </h3>
              <p>
                Scalability, reliability, consistency models, and a full map of every topic in
                this guide, with a suggested learning order.
              </p>
            </div>
            <div className="card">
              <span className="tag">HLD &middot; Start here</span>
              <h3>
                <Link href="/pages/hld/fundamentals">HLD Fundamentals →</Link>
              </h3>
              <p>
                Client-server, DNS, HTTP, latency vs. throughput — plus a plain-English analogy
                for anyone new to the topic.
              </p>
            </div>
            <div className="card">
              <span className="tag">HLD &middot; Capstone</span>
              <h3>
                <Link href="/pages/hld/capstones">Rate Limiter Capstone →</Link>
              </h3>
              <p>
                A worked system design example: token bucket rate limiting, with real timed code
                and trade-off reasoning.
              </p>
            </div>
            <div className="card">
              <span className="tag">Design Patterns &middot; Start here</span>
              <h3>
                <Link href="/pages/lld/design-patterns/creational/singleton">
                  Singleton Pattern →
                </Link>
              </h3>
              <p>
                Theory, UML diagram, when to use it, real-world examples, interview questions, and
                working code in four languages.
              </p>
            </div>
            <div className="card">
              <span className="tag">LLD &middot; Start here</span>
              <h3>
                <Link href="/pages/lld/oop-fundamentals">OOP Fundamentals →</Link>
              </h3>
              <p>
                Encapsulation, abstraction, inheritance, and polymorphism — with a plain-English
                dashboard analogy and a deterministic multi-language code demo.
              </p>
            </div>
          </div>
        </main>
      </div>

      <Footer
        wide
        homeColumns={{
          hld: [
            { label: 'Fundamentals', href: '/pages/hld/fundamentals' },
            { label: 'Load Balancing', href: '/pages/hld/load-balancing' },
            { label: 'Caching', href: '/pages/hld/caching' },
            { label: 'Databases', href: '/pages/hld/databases' },
            { label: 'Capstones', href: '/pages/hld/capstones' },
          ],
          lld: [
            { label: 'OOP Fundamentals', href: '/pages/lld/oop-fundamentals' },
            { label: 'SOLID Principles', href: '/pages/lld/solid-principles' },
            { label: 'Capstones', href: '/pages/lld/capstones' },
          ],
          reference: [
            { label: 'Overview', href: '/pages/reference' },
            { label: 'Latency Numbers', href: '/pages/reference/latency-numbers' },
            { label: 'Glossary', href: '/pages/reference/glossary' },
          ],
        }}
      />
    </>
  );
}
