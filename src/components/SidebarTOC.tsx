'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export interface TOCItem {
  id: string;
  label: string;
}

interface SidebarTOCProps {
  backLink?: { href: string; label: string };
  title?: string;
  items: TOCItem[];
}

export default function SidebarTOC({ backLink, title = 'ON THIS PAGE', items }: SidebarTOCProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined' || items.length === 0) return;

    const handleScroll = () => {
      let current = '';
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            current = item.id;
          }
        }
      }
      setActiveId(current || items[0]?.id || '');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  return (
    <nav className="sidebar">
      {backLink && (
        <Link href={backLink.href} className="back">
          {backLink.label}
        </Link>
      )}
      <h3>{title}</h3>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`toc ${activeId === item.id ? 'active' : ''}`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
