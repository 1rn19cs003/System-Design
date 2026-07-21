import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Mediator Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `// Mediator Pattern — a ChatRoom routes messages between Users instead of Users talking directly.
// Compile: javac Mediator.java
// Run:     java Mediator

import java.util.ArrayList;
import java.util.List;

interface ChatMediator {
    void sendMessage(String message, User sender);
    void addUser(User user);
}

class ChatRoom implements ChatMediator {
    private List<User> users = new ArrayList<>();

    public void addUser(User user) {
        users.add(user);
    }

    public void sendMessage(String message, User sender) {
        for (User user : users) {
            if (user != sender) {
                user.receive(message, sender.getName());
            }
        }
    }
}

class User {
    private String name;
    private ChatMediator mediator;

    User(String name, ChatMediator mediator) {
        this.name = name;
        this.mediator = mediator;
    }

    String getName() {
        return name;
    }

    void send(String message) {
        System.out.println(name + " sends: " + message);
        mediator.sendMessage(message, this);
    }

    void receive(String message, String fromName) {
        System.out.println(name + " received from " + fromName + ": " + message);
    }
}

public class Mediator {
    public static void main(String[] args) {
        ChatRoom chatRoom = new ChatRoom();

        User alice = new User("Alice", chatRoom);
        User bob = new User("Bob", chatRoom);
        User carol = new User("Carol", chatRoom);

        chatRoom.addUser(alice);
        chatRoom.addUser(bob);
        chatRoom.addUser(carol);

        alice.send("Hey everyone!");
        bob.send("Hi Alice!");
    }
}`,
    output: `Alice sends: Hey everyone!
Bob received from Alice: Hey everyone!
Carol received from Alice: Hey everyone!
Bob sends: Hi Alice!
Alice received from Bob: Hi Alice!
Carol received from Bob: Hi Alice!`,
  },
  python: {
    code: `"""
Mediator Pattern — a ChatRoom routes messages between Users instead of Users talking directly.
Run: python mediator.py
"""


class ChatRoom:
    def __init__(self):
        self.users = []

    def add_user(self, user):
        self.users.append(user)

    def send_message(self, message, sender):
        for user in self.users:
            if user is not sender:
                user.receive(message, sender.name)


class User:
    def __init__(self, name, mediator: ChatRoom):
        self.name = name
        self.mediator = mediator

    def send(self, message):
        print(f"{self.name} sends: {message}")
        self.mediator.send_message(message, self)

    def receive(self, message, from_name):
        print(f"{self.name} received from {from_name}: {message}")


if __name__ == "__main__":
    chat_room = ChatRoom()

    alice = User("Alice", chat_room)
    bob = User("Bob", chat_room)
    carol = User("Carol", chat_room)

    chat_room.add_user(alice)
    chat_room.add_user(bob)
    chat_room.add_user(carol)

    alice.send("Hey everyone!")
    bob.send("Hi Alice!")`,
    output: `Alice sends: Hey everyone!
Bob received from Alice: Hey everyone!
Carol received from Alice: Hey everyone!
Bob sends: Hi Alice!
Alice received from Bob: Hi Alice!
Carol received from Bob: Hi Alice!`,
  },
  javascript: {
    code: `/**
 * Mediator Pattern — a ChatRoom routes messages between Users instead of Users talking directly.
 * Run: node mediator.js
 */

class ChatRoom {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    this.users.push(user);
  }

  sendMessage(message, sender) {
    this.users.forEach(user => {
      if (user !== sender) {
        user.receive(message, sender.name);
      }
    });
  }
}

class User {
  constructor(name, mediator) {
    this.name = name;
    this.mediator = mediator;
  }

  send(message) {
    console.log(\`\${this.name} sends: \${message}\`);
    this.mediator.sendMessage(message, this);
  }

  receive(message, fromName) {
    console.log(\`\${this.name} received from \${fromName}: \${message}\`);
  }
}

const chatRoom = new ChatRoom();

const alice = new User("Alice", chatRoom);
const bob = new User("Bob", chatRoom);
const carol = new User("Carol", chatRoom);

chatRoom.addUser(alice);
chatRoom.addUser(bob);
chatRoom.addUser(carol);

alice.send("Hey everyone!");
bob.send("Hi Alice!");

module.exports = { ChatRoom, User };`,
    output: `Alice sends: Hey everyone!
Bob received from Alice: Hey everyone!
Carol received from Alice: Hey everyone!
Bob sends: Hi Alice!
Alice received from Bob: Hi Alice!
Carol received from Bob: Hi Alice!`,
  },
  cpp: {
    code: `// Mediator Pattern — a ChatRoom routes messages between Users instead of Users talking directly.
// Compile: g++ -std=c++14 Mediator.cpp -o mediator
// Run:     ./mediator

#include <iostream>
#include <string>
#include <vector>

class User;

class ChatMediator {
public:
    virtual void sendMessage(const std::string& message, User* sender) = 0;
    virtual void addUser(User* user) = 0;
    virtual ~ChatMediator() = default;
};

class User {
public:
    User(std::string name, ChatMediator* mediator) : name_(std::move(name)), mediator_(mediator) {}

    const std::string& getName() const { return name_; }

    void send(const std::string& message) {
        std::cout << name_ << " sends: " << message << std::endl;
        mediator_->sendMessage(message, this);
    }

    void receive(const std::string& message, const std::string& fromName) {
        std::cout << name_ << " received from " << fromName << ": " << message << std::endl;
    }

private:
    std::string name_;
    ChatMediator* mediator_;
};

class ChatRoom : public ChatMediator {
public:
    void addUser(User* user) override {
        users_.push_back(user);
    }

    void sendMessage(const std::string& message, User* sender) override {
        for (auto* user : users_) {
            if (user != sender) {
                user->receive(message, sender->getName());
            }
        }
    }

private:
    std::vector<User*> users_;
};

int main() {
    ChatRoom chatRoom;

    User alice("Alice", &chatRoom);
    User bob("Bob", &chatRoom);
    User carol("Carol", &chatRoom);

    chatRoom.addUser(&alice);
    chatRoom.addUser(&bob);
    chatRoom.addUser(&carol);

    alice.send("Hey everyone!");
    bob.send("Hi Alice!");

    return 0;
}`,
    output: `Alice sends: Hey everyone!
Bob received from Alice: Hey everyone!
Carol received from Alice: Hey everyone!
Bob sends: Hi Alice!
Alice received from Bob: Hi Alice!
Carol received from Bob: Hi Alice!`,
  },
};

const qaItems = [
  {
    q: 'What problem does Mediator solve?',
    a: 'It replaces a web of direct many-to-many references between communicating objects with a single central object that routes communication between them. Instead of every object needing references to every other object it talks to, each one only needs a reference to the mediator.',
  },
  {
    q: 'What’s the risk of using Mediator, and when does it show up?',
    a: 'The mediator can turn into a "god object" — since all the coordination logic that used to be scattered across many colleague classes is now concentrated in one place, that one class can grow large and complex as the number of colleagues and interaction rules increases, becoming a maintenance burden itself.',
  },
  {
    q: 'How is Mediator different from Observer?',
    a: 'Observer is a simpler, typically one-directional broadcast: a Subject notifies Observers of a state change, and Observers don’t coordinate with each other through the Subject. Mediator actively coordinates interaction between multiple Colleague objects and can contain real business logic about how those colleagues should interact with each other, not just a notification broadcast.',
  },
  {
    q: 'Why does using a Mediator make unit testing individual colleagues easier?',
    a: 'Because each colleague only depends on the mediator interface rather than on every other concrete colleague it might interact with, you can test a colleague in isolation by supplying a mock/stub mediator, rather than needing to construct a whole web of real interconnected objects just to exercise one piece.',
  },
];

export default function MediatorPatternPage() {
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
              { label: 'Mediator' },
            ]}
          />
          <h1 id="overview">Mediator Pattern</h1>
          <p>Introduces a central object that routes communication between a group of objects, so they interact through it instead of holding direct references to each other.</p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>You&apos;re building a group chat feature. If every <code>User</code> object holds direct references to every other <code>User</code> in the room so it can send them messages, adding a fifth user means updating every existing user&apos;s list of references, and the number of connections grows quadratically as the room gets bigger. Worse, each <code>User</code> class now has to know about the existence and structure of every other <code>User</code> it talks to — a tangled, tightly-coupled mess where nobody can be changed in isolation.</p>
            <p>Mediator introduces a middle object — the <code>ChatRoom</code> — that all users talk to instead of talking to each other directly. A user sends a message to the <code>ChatRoom</code>, and the <code>ChatRoom</code> is responsible for broadcasting it out to every other registered user. Users only need a reference to the mediator, not to each other; the mediator centralizes and owns all the &quot;who talks to whom&quot; logic that would otherwise be scattered across every participant.</p>

            <h3>How it&apos;s built</h3>
            <p>A <code>Mediator</code> interface (or concrete class, <code>ChatRoom</code>) exposes a method like <code>sendMessage(sender, message)</code> and keeps track of registered <code>Colleague</code> objects (the <code>User</code>s). Each <code>Colleague</code> holds a reference to the mediator (not to other colleagues) and calls the mediator&apos;s method to communicate. The mediator&apos;s implementation contains the actual routing/broadcasting logic — in a chat room, forwarding a message to every user except the sender; in other contexts, potentially more complex coordination logic between colleagues.</p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>Keep colleagues genuinely ignorant of each other — the moment one colleague reaches around the mediator to talk to another directly, the whole point of the pattern is undermined.</p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>Letting the mediator accumulate unrelated responsibilities over time until it becomes a sprawling &quot;god object&quot; that&apos;s hard to change safely.</p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>Because all the coordination logic accumulates in one place, the mediator can become a large, complex &quot;god object&quot; if the number of colleagues and interaction rules grows significantly — the very complexity that was scattered across many classes is now concentrated in one, and that one class can become hard to maintain. It also means every colleague indirectly depends on the mediator being available and correctly wired, so testing a colleague in isolation typically requires a mock mediator.</p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/mediator/class-diagram.svg"
                alt="Mediator pattern diagram showing ChatRoom routing messages between Alice, Bob, and Carol, none of whom hold direct references to each other"
              />
              <figcaption>Users only reference ChatRoom — never each other — for all communication</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>A group of objects needs to communicate, and direct references between them would create a tangled, quadratically-growing web of dependencies.</li>
                  <li>You want to centralize interaction/coordination logic in one place instead of scattering it across every participant.</li>
                  <li>You want to add or remove participants without updating every existing participant&apos;s references.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>Only two objects need to communicate — a direct reference is simpler than routing through a middleman.</li>
                  <li>The coordination logic is genuinely simple and unlikely to grow — a Mediator can add more indirection than the problem calls for.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are actually listening for:</strong> recognizing the trade-off explicitly — Mediator reduces many-to-many coupling between colleagues at the cost of concentrating complexity into a single mediator object, which can itself become a maintenance burden if it grows unchecked. Also, distinguishing Mediator from Observer — Mediator actively coordinates and can contain business logic about how colleagues interact, while Observer is a simpler one-directional broadcast with no coordination logic between the observers themselves.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Chat rooms / group messaging</strong> — a chat room object routes messages between participants instead of each user holding direct references to every other user.</li>
              <li><strong>Air traffic control</strong> — the control tower (mediator) coordinates aircraft (colleagues) so planes don&apos;t need to communicate directly with every other plane.</li>
              <li><strong>GUI dialog/form coordination</strong> — a dialog controller mediates between form fields and buttons, rather than each field needing direct references to every other field.</li>
              <li><strong>Message brokers / event buses</strong> (RabbitMQ, Kafka) — publishers and subscribers interact through a broker rather than directly with each other.</li>
              <li><strong>Workflow orchestrators</strong> — a central orchestrator coordinates calls between multiple microservices, rather than each service calling every other service directly.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>Same pattern, four languages. Every output shown here was captured from a real run — note each message reaches every user except the sender.</p>
            <CodeTerminal snippets={snippets} />
          </section>

          <PageNav
            prev={{ label: 'Iterator', href: '/pages/lld/design-patterns/behavioral/iterator' }}
            next={{ label: 'Memento', href: '/pages/lld/design-patterns/behavioral/memento' }}
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
