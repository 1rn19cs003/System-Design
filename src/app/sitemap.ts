import { MetadataRoute } from 'next';

// Mirrors the actual static site under /public exactly (index.html + every page under /pages/**),
// since the real content is served as static HTML rather than re-rendered through the app router.
const PAGE_PATHS: string[] = [
  '/pages/core-principles.html',
  '/pages/hld/index.html',
  '/pages/hld/fundamentals.html',
  '/pages/hld/load-balancing.html',
  '/pages/hld/caching.html',
  '/pages/hld/databases.html',
  '/pages/hld/message-queues.html',
  '/pages/hld/microservices.html',
  '/pages/hld/capstones.html',
  '/pages/lld/index.html',
  '/pages/lld/oop-fundamentals.html',
  '/pages/lld/solid-principles.html',
  '/pages/lld/capstones.html',
  '/pages/lld/design-patterns/index.html',
  '/pages/lld/design-patterns/creational/singleton.html',
  '/pages/lld/design-patterns/creational/factory-method.html',
  '/pages/lld/design-patterns/creational/abstract-factory.html',
  '/pages/lld/design-patterns/creational/builder.html',
  '/pages/lld/design-patterns/creational/prototype.html',
  '/pages/lld/design-patterns/structural/adapter.html',
  '/pages/lld/design-patterns/structural/bridge.html',
  '/pages/lld/design-patterns/structural/composite.html',
  '/pages/lld/design-patterns/structural/decorator.html',
  '/pages/lld/design-patterns/structural/facade.html',
  '/pages/lld/design-patterns/structural/flyweight.html',
  '/pages/lld/design-patterns/structural/proxy.html',
  '/pages/lld/design-patterns/behavioral/observer.html',
  '/pages/lld/design-patterns/behavioral/strategy.html',
  '/pages/lld/design-patterns/behavioral/command.html',
  '/pages/lld/design-patterns/behavioral/state.html',
  '/pages/lld/design-patterns/behavioral/chain-of-responsibility.html',
  '/pages/lld/design-patterns/behavioral/template-method.html',
  '/pages/lld/design-patterns/behavioral/iterator.html',
  '/pages/lld/design-patterns/behavioral/mediator.html',
  '/pages/lld/design-patterns/behavioral/memento.html',
  '/pages/lld/design-patterns/behavioral/visitor.html',
  '/pages/lld/design-patterns/behavioral/interpreter.html',
  '/pages/case-studies/index.html',
  '/pages/case-studies/url-shortener.html',
  '/pages/case-studies/twitter.html',
  '/pages/case-studies/whatsapp.html',
  '/pages/case-studies/uber.html',
  '/pages/case-studies/netflix.html',
  '/pages/reference/index.html',
  '/pages/reference/latency-numbers.html',
  '/pages/reference/glossary.html',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://system-design-architectures.local'; // update to the real domain on deploy

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    ...PAGE_PATHS.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
