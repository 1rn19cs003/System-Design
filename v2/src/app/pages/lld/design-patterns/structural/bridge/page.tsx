import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Bridge Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `interface Renderer {
    void renderCircle(float radius);
    void renderSquare(float side);
}

class OpenGLRenderer implements Renderer {
    public void renderCircle(float radius) {
        System.out.println("[OpenGL] drawing circle, radius=" + radius);
    }
    public void renderSquare(float side) {
        System.out.println("[OpenGL] drawing square, side=" + side);
    }
}

class DirectXRenderer implements Renderer {
    public void renderCircle(float radius) {
        System.out.println("[DirectX] drawing circle, radius=" + radius);
    }
    public void renderSquare(float side) {
        System.out.println("[DirectX] drawing square, side=" + side);
    }
}

abstract class Shape {
    protected Renderer renderer;

    Shape(Renderer renderer) {
        this.renderer = renderer;
    }

    abstract void draw();
}

class Circle extends Shape {
    private float radius;

    Circle(Renderer renderer, float radius) {
        super(renderer);
        this.radius = radius;
    }

    void draw() {
        renderer.renderCircle(radius);
    }
}

class Square extends Shape {
    private float side;

    Square(Renderer renderer, float side) {
        super(renderer);
        this.side = side;
    }

    void draw() {
        renderer.renderSquare(side);
    }
}

public class Bridge {
    public static void main(String[] args) {
        Shape openGLCircle = new Circle(new OpenGLRenderer(), 5.0f);
        Shape directXSquare = new Square(new DirectXRenderer(), 3.0f);

        openGLCircle.draw();
        directXSquare.draw();
    }
}`,
    output: `[OpenGL] drawing circle, radius=5.0
[DirectX] drawing square, side=3.0`,
  },
  python: {
    code: `from abc import ABC, abstractmethod


class Renderer(ABC):
    @abstractmethod
    def render_circle(self, radius):
        ...

    @abstractmethod
    def render_square(self, side):
        ...


class OpenGLRenderer(Renderer):
    def render_circle(self, radius):
        print(f"[OpenGL] drawing circle, radius={radius}")

    def render_square(self, side):
        print(f"[OpenGL] drawing square, side={side}")


class DirectXRenderer(Renderer):
    def render_circle(self, radius):
        print(f"[DirectX] drawing circle, radius={radius}")

    def render_square(self, side):
        print(f"[DirectX] drawing square, side={side}")


class Shape(ABC):
    def __init__(self, renderer: Renderer):
        self.renderer = renderer

    @abstractmethod
    def draw(self):
        ...


class Circle(Shape):
    def __init__(self, renderer, radius):
        super().__init__(renderer)
        self.radius = radius

    def draw(self):
        self.renderer.render_circle(self.radius)


class Square(Shape):
    def __init__(self, renderer, side):
        super().__init__(renderer)
        self.side = side

    def draw(self):
        self.renderer.render_square(self.side)


if __name__ == "__main__":
    opengl_circle = Circle(OpenGLRenderer(), 5.0)
    directx_square = Square(DirectXRenderer(), 3.0)

    opengl_circle.draw()
    directx_square.draw()`,
    output: `[OpenGL] drawing circle, radius=5.0
[DirectX] drawing square, side=3.0`,
  },
  javascript: {
    code: `class OpenGLRenderer {
  renderCircle(radius) {
    console.log(\`[OpenGL] drawing circle, radius=\${radius}\`);
  }
  renderSquare(side) {
    console.log(\`[OpenGL] drawing square, side=\${side}\`);
  }
}

class DirectXRenderer {
  renderCircle(radius) {
    console.log(\`[DirectX] drawing circle, radius=\${radius}\`);
  }
  renderSquare(side) {
    console.log(\`[DirectX] drawing square, side=\${side}\`);
  }
}

class Shape {
  constructor(renderer) {
    this.renderer = renderer;
  }
}

class Circle extends Shape {
  constructor(renderer, radius) {
    super(renderer);
    this.radius = radius;
  }
  draw() {
    this.renderer.renderCircle(this.radius);
  }
}

class Square extends Shape {
  constructor(renderer, side) {
    super(renderer);
    this.side = side;
  }
  draw() {
    this.renderer.renderSquare(this.side);
  }
}

const openGLCircle = new Circle(new OpenGLRenderer(), 5.0);
const directXSquare = new Square(new DirectXRenderer(), 3.0);

openGLCircle.draw();
directXSquare.draw();

module.exports = { Circle, Square, OpenGLRenderer, DirectXRenderer };`,
    output: `[OpenGL] drawing circle, radius=5
[DirectX] drawing square, side=3`,
  },
  cpp: {
    code: `#include <iostream>
#include <memory>

class Renderer {
public:
    virtual void renderCircle(float radius) = 0;
    virtual void renderSquare(float side) = 0;
    virtual ~Renderer() = default;
};

class OpenGLRenderer : public Renderer {
public:
    void renderCircle(float radius) override {
        std::cout << "[OpenGL] drawing circle, radius=" << radius << std::endl;
    }
    void renderSquare(float side) override {
        std::cout << "[OpenGL] drawing square, side=" << side << std::endl;
    }
};

class DirectXRenderer : public Renderer {
public:
    void renderCircle(float radius) override {
        std::cout << "[DirectX] drawing circle, radius=" << radius << std::endl;
    }
    void renderSquare(float side) override {
        std::cout << "[DirectX] drawing square, side=" << side << std::endl;
    }
};

class Shape {
public:
    explicit Shape(Renderer& renderer) : renderer_(renderer) {}
    virtual void draw() = 0;
    virtual ~Shape() = default;

protected:
    Renderer& renderer_;
};

class Circle : public Shape {
public:
    Circle(Renderer& renderer, float radius) : Shape(renderer), radius_(radius) {}
    void draw() override { renderer_.renderCircle(radius_); }

private:
    float radius_;
};

class Square : public Shape {
public:
    Square(Renderer& renderer, float side) : Shape(renderer), side_(side) {}
    void draw() override { renderer_.renderSquare(side_); }

private:
    float side_;
};

int main() {
    OpenGLRenderer openGL;
    DirectXRenderer directX;

    Circle openGLCircle(openGL, 5.0f);
    Square directXSquare(directX, 3.0f);

    openGLCircle.draw();
    directXSquare.draw();

    return 0;
}`,
    output: `[OpenGL] drawing circle, radius=5
[DirectX] drawing square, side=3`,
  },
};

const qaItems = [
  {
    q: "What specific problem does Bridge solve that plain inheritance doesn't?",
    a: 'Class explosion from two independent dimensions of variation. If shapes and renderers each vary independently and you model them with one inheritance tree, you need one class per combination. Bridge splits them into two hierarchies connected by composition, so you need one class per shape plus one per renderer — addition instead of multiplication.',
  },
  {
    q: 'How is Bridge different from Adapter, given both delegate to another object?',
    a: "Timing and intent. Adapter is retrofitted after the fact to make an existing, incompatible interface work. Bridge is designed in from the start, specifically so two hierarchies can vary independently — there's no pre-existing incompatibility being worked around.",
  },
  {
    q: 'Can the implementor side of a Bridge be swapped at runtime?',
    a: 'Yes — since the abstraction holds a reference to the implementor via composition, not inheritance, you can swap in a different concrete implementor object at runtime, not just at compile time via a fixed class hierarchy.',
  },
  {
    q: 'Give a concrete example of when NOT to use Bridge.',
    a: 'If you have exactly one shape type and one rendering engine with no realistic plan to add more, splitting into two hierarchies adds indirection for no payoff — a single concrete class is simpler and just as correct. Bridge earns its complexity specifically when both dimensions are expected to grow.',
  },
];

export default function BridgePage() {
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
              { label: 'Bridge' },
            ]}
          />
          <h1 id="overview">Bridge Pattern</h1>
          <p>
            Decouples an abstraction from its implementation so the two can vary independently,
            instead of exploding into one class per combination.
          </p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>
              You&apos;re building <code>Shape</code> classes — <code>Circle</code>,{' '}
              <code>Square</code> — each needing to render using different graphics APIs —{' '}
              <code>OpenGL</code>, <code>DirectX</code>. Do this with inheritance and you get{' '}
              <code>OpenGLCircle</code>, <code>DirectXCircle</code>, <code>OpenGLSquare</code>,{' '}
              <code>DirectXSquare</code> — a class per combination. Add a third renderer or shape,
              and the count multiplies again.
            </p>
            <p>
              Bridge splits the two dimensions into two hierarchies connected by composition
              instead of inheritance. A <code>Shape</code> holds a reference to a{' '}
              <code>Renderer</code> and delegates the drawing work to it. Adding a shape means one
              new class; adding a renderer means one new class — addition, not multiplication.
            </p>

            <h3>How it's built</h3>
            <p>
              Two hierarchies: the <strong>abstraction</strong> (<code>Shape</code>, with
              subclasses like <code>Circle</code>) holds a reference to an{' '}
              <strong>implementor</strong> interface (<code>Renderer</code>, with implementations
              like <code>OpenGLRenderer</code>). The abstraction&apos;s methods call through to the
              implementor rather than implementing low-level details itself. Both sides can be
              extended independently.
            </p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>
                  Reach for Bridge specifically when you can name two independent dimensions that
                  both need to grow — not just because &quot;an object holds another object&quot;
                  looks similar to the diagram.
                </p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>
                  Confusing this with Adapter. Bridge is designed in upfront to prevent class
                  explosion; Adapter is retrofitted after the fact to fix an existing
                  incompatibility. Same shape of diagram, different intent and timing.
                </p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>
              Bridge adds indirection and two hierarchies where a single class might have
              sufficed. If you only ever have one implementor with no real plan to add more, the
              split is unnecessary complexity — it earns its keep specifically when both
              dimensions are genuinely expected to grow independently.
            </p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/bridge/class-diagram.svg"
                alt="Bridge pattern class diagram showing Shape abstraction (Circle, Square) connected via composition to a Renderer implementor interface (OpenGLRenderer, DirectXRenderer)"
              />
              <figcaption>Two hierarchies, connected by composition — each grows independently</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>Two independent dimensions of variation exist and inheritance would force a class per combination.</li>
                  <li>You want to add new variants on either side without touching the other.</li>
                  <li>You need to swap the implementation at runtime, not just at compile time.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>There&apos;s really only one dimension, or the second isn&apos;t genuinely expected to grow.</li>
                  <li>The combination count is small and stable — plain inheritance may be simpler to read.</li>
                </ul>
              </Callout>
            </TwoCol>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>JDBC</strong> — application code talks to the generic API while vendors provide different driver implementations; swapping databases doesn&apos;t mean rewriting app code.</li>
              <li><strong>Java AWT/Swing&apos;s peer architecture</strong> — UI components bridged to platform-specific &quot;peer&quot; implementations doing native rendering per OS.</li>
              <li><strong>Device / Remote Control examples</strong> — a RemoteControl works with any Device (TV, radio) without a new remote class per device.</li>
              <li><strong>SLF4J</strong> — the logging API is decoupled from which engine (Logback, Log4j2) actually writes output.</li>
              <li><strong>Rendering engines</strong> — a shape/scene graph API bridged to different rendering backends without duplicating shape logic per backend.</li>
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
            prev={{ label: 'Adapter', href: '/pages/lld/design-patterns/structural/adapter' }}
            next={{ label: 'Composite', href: '/pages/lld/design-patterns/structural/composite' }}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
