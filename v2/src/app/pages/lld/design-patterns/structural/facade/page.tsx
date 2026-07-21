import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Facade Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `class InventoryService {
    boolean reserveItem(String item) {
        System.out.println("Inventory: reserved '" + item + "'");
        return true;
    }
}

class PaymentService {
    boolean charge(double amount) {
        System.out.println("Payment: charged $" + amount);
        return true;
    }
}

class ShippingService {
    void scheduleShipment(String item) {
        System.out.println("Shipping: scheduled shipment for '" + item + "'");
    }
}

class NotificationService {
    void sendConfirmation(String item) {
        System.out.println("Notification: confirmation email sent for '" + item + "'");
    }
}

class OrderFacade {
    private InventoryService inventory = new InventoryService();
    private PaymentService payment = new PaymentService();
    private ShippingService shipping = new ShippingService();
    private NotificationService notification = new NotificationService();

    void placeOrder(String item, double price) {
        System.out.println("--- Placing order for " + item + " ---");
        if (inventory.reserveItem(item) && payment.charge(price)) {
            shipping.scheduleShipment(item);
            notification.sendConfirmation(item);
            System.out.println("Order complete.");
        }
    }
}

public class Facade {
    public static void main(String[] args) {
        OrderFacade orderFacade = new OrderFacade();
        orderFacade.placeOrder("Wireless Mouse", 24.99);
    }
}`,
    output: `--- Placing order for Wireless Mouse ---
Inventory: reserved 'Wireless Mouse'
Payment: charged $24.99
Shipping: scheduled shipment for 'Wireless Mouse'
Notification: confirmation email sent for 'Wireless Mouse'
Order complete.`,
  },
  python: {
    code: `class InventoryService:
    def reserve_item(self, item):
        print(f"Inventory: reserved '{item}'")
        return True


class PaymentService:
    def charge(self, amount):
        print(f"Payment: charged \${amount}")
        return True


class ShippingService:
    def schedule_shipment(self, item):
        print(f"Shipping: scheduled shipment for '{item}'")


class NotificationService:
    def send_confirmation(self, item):
        print(f"Notification: confirmation email sent for '{item}'")


class OrderFacade:
    def __init__(self):
        self.inventory = InventoryService()
        self.payment = PaymentService()
        self.shipping = ShippingService()
        self.notification = NotificationService()

    def place_order(self, item, price):
        print(f"--- Placing order for {item} ---")
        if self.inventory.reserve_item(item) and self.payment.charge(price):
            self.shipping.schedule_shipment(item)
            self.notification.send_confirmation(item)
            print("Order complete.")


if __name__ == "__main__":
    order_facade = OrderFacade()
    order_facade.place_order("Wireless Mouse", 24.99)`,
    output: `--- Placing order for Wireless Mouse ---
Inventory: reserved 'Wireless Mouse'
Payment: charged $24.99
Shipping: scheduled shipment for 'Wireless Mouse'
Notification: confirmation email sent for 'Wireless Mouse'
Order complete.`,
  },
  javascript: {
    code: `class InventoryService {
  reserveItem(item) {
    console.log(\`Inventory: reserved '\${item}'\`);
    return true;
  }
}

class PaymentService {
  charge(amount) {
    console.log(\`Payment: charged $\${amount}\`);
    return true;
  }
}

class ShippingService {
  scheduleShipment(item) {
    console.log(\`Shipping: scheduled shipment for '\${item}'\`);
  }
}

class NotificationService {
  sendConfirmation(item) {
    console.log(\`Notification: confirmation email sent for '\${item}'\`);
  }
}

class OrderFacade {
  constructor() {
    this.inventory = new InventoryService();
    this.payment = new PaymentService();
    this.shipping = new ShippingService();
    this.notification = new NotificationService();
  }

  placeOrder(item, price) {
    console.log(\`--- Placing order for \${item} ---\`);
    if (this.inventory.reserveItem(item) && this.payment.charge(price)) {
      this.shipping.scheduleShipment(item);
      this.notification.sendConfirmation(item);
      console.log("Order complete.");
    }
  }
}

const orderFacade = new OrderFacade();
orderFacade.placeOrder("Wireless Mouse", 24.99);

module.exports = { OrderFacade };`,
    output: `--- Placing order for Wireless Mouse ---
Inventory: reserved 'Wireless Mouse'
Payment: charged $24.99
Shipping: scheduled shipment for 'Wireless Mouse'
Notification: confirmation email sent for 'Wireless Mouse'
Order complete.`,
  },
  cpp: {
    code: `#include <iostream>
#include <string>

class InventoryService {
public:
    bool reserveItem(const std::string& item) {
        std::cout << "Inventory: reserved '" << item << "'" << std::endl;
        return true;
    }
};

class PaymentService {
public:
    bool charge(double amount) {
        std::cout << "Payment: charged $" << amount << std::endl;
        return true;
    }
};

class ShippingService {
public:
    void scheduleShipment(const std::string& item) {
        std::cout << "Shipping: scheduled shipment for '" << item << "'" << std::endl;
    }
};

class NotificationService {
public:
    void sendConfirmation(const std::string& item) {
        std::cout << "Notification: confirmation email sent for '" << item << "'" << std::endl;
    }
};

class OrderFacade {
public:
    void placeOrder(const std::string& item, double price) {
        std::cout << "--- Placing order for " << item << " ---" << std::endl;
        if (inventory_.reserveItem(item) && payment_.charge(price)) {
            shipping_.scheduleShipment(item);
            notification_.sendConfirmation(item);
            std::cout << "Order complete." << std::endl;
        }
    }

private:
    InventoryService inventory_;
    PaymentService payment_;
    ShippingService shipping_;
    NotificationService notification_;
};

int main() {
    OrderFacade orderFacade;
    orderFacade.placeOrder("Wireless Mouse", 24.99);
    return 0;
}`,
    output: `--- Placing order for Wireless Mouse ---
Inventory: reserved 'Wireless Mouse'
Payment: charged $24.99
Shipping: scheduled shipment for 'Wireless Mouse'
Notification: confirmation email sent for 'Wireless Mouse'
Order complete.`,
  },
};

const qaItems = [
  {
    q: "What's the core difference between Facade and Adapter?",
    a: 'Facade simplifies access to something complicated — usually multiple subsystem classes coordinated toward one goal. Adapter fixes something incompatible — a specific interface mismatch. Facade typically wraps many classes into one entry point; Adapter typically wraps one adaptee into a specific expected shape.',
  },
  {
    q: 'Does using a Facade mean callers lose access to the underlying subsystems?',
    a: 'No. A Facade is a convenience layer for the common case — code needing finer-grained control can still reach past it and use subsystem classes directly. A well-designed Facade doesn\'t lock anything down.',
  },
  {
    q: 'How would you decide what belongs in the Facade versus the subsystems?',
    a: 'The Facade should hold only orchestration logic — the sequence and coordination of subsystem calls. Business logic specific to one subsystem (payment retry rules, inventory reservation expiry) belongs in that subsystem. If the facade accumulates subsystem-specific logic, it\'s becoming a god object instead of a thin coordination layer.',
  },
  {
    q: 'Can a Facade internally use an Adapter?',
    a: "Yes, commonly. If one of the subsystems a Facade coordinates has an incompatible interface, an Adapter can translate it first, and the Facade's orchestration logic calls the adapter rather than the raw subsystem.",
  },
];

export default function FacadePage() {
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
              { label: 'Facade' },
            ]}
          />
          <h1 id="overview">Facade Pattern</h1>
          <p>Provides a simplified, unified interface to a set of interfaces in a complex subsystem.</p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>
              Placing an online order touches half a dozen subsystems: check inventory, charge
              the payment gateway, reserve the item, generate an invoice, schedule shipment, send
              a confirmation email. If the checkout button&apos;s click handler has to call all
              six directly, in the right order, handling each one&apos;s error cases, that handler
              becomes a tangle of subsystem knowledge that has nothing to do with &quot;the user
              clicked checkout.&quot;
            </p>
            <p>
              A Facade wraps all of that behind one simple method:{' '}
              <code>orderFacade.placeOrder(cart)</code>. Internally it calls inventory, payment,
              shipping, etc. in the right order — but the checkout code only ever sees one call.
              The subsystems still exist and still work as before; the Facade just gives external
              code a much smaller surface to depend on.
            </p>

            <h3>How it&apos;s built</h3>
            <p>
              The <code>Facade</code> class holds references to (or creates) the subsystem objects
              it needs, and exposes a small number of high-level methods that internally
              orchestrate calls across those subsystems. The Facade doesn&apos;t hide the
              subsystems — code needing finer control can still reach past it and use the
              subsystems directly.
            </p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>
                  Keep the Facade as pure orchestration — the sequence and coordination of
                  subsystem calls. Business logic specific to one subsystem belongs in that
                  subsystem, not the facade.
                </p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>
                  Letting the Facade slowly accumulate every new feature until it becomes a god
                  object. If it starts holding subsystem-specific logic instead of just
                  coordinating, that logic is in the wrong place.
                </p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>
              A Facade trying to expose every possible option from every subsystem stops being a
              facade and just becomes another layer to maintain — the value is specifically in the
              common-case simplification, not full pass-through coverage.
            </p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/facade/class-diagram.svg"
                alt="Facade pattern class diagram showing Checkout Code calling OrderFacade.placeOrder(), which internally coordinates Inventory, Payment, Shipping, and Notification subsystems"
              />
              <figcaption>One call in, four subsystems coordinated internally</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>A task requires coordinating several subsystems in order, and most callers only care about the end result.</li>
                  <li>You want to reduce how many classes external code needs to know about, without removing access for callers that need finer control.</li>
                  <li>You&apos;re introducing a cleaner API in front of a legacy or third-party system you don&apos;t want to rewrite.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>There&apos;s really only one subsystem involved — nothing to simplify.</li>
                  <li>Every caller actually needs fine-grained control individually — a bypassed facade isn&apos;t earning its keep.</li>
                </ul>
              </Callout>
            </TwoCol>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Framework &quot;context&quot; objects</strong> (e.g., <code>FacesContext</code>) — convenient access to many underlying subsystems without the caller knowing how they&apos;re wired.</li>
              <li><strong>jQuery (historically)</strong> — a facade over inconsistent, verbose native DOM APIs, giving one simple <code>$(...)</code> interface.</li>
              <li><strong>Checkout/order-placement services</strong> — one <code>placeOrder()</code> call orchestrating inventory, payment, shipping, notifications.</li>
              <li><strong>Compiler front-ends</strong> — a single <code>compile(sourceFile)</code> entry point coordinating lexing, parsing, analysis, codegen.</li>
              <li><strong>OS system calls</strong> — <code>open()</code> or <code>read()</code> hides enormous complexity (drivers, file systems, permissions) behind one small interface.</li>
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
            prev={{ label: 'Decorator', href: '/pages/lld/design-patterns/structural/decorator' }}
            next={{ label: 'Flyweight', href: '/pages/lld/design-patterns/structural/flyweight' }}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
