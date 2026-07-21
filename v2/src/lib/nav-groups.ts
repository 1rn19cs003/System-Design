export interface NavGroup {
  id: string;
  label: string;
  defaultOpen?: boolean;
  overviewHref?: string;
  links: { label: string; href: string }[];
}

/**
 * Single source of truth for the site's full navigation tree. Used by both
 * HomeSidebar (homepage) and TopicSidebar (every topic page) so the sidebar
 * accordion is identical everywhere and the active page/section can always
 * be found without leaving whatever page you're currently reading.
 */
export const GROUPS: NavGroup[] = [
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
    id: 'distributed-systems',
    label: 'Distributed Systems',
    overviewHref: '/pages/distributed-systems',
    links: [
      { label: 'Consensus & Coordination', href: '/pages/distributed-systems/consensus-coordination' },
      { label: 'Distributed Transactions', href: '/pages/distributed-systems/distributed-transactions' },
      { label: 'Resilience Patterns', href: '/pages/distributed-systems/resilience-patterns' },
      { label: 'API & Communication', href: '/pages/distributed-systems/api-communication-patterns' },
      { label: 'Big Data Processing', href: '/pages/distributed-systems/big-data-processing' },
      { label: 'Architectural Patterns', href: '/pages/distributed-systems/architectural-patterns' },
      { label: 'Observability & Security', href: '/pages/distributed-systems/observability-security' },
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

export function findActiveGroupId(pathname: string | null | undefined): string | undefined {
  if (!pathname) return undefined;
  for (const group of GROUPS) {
    if (group.overviewHref === pathname) return group.id;
    if (group.links.some((l) => l.href === pathname)) return group.id;
  }
  return undefined;
}
