import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';

export const metadata = {
  title: 'Design Patterns — System Design Architectures',
};

function PatternCard({ href, name, desc }: { href: string; name: string; desc: string }) {
  return (
    <a className="pattern-card" href={href}>
      <div className="p-name">{name}</div>
      <div className="p-desc">{desc}</div>
    </a>
  );
}

export default function DesignPatternsHubPage() {
  return (
    <>
      <Header />
      <div className="layout">
        <TopicSidebar
          backHref="/pages/lld"
          backLabel="Back to LLD"
          toc={[
            { id: 'overview', label: 'Overview' },
            { id: 'learn', label: "What You'll Learn" },
            { id: 'creational', label: 'Creational (5)' },
            { id: 'structural', label: 'Structural (7)' },
            { id: 'behavioral', label: 'Behavioral (11)' },
          ]}
        />

        <main className="content">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Design Patterns' }]} />
          <h1 id="overview">Design Patterns</h1>
          <p>
            All 23 classic Gang of Four patterns, grouped into three families by what problem they
            solve. Unlike the HLD and LLD-foundations tracks, there&apos;s no required order here —
            each pattern stands alone, so browse by category or jump straight to a name you
            already recognize.
          </p>

          <section id="learn">
            <h2>What You&apos;ll Learn</h2>
            <p>
              Every pattern page follows the same shape: theory and a UML-style diagram, when to
              actually reach for it (and when not to), real-world examples from libraries and
              frameworks you&apos;ve likely used, interview questions, and working code in Java,
              Python, JavaScript, and C++.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/shared/patterns-track.svg"
                alt="Three category boxes: Creational (5 patterns, how objects get created), Structural (7 patterns, how objects fit together), Behavioral (11 patterns, how objects communicate)"
              />
              <figcaption>Three families, 23 patterns — creation, composition, and communication</figcaption>
            </figure>
          </section>

          <section id="creational">
            <h3>Creational — how objects get created</h3>
            <div className="pattern-grid">
              <PatternCard href="/pages/lld/design-patterns/creational/singleton" name="Singleton" desc="Exactly one instance, globally accessible" />
              <PatternCard href="/pages/lld/design-patterns/creational/factory-method" name="Factory Method" desc="Subclasses decide what gets created" />
              <PatternCard href="/pages/lld/design-patterns/creational/abstract-factory" name="Abstract Factory" desc="Families of related objects, swapped together" />
              <PatternCard href="/pages/lld/design-patterns/creational/builder" name="Builder" desc="Construct complex objects step by step" />
              <PatternCard href="/pages/lld/design-patterns/creational/prototype" name="Prototype" desc="Clone an existing object instead of rebuilding" />
            </div>
          </section>

          <section id="structural">
            <h3>Structural — how objects fit together</h3>
            <div className="pattern-grid">
              <PatternCard href="/pages/lld/design-patterns/structural/adapter" name="Adapter" desc="Make an incompatible interface fit" />
              <PatternCard href="/pages/lld/design-patterns/structural/bridge" name="Bridge" desc="Split abstraction from implementation" />
              <PatternCard href="/pages/lld/design-patterns/structural/composite" name="Composite" desc="Treat one object and a group the same way" />
              <PatternCard href="/pages/lld/design-patterns/structural/decorator" name="Decorator" desc="Add behavior without subclassing" />
              <PatternCard href="/pages/lld/design-patterns/structural/facade" name="Facade" desc="One simple interface over a complex system" />
              <PatternCard href="/pages/lld/design-patterns/structural/flyweight" name="Flyweight" desc="Share state to support huge numbers of objects" />
              <PatternCard href="/pages/lld/design-patterns/structural/proxy" name="Proxy" desc="A stand-in that controls access to the real thing" />
            </div>
          </section>

          <section id="behavioral">
            <h3>Behavioral — how objects communicate</h3>
            <div className="pattern-grid">
              <PatternCard href="/pages/lld/design-patterns/behavioral/observer" name="Observer" desc="Notify many listeners when one thing changes" />
              <PatternCard href="/pages/lld/design-patterns/behavioral/strategy" name="Strategy" desc="Swap an algorithm at runtime" />
              <PatternCard href="/pages/lld/design-patterns/behavioral/command" name="Command" desc="Turn a request into an object you can queue or undo" />
              <PatternCard href="/pages/lld/design-patterns/behavioral/state" name="State" desc="Behavior changes as an object's state changes" />
              <PatternCard href="/pages/lld/design-patterns/behavioral/chain-of-responsibility" name="Chain of Responsibility" desc="Pass a request along a chain of handlers" />
              <PatternCard href="/pages/lld/design-patterns/behavioral/template-method" name="Template Method" desc="Fix the skeleton, let subclasses fill in steps" />
              <PatternCard href="/pages/lld/design-patterns/behavioral/iterator" name="Iterator" desc="Walk a collection without exposing its internals" />
              <PatternCard href="/pages/lld/design-patterns/behavioral/mediator" name="Mediator" desc="Objects talk through a hub, not each other" />
              <PatternCard href="/pages/lld/design-patterns/behavioral/memento" name="Memento" desc="Capture and restore an object's state" />
              <PatternCard href="/pages/lld/design-patterns/behavioral/visitor" name="Visitor" desc="Add operations without changing the classes" />
              <PatternCard href="/pages/lld/design-patterns/behavioral/interpreter" name="Interpreter" desc="Evaluate sentences in a small custom language" />
            </div>
          </section>

          <PageNav
            prev={{ label: 'LLD Capstone', href: '/pages/lld/capstones' }}
            next={{ label: 'Start: Singleton', href: '/pages/lld/design-patterns/creational/singleton' }}
          />
        </main>
      </div>

      <Footer
        sectionColumn={{
          title: 'HLD',
          links: [
            { label: 'Fundamentals', href: '/pages/hld/fundamentals' },
            { label: 'Load Balancing', href: '/pages/hld/load-balancing' },
            { label: 'Caching', href: '/pages/hld/caching' },
            { label: 'Capstones', href: '/pages/hld/capstones' },
          ],
        }}
      />
    </>
  );
}
