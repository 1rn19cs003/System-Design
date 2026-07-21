import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Chain of Responsibility Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `// Chain of Responsibility — an expense request travels through TeamLead -> Manager -> Director.
// Compile: javac ChainOfResponsibility.java
// Run:     java ChainOfResponsibility

abstract class ApprovalHandler {
    protected ApprovalHandler next;

    ApprovalHandler setNext(ApprovalHandler next) {
        this.next = next;
        return next;
    }

    abstract void handle(double amount);
}

class TeamLead extends ApprovalHandler {
    void handle(double amount) {
        if (amount <= 1000) {
            System.out.println("TeamLead approved expense of $" + amount);
        } else if (next != null) {
            System.out.println("TeamLead cannot approve $" + amount + " — escalating.");
            next.handle(amount);
        } else {
            System.out.println("No handler could approve $" + amount);
        }
    }
}

class Manager extends ApprovalHandler {
    void handle(double amount) {
        if (amount <= 5000) {
            System.out.println("Manager approved expense of $" + amount);
        } else if (next != null) {
            System.out.println("Manager cannot approve $" + amount + " — escalating.");
            next.handle(amount);
        } else {
            System.out.println("No handler could approve $" + amount);
        }
    }
}

class Director extends ApprovalHandler {
    void handle(double amount) {
        if (amount <= 20000) {
            System.out.println("Director approved expense of $" + amount);
        } else if (next != null) {
            next.handle(amount);
        } else {
            System.out.println("No handler could approve $" + amount + " — needs CEO sign-off.");
        }
    }
}

public class ChainOfResponsibility {
    public static void main(String[] args) {
        ApprovalHandler teamLead = new TeamLead();
        ApprovalHandler manager = new Manager();
        ApprovalHandler director = new Director();

        teamLead.setNext(manager).setNext(director);

        System.out.println("Requesting approval for $500:");
        teamLead.handle(500);

        System.out.println("Requesting approval for $3000:");
        teamLead.handle(3000);

        System.out.println("Requesting approval for $18000:");
        teamLead.handle(18000);

        System.out.println("Requesting approval for $50000:");
        teamLead.handle(50000);
    }
}`,
    output: `Requesting approval for $500:
TeamLead approved expense of $500.0
Requesting approval for $3000:
TeamLead cannot approve $3000.0 — escalating.
Manager approved expense of $3000.0
Requesting approval for $18000:
TeamLead cannot approve $18000.0 — escalating.
Manager cannot approve $18000.0 — escalating.
Director approved expense of $18000.0
Requesting approval for $50000:
TeamLead cannot approve $50000.0 — escalating.
Manager cannot approve $50000.0 — escalating.
No handler could approve $50000.0 — needs CEO sign-off.`,
  },
  python: {
    code: `"""
Chain of Responsibility — an expense request travels through TeamLead -> Manager -> Director.
Run: python chain_of_responsibility.py
"""

from abc import ABC, abstractmethod


class ApprovalHandler(ABC):
    def __init__(self):
        self.next = None

    def set_next(self, handler):
        self.next = handler
        return handler

    @abstractmethod
    def handle(self, amount):
        ...


class TeamLead(ApprovalHandler):
    def handle(self, amount):
        if amount <= 1000:
            print(f"TeamLead approved expense of \${amount}")
        elif self.next:
            print(f"TeamLead cannot approve \${amount} — escalating.")
            self.next.handle(amount)
        else:
            print(f"No handler could approve \${amount}")


class Manager(ApprovalHandler):
    def handle(self, amount):
        if amount <= 5000:
            print(f"Manager approved expense of \${amount}")
        elif self.next:
            print(f"Manager cannot approve \${amount} — escalating.")
            self.next.handle(amount)
        else:
            print(f"No handler could approve \${amount}")


class Director(ApprovalHandler):
    def handle(self, amount):
        if amount <= 20000:
            print(f"Director approved expense of \${amount}")
        elif self.next:
            self.next.handle(amount)
        else:
            print(f"No handler could approve \${amount} — needs CEO sign-off.")


if __name__ == "__main__":
    team_lead = TeamLead()
    manager = Manager()
    director = Director()

    team_lead.set_next(manager).set_next(director)

    print("Requesting approval for $500:")
    team_lead.handle(500)

    print("Requesting approval for $3000:")
    team_lead.handle(3000)

    print("Requesting approval for $18000:")
    team_lead.handle(18000)

    print("Requesting approval for $50000:")
    team_lead.handle(50000)`,
    output: `Requesting approval for $500:
TeamLead approved expense of $500
Requesting approval for $3000:
TeamLead cannot approve $3000 — escalating.
Manager approved expense of $3000
Requesting approval for $18000:
TeamLead cannot approve $18000 — escalating.
Manager cannot approve $18000 — escalating.
Director approved expense of $18000
Requesting approval for $50000:
TeamLead cannot approve $50000 — escalating.
Manager cannot approve $50000 — escalating.
No handler could approve $50000 — needs CEO sign-off.`,
  },
  javascript: {
    code: `/**
 * Chain of Responsibility — an expense request travels through TeamLead -> Manager -> Director.
 * Run: node chain_of_responsibility.js
 */

class ApprovalHandler {
  setNext(handler) {
    this.next = handler;
    return handler;
  }
}

class TeamLead extends ApprovalHandler {
  handle(amount) {
    if (amount <= 1000) {
      console.log(\`TeamLead approved expense of $\${amount}\`);
    } else if (this.next) {
      console.log(\`TeamLead cannot approve $\${amount} — escalating.\`);
      this.next.handle(amount);
    } else {
      console.log(\`No handler could approve $\${amount}\`);
    }
  }
}

class Manager extends ApprovalHandler {
  handle(amount) {
    if (amount <= 5000) {
      console.log(\`Manager approved expense of $\${amount}\`);
    } else if (this.next) {
      console.log(\`Manager cannot approve $\${amount} — escalating.\`);
      this.next.handle(amount);
    } else {
      console.log(\`No handler could approve $\${amount}\`);
    }
  }
}

class Director extends ApprovalHandler {
  handle(amount) {
    if (amount <= 20000) {
      console.log(\`Director approved expense of $\${amount}\`);
    } else if (this.next) {
      this.next.handle(amount);
    } else {
      console.log(\`No handler could approve $\${amount} — needs CEO sign-off.\`);
    }
  }
}

const teamLead = new TeamLead();
const manager = new Manager();
const director = new Director();

teamLead.setNext(manager).setNext(director);

console.log("Requesting approval for $500:");
teamLead.handle(500);

console.log("Requesting approval for $3000:");
teamLead.handle(3000);

console.log("Requesting approval for $18000:");
teamLead.handle(18000);

console.log("Requesting approval for $50000:");
teamLead.handle(50000);

module.exports = { TeamLead, Manager, Director };`,
    output: `Requesting approval for $500:
TeamLead approved expense of $500
Requesting approval for $3000:
TeamLead cannot approve $3000 — escalating.
Manager approved expense of $3000
Requesting approval for $18000:
TeamLead cannot approve $18000 — escalating.
Manager cannot approve $18000 — escalating.
Director approved expense of $18000
Requesting approval for $50000:
TeamLead cannot approve $50000 — escalating.
Manager cannot approve $50000 — escalating.
No handler could approve $50000 — needs CEO sign-off.`,
  },
  cpp: {
    code: `// Chain of Responsibility — an expense request travels through TeamLead -> Manager -> Director.
// Compile: g++ -std=c++14 ChainOfResponsibility.cpp -o chain
// Run:     ./chain

#include <iostream>

class ApprovalHandler {
public:
    virtual void handle(double amount) = 0;
    virtual ~ApprovalHandler() = default;

    ApprovalHandler* setNext(ApprovalHandler* handler) {
        next_ = handler;
        return handler;
    }

protected:
    ApprovalHandler* next_ = nullptr;
};

class TeamLead : public ApprovalHandler {
public:
    void handle(double amount) override {
        if (amount <= 1000) {
            std::cout << "TeamLead approved expense of $" << amount << std::endl;
        } else if (next_) {
            std::cout << "TeamLead cannot approve $" << amount << " — escalating." << std::endl;
            next_->handle(amount);
        } else {
            std::cout << "No handler could approve $" << amount << std::endl;
        }
    }
};

class Manager : public ApprovalHandler {
public:
    void handle(double amount) override {
        if (amount <= 5000) {
            std::cout << "Manager approved expense of $" << amount << std::endl;
        } else if (next_) {
            std::cout << "Manager cannot approve $" << amount << " — escalating." << std::endl;
            next_->handle(amount);
        } else {
            std::cout << "No handler could approve $" << amount << std::endl;
        }
    }
};

class Director : public ApprovalHandler {
public:
    void handle(double amount) override {
        if (amount <= 20000) {
            std::cout << "Director approved expense of $" << amount << std::endl;
        } else if (next_) {
            next_->handle(amount);
        } else {
            std::cout << "No handler could approve $" << amount << " — needs CEO sign-off." << std::endl;
        }
    }
};

int main() {
    TeamLead teamLead;
    Manager manager;
    Director director;

    teamLead.setNext(&manager)->setNext(&director);

    std::cout << "Requesting approval for $500:" << std::endl;
    teamLead.handle(500);

    std::cout << "Requesting approval for $3000:" << std::endl;
    teamLead.handle(3000);

    std::cout << "Requesting approval for $18000:" << std::endl;
    teamLead.handle(18000);

    std::cout << "Requesting approval for $50000:" << std::endl;
    teamLead.handle(50000);

    return 0;
}`,
    output: `Requesting approval for $500:
TeamLead approved expense of $500
Requesting approval for $3000:
TeamLead cannot approve $3000 — escalating.
Manager approved expense of $3000
Requesting approval for $18000:
TeamLead cannot approve $18000 — escalating.
Manager cannot approve $18000 — escalating.
Director approved expense of $18000
Requesting approval for $50000:
TeamLead cannot approve $50000 — escalating.
Manager cannot approve $50000 — escalating.
No handler could approve $50000 — needs CEO sign-off.`,
  },
};

const qaItems = [
  {
    q: 'What is the core idea of Chain of Responsibility?',
    a: 'A request travels along a chain of handlers, each of which decides independently whether it can process the request or should pass it to the next handler. The sender only ever talks to the first handler and doesn’t need to know which one ultimately processes the request.',
  },
  {
    q: 'What happens if no handler in the chain can process a request?',
    a: 'Nothing, unless the chain is explicitly designed with a terminal case — a well-built chain includes a final fallback (throwing an error, logging "unhandled", or a default handler) rather than silently letting the request fall off the end with no one having acted on it.',
  },
  {
    q: 'How is Chain of Responsibility different from a simple if/else chain?',
    a: 'An if/else chain is one block of code that has to be edited whenever handling logic changes, and it’s aware of every branch at once. Chain of Responsibility distributes each condition into its own object, so handlers can be added, removed, or reordered by rewiring next references, without editing a shared block of logic or the code that submits requests.',
  },
  {
    q: 'How does middleware in web frameworks relate to this pattern?',
    a: 'Each middleware function is a handler: it can act on the request/response, and then explicitly calls next() to pass control to the following middleware, or short-circuits the chain by responding directly. That’s Chain of Responsibility applied directly to HTTP request processing.',
  },
];

export default function ChainOfResponsibilityPatternPage() {
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
              { label: 'Chain of Responsibility' },
            ]}
          />
          <h1 id="overview">Chain of Responsibility Pattern</h1>
          <p>Passes a request along a chain of handlers, each deciding independently whether to process it or pass it further, so the sender never needs to know which handler ultimately acts on it.</p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>You&apos;re building an expense approval system. A $200 expense can be approved by a team lead. A $3,000 expense needs a manager. A $15,000 expense needs a director. Anything above that needs the CEO. The naive approach is one method with nested <code>if/else</code> checking the amount and hard-coding who approves what — every time the approval hierarchy changes (a new &quot;VP&quot; level gets inserted, say), that method has to be edited, and it grows a new branch for every threshold.</p>
            <p>Chain of Responsibility turns each approver into a link in a chain. Each handler decides for itself: &quot;can I approve this, or does it need to go further up the chain?&quot; If it can handle the request, it does and stops the chain. If not, it passes the request to the next handler. The code that submits the expense doesn&apos;t know or care how many approvers exist or what their thresholds are — it just hands the request to the first handler in the chain and lets the chain sort out where it ends up.</p>

            <h3>How it&apos;s built</h3>
            <p>A <code>Handler</code> interface (or abstract class) declares a <code>handle(request)</code> method and holds a reference to the <code>next</code> handler in the chain. Concrete handlers (<code>TeamLead</code>, <code>Manager</code>, <code>Director</code>) each implement <code>handle()</code> to check whether they can process the request; if they can, they do and return; if they can&apos;t, they call <code>next.handle(request)</code> to pass it along. Client code builds the chain once (wiring each handler&apos;s <code>next</code> reference) and only ever talks to the first handler.</p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>Always give the chain an explicit terminal case for &quot;nothing could handle this&quot; — don&apos;t rely on the assumption that some handler always will.</p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>Letting a request silently fall off the end of the chain with no terminal handling — it looks like the system &quot;did nothing&quot; with no error or log to explain why.</p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>If no handler in the chain can process a request, and nobody put a check for that at the end, the request can silently fall through without anyone acting on it — a chain needs an explicit terminal case (&quot;no handler could process this&quot;) rather than assuming someone always will. Debugging can also get harder than a single method with visible branches, because tracing which handler ultimately processed a given request means stepping through however many handlers sit before it in the chain.</p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/chain-of-responsibility/class-diagram.svg"
                alt="Chain of Responsibility diagram showing TeamLead, Manager, and Director handlers linked via next references, with an expense request escalating until a handler's limit covers it"
              />
              <figcaption>The request escalates from TeamLead through Manager to Director until a limit covers it</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>More than one object might handle a request, and the right handler depends on runtime conditions.</li>
                  <li>You want to add, remove, or reorder handlers without touching the code that submits requests.</li>
                  <li>You don&apos;t want the sender of a request to know exactly which object will ultimately process it.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>There&apos;s a single, fixed handler for every request — a direct call is simpler.</li>
                  <li>Every request must always be checked against every handler regardless of whether an earlier one handled it — that&apos;s closer to a broadcast than a chain that stops once handled.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are actually listening for:</strong> naming concrete examples like middleware pipelines (Express.js, ASP.NET) and logging frameworks, showing this isn&apos;t just a textbook toy. Also, flagging the &quot;silent fall-through&quot; risk explicitly — a well-designed chain has a defined terminal behavior for unhandled requests rather than assuming one link always catches everything.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Expense/purchase approval workflows</strong> — a request escalates through team lead, manager, director, and CEO until someone&apos;s authority level covers it.</li>
              <li><strong>Web server middleware pipelines</strong> (Express.js, ASP.NET Core, Django middleware) — each middleware decides whether to handle the request, modify it, or pass it to the next one.</li>
              <li><strong>Logging frameworks</strong> — a log record passes through handlers for different severity levels/destinations, each deciding whether it applies.</li>
              <li><strong>Event bubbling in GUI frameworks</strong> — a click event travels up through nested UI components, each of which can handle it or let it continue bubbling.</li>
              <li><strong>Exception handling chains</strong> — a try/catch hierarchy where each catch block decides whether it can handle a given exception type or re-throws it further up.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>Same pattern, four languages. Every output shown here was captured from a real run — note each request escalates only as far as it needs to before a handler&apos;s limit covers it.</p>
            <CodeTerminal snippets={snippets} />
          </section>

          <PageNav
            prev={{ label: 'State', href: '/pages/lld/design-patterns/behavioral/state' }}
            next={{ label: 'Template Method', href: '/pages/lld/design-patterns/behavioral/template-method' }}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
