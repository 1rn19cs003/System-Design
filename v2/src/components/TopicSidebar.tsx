'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { GROUPS, findActiveGroupId } from '@/lib/nav-groups';

export interface TocEntry {
  id: string;
  label: string;
}

interface TopicSidebarProps {
  backHref: string;
  backLabel: string;
  toc: TocEntry[];
  /** Kept for backward compatibility with hub pages; the full site accordion below
   *  already surfaces these same links, so this is accepted but no longer rendered. */
  jumpLinks?: { label: string; href: string }[];
}

export default function TopicSidebar({ backHref, backLabel, toc }: TopicSidebarProps) {
  const pathname = usePathname();
  const activeGroupId = findActiveGroupId(pathname);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const initial = new Set(GROUPS.filter((g) => g.defaultOpen).map((g) => g.id));
    if (activeGroupId) initial.add(activeGroupId);
    return initial;
  });
  const [allOpen, setAllOpen] = useState(false);

  // If the route changes client-side, make sure the new page's group is expanded.
  useEffect(() => {
    if (!activeGroupId) return;
    setOpenIds((prev) => (prev.has(activeGroupId) ? prev : new Set(prev).add(activeGroupId)));
  }, [activeGroupId]);

  const toggleAll = () => {
    const next = !allOpen;
    setAllOpen(next);
    setOpenIds(next ? new Set(GROUPS.map((g) => g.id)) : new Set(activeGroupId ? [activeGroupId] : []));
  };

  // Scroll-spy for the current page's "On this page" links.
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

      {toc.length > 0 && (
        <>
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
        </>
      )}

      <h3>Browse all topics</h3>
      <button className="expand-all-btn" type="button" onClick={toggleAll}>
        {allOpen ? 'Collapse all sections' : 'Expand all sections'}
      </button>

      <Link
        className={`top-link${pathname === '/pages/core-principles' ? ' active-page' : ''}`}
        href="/pages/core-principles"
      >
        Core Principles
      </Link>

      {GROUPS.map((group) => (
        <details
          className="group"
          key={group.id}
          open={openIds.has(group.id)}
          onToggle={(e) => {
            const isOpen = (e.target as HTMLDetailsElement).open;
            setOpenIds((prev) => {
              const next = new Set(prev);
              if (isOpen) next.add(group.id);
              else next.delete(group.id);
              return next;
            });
          }}
        >
          <summary className={activeGroupId === group.id ? 'active-group' : ''}>{group.label}</summary>
          <div className="group-body">
            {group.overviewHref && (
              <Link
                className={`toc-link${pathname === group.overviewHref ? ' active-page' : ''}`}
                href={group.overviewHref}
                style={{ fontWeight: 600 }}
              >
                Overview →
              </Link>
            )}
            {group.links.map((l) => (
              <Link
                className={`toc-link${pathname === l.href ? ' active-page' : ''}`}
                href={l.href}
                key={l.href}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </details>
      ))}
    </nav>
  );
}
