import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'State Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `// State Pattern — a Document (Context) delegates publish() to whichever DocumentState is active.
// Compile: javac State.java
// Run:     java State

interface DocumentState {
    void publish(Document document);
    String name();
}

class DraftState implements DocumentState {
    public void publish(Document document) {
        System.out.println("Draft submitted for moderation.");
        document.setState(new ModerationState());
    }

    public String name() {
        return "Draft";
    }
}

class ModerationState implements DocumentState {
    public void publish(Document document) {
        System.out.println("Moderator approved — publishing document.");
        document.setState(new PublishedState());
    }

    public String name() {
        return "Moderation";
    }
}

class PublishedState implements DocumentState {
    public void publish(Document document) {
        System.out.println("Already published — publish() has no further effect.");
    }

    public String name() {
        return "Published";
    }
}

class Document {
    private DocumentState state = new DraftState();

    void setState(DocumentState state) {
        this.state = state;
    }

    void publish() {
        state.publish(this);
    }

    String currentState() {
        return state.name();
    }
}

public class State {
    public static void main(String[] args) {
        Document doc = new Document();

        System.out.println("Current state: " + doc.currentState());
        doc.publish();

        System.out.println("Current state: " + doc.currentState());
        doc.publish();

        System.out.println("Current state: " + doc.currentState());
        doc.publish();

        System.out.println("Current state: " + doc.currentState());
    }
}`,
    output: `Current state: Draft
Draft submitted for moderation.
Current state: Moderation
Moderator approved — publishing document.
Current state: Published
Already published — publish() has no further effect.
Current state: Published`,
  },
  python: {
    code: `"""
State Pattern — a Document (Context) delegates publish() to whichever DocumentState is active.
Run: python state.py
"""

from abc import ABC, abstractmethod


class DocumentState(ABC):
    @abstractmethod
    def publish(self, document):
        ...

    @abstractmethod
    def name(self):
        ...


class DraftState(DocumentState):
    def publish(self, document):
        print("Draft submitted for moderation.")
        document.set_state(ModerationState())

    def name(self):
        return "Draft"


class ModerationState(DocumentState):
    def publish(self, document):
        print("Moderator approved — publishing document.")
        document.set_state(PublishedState())

    def name(self):
        return "Moderation"


class PublishedState(DocumentState):
    def publish(self, document):
        print("Already published — publish() has no further effect.")

    def name(self):
        return "Published"


class Document:
    def __init__(self):
        self.state = DraftState()

    def set_state(self, state: DocumentState):
        self.state = state

    def publish(self):
        self.state.publish(self)

    def current_state(self):
        return self.state.name()


if __name__ == "__main__":
    doc = Document()

    print(f"Current state: {doc.current_state()}")
    doc.publish()

    print(f"Current state: {doc.current_state()}")
    doc.publish()

    print(f"Current state: {doc.current_state()}")
    doc.publish()

    print(f"Current state: {doc.current_state()}")`,
    output: `Current state: Draft
Draft submitted for moderation.
Current state: Moderation
Moderator approved — publishing document.
Current state: Published
Already published — publish() has no further effect.
Current state: Published`,
  },
  javascript: {
    code: `/**
 * State Pattern — a Document (Context) delegates publish() to whichever DocumentState is active.
 * Run: node state.js
 */

class DraftState {
  publish(document) {
    console.log("Draft submitted for moderation.");
    document.setState(new ModerationState());
  }

  name() {
    return "Draft";
  }
}

class ModerationState {
  publish(document) {
    console.log("Moderator approved — publishing document.");
    document.setState(new PublishedState());
  }

  name() {
    return "Moderation";
  }
}

class PublishedState {
  publish(document) {
    console.log("Already published — publish() has no further effect.");
  }

  name() {
    return "Published";
  }
}

class Document {
  constructor() {
    this.state = new DraftState();
  }

  setState(state) {
    this.state = state;
  }

  publish() {
    this.state.publish(this);
  }

  currentState() {
    return this.state.name();
  }
}

const doc = new Document();

console.log(\`Current state: \${doc.currentState()}\`);
doc.publish();

console.log(\`Current state: \${doc.currentState()}\`);
doc.publish();

console.log(\`Current state: \${doc.currentState()}\`);
doc.publish();

console.log(\`Current state: \${doc.currentState()}\`);

module.exports = { Document, DraftState, ModerationState, PublishedState };`,
    output: `Current state: Draft
Draft submitted for moderation.
Current state: Moderation
Moderator approved — publishing document.
Current state: Published
Already published — publish() has no further effect.
Current state: Published`,
  },
  cpp: {
    code: `// State Pattern — a Document (Context) delegates publish() to whichever DocumentState is active.
// Compile: g++ -std=c++14 State.cpp -o state
// Run:     ./state

#include <iostream>
#include <string>
#include <memory>

class Document;

class DocumentState {
public:
    virtual void publish(Document& document) = 0;
    virtual std::string name() const = 0;
    virtual ~DocumentState() = default;
};

class Document {
public:
    Document();

    void setState(std::unique_ptr<DocumentState> state) {
        state_ = std::move(state);
    }

    void publish() {
        state_->publish(*this);
    }

    std::string currentState() const {
        return state_->name();
    }

private:
    std::unique_ptr<DocumentState> state_;
};

class PublishedState : public DocumentState {
public:
    void publish(Document& document) override {
        std::cout << "Already published — publish() has no further effect." << std::endl;
    }

    std::string name() const override { return "Published"; }
};

class ModerationState : public DocumentState {
public:
    void publish(Document& document) override {
        std::cout << "Moderator approved — publishing document." << std::endl;
        document.setState(std::make_unique<PublishedState>());
    }

    std::string name() const override { return "Moderation"; }
};

class DraftState : public DocumentState {
public:
    void publish(Document& document) override {
        std::cout << "Draft submitted for moderation." << std::endl;
        document.setState(std::make_unique<ModerationState>());
    }

    std::string name() const override { return "Draft"; }
};

Document::Document() {
    state_ = std::make_unique<DraftState>();
}

int main() {
    Document doc;

    std::cout << "Current state: " << doc.currentState() << std::endl;
    doc.publish();

    std::cout << "Current state: " << doc.currentState() << std::endl;
    doc.publish();

    std::cout << "Current state: " << doc.currentState() << std::endl;
    doc.publish();

    std::cout << "Current state: " << doc.currentState() << std::endl;

    return 0;
}`,
    output: `Current state: Draft
Draft submitted for moderation.
Current state: Moderation
Moderator approved — publishing document.
Current state: Published
Already published — publish() has no further effect.
Current state: Published`,
  },
};

const qaItems = [
  {
    q: 'What does it mean that State lets an object "appear to change its class at runtime"?',
    a: "The Context's behavior for a given method call can change completely just by swapping which State object it currently delegates to — from the outside, calling the same method produces entirely different behavior depending on the active state, as if the Context itself had become a different class, even though the Context's own code never changed.",
  },
  {
    q: 'Who decides the next state — the Context or the State objects?',
    a: 'Typically the State objects themselves. A concrete state’s method implementation both performs its state-specific logic and calls context.setState(nextState) to move the Context into the next state, meaning the transition logic is distributed across the state classes rather than centralized in the Context.',
  },
  {
    q: 'How is State different from Strategy, given both have a Context holding a reference to an interface implementation?',
    a: "Structurally similar, but by intent: Strategy variants are usually selected once (or explicitly swapped in by client code) and don't know about or trigger each other. State variants represent a Context's internal condition and actively drive transitions to other states as part of handling requests — the states know about and cause movement between each other, which Strategy implementations typically don't do.",
  },
  {
    q: 'When would you avoid the State pattern in favor of a simple enum + switch?',
    a: 'When there are only a couple of states with simple, stable, unlikely-to-grow behavior differences — the overhead of a full class per state buys you little, and a straightforward conditional on an enum value is easier for a new reader to scan in one place.',
  },
];

export default function StatePatternPage() {
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
              { label: 'State' },
            ]}
          />
          <h1 id="overview">State Pattern</h1>
          <p>Lets an object appear to change its class at runtime, by delegating state-dependent behavior to a swappable State object rather than branching on a status field.</p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>You&apos;re building a document publishing workflow. A document starts as a <code>Draft</code>, moves to <code>Moderation</code> once someone submits it for review, and finally becomes <code>Published</code>. Calling <code>publish()</code> should behave completely differently depending on which of these states the document is currently in — from Draft it should move to Moderation; from Moderation, only a moderator should be able to actually publish it; from Published, calling <code>publish()</code> again should do nothing. The naive approach is a <code>status</code> field checked by a wall of <code>if (status == &quot;draft&quot;) ... else if (status == &quot;moderation&quot;) ...</code> inside every method that behaves differently per state — and that wall grows and gets duplicated across every method as more states and behaviors are added.</p>
            <p>State pulls each state&apos;s behavior into its own class implementing a common interface, and the <code>Document</code> (the <code>Context</code>) simply delegates to whichever state object is currently active. Calling <code>document.publish()</code> just calls <code>currentState.publish(document)</code> — the Document doesn&apos;t need to know what &quot;draft&quot; or &quot;moderation&quot; actually implies; each state class encodes its own rules and even decides what the next state should be.</p>

            <h3>How it&apos;s built</h3>
            <p>A <code>State</code> interface declares the operations that vary by state (<code>publish()</code>, <code>render()</code>, etc). Concrete states (<code>DraftState</code>, <code>ModerationState</code>, <code>PublishedState</code>) implement these operations according to their own rules, and — critically — often call <code>context.setState(nextState)</code> themselves as part of handling a request, meaning states actively drive their own transitions. The <code>Context</code> (<code>Document</code>) holds a reference to the current state object and delegates all state-dependent behavior to it, exposing <code>setState()</code> for states (or external code) to trigger a transition.</p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>Document the full set of valid transitions somewhere central (a diagram or comment) even though the transition logic itself lives scattered across state classes — future readers need a map of the whole machine.</p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>Reintroducing a status-flag check somewhere else in the codebase alongside the State objects — now there are two sources of truth for &quot;what state is this in,&quot; which will eventually disagree.</p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>If transitions between states are scattered across many state classes with no central picture of the state machine, it can get hard to see or verify the full set of valid transitions just by reading the code — a state diagram (or comment mapping the full transition table) becomes important documentation alongside the code itself. Also, for a genuinely small number of states with simple, static rules, a plain <code>enum</code> plus a switch statement can be perfectly readable and the State pattern&apos;s extra classes are unnecessary ceremony.</p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/state/class-diagram.svg"
                alt="State pattern class diagram showing Document Context delegating to a DocumentState reference, implemented by DraftState, ModerationState, and PublishedState, with states driving transitions between each other"
              />
              <figcaption>Each state&apos;s publish() both performs its logic and decides the next state to transition to</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>An object&apos;s behavior genuinely changes based on its internal state, and multiple methods each have their own per-state branching logic.</li>
                  <li>The set of states and transitions is non-trivial and expected to grow, making a scattered per-method conditional approach hard to maintain.</li>
                  <li>States themselves should decide the next valid transition, rather than external code managing a status field.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>There are only two or three states with trivial, unlikely-to-change behavior differences — a simple enum and conditional is more direct.</li>
                  <li>Transitions need to be centrally, explicitly validated/audited from one place — a table-driven state machine may give clearer visibility.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are actually listening for:</strong> recognizing that State&apos;s essence is letting an object appear to change its class at runtime — the Context&apos;s behavior changes entirely just by swapping which State object it delegates to, with no change to the Context&apos;s own code. Also, clearly distinguishing State from Strategy despite the near-identical class structure: State variants actively trigger transitions to other states as part of their own logic, while Strategy variants are typically chosen once and don&apos;t know about each other.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Document/content workflows</strong> — Draft → In Review → Published, where allowed actions differ at each stage.</li>
              <li><strong>Order lifecycle in e-commerce</strong> — Placed → Shipped → Delivered → Returned, each with different valid operations.</li>
              <li><strong>Media player controls</strong> — Playing, Paused, and Stopped states each interpret the same &quot;press play&quot; button press differently.</li>
              <li><strong>TCP connection state machine</strong> — Closed, Listen, SYN-Sent, Established, and so on, each handling incoming packets differently.</li>
              <li><strong>Traffic light controllers</strong> — Red, Yellow, Green states each defining their own duration and next-state transition.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>Same pattern, four languages. Every output shown here was captured from a real run — note publish() called a fourth time on an already-Published document does nothing further.</p>
            <CodeTerminal snippets={snippets} />
          </section>

          <PageNav
            prev={{ label: 'Command', href: '/pages/lld/design-patterns/behavioral/command' }}
            next={{ label: 'Chain of Responsibility', href: '/pages/lld/design-patterns/behavioral/chain-of-responsibility' }}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
