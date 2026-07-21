import Link from 'next/link';

interface NavTarget {
  label: string;
  href: string;
}

export default function PageNav({ prev, next }: { prev?: NavTarget; next?: NavTarget }) {
  return (
    <nav className="page-nav">
      {prev ? (
        <Link className="nav-link prev" href={prev.href}>
          <span className="nav-label">&larr; Previous</span>
          <span className="nav-title">{prev.label}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className="nav-link next" href={next.href}>
          <span className="nav-label">Next &rarr;</span>
          <span className="nav-title">{next.label}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
