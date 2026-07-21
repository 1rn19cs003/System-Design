import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Decorator Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `interface Coffee {
    double getCost();
    String getDescription();
}

class Espresso implements Coffee {
    public double getCost() { return 2.00; }
    public String getDescription() { return "Espresso"; }
}

abstract class CoffeeDecorator implements Coffee {
    protected Coffee wrapped;

    CoffeeDecorator(Coffee wrapped) {
        this.wrapped = wrapped;
    }
}

class Milk extends CoffeeDecorator {
    Milk(Coffee wrapped) { super(wrapped); }
    public double getCost() { return wrapped.getCost() + 0.50; }
    public String getDescription() { return wrapped.getDescription() + " + Milk"; }
}

class Caramel extends CoffeeDecorator {
    Caramel(Coffee wrapped) { super(wrapped); }
    public double getCost() { return wrapped.getCost() + 0.75; }
    public String getDescription() { return wrapped.getDescription() + " + Caramel"; }
}

public class Decorator {
    public static void main(String[] args) {
        Coffee plain = new Espresso();
        System.out.println(plain.getDescription() + " = $" + plain.getCost());

        Coffee fancy = new Caramel(new Milk(new Espresso()));
        System.out.println(fancy.getDescription() + " = $" + fancy.getCost());
    }
}`,
    output: `Espresso = $2.0
Espresso + Milk + Caramel = $3.25`,
  },
  python: {
    code: `from abc import ABC, abstractmethod


class Coffee(ABC):
    @abstractmethod
    def get_cost(self):
        ...

    @abstractmethod
    def get_description(self):
        ...


class Espresso(Coffee):
    def get_cost(self):
        return 2.00

    def get_description(self):
        return "Espresso"


class CoffeeDecorator(Coffee):
    def __init__(self, wrapped: Coffee):
        self.wrapped = wrapped


class Milk(CoffeeDecorator):
    def get_cost(self):
        return self.wrapped.get_cost() + 0.50

    def get_description(self):
        return self.wrapped.get_description() + " + Milk"


class Caramel(CoffeeDecorator):
    def get_cost(self):
        return self.wrapped.get_cost() + 0.75

    def get_description(self):
        return self.wrapped.get_description() + " + Caramel"


if __name__ == "__main__":
    plain = Espresso()
    print(f"{plain.get_description()} = \${plain.get_cost()}")

    fancy = Caramel(Milk(Espresso()))
    print(f"{fancy.get_description()} = \${fancy.get_cost()}")`,
    output: `Espresso = $2.0
Espresso + Milk + Caramel = $3.25`,
  },
  javascript: {
    code: `class Espresso {
  getCost() { return 2.00; }
  getDescription() { return "Espresso"; }
}

class CoffeeDecorator {
  constructor(wrapped) {
    this.wrapped = wrapped;
  }
}

class Milk extends CoffeeDecorator {
  getCost() { return this.wrapped.getCost() + 0.50; }
  getDescription() { return this.wrapped.getDescription() + " + Milk"; }
}

class Caramel extends CoffeeDecorator {
  getCost() { return this.wrapped.getCost() + 0.75; }
  getDescription() { return this.wrapped.getDescription() + " + Caramel"; }
}

const plain = new Espresso();
console.log(\`\${plain.getDescription()} = $\${plain.getCost()}\`);

const fancy = new Caramel(new Milk(new Espresso()));
console.log(\`\${fancy.getDescription()} = $\${fancy.getCost()}\`);

module.exports = { Espresso, Milk, Caramel };`,
    output: `Espresso = $2
Espresso + Milk + Caramel = $3.25`,
  },
  cpp: {
    code: `#include <iostream>
#include <string>
#include <memory>

class Coffee {
public:
    virtual double getCost() const = 0;
    virtual std::string getDescription() const = 0;
    virtual ~Coffee() = default;
};

class Espresso : public Coffee {
public:
    double getCost() const override { return 2.00; }
    std::string getDescription() const override { return "Espresso"; }
};

class CoffeeDecorator : public Coffee {
public:
    explicit CoffeeDecorator(std::unique_ptr<Coffee> wrapped) : wrapped_(std::move(wrapped)) {}

protected:
    std::unique_ptr<Coffee> wrapped_;
};

class Milk : public CoffeeDecorator {
public:
    explicit Milk(std::unique_ptr<Coffee> wrapped) : CoffeeDecorator(std::move(wrapped)) {}
    double getCost() const override { return wrapped_->getCost() + 0.50; }
    std::string getDescription() const override { return wrapped_->getDescription() + " + Milk"; }
};

class Caramel : public CoffeeDecorator {
public:
    explicit Caramel(std::unique_ptr<Coffee> wrapped) : CoffeeDecorator(std::move(wrapped)) {}
    double getCost() const override { return wrapped_->getCost() + 0.75; }
    std::string getDescription() const override { return wrapped_->getDescription() + " + Caramel"; }
};

int main() {
    std::unique_ptr<Coffee> plain = std::make_unique<Espresso>();
    std::cout << plain->getDescription() << " = $" << plain->getCost() << std::endl;

    std::unique_ptr<Coffee> fancy = std::make_unique<Caramel>(std::make_unique<Milk>(std::make_unique<Espresso>()));
    std::cout << fancy->getDescription() << " = $" << fancy->getCost() << std::endl;

    return 0;
}`,
    output: `Espresso = $2
Espresso + Milk + Caramel = $3.25`,
  },
};

const qaItems = [
  {
    q: 'How does Decorator differ from just using inheritance to add behavior?',
    a: 'Inheritance fixes behavior combinations at compile time — one subclass per combination, exploding as options grow. Decorator adds behavior at runtime by wrapping objects, so any combination and order is possible without pre-declaring a subclass for it.',
  },
  {
    q: 'How is Decorator different from Adapter, given both wrap another object?',
    a: "Decorator preserves the same interface as what it wraps — a decorated Coffee is still usable anywhere a Coffee is expected, and any number of decorators can stack. Adapter changes the interface specifically because the wrapped object's original interface doesn't match what the caller needs.",
  },
  {
    q: 'Does the order in which you apply decorators matter?',
    a: 'Yes, often. Wrapping a "10% discount" decorator around a "tax" decorator gives a different final price than wrapping tax around discount. This is a common follow-up question to test whether a candidate has actually implemented the pattern, not just memorized the diagram.',
  },
  {
    q: 'Give a real-world example of Decorator outside "coffee shop" toy examples.',
    a: "Java's I/O stream classes: new BufferedReader(new InputStreamReader(new FileInputStream(...))). Each wrapper adds one capability (buffering, byte-to-character decoding) while implementing the same stream interface as what it wraps, and layers can be added, omitted, or reordered as needed.",
  },
];

export default function DecoratorPage() {
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
              { label: 'Structural', href: '/pages/lld/design-patterns#structural' },
              { label: 'Decorator' },
            ]}
          />
          <h1 id="overview">Decorator Pattern</h1>
          <p>
            Attaches additional responsibilities to an object dynamically, by wrapping it — a
            flexible alternative to subclassing for extending behavior.
          </p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>
              You&apos;re building a coffee shop ordering system. A <code>Coffee</code> can have
              milk, whipped cream, caramel, extra shots — any combination, each adding to price
              and description. Model this with subclasses and you get{' '}
              <code>CoffeeWithMilk</code>, <code>CoffeeWithMilkAndCream</code>,{' '}
              <code>CoffeeWithMilkAndCreamAndCaramel</code> — a class explosion driven by optional
              add-ons.
            </p>
            <p>
              Decorator wraps objects instead of subclassing them. Each add-on (<code>Milk</code>,{' '}
              <code>Cream</code>, <code>Caramel</code>) is its own small class wrapping a{' '}
              <code>Coffee</code> (or another decorator), implementing the same{' '}
              <code>Coffee</code> interface, adding its own contribution before or after
              delegating to what it wraps. You build the final coffee by wrapping layer after
              layer at runtime.
            </p>

            <h3>How it&apos;s built</h3>
            <p>
              A <code>Component</code> interface (<code>Coffee</code>) is implemented both by
              concrete base objects (<code>Espresso</code>) and by <code>Decorator</code> classes
              that also implement <code>Component</code> while holding a reference to a wrapped{' '}
              <code>Component</code>. Because every decorator satisfies the same interface as what
              it wraps, decorators stack arbitrarily and the caller can&apos;t tell how many
              layers deep the object is.
            </p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>
                  Keep each decorator focused on one responsibility (one topping, one behavior) —
                  that&apos;s what makes arbitrary stacking in any combination actually work
                  cleanly.
                </p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>
                  Not accounting for order-dependence. Wrapping a discount decorator before vs.
                  after a tax decorator gives different final prices — decorator order
                  isn&apos;t always cosmetic.
                </p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>
              Deeply nested decorator chains can get hard to read and debug — &quot;what does this
              object actually do?&quot; requires mentally unwinding several layers. It&apos;s also
              easy to over-decorate something that would be clearer as one configurable object
              with a few flags.
            </p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/decorator/class-diagram.svg"
                alt="Decorator pattern class diagram showing Coffee interface implemented by Espresso and by an abstract CoffeeDecorator wrapping another Coffee, with Milk and Caramel as concrete decorators"
              />
              <figcaption>Each layer still satisfies the Coffee interface — stacking is arbitrary</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>You need optional, combinable behavior added at runtime, and subclassing every combination would explode the class count.</li>
                  <li>The added behavior should be transparent — callers shouldn&apos;t need to know or care that the object is decorated.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>Only one or two fixed combinations exist and never change — a couple of subclasses or a flag is simpler.</li>
                  <li>The &quot;decoration&quot; is actually a different interface — that&apos;s Adapter, not Decorator.</li>
                </ul>
              </Callout>
            </TwoCol>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Java I/O streams</strong> — <code>new BufferedReader(new InputStreamReader(new FileInputStream(...)))</code> layers buffering and decoding onto a raw byte stream.</li>
              <li><strong>Python decorators</strong> (<code>@staticmethod</code>, <code>@property</code>, custom decorators) — wrapping a function to add behavior while preserving its callable interface.</li>
              <li><strong>UI component libraries</strong> — wrapping a base component with Scrollable/Border/Tooltip decorators that add extras while remaining a valid component.</li>
              <li><strong>HTTP middleware chains</strong> (Express.js, servlet filters) — each middleware wraps the next handler, optionally adding behavior before/after calling through.</li>
              <li><strong>Coffee shop / pizza ordering systems</strong> — the canonical teaching example for stacking add-ons without subclassing every combination.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>Same pattern, four languages. Every output shown here was captured from a real run.</p>
            <CodeTerminal snippets={snippets} />
          </section>

          <PageNav
            prev={{ label: 'Composite', href: '/pages/lld/design-patterns/structural/composite' }}
            next={{ label: 'Facade', href: '/pages/lld/design-patterns/structural/facade' }}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
