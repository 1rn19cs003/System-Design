import Link from 'next/link';
import { SECTION_COLORS } from '@/lib/nav-groups';

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
          <Link href="/#hld-section" style={{ ['--nav-color' as string]: SECTION_COLORS.hld.color, ['--nav-color-soft' as string]: SECTION_COLORS.hld.soft }}>
            HLD
          </Link>
          <Link href="/#lld-section" style={{ ['--nav-color' as string]: SECTION_COLORS.lld.color, ['--nav-color-soft' as string]: SECTION_COLORS.lld.soft }}>
            LLD
          </Link>
          <Link href="/#patterns-section" style={{ ['--nav-color' as string]: SECTION_COLORS.patterns.color, ['--nav-color-soft' as string]: SECTION_COLORS.patterns.soft }}>
            Design Patterns
          </Link>
          <Link
            href="/pages/distributed-systems"
            style={{ ['--nav-color' as string]: SECTION_COLORS.distributedSystems.color, ['--nav-color-soft' as string]: SECTION_COLORS.distributedSystems.soft }}
          >
            Distributed Systems
          </Link>
          <Link href="/pages/case-studies" style={{ ['--nav-color' as string]: SECTION_COLORS.caseStudies.color, ['--nav-color-soft' as string]: SECTION_COLORS.caseStudies.soft }}>
            Case Studies
          </Link>
          <Link href="/pages/reference" style={{ ['--nav-color' as string]: SECTION_COLORS.reference.color, ['--nav-color-soft' as string]: SECTION_COLORS.reference.soft }}>
            Reference
          </Link>
        </nav>
      </div>
    </header>
  );
}
