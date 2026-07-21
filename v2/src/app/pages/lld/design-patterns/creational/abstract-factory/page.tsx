import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Abstract Factory Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `interface Button {
    void render();
}

interface Checkbox {
    void render();
}

class WindowsButton implements Button {
    public void render() { System.out.println("Rendering a Windows-style button."); }
}

class WindowsCheckbox implements Checkbox {
    public void render() { System.out.println("Rendering a Windows-style checkbox."); }
}

class MacButton implements Button {
    public void render() { System.out.println("Rendering a Mac-style button."); }
}

class MacCheckbox implements Checkbox {
    public void render() { System.out.println("Rendering a Mac-style checkbox."); }
}

interface UIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

class WindowsFactory implements UIFactory {
    public Button createButton() { return new WindowsButton(); }
    public Checkbox createCheckbox() { return new WindowsCheckbox(); }
}

class MacFactory implements UIFactory {
    public Button createButton() { return new MacButton(); }
    public Checkbox createCheckbox() { return new MacCheckbox(); }
}

public class AbstractFactory {
    static void renderUI(UIFactory factory) {
        Button button = factory.createButton();
        Checkbox checkbox = factory.createCheckbox();
        button.render();
        checkbox.render();
    }

    public static void main(String[] args) {
        System.out.println("-- Windows family --");
        renderUI(new WindowsFactory());

        System.out.println("-- Mac family --");
        renderUI(new MacFactory());
    }
}`,
    output: `-- Windows family --
Rendering a Windows-style button.
Rendering a Windows-style checkbox.
-- Mac family --
Rendering a Mac-style button.
Rendering a Mac-style checkbox.`,
  },
  python: {
    code: `from abc import ABC, abstractmethod


class Button(ABC):
    @abstractmethod
    def render(self):
        ...


class Checkbox(ABC):
    @abstractmethod
    def render(self):
        ...


class WindowsButton(Button):
    def render(self):
        print("Rendering a Windows-style button.")


class WindowsCheckbox(Checkbox):
    def render(self):
        print("Rendering a Windows-style checkbox.")


class MacButton(Button):
    def render(self):
        print("Rendering a Mac-style button.")


class MacCheckbox(Checkbox):
    def render(self):
        print("Rendering a Mac-style checkbox.")


class UIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button:
        ...

    @abstractmethod
    def create_checkbox(self) -> Checkbox:
        ...


class WindowsFactory(UIFactory):
    def create_button(self) -> Button:
        return WindowsButton()

    def create_checkbox(self) -> Checkbox:
        return WindowsCheckbox()


class MacFactory(UIFactory):
    def create_button(self) -> Button:
        return MacButton()

    def create_checkbox(self) -> Checkbox:
        return MacCheckbox()


def render_ui(factory: UIFactory):
    button = factory.create_button()
    checkbox = factory.create_checkbox()
    button.render()
    checkbox.render()


if __name__ == "__main__":
    print("-- Windows family --")
    render_ui(WindowsFactory())

    print("-- Mac family --")
    render_ui(MacFactory())`,
    output: `-- Windows family --
Rendering a Windows-style button.
Rendering a Windows-style checkbox.
-- Mac family --
Rendering a Mac-style button.
Rendering a Mac-style checkbox.`,
  },
  javascript: {
    code: `class WindowsButton {
  render() { console.log("Rendering a Windows-style button."); }
}
class WindowsCheckbox {
  render() { console.log("Rendering a Windows-style checkbox."); }
}
class MacButton {
  render() { console.log("Rendering a Mac-style button."); }
}
class MacCheckbox {
  render() { console.log("Rendering a Mac-style checkbox."); }
}

class WindowsFactory {
  createButton() { return new WindowsButton(); }
  createCheckbox() { return new WindowsCheckbox(); }
}

class MacFactory {
  createButton() { return new MacButton(); }
  createCheckbox() { return new MacCheckbox(); }
}

function renderUI(factory) {
  const button = factory.createButton();
  const checkbox = factory.createCheckbox();
  button.render();
  checkbox.render();
}

console.log("-- Windows family --");
renderUI(new WindowsFactory());

console.log("-- Mac family --");
renderUI(new MacFactory());

module.exports = { WindowsFactory, MacFactory };`,
    output: `-- Windows family --
Rendering a Windows-style button.
Rendering a Windows-style checkbox.
-- Mac family --
Rendering a Mac-style button.
Rendering a Mac-style checkbox.`,
  },
  cpp: {
    code: `#include <iostream>
#include <memory>

class Button {
public:
    virtual void render() = 0;
    virtual ~Button() = default;
};

class Checkbox {
public:
    virtual void render() = 0;
    virtual ~Checkbox() = default;
};

class WindowsButton : public Button {
public:
    void render() override { std::cout << "Rendering a Windows-style button." << std::endl; }
};
class WindowsCheckbox : public Checkbox {
public:
    void render() override { std::cout << "Rendering a Windows-style checkbox." << std::endl; }
};
class MacButton : public Button {
public:
    void render() override { std::cout << "Rendering a Mac-style button." << std::endl; }
};
class MacCheckbox : public Checkbox {
public:
    void render() override { std::cout << "Rendering a Mac-style checkbox." << std::endl; }
};

class UIFactory {
public:
    virtual std::unique_ptr<Button> createButton() = 0;
    virtual std::unique_ptr<Checkbox> createCheckbox() = 0;
    virtual ~UIFactory() = default;
};

class WindowsFactory : public UIFactory {
public:
    std::unique_ptr<Button> createButton() override { return std::make_unique<WindowsButton>(); }
    std::unique_ptr<Checkbox> createCheckbox() override { return std::make_unique<WindowsCheckbox>(); }
};

class MacFactory : public UIFactory {
public:
    std::unique_ptr<Button> createButton() override { return std::make_unique<MacButton>(); }
    std::unique_ptr<Checkbox> createCheckbox() override { return std::make_unique<MacCheckbox>(); }
};

void renderUI(UIFactory& factory) {
    auto button = factory.createButton();
    auto checkbox = factory.createCheckbox();
    button->render();
    checkbox->render();
}

int main() {
    std::cout << "-- Windows family --" << std::endl;
    WindowsFactory windowsFactory;
    renderUI(windowsFactory);

    std::cout << "-- Mac family --" << std::endl;
    MacFactory macFactory;
    renderUI(macFactory);

    return 0;
}`,
    output: `-- Windows family --
Rendering a Windows-style button.
Rendering a Windows-style checkbox.
-- Mac family --
Rendering a Mac-style button.
Rendering a Mac-style checkbox.`,
  },
};

const qaItems = [
  {
    q: "What's the core difference between Abstract Factory and Factory Method?",
    a: 'Factory Method produces one product via one overridden creation method. Abstract Factory produces a whole family of related products via multiple creation methods bundled into one factory interface, guaranteeing the products handed out are mutually compatible.',
  },
  {
    q: 'How would you add a new product type (e.g., a Slider) to an existing setup?',
    a: 'Add createSlider() to the AbstractFactory interface, then implement it in every existing concrete factory. This is the known trade-off — the interface change ripples to every concrete factory, the cost of the consistency guarantee.',
  },
  {
    q: 'How would you add an entirely new family (e.g., a LinuxFactory) instead?',
    a: "That's the case this pattern is optimized for: implement the existing AbstractFactory interface once in a new LinuxFactory class. No existing factories or client code need to change — only a new class is added.",
  },
  {
    q: 'Can Abstract Factory be implemented without classical inheritance?',
    a: "Yes — a factory can be an object holding function references, or a simple struct of factory functions, rather than a class implementing an interface. The core idea — one bundle of related creation logic, swappable as a whole — doesn't require inheritance to work.",
  },
];

export default function AbstractFactoryPage() {
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
              { label: 'Abstract Factory' },
            ]}
          />
          <h1 id="overview">Abstract Factory Pattern</h1>
          <p>
            Produces families of related objects without specifying their concrete classes —
            guaranteeing everything created together stays compatible.
          </p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>
              You&apos;re building a cross-platform UI toolkit. On Windows, buttons and checkboxes
              need to look like Windows controls; on macOS, like Mac controls. The one thing you
              cannot allow: a Windows-style button next to a Mac-style checkbox in the same window.
              The controls have to come from the same family.
            </p>
            <p>
              Factory Method solves &quot;which class do I instantiate&quot; for one product.
              Abstract Factory solves it for a whole family of related products that need to stay
              consistent. You get one factory per family, and every product it hands out matches
              that family automatically — it&apos;s physically impossible to ask the{' '}
              <code>WindowsFactory</code> for a Mac checkbox.
            </p>

            <h3>How it's built</h3>
            <p>
              An <code>AbstractFactory</code> interface declares one creation method per product in
              the family — <code>createButton()</code>, <code>createCheckbox()</code>. Each{' '}
              <code>ConcreteFactory</code> implements all of those, each returning the
              family-appropriate product. Client code takes in one factory instance at startup and
              only ever calls methods on that factory — it never touches a concrete class name.
            </p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>
                  Choose the concrete factory once (at startup, based on OS/theme/config) and pass
                  that single instance through the rest of the app — don&apos;t re-decide which
                  factory to use scattered across the codebase.
                </p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>
                  Confusing this with Factory Method. If your &quot;family&quot; only has one
                  product, or nothing bad happens when you mix products from different sources,
                  you&apos;re not actually using Abstract Factory&apos;s core guarantee.
                </p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>
              Adding a new product to the family (say, a <code>createSlider()</code>) means
              updating the <code>AbstractFactory</code> interface <em>and</em> every concrete
              factory that implements it. That ripple effect is the price of the consistency
              guarantee. If the family only has one product, or cross-product consistency
              isn&apos;t actually a concern, this adds structure you don&apos;t need.
            </p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/abstract-factory/class-diagram.svg"
                alt="Abstract Factory class diagram showing UIFactory interface implemented by WindowsFactory and MacFactory, each producing a matching family of Button and Checkbox products"
              />
              <figcaption>Each concrete factory produces its whole family, never a mixed set</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>Your app creates families of related objects, and mixing across families would cause real bugs or inconsistency.</li>
                  <li>You want to swap an entire family of implementations by changing one thing — which factory instance you hold.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>You only have one product type — that&apos;s plain Factory Method.</li>
                  <li>The family keeps changing shape — every new product means editing the interface and every concrete factory.</li>
                </ul>
              </Callout>
            </TwoCol>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Cross-platform GUI toolkits</strong> (Java Swing look-and-feel, Qt) — one factory produces an entire family of native-looking widgets consistent with the OS/theme.</li>
              <li><strong>JDBC / database driver abstraction</strong> — switching vendors swaps a whole family of related objects (Connection, Statement, ResultSet) behind one interface.</li>
              <li><strong>Theming engines</strong> — a dark-theme factory and a light-theme factory each produce a consistent family of styled components.</li>
              <li><strong>Document format exporters</strong> — an OOXML factory vs. an OpenDocument factory, each producing document/paragraph/table objects that serialize correctly together.</li>
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
            prev={{ label: 'Factory Method', href: '/pages/lld/design-patterns/creational/factory-method' }}
            next={{ label: 'Builder', href: '/pages/lld/design-patterns/creational/builder' }}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
