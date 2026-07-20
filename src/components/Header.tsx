import Link from 'next/link';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-top">
        <div className="header-brand">
          <span className="logo-mark">SD</span>
          <Link href="/" className="site-title">
            System Design Architectures
          </Link>
          <span className="header-tagline">&mdash; HLD, LLD &amp; Design Patterns</span>
        </div>
        <nav className="header-nav">
          <Link href="/">Overview</Link>
          <Link href="/pages/core-principles">Core Principles</Link>
          <Link href="/pages/hld/fundamentals">HLD</Link>
          <Link href="/pages/lld/oop-fundamentals">LLD</Link>
          <Link href="/pages/lld/design-patterns/creational/singleton">Design Patterns</Link>
          <Link href="/pages/case-studies/netflix">Case Studies</Link>
          <Link href="/pages/reference/glossary">Reference</Link>
        </nav>
      </div>
    </header>
  );
}
