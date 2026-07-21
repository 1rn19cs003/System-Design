import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Builder Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `class Computer {
    private final String cpu;
    private final int ramGB;
    private final int storageGB;
    private final boolean hasGPU;

    private Computer(ComputerBuilder builder) {
        this.cpu = builder.cpu;
        this.ramGB = builder.ramGB;
        this.storageGB = builder.storageGB;
        this.hasGPU = builder.hasGPU;
    }

    public String toString() {
        return "Computer{cpu=" + cpu + ", ramGB=" + ramGB +
               ", storageGB=" + storageGB + ", hasGPU=" + hasGPU + "}";
    }

    static class ComputerBuilder {
        private String cpu;
        private int ramGB;
        private int storageGB;
        private boolean hasGPU = false;

        ComputerBuilder setCPU(String cpu) {
            this.cpu = cpu;
            return this;
        }

        ComputerBuilder setRAM(int ramGB) {
            this.ramGB = ramGB;
            return this;
        }

        ComputerBuilder setStorage(int storageGB) {
            this.storageGB = storageGB;
            return this;
        }

        ComputerBuilder addGPU() {
            this.hasGPU = true;
            return this;
        }

        Computer build() {
            return new Computer(this);
        }
    }
}

public class Builder {
    public static void main(String[] args) {
        Computer officePC = new Computer.ComputerBuilder()
                .setCPU("Intel i5")
                .setRAM(16)
                .setStorage(512)
                .build();

        Computer gamingPC = new Computer.ComputerBuilder()
                .setCPU("Intel i9")
                .setRAM(32)
                .setStorage(2000)
                .addGPU()
                .build();

        System.out.println(officePC);
        System.out.println(gamingPC);
    }
}`,
    output: `Computer{cpu=Intel i5, ramGB=16, storageGB=512, hasGPU=false}
Computer{cpu=Intel i9, ramGB=32, storageGB=2000, hasGPU=true}`,
  },
  python: {
    code: `class Computer:
    def __init__(self, cpu, ram_gb, storage_gb, has_gpu):
        self.cpu = cpu
        self.ram_gb = ram_gb
        self.storage_gb = storage_gb
        self.has_gpu = has_gpu

    def __repr__(self):
        return (f"Computer(cpu={self.cpu}, ram_gb={self.ram_gb}, "
                f"storage_gb={self.storage_gb}, has_gpu={self.has_gpu})")


class ComputerBuilder:
    def __init__(self):
        self._cpu = None
        self._ram_gb = 0
        self._storage_gb = 0
        self._has_gpu = False

    def set_cpu(self, cpu):
        self._cpu = cpu
        return self

    def set_ram(self, ram_gb):
        self._ram_gb = ram_gb
        return self

    def set_storage(self, storage_gb):
        self._storage_gb = storage_gb
        return self

    def add_gpu(self):
        self._has_gpu = True
        return self

    def build(self):
        return Computer(self._cpu, self._ram_gb, self._storage_gb, self._has_gpu)


if __name__ == "__main__":
    office_pc = (ComputerBuilder()
                 .set_cpu("Intel i5")
                 .set_ram(16)
                 .set_storage(512)
                 .build())

    gaming_pc = (ComputerBuilder()
                 .set_cpu("Intel i9")
                 .set_ram(32)
                 .set_storage(2000)
                 .add_gpu()
                 .build())

    print(office_pc)
    print(gaming_pc)`,
    output: `Computer(cpu=Intel i5, ram_gb=16, storage_gb=512, has_gpu=False)
Computer(cpu=Intel i9, ram_gb=32, storage_gb=2000, has_gpu=True)`,
  },
  javascript: {
    code: `class Computer {
  constructor({ cpu, ramGB, storageGB, hasGPU }) {
    this.cpu = cpu;
    this.ramGB = ramGB;
    this.storageGB = storageGB;
    this.hasGPU = hasGPU;
  }

  toString() {
    return \`Computer{cpu=\${this.cpu}, ramGB=\${this.ramGB}, storageGB=\${this.storageGB}, hasGPU=\${this.hasGPU}}\`;
  }
}

class ComputerBuilder {
  constructor() {
    this._cpu = null;
    this._ramGB = 0;
    this._storageGB = 0;
    this._hasGPU = false;
  }

  setCPU(cpu) {
    this._cpu = cpu;
    return this;
  }

  setRAM(ramGB) {
    this._ramGB = ramGB;
    return this;
  }

  setStorage(storageGB) {
    this._storageGB = storageGB;
    return this;
  }

  addGPU() {
    this._hasGPU = true;
    return this;
  }

  build() {
    return new Computer({
      cpu: this._cpu,
      ramGB: this._ramGB,
      storageGB: this._storageGB,
      hasGPU: this._hasGPU,
    });
  }
}

const officePC = new ComputerBuilder()
  .setCPU("Intel i5")
  .setRAM(16)
  .setStorage(512)
  .build();

const gamingPC = new ComputerBuilder()
  .setCPU("Intel i9")
  .setRAM(32)
  .setStorage(2000)
  .addGPU()
  .build();

console.log(officePC.toString());
console.log(gamingPC.toString());

module.exports = { Computer, ComputerBuilder };`,
    output: `Computer{cpu=Intel i5, ramGB=16, storageGB=512, hasGPU=false}
Computer{cpu=Intel i9, ramGB=32, storageGB=2000, hasGPU=true}`,
  },
  cpp: {
    code: `#include <iostream>
#include <string>

class Computer {
public:
    std::string cpu;
    int ramGB;
    int storageGB;
    bool hasGPU;

    Computer(std::string cpu, int ramGB, int storageGB, bool hasGPU)
        : cpu(std::move(cpu)), ramGB(ramGB), storageGB(storageGB), hasGPU(hasGPU) {}

    void print() const {
        std::cout << "Computer{cpu=" << cpu << ", ramGB=" << ramGB
                   << ", storageGB=" << storageGB
                   << ", hasGPU=" << (hasGPU ? "true" : "false") << "}" << std::endl;
    }
};

class ComputerBuilder {
public:
    ComputerBuilder& setCPU(const std::string& cpu) {
        cpu_ = cpu;
        return *this;
    }

    ComputerBuilder& setRAM(int ramGB) {
        ramGB_ = ramGB;
        return *this;
    }

    ComputerBuilder& setStorage(int storageGB) {
        storageGB_ = storageGB;
        return *this;
    }

    ComputerBuilder& addGPU() {
        hasGPU_ = true;
        return *this;
    }

    Computer build() const {
        return Computer(cpu_, ramGB_, storageGB_, hasGPU_);
    }

private:
    std::string cpu_;
    int ramGB_ = 0;
    int storageGB_ = 0;
    bool hasGPU_ = false;
};

int main() {
    Computer officePC = ComputerBuilder()
        .setCPU("Intel i5")
        .setRAM(16)
        .setStorage(512)
        .build();

    Computer gamingPC = ComputerBuilder()
        .setCPU("Intel i9")
        .setRAM(32)
        .setStorage(2000)
        .addGPU()
        .build();

    officePC.print();
    gamingPC.print();

    return 0;
}`,
    output: `Computer{cpu=Intel i5, ramGB=16, storageGB=512, hasGPU=false}
Computer{cpu=Intel i9, ramGB=32, storageGB=2000, hasGPU=true}`,
  },
};

const qaItems = [
  {
    q: 'Why not just give the constructor default parameter values instead of a Builder?',
    a: 'In languages with named/default parameters, that works fine for simple cases. Builder earns its place when there\'s real validation logic between steps, when the product must be genuinely immutable and never observable in a partially-built state, or when the number of optional fields makes even named parameters hard to read at the call site.',
  },
  {
    q: "What's the role of a Director, and is it required?",
    a: 'The Director encapsulates common construction recipes — fixed sequences of builder calls, like "build a gaming PC." It\'s optional; many real-world fluent builders skip it entirely and let the caller call steps directly. Use a Director when the same configurations get built repeatedly and it\'s worth naming them.',
  },
  {
    q: 'How do you make the built object actually immutable?',
    a: "The Builder itself is mutable — it's tracking in-progress state — but .build() should construct the final product's fields once, typically via a constructor taking the builder's accumulated values, and that product class should expose no setters afterward, only getters.",
  },
  {
    q: 'How does Builder differ from Factory Method for constructing complex objects?',
    a: 'Factory Method is about which class gets instantiated (polymorphism over types). Builder is about how a single, often complex, object gets assembled step by step. They can be combined — a factory could return different builders depending on context — but they solve different problems.',
  },
];

export default function BuilderPage() {
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
              { label: 'Builder' },
            ]}
          />
          <h1 id="overview">Builder Pattern</h1>
          <p>
            Separates the construction of a complex object from its representation, so the same
            construction process can build different configurations, step by step.
          </p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>
              You need to construct a <code>Computer</code> that can have a CPU, RAM, storage, an
              optional GPU, optional cooler, optional RGB lighting, and so on. A constructor taking
              every combination either explodes into ten overloads, or one constructor with eight
              parameters where callers have to remember the order and pass{' '}
              <code>null</code>/<code>false</code> for the ones they don&apos;t want.
            </p>
            <p>
              Builder pulls construction into its own object with named steps:{' '}
              <code>.setCPU(...).setRAM(...).addGPU(...).build()</code>. Each step is
              self-explanatory, optional steps are just steps you skip, and the object stays
              immutable and fully valid once <code>.build()</code> returns it.
            </p>

            <h3>How it's built</h3>
            <p>
              A <code>Builder</code> exposes chainable setter-style methods, each returning{' '}
              <code>this</code> so calls can be strung together — often called a &quot;fluent&quot;
              builder. A final <code>.build()</code> assembles everything into the actual product
              and returns it. For genuinely complex products, a <code>Director</code> can
              encapsulate common recipes — &quot;build me a gaming PC&quot; — while the Builder
              itself stays generic.
            </p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>
                  Keep the product immutable — the Builder tracks in-progress state, but the final
                  object it hands back via <code>.build()</code> should expose no setters
                  afterward.
                </p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>
                  Reaching for a Builder on a 2-field class. If there&apos;s no real optionality or
                  validation between steps, a plain constructor communicates the same thing with
                  far less code.
                </p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>
              It&apos;s another class (sometimes two, with a Director) to maintain for what might
              be a simple object. Builder pays off specifically when the parameter list is long,
              mostly optional, and readability/immutability actually matter — not by default.
            </p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/builder/class-diagram.svg"
                alt="Builder pattern class diagram showing ComputerBuilder with chainable setCPU, setRAM, setStorage, addGPU methods and a build method that produces an immutable Computer object"
              />
              <figcaption>Chainable setters, immutable product from build()</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>An object has many mostly-optional fields, and a constructor would need overloads or a long, error-prone parameter list.</li>
                  <li>The object should be immutable once constructed.</li>
                  <li>Naming common configurations (via a Director) is genuinely useful.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>The object has two or three fields with no optional combinations.</li>
                  <li>Your language has named/default parameters and there&apos;s no real validation or ordering logic.</li>
                </ul>
              </Callout>
            </TwoCol>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Java&apos;s <code>StringBuilder</code></strong> — named after this pattern; chains <code>.append()</code> calls, produces the result via <code>.toString()</code>.</li>
              <li><strong>OkHttp&apos;s <code>Request.Builder</code></strong> — HTTP requests have many optional pieces (headers, body, timeouts) assembled fluently before <code>.build()</code>.</li>
              <li><strong>Lombok&apos;s <code>@Builder</code></strong> — generates a fluent builder class from a plain data class, because the pattern is common enough to warrant codegen.</li>
              <li><strong>Protocol Buffers&apos; generated <code>Builder</code> classes</strong> — every message type gets a builder for constructing immutable message objects field by field.</li>
              <li><strong>Android&apos;s <code>AlertDialog.Builder</code></strong> — dialogs with many optional pieces (title, message, buttons, icon) assembled before <code>.show()</code>.</li>
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
            prev={{ label: 'Abstract Factory', href: '/pages/lld/design-patterns/creational/abstract-factory' }}
            next={{ label: 'Prototype', href: '/pages/lld/design-patterns/creational/prototype' }}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
