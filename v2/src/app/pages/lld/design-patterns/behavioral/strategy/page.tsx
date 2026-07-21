import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Strategy Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `// Strategy Pattern — a ShoppingCart (Context) delegates payment to a swappable PaymentStrategy.
// Compile: javac Strategy.java
// Run:     java Strategy

interface PaymentStrategy {
    void pay(double amount);
}

class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;

    CreditCardPayment(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public void pay(double amount) {
        String last4 = cardNumber.substring(cardNumber.length() - 4);
        System.out.println("Charged $" + amount + " to credit card ending in " + last4);
    }
}

class PayPalPayment implements PaymentStrategy {
    private String email;

    PayPalPayment(String email) {
        this.email = email;
    }

    public void pay(double amount) {
        System.out.println("Charged $" + amount + " via PayPal account " + email);
    }
}

class StoreCreditPayment implements PaymentStrategy {
    private double balance;

    StoreCreditPayment(double balance) {
        this.balance = balance;
    }

    public void pay(double amount) {
        if (amount > balance) {
            System.out.println("Store credit insufficient: have $" + balance + ", need $" + amount);
            return;
        }
        balance -= amount;
        System.out.println("Charged $" + amount + " to store credit, remaining balance $" + balance);
    }
}

class ShoppingCart {
    private PaymentStrategy paymentStrategy;

    void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }

    void checkout(double amount) {
        paymentStrategy.pay(amount);
    }
}

public class Strategy {
    public static void main(String[] args) {
        ShoppingCart cart = new ShoppingCart();

        cart.setPaymentStrategy(new CreditCardPayment("4111111111111234"));
        cart.checkout(49.99);

        cart.setPaymentStrategy(new PayPalPayment("shopper@example.com"));
        cart.checkout(19.50);

        cart.setPaymentStrategy(new StoreCreditPayment(30.0));
        cart.checkout(45.0);
        cart.checkout(20.0);
    }
}`,
    output: `Charged $49.99 to credit card ending in 1234
Charged $19.5 via PayPal account shopper@example.com
Store credit insufficient: have $30.0, need $45.0
Charged $20.0 to store credit, remaining balance $10.0`,
  },
  python: {
    code: `"""
Strategy Pattern — a ShoppingCart (Context) delegates payment to a swappable PaymentStrategy.
Run: python strategy.py
"""

from abc import ABC, abstractmethod


class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount):
        ...


class CreditCardPayment(PaymentStrategy):
    def __init__(self, card_number):
        self.card_number = card_number

    def pay(self, amount):
        last4 = self.card_number[-4:]
        print(f"Charged \${amount} to credit card ending in {last4}")


class PayPalPayment(PaymentStrategy):
    def __init__(self, email):
        self.email = email

    def pay(self, amount):
        print(f"Charged \${amount} via PayPal account {self.email}")


class StoreCreditPayment(PaymentStrategy):
    def __init__(self, balance):
        self.balance = balance

    def pay(self, amount):
        if amount > self.balance:
            print(f"Store credit insufficient: have \${self.balance}, need \${amount}")
            return
        self.balance -= amount
        print(f"Charged \${amount} to store credit, remaining balance \${self.balance}")


class ShoppingCart:
    def __init__(self):
        self.payment_strategy = None

    def set_payment_strategy(self, strategy: PaymentStrategy):
        self.payment_strategy = strategy

    def checkout(self, amount):
        self.payment_strategy.pay(amount)


if __name__ == "__main__":
    cart = ShoppingCart()

    cart.set_payment_strategy(CreditCardPayment("4111111111111234"))
    cart.checkout(49.99)

    cart.set_payment_strategy(PayPalPayment("shopper@example.com"))
    cart.checkout(19.50)

    cart.set_payment_strategy(StoreCreditPayment(30.0))
    cart.checkout(45.0)
    cart.checkout(20.0)`,
    output: `Charged $49.99 to credit card ending in 1234
Charged $19.5 via PayPal account shopper@example.com
Store credit insufficient: have $30.0, need $45.0
Charged $20.0 to store credit, remaining balance $10.0`,
  },
  javascript: {
    code: `/**
 * Strategy Pattern — a ShoppingCart (Context) delegates payment to a swappable PaymentStrategy.
 * Run: node strategy.js
 */

class CreditCardPayment {
  constructor(cardNumber) {
    this.cardNumber = cardNumber;
  }

  pay(amount) {
    const last4 = this.cardNumber.slice(-4);
    console.log(\`Charged $\${amount} to credit card ending in \${last4}\`);
  }
}

class PayPalPayment {
  constructor(email) {
    this.email = email;
  }

  pay(amount) {
    console.log(\`Charged $\${amount} via PayPal account \${this.email}\`);
  }
}

class StoreCreditPayment {
  constructor(balance) {
    this.balance = balance;
  }

  pay(amount) {
    if (amount > this.balance) {
      console.log(\`Store credit insufficient: have $\${this.balance}, need $\${amount}\`);
      return;
    }
    this.balance -= amount;
    console.log(\`Charged $\${amount} to store credit, remaining balance $\${this.balance}\`);
  }
}

class ShoppingCart {
  setPaymentStrategy(strategy) {
    this.paymentStrategy = strategy;
  }

  checkout(amount) {
    this.paymentStrategy.pay(amount);
  }
}

const cart = new ShoppingCart();

cart.setPaymentStrategy(new CreditCardPayment("4111111111111234"));
cart.checkout(49.99);

cart.setPaymentStrategy(new PayPalPayment("shopper@example.com"));
cart.checkout(19.50);

cart.setPaymentStrategy(new StoreCreditPayment(30.0));
cart.checkout(45.0);
cart.checkout(20.0);

module.exports = { CreditCardPayment, PayPalPayment, StoreCreditPayment, ShoppingCart };`,
    output: `Charged $49.99 to credit card ending in 1234
Charged $19.5 via PayPal account shopper@example.com
Store credit insufficient: have $30, need $45
Charged $20 to store credit, remaining balance $10`,
  },
  cpp: {
    code: `// Strategy Pattern — a ShoppingCart (Context) delegates payment to a swappable PaymentStrategy.
// Compile: g++ -std=c++14 Strategy.cpp -o strategy
// Run:     ./strategy

#include <iostream>
#include <string>
#include <memory>

class PaymentStrategy {
public:
    virtual void pay(double amount) = 0;
    virtual ~PaymentStrategy() = default;
};

class CreditCardPayment : public PaymentStrategy {
public:
    explicit CreditCardPayment(std::string cardNumber) : cardNumber_(std::move(cardNumber)) {}

    void pay(double amount) override {
        std::string last4 = cardNumber_.substr(cardNumber_.size() - 4);
        std::cout << "Charged $" << amount << " to credit card ending in " << last4 << std::endl;
    }

private:
    std::string cardNumber_;
};

class PayPalPayment : public PaymentStrategy {
public:
    explicit PayPalPayment(std::string email) : email_(std::move(email)) {}

    void pay(double amount) override {
        std::cout << "Charged $" << amount << " via PayPal account " << email_ << std::endl;
    }

private:
    std::string email_;
};

class StoreCreditPayment : public PaymentStrategy {
public:
    explicit StoreCreditPayment(double balance) : balance_(balance) {}

    void pay(double amount) override {
        if (amount > balance_) {
            std::cout << "Store credit insufficient: have $" << balance_ << ", need $" << amount << std::endl;
            return;
        }
        balance_ -= amount;
        std::cout << "Charged $" << amount << " to store credit, remaining balance $" << balance_ << std::endl;
    }

private:
    double balance_;
};

class ShoppingCart {
public:
    void setPaymentStrategy(std::unique_ptr<PaymentStrategy> strategy) {
        paymentStrategy_ = std::move(strategy);
    }

    void checkout(double amount) {
        paymentStrategy_->pay(amount);
    }

private:
    std::unique_ptr<PaymentStrategy> paymentStrategy_;
};

int main() {
    ShoppingCart cart;

    cart.setPaymentStrategy(std::make_unique<CreditCardPayment>("4111111111111234"));
    cart.checkout(49.99);

    cart.setPaymentStrategy(std::make_unique<PayPalPayment>("shopper@example.com"));
    cart.checkout(19.50);

    cart.setPaymentStrategy(std::make_unique<StoreCreditPayment>(30.0));
    cart.checkout(45.0);
    cart.checkout(20.0);

    return 0;
}`,
    output: `Charged $49.99 to credit card ending in 1234
Charged $19.5 via PayPal account shopper@example.com
Store credit insufficient: have $30, need $45
Charged $20 to store credit, remaining balance $10`,
  },
};

const qaItems = [
  {
    q: 'What problem does Strategy solve, concretely?',
    a: <>It replaces a growing <code>if/else</code> or <code>switch</code> chain that picks between different algorithms/behaviors with a set of interchangeable classes implementing a common interface, so the code that uses the behavior doesn&apos;t need to change every time a new variant is added.</>,
  },
  {
    q: 'How is Strategy different from just passing a function/lambda?',
    a: 'In languages with first-class functions, a plain function reference genuinely can act as a lightweight Strategy — the essence of the pattern is the Context depending on an abstraction for the varying behavior, not specifically a class hierarchy. Class-based Strategy earns its keep when a variant needs its own state or is more than a single pure operation.',
  },
  {
    q: 'Does Strategy decide which strategy to use?',
    a: 'No — Strategy only defines the interchangeable-behavior structure. Something else (often a factory, configuration, or user selection) still has to decide which concrete Strategy gets plugged into the Context; conflating "define the strategies" with "pick the right one" is a common design smell.',
  },
  {
    q: 'How is Strategy different from State, since both involve a Context holding a reference to an interface implementation?',
    a: 'Structurally similar, but intent differs. Strategy variants are usually chosen once (or explicitly swapped by the client) and don’t know about each other. State pattern variants represent a Context’s internal state and often trigger transitions to other states themselves as part of handling a request — the states actively participate in moving the Context between states, which Strategy implementations typically don’t do.',
  },
];

export default function StrategyPatternPage() {
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
              { label: 'Strategy' },
            ]}
          />
          <h1 id="overview">Strategy Pattern</h1>
          <p>Extracts an interchangeable family of algorithms/behaviors behind a common interface, so the code using them doesn&apos;t need to change every time a new variant is added.</p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>You&apos;re building a checkout flow. Customers can pay by credit card, PayPal, or store credit, and each option has genuinely different logic — different validation, different external API calls, different fee calculations. The obvious first pass is a <code>processPayment</code> method riddled with <code>if (method == &quot;credit_card&quot;) {'{'} ... {'}'} else if (method == &quot;paypal&quot;) {'{'} ... {'}'}</code>. Every time the business adds a new payment option, you&apos;re back inside that method, and the branches keep growing alongside the risk of breaking an existing one while editing.</p>
            <p>Strategy pulls each branch out into its own class that all implement a common interface, and the checkout code holds a reference to whichever one the customer picked, calling the same method (<code>pay(amount)</code>) regardless of which concrete strategy is plugged in. The checkout code no longer needs to know how each payment method works — only that it can be asked to <code>pay()</code>.</p>

            <h3>How it&apos;s built</h3>
            <p>A <code>Strategy</code> interface declares the operation that varies (<code>pay(amount)</code>). Concrete strategies (<code>CreditCardPayment</code>, <code>PayPalPayment</code>, <code>StoreCreditPayment</code>) each implement it differently. A <code>Context</code> (the <code>ShoppingCart</code> or checkout flow) holds a reference to a <code>Strategy</code> object — set at construction, or swappable later via a setter — and delegates to it instead of implementing the varying behavior itself.</p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>Keep each concrete strategy focused only on its own algorithm — resist the urge to let strategies reach back into the Context&apos;s internals beyond what&apos;s passed in as arguments.</p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>Building a whole Strategy hierarchy for one or two variants that are unlikely to ever grow — that&apos;s ceremony a plain conditional would&apos;ve handled just as well.</p>
              </Callout>
            </TwoCol>

            <h3>Strategy vs. simple parameters</h3>
            <p>A common early instinct is &quot;why not just pass a function or a flag instead of a whole class hierarchy?&quot; In languages with first-class functions, a plain function reference genuinely can serve as a lightweight Strategy — the pattern&apos;s essence is really about the Context depending on an abstraction for the varying behavior, not the specific mechanism (interface vs. function) used to supply it. The class-based version earns its keep when each strategy needs to carry its own state or when the operation is more than a single pure function.</p>

            <h3>Where it bites you</h3>
            <p>If there&apos;s only ever going to be one or two variants and they&apos;re unlikely to grow, a Strategy hierarchy is over-engineering — a simple conditional is more direct and easier for a new reader to follow at a glance. Also, the Context has to somehow pick which concrete Strategy to use in the first place — Strategy itself doesn&apos;t solve that selection problem, and teams sometimes end up reintroducing the very <code>if/else</code> chain they were trying to avoid, just one level up, at the point where the Strategy gets chosen.</p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/strategy/class-diagram.svg"
                alt="Strategy pattern class diagram showing ShoppingCart Context holding a PaymentStrategy reference, implemented by CreditCardPayment, PayPalPayment, and StoreCreditPayment"
              />
              <figcaption>ShoppingCart delegates to whichever PaymentStrategy is currently plugged in</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>You have several interchangeable ways of doing the same conceptual operation, and you expect the list to grow.</li>
                  <li>You want to swap the algorithm/behavior at runtime, not just at compile time.</li>
                  <li>The current implementation uses a growing <code>if/else</code> or <code>switch</code> chain to pick between behaviors, and that chain has to be edited every time a new variant is added.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>There are only one or two variants that are genuinely unlikely to change — a plain conditional is more direct.</li>
                  <li>The varying behavior is a single, stateless operation and your language has first-class functions — a plain function/lambda often replaces the whole hierarchy with less ceremony.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are actually listening for:</strong> recognizing Strategy as &quot;favor composition over inheritance&quot; applied to an algorithm — instead of subclassing a base class per variant, you inject the varying behavior as a collaborator. Also, noticing that Strategy doesn&apos;t by itself solve which strategy to pick — that selection logic still has to live somewhere (often a factory), and conflating the two responsibilities is a common design smell interviewers probe for.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Payment processing</strong> — different payment methods (credit card, PayPal, store credit) each implementing a common <code>pay()</code> interface.</li>
              <li><strong>Sorting with a custom comparator</strong> — <code>Collections.sort(list, comparator)</code> in Java or <code>sorted(list, key=...)</code> in Python — the comparison logic is a swappable strategy.</li>
              <li><strong>Compression algorithms</strong> — a file archiver choosing between ZIP, GZIP, or LZMA strategies for the same &quot;compress this file&quot; operation.</li>
              <li><strong>Route calculation in navigation apps</strong> — fastest route, shortest distance, and avoid-tolls are each a different routing strategy behind the same &quot;calculate route&quot; call.</li>
              <li><strong>Validation rules</strong> — a form or API validating input using a pluggable strategy per field type or per business rule set.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>Same pattern, four languages. Every output shown here was captured from a real run — note the insufficient-funds message on the third checkout, and the successful charge on the fourth against the same, now-depleted balance.</p>
            <CodeTerminal snippets={snippets} />
          </section>

          <PageNav
            prev={{ label: 'Observer', href: '/pages/lld/design-patterns/behavioral/observer' }}
            next={{ label: 'Command', href: '/pages/lld/design-patterns/behavioral/command' }}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
