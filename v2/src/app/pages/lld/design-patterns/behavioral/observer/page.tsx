import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Observer Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `// Observer Pattern — a StockTicker (Subject) notifies registered Observers on price change.
// Compile: javac Observer.java
// Run:     java Observer

import java.util.ArrayList;
import java.util.List;

interface StockObserver {
    void update(String symbol, double price);
}

class StockTicker {
    private List<StockObserver> observers = new ArrayList<>();
    private String symbol;
    private double price;

    StockTicker(String symbol) {
        this.symbol = symbol;
    }

    void attach(StockObserver observer) {
        observers.add(observer);
    }

    void detach(StockObserver observer) {
        observers.remove(observer);
    }

    void setPrice(double newPrice) {
        this.price = newPrice;
        notifyObservers();
    }

    private void notifyObservers() {
        for (StockObserver observer : observers) {
            observer.update(symbol, price);
        }
    }
}

class MobileDisplay implements StockObserver {
    public void update(String symbol, double price) {
        System.out.println("[MobileDisplay] " + symbol + " is now $" + price);
    }
}

class EmailAlert implements StockObserver {
    private double threshold;

    EmailAlert(double threshold) {
        this.threshold = threshold;
    }

    public void update(String symbol, double price) {
        if (price >= threshold) {
            System.out.println("[EmailAlert] " + symbol + " crossed $" + threshold + " — now $" + price);
        }
    }
}

public class Observer {
    public static void main(String[] args) {
        StockTicker ticker = new StockTicker("ACME");

        MobileDisplay mobileDisplay = new MobileDisplay();
        EmailAlert emailAlert = new EmailAlert(100.0);

        ticker.attach(mobileDisplay);
        ticker.attach(emailAlert);

        System.out.println("Price update 1:");
        ticker.setPrice(95.0);

        System.out.println("Price update 2:");
        ticker.setPrice(102.5);

        System.out.println("Detaching EmailAlert.");
        ticker.detach(emailAlert);

        System.out.println("Price update 3:");
        ticker.setPrice(110.0);
    }
}`,
    output: `Price update 1:
[MobileDisplay] ACME is now $95.0
Price update 2:
[MobileDisplay] ACME is now $102.5
[EmailAlert] ACME crossed $100.0 — now $102.5
Detaching EmailAlert.
Price update 3:
[MobileDisplay] ACME is now $110.0`,
  },
  python: {
    code: `"""
Observer Pattern — a StockTicker (Subject) notifies registered Observers on price change.
Run: python observer.py
"""

from abc import ABC, abstractmethod


class StockObserver(ABC):
    @abstractmethod
    def update(self, symbol, price):
        ...


class StockTicker:
    """The Subject — maintains observers and notifies them on state change."""

    def __init__(self, symbol):
        self.symbol = symbol
        self.price = 0.0
        self._observers = []

    def attach(self, observer: StockObserver):
        self._observers.append(observer)

    def detach(self, observer: StockObserver):
        self._observers.remove(observer)

    def set_price(self, new_price):
        self.price = new_price
        self._notify_observers()

    def _notify_observers(self):
        for observer in self._observers:
            observer.update(self.symbol, self.price)


class MobileDisplay(StockObserver):
    def update(self, symbol, price):
        print(f"[MobileDisplay] {symbol} is now \${price}")


class EmailAlert(StockObserver):
    def __init__(self, threshold):
        self.threshold = threshold

    def update(self, symbol, price):
        if price >= self.threshold:
            print(f"[EmailAlert] {symbol} crossed \${self.threshold} — now \${price}")


if __name__ == "__main__":
    ticker = StockTicker("ACME")

    mobile_display = MobileDisplay()
    email_alert = EmailAlert(100.0)

    ticker.attach(mobile_display)
    ticker.attach(email_alert)

    print("Price update 1:")
    ticker.set_price(95.0)

    print("Price update 2:")
    ticker.set_price(102.5)

    print("Detaching EmailAlert.")
    ticker.detach(email_alert)

    print("Price update 3:")
    ticker.set_price(110.0)`,
    output: `Price update 1:
[MobileDisplay] ACME is now $95.0
Price update 2:
[MobileDisplay] ACME is now $102.5
[EmailAlert] ACME crossed $100.0 — now $102.5
Detaching EmailAlert.
Price update 3:
[MobileDisplay] ACME is now $110.0`,
  },
  javascript: {
    code: `/**
 * Observer Pattern — a StockTicker (Subject) notifies registered Observers on price change.
 * Run: node observer.js
 */

class StockTicker {
  constructor(symbol) {
    this.symbol = symbol;
    this.price = 0;
    this.observers = [];
  }

  attach(observer) {
    this.observers.push(observer);
  }

  detach(observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }

  setPrice(newPrice) {
    this.price = newPrice;
    this.notifyObservers();
  }

  notifyObservers() {
    this.observers.forEach(observer => observer.update(this.symbol, this.price));
  }
}

class MobileDisplay {
  update(symbol, price) {
    console.log(\`[MobileDisplay] \${symbol} is now $\${price}\`);
  }
}

class EmailAlert {
  constructor(threshold) {
    this.threshold = threshold;
  }

  update(symbol, price) {
    if (price >= this.threshold) {
      console.log(\`[EmailAlert] \${symbol} crossed $\${this.threshold} — now $\${price}\`);
    }
  }
}

const ticker = new StockTicker("ACME");

const mobileDisplay = new MobileDisplay();
const emailAlert = new EmailAlert(100.0);

ticker.attach(mobileDisplay);
ticker.attach(emailAlert);

console.log("Price update 1:");
ticker.setPrice(95.0);

console.log("Price update 2:");
ticker.setPrice(102.5);

console.log("Detaching EmailAlert.");
ticker.detach(emailAlert);

console.log("Price update 3:");
ticker.setPrice(110.0);

module.exports = { StockTicker, MobileDisplay, EmailAlert };`,
    output: `Price update 1:
[MobileDisplay] ACME is now $95
Price update 2:
[MobileDisplay] ACME is now $102.5
[EmailAlert] ACME crossed $100 — now $102.5
Detaching EmailAlert.
Price update 3:
[MobileDisplay] ACME is now $110`,
  },
  cpp: {
    code: `// Observer Pattern — a StockTicker (Subject) notifies registered Observers on price change.
// Compile: g++ -std=c++14 Observer.cpp -o observer
// Run:     ./observer

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

class StockObserver {
public:
    virtual void update(const std::string& symbol, double price) = 0;
    virtual ~StockObserver() = default;
};

class StockTicker {
public:
    explicit StockTicker(std::string symbol) : symbol_(std::move(symbol)), price_(0.0) {}

    void attach(StockObserver* observer) {
        observers_.push_back(observer);
    }

    void detach(StockObserver* observer) {
        observers_.erase(std::remove(observers_.begin(), observers_.end(), observer), observers_.end());
    }

    void setPrice(double newPrice) {
        price_ = newPrice;
        notifyObservers();
    }

private:
    std::string symbol_;
    double price_;
    std::vector<StockObserver*> observers_;

    void notifyObservers() {
        for (auto* observer : observers_) {
            observer->update(symbol_, price_);
        }
    }
};

class MobileDisplay : public StockObserver {
public:
    void update(const std::string& symbol, double price) override {
        std::cout << "[MobileDisplay] " << symbol << " is now $" << price << std::endl;
    }
};

class EmailAlert : public StockObserver {
public:
    explicit EmailAlert(double threshold) : threshold_(threshold) {}

    void update(const std::string& symbol, double price) override {
        if (price >= threshold_) {
            std::cout << "[EmailAlert] " << symbol << " crossed $" << threshold_ << " — now $" << price << std::endl;
        }
    }

private:
    double threshold_;
};

int main() {
    StockTicker ticker("ACME");

    MobileDisplay mobileDisplay;
    EmailAlert emailAlert(100.0);

    ticker.attach(&mobileDisplay);
    ticker.attach(&emailAlert);

    std::cout << "Price update 1:" << std::endl;
    ticker.setPrice(95.0);

    std::cout << "Price update 2:" << std::endl;
    ticker.setPrice(102.5);

    std::cout << "Detaching EmailAlert." << std::endl;
    ticker.detach(&emailAlert);

    std::cout << "Price update 3:" << std::endl;
    ticker.setPrice(110.0);

    return 0;
}`,
    output: `Price update 1:
[MobileDisplay] ACME is now $95
Price update 2:
[MobileDisplay] ACME is now $102.5
[EmailAlert] ACME crossed $100 — now $102.5
Detaching EmailAlert.
Price update 3:
[MobileDisplay] ACME is now $110`,
  },
};

const qaItems = [
  {
    q: 'What problem does Observer solve that a direct method call doesn’t?',
    a: 'A direct method call requires the caller to know exactly who it’s calling — adding a new reaction means editing the caller. Observer lets the Subject broadcast a single notification to an open-ended, changeable list of Observers it knows nothing about concretely, so new reactions can be added or removed without touching the Subject’s code.',
  },
  {
    q: 'What’s the difference between "push" and "pull" notification styles?',
    a: <>Push: the Subject sends the changed data directly as arguments to <code>update()</code>, e.g. <code>update(newPrice)</code> — simple, but couples the Observer interface to exactly what the Subject decides to send. Pull: <code>update()</code> receives a reference to the Subject itself, and the Observer calls getters to retrieve whatever it needs — more flexible for observers with differing data needs, slightly heavier interface.</>,
  },
  {
    q: 'How can Observer cause a memory leak, and how do you avoid it?',
    a: <>If a Subject holds strong references to Observers and an Observer is never explicitly detached, the Subject keeps it alive even after the rest of the program is done with it — garbage collectors can&apos;t reclaim it. Fix: always provide and call a <code>detach()</code>/unsubscribe method when an Observer is no longer needed, or use weak references from the Subject&apos;s side so Observers can still be collected.</>,
  },
  {
    q: 'How is Observer different from Mediator, since both deal with communication between objects?',
    a: 'Observer is one-directional and typically one-to-many: a Subject broadcasts state changes to Observers, who don’t talk back through the Subject. Mediator coordinates many-to-many communication between a set of Colleague objects that would otherwise need direct references to each other — the Mediator actively directs traffic between them, rather than just broadcasting a single event.',
  },
];

export default function ObserverPatternPage() {
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
              { label: 'Observer' },
            ]}
          />
          <h1 id="overview">Observer Pattern</h1>
          <p>Lets a Subject broadcast state changes to an open-ended list of Observers, without the Subject knowing anything about their concrete types.</p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>You&apos;re building a stock ticker. When a stock&apos;s price changes, three different parts of your app need to react: a mobile widget that redraws itself, an email alert service that fires off a message if the price crosses a threshold, and a logging service that records every tick for later analysis. The naive approach is to hard-code all three reactions directly inside the code that updates the price — but now that code has to know about every consumer, and adding a fourth consumer means going back and editing the price-update code again.</p>
            <p>Observer flips the dependency around. The thing that changes (the <code>Subject</code>, here the stock ticker) doesn&apos;t know or care what&apos;s watching it — it just keeps a list of <code>Observer</code>s and calls a single method on each of them, <code>update()</code>, whenever its state changes. Adding a new reaction to a price change means writing a new class that implements <code>Observer</code> and registering it — zero changes to the ticker itself.</p>

            <h3>How it&apos;s built</h3>
            <p>The <code>Subject</code> maintains a list of registered <code>Observer</code>s and exposes <code>attach(observer)</code> / <code>detach(observer)</code> methods to manage that list, plus a <code>notifyObservers()</code> method that loops through the list and calls <code>update()</code> on each one. Concrete Observers implement <code>update()</code> however they see fit — updating a display, sending an alert, writing a log line. The Subject typically calls <code>notifyObservers()</code> right after any state change that observers care about.</p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>Always pair <code>attach()</code> with a working <code>detach()</code>, and actually call it when an Observer no longer needs updates — otherwise the Subject keeps it alive indefinitely.</p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>Registering an Observer and forgetting to ever detach it — a classic, hard-to-spot memory leak in long-running UI apps and services.</p>
              </Callout>
            </TwoCol>

            <h3>Push vs. pull notification</h3>
            <p>There are two common styles for what <code>update()</code> receives. In the <strong>push</strong> style, the Subject passes the changed data directly as arguments (<code>update(newPrice)</code>) — simple, but couples the Observer interface to exactly what data the Subject happens to send. In the <strong>pull</strong> style, <code>update()</code> receives a reference to the Subject itself, and the Observer calls getters on it to pull whatever data it actually needs (<code>update(subject)</code>, then <code>subject.getPrice()</code>) — more flexible when different observers need different subsets of state, at the cost of a slightly heavier interface.</p>

            <h3>Where it bites you</h3>
            <p>If Subjects hold strong references to Observers and Observers are never explicitly detached, you get a memory leak — an Observer that should have been garbage collected stays alive because the Subject still references it. This is common enough in UI frameworks that some implementations use weak references specifically to avoid it. Also, if <code>notifyObservers()</code> triggers a long chain of updates that themselves cause further state changes, you can end up with subtle infinite update loops if you&apos;re not careful about what triggers what.</p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/observer/class-diagram.svg"
                alt="Observer pattern class diagram showing StockTicker Subject maintaining a list of StockObserver references, notifying MobileDisplay and EmailAlert on price changes"
              />
              <figcaption>StockTicker notifies every attached StockObserver whenever its price changes</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>Multiple, potentially unknown-in-advance parts of the system need to react to a single object&apos;s state changes.</li>
                  <li>You want to add or remove reactions to an event without modifying the thing producing the event.</li>
                  <li>The Subject and its Observers should be decoupled — the Subject shouldn&apos;t need to import or know the concrete types of everything watching it.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>There&apos;s exactly one consumer of the change, permanently — a direct method call is simpler and easier to trace than an indirection layer.</li>
                  <li>Notification order matters strictly and observers have interdependencies — that usually signals you want Mediator instead.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are actually listening for:</strong> recognizing this as the backbone of event-driven and reactive systems (pub/sub, GUI event listeners, MVC&apos;s model-notifies-view relationship) rather than treating it as an isolated toy pattern. Also, naming the memory-leak risk of Subjects holding onto Observers that were never detached, and knowing the push-vs-pull tradeoff for what data <code>update()</code> carries.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>GUI event listeners</strong> — a button doesn&apos;t know what code runs when it&apos;s clicked; it just notifies every registered click listener.</li>
              <li><strong>MVC architecture</strong> — the Model notifies registered Views whenever its data changes, so the View can re-render without the Model knowing anything about rendering.</li>
              <li><strong>Pub/sub messaging systems</strong> (Kafka topics, Redis pub/sub) — publishers emit events without knowing which or how many subscribers exist.</li>
              <li><strong>RxJS / reactive streams</strong> — Observables notify subscribed Observers whenever a new value is emitted.</li>
              <li><strong>Spreadsheet formula recalculation</strong> — changing one cell notifies every dependent cell/formula that references it, triggering a recalculation.</li>
              <li><strong>Node.js <code>EventEmitter</code></strong> — a direct, widely used implementation of the Observer pattern in the standard library.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>Same pattern, four languages. Every output shown here was captured from a real run — note EmailAlert only fires once the price crosses $100, and stops firing entirely once detached.</p>
            <CodeTerminal snippets={snippets} />
          </section>

          <PageNav
            prev={{ label: 'Proxy', href: '/pages/lld/design-patterns/structural/proxy' }}
            next={{ label: 'Strategy', href: '/pages/lld/design-patterns/behavioral/strategy' }}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
