import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Flyweight Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `import java.util.HashMap;
import java.util.Map;

class TreeType {
    private final String name;
    private final String color;
    private final String texture;

    TreeType(String name, String color, String texture) {
        this.name = name;
        this.color = color;
        this.texture = texture;
    }

    void render(int x, int y) {
        System.out.println("Rendering " + name + " (" + color + ", " + texture + ") at (" + x + "," + y + ")");
    }
}

class TreeTypeFactory {
    private static Map<String, TreeType> cache = new HashMap<>();

    static TreeType getTreeType(String name, String color, String texture) {
        String key = name + "-" + color + "-" + texture;
        if (!cache.containsKey(key)) {
            System.out.println("Creating new TreeType for: " + key);
            cache.put(key, new TreeType(name, color, texture));
        }
        return cache.get(key);
    }

    static int cacheSize() {
        return cache.size();
    }
}

class Tree {
    private int x, y;
    private TreeType type;

    Tree(int x, int y, TreeType type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    void render() {
        type.render(x, y);
    }
}

public class Flyweight {
    public static void main(String[] args) {
        Tree[] forest = new Tree[]{
            new Tree(10, 20, TreeTypeFactory.getTreeType("Oak", "Green", "Rough")),
            new Tree(30, 40, TreeTypeFactory.getTreeType("Oak", "Green", "Rough")),
            new Tree(50, 60, TreeTypeFactory.getTreeType("Pine", "DarkGreen", "Smooth")),
        };

        for (Tree tree : forest) {
            tree.render();
        }

        System.out.println("Trees created: " + forest.length + ", TreeType flyweights cached: " + TreeTypeFactory.cacheSize());
    }
}`,
    output: `Creating new TreeType for: Oak-Green-Rough
Creating new TreeType for: Pine-DarkGreen-Smooth
Rendering Oak (Green, Rough) at (10,20)
Rendering Oak (Green, Rough) at (30,40)
Rendering Pine (DarkGreen, Smooth) at (50,60)
Trees created: 3, TreeType flyweights cached: 2`,
  },
  python: {
    code: `class TreeType:
    """The Flyweight: shared, immutable intrinsic state."""

    def __init__(self, name, color, texture):
        self.name = name
        self.color = color
        self.texture = texture

    def render(self, x, y):
        print(f"Rendering {self.name} ({self.color}, {self.texture}) at ({x},{y})")


class TreeTypeFactory:
    """Caches one TreeType per unique combination of intrinsic state."""

    _cache = {}

    @classmethod
    def get_tree_type(cls, name, color, texture):
        key = (name, color, texture)
        if key not in cls._cache:
            print(f"Creating new TreeType for: {name}-{color}-{texture}")
            cls._cache[key] = TreeType(name, color, texture)
        return cls._cache[key]

    @classmethod
    def cache_size(cls):
        return len(cls._cache)


class Tree:
    """Only stores extrinsic state + a reference to its shared TreeType."""

    def __init__(self, x, y, tree_type: TreeType):
        self.x = x
        self.y = y
        self.tree_type = tree_type

    def render(self):
        self.tree_type.render(self.x, self.y)


if __name__ == "__main__":
    forest = [
        Tree(10, 20, TreeTypeFactory.get_tree_type("Oak", "Green", "Rough")),
        Tree(30, 40, TreeTypeFactory.get_tree_type("Oak", "Green", "Rough")),
        Tree(50, 60, TreeTypeFactory.get_tree_type("Pine", "DarkGreen", "Smooth")),
    ]

    for tree in forest:
        tree.render()

    print(f"Trees created: {len(forest)}, TreeType flyweights cached: {TreeTypeFactory.cache_size()}")`,
    output: `Creating new TreeType for: Oak-Green-Rough
Creating new TreeType for: Pine-DarkGreen-Smooth
Rendering Oak (Green, Rough) at (10,20)
Rendering Oak (Green, Rough) at (30,40)
Rendering Pine (DarkGreen, Smooth) at (50,60)
Trees created: 3, TreeType flyweights cached: 2`,
  },
  javascript: {
    code: `class TreeType {
  constructor(name, color, texture) {
    this.name = name;
    this.color = color;
    this.texture = texture;
  }

  render(x, y) {
    console.log(\`Rendering \${this.name} (\${this.color}, \${this.texture}) at (\${x},\${y})\`);
  }
}

class TreeTypeFactory {
  static cache = new Map();

  static getTreeType(name, color, texture) {
    const key = \`\${name}-\${color}-\${texture}\`;
    if (!TreeTypeFactory.cache.has(key)) {
      console.log(\`Creating new TreeType for: \${key}\`);
      TreeTypeFactory.cache.set(key, new TreeType(name, color, texture));
    }
    return TreeTypeFactory.cache.get(key);
  }

  static cacheSize() {
    return TreeTypeFactory.cache.size;
  }
}

class Tree {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  render() {
    this.type.render(this.x, this.y);
  }
}

const forest = [
  new Tree(10, 20, TreeTypeFactory.getTreeType("Oak", "Green", "Rough")),
  new Tree(30, 40, TreeTypeFactory.getTreeType("Oak", "Green", "Rough")),
  new Tree(50, 60, TreeTypeFactory.getTreeType("Pine", "DarkGreen", "Smooth")),
];

forest.forEach(tree => tree.render());

console.log(\`Trees created: \${forest.length}, TreeType flyweights cached: \${TreeTypeFactory.cacheSize()}\`);

module.exports = { TreeType, TreeTypeFactory, Tree };`,
    output: `Creating new TreeType for: Oak-Green-Rough
Creating new TreeType for: Pine-DarkGreen-Smooth
Rendering Oak (Green, Rough) at (10,20)
Rendering Oak (Green, Rough) at (30,40)
Rendering Pine (DarkGreen, Smooth) at (50,60)
Trees created: 3, TreeType flyweights cached: 2`,
  },
  cpp: {
    code: `#include <iostream>
#include <string>
#include <unordered_map>
#include <memory>

class TreeType {
public:
    TreeType(std::string name, std::string color, std::string texture)
        : name_(std::move(name)), color_(std::move(color)), texture_(std::move(texture)) {}

    void render(int x, int y) const {
        std::cout << "Rendering " << name_ << " (" << color_ << ", " << texture_ << ") at (" << x << "," << y << ")" << std::endl;
    }

private:
    std::string name_, color_, texture_;
};

class TreeTypeFactory {
public:
    static TreeType* getTreeType(const std::string& name, const std::string& color, const std::string& texture) {
        std::string key = name + "-" + color + "-" + texture;
        auto it = cache_.find(key);
        if (it == cache_.end()) {
            std::cout << "Creating new TreeType for: " << key << std::endl;
            auto result = cache_.emplace(key, std::make_unique<TreeType>(name, color, texture));
            return result.first->second.get();
        }
        return it->second.get();
    }

    static size_t cacheSize() { return cache_.size(); }

private:
    static std::unordered_map<std::string, std::unique_ptr<TreeType>> cache_;
};

std::unordered_map<std::string, std::unique_ptr<TreeType>> TreeTypeFactory::cache_;

class Tree {
public:
    Tree(int x, int y, TreeType* type) : x_(x), y_(y), type_(type) {}

    void render() const { type_->render(x_, y_); }

private:
    int x_, y_;
    TreeType* type_;
};

int main() {
    Tree forest[] = {
        Tree(10, 20, TreeTypeFactory::getTreeType("Oak", "Green", "Rough")),
        Tree(30, 40, TreeTypeFactory::getTreeType("Oak", "Green", "Rough")),
        Tree(50, 60, TreeTypeFactory::getTreeType("Pine", "DarkGreen", "Smooth")),
    };

    for (const auto& tree : forest) tree.render();

    std::cout << "Trees created: 3, TreeType flyweights cached: " << TreeTypeFactory::cacheSize() << std::endl;

    return 0;
}`,
    output: `Creating new TreeType for: Oak-Green-Rough
Creating new TreeType for: Pine-DarkGreen-Smooth
Rendering Oak (Green, Rough) at (10,20)
Rendering Oak (Green, Rough) at (30,40)
Rendering Pine (DarkGreen, Smooth) at (50,60)
Trees created: 3, TreeType flyweights cached: 2`,
  },
};

const qaItems = [
  {
    q: "What's the difference between intrinsic and extrinsic state?",
    a: "Intrinsic state is data shared identically across many instances — immutable, safe to reuse, stored inside the shared Flyweight (a character's font/glyph). Extrinsic state is unique per logical instance — supplied by the caller at the point of use rather than stored in the Flyweight (a character's position on the page).",
  },
  {
    q: 'Why must intrinsic state be immutable?',
    a: 'Because a single Flyweight instance is shared across potentially thousands of logical objects. If intrinsic state could be mutated, changing it for one logical instance would change it for every other instance sharing that Flyweight — a bug that\'s extremely hard to trace.',
  },
  {
    q: 'How is Flyweight different from a generic object pool?',
    a: 'An object pool reuses objects to avoid allocation cost, typically resetting/mutating pooled objects between uses. Flyweight specifically separates state into shared-and-immutable (intrinsic) versus per-context (extrinsic, passed as arguments) — the shared objects are never mutated once created.',
  },
  {
    q: 'When would Flyweight actively hurt rather than help?',
    a: "When the object count is small, or most state is actually unique per instance — the factory/caching machinery adds complexity without meaningfully reducing memory use, and it pushes bookkeeping onto the caller who must correctly supply extrinsic state on every call.",
  },
];

export default function FlyweightPage() {
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
              { label: 'Flyweight' },
            ]}
          />
          <h1 id="overview">Flyweight Pattern</h1>
          <p>
            Uses sharing to support large numbers of fine-grained objects efficiently, by
            splitting state into shared (intrinsic) and per-instance (extrinsic).
          </p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>
              You&apos;re building a text editor rendering a million characters. If every
              character on screen is its own object holding its own font, size, color, and glyph
              bitmap, you&apos;re duplicating identical font/glyph data a million times — most
              characters share the exact same formatting. That&apos;s a huge amount of memory
              spent storing the same information redundantly.
            </p>
            <p>
              Flyweight splits each object&apos;s data into two categories:{' '}
              <strong>intrinsic state</strong> (shared and identical across many instances — the
              font, the glyph shape) and <strong>extrinsic state</strong> (unique per instance —
              position on screen, which character it is). You create and cache one shared
              Flyweight per unique combination of intrinsic state, and every &quot;instance&quot;
              references the shared object while supplying its own extrinsic state separately.
            </p>

            <h3>How it&apos;s built</h3>
            <p>
              A <code>FlyweightFactory</code> maintains a pool of Flyweight objects, keyed by
              intrinsic state. When something requests a Flyweight for a given combination, the
              factory returns an existing cached instance or creates and caches a new one. Client
              code calls operations on the Flyweight, passing extrinsic state in as arguments
              rather than storing it inside the Flyweight.
            </p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>
                  Keep intrinsic state genuinely immutable once created — that&apos;s exactly what
                  makes it safe for one shared instance to serve thousands of logical
                  &quot;objects&quot; at once.
                </p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>
                  Getting the intrinsic/extrinsic split wrong — accidentally sharing something
                  that should have been per-instance produces subtle bugs where unrelated objects
                  appear to affect each other.
                </p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>
              Flyweight only pays off with a genuinely large number of objects with substantial
              shared state — for a few dozen objects, the factory/cache machinery is pure
              overhead. It also pushes complexity onto the caller, who must track and pass in
              extrinsic state correctly every time, instead of an object simply holding its own
              data.
            </p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/flyweight/class-diagram.svg"
                alt="Flyweight pattern class diagram showing three Tree instances with extrinsic x,y position state referencing shared TreeType flyweights via TreeTypeFactory, with the Oak TreeType shared by two trees"
              />
              <figcaption>3 tree instances, only 2 shared TreeType flyweights created</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>You need a very large number of objects, and most of their state is actually shared across many of them.</li>
                  <li>Memory footprint is a real, measured concern at the scale you&apos;re operating at.</li>
                  <li>Shared (intrinsic) state can genuinely be made immutable.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>You don&apos;t have a large object count — the caching machinery is pure overhead.</li>
                  <li>Most state is actually unique per instance — little to share, little to save.</li>
                </ul>
              </Callout>
            </TwoCol>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Text/word processor rendering</strong> — glyph/font data shared across every occurrence of the same character; position is per-instance.</li>
              <li><strong>Java&apos;s <code>Integer.valueOf()</code> caching</strong> — small integer values are cached and reused rather than allocated fresh each time.</li>
              <li><strong>String interning</strong> (Java, Python) — identical string literals can share the same underlying memory since strings are immutable.</li>
              <li><strong>Game engines</strong> — trees, grass, bullets sharing mesh/texture data while each instance only stores position/rotation/scale.</li>
              <li><strong>Tile-based game maps</strong> — a tile map storing references to a small set of shared tile-type objects rather than a full object per grid cell.</li>
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
              Same pattern, four languages. Every output shown here was captured from a real run —
              note only 2 TreeType flyweights get created for 3 trees.
            </p>
            <CodeTerminal snippets={snippets} />
          </section>

          <PageNav
            prev={{ label: 'Facade', href: '/pages/lld/design-patterns/structural/facade' }}
            next={{ label: 'Proxy', href: '/pages/lld/design-patterns/structural/proxy' }}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
