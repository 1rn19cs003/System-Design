import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Visitor Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `// Visitor Pattern — a PricingVisitor computes price differently for Book and Electronic via double dispatch.
// Compile: javac Visitor.java
// Run:     java Visitor

interface ShoppingCartVisitor {
    double visit(Book book);
    double visit(Electronic electronic);
}

interface ItemElement {
    double accept(ShoppingCartVisitor visitor);
}

class Book implements ItemElement {
    private double price;
    private String title;

    Book(String title, double price) {
        this.title = title;
        this.price = price;
    }

    double getPrice() {
        return price;
    }

    String getTitle() {
        return title;
    }

    public double accept(ShoppingCartVisitor visitor) {
        return visitor.visit(this);
    }
}

class Electronic implements ItemElement {
    private double price;
    private String name;

    Electronic(String name, double price) {
        this.name = name;
        this.price = price;
    }

    double getPrice() {
        return price;
    }

    String getName() {
        return name;
    }

    public double accept(ShoppingCartVisitor visitor) {
        return visitor.visit(this);
    }
}

class PricingVisitor implements ShoppingCartVisitor {
    public double visit(Book book) {
        // Books are tax-exempt.
        System.out.println("Pricing book '" + book.getTitle() + "': $" + book.getPrice() + " (no tax)");
        return book.getPrice();
    }

    public double visit(Electronic electronic) {
        // Electronics carry an 8% tax.
        double taxed = electronic.getPrice() * 1.08;
        System.out.println("Pricing electronic '" + electronic.getName() + "': $" + electronic.getPrice() + " + 8% tax = $" + taxed);
        return taxed;
    }
}

public class Visitor {
    public static void main(String[] args) {
        ItemElement[] cart = new ItemElement[]{
            new Book("Design Patterns", 45.0),
            new Electronic("Headphones", 100.0)
        };

        ShoppingCartVisitor pricingVisitor = new PricingVisitor();

        double total = 0;
        for (ItemElement item : cart) {
            total += item.accept(pricingVisitor);
        }

        System.out.println("Total: $" + total);
    }
}`,
    output: `Pricing book 'Design Patterns': $45.0 (no tax)
Pricing electronic 'Headphones': $100.0 + 8% tax = $108.0
Total: $153.0`,
  },
  python: {
    code: `"""
Visitor Pattern — a PricingVisitor computes price differently for Book and Electronic via double dispatch.
Run: python visitor.py

Python has no compile-time method overloading, so "visit(Book)" / "visit(Electronic)" become
separate, distinctly-named methods (visit_book / visit_electronic) — accept() still performs the
double dispatch by calling the visitor method matching its own concrete type.
"""

from abc import ABC, abstractmethod


class ItemElement(ABC):
    @abstractmethod
    def accept(self, visitor):
        ...


class Book(ItemElement):
    def __init__(self, title, price):
        self.title = title
        self.price = price

    def accept(self, visitor):
        return visitor.visit_book(self)


class Electronic(ItemElement):
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def accept(self, visitor):
        return visitor.visit_electronic(self)


class PricingVisitor:
    def visit_book(self, book: Book):
        # Books are tax-exempt.
        print(f"Pricing book '{book.title}': \${book.price} (no tax)")
        return book.price

    def visit_electronic(self, electronic: Electronic):
        # Electronics carry an 8% tax.
        taxed = electronic.price * 1.08
        print(f"Pricing electronic '{electronic.name}': \${electronic.price} + 8% tax = \${taxed}")
        return taxed


if __name__ == "__main__":
    cart = [
        Book("Design Patterns", 45.0),
        Electronic("Headphones", 100.0),
    ]

    pricing_visitor = PricingVisitor()

    total = 0
    for item in cart:
        total += item.accept(pricing_visitor)

    print(f"Total: \${total}")`,
    output: `Pricing book 'Design Patterns': $45.0 (no tax)
Pricing electronic 'Headphones': $100.0 + 8% tax = $108.0
Total: $153.0`,
  },
  javascript: {
    code: `/**
 * Visitor Pattern — a PricingVisitor computes price differently for Book and Electronic via double dispatch.
 * Run: node visitor.js
 *
 * JavaScript has no compile-time method overloading, so visit(Book)/visit(Electronic) become
 * separate, distinctly-named methods (visitBook / visitElectronic) — accept() still performs the
 * double dispatch by calling the visitor method matching its own concrete type.
 */

class Book {
  constructor(title, price) {
    this.title = title;
    this.price = price;
  }

  accept(visitor) {
    return visitor.visitBook(this);
  }
}

class Electronic {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  accept(visitor) {
    return visitor.visitElectronic(this);
  }
}

class PricingVisitor {
  visitBook(book) {
    // Books are tax-exempt.
    console.log(\`Pricing book '\${book.title}': $\${book.price} (no tax)\`);
    return book.price;
  }

  visitElectronic(electronic) {
    // Electronics carry an 8% tax.
    const taxed = electronic.price * 1.08;
    console.log(\`Pricing electronic '\${electronic.name}': $\${electronic.price} + 8% tax = $\${taxed}\`);
    return taxed;
  }
}

const cart = [
  new Book("Design Patterns", 45.0),
  new Electronic("Headphones", 100.0),
];

const pricingVisitor = new PricingVisitor();

let total = 0;
cart.forEach(item => {
  total += item.accept(pricingVisitor);
});

console.log(\`Total: $\${total}\`);

module.exports = { Book, Electronic, PricingVisitor };`,
    output: `Pricing book 'Design Patterns': $45 (no tax)
Pricing electronic 'Headphones': $100 + 8% tax = $108
Total: $153`,
  },
  cpp: {
    code: `// Visitor Pattern — a PricingVisitor computes price differently for Book and Electronic via double dispatch.
// Compile: g++ -std=c++14 Visitor.cpp -o visitor
// Run:     ./visitor

#include <iostream>
#include <string>
#include <vector>
#include <memory>

class Book;
class Electronic;

class ShoppingCartVisitor {
public:
    virtual double visit(Book& book) = 0;
    virtual double visit(Electronic& electronic) = 0;
    virtual ~ShoppingCartVisitor() = default;
};

class ItemElement {
public:
    virtual double accept(ShoppingCartVisitor& visitor) = 0;
    virtual ~ItemElement() = default;
};

class Book : public ItemElement {
public:
    Book(std::string title, double price) : title_(std::move(title)), price_(price) {}

    const std::string& getTitle() const { return title_; }
    double getPrice() const { return price_; }

    double accept(ShoppingCartVisitor& visitor) override {
        return visitor.visit(*this);
    }

private:
    std::string title_;
    double price_;
};

class Electronic : public ItemElement {
public:
    Electronic(std::string name, double price) : name_(std::move(name)), price_(price) {}

    const std::string& getName() const { return name_; }
    double getPrice() const { return price_; }

    double accept(ShoppingCartVisitor& visitor) override {
        return visitor.visit(*this);
    }

private:
    std::string name_;
    double price_;
};

class PricingVisitor : public ShoppingCartVisitor {
public:
    double visit(Book& book) override {
        std::cout << "Pricing book '" << book.getTitle() << "': $" << book.getPrice() << " (no tax)" << std::endl;
        return book.getPrice();
    }

    double visit(Electronic& electronic) override {
        double taxed = electronic.getPrice() * 1.08;
        std::cout << "Pricing electronic '" << electronic.getName() << "': $" << electronic.getPrice()
                   << " + 8% tax = $" << taxed << std::endl;
        return taxed;
    }
};

int main() {
    Book book("Design Patterns", 45.0);
    Electronic electronic("Headphones", 100.0);

    std::vector<ItemElement*> cart = { &book, &electronic };

    PricingVisitor pricingVisitor;

    double total = 0;
    for (auto* item : cart) {
        total += item->accept(pricingVisitor);
    }

    std::cout << "Total: $" << total << std::endl;

    return 0;
}`,
    output: `Pricing book 'Design Patterns': $45 (no tax)
Pricing electronic 'Headphones': $100 + 8% tax = $108
Total: $153`,
  },
};

const qaItems = [
  {
    q: 'What problem does Visitor solve?',
    a: 'It lets you add new operations over a fixed set of element types without modifying those element classes — each new operation becomes a new Visitor class, rather than a new method scattered across every existing element class.',
  },
  {
    q: 'What is "double dispatch" and why does Visitor need it?',
    a: <>Double dispatch means the operation that actually executes depends on two types resolved through two separate method calls: first, the element&apos;s concrete <code>accept()</code> implementation is chosen based on the element&apos;s runtime type; then inside <code>accept()</code>, calling <code>visitor.visit(this)</code> resolves to the correct overload based on the compile-time type of <code>this</code> within that specific <code>accept()</code> method.</>,
  },
  {
    q: 'What’s the core trade-off of using Visitor?',
    a: <>Adding a new operation is easy — just write a new Visitor implementing <code>visit()</code> for each existing element type. Adding a new element type is hard — every existing Visitor must be updated with a new <code>visit()</code> overload for that type. Visitor is the right choice specifically when element types are stable but operations grow often.</>,
  },
  {
    q: 'Why can’t a single overloaded method on the Subject decide which visit to call directly, without accept()?',
    a: <>Most mainstream languages resolve overloaded methods based on the static/compile-time type of the argument, not its runtime type. If client code holds an element through a general <code>ItemElement</code> reference and calls <code>visitor.visit(item)</code> directly, the compiler would pick the <code>visit(ItemElement)</code> overload rather than the specific <code>visit(Book)</code> one. Routing through the element&apos;s own <code>accept()</code> method fixes this, because inside <code>Book.accept()</code>, the compile-time type of <code>this</code> is genuinely <code>Book</code>.</>,
  },
];

export default function VisitorPatternPage() {
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
              { label: 'Behavioral', href: '/pages/lld/design-patterns#behavioral' },
              { label: 'Visitor' },
            ]}
          />
          <h1 id="overview">Visitor Pattern</h1>
          <p>Moves an operation that varies by type out of the type&apos;s own class and into a separate Visitor, using double dispatch so new operations can be added without touching the element classes.</p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>You have a shopping cart containing different item types — <code>Book</code> and <code>Electronic</code> — and you need to compute a final price that applies different tax rules to each type: books are tax-exempt, electronics carry a flat tax rate. The obvious approach is a <code>calculatePrice()</code> method on each item class. But now imagine you also need to add a &quot;generate shipping label&quot; operation, and later an &quot;apply holiday discount&quot; operation — every new operation means going back and adding a new method to every single item class, even though the operation itself has nothing to do with what the item class is fundamentally responsible for representing.</p>
            <p>Visitor solves this by moving each operation into its own separate <code>Visitor</code> class, with one <code>visit(...)</code> method per item type. Each item class implements a single, stable method — <code>accept(visitor)</code> — that simply calls the correct <code>visit()</code> overload on the visitor, passing itself in. Adding a brand-new operation means writing one new Visitor class, without touching <code>Book</code> or <code>Electronic</code> at all. The trade-off is the reverse: adding a brand-new item type does require updating every existing Visitor.</p>

            <h3>How it&apos;s built</h3>
            <p>An <code>Element</code> interface (<code>ItemElement</code>) declares <code>accept(visitor)</code>. Concrete elements (<code>Book</code>, <code>Electronic</code>) implement <code>accept()</code> to call <code>visitor.visit(this)</code> — note this is exactly the right overload of <code>visit()</code> because the compile-time type of <code>this</code> inside <code>Book.accept()</code> is <code>Book</code>, letting the language&apos;s method overload resolution pick <code>visit(Book)</code> automatically. This two-step call is called &quot;double dispatch&quot; — the operation that actually runs depends on both the concrete element type and the concrete visitor type, resolved through two separate method calls rather than one.</p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>Reach for Visitor only when the element type hierarchy is genuinely stable — it&apos;s specifically a bet that operations will grow faster than types.</p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>Applying Visitor to a type hierarchy that&apos;s still actively growing new subclasses — every new type means updating every existing Visitor, which can outweigh the benefit entirely.</p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>Visitor is genuinely awkward when new element types are added frequently, since every existing Visitor implementation needs a new <code>visit()</code> method for the new type — this is the mirror image of the flexibility it buys you for adding new operations. It&apos;s specifically well-suited to systems where the set of element types is stable but the set of operations over those types grows often — get that assumption backwards and Visitor becomes more work than it saves.</p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/visitor/class-diagram.svg"
                alt="Visitor pattern class diagram showing Book and Electronic implementing ItemElement.accept(), calling back into PricingVisitor's visit(Book) and visit(Electronic) overloads via double dispatch"
              />
              <figcaption>accept() calls back into visit() — double dispatch picks the right overload per element type</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>You have a stable, rarely-changing set of element types, but frequently need new operations that act differently across those types.</li>
                  <li>You want operation-specific logic kept out of element classes, which should stay focused on representing their own data.</li>
                  <li>Different unrelated operations need to traverse the same object structure without piling methods onto every element class.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>New element types are added frequently — every new type requires updating every existing Visitor.</li>
                  <li>The operations are simple and few — a plain method on each element class is more direct.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are actually listening for:</strong> explaining &quot;double dispatch&quot; clearly — that <code>accept()</code> calling back into an overloaded <code>visit()</code> is what lets the correct operation run for a given combination of element type and visitor type. Also, stating the core trade-off precisely: Visitor makes adding new operations easy and adding new element types hard, the exact opposite of a plain method-per-type design.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Compiler AST processing</strong> — separate visitors handle type-checking, code generation, and optimization over the same fixed set of syntax tree node types.</li>
              <li><strong>Document export pipelines</strong> — a document made of fixed element types can be visited by separate PDF-export, HTML-export, or plain-text-export visitors.</li>
              <li><strong>Shopping cart pricing/tax rules</strong> — different item types are visited by a pricing visitor that applies category-specific tax logic.</li>
              <li><strong>Static analysis tools / linters</strong> — a linter visits every node in a parsed codebase&apos;s syntax tree, applying different rule checks.</li>
              <li><strong>UI component tree operations</strong> — separate visitors compute layout, accessibility checks, or serialization over the same fixed set of component types.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>Same pattern, four languages. Every output shown here was captured from a real run — note Python/JavaScript name the visit methods per-type (<code>visit_book</code>/<code>visitBook</code>) since those languages lack compile-time overload resolution, while Java and C++ use true overloaded <code>visit()</code> methods.</p>
            <CodeTerminal snippets={snippets} />
          </section>

          <PageNav
            prev={{ label: 'Memento', href: '/pages/lld/design-patterns/behavioral/memento' }}
            next={{ label: 'Interpreter', href: '/pages/lld/design-patterns/behavioral/interpreter' }}
          />
        </main>
      </div>

      <Footer
        sectionColumn={{
          title: 'Design Patterns',
          links: [
            { label: 'Singleton', href: '/pages/lld/design-patterns/creational/singleton' },
            { label: 'Adapter', href: '/pages/lld/design-patterns/structural/adapter' },
            { label: 'Observer', href: '/pages/lld/design-patterns/behavioral/observer' },
            { label: 'Strategy', href: '/pages/lld/design-patterns/behavioral/strategy' },
          ],
        }}
      />
    </>
  );
}
