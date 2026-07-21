import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Singleton Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `public class Singleton {

    private static volatile Singleton instance;
    private int requestCount = 0;

    private Singleton() {
        System.out.println("Singleton instance created.");
    }

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }

    public void logRequest() {
        requestCount++;
        System.out.println("Handled request #" + requestCount);
    }

    public static void main(String[] args) {
        Singleton a = Singleton.getInstance();
        Singleton b = Singleton.getInstance();
        a.logRequest();
        b.logRequest();
        System.out.println("a == b: " + (a == b)); // true
    }
}`,
    output: `Singleton instance created.
Handled request #1
Handled request #2
a == b: true`,
  },
  python: {
    code: `import threading

class SingletonMeta(type):
    _instances = {}
    _lock = threading.Lock()

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            with cls._lock:
                if cls not in cls._instances:
                    cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Singleton(metaclass=SingletonMeta):
    def __init__(self):
        self.request_count = 0
        print("Singleton instance created.")

    def log_request(self):
        self.request_count += 1
        print(f"Handled request #{self.request_count}")

if __name__ == "__main__":
    a = Singleton()
    b = Singleton()
    a.log_request()
    b.log_request()
    print("a is b:", a is b)  # True`,
    output: `Singleton instance created.
Handled request #1
Handled request #2
a is b: True`,
  },
  javascript: {
    code: `class Singleton {
  static #instance;
  #requestCount = 0;

  constructor() {
    if (Singleton.#instance) {
      throw new Error("Use Singleton.getInstance() instead of \`new Singleton()\`");
    }
    console.log("Singleton instance created.");
  }

  static getInstance() {
    if (!Singleton.#instance) {
      Singleton.#instance = new Singleton();
    }
    return Singleton.#instance;
  }

  logRequest() {
    this.#requestCount++;
    console.log(\`Handled request #\${this.#requestCount}\`);
  }
}

const a = Singleton.getInstance();
const b = Singleton.getInstance();
a.logRequest();
b.logRequest();
console.log("a === b:", a === b); // true

module.exports = Singleton;`,
    output: `Singleton instance created.
Handled request #1
Handled request #2
a === b: true`,
  },
  cpp: {
    code: `#include <iostream>
#include <mutex>

class Singleton {
public:
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;

    // C++11 guarantees thread-safe init of function-local statics
    static Singleton& getInstance() {
        static Singleton instance;
        return instance;
    }

    void logRequest() {
        requestCount++;
        std::cout << "Handled request #" << requestCount << std::endl;
    }

private:
    int requestCount = 0;
    Singleton() {
        std::cout << "Singleton instance created." << std::endl;
    }
};

int main() {
    Singleton& a = Singleton::getInstance();
    Singleton& b = Singleton::getInstance();

    a.logRequest();
    b.logRequest();

    std::cout << "&a == &b: " << (&a == &b ? "true" : "false") << std::endl;
    return 0;
}`,
    output: `Singleton instance created.
Handled request #1
Handled request #2
&a == &b: true`,
  },
};

const qaItems = [
  {
    q: 'What is the Singleton pattern, and what problem does it actually solve?',
    a: 'It guarantees a class has exactly one instance and gives the whole application one place to reach that instance. It matters whenever creating a second instance would cause real problems — two connection pools fighting over the same database, two loggers writing to the same file out of order, or paying twice to load a config file that never changes.',
  },
  {
    q: 'Why does the instance field need to be volatile in double-checked locking?',
    a: "Without volatile, the JVM is allowed to reorder the instructions inside new Singleton() — allocate memory, then hand back the reference, then run the constructor. Another thread can see a non-null reference before the constructor has actually finished, and start using a half-built object. volatile prevents that reordering and makes the write visible to every thread immediately.",
  },
  {
    q: 'Can you break a Java Singleton using reflection or serialization?',
    a: "Yes, both are real ways to defeat it. Reflection can call the private constructor directly via setAccessible(true), creating a second instance. Deserializing a Singleton with default readObject() behavior also creates a brand-new object instead of reusing the existing one. Fixes: throw from the constructor if an instance already exists (blocks reflection), and implement readResolve() to return the existing instance instead of the deserialized one.",
  },
  {
    q: 'How would you implement a Singleton in Python without writing a metaclass?',
    a: 'Just use the module itself. Define your state and functions at module level in a file, and import that module wherever you need it — Python caches modules after the first import, so every importer gets the same object. The metaclass version is worth knowing because it enforces the pattern for any class that opts in, but for a one-off shared object, module-level state is simpler and just as safe.',
  },
  {
    q: "Is Node's require() caching really a Singleton? Any caveats?",
    a: 'Functionally yes — the first require(\'./thing\') evaluates the module and caches the exported object; every later require from anywhere in the app returns that same cached object. The caveats: the cache key is the resolved file path, so requiring the same logical module via two different paths (or two different node_modules copies, common in monorepos) gives you two separate "singletons." Also, ES modules (import) use a different module registry than CommonJS require, so mixing the two module systems can quietly break the single-instance guarantee.',
  },
  {
    q: "How does Spring's singleton scope differ from the classic Singleton pattern?",
    a: 'The classic pattern enforces "one instance" inside the class itself via a private constructor. Spring\'s singleton scope enforces it from the outside — the container creates one instance per bean definition per application context and hands that same instance to every class that asks for it via dependency injection. The class itself has a normal public constructor and no idea it\'s being treated as a singleton, which is exactly why it stays easy to test: in a test context, you can register a different instance (or a mock) without touching the class at all.',
  },
];

export default function SingletonPage() {
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
              { label: 'Singleton' },
            ]}
          />
          <h1 id="overview">Singleton Pattern</h1>
          <p>Ensures a class has only one instance, and provides a single global point of access to it.</p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>
              Say you&apos;re building a logger. Every part of your app needs to write to the same
              log file, in the same order, without two threads fighting over the file handle. If
              every class that needs logging just does <code>new Logger()</code>, you end up with
              five different Logger objects, each thinking it owns the file — log lines start
              arriving out of order or getting clobbered. What you actually want is: there&apos;s
              exactly one Logger in the whole process, and everyone talks to that one.
            </p>
            <p>
              That&apos;s the entire idea behind Singleton. It isn&apos;t really about restricting
              object creation for its own sake — it&apos;s about resources that genuinely don&apos;t
              make sense to duplicate: a connection pool, a hardware driver, a config loader that
              read a file once and shouldn&apos;t re-read it on every call.
            </p>

            <h3>Three moving parts</h3>
            <p>
              The constructor is private, so nobody outside the class can call <code>new</code>. A
              static field holds the one instance ever created. And a static{' '}
              <code>getInstance()</code> hands that instance back — creating it on the first call,
              returning the same reference every time after. The interesting part is <em>when</em>{' '}
              you create the instance and how you keep that safe under concurrency.
            </p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>
                  Use double-checked locking with a <code>volatile</code> field for lazy,
                  thread-safe creation — check <code>instance == null</code> outside a lock first
                  (fast path once it&apos;s built), then lock and check again before constructing.
                </p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>
                  Skipping <code>volatile</code> on the instance field. Without it, another thread
                  can observe a partially-constructed object due to instruction reordering — a bug
                  that only shows up under real concurrency, rarely in a quick test.
                </p>
              </Callout>
            </TwoCol>

            <h3>The variant you get for free</h3>
            <p>
              If you&apos;re in Python or JavaScript, a module is only evaluated once no matter how
              many times it&apos;s imported — so a plain object sitting at module scope already
              behaves like a singleton, no metaclass or private-constructor trick required. Worth
              knowing so you don&apos;t over-engineer something the language already gives you.
            </p>

            <h3>Where it bites you</h3>
            <p>
              The honest downside: Singleton smuggles global state into your program. A class that
              calls <code>Logger.getInstance()</code> internally has a hidden dependency that
              doesn&apos;t show up in its constructor — you can&apos;t tell from the outside what it
              needs, and you can&apos;t swap in a fake one for a test without an awkward workaround.
              If your codebase already has a DI container (Spring, NestJS, Guice), mark the bean
              singleton-scoped and let the container own the lifecycle — same guarantee, none of
              the testing pain.
            </p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/singleton/class-diagram.svg"
                alt="Singleton UML class diagram showing the Singleton class with a private static instance field, a private constructor, and a static getInstance() method, called by a Client class"
              />
              <figcaption>Class diagram — private constructor + static accessor</figcaption>
            </figure>
            <figure>
              <img
                className="diagram-img"
                src="/assets/singleton/sequence-diagram.svg"
                alt="Sequence diagram showing ClientA and ClientB both calling getInstance() on Singleton; the first call creates the instance, the second call returns the same existing instance"
              />
              <figcaption>Sequence diagram — two clients, same instance returned both times</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>Something must exist exactly once — a connection pool, print spooler, or config read from disk one time.</li>
                  <li>The object is expensive to build and there&apos;s no reason to pay that cost twice.</li>
                  <li>You need one well-known place to coordinate access to a shared resource.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>You care about unit testing this class in isolation — the global instance leaks state between tests.</li>
                  <li>A DI container is already in the project — let it manage singleton scope instead.</li>
                  <li>Different callers might legitimately need different configurations (that&apos;s a factory, not a singleton).</li>
                  <li>Multiple threads mutate its state and you haven&apos;t nailed down synchronization.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are actually listening for:</strong> anyone can say
              &quot;private constructor plus static getInstance.&quot; A strong answer also
              explains why double-checked locking needs <code>volatile</code>, and is willing to
              say &quot;I&apos;d let Spring manage this instead of writing it by hand&quot; when
              that&apos;s true. Reciting the pattern isn&apos;t the point — recognizing when
              it&apos;s the wrong tool is.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Java <code>Runtime.getRuntime()</code></strong> — one <code>Runtime</code> object per JVM, accessed via a static method.</li>
              <li><strong>Logging frameworks</strong> (Log4j, SLF4J, Python&apos;s <code>logging</code>) — one shared logger/registry for the whole app.</li>
              <li><strong>Spring beans</strong> — singleton-scoped by default within the application context.</li>
              <li><strong>Database connection pools</strong> (HikariCP) — one pool instance manages reusable connections.</li>
              <li><strong>Browser <code>window</code> object</strong> — exactly one global <code>window</code> per tab.</li>
              <li><strong>Node.js <code>require()</code> caching</strong> — repeated requires return the same cached module object.</li>
              <li><strong>Redux store</strong> — a single store instance holds the entire app&apos;s state tree.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer. These are the ones that actually come up — not just &quot;define Singleton.&quot;</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>Same pattern, four languages. Switch tabs to see the language-specific implementation and its actual captured output below it — every output shown here was captured from a real run, not guessed.</p>

            <TwoCol>
              <Callout kind="bad" title="✕ Broken version (don't ship this)">
                <pre style={{ marginTop: 8 }}>
                  <code>{`public static Singleton getInstance() {
    if (instance == null) {
        instance = new Singleton(); // no lock!
    }
    return instance;
}`}</code>
                </pre>
                <p>Two threads can both pass the null check before either finishes constructing, and you end up with two &quot;singletons.&quot;</p>
              </Callout>
              <Callout kind="good" title="✓ Fixed with double-checked locking">
                <pre style={{ marginTop: 8 }}>
                  <code>{`if (instance == null) {
    synchronized (Singleton.class) {
        if (instance == null) {
            instance = new Singleton();
        }
    }
}`}</code>
                </pre>
                <p>The lock only runs on the (rare) first creation — every call after is lock-free.</p>
              </Callout>
            </TwoCol>

            <CodeTerminal snippets={snippets} />
          </section>

          <PageNav
            prev={{ label: 'Home', href: '/' }}
            next={{ label: 'Factory Method', href: '/pages/lld/design-patterns/creational/factory-method' }}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
