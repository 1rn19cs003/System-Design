import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Proxy Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `// Proxy Pattern — virtual proxy that lazily loads an expensive Image.
// Compile: javac Proxy.java
// Run:     java Proxy

interface Image {
    void display();
}

// The RealSubject — expensive to construct.
class RealImage implements Image {
    private String filename;

    RealImage(String filename) {
        this.filename = filename;
        loadFromDisk();
    }

    private void loadFromDisk() {
        System.out.println("Loading '" + filename + "' from disk (expensive)...");
    }

    public void display() {
        System.out.println("Displaying '" + filename + "'");
    }
}

// The Proxy — same interface, defers creating the RealImage until display() is first called.
class ProxyImage implements Image {
    private String filename;
    private RealImage realImage;

    ProxyImage(String filename) {
        this.filename = filename;
    }

    public void display() {
        if (realImage == null) {
            realImage = new RealImage(filename);
        }
        realImage.display();
    }
}

public class Proxy {
    public static void main(String[] args) {
        Image image = new ProxyImage("vacation.jpg");
        System.out.println("Proxy created, no loading yet.");

        System.out.println("First display() call:");
        image.display();

        System.out.println("Second display() call:");
        image.display();
    }
}`,
    output: `Proxy created, no loading yet.
First display() call:
Loading 'vacation.jpg' from disk (expensive)...
Displaying 'vacation.jpg'
Second display() call:
Displaying 'vacation.jpg'`,
  },
  python: {
    code: `"""
Proxy Pattern — virtual proxy that lazily loads an expensive Image.
Run: python proxy.py
"""

from abc import ABC, abstractmethod


class Image(ABC):
    @abstractmethod
    def display(self):
        ...


class RealImage(Image):
    """The RealSubject — expensive to construct."""

    def __init__(self, filename):
        self.filename = filename
        self._load_from_disk()

    def _load_from_disk(self):
        print(f"Loading '{self.filename}' from disk (expensive)...")

    def display(self):
        print(f"Displaying '{self.filename}'")


class ProxyImage(Image):
    """Same interface, defers creating the RealImage until display() is first called."""

    def __init__(self, filename):
        self.filename = filename
        self._real_image = None

    def display(self):
        if self._real_image is None:
            self._real_image = RealImage(self.filename)
        self._real_image.display()


if __name__ == "__main__":
    image = ProxyImage("vacation.jpg")
    print("Proxy created, no loading yet.")

    print("First display() call:")
    image.display()

    print("Second display() call:")
    image.display()`,
    output: `Proxy created, no loading yet.
First display() call:
Loading 'vacation.jpg' from disk (expensive)...
Displaying 'vacation.jpg'
Second display() call:
Displaying 'vacation.jpg'`,
  },
  javascript: {
    code: `/**
 * Proxy Pattern — virtual proxy that lazily loads an expensive Image.
 * Run: node proxy.js
 */

class RealImage {
  constructor(filename) {
    this.filename = filename;
    this.loadFromDisk();
  }

  loadFromDisk() {
    console.log(\`Loading '\${this.filename}' from disk (expensive)...\`);
  }

  display() {
    console.log(\`Displaying '\${this.filename}'\`);
  }
}

class ProxyImage {
  constructor(filename) {
    this.filename = filename;
    this.realImage = null;
  }

  display() {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename);
    }
    this.realImage.display();
  }
}

const image = new ProxyImage("vacation.jpg");
console.log("Proxy created, no loading yet.");

console.log("First display() call:");
image.display();

console.log("Second display() call:");
image.display();

module.exports = { RealImage, ProxyImage };`,
    output: `Proxy created, no loading yet.
First display() call:
Loading 'vacation.jpg' from disk (expensive)...
Displaying 'vacation.jpg'
Second display() call:
Displaying 'vacation.jpg'`,
  },
  cpp: {
    code: `// Proxy Pattern — virtual proxy that lazily loads an expensive Image.
// Compile: g++ -std=c++14 Proxy.cpp -o proxy
// Run:     ./proxy

#include <iostream>
#include <memory>
#include <string>

class Image {
public:
    virtual void display() = 0;
    virtual ~Image() = default;
};

// The RealSubject — expensive to construct.
class RealImage : public Image {
public:
    explicit RealImage(std::string filename) : filename_(std::move(filename)) {
        loadFromDisk();
    }

    void display() override {
        std::cout << "Displaying '" << filename_ << "'" << std::endl;
    }

private:
    std::string filename_;

    void loadFromDisk() {
        std::cout << "Loading '" << filename_ << "' from disk (expensive)..." << std::endl;
    }
};

// The Proxy — same interface, defers creating the RealImage until display() is first called.
class ProxyImage : public Image {
public:
    explicit ProxyImage(std::string filename) : filename_(std::move(filename)) {}

    void display() override {
        if (!realImage_) {
            realImage_ = std::make_unique<RealImage>(filename_);
        }
        realImage_->display();
    }

private:
    std::string filename_;
    std::unique_ptr<RealImage> realImage_;
};

int main() {
    std::unique_ptr<Image> image = std::make_unique<ProxyImage>("vacation.jpg");
    std::cout << "Proxy created, no loading yet." << std::endl;

    std::cout << "First display() call:" << std::endl;
    image->display();

    std::cout << "Second display() call:" << std::endl;
    image->display();

    return 0;
}`,
    output: `Proxy created, no loading yet.
First display() call:
Loading 'vacation.jpg' from disk (expensive)...
Displaying 'vacation.jpg'
Second display() call:
Displaying 'vacation.jpg'`,
  },
};

const qaItems = [
  {
    q: 'Name the common variants of Proxy and what each solves.',
    a: 'Virtual proxy defers expensive object creation until actually needed. Protection proxy checks permissions before letting a call through to the real object. Remote proxy represents an object living in another process/machine, making the call look local. Caching proxy stores results of expensive operations and returns cached results for repeat requests.',
  },
  {
    q: 'How is Proxy different from Decorator, given both implement the same interface as what they wrap?',
    a: "Intent. Decorator's purpose is adding new behavior/responsibility, typically stackable and explicitly chosen by the client for the extra behavior. Proxy's purpose is controlling access to the real subject — the client often doesn't even know it's holding a proxy, and usually there's exactly one proxy in front of one real subject rather than a stack of them.",
  },
  {
    q: 'In a virtual proxy for lazy loading, where does the "real" object get created?',
    a: "Inside the proxy's method that requires it, on first access — the proxy holds a reference (often null initially) to the real subject, and creates it the first time a method is called that actually needs the real data. Subsequent calls reuse the already-created real object.",
  },
  {
    q: 'How does Proxy relate to how ORMs implement lazy loading?',
    a: 'An ORM often returns a proxy object in place of a related entity or collection. That proxy looks and behaves like the real entity/collection to calling code, but the actual database query to fetch the real data only fires the first time a property on it is actually accessed — deferring the cost exactly like a virtual proxy.',
  },
];

export default function ProxyPage() {
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
              { label: 'Proxy' },
            ]}
          />
          <h1 id="overview">Proxy Pattern</h1>
          <p>
            Provides a stand-in for another object, implementing the same interface, so it can
            control access to the real object — deferring its creation, checking permissions,
            forwarding to a remote copy, or caching its results.
          </p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>
              You have an <code>Image</code> class that loads a large file from disk when
              constructed — expensive. If your gallery app creates an <code>Image</code> object
              for every photo the moment the gallery loads, you pay that loading cost for a
              hundred photos even though the user might only ever scroll past ten of them. You
              want the loading to happen lazily, only when a photo is actually displayed — but you
              don&apos;t want every piece of calling code to manually check &quot;has this been
              loaded yet?&quot; before using it.
            </p>
            <p>
              A Proxy solves this by implementing the same interface as the real object (
              <code>Image</code>) and standing in for it. Calling code holds a reference to the
              Proxy and calls methods on it exactly as if it were the real thing. The Proxy
              decides when to actually create or delegate to the real object — in this case, only
              on first access (<code>display()</code>) — and reuses it afterward. The caller never
              has to know a proxy was involved.
            </p>

            <h3>How it&apos;s built</h3>
            <p>
              A <code>Subject</code> interface (<code>Image</code>) is implemented both by the{' '}
              <code>RealSubject</code> (the expensive, real image loader) and by a{' '}
              <code>Proxy</code> class that also implements <code>Subject</code>. The proxy holds
              a reference to — or lazily creates — the real subject, and forwards calls to it, but
              can add logic before or after forwarding: lazy initialization, access control,
              logging, caching, or making a remote call look local.
            </p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>
                  Keep the proxy&apos;s public interface identical to the real subject&apos;s —
                  the whole value of the pattern is that calling code can&apos;t tell (and
                  shouldn&apos;t need to care) whether it&apos;s holding a proxy or the real
                  object.
                </p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>
                  Letting the proxy leak extra methods or behavior differences that force callers
                  to special-case it — that defeats the transparency the pattern is meant to
                  provide.
                </p>
              </Callout>
            </TwoCol>

            <h3>Common Proxy variants</h3>
            <p>
              <strong>Virtual proxy</strong> defers expensive object creation until it&apos;s
              actually needed — the lazy-loading image example above. <strong>Protection
              proxy</strong> checks permissions before allowing a call through to the real object.{' '}
              <strong>Remote proxy</strong> represents an object that lives in a different address
              space — another process, another machine — and makes calling it look like a normal
              local method call. <strong>Caching proxy</strong> stores results of expensive calls
              and returns the cached result for repeated identical requests.
            </p>

            <h3>Proxy vs. Decorator (same shape, different purpose)</h3>
            <p>
              Structurally these two patterns are near-identical — both implement the same
              interface as what they wrap and delegate to it. The difference is intent.
              Decorator&apos;s entire purpose is adding new behavior or responsibility, typically
              stackable, usually created explicitly by client code that wants the extra behavior.
              Proxy&apos;s purpose is controlling access to the real subject — the client often
              doesn&apos;t even know it&apos;s holding a proxy instead of the real thing, and
              there&apos;s usually exactly one proxy in front of one real subject, not a stack of
              them.
            </p>

            <h3>Where it bites you</h3>
            <p>
              A proxy adds a layer of indirection for every call, however thin. If overused for
              things that don&apos;t actually need access control, laziness, or remote
              indirection, it&apos;s needless complexity. Proxies that silently change behavior —
              for instance, silently caching stale data — can also introduce surprising bugs if
              the caller genuinely expected the real object&apos;s live behavior.
            </p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/proxy/class-diagram.svg"
                alt="Proxy pattern class diagram showing Image interface implemented by RealImage and ProxyImage, with ProxyImage lazily creating and delegating to RealImage on first display() call"
              />
              <figcaption>ProxyImage implements the same Image interface, lazily creating RealImage only on first display()</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>Creating or accessing the real object is expensive, and you want to defer that cost until it&apos;s actually needed (virtual proxy).</li>
                  <li>You need access control/permission checks in front of an object without changing the object itself (protection proxy).</li>
                  <li>The real object lives elsewhere — another process, service, or machine — and you want calling code to interact with it as if it were local (remote proxy).</li>
                  <li>You want to cache results of expensive operations transparently to the caller (caching proxy).</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>Access to the real object is cheap and unrestricted — there&apos;s nothing to control or defer, so a proxy is pure overhead.</li>
                  <li>What you actually want is to add new behavior/responsibility rather than control access — that&apos;s Decorator, and usually implies stacking, which Proxy typically doesn&apos;t.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: '16px' }}>
              <strong>What interviewers are actually listening for:</strong> naming the specific
              proxy variant relevant to the scenario (virtual, protection, remote, caching) rather
              than a vague &quot;it controls access.&quot; Also, clearly separating Proxy from
              Decorator by intent (access control vs. behavior addition) even though the class
              structure looks nearly identical — this is one of the most commonly confused pattern
              pairs in interviews.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Java&apos;s <code>java.rmi</code> remote proxies</strong> — a local stub object implements the same interface as a remote object, forwarding calls across the network while looking like a normal local method call.</li>
              <li><strong>Spring AOP proxies</strong> — Spring wraps beans in dynamic proxies to add cross-cutting behavior (transactions, security checks, logging) around method calls, without the underlying bean class knowing anything about it.</li>
              <li><strong>Lazy-loading ORMs</strong> (Hibernate lazy associations, Django&apos;s lazy querysets) — a proxy object stands in for a related entity/collection and only hits the database when the data is actually accessed.</li>
              <li><strong>CDNs / caching reverse proxies</strong> (Varnish, CloudFront) — sit in front of the real origin server, serving cached responses when possible and only forwarding to the real server when necessary.</li>
              <li><strong>Virtual proxies in image/document viewers</strong> — a placeholder stands in for a large image or document, loading the real content only when it&apos;s scrolled into view or opened.</li>
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
              note that &quot;Loading... from disk&quot; only prints once, on the first{' '}
              <code>display()</code> call, not the second.
            </p>
            <CodeTerminal snippets={snippets} />
          </section>

          <PageNav
            prev={{ label: 'Flyweight', href: '/pages/lld/design-patterns/structural/flyweight' }}
            next={{ label: 'Observer', href: '/pages/lld/design-patterns/behavioral/observer' }}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
