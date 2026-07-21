import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Command Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `// Command Pattern — a RemoteControl (Invoker) triggers Commands against a Light (Receiver), with undo support.
// Compile: javac Command.java
// Run:     java Command

import java.util.Stack;

// Receiver — knows how to actually perform the operations.
class Light {
    private boolean on = false;

    void turnOn() {
        on = true;
        System.out.println("Light is ON");
    }

    void turnOff() {
        on = false;
        System.out.println("Light is OFF");
    }
}

interface RemoteCommand {
    void execute();
    void undo();
}

class LightOnCommand implements RemoteCommand {
    private Light light;

    LightOnCommand(Light light) {
        this.light = light;
    }

    public void execute() {
        light.turnOn();
    }

    public void undo() {
        light.turnOff();
    }
}

class LightOffCommand implements RemoteCommand {
    private Light light;

    LightOffCommand(Light light) {
        this.light = light;
    }

    public void execute() {
        light.turnOff();
    }

    public void undo() {
        light.turnOn();
    }
}

// Invoker — triggers commands and keeps a history for undo.
class RemoteControl {
    private Stack<RemoteCommand> history = new Stack<>();

    void pressButton(RemoteCommand command) {
        command.execute();
        history.push(command);
    }

    void pressUndo() {
        if (history.isEmpty()) {
            System.out.println("Nothing to undo.");
            return;
        }
        RemoteCommand last = history.pop();
        last.undo();
    }
}

public class Command {
    public static void main(String[] args) {
        Light light = new Light();
        RemoteControl remote = new RemoteControl();

        RemoteCommand onCommand = new LightOnCommand(light);
        RemoteCommand offCommand = new LightOffCommand(light);

        System.out.println("Press ON button:");
        remote.pressButton(onCommand);

        System.out.println("Press OFF button:");
        remote.pressButton(offCommand);

        System.out.println("Press UNDO button:");
        remote.pressUndo();

        System.out.println("Press UNDO button again:");
        remote.pressUndo();

        System.out.println("Press UNDO button once more (nothing left):");
        remote.pressUndo();
    }
}`,
    output: `Press ON button:
Light is ON
Press OFF button:
Light is OFF
Press UNDO button:
Light is ON
Press UNDO button again:
Light is OFF
Press UNDO button once more (nothing left):
Nothing to undo.`,
  },
  python: {
    code: `"""
Command Pattern — a RemoteControl (Invoker) triggers Commands against a Light (Receiver), with undo support.
Run: python command.py
"""

from abc import ABC, abstractmethod


class Light:
    """Receiver — knows how to actually perform the operations."""

    def __init__(self):
        self.on = False

    def turn_on(self):
        self.on = True
        print("Light is ON")

    def turn_off(self):
        self.on = False
        print("Light is OFF")


class RemoteCommand(ABC):
    @abstractmethod
    def execute(self):
        ...

    @abstractmethod
    def undo(self):
        ...


class LightOnCommand(RemoteCommand):
    def __init__(self, light: Light):
        self.light = light

    def execute(self):
        self.light.turn_on()

    def undo(self):
        self.light.turn_off()


class LightOffCommand(RemoteCommand):
    def __init__(self, light: Light):
        self.light = light

    def execute(self):
        self.light.turn_off()

    def undo(self):
        self.light.turn_on()


class RemoteControl:
    """Invoker — triggers commands and keeps a history for undo."""

    def __init__(self):
        self.history = []

    def press_button(self, command: RemoteCommand):
        command.execute()
        self.history.append(command)

    def press_undo(self):
        if not self.history:
            print("Nothing to undo.")
            return
        last = self.history.pop()
        last.undo()


if __name__ == "__main__":
    light = Light()
    remote = RemoteControl()

    on_command = LightOnCommand(light)
    off_command = LightOffCommand(light)

    print("Press ON button:")
    remote.press_button(on_command)

    print("Press OFF button:")
    remote.press_button(off_command)

    print("Press UNDO button:")
    remote.press_undo()

    print("Press UNDO button again:")
    remote.press_undo()

    print("Press UNDO button once more (nothing left):")
    remote.press_undo()`,
    output: `Press ON button:
Light is ON
Press OFF button:
Light is OFF
Press UNDO button:
Light is ON
Press UNDO button again:
Light is OFF
Press UNDO button once more (nothing left):
Nothing to undo.`,
  },
  javascript: {
    code: `/**
 * Command Pattern — a RemoteControl (Invoker) triggers Commands against a Light (Receiver), with undo support.
 * Run: node command.js
 */

class Light {
  constructor() {
    this.on = false;
  }

  turnOn() {
    this.on = true;
    console.log("Light is ON");
  }

  turnOff() {
    this.on = false;
    console.log("Light is OFF");
  }
}

class LightOnCommand {
  constructor(light) {
    this.light = light;
  }

  execute() {
    this.light.turnOn();
  }

  undo() {
    this.light.turnOff();
  }
}

class LightOffCommand {
  constructor(light) {
    this.light = light;
  }

  execute() {
    this.light.turnOff();
  }

  undo() {
    this.light.turnOn();
  }
}

class RemoteControl {
  constructor() {
    this.history = [];
  }

  pressButton(command) {
    command.execute();
    this.history.push(command);
  }

  pressUndo() {
    if (this.history.length === 0) {
      console.log("Nothing to undo.");
      return;
    }
    const last = this.history.pop();
    last.undo();
  }
}

const light = new Light();
const remote = new RemoteControl();

const onCommand = new LightOnCommand(light);
const offCommand = new LightOffCommand(light);

console.log("Press ON button:");
remote.pressButton(onCommand);

console.log("Press OFF button:");
remote.pressButton(offCommand);

console.log("Press UNDO button:");
remote.pressUndo();

console.log("Press UNDO button again:");
remote.pressUndo();

console.log("Press UNDO button once more (nothing left):");
remote.pressUndo();

module.exports = { Light, LightOnCommand, LightOffCommand, RemoteControl };`,
    output: `Press ON button:
Light is ON
Press OFF button:
Light is OFF
Press UNDO button:
Light is ON
Press UNDO button again:
Light is OFF
Press UNDO button once more (nothing left):
Nothing to undo.`,
  },
  cpp: {
    code: `// Command Pattern — a RemoteControl (Invoker) triggers Commands against a Light (Receiver), with undo support.
// Compile: g++ -std=c++14 Command.cpp -o command
// Run:     ./command

#include <iostream>
#include <vector>
#include <memory>

// Receiver — knows how to actually perform the operations.
class Light {
public:
    void turnOn() {
        on_ = true;
        std::cout << "Light is ON" << std::endl;
    }

    void turnOff() {
        on_ = false;
        std::cout << "Light is OFF" << std::endl;
    }

private:
    bool on_ = false;
};

class RemoteCommand {
public:
    virtual void execute() = 0;
    virtual void undo() = 0;
    virtual ~RemoteCommand() = default;
};

class LightOnCommand : public RemoteCommand {
public:
    explicit LightOnCommand(Light& light) : light_(light) {}

    void execute() override { light_.turnOn(); }
    void undo() override { light_.turnOff(); }

private:
    Light& light_;
};

class LightOffCommand : public RemoteCommand {
public:
    explicit LightOffCommand(Light& light) : light_(light) {}

    void execute() override { light_.turnOff(); }
    void undo() override { light_.turnOn(); }

private:
    Light& light_;
};

// Invoker — triggers commands and keeps a history for undo.
class RemoteControl {
public:
    void pressButton(RemoteCommand* command) {
        command->execute();
        history_.push_back(command);
    }

    void pressUndo() {
        if (history_.empty()) {
            std::cout << "Nothing to undo." << std::endl;
            return;
        }
        RemoteCommand* last = history_.back();
        history_.pop_back();
        last->undo();
    }

private:
    std::vector<RemoteCommand*> history_;
};

int main() {
    Light light;
    RemoteControl remote;

    LightOnCommand onCommand(light);
    LightOffCommand offCommand(light);

    std::cout << "Press ON button:" << std::endl;
    remote.pressButton(&onCommand);

    std::cout << "Press OFF button:" << std::endl;
    remote.pressButton(&offCommand);

    std::cout << "Press UNDO button:" << std::endl;
    remote.pressUndo();

    std::cout << "Press UNDO button again:" << std::endl;
    remote.pressUndo();

    std::cout << "Press UNDO button once more (nothing left):" << std::endl;
    remote.pressUndo();

    return 0;
}`,
    output: `Press ON button:
Light is ON
Press OFF button:
Light is OFF
Press UNDO button:
Light is ON
Press UNDO button again:
Light is OFF
Press UNDO button once more (nothing left):
Nothing to undo.`,
  },
};

const qaItems = [
  {
    q: 'What are the core participants in Command, and what does each do?',
    a: 'Command declares execute() (and often undo()). ConcreteCommand implements it and holds a reference to a Receiver, delegating the actual work to it. Receiver is the object that knows how to perform the operation. Invoker holds a Command reference and triggers execute() without knowing the concrete command or receiver involved.',
  },
  {
    q: 'How does Command enable undo?',
    a: 'Because a request is represented as an object rather than a one-shot method call, that object can also carry an undo() method and whatever state it needs to reverse its own effect. The Invoker keeps a history stack of executed commands, and undo simply calls undo() on the most recently executed one.',
  },
  {
    q: "Why would you use Command instead of just calling the Receiver's method directly?",
    a: 'Because the Invoker (button, menu item, scheduler) shouldn’t need to know which Receiver or which specific operation is behind it — that binding can change at runtime, be queued, logged, retried, or reversed. A direct method call can’t be stored, replayed, or undone; a Command object can.',
  },
  {
    q: 'How does Command relate to job queues in backend systems?',
    a: 'A job/task in a queue is essentially a Command — a serialized representation of "do this operation with this data" that gets executed later, possibly by a completely different process than the one that created it. The queue is the Invoker (deciding when to trigger execution), and the worker executing the job is effectively calling execute() on it.',
  },
];

export default function CommandPatternPage() {
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
              { label: 'Command' },
            ]}
          />
          <h1 id="overview">Command Pattern</h1>
          <p>Wraps a request as an object with an <code>execute()</code> method, so requests can be stored, queued, logged, passed around, or undone instead of vanishing as one-shot method calls.</p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>You&apos;re building a universal remote control with buttons that can be reprogrammed to trigger different actions — one button turns a light on, another closes the garage door, another triggers a whole &quot;movie night&quot; macro. The remote itself shouldn&apos;t need to know anything about lights or garage doors; it just needs to know &quot;when this button is pressed, run whatever action was assigned to it.&quot; You also want undo — pressing an &quot;undo&quot; button should reverse whatever the last action did, again without the remote needing to know the specifics of what it&apos;s undoing.</p>
            <p>Command wraps a request — &quot;turn the light on&quot; — as an object with a single <code>execute()</code> method (and often <code>undo()</code>). The remote (the <code>Invoker</code>) just holds a <code>Command</code> reference per button and calls <code>execute()</code> on it; it never touches the light directly. Because the request is now an object, it can be stored, queued, logged, passed around, or reversed, instead of being a one-shot method call that vanishes the moment it runs.</p>

            <h3>How it&apos;s built</h3>
            <p>A <code>Command</code> interface declares <code>execute()</code> (and optionally <code>undo()</code>). Concrete Commands (<code>LightOnCommand</code>, <code>LightOffCommand</code>) each hold a reference to a <code>Receiver</code> (the <code>Light</code> object that actually does the work) and, in <code>execute()</code>, call the appropriate method on it. The <code>Invoker</code> (the <code>RemoteControl</code>) holds Command references and calls <code>execute()</code> without knowing which concrete command or receiver is involved. For undo, the Invoker can keep a history stack of executed Commands and call <code>undo()</code> on the most recent one.</p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>Keep the Invoker completely ignorant of Receiver types — it should only ever call <code>execute()</code>/<code>undo()</code> on the Command interface, never reach through to the Receiver directly.</p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>Adding undo as an afterthought without giving each Command enough state to actually reverse its own effect — leading to an undo that doesn&apos;t restore the exact prior state.</p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>Adding undo support properly usually means each Command needs enough state to reverse its own effect — sometimes that&apos;s trivial (turn the light back off), sometimes it means capturing a snapshot of prior state, which pushes Command uncomfortably close to needing a Memento alongside it for anything non-trivial. Also, if every single button/action in your system gets its own Command class, you can end up with a proliferation of very small, similar-looking classes — reasonable in languages that support first-class functions, where a lambda can often stand in for a whole Command class without the extra ceremony.</p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/command/class-diagram.svg"
                alt="Command pattern class diagram showing RemoteControl Invoker holding RemoteCommand references implemented by LightOnCommand and LightOffCommand, each delegating to a Light Receiver"
              />
              <figcaption>RemoteControl calls execute()/undo() on whichever RemoteCommand is assigned, without knowing the Light directly</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>You need to decouple the thing that triggers an action (a button, a menu item, an API call) from the thing that performs it.</li>
                  <li>You need undo/redo, queuing, logging, or scheduling of requests — turning a request into an object is what makes all of these possible.</li>
                  <li>You want to support macro commands — bundling several commands together and executing them as one.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>The trigger and the action are permanently one-to-one and you&apos;ll never need to queue, log, undo, or reassign the action — a direct method call is simpler.</li>
                  <li>Undo isn&apos;t needed and the &quot;requests as objects&quot; flexibility has no use case in your system — the extra indirection buys you nothing.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are actually listening for:</strong> connecting Command to real infrastructure uses — job queues, task schedulers, and transactional systems where a request needs to be represented as data (so it can be retried, persisted, or logged) rather than executed immediately as a direct call. Also, being able to explain concretely how undo works — that it requires each Command to carry (or reconstruct) enough state to reverse its own effect, not just an abstract &quot;it supports undo.&quot;
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>GUI undo/redo stacks</strong> — text editors and image editors represent every edit as a command object so it can be undone or redone.</li>
              <li><strong>Job/task queues</strong> (Sidekiq, Celery, Hangfire) — a unit of work is serialized as a command/message, queued, and executed later, possibly by a different process.</li>
              <li><strong>Remote controls and home automation</strong> — each button or voice command maps to a Command object executed against the relevant device (light, thermostat, lock).</li>
              <li><strong>Transactional database operations</strong> — a sequence of operations packaged as commands that can be executed together and rolled back as a unit on failure.</li>
              <li><strong>Menu items and toolbar buttons in IDEs</strong> — each maps to a Command object rather than the UI code calling application logic directly.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>Same pattern, four languages. Every output shown here was captured from a real run — note undo restores the light to its state before the most recent button press, in reverse order.</p>
            <CodeTerminal snippets={snippets} />
          </section>

          <PageNav
            prev={{ label: 'Strategy', href: '/pages/lld/design-patterns/behavioral/strategy' }}
            next={{ label: 'State', href: '/pages/lld/design-patterns/behavioral/state' }}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
