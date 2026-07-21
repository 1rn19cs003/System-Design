import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'SOLID Principles — System Design Architectures',
};

const snippets = {
  java: {
    code: `import java.util.*;

public class SolidDemo {
    interface Notifier {
        String send(String message);
    }

    static class EmailNotifier implements Notifier {
        public String send(String message) { return "[Email] " + message; }
    }

    static class SMSNotifier implements Notifier {
        public String send(String message) { return "[SMS] " + message; }
    }

    static class SlackNotifier implements Notifier {
        public String send(String message) { return "[Slack] " + message; }
    }

    static class NotificationService {
        List<Notifier> notifiers;
        NotificationService(List<Notifier> notifiers) { this.notifiers = notifiers; }

        List<String> broadcast(String message) {
            List<String> results = new ArrayList<>();
            for (Notifier notifier : notifiers) results.add(notifier.send(message));
            return results;
        }
    }

    public static void main(String[] args) {
        List<Notifier> notifiers = List.of(new EmailNotifier(), new SMSNotifier(), new SlackNotifier());
        NotificationService service = new NotificationService(notifiers);
        List<String> results = service.broadcast("Deployment finished");
        for (String result : results) System.out.println(result);
        System.out.printf("Sent through %d channels without changing NotificationService.%n", notifiers.size());
    }
}`,
    output: `[Email] Deployment finished
[SMS] Deployment finished
[Slack] Deployment finished
Sent through 3 channels without changing NotificationService.`,
  },
  python: {
    code: `from abc import ABC, abstractmethod


class Notifier(ABC):
    @abstractmethod
    def send(self, message):
        pass


class EmailNotifier(Notifier):
    def send(self, message):
        return f"[Email] {message}"


class SMSNotifier(Notifier):
    def send(self, message):
        return f"[SMS] {message}"


class SlackNotifier(Notifier):
    def send(self, message):
        return f"[Slack] {message}"


class NotificationService:
    def __init__(self, notifiers):
        self.notifiers = notifiers

    def broadcast(self, message):
        return [notifier.send(message) for notifier in self.notifiers]


if __name__ == "__main__":
    notifiers = [EmailNotifier(), SMSNotifier(), SlackNotifier()]
    service = NotificationService(notifiers)
    results = service.broadcast("Deployment finished")
    for result in results:
        print(result)
    print(f"Sent through {len(notifiers)} channels without changing NotificationService.")`,
    output: `[Email] Deployment finished
[SMS] Deployment finished
[Slack] Deployment finished
Sent through 3 channels without changing NotificationService.`,
  },
  javascript: {
    code: `class EmailNotifier {
  send(message) { return \`[Email] \${message}\`; }
}
class SMSNotifier {
  send(message) { return \`[SMS] \${message}\`; }
}
class SlackNotifier {
  send(message) { return \`[Slack] \${message}\`; }
}

class NotificationService {
  constructor(notifiers) {
    this.notifiers = notifiers;
  }
  broadcast(message) {
    return this.notifiers.map((notifier) => notifier.send(message));
  }
}

const notifiers = [new EmailNotifier(), new SMSNotifier(), new SlackNotifier()];
const service = new NotificationService(notifiers);
const results = service.broadcast("Deployment finished");
results.forEach((result) => console.log(result));
console.log(\`Sent through \${notifiers.length} channels without changing NotificationService.\`);`,
    output: `[Email] Deployment finished
[SMS] Deployment finished
[Slack] Deployment finished
Sent through 3 channels without changing NotificationService.`,
  },
  cpp: {
    code: `#include <iostream>
#include <vector>
#include <memory>
#include <string>

class Notifier {
public:
    virtual std::string send(const std::string& message) const = 0;
    virtual ~Notifier() = default;
};

class EmailNotifier : public Notifier {
public:
    std::string send(const std::string& message) const override { return "[Email] " + message; }
};
class SMSNotifier : public Notifier {
public:
    std::string send(const std::string& message) const override { return "[SMS] " + message; }
};
class SlackNotifier : public Notifier {
public:
    std::string send(const std::string& message) const override { return "[Slack] " + message; }
};

class NotificationService {
public:
    explicit NotificationService(std::vector<std::unique_ptr<Notifier>> notifiers)
        : notifiers(std::move(notifiers)) {}

    std::vector<std::string> broadcast(const std::string& message) const {
        std::vector<std::string> results;
        for (const auto& notifier : notifiers) results.push_back(notifier->send(message));
        return results;
    }

    size_t channelCount() const { return notifiers.size(); }

private:
    std::vector<std::unique_ptr<Notifier>> notifiers;
};

int main() {
    std::vector<std::unique_ptr<Notifier>> notifiers;
    notifiers.push_back(std::make_unique<EmailNotifier>());
    notifiers.push_back(std::make_unique<SMSNotifier>());
    notifiers.push_back(std::make_unique<SlackNotifier>());

    NotificationService service(std::move(notifiers));
    auto results = service.broadcast("Deployment finished");
    for (const auto& result : results) std::cout << result << std::endl;
    std::cout << "Sent through " << service.channelCount()
               << " channels without changing NotificationService." << std::endl;
    return 0;
}`,
    output: `[Email] Deployment finished
[SMS] Deployment finished
[Slack] Deployment finished
Sent through 3 channels without changing NotificationService.`,
  },
};

const qaItems = [
  {
    q: 'What does Single Responsibility actually mean, precisely?',
    a: "A class should have exactly one reason to change — one responsibility, one axis along which requirements might shift. It doesn't mean \"a class should only have one method\"; it means the class's various methods should all serve the same cohesive purpose.",
  },
  {
    q: 'How do you satisfy Open/Closed in practice?',
    a: 'Depend on an interface or abstract base class, and add new behavior by writing a new implementation of it — rather than adding a new if/switch branch to an existing function every time a new case shows up.',
  },
  {
    q: 'Give an example of a Liskov Substitution violation.',
    a: "A classic one: Square extending Rectangle where setting width also changes height to keep it square. Code that sets a rectangle's width and height independently, expecting the area to update predictably, breaks silently when handed a Square — the subclass doesn't honor the parent's contract.",
  },
  {
    q: 'Why does Interface Segregation matter if a language allows multiple small interfaces anyway?',
    a: "Because without discipline, teams still often reach for one large \"do everything\" interface. Segregating it isn't about language capability — it's a design decision to keep each dependency narrow, so implementers and callers alike only deal with the methods they actually need.",
  },
  {
    q: "What's the difference between Dependency Inversion and dependency injection?",
    a: 'Dependency Inversion is the principle: depend on abstractions, not concrete details. Dependency injection is one common technique for achieving it — passing a concrete implementation into a class from the outside (constructor, setter, or framework), rather than the class constructing its own dependency internally.',
  },
];

export default function SolidPrinciplesPage() {
  return (
    <>
      <Header />
      <div className="layout">
        <TopicSidebar
          backHref="/pages/lld"
          backLabel="Back to LLD"
          toc={[
            { id: 'overview', label: 'Overview' },
            { id: 'plain-english', label: 'In Plain English' },
            { id: 'theory', label: 'Theory & Diagrams' },
            { id: 'trade-offs', label: 'Trade-offs' },
            { id: 'real-world', label: 'Real-World Examples' },
            { id: 'interview-questions', label: 'Interview Questions' },
            { id: 'code', label: 'Code & Output' },
          ]}
        />

        <main className="content narrow">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'LLD', href: '/pages/lld' }, { label: 'SOLID Principles' }]} />
          <h1 id="overview">SOLID Principles</h1>
          <p>
            Five naming conventions for the same underlying goal: code that&apos;s easy to change
            safely, because the parts that need to change are isolated from the parts that
            don&apos;t.
          </p>

          <section id="plain-english">
            <h2>In Plain English</h2>
            <p>Picture a well-run restaurant kitchen, and map each SOLID letter onto a habit that keeps it running smoothly.</p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/lld-solid/kitchen-roles-analogy.svg"
                alt="Five kitchen habits mapped to S, O, L, I, D: one cook one job, new menu items as new recipe cards, any substitute cook can step in, waiters only get an order pad not the whole manual, and the kitchen depending on a generic supplier not one named farm"
              />
              <figcaption>Same five ideas, applied to code instead of a kitchen</figcaption>
            </figure>

            <TwoCol>
              <Callout kind="good" title="New to this? Start here">
                <p>
                  All five letters are really one idea repeated from different angles: keep each part
                  of your code doing one job, and let those parts talk to each other through simple,
                  stable interfaces instead of hardcoded specifics.
                </p>
              </Callout>
              <Callout kind="bad" title="Already comfortable? Push further">
                <p>
                  SOLID isn&apos;t a checklist to satisfy on every class — it&apos;s a set of
                  pressure-release valves you reach for when a specific kind of change is getting
                  painful. Applying all five everywhere, all the time, creates its own mess: too much
                  indirection for code that never actually needed to flex.
                </p>
              </Callout>
            </TwoCol>
          </section>

          <section id="theory">
            <h2>Theory &amp; Diagrams</h2>

            <h3>The five principles</h3>
            <p>
              SOLID is five separate ideas about how to structure classes and their dependencies so
              that change in one place doesn&apos;t cascade into changes everywhere else.
            </p>

            <figure>
              <img
                className="diagram-img"
                src="/assets/lld-solid/solid-overview.svg"
                alt="Single Responsibility: a class should have exactly one reason to change. Open/Closed: open for extension, closed for modification. Liskov Substitution: a subclass must be usable anywhere its parent is expected. Interface Segregation: don't force a class to depend on methods it never uses. Dependency Inversion: depend on abstractions, not concrete implementations."
              />
              <figcaption>Each principle targets a different way code becomes hard to change safely</figcaption>
            </figure>

            <h3>Single Responsibility (S)</h3>
            <p>
              A class with two responsibilities has two reasons to change — and a change driven by
              one responsibility risks breaking the other. Splitting them means each class only ever
              has to be touched for one kind of reason.
            </p>

            <h3>Open/Closed (O)</h3>
            <p>
              Code should be open for extension (new behavior can be added) but closed for
              modification (existing, working code doesn&apos;t need to be edited to add that
              behavior). In practice, this usually means depending on an interface and adding new
              implementations rather than adding new branches to an existing function.
            </p>

            <h3>Liskov Substitution (L)</h3>
            <p>
              If <code>Bird</code> has a <code>fly()</code> method, a <code>Penguin</code> subclass
              that throws an exception from <code>fly()</code> violates this principle — code written
              against <code>Bird</code> silently breaks the moment it receives a{' '}
              <code>Penguin</code>. A subclass has to honor the behavior its parent promises, not just
              its method signatures.
            </p>

            <h3>Interface Segregation (I)</h3>
            <p>
              A single fat interface with fifteen methods forces every implementer to provide (or
              stub out) methods it doesn&apos;t need. Splitting it into several small, focused
              interfaces means a class only has to depend on the handful of methods it actually uses.
            </p>

            <h3>Dependency Inversion (D)</h3>
            <p>
              High-level code (business logic) shouldn&apos;t depend directly on low-level details (a
              specific database driver, a specific email provider). Both should depend on a shared
              abstraction, so the low-level detail can be swapped without touching the high-level
              logic at all.
            </p>
          </section>

          <section id="trade-offs">
            <h2>Trade-offs</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Apply SOLID where">
                <ul>
                  <li>A specific part of the system is genuinely expected to change or grow (new payment providers, new notification channels).</li>
                  <li>Multiple teams or contributors touch the same code and need stable boundaries between their changes.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Be careful applying SOLID where">
                <ul>
                  <li>The code is small, stable, and unlikely to change — premature abstraction here is pure overhead with no future payoff.</li>
                  <li>You&apos;re adding an interface &quot;just in case,&quot; with no second implementation ever planned.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are listening for:</strong> a correct, specific definition of
              each letter (not five interchangeable synonyms for &quot;clean code&quot;), and the
              maturity to say SOLID is a tool for managing a particular kind of change, not a rule to
              apply uniformly everywhere.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If you&apos;re a fresher:</strong> being able to state all five principles
              correctly, one sentence each, with a tiny example per principle, is what most interviews
              are checking for at this stage.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>If you&apos;re ~3 years in:</strong> be ready to describe a real violation you
              found and fixed — which principle it broke, what the fix looked like, and whether the
              abstraction you added was worth its cost.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Payment gateway integrations</strong> — a <code>PaymentProcessor</code> interface with <code>StripeProcessor</code>, <code>PayPalProcessor</code> implementations lets a new provider be added (Open/Closed) without touching checkout logic that depends only on the interface (Dependency Inversion).</li>
              <li><strong>Logging frameworks</strong> — most define a small <code>Logger</code> interface so the actual destination (console, file, remote service) can change without touching any code that just calls <code>log()</code>.</li>
              <li><strong>Repository pattern in ORMs</strong> — business logic depends on a <code>UserRepository</code> interface, not directly on SQL or a specific database driver, so the storage layer can be swapped in tests or in production.</li>
              <li><strong>Plugin systems</strong> — IDEs and browsers define a plugin interface (Interface Segregation: each plugin only implements what it needs) so new plugins can be added (Open/Closed) without modifying the host application.</li>
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
              A real notification system demonstrating Open/Closed and Dependency Inversion together:{' '}
              <code>NotificationService</code> depends only on an abstract <code>Notifier</code>, and
              three concrete channels (Email, SMS, Slack) are added without a single line of{' '}
              <code>NotificationService</code> ever changing. Like the OOP Fundamentals example, this
              is deterministic logic, not timing — the output is identical every run, in every
              language.
            </p>
            <CodeTerminal
              snippets={snippets}
              note="Adding a fourth channel means writing one new class implementing Notifier — NotificationService's code above is never touched."
            />
          </section>

          <PageNav
            prev={{ label: 'OOP Fundamentals', href: '/pages/lld/oop-fundamentals' }}
            next={{ label: 'LLD Capstones', href: '/pages/lld/capstones' }}
          />
        </main>
      </div>

      <Footer
        sectionColumn={{
          title: 'LLD',
          links: [
            { label: 'OOP Fundamentals', href: '/pages/lld/oop-fundamentals' },
            { label: 'SOLID Principles', href: '/pages/lld/solid-principles' },
            { label: 'LLD Capstones', href: '/pages/lld/capstones' },
          ],
        }}
      />
    </>
  );
}
