import Link from 'next/link';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-top">
        <div className="header-brand">
          <img
            className="logo-mark-img"
            src="/assets/shared/logo-mark.svg"
            alt="System Design Architectures logo"
          />
          <Link href="/" className="site-title">
            System Design Architectures
          </Link>
          <span className="header-tagline">HLD &middot; LLD &middot; Design Patterns</span>
        </div>
        <nav className="header-nav">
          <Link href="/">Home</Link>
          <Link href="/#hld-section">HLD</Link>
          <Link href="/#lld-section">LLD</Link>
          <Link href="/#patterns-section">Design Patterns</Link>
          <Link href="/pages/distributed-systems">Distributed Systems</Link>
          <Link href="/pages/case-studies">Case Studies</Link>
          <Link href="/pages/reference">Reference</Link>
        </nav>
      </div>
    </header>
  );
}
