'use client';

import Link from 'next/link';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  /** Extra section-specific column shown between "site" and "Design Patterns" (subpage footers only) */
  sectionColumn?: {
    title: string;
    links: FooterLink[];
  };
  /** Use the 6-column homepage layout instead of the 4-column subpage layout */
  wide?: boolean;
  /** Homepage footer shows HLD + LLD columns instead of one generic section column */
  homeColumns?: {
    hld: FooterLink[];
    lld: FooterLink[];
    reference: FooterLink[];
  };
}

const DESIGN_PATTERNS_LINKS: FooterLink[] = [
  { label: 'Singleton', href: '/pages/lld/design-patterns/creational/singleton' },
  { label: 'Adapter', href: '/pages/lld/design-patterns/structural/adapter' },
  { label: 'Observer', href: '/pages/lld/design-patterns/behavioral/observer' },
  { label: 'Strategy', href: '/pages/lld/design-patterns/behavioral/strategy' },
];

export default function Footer({ sectionColumn, wide, homeColumns }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className={`footer-grid${wide ? ' footer-grid-wide' : ''}`}>
        <div className="footer-col">
          <h4>System Design Architectures</h4>
          <p>
            A self-study guide for HLD, LLD, and Design Patterns &mdash; built for focused,
            example-driven interview prep, with working code in Java, Python, JavaScript, and C++
            for every topic.
          </p>
        </div>

        {homeColumns ? (
          <>
            <div className="footer-col">
              <h4>HLD</h4>
              {homeColumns.hld.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="footer-col">
              <h4>LLD</h4>
              {homeColumns.lld.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="footer-col">
              <h4>Design Patterns</h4>
              {DESIGN_PATTERNS_LINKS.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="footer-col">
              <h4>Reference</h4>
              {homeColumns.reference.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
          </>
        ) : (
          <>
            {sectionColumn && (
              <div className="footer-col">
                <h4>{sectionColumn.title}</h4>
                {sectionColumn.links.map((l) => (
                  <Link key={l.href} href={l.href}>
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
            <div className="footer-col">
              <h4>Design Patterns</h4>
              {DESIGN_PATTERNS_LINKS.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="footer-col">
          <h4>Guide</h4>
          <Link href="/#hld-section">Browse HLD</Link>
          <Link href="/#lld-section">Browse LLD</Link>
          <Link href="/#patterns-section">Browse Patterns</Link>
          <a
            href="#"
            className="back-to-top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Back to top &uarr;
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          &copy; 2026 System Design Architectures &mdash; a self-study guide for HLD, LLD &amp;
          Design Patterns.
        </span>
        <span>Made for focused, example-driven interview prep.</span>
      </div>
    </footer>
  );
}
