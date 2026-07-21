import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Prototype Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `class Stats {
    int health;
    int damage;

    Stats(int health, int damage) {
        this.health = health;
        this.damage = damage;
    }

    Stats deepCopy() {
        return new Stats(this.health, this.damage);
    }
}

class Enemy implements Cloneable {
    String type;
    Stats stats;

    Enemy(String type, Stats stats) {
        this.type = type;
        this.stats = stats;
    }

    // Deep copy: stats gets its own independent copy, not a shared reference.
    public Enemy clone() {
        return new Enemy(this.type, this.stats.deepCopy());
    }

    public String toString() {
        return type + "{health=" + stats.health + ", damage=" + stats.damage + "}";
    }
}

public class Prototype {
    public static void main(String[] args) {
        Enemy orcPrototype = new Enemy("Orc", new Stats(100, 15));

        Enemy orc1 = orcPrototype.clone();
        Enemy orc2 = orcPrototype.clone();

        // Mutate orc1's stats — orc2 and the prototype must stay unaffected.
        orc1.stats.health = 40;

        System.out.println("Prototype: " + orcPrototype);
        System.out.println("orc1 (damaged): " + orc1);
        System.out.println("orc2 (untouched): " + orc2);
    }
}`,
    output: `Prototype: Orc{health=100, damage=15}
orc1 (damaged): Orc{health=40, damage=15}
orc2 (untouched): Orc{health=100, damage=15}`,
  },
  python: {
    code: `import copy


class Stats:
    def __init__(self, health, damage):
        self.health = health
        self.damage = damage


class Enemy:
    def __init__(self, enemy_type, stats):
        self.type = enemy_type
        self.stats = stats

    def clone(self):
        # copy.deepcopy recursively clones nested objects (like \`stats\`)
        # instead of sharing references with the original.
        return copy.deepcopy(self)

    def __repr__(self):
        return f"{self.type}{{health={self.stats.health}, damage={self.stats.damage}}}"


if __name__ == "__main__":
    orc_prototype = Enemy("Orc", Stats(100, 15))

    orc1 = orc_prototype.clone()
    orc2 = orc_prototype.clone()

    # Mutate orc1's stats — orc2 and the prototype must stay unaffected.
    orc1.stats.health = 40

    print("Prototype:", orc_prototype)
    print("orc1 (damaged):", orc1)
    print("orc2 (untouched):", orc2)`,
    output: `Prototype: Orc{health=100, damage=15}
orc1 (damaged): Orc{health=40, damage=15}
orc2 (untouched): Orc{health=100, damage=15}`,
  },
  javascript: {
    code: `class Stats {
  constructor(health, damage) {
    this.health = health;
    this.damage = damage;
  }

  deepCopy() {
    return new Stats(this.health, this.damage);
  }
}

class Enemy {
  constructor(type, stats) {
    this.type = type;
    this.stats = stats;
  }

  // Deep copy: stats gets its own independent copy, not a shared reference.
  clone() {
    return new Enemy(this.type, this.stats.deepCopy());
  }

  toString() {
    return \`\${this.type}{health=\${this.stats.health}, damage=\${this.stats.damage}}\`;
  }
}

const orcPrototype = new Enemy("Orc", new Stats(100, 15));

const orc1 = orcPrototype.clone();
const orc2 = orcPrototype.clone();

// Mutate orc1's stats — orc2 and the prototype must stay unaffected.
orc1.stats.health = 40;

console.log("Prototype:", orcPrototype.toString());
console.log("orc1 (damaged):", orc1.toString());
console.log("orc2 (untouched):", orc2.toString());

module.exports = { Enemy, Stats };`,
    output: `Prototype: Orc{health=100, damage=15}
orc1 (damaged): Orc{health=40, damage=15}
orc2 (untouched): Orc{health=100, damage=15}`,
  },
  cpp: {
    code: `#include <iostream>
#include <string>
#include <memory>

class Stats {
public:
    int health;
    int damage;

    Stats(int health, int damage) : health(health), damage(damage) {}

    std::unique_ptr<Stats> deepCopy() const {
        return std::make_unique<Stats>(health, damage);
    }
};

class Enemy {
public:
    std::string type;
    std::unique_ptr<Stats> stats;

    Enemy(std::string type, std::unique_ptr<Stats> stats)
        : type(std::move(type)), stats(std::move(stats)) {}

    // Deep copy: stats gets its own independent copy, not a shared pointer.
    std::unique_ptr<Enemy> clone() const {
        return std::make_unique<Enemy>(type, stats->deepCopy());
    }

    void print() const {
        std::cout << type << "{health=" << stats->health
                   << ", damage=" << stats->damage << "}" << std::endl;
    }
};

int main() {
    Enemy orcPrototype("Orc", std::make_unique<Stats>(100, 15));

    auto orc1 = orcPrototype.clone();
    auto orc2 = orcPrototype.clone();

    // Mutate orc1's stats — orc2 and the prototype must stay unaffected.
    orc1->stats->health = 40;

    std::cout << "Prototype: ";
    orcPrototype.print();

    std::cout << "orc1 (damaged): ";
    orc1->print();

    std::cout << "orc2 (untouched): ";
    orc2->print();

    return 0;
}`,
    output: `Prototype: Orc{health=100, damage=15}
orc1 (damaged): Orc{health=40, damage=15}
orc2 (untouched): Orc{health=100, damage=15}`,
  },
};

const qaItems = [
  {
    q: 'What\'s the difference between a shallow copy and a deep copy, concretely?',
    a: "A shallow copy duplicates the object's own fields, but any field that's a reference to another object still points at the same nested object as the original. A deep copy recursively clones those nested objects too. Mutate a nested object through a shallow copy, and that change is visible through the original as well — that's the bug signature to watch for.",
  },
  {
    q: 'When would you choose Prototype over just calling the constructor?',
    a: 'When construction is expensive — heavy computation, file/network I/O, complex initialization — and you already have a similar, fully-built object to copy from. Also useful when you need to create an object without knowing its exact concrete class, since cloning works polymorphically off whatever prototype instance you were handed.',
  },
  {
    q: 'What are the practical pitfalls of implementing clone() in Java specifically?',
    a: 'Object.clone() performs a shallow copy by default, and its checked-exception, Cloneable-marker-interface design is famously awkward — "Effective Java" recommends avoiding it in favor of a copy constructor or a static factory method that does the copying explicitly. If you do implement clone(), you must manually deep-copy any mutable reference fields yourself.',
  },
  {
    q: 'How would you handle cloning an object that holds a live resource, like a database connection?',
    a: "You generally don't clone the resource itself — you clone the object's configuration/state and re-establish a fresh connection using that state. Trying to literally copy a live socket or file handle doesn't make sense; the clone should re-acquire its own resource rather than share the original's.",
  },
];

export default function PrototypePage() {
  return (
    <>
      <Header />
      <div className="layout">
        <TopicSidebar
          backHref="/pages/lld/design-patterns"
          backLabel="Back to Design Patterns"
          toc={[
            { id: 'overview', label: 'Overview' },
            { id: 'theory', label: 'Theory' },
            { id: 'diagram', label: 'Diagram' },
            { id: 'when-to-use', label: 'When to Use' },
            { id: 'real-world', label: 'Real-World Examples' },
            { id: 'interview-questions', label: 'Interview Questions' },
            { id: 'code', label: 'Code & Output' },
          ]}
        />

        <main className="content narrow">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Design Patterns', href: '/pages/lld/design-patterns' },
              { label: 'Creational', href: '/pages/lld/design-patterns#creational' },
              { label: 'Prototype' },
            ]}
          />
          <h1 id="overview">Prototype Pattern</h1>
          <p>
            Creates new objects by copying an existing instance (a &quot;prototype&quot;) rather
            than constructing from scratch.
          </p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>
              You&apos;ve got an <code>Enemy</code> in a game that took real work to set up —
              loaded a 3D model, computed pathfinding data, initialized stats from config. You now
              need fifty more of the exact same type. Calling <code>new Enemy()</code> fifty times
              and re-running all that setup is wasteful — you already have a fully-configured
              object sitting right there. What you want is to copy the one you have.
            </p>
            <p>
              Prototype formalizes &quot;copy an existing object&quot; as the creation mechanism
              itself. Any object that supports cloning implements a <code>clone()</code> method,
              and creating a new instance means calling <code>.clone()</code> on a prototype rather
              than invoking a constructor.
            </p>

            <h3>How it's built</h3>
            <p>
              An object implements a <code>clone()</code> method that returns a copy of itself. The
              critical design decision is <strong>shallow vs. deep copy</strong>: a shallow copy
              duplicates the object&apos;s own fields but leaves any reference fields pointing at
              the <em>same</em> nested objects as the original. A deep copy recursively clones
              referenced objects too, so the copy is fully independent.
            </p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>
                  Deep-copy any mutable, referenced field (like a nested <code>Stats</code> object)
                  inside <code>clone()</code> — give each clone its own independent copy of
                  anything it might mutate.
                </p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>
                  Doing a shallow copy by default and forgetting about it. Mutate a nested object
                  through the copy, and you&apos;ll see that mutation reflected in the
                  &quot;original&quot; too — a subtle bug that only shows up once something
                  actually gets mutated.
                </p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>
              Deep-cloning an object graph with circular references, or objects wrapping external
              resources (open file handles, DB connections, live sockets), is genuinely tricky —
              those usually can&apos;t be meaningfully cloned at all and need special-casing, like
              re-establishing a fresh connection instead of copying the handle.
            </p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/prototype/class-diagram.svg"
                alt="Prototype pattern class diagram showing an Enemy prototype with a clone method, holding a nested Stats object, and two cloned copies each with their own independent Stats instance"
              />
              <figcaption>Each clone gets its own deep-copied Stats — no shared references</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>Construction from scratch is expensive (I/O, heavy computation) and you have a similar object to copy from.</li>
                  <li>You need to create objects without knowing their exact concrete class ahead of time.</li>
                  <li>You need many near-identical objects that differ only slightly.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>Construction is cheap — a plain constructor is simpler and just as fast.</li>
                  <li>The object graph has circular references or wraps live external resources.</li>
                </ul>
              </Callout>
            </TwoCol>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Java&apos;s <code>Object.clone()</code> / <code>Cloneable</code></strong> — baked directly into the language.</li>
              <li><strong>JavaScript&apos;s prototypal inheritance</strong> — <code>Object.create(proto)</code> creates a new object using an existing one as its prototype.</li>
              <li><strong>Game engines</strong> — spawning many similar enemies/particles by cloning a pre-configured template instead of re-running full initialization.</li>
              <li><strong>&quot;Duplicate&quot; in Google Docs/Sheets</strong> — clones an existing, fully-formatted document rather than rebuilding formatting from scratch.</li>
              <li><strong><code>git clone</code></strong> — copying an existing, fully-initialized repository rather than reconstructing it from nothing.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>
              Same pattern, four languages. Every output shown here was captured from a real run —
              note that mutating <code>orc1</code> never affects <code>orc2</code> or the
              prototype, proving the deep copy works.
            </p>
            <CodeTerminal snippets={snippets} />
          </section>

          <PageNav
            prev={{ label: 'Builder', href: '/pages/lld/design-patterns/creational/builder' }}
            next={{ label: 'Adapter', href: '/pages/lld/design-patterns/structural/adapter' }}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
