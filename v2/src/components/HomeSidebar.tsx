'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Group {
  id: string;
  label: string;
  defaultOpen?: boolean;
  overviewHref?: string;
  links: { label: string; href: string }[];
}

const GROUPS: Group[] = [
  {
    id: 'hld',
    label: 'HLD',
    defaultOpen: true,
    overviewHref: '/pages/hld',
    links: [
      { label: 'Fundamentals', href: '/pages/hld/fundamentals' },
      { label: 'Load Balancing', href: '/pages/hld/load-balancing' },
      { label: 'Caching', href: '/pages/hld/caching' },
      { label: 'Databases', href: '/pages/hld/databases' },
      { label: 'Message Queues', href: '/pages/hld/message-queues' },
      { label: 'Microservices', href: '/pages/hld/microservices' },
      { label: 'Capstones', href: '/pages/hld/capstones' },
    ],
  },
  {
    id: 'lld',
    label: 'LLD',
    overviewHref: '/pages/lld',
    links: [
      { label: 'OOP Fundamentals', href: '/pages/lld/oop-fundamentals' },
      { label: 'SOLID Principles', href: '/pages/lld/solid-principles' },
      { label: 'LLD Capstones', href: '/pages/lld/capstones' },
    ],
  },
  {
    id: 'design-patterns-creational',
    label: 'Patterns — Creational',
    overviewHref: '/pages/lld/design-patterns',
    links: [
      { label: 'Singleton', href: '/pages/lld/design-patterns/creational/singleton' },
      { label: 'Factory Method', href: '/pages/lld/design-patterns/creational/factory-method' },
      { label: 'Abstract Factory', href: '/pages/lld/design-patterns/creational/abstract-factory' },
      { label: 'Builder', href: '/pages/lld/design-patterns/creational/builder' },
      { label: 'Prototype', href: '/pages/lld/design-patterns/creational/prototype' },
    ],
  },
  {
    id: 'design-patterns-structural',
    label: 'Patterns — Structural',
    links: [
      { label: 'Adapter', href: '/pages/lld/design-patterns/structural/adapter' },
      { label: 'Bridge', href: '/pages/lld/design-patterns/structural/bridge' },
      { label: 'Composite', href: '/pages/lld/design-patterns/structural/composite' },
      { label: 'Decorator', href: '/pages/lld/design-patterns/structural/decorator' },
      { label: 'Facade', href: '/pages/lld/design-patterns/structural/facade' },
      { label: 'Flyweight', href: '/pages/lld/design-patterns/structural/flyweight' },
      { label: 'Proxy', href: '/pages/lld/design-patterns/structural/proxy' },
    ],
  },
  {
    id: 'design-patterns-behavioral',
    label: 'Patterns — Behavioral',
    links: [
      { label: 'Observer', href: '/pages/lld/design-patterns/behavioral/observer' },
      { label: 'Strategy', href: '/pages/lld/design-patterns/behavioral/strategy' },
      { label: 'Command', href: '/pages/lld/design-patterns/behavioral/command' },
      { label: 'State', href: '/pages/lld/design-patterns/behavioral/state' },
      { label: 'Chain of Responsibility', href: '/pages/lld/design-patterns/behavioral/chain-of-responsibility' },
      { label: 'Template Method', href: '/pages/lld/design-patterns/behavioral/template-method' },
      { label: 'Iterator', href: '/pages/lld/design-patterns/behavioral/iterator' },
      { label: 'Mediator', href: '/pages/lld/design-patterns/behavioral/mediator' },
      { label: 'Memento', href: '/pages/lld/design-patterns/behavioral/memento' },
      { label: 'Visitor', href: '/pages/lld/design-patterns/behavioral/visitor' },
      { label: 'Interpreter', href: '/pages/lld/design-patterns/behavioral/interpreter' },
    ],
  },
  {
    id: 'case-studies',
    label: 'Case Studies',
    overviewHref: '/pages/case-studies',
    links: [
      { label: 'URL Shortener', href: '/pages/case-studies/url-shortener' },
      { label: 'Twitter / X', href: '/pages/case-studies/twitter' },
      { label: 'WhatsApp', href: '/pages/case-studies/whatsapp' },
      { label: 'Uber', href: '/pages/case-studies/uber' },
      { label: 'Netflix / YouTube', href: '/pages/case-studies/netflix' },
    ],
  },
  {
    id: 'reference',
    label: 'Reference',
    overviewHref: '/pages/reference',
    links: [
      { label: 'Latency Numbers', href: '/pages/reference/latency-numbers' },
      { label: 'Glossary', href: '/pages/reference/glossary' },
    ],
  },
];

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
          <summary id={group.id}>{group.label}</summary>
          <div className="group-body">
            {group.overviewHref && (
              <Link className="toc-link" href={group.overviewHref} style={{ fontWeight: 600 }}>
                Overview →
              </Link>
            )}
            {group.links.map((l) => (
              <Link className="toc-link" href={l.href} key={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
        </details>
      ))}
    </nav>
  );
}
