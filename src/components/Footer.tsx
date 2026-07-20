import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h4>System Design Architectures</h4>
          <p>
            A self-study guide for HLD, LLD, and Design Patterns &mdash; built for focused,
            example-driven interview prep, with working code in Java, Python, JavaScript, and C++ for every topic.
          </p>
        </div>
        <div className="footer-col">
          <h4>HLD</h4>
          <Link href="/pages/hld/fundamentals">Fundamentals</Link>
          <Link href="/pages/hld/load-balancing">Load Balancing</Link>
          <Link href="/pages/hld/caching">Caching</Link>
          <Link href="/pages/hld/databases">Databases</Link>
          <Link href="/pages/hld/microservices">Microservices</Link>
          <Link href="/pages/hld/message-queues">Message Queues</Link>
          <Link href="/pages/hld/capstones">Capstones</Link>
        </div>
        <div className="footer-col">
          <h4>LLD</h4>
          <Link href="/pages/lld/oop-fundamentals">OOP Fundamentals</Link>
          <Link href="/pages/lld/solid-principles">SOLID Principles</Link>
          <Link href="/pages/lld/capstones">Capstones</Link>
        </div>
        <div className="footer-col">
          <h4>Design Patterns</h4>
          <Link href="/pages/lld/design-patterns/creational/singleton">Singleton</Link>
          <Link href="/pages/lld/design-patterns/structural/adapter">Adapter</Link>
          <Link href="/pages/lld/design-patterns/behavioral/observer">Observer</Link>
          <Link href="/pages/lld/design-patterns/behavioral/strategy">Strategy</Link>
        </div>
        <div className="footer-col">
          <h4>Reference</h4>
          <Link href="/pages/reference/glossary">Glossary</Link>
          <Link href="/pages/reference/latency-numbers">Latency Numbers</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} System Design Architectures &mdash; Self-Study Guide</span>
        <span>Built with Next.js for high performance &amp; fast loading.</span>
      </div>
    </footer>
  );
}
