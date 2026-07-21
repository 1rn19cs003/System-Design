import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Composite Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `import java.util.ArrayList;
import java.util.List;

interface FileSystemComponent {
    int getSize();
    void print(String indent);
}

class FileLeaf implements FileSystemComponent {
    private String name;
    private int sizeKB;

    FileLeaf(String name, int sizeKB) {
        this.name = name;
        this.sizeKB = sizeKB;
    }

    public int getSize() {
        return sizeKB;
    }

    public void print(String indent) {
        System.out.println(indent + "- " + name + " (" + sizeKB + "KB)");
    }
}

class Folder implements FileSystemComponent {
    private String name;
    private List<FileSystemComponent> children = new ArrayList<>();

    Folder(String name) {
        this.name = name;
    }

    void add(FileSystemComponent component) {
        children.add(component);
    }

    public int getSize() {
        int total = 0;
        for (FileSystemComponent child : children) {
            total += child.getSize();
        }
        return total;
    }

    public void print(String indent) {
        System.out.println(indent + "+ " + name + "/ (" + getSize() + "KB total)");
        for (FileSystemComponent child : children) {
            child.print(indent + "  ");
        }
    }
}

public class Composite {
    public static void main(String[] args) {
        Folder root = new Folder("project");
        Folder src = new Folder("src");
        src.add(new FileLeaf("main.java", 12));
        src.add(new FileLeaf("utils.java", 5));

        Folder docs = new Folder("docs");
        docs.add(new FileLeaf("readme.md", 3));

        root.add(src);
        root.add(docs);
        root.add(new FileLeaf("build.gradle", 2));

        root.print("");
        System.out.println("Total size: " + root.getSize() + "KB");
    }
}`,
    output: `+ project/ (22KB total)
  + src/ (17KB total)
    - main.java (12KB)
    - utils.java (5KB)
  + docs/ (3KB total)
    - readme.md (3KB)
  - build.gradle (2KB)
Total size: 22KB`,
  },
  python: {
    code: `from abc import ABC, abstractmethod


class FileSystemComponent(ABC):
    @abstractmethod
    def get_size(self):
        ...

    @abstractmethod
    def print_tree(self, indent=""):
        ...


class FileLeaf(FileSystemComponent):
    def __init__(self, name, size_kb):
        self.name = name
        self.size_kb = size_kb

    def get_size(self):
        return self.size_kb

    def print_tree(self, indent=""):
        print(f"{indent}- {self.name} ({self.size_kb}KB)")


class Folder(FileSystemComponent):
    def __init__(self, name):
        self.name = name
        self.children = []

    def add(self, component: FileSystemComponent):
        self.children.append(component)

    def get_size(self):
        return sum(child.get_size() for child in self.children)

    def print_tree(self, indent=""):
        print(f"{indent}+ {self.name}/ ({self.get_size()}KB total)")
        for child in self.children:
            child.print_tree(indent + "  ")


if __name__ == "__main__":
    root = Folder("project")
    src = Folder("src")
    src.add(FileLeaf("main.py", 12))
    src.add(FileLeaf("utils.py", 5))

    docs = Folder("docs")
    docs.add(FileLeaf("readme.md", 3))

    root.add(src)
    root.add(docs)
    root.add(FileLeaf("setup.cfg", 2))

    root.print_tree()
    print(f"Total size: {root.get_size()}KB")`,
    output: `+ project/ (22KB total)
  + src/ (17KB total)
    - main.py (12KB)
    - utils.py (5KB)
  + docs/ (3KB total)
    - readme.md (3KB)
  - setup.cfg (2KB)
Total size: 22KB`,
  },
  javascript: {
    code: `class FileLeaf {
  constructor(name, sizeKB) {
    this.name = name;
    this.sizeKB = sizeKB;
  }

  getSize() {
    return this.sizeKB;
  }

  print(indent = "") {
    console.log(\`\${indent}- \${this.name} (\${this.sizeKB}KB)\`);
  }
}

class Folder {
  constructor(name) {
    this.name = name;
    this.children = [];
  }

  add(component) {
    this.children.push(component);
  }

  getSize() {
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }

  print(indent = "") {
    console.log(\`\${indent}+ \${this.name}/ (\${this.getSize()}KB total)\`);
    this.children.forEach(child => child.print(indent + "  "));
  }
}

const root = new Folder("project");
const src = new Folder("src");
src.add(new FileLeaf("main.js", 12));
src.add(new FileLeaf("utils.js", 5));

const docs = new Folder("docs");
docs.add(new FileLeaf("readme.md", 3));

root.add(src);
root.add(docs);
root.add(new FileLeaf("package.json", 2));

root.print();
console.log(\`Total size: \${root.getSize()}KB\`);

module.exports = { FileLeaf, Folder };`,
    output: `+ project/ (22KB total)
  + src/ (17KB total)
    - main.js (12KB)
    - utils.js (5KB)
  + docs/ (3KB total)
    - readme.md (3KB)
  - package.json (2KB)
Total size: 22KB`,
  },
  cpp: {
    code: `#include <iostream>
#include <string>
#include <vector>
#include <memory>

class FileSystemComponent {
public:
    virtual int getSize() const = 0;
    virtual void print(const std::string& indent) const = 0;
    virtual ~FileSystemComponent() = default;
};

class FileLeaf : public FileSystemComponent {
public:
    FileLeaf(std::string name, int sizeKB) : name_(std::move(name)), sizeKB_(sizeKB) {}

    int getSize() const override { return sizeKB_; }

    void print(const std::string& indent) const override {
        std::cout << indent << "- " << name_ << " (" << sizeKB_ << "KB)" << std::endl;
    }

private:
    std::string name_;
    int sizeKB_;
};

class Folder : public FileSystemComponent {
public:
    explicit Folder(std::string name) : name_(std::move(name)) {}

    void add(std::unique_ptr<FileSystemComponent> component) {
        children_.push_back(std::move(component));
    }

    int getSize() const override {
        int total = 0;
        for (const auto& child : children_) total += child->getSize();
        return total;
    }

    void print(const std::string& indent) const override {
        std::cout << indent << "+ " << name_ << "/ (" << getSize() << "KB total)" << std::endl;
        for (const auto& child : children_) child->print(indent + "  ");
    }

private:
    std::string name_;
    std::vector<std::unique_ptr<FileSystemComponent>> children_;
};

int main() {
    auto root = std::make_unique<Folder>("project");
    auto src = std::make_unique<Folder>("src");
    src->add(std::make_unique<FileLeaf>("main.cpp", 12));
    src->add(std::make_unique<FileLeaf>("utils.cpp", 5));

    auto docs = std::make_unique<Folder>("docs");
    docs->add(std::make_unique<FileLeaf>("readme.md", 3));

    root->add(std::move(src));
    root->add(std::move(docs));
    root->add(std::make_unique<FileLeaf>("CMakeLists.txt", 2));

    root->print("");
    std::cout << "Total size: " << root->getSize() << "KB" << std::endl;

    return 0;
}`,
    output: `+ project/ (22KB total)
  + src/ (17KB total)
    - main.cpp (12KB)
    - utils.cpp (5KB)
  + docs/ (3KB total)
    - readme.md (3KB)
  - CMakeLists.txt (2KB)
Total size: 22KB`,
  },
};

const qaItems = [
  {
    q: 'What problem does Composite solve, concretely?',
    a: 'It lets client code treat individual objects (leaves) and groups of objects (composites) uniformly through one shared interface. Without it, computing something recursive (total size, cost, rendering) requires manually checking "leaf or container?" at every level. With Composite, a container\'s implementation just delegates to its children\'s implementations — the recursion is built into the class hierarchy.',
  },
  {
    q: 'Where should add/remove-child operations live — on Component, or only on Composite?',
    a: 'Both are valid, with a trade-off. Putting them on Component maximizes uniformity but forces Leaf classes to implement or throw on methods that don\'t make sense for them. Putting them only on Composite keeps Leaf clean, but client code needs a type check or downcast before adding a child. Many real implementations choose the second option to avoid meaningless methods on leaves.',
  },
  {
    q: 'How does Composite typically pair with Visitor or Iterator?',
    a: "Visitor is commonly layered on top of Composite to add new operations across the whole tree (rendering, exporting, validating) without modifying the Component/Leaf/Composite classes. Iterator is often used to traverse a Composite's structure without exposing its internal representation to client code.",
  },
  {
    q: 'Can a Composite tree have mixed depth — some branches shallow, some deep?',
    a: "Yes, and that's the point. Because every node implements the same Component interface, client code recursing through the tree doesn't need to know or care how deep any particular branch goes — the recursion naturally bottoms out at leaves regardless of depth.",
  },
];

export default function CompositePage() {
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
              { label: 'Composite' },
            ]}
          />
          <h1 id="overview">Composite Pattern</h1>
          <p>
            Composes objects into tree structures and lets clients treat individual objects and
            compositions of objects uniformly.
          </p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>
              You&apos;re modeling a file system: files and folders. A folder can contain files and
              other folders. To compute the total size of a folder, you need to sum the sizes of
              everything inside it, including files nested several folders deep. The awkward part:
              code that calculates size has to check &quot;is this a file or a folder?&quot; at
              every level and recurse manually, duplicating that branching wherever size gets
              calculated.
            </p>
            <p>
              Composite gives both <code>File</code> and <code>Folder</code> the same interface —{' '}
              <code>getSize()</code> — so calling code never asks &quot;leaf or container?&quot; A{' '}
              <code>Folder</code>&apos;s <code>getSize()</code> just sums <code>getSize()</code>{' '}
              over its children, whether those children are files or more folders.
            </p>

            <h3>How it's built</h3>
            <p>
              A <code>Component</code> interface declares operations common to leaves and
              containers. <code>Leaf</code> (a <code>File</code>) implements it directly.{' '}
              <code>Composite</code> (a <code>Folder</code>) also implements it, but delegates to a
              collection of child <code>Component</code>s — which might themselves be leaves or
              further composites. The tree can be arbitrarily deep, and calling code walking it
              never needs to know how deep.
            </p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>
                  Let the recursion live inside the Composite&apos;s own implementation (a Folder
                  summing its children) — never make the caller manually recurse and type-check.
                </p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>
                  Putting child-management methods (<code>addChild()</code>) directly on the shared
                  Component interface without thinking it through — now every Leaf has to
                  implement or throw on a method that never makes sense for it.
                </p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>
              Giving leaves and composites the exact same interface sometimes forces a leaf to
              implement (or throw on) operations that only make sense for composites. Some
              implementations put child-management operations only on Composite, trading perfect
              interface uniformity for cleaner leaf classes — a real trade-off worth naming out
              loud.
            </p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/composite/class-diagram.svg"
                alt="Composite pattern class diagram showing FileSystemComponent interface implemented by FileLeaf and Folder, with Folder holding a list of child components that can recurse to any depth"
              />
              <figcaption>A Folder's children can themselves be Folders — the tree recurses to any depth</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>Modeling a part-whole hierarchy (file systems, UI trees, org charts, menus) where individuals and groups need the same treatment.</li>
                  <li>An operation needs to work correctly no matter how deep the tree goes, without manual recursion at the call site.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>Leaves and containers have fundamentally different operations client code genuinely needs to distinguish.</li>
                  <li>The structure isn&apos;t recursive/tree-shaped — a flat list doesn&apos;t need this.</li>
                </ul>
              </Callout>
            </TwoCol>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>File systems</strong> — the canonical example: files and folders both support size, folders aggregate recursively.</li>
              <li><strong>DOM trees</strong> — every node (element or text) implements a common interface.</li>
              <li><strong>UI component trees</strong> (Android View/ViewGroup) — measure/draw apply uniformly whether a child is a widget or another ViewGroup full of widgets.</li>
              <li><strong>Org charts</strong> — an Employee and a Manager can share &quot;total headcount&quot; or &quot;total salary cost under this person.&quot;</li>
              <li><strong>Menu systems</strong> — a MenuItem and a Menu (containing items and submenus) share a render() operation.</li>
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
            prev={{ label: 'Bridge', href: '/pages/lld/design-patterns/structural/bridge' }}
            next={{ label: 'Decorator', href: '/pages/lld/design-patterns/structural/decorator' }}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
