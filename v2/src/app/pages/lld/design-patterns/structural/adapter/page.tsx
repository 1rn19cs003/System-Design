import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Adapter Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `interface PaymentProcessor {
    void pay(double amountDollars);
}

class InHousePaymentProcessor implements PaymentProcessor {
    public void pay(double amountDollars) {
        System.out.println("In-house processor charged $" + amountDollars);
    }
}

class ThirdPartySDK {
    void makeTransaction(int amountCents, String currencyCode) {
        System.out.println("ThirdPartySDK processed " + amountCents + " " + currencyCode + " cents");
    }
}

class ThirdPartyPaymentAdapter implements PaymentProcessor {
    private final ThirdPartySDK sdk;

    ThirdPartyPaymentAdapter(ThirdPartySDK sdk) {
        this.sdk = sdk;
    }

    public void pay(double amountDollars) {
        int cents = (int) Math.round(amountDollars * 100);
        sdk.makeTransaction(cents, "USD");
    }
}

public class Adapter {
    static void checkout(PaymentProcessor processor, double amount) {
        processor.pay(amount);
    }

    public static void main(String[] args) {
        PaymentProcessor inHouse = new InHousePaymentProcessor();
        PaymentProcessor thirdParty = new ThirdPartyPaymentAdapter(new ThirdPartySDK());

        checkout(inHouse, 49.99);
        checkout(thirdParty, 49.99);
    }
}`,
    output: `In-house processor charged $49.99
ThirdPartySDK processed 4999 USD cents`,
  },
  python: {
    code: `from abc import ABC, abstractmethod


class PaymentProcessor(ABC):
    @abstractmethod
    def pay(self, amount_dollars):
        ...


class InHousePaymentProcessor(PaymentProcessor):
    def pay(self, amount_dollars):
        print(f"In-house processor charged \${amount_dollars}")


class ThirdPartySDK:
    def make_transaction(self, amount_cents, currency_code):
        print(f"ThirdPartySDK processed {amount_cents} {currency_code} cents")


class ThirdPartyPaymentAdapter(PaymentProcessor):
    def __init__(self, sdk: ThirdPartySDK):
        self._sdk = sdk

    def pay(self, amount_dollars):
        cents = round(amount_dollars * 100)
        self._sdk.make_transaction(cents, "USD")


def checkout(processor: PaymentProcessor, amount):
    processor.pay(amount)


if __name__ == "__main__":
    in_house = InHousePaymentProcessor()
    third_party = ThirdPartyPaymentAdapter(ThirdPartySDK())

    checkout(in_house, 49.99)
    checkout(third_party, 49.99)`,
    output: `In-house processor charged $49.99
ThirdPartySDK processed 4999 USD cents`,
  },
  javascript: {
    code: `class InHousePaymentProcessor {
  pay(amountDollars) {
    console.log(\`In-house processor charged $\${amountDollars}\`);
  }
}

class ThirdPartySDK {
  makeTransaction(amountCents, currencyCode) {
    console.log(\`ThirdPartySDK processed \${amountCents} \${currencyCode} cents\`);
  }
}

class ThirdPartyPaymentAdapter {
  constructor(sdk) {
    this.sdk = sdk;
  }

  pay(amountDollars) {
    const cents = Math.round(amountDollars * 100);
    this.sdk.makeTransaction(cents, "USD");
  }
}

function checkout(processor, amount) {
  processor.pay(amount);
}

const inHouse = new InHousePaymentProcessor();
const thirdParty = new ThirdPartyPaymentAdapter(new ThirdPartySDK());

checkout(inHouse, 49.99);
checkout(thirdParty, 49.99);

module.exports = { InHousePaymentProcessor, ThirdPartyPaymentAdapter };`,
    output: `In-house processor charged $49.99
ThirdPartySDK processed 4999 USD cents`,
  },
  cpp: {
    code: `#include <iostream>
#include <string>
#include <cmath>

class PaymentProcessor {
public:
    virtual void pay(double amountDollars) = 0;
    virtual ~PaymentProcessor() = default;
};

class InHousePaymentProcessor : public PaymentProcessor {
public:
    void pay(double amountDollars) override {
        std::cout << "In-house processor charged $" << amountDollars << std::endl;
    }
};

class ThirdPartySDK {
public:
    void makeTransaction(int amountCents, const std::string& currencyCode) {
        std::cout << "ThirdPartySDK processed " << amountCents << " " << currencyCode << " cents" << std::endl;
    }
};

class ThirdPartyPaymentAdapter : public PaymentProcessor {
public:
    explicit ThirdPartyPaymentAdapter(ThirdPartySDK& sdk) : sdk_(sdk) {}

    void pay(double amountDollars) override {
        int cents = static_cast<int>(std::round(amountDollars * 100));
        sdk_.makeTransaction(cents, "USD");
    }

private:
    ThirdPartySDK& sdk_;
};

void checkout(PaymentProcessor& processor, double amount) {
    processor.pay(amount);
}

int main() {
    InHousePaymentProcessor inHouse;
    ThirdPartySDK sdk;
    ThirdPartyPaymentAdapter thirdParty(sdk);

    checkout(inHouse, 49.99);
    checkout(thirdParty, 49.99);

    return 0;
}`,
    output: `In-house processor charged $49.99
ThirdPartySDK processed 4999 USD cents`,
  },
};

const qaItems = [
  {
    q: "What's the difference between an object adapter and a class adapter?",
    a: 'An object adapter holds a reference to the adaptee and delegates to it (composition) — works in any OOP language, and is the more common form. A class adapter inherits from both the target interface and the adaptee (multiple inheritance) — only viable in languages that support it, like C++; not possible in Java.',
  },
  {
    q: 'How is Adapter different from Facade?',
    a: "Adapter makes an existing interface match a specific interface your code already expects — one-to-one compatibility. Facade simplifies access to a complex subsystem behind one new, simpler interface — it isn't matching anything pre-existing, it's inventing an easier one.",
  },
  {
    q: 'How is Adapter different from Decorator, given both "wrap" another object?',
    a: "Adapter changes the interface — the wrapped object couldn't be used directly because its methods don't match what's expected. Decorator keeps the same interface as the object it wraps, and adds new behavior on top — the wrapped and wrapping object are interchangeable from the caller's perspective, which is never true for Adapter's adaptee.",
  },
  {
    q: 'Can an Adapter wrap multiple different adaptees behind the same target interface?',
    a: 'Yes — common in practice. You might have StripeAdapter, PaypalAdapter, and RazorpayAdapter all implementing the same PaymentProcessor interface, each translating to a different vendor SDK. Calling code depends only on PaymentProcessor and never knows which vendor it\'s actually using.',
  },
];

export default function AdapterPage() {
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
              { label: 'Adapter' },
            ]}
          />
          <h1 id="overview">Adapter Pattern</h1>
          <p>
            Converts the interface of a class into another interface clients expect — letting
            incompatible interfaces work together.
          </p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>
              Your app&apos;s payment module expects every provider to implement a{' '}
              <code>PaymentProcessor</code> interface with a <code>pay(amount)</code> method. You
              need to integrate a third-party SDK that exposes{' '}
              <code>makeTransaction(cents, currencyCode)</code> instead — a completely different
              shape. You can&apos;t change the SDK, and you don&apos;t want{' '}
              <code>if (usingThirdPartySDK)</code> branches scattered through your payment module.
            </p>
            <p>
              An Adapter sits between the two: it implements the interface your code expects, and
              internally translates each call into whatever the incompatible library actually
              needs. Your payment module never knows it&apos;s talking to a translator.
            </p>

            <h3>How it's built</h3>
            <p>
              Two common shapes: <strong>object adapter</strong> (the adapter holds a reference to
              the wrapped &quot;adaptee&quot; and delegates to it, translating arguments as needed)
              and <strong>class adapter</strong> (the adapter inherits from both the target
              interface and the adaptee — only possible with multiple inheritance, so rare in Java,
              more common in C++). Object adapter is the portable, commonly used form.
            </p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>
                  Keep the adapter thin — its only job is translating shape (method names,
                  argument formats, units). If it starts adding business logic, that logic belongs
                  somewhere else.
                </p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>
                  Confusing this with Facade. Adapter matches a <em>specific, pre-existing</em>{' '}
                  interface your code expects. Facade just simplifies access to something complex —
                  it isn&apos;t matching anything that already exists.
                </p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>
              Every adapted dependency is a translation layer to maintain — if the adaptee&apos;s
              API changes, the adapter changes with it. And an adapter can only fix a mismatch in
              interface <em>shape</em>; it can&apos;t fix a fundamental mismatch in{' '}
              <em>behavior</em> (a synchronous adaptee behind an interface your code assumes is
              async, for instance).
            </p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/adapter/class-diagram.svg"
                alt="Adapter pattern class diagram showing PaymentProcessor interface implemented by ThirdPartyPaymentAdapter, which wraps and delegates to the incompatible ThirdPartySDK"
              />
              <figcaption>The caller only sees PaymentProcessor — never the wrapped SDK</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>You need to integrate a third-party/legacy interface that doesn&apos;t match what your code expects, and can&apos;t modify its source.</li>
                  <li>You want to isolate third-party specifics in one translation layer instead of scattering them through the codebase.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>You control both interfaces — just change one to match the other.</li>
                  <li>The mismatch is behavioral, not just structural — an adapter can&apos;t fix that.</li>
                </ul>
              </Callout>
            </TwoCol>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Java&apos;s <code>Arrays.asList()</code></strong> — adapts a plain array to the <code>List</code> interface.</li>
              <li><strong><code>InputStreamReader</code> / <code>OutputStreamWriter</code></strong> — adapts byte streams to character-oriented Reader/Writer interfaces.</li>
              <li><strong>Physical power adapters</strong> — the canonical non-software example: converts plug shape/voltage without changing the device or the wall.</li>
              <li><strong>Third-party SDK wrappers</strong> (payment, SMS, analytics) — nearly every production codebase wraps vendor SDKs so the vendor can be swapped later.</li>
              <li><strong>Cross-browser JS polyfills/shims</strong> — adapting inconsistent browser APIs to one consistent interface.</li>
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
            prev={{ label: 'Prototype', href: '/pages/lld/design-patterns/creational/prototype' }}
            next={{ label: 'Bridge', href: '/pages/lld/design-patterns/structural/bridge' }}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
