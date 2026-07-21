'use client';

import Link from 'next/link';
import { useState } from 'react';
import { GROUPS } from '@/lib/nav-groups';

export default function HomeSidebar() {
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set(GROUPS.filter((g) => g.defaultOpen).map((g) => g.id))
  );
  const [allOpen, setAllOpen] = useState(false);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    const next = !allOpen;
    setAllOpen(next);
    setOpenIds(next ? new Set(GROUPS.map((g) => g.id)) : new Set());
  };

  return (
    <nav className="sidebar">
      <button className="expand-all-btn" type="button" onClick={toggleAll}>
        {allOpen ? 'Collapse all sections' : 'Expand all sections'}
      </button>

      <Link className="top-link" href="/pages/core-principles">
        Core Principles
      </Link>

      {GROUPS.map((group) => (
        <details className="group" key={group.id} open={openIds.has(group.id)} onToggle={(e) => {
          const isOpen = (e.target as HTMLDetailsElement).open;
          setOpenIds((prev) => {
            const next = new Set(prev);
            if (isOpen) next.add(group.id);
            else next.delete(group.id);
            return next;
          });
        }}>
          <summary id={group.id} style={{ ['--nav-color' as string]: group.color, ['--nav-color-soft' as string]: group.colorSoft }}>
            <span className="group-label">
              <span className="group-dot" style={{ background: group.color }} aria-hidden="true" />
              {group.label}
            </span>
          </summary>
          <div className="group-body">
            {group.overviewHref && (
              <Link
                className="toc-link"
                href={group.overviewHref}
                style={{ fontWeight: 600, ['--nav-color' as string]: group.color, ['--nav-color-soft' as string]: group.colorSoft }}
              >
                Overview →
              </Link>
            )}
            {group.links.map((l) => (
              <Link
                className="toc-link"
                href={l.href}
                key={l.href}
                style={{ ['--nav-color' as string]: group.color, ['--nav-color-soft' as string]: group.colorSoft }}
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
