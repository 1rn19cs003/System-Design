import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Factory Method Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `interface Notification {
    void notifyUser();
}

class EmailNotification implements Notification {
    public void notifyUser() {
        System.out.println("Sending an EMAIL notification.");
    }
}

class SMSNotification implements Notification {
    public void notifyUser() {
        System.out.println("Sending an SMS notification.");
    }
}

abstract class NotificationFactory {
    abstract Notification createNotification();

    void send() {
        Notification notification = createNotification();
        notification.notifyUser();
    }
}

class EmailNotificationFactory extends NotificationFactory {
    Notification createNotification() {
        return new EmailNotification();
    }
}

class SMSNotificationFactory extends NotificationFactory {
    Notification createNotification() {
        return new SMSNotification();
    }
}

public class FactoryMethod {
    public static void main(String[] args) {
        NotificationFactory emailFactory = new EmailNotificationFactory();
        NotificationFactory smsFactory = new SMSNotificationFactory();

        emailFactory.send();
        smsFactory.send();
    }
}`,
    output: `Sending an EMAIL notification.
Sending an SMS notification.`,
  },
  python: {
    code: `from abc import ABC, abstractmethod


class Notification(ABC):
    @abstractmethod
    def notify_user(self):
        ...


class EmailNotification(Notification):
    def notify_user(self):
        print("Sending an EMAIL notification.")


class SMSNotification(Notification):
    def notify_user(self):
        print("Sending an SMS notification.")


class NotificationFactory(ABC):
    @abstractmethod
    def create_notification(self) -> Notification:
        ...

    def send(self):
        notification = self.create_notification()
        notification.notify_user()


class EmailNotificationFactory(NotificationFactory):
    def create_notification(self) -> Notification:
        return EmailNotification()


class SMSNotificationFactory(NotificationFactory):
    def create_notification(self) -> Notification:
        return SMSNotification()


if __name__ == "__main__":
    email_factory = EmailNotificationFactory()
    sms_factory = SMSNotificationFactory()

    email_factory.send()
    sms_factory.send()`,
    output: `Sending an EMAIL notification.
Sending an SMS notification.`,
  },
  javascript: {
    code: `class Notification {
  notifyUser() {
    throw new Error("notifyUser() must be implemented");
  }
}

class EmailNotification extends Notification {
  notifyUser() {
    console.log("Sending an EMAIL notification.");
  }
}

class SMSNotification extends Notification {
  notifyUser() {
    console.log("Sending an SMS notification.");
  }
}

class NotificationFactory {
  createNotification() {
    throw new Error("createNotification() must be implemented");
  }

  send() {
    const notification = this.createNotification();
    notification.notifyUser();
  }
}

class EmailNotificationFactory extends NotificationFactory {
  createNotification() {
    return new EmailNotification();
  }
}

class SMSNotificationFactory extends NotificationFactory {
  createNotification() {
    return new SMSNotification();
  }
}

const emailFactory = new EmailNotificationFactory();
const smsFactory = new SMSNotificationFactory();

emailFactory.send();
smsFactory.send();

module.exports = { NotificationFactory, EmailNotificationFactory, SMSNotificationFactory };`,
    output: `Sending an EMAIL notification.
Sending an SMS notification.`,
  },
  cpp: {
    code: `#include <iostream>
#include <memory>

class Notification {
public:
    virtual void notifyUser() = 0;
    virtual ~Notification() = default;
};

class EmailNotification : public Notification {
public:
    void notifyUser() override {
        std::cout << "Sending an EMAIL notification." << std::endl;
    }
};

class SMSNotification : public Notification {
public:
    void notifyUser() override {
        std::cout << "Sending an SMS notification." << std::endl;
    }
};

class NotificationFactory {
public:
    virtual std::unique_ptr<Notification> createNotification() = 0;
    virtual ~NotificationFactory() = default;

    void send() {
        auto notification = createNotification();
        notification->notifyUser();
    }
};

class EmailNotificationFactory : public NotificationFactory {
public:
    std::unique_ptr<Notification> createNotification() override {
        return std::make_unique<EmailNotification>();
    }
};

class SMSNotificationFactory : public NotificationFactory {
public:
    std::unique_ptr<Notification> createNotification() override {
        return std::make_unique<SMSNotification>();
    }
};

int main() {
    EmailNotificationFactory emailFactory;
    SMSNotificationFactory smsFactory;

    emailFactory.send();
    smsFactory.send();

    return 0;
}`,
    output: `Sending an EMAIL notification.
Sending an SMS notification.`,
  },
};

const qaItems = [
  {
    q: "What's the difference between Factory Method and a \"simple factory\"?",
    a: 'A simple factory is one method (often static) with a switch/if-else returning different concrete types — convenient, but not a GoF pattern, and it becomes a bottleneck as types grow since everyone edits the same method. Factory Method uses inheritance: an abstract Creator declares the factory method, and each ConcreteCreator subclass overrides it. Adding a type means adding a subclass, not editing existing code.',
  },
  {
    q: 'How does Factory Method relate to the Open/Closed Principle?',
    a: "It's a textbook example. The code that uses products is closed for modification — written once against the Product interface. The system stays open for extension because adding a new product type just means adding a new ConcreteCreator/ConcreteProduct pair, with zero changes to existing classes.",
  },
  {
    q: 'When would you choose Abstract Factory over Factory Method?',
    a: 'Factory Method creates one product. Abstract Factory creates families of related products that need to stay consistent with each other (a "Windows" factory producing a Windows button AND a Windows checkbox, so you never mix a Windows button with a Mac checkbox). If you only need one kind of object at a time, Factory Method is simpler and sufficient.',
  },
  {
    q: 'Can the Creator provide a default implementation of the factory method?',
    a: 'Yes — common in practice. The base Creator can implement the factory method to return a default product, and only some subclasses override it. This avoids forcing every subclass to implement the method if most are happy with the default.',
  },
];

export default function FactoryMethodPage() {
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
              { label: 'Factory Method' },
            ]}
          />
          <h1 id="overview">Factory Method Pattern</h1>
          <p>
            Lets a class defer instantiation to subclasses — a &quot;factory method&quot; decides
            which concrete class gets created, so the calling code never has to.
          </p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>
              You&apos;re building a notification system. Today it sends email. Tomorrow product
              wants SMS too. If every place in your code that sends a notification does{' '}
              <code>new EmailNotification()</code> directly, adding SMS means hunting down every
              one of those call sites. Worse, the code that sends notifications now has to know
              about every type that exists, even though all it wants to do is &quot;send a
              notification.&quot;
            </p>
            <p>
              Factory Method separates deciding which class to instantiate from using the object
              once you have it. The calling code asks a factory for a notification and gets back
              something satisfying the <code>Notification</code> interface — it never types{' '}
              <code>new EmailNotification()</code> itself.
            </p>

            <h3>How it's built</h3>
            <p>
              There&apos;s a <code>Creator</code> (often abstract) with a factory method that
              returns a <code>Product</code>. Each <code>ConcreteCreator</code> overrides it to
              return a specific <code>ConcreteProduct</code>. The rest of the Creator&apos;s logic
              — the part that actually uses the product — is written once, against the{' '}
              <code>Product</code> interface, and never changes when a new product type is added.
            </p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>
                  Write the &quot;use the product&quot; logic once in the base Creator, against
                  the interface. Only the creation step (<code>createNotification()</code>) should
                  differ between subclasses.
                </p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>
                  Calling this pattern anytime a function returns an object. A static method with
                  a big switch statement is a &quot;simple factory&quot; — useful, but not Factory
                  Method, which specifically relies on subclassing and polymorphism.
                </p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>
              Every new product type means a new Creator subclass — more classes to navigate, and
              for a small, stable set of types that can be more ceremony than value. It also
              doesn&apos;t solve the problem of who decides <em>which</em> concrete factory to use
              in the first place — something, somewhere, still makes that call. Factory Method
              just keeps that decision from leaking into the code that uses the product.
            </p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/factory-method/class-diagram.svg"
                alt="Factory Method class diagram showing an abstract NotificationFactory with concrete EmailNotificationFactory and SMSNotificationFactory subclasses, each producing a matching concrete Notification product"
              />
              <figcaption>Creator hierarchy (left) produces matching Product hierarchy (right)</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>You don&apos;t know ahead of time exactly which class you&apos;ll need — it depends on config, input, or subclassing.</li>
                  <li>You want to add new product types without touching code that uses existing products.</li>
                  <li>Creation involves enough setup logic to deserve its own method/class.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>You only have one or two product types that aren&apos;t going to grow — a plain constructor is more honest.</li>
                  <li>The &quot;products&quot; don&apos;t share a meaningful common interface.</li>
                </ul>
              </Callout>
            </TwoCol>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Java&apos;s <code>Calendar.getInstance()</code></strong> — the concrete class depends on locale/timezone at runtime; the caller never picks it directly.</li>
              <li><strong><code>ResourceBundle.getBundle()</code></strong> — returns a locale-specific subclass without the caller knowing which one.</li>
              <li><strong>Document editors</strong> — &quot;create document&quot; might return a Word, Spreadsheet, or Presentation document, all behind a common <code>Document</code> interface.</li>
              <li><strong>SLF4J&apos;s <code>LoggerFactory.getLogger()</code></strong> — returns different concrete logger implementations depending on what&apos;s on the classpath.</li>
              <li><strong>Cross-platform UI toolkits</strong> — <code>createButton()</code> returns a Windows/Mac/Linux button depending on the OS; the rest of the app just calls <code>.render()</code>.</li>
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
            prev={{ label: 'Singleton', href: '/pages/lld/design-patterns/creational/singleton' }}
            next={{ label: 'Abstract Factory', href: '/pages/lld/design-patterns/creational/abstract-factory' }}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
