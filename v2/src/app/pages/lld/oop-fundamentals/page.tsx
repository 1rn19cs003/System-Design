import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'OOP Fundamentals — System Design Architectures',
};

const snippets = {
  java: {
    code: `public class OOPDemo {
    abstract static class Shape {
        abstract double area();
        abstract double perimeter();
        String describe() {
            return String.format("%s: area=%.2f, perimeter=%.2f", getClass().getSimpleName(), area(), perimeter());
        }
    }

    static class Circle extends Shape {
        double radius;
        Circle(double radius) { this.radius = radius; }
        double area() { return Math.PI * radius * radius; }
        double perimeter() { return 2 * Math.PI * radius; }
    }

    static class Rectangle extends Shape {
        double width, height;
        Rectangle(double width, double height) { this.width = width; this.height = height; }
        double area() { return width * height; }
        double perimeter() { return 2 * (width + height); }
    }

    static class Square extends Rectangle {
        Square(double side) { super(side, side); }
    }

    public static void main(String[] args) {
        Shape[] shapes = { new Circle(3), new Rectangle(4, 5), new Square(6) };
        double totalArea = 0;
        for (Shape shape : shapes) {
            System.out.println(shape.describe());
            totalArea += shape.area();
        }
        System.out.printf("Total area across %d shapes: %.2f%n", shapes.length, totalArea);
    }
}`,
    output: `Circle: area=28.27, perimeter=18.85
Rectangle: area=20.00, perimeter=18.00
Square: area=36.00, perimeter=24.00
Total area across 3 shapes: 84.27`,
  },
  python: {
    code: `from abc import ABC, abstractmethod
import math


class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

    @abstractmethod
    def perimeter(self):
        pass

    def describe(self):
        return f"{type(self).__name__}: area={self.area():.2f}, perimeter={self.perimeter():.2f}"


class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2

    def perimeter(self):
        return 2 * math.pi * self.radius


class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)


class Square(Rectangle):
    def __init__(self, side):
        super().__init__(side, side)


if __name__ == "__main__":
    shapes = [Circle(3), Rectangle(4, 5), Square(6)]
    total_area = 0
    for shape in shapes:
        print(shape.describe())
        total_area += shape.area()
    print(f"Total area across {len(shapes)} shapes: {total_area:.2f}")`,
    output: `Circle: area=28.27, perimeter=18.85
Rectangle: area=20.00, perimeter=18.00
Square: area=36.00, perimeter=24.00
Total area across 3 shapes: 84.27`,
  },
  javascript: {
    code: `class Shape {
  area() { throw new Error("not implemented"); }
  perimeter() { throw new Error("not implemented"); }
  describe() {
    return \`\${this.constructor.name}: area=\${this.area().toFixed(2)}, perimeter=\${this.perimeter().toFixed(2)}\`;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  area() { return Math.PI * this.radius ** 2; }
  perimeter() { return 2 * Math.PI * this.radius; }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  area() { return this.width * this.height; }
  perimeter() { return 2 * (this.width + this.height); }
}

class Square extends Rectangle {
  constructor(side) {
    super(side, side);
  }
}

const shapes = [new Circle(3), new Rectangle(4, 5), new Square(6)];
let totalArea = 0;
for (const shape of shapes) {
  console.log(shape.describe());
  totalArea += shape.area();
}
console.log(\`Total area across \${shapes.length} shapes: \${totalArea.toFixed(2)}\`);`,
    output: `Circle: area=28.27, perimeter=18.85
Rectangle: area=20.00, perimeter=18.00
Square: area=36.00, perimeter=24.00
Total area across 3 shapes: 84.27`,
  },
  cpp: {
    code: `#include <iostream>
#include <vector>
#include <memory>
#include <cmath>
#include <iomanip>
#include <string>

class Shape {
public:
    virtual double area() const = 0;
    virtual double perimeter() const = 0;
    virtual std::string name() const = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
public:
    explicit Circle(double radius) : radius(radius) {}
    double area() const override { return M_PI * radius * radius; }
    double perimeter() const override { return 2 * M_PI * radius; }
    std::string name() const override { return "Circle"; }
private:
    double radius;
};

class Rectangle : public Shape {
public:
    Rectangle(double width, double height) : width(width), height(height) {}
    double area() const override { return width * height; }
    double perimeter() const override { return 2 * (width + height); }
    std::string name() const override { return "Rectangle"; }
protected:
    double width, height;
};

class Square : public Rectangle {
public:
    explicit Square(double side) : Rectangle(side, side) {}
    std::string name() const override { return "Square"; }
};

int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(3));
    shapes.push_back(std::make_unique<Rectangle>(4, 5));
    shapes.push_back(std::make_unique<Square>(6));

    double totalArea = 0;
    std::cout << std::fixed << std::setprecision(2);
    for (const auto& shape : shapes) {
        std::cout << shape->name() << ": area=" << shape->area()
                   << ", perimeter=" << shape->perimeter() << std::endl;
        totalArea += shape->area();
    }
    std::cout << "Total area across " << shapes.size() << " shapes: " << totalArea << std::endl;
    return 0;
}`,
    output: `Circle: area=28.27, perimeter=18.85
Rectangle: area=20.00, perimeter=18.00
Square: area=36.00, perimeter=24.00
Total area across 3 shapes: 84.27`,
  },
};

const qaItems = [
  {
    q: "What's the difference between encapsulation and abstraction?",
    a: 'Encapsulation is the mechanism: bundling data with the methods that operate on it, and restricting direct access (private fields, public methods). Abstraction is the design decision of what to expose versus hide, so callers only need to know "what" an object does, not "how." Encapsulation is how you achieve abstraction, but the two aren\'t the same thing.',
  },
  {
    q: 'What does "favor composition over inheritance" mean, and why?',
    a: "It means preferring to build behavior by holding references to other objects (composition) rather than by extending a base class (inheritance), when possible. Composition avoids the fragile base class problem, allows swapping behavior at runtime, and avoids forcing an \"is-a\" relationship onto something that's really \"has-a.\"",
  },
  {
    q: "What's the difference between compile-time and runtime polymorphism?",
    a: 'Compile-time (static) polymorphism is method overloading — the compiler picks which method to call based on argument types at compile time. Runtime (dynamic) polymorphism is method overriding — the actual method that runs is decided by the real object type at runtime, which is what enables working with a list of mixed subclasses through one shared interface.',
  },
  {
    q: "What's the fragile base class problem?",
    a: "When subclasses depend on the exact internal behavior of a parent class, a seemingly safe change to that parent can silently break every subclass relying on it — even though nothing about the subclass's own code changed. Deep or wide inheritance hierarchies make this worse the more classes depend on the same shared parent.",
  },
];

export default function OopFundamentalsPage() {
  return (
    <>
      <Header />
      <div className="layout">
        <TopicSidebar
          backHref="/pages/lld"
          backLabel="Back to LLD"
          toc={[
            { id: 'overview', label: 'Overview' },
            { id: 'plain-english', label: 'In Plain English' },
            { id: 'theory', label: 'Theory & Diagrams' },
            { id: 'trade-offs', label: 'Trade-offs' },
            { id: 'real-world', label: 'Real-World Examples' },
            { id: 'interview-questions', label: 'Interview Questions' },
            { id: 'code', label: 'Code & Output' },
          ]}
        />

        <main className="content narrow">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'LLD', href: '/pages/lld' }, { label: 'OOP Fundamentals' }]} />
          <h1 id="overview">OOP Fundamentals</h1>
          <p>
            The four ideas — encapsulation, abstraction, inheritance, and polymorphism — that every
            design pattern in this guide is ultimately built out of.
          </p>

          <section id="plain-english">
            <h2>In Plain English</h2>
            <p>Think about driving a car without knowing anything about engines.</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/lld-oop/dashboard-analogy.svg"
                alt="A driver pressing the pedal and steering wheel, which are connected to a hidden engine and wiring compartment, with captions about polymorphism (same pedal, different engines) and inheritance (SUV is-a Car is-a Vehicle)"
              />
              <figcaption>The dashboard is the interface; the engine bay is everything hidden behind it</figcaption>
            </figure>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  You never need to know how the engine works to drive — you just need the pedal and
                  the wheel to behave predictably. That&apos;s encapsulation and abstraction: hide the
                  complicated part, expose a small, simple interface.
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  The interesting part is that the same pedal works whether the engine burns gas or
                  draws from a battery — that&apos;s polymorphism. And an SUV reusing everything a Car
                  already defines, while adding its own extras, is inheritance.
                </p>
              </Callout>
            </TwoCol>
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>

            <h3>The four pillars</h3>
            <p>
              Object-oriented programming organizes code around objects — bundles of data and the
              behavior that acts on that data — rather than around a sequence of standalone functions.
              Four ideas make that useful in practice.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/lld-oop/four-pillars.svg"
                alt="Four boxes: Encapsulation (bundle data with methods, hide internals), Abstraction (expose only what a caller needs), Inheritance (reuse and extend a parent class), Polymorphism (the same call behaves differently depending on the object)"
              />
              <figcaption>Every design pattern in this guide is built from some combination of these four ideas</figcaption>
            </figure>

            <h3>Encapsulation vs. abstraction</h3>
            <p>
              These two get conflated constantly. Encapsulation is a mechanism — bundling data with
              the methods that touch it, and restricting direct access to that data. Abstraction is a
              design goal — deciding what to expose and what to hide, so a caller only ever has to
              think about the &quot;what,&quot; never the &quot;how.&quot;
            </p>

            <h3>Inheritance and the fragile base class problem</h3>
            <p>
              A subclass reuses a parent&apos;s fields and methods and can override or extend them.
              That reuse is powerful, but it also means a change to the parent can silently break
              every subclass depending on its exact behavior — the deeper and wider the hierarchy, the
              more fragile it gets.
            </p>

            <h3>Polymorphism</h3>
            <p>
              Calling <code>shape.area()</code> on a variable typed as the base class{' '}
              <code>Shape</code> runs <code>Circle</code>&apos;s implementation,{' '}
              <code>Rectangle</code>&apos;s implementation, or whichever subclass the object actually
              is — decided at runtime, not at compile time. This is what lets code work with a list of
              mixed shapes without a single <code>if/else</code> chain checking types.
            </p>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Favor inheritance when">
                <ul>
                  <li>There&apos;s a genuine, stable &quot;is-a&quot; relationship (a Square really is a Rectangle with equal sides).</li>
                  <li>Subclasses are expected to share and rarely override the parent&apos;s core behavior.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Favor composition when">
                <ul>
                  <li>The relationship is really &quot;has-a&quot; or &quot;can-do,&quot; not &quot;is-a&quot; (a Car has-an Engine, it isn&apos;t one).</li>
                  <li>You need to swap behavior at runtime, or the hierarchy would otherwise need multiple inheritance.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> a precise distinction between
              encapsulation and abstraction (not &quot;they&apos;re basically the same thing&quot;),
              and knowing the &quot;favor composition over inheritance&quot; principle by name along
              with a concrete example of when a hierarchy became a liability.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to define all four pillars in one
              sentence each, with a simple example per pillar, covers what most early interviews check
              for.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to describe a real inheritance
              hierarchy you&apos;ve worked with that became painful to change, and what
              composition-based fix you&apos;d reach for instead.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>GUI frameworks</strong> (Swing, WPF, UIKit) — every widget inherits from a common base (like <code>View</code> or <code>Component</code>), and rendering code calls the same <code>draw()</code> method polymorphically across wildly different widget types.</li>
              <li><strong>ORMs</strong> (Hibernate, SQLAlchemy, Entity Framework) — model classes encapsulate both the data and the logic to load/save it, abstracting the caller away from raw SQL.</li>
              <li><strong>Game engines</strong> — a generic <code>GameObject</code> base class with subclasses like <code>Player</code>, <code>Enemy</code>, and <code>Projectile</code>, all updated through the same polymorphic <code>update()</code> call each frame.</li>
              <li><strong>Standard library collections</strong> (Java&apos;s <code>List</code>, Python&apos;s iterables) — abstraction lets code iterate any collection type through one shared interface, without caring whether it&apos;s an array, linked list, or set underneath.</li>
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
              A real class hierarchy — an abstract <code>Shape</code> with <code>Circle</code>,{' '}
              <code>Rectangle</code>, and <code>Square</code> (which inherits from{' '}
              <code>Rectangle</code>) — computing genuine area and perimeter for each, then summing
              the total across a mixed list purely through polymorphic calls. The math is real, so
              unlike some of the timing-based examples elsewhere in this guide, the output below is
              identical every time you run it, in every language.
            </p>
            <CodeTerminal
              snippets={snippets}
              note="Verified by hand: Circle(r=3) area = π×9 ≈ 28.27; Rectangle(4,5) area = 20.00; Square(6) as a Rectangle(6,6) area = 36.00; total = 84.27."
            />
          </section>

          <PageNav
            prev={{ label: 'Home', href: '/' }}
            next={{ label: 'SOLID Principles', href: '/pages/lld/solid-principles' }}
          />
        </main>
      </div>

      <Footer
        sectionColumn={{
          title: 'LLD',
          links: [
            { label: 'OOP Fundamentals', href: '/pages/lld/oop-fundamentals' },
            { label: 'SOLID Principles', href: '/pages/lld/solid-principles' },
            { label: 'LLD Capstones', href: '/pages/lld/capstones' },
          ],
        }}
      />
    </>
  );
}
