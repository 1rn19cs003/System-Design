import Link from 'next/link';

export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="breadcrumbs">
      <Link href="/">Home</Link>
      {items.map((item, index) => (
        <span key={index}>
          <span className="sep">&rsaquo;</span>
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className="current">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
