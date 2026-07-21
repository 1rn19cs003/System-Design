'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export interface TocEntry {
  id: string;
  label: string;
}

interface TopicSidebarProps {
  backHref: string;
  backLabel: string;
  toc: TocEntry[];
  /** Optional extra "jump straight to one" links (used by hub pages) */
  jumpLinks?: { label: string; href: string }[];
}

export default function TopicSidebar({ backHref, backLabel, toc, jumpLinks }: TopicSidebarProps) {
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const sections = toc
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => el !== null);

    const onScroll = () => {
      let currentId = '';
      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 100) currentId = sec.id;
      });
      linksRef.current.forEach((link) => {
        if (!link) return;
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
      });
    };

    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [toc]);

  return (
    <nav className="sidebar">
      <Link className="back" href={backHref}>
        &larr; {backLabel}
      </Link>
      <h3>On this page</h3>
      {toc.map((item, i) => (
        <a
          className="toc"
          href={`#${item.id}`}
          key={item.id}
          ref={(el) => {
            linksRef.current[i] = el;
          }}
        >
          {item.label}
        </a>
      ))}
      {jumpLinks && jumpLinks.length > 0 && (
        <>
          <h3>Jump straight to one</h3>
          {jumpLinks.map((l) => (
            <Link className="toc" href={l.href} key={l.href}>
              {l.label}
            </Link>
          ))}
        </>
      )}
    </nav>
  );
}
