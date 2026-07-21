import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Memento Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `// Memento Pattern — TextEditor (Originator) snapshots its state; History (Caretaker) stores it opaquely.
// Compile: javac Memento.java
// Run:     java Memento

import java.util.ArrayDeque;
import java.util.Deque;

// The Memento — immutable snapshot, readable only by TextEditor.
class EditorMemento {
    private final String content;

    EditorMemento(String content) {
        this.content = content;
    }

    private String getContent() {
        return content;
    }

    // Package-private access point used only by TextEditor.
    String read() {
        return getContent();
    }
}

class TextEditor {
    private String content = "";

    void type(String text) {
        content += text;
    }

    String getContent() {
        return content;
    }

    EditorMemento save() {
        return new EditorMemento(content);
    }

    void restore(EditorMemento memento) {
        content = memento.read();
    }
}

class History {
    private Deque<EditorMemento> history = new ArrayDeque<>();

    void push(EditorMemento memento) {
        history.push(memento);
    }

    EditorMemento pop() {
        return history.pop();
    }
}

public class Memento {
    public static void main(String[] args) {
        TextEditor editor = new TextEditor();
        History history = new History();

        editor.type("Hello");
        history.push(editor.save());
        System.out.println("Content: " + editor.getContent());

        editor.type(", world");
        history.push(editor.save());
        System.out.println("Content: " + editor.getContent());

        editor.type("!!! (typo)");
        System.out.println("Content: " + editor.getContent());

        System.out.println("Undo:");
        editor.restore(history.pop());
        System.out.println("Content: " + editor.getContent());

        System.out.println("Undo again:");
        editor.restore(history.pop());
        System.out.println("Content: " + editor.getContent());
    }
}`,
    output: `Content: Hello
Content: Hello, world
Content: Hello, world!!! (typo)
Undo:
Content: Hello, world
Undo again:
Content: Hello`,
  },
  python: {
    code: `"""
Memento Pattern — TextEditor (Originator) snapshots its state; History (Caretaker) stores it opaquely.
Run: python memento.py
"""


class EditorMemento:
    """The Memento — treated as opaque by History; only TextEditor reads _content."""

    def __init__(self, content):
        self._content = content


class TextEditor:
    def __init__(self):
        self.content = ""

    def type(self, text):
        self.content += text

    def save(self):
        return EditorMemento(self.content)

    def restore(self, memento: EditorMemento):
        self.content = memento._content


class History:
    def __init__(self):
        self._stack = []

    def push(self, memento):
        self._stack.append(memento)

    def pop(self):
        return self._stack.pop()


if __name__ == "__main__":
    editor = TextEditor()
    history = History()

    editor.type("Hello")
    history.push(editor.save())
    print(f"Content: {editor.content}")

    editor.type(", world")
    history.push(editor.save())
    print(f"Content: {editor.content}")

    editor.type("!!! (typo)")
    print(f"Content: {editor.content}")

    print("Undo:")
    editor.restore(history.pop())
    print(f"Content: {editor.content}")

    print("Undo again:")
    editor.restore(history.pop())
    print(f"Content: {editor.content}")`,
    output: `Content: Hello
Content: Hello, world
Content: Hello, world!!! (typo)
Undo:
Content: Hello, world
Undo again:
Content: Hello`,
  },
  javascript: {
    code: `/**
 * Memento Pattern — TextEditor (Originator) snapshots its state; History (Caretaker) stores it opaquely.
 * Run: node memento.js
 */

class EditorMemento {
  constructor(content) {
    this._content = content; // treated as opaque by History; only TextEditor reads it
  }
}

class TextEditor {
  constructor() {
    this.content = "";
  }

  type(text) {
    this.content += text;
  }

  save() {
    return new EditorMemento(this.content);
  }

  restore(memento) {
    this.content = memento._content;
  }
}

class History {
  constructor() {
    this.stack = [];
  }

  push(memento) {
    this.stack.push(memento);
  }

  pop() {
    return this.stack.pop();
  }
}

const editor = new TextEditor();
const history = new History();

editor.type("Hello");
history.push(editor.save());
console.log(\`Content: \${editor.content}\`);

editor.type(", world");
history.push(editor.save());
console.log(\`Content: \${editor.content}\`);

editor.type("!!! (typo)");
console.log(\`Content: \${editor.content}\`);

console.log("Undo:");
editor.restore(history.pop());
console.log(\`Content: \${editor.content}\`);

console.log("Undo again:");
editor.restore(history.pop());
console.log(\`Content: \${editor.content}\`);

module.exports = { TextEditor, History, EditorMemento };`,
    output: `Content: Hello
Content: Hello, world
Content: Hello, world!!! (typo)
Undo:
Content: Hello, world
Undo again:
Content: Hello`,
  },
  cpp: {
    code: `// Memento Pattern — TextEditor (Originator) snapshots its state; History (Caretaker) stores it opaquely.
// Compile: g++ -std=c++14 Memento.cpp -o memento
// Run:     ./memento

#include <iostream>
#include <string>
#include <vector>

class TextEditor;

// The Memento — only TextEditor is a friend, so History can't read its contents.
class EditorMemento {
public:
    friend class TextEditor;

    explicit EditorMemento(std::string content) : content_(std::move(content)) {}

private:
    std::string content_;
};

class TextEditor {
public:
    void type(const std::string& text) {
        content_ += text;
    }

    const std::string& getContent() const {
        return content_;
    }

    EditorMemento save() const {
        return EditorMemento(content_);
    }

    void restore(const EditorMemento& memento) {
        content_ = memento.content_;
    }

private:
    std::string content_;
};

class History {
public:
    void push(const EditorMemento& memento) {
        stack_.push_back(memento);
    }

    EditorMemento pop() {
        EditorMemento last = stack_.back();
        stack_.pop_back();
        return last;
    }

private:
    std::vector<EditorMemento> stack_;
};

int main() {
    TextEditor editor;
    History history;

    editor.type("Hello");
    history.push(editor.save());
    std::cout << "Content: " << editor.getContent() << std::endl;

    editor.type(", world");
    history.push(editor.save());
    std::cout << "Content: " << editor.getContent() << std::endl;

    editor.type("!!! (typo)");
    std::cout << "Content: " << editor.getContent() << std::endl;

    std::cout << "Undo:" << std::endl;
    editor.restore(history.pop());
    std::cout << "Content: " << editor.getContent() << std::endl;

    std::cout << "Undo again:" << std::endl;
    editor.restore(history.pop());
    std::cout << "Content: " << editor.getContent() << std::endl;

    return 0;
}`,
    output: `Content: Hello
Content: Hello, world
Content: Hello, world!!! (typo)
Undo:
Content: Hello, world
Undo again:
Content: Hello`,
  },
};

const qaItems = [
  {
    q: 'What are the three roles in Memento, and what does each do?',
    a: <>Originator is the object whose state needs to be saved/restored — it creates mementos of itself and can restore its own state from one. Memento is the opaque snapshot object holding captured state, exposed only to the Originator&apos;s full reading. Caretaker stores mementos (often in a stack/list for undo history) and requests restores, but never inspects a memento&apos;s actual contents.</>,
  },
  {
    q: 'Why does the Caretaker never read a memento’s internal state?',
    a: 'Because the whole point of the pattern is preserving encapsulation — the object being snapshotted (the Originator) is the only thing that understands its own internal representation. If the Caretaker could freely read memento internals, external code would become coupled to the Originator’s internal structure, defeating the purpose.',
  },
  {
    q: 'What’s the main cost/trade-off of using Memento for undo?',
    a: 'Storing a full snapshot of state for every undo point can be memory-expensive, especially for large objects or frequent snapshots. An alternative is storing a log of reversible commands and replaying/undoing them, which can be cheaper if state is large but changes are small.',
  },
  {
    q: 'How does Memento relate to Command when both support undo?',
    a: <>They solve undo differently: Memento captures and restores full state snapshots, letting the Originator&apos;s <code>restore()</code> jump directly back to a previous state. Command-based undo instead has each executed command carry enough information to reverse its own specific effect, without needing a full state snapshot — often cheaper, but requires every command to correctly implement its own inverse operation.</>,
  },
];

export default function MementoPatternPage() {
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
              { label: 'Memento' },
            ]}
          />
          <h1 id="overview">Memento Pattern</h1>
          <p>Lets an object capture and externally store a snapshot of its own state — for undo, checkpoints, or rollback — without exposing its internal representation to whoever holds the snapshot.</p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>You&apos;re building a text editor with undo support. To undo, you need to be able to restore the document to some earlier state. The obvious approach is to let whatever code manages undo history reach directly into the <code>TextEditor</code> object and copy out its internal fields — but that breaks encapsulation, since external code now needs to know exactly what internal state the editor holds and how to reconstruct it. If the editor&apos;s internal representation changes later, the undo code breaks too.</p>
            <p>Memento solves this by having the object itself (<code>TextEditor</code>, the <code>Originator</code>) create an opaque snapshot object (the <code>Memento</code>) that captures its own internal state, and hand that snapshot to external code without exposing what&apos;s inside it. The external code (a <code>History</code>/<code>Caretaker</code>) stores mementos and, to undo, hands a memento back to the originator, which restores its own state from it. The originator is the only thing that ever reads or writes the memento&apos;s actual internal contents — the caretaker just stores and passes it around as a black box.</p>

            <h3>How it&apos;s built</h3>
            <p>The <code>Originator</code> (<code>TextEditor</code>) has a method like <code>save()</code> that creates and returns a <code>Memento</code> containing a copy of its current state, and a <code>restore(memento)</code> method that sets its state back from a given memento. The <code>Memento</code> itself only exposes what the Originator needs to read it back — often the memento&apos;s fields are private to everything except the Originator. The <code>Caretaker</code> (<code>History</code>) just calls <code>originator.save()</code> to get mementos and stores them in a list/stack, calling <code>originator.restore(memento)</code> when undo is requested — it never inspects what&apos;s inside a memento.</p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>Genuinely restrict memento field access to the Originator (via a friend class, a nested private class, or a narrow interface) rather than leaving fields readable &quot;for convenience&quot; — that&apos;s what keeps the encapsulation guarantee real.</p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>Letting the Caretaker read or modify a memento&apos;s fields directly — it defeats the pattern&apos;s whole purpose and re-couples external code to the Originator&apos;s internal representation.</p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>Storing a full deep copy of large object state for every undo point can become memory-expensive if snapshots are taken frequently or the state is large — some implementations mitigate this by only storing diffs/deltas rather than full snapshots. Also, achieving true encapsulation (the Caretaker genuinely cannot read the memento&apos;s internals) requires some language-specific technique — many &quot;textbook&quot; implementations in practice just make the memento&apos;s fields readable, which weakens the encapsulation guarantee the pattern is meant to provide.</p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/memento/class-diagram.svg"
                alt="Memento pattern diagram showing TextEditor creating EditorMemento snapshots stored opaquely by History, restored back into TextEditor on undo"
              />
              <figcaption>History stores mementos opaquely — only TextEditor ever reads their contents</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>You need undo/redo, checkpoints, or rollback for an object&apos;s state without exposing its internal representation.</li>
                  <li>You want the object itself responsible for capturing/restoring its own state, keeping that logic in one place.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>The state is trivially small — copying a couple of public fields directly is clear enough, no snapshot machinery needed.</li>
                  <li>Undo can be achieved more efficiently by replaying a log of reversible commands (see Command) instead of storing full state snapshots.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are actually listening for:</strong> understanding that the core value of Memento is preserving encapsulation while still allowing external code to manage history — the Caretaker stores mementos opaquely and never reaches into their internals. Also, being able to discuss the memory cost trade-off of full-state snapshots versus command-log-based undo, showing awareness of real implementation trade-offs rather than reciting the pattern by rote.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Text/image editor undo history</strong> — each edit creates a snapshot of document state that can be restored on undo.</li>
              <li><strong>Database transaction savepoints</strong> — a savepoint captures the state to roll back to, without the calling code understanding the database&apos;s internal storage format.</li>
              <li><strong>Game save states</strong> — a game&apos;s internal state is serialized into a save file (a memento) that can later restore the game to that exact point.</li>
              <li><strong>Form wizards with a &quot;back&quot; button</strong> — each step&apos;s data is captured as a memento so navigating back restores the exact previous state.</li>
              <li><strong>Version control snapshots</strong> — a commit captures a full snapshot of project state that can be restored without replaying every change from the beginning.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>Same pattern, four languages. Every output shown here was captured from a real run — note undo discards the typo entirely, jumping back to the last saved checkpoint.</p>
            <CodeTerminal snippets={snippets} />
          </section>

          <PageNav
            prev={{ label: 'Mediator', href: '/pages/lld/design-patterns/behavioral/mediator' }}
            next={{ label: 'Visitor', href: '/pages/lld/design-patterns/behavioral/visitor' }}
          />
        </main>
      </div>

      <Footer
        sectionColumn={{
          title: 'Design Patterns',
          links: [
            { label: 'Singleton', href: '/pages/lld/design-patterns/creational/singleton' },
            { label: 'Adapter', href: '/pages/lld/design-patterns/structural/adapter' },
            { label: 'Observer', href: '/pages/lld/design-patterns/behavioral/observer' },
            { label: 'Strategy', href: '/pages/lld/design-patterns/behavioral/strategy' },
          ],
        }}
      />
    </>
  );
}
