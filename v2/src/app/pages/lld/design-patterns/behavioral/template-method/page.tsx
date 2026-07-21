import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Template Method Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `// Template Method — CaffeineBeverage fixes the recipe sequence; Tea and Coffee fill in the varying steps.
// Compile: javac TemplateMethod.java
// Run:     java TemplateMethod

abstract class CaffeineBeverage {
    // The template method — final so subclasses can't change the sequence.
    final void prepareRecipe() {
        boilWater();
        brew();
        pourInCup();
        if (wantsCondiments()) {
            addCondiments();
        }
    }

    void boilWater() {
        System.out.println("Boiling water");
    }

    void pourInCup() {
        System.out.println("Pouring into cup");
    }

    abstract void brew();
    abstract void addCondiments();

    // Hook — subclasses may override; default is "yes".
    boolean wantsCondiments() {
        return true;
    }
}

class Tea extends CaffeineBeverage {
    void brew() {
        System.out.println("Steeping the tea");
    }

    void addCondiments() {
        System.out.println("Adding lemon");
    }
}

class Coffee extends CaffeineBeverage {
    void brew() {
        System.out.println("Dripping coffee through filter");
    }

    void addCondiments() {
        System.out.println("Adding sugar and milk");
    }

    // Overrides the hook — this coffee is prepared black.
    boolean wantsCondiments() {
        return false;
    }
}

public class TemplateMethod {
    public static void main(String[] args) {
        System.out.println("Preparing tea:");
        CaffeineBeverage tea = new Tea();
        tea.prepareRecipe();

        System.out.println("Preparing coffee (no condiments):");
        CaffeineBeverage coffee = new Coffee();
        coffee.prepareRecipe();
    }
}`,
    output: `Preparing tea:
Boiling water
Steeping the tea
Pouring into cup
Adding lemon
Preparing coffee (no condiments):
Boiling water
Dripping coffee through filter
Pouring into cup`,
  },
  python: {
    code: `"""
Template Method — CaffeineBeverage fixes the recipe sequence; Tea and Coffee fill in the varying steps.
Run: python template_method.py
"""

from abc import ABC, abstractmethod


class CaffeineBeverage(ABC):
    def prepare_recipe(self):
        """The template method — the fixed sequence of steps."""
        self.boil_water()
        self.brew()
        self.pour_in_cup()
        if self.wants_condiments():
            self.add_condiments()

    def boil_water(self):
        print("Boiling water")

    def pour_in_cup(self):
        print("Pouring into cup")

    @abstractmethod
    def brew(self):
        ...

    @abstractmethod
    def add_condiments(self):
        ...

    def wants_condiments(self):
        """Hook — subclasses may override; default is True."""
        return True


class Tea(CaffeineBeverage):
    def brew(self):
        print("Steeping the tea")

    def add_condiments(self):
        print("Adding lemon")


class Coffee(CaffeineBeverage):
    def brew(self):
        print("Dripping coffee through filter")

    def add_condiments(self):
        print("Adding sugar and milk")

    def wants_condiments(self):
        return False


if __name__ == "__main__":
    print("Preparing tea:")
    tea = Tea()
    tea.prepare_recipe()

    print("Preparing coffee (no condiments):")
    coffee = Coffee()
    coffee.prepare_recipe()`,
    output: `Preparing tea:
Boiling water
Steeping the tea
Pouring into cup
Adding lemon
Preparing coffee (no condiments):
Boiling water
Dripping coffee through filter
Pouring into cup`,
  },
  javascript: {
    code: `/**
 * Template Method — CaffeineBeverage fixes the recipe sequence; Tea and Coffee fill in the varying steps.
 * Run: node template_method.js
 */

class CaffeineBeverage {
  // The template method — the fixed sequence of steps.
  prepareRecipe() {
    this.boilWater();
    this.brew();
    this.pourInCup();
    if (this.wantsCondiments()) {
      this.addCondiments();
    }
  }

  boilWater() {
    console.log("Boiling water");
  }

  pourInCup() {
    console.log("Pouring into cup");
  }

  brew() {
    throw new Error("brew() must be implemented by subclass");
  }

  addCondiments() {
    throw new Error("addCondiments() must be implemented by subclass");
  }

  // Hook — subclasses may override; default is true.
  wantsCondiments() {
    return true;
  }
}

class Tea extends CaffeineBeverage {
  brew() {
    console.log("Steeping the tea");
  }

  addCondiments() {
    console.log("Adding lemon");
  }
}

class Coffee extends CaffeineBeverage {
  brew() {
    console.log("Dripping coffee through filter");
  }

  addCondiments() {
    console.log("Adding sugar and milk");
  }

  wantsCondiments() {
    return false;
  }
}

console.log("Preparing tea:");
const tea = new Tea();
tea.prepareRecipe();

console.log("Preparing coffee (no condiments):");
const coffee = new Coffee();
coffee.prepareRecipe();

module.exports = { CaffeineBeverage, Tea, Coffee };`,
    output: `Preparing tea:
Boiling water
Steeping the tea
Pouring into cup
Adding lemon
Preparing coffee (no condiments):
Boiling water
Dripping coffee through filter
Pouring into cup`,
  },
  cpp: {
    code: `// Template Method — CaffeineBeverage fixes the recipe sequence; Tea and Coffee fill in the varying steps.
// Compile: g++ -std=c++14 TemplateMethod.cpp -o template_method
// Run:     ./template_method

#include <iostream>

class CaffeineBeverage {
public:
    // The template method — not virtual, so subclasses can't change the sequence.
    void prepareRecipe() {
        boilWater();
        brew();
        pourInCup();
        if (wantsCondiments()) {
            addCondiments();
        }
    }

    virtual ~CaffeineBeverage() = default;

protected:
    void boilWater() {
        std::cout << "Boiling water" << std::endl;
    }

    void pourInCup() {
        std::cout << "Pouring into cup" << std::endl;
    }

    virtual void brew() = 0;
    virtual void addCondiments() = 0;

    // Hook — subclasses may override; default is true.
    virtual bool wantsCondiments() {
        return true;
    }
};

class Tea : public CaffeineBeverage {
protected:
    void brew() override {
        std::cout << "Steeping the tea" << std::endl;
    }

    void addCondiments() override {
        std::cout << "Adding lemon" << std::endl;
    }
};

class Coffee : public CaffeineBeverage {
protected:
    void brew() override {
        std::cout << "Dripping coffee through filter" << std::endl;
    }

    void addCondiments() override {
        std::cout << "Adding sugar and milk" << std::endl;
    }

    bool wantsCondiments() override {
        return false;
    }
};

int main() {
    std::cout << "Preparing tea:" << std::endl;
    Tea tea;
    tea.prepareRecipe();

    std::cout << "Preparing coffee (no condiments):" << std::endl;
    Coffee coffee;
    coffee.prepareRecipe();

    return 0;
}`,
    output: `Preparing tea:
Boiling water
Steeping the tea
Pouring into cup
Adding lemon
Preparing coffee (no condiments):
Boiling water
Dripping coffee through filter
Pouring into cup`,
  },
};

const qaItems = [
  {
    q: 'What is the "Hollywood principle" and how does Template Method use it?',
    a: <>&quot;Don&apos;t call us, we&apos;ll call you&quot; — the base class owns and controls the algorithm&apos;s sequence, and calls into subclass-provided steps at the right points, rather than the subclass driving when the shared logic executes. Subclasses provide pieces, but the base class remains in charge of the order.</>,
  },
  {
    q: 'Why is the template method itself usually marked final/non-overridable?',
    a: 'To guarantee the fixed sequence of steps can’t be silently reordered, skipped, or broken by a subclass — the whole point of the pattern is that the algorithm’s structure is shared and protected, while only specific, clearly-designated steps are left open for customization.',
  },
  {
    q: 'What’s a "hook" method in Template Method, and why use one?',
    a: <>A hook is a method with a default (often no-op) implementation in the base class that a subclass can optionally override to opt into extra behavior — like a <code>wantsCondiments()</code> check a subclass can override to skip a step — without needing to change the template method&apos;s logic itself.</>,
  },
  {
    q: 'How is Template Method different from Strategy?',
    a: 'Template Method uses inheritance: subclasses fill in specific steps of an algorithm whose overall shape lives in a shared base class. Strategy uses composition: an entire algorithm/behavior is swapped as one self-contained unit via a collaborator object injected into a Context, with no shared base-class control flow. Template Method fixes the skeleton and varies the details; Strategy varies the whole algorithm at once.',
  },
];

export default function TemplateMethodPatternPage() {
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
              { label: 'Template Method' },
            ]}
          />
          <h1 id="overview">Template Method Pattern</h1>
          <p>Fixes an algorithm&apos;s overall sequence in a base class, and lets subclasses fill in only the steps that vary, without being able to change the sequence itself.</p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>You&apos;re writing code to prepare both tea and coffee. Both follow almost the same sequence: boil water, brew (steep tea leaves or run water through coffee grounds), pour into a cup, add a condiment (lemon or sugar/milk). Only the brewing step and the condiment differ between the two — everything else is identical. Writing two completely separate methods duplicates the boil-water and pour-into-cup steps, and if you ever change the pouring logic, you have to remember to update it in both places.</p>
            <p>Template Method puts the overall sequence — the algorithm&apos;s skeleton — in a base class method that&apos;s marked final (not overridable), and calls out to abstract methods for the steps that vary. Subclasses (<code>Tea</code>, <code>Coffee</code>) only implement the varying steps; the sequence itself, and the steps that don&apos;t vary, live once in the base class and can&apos;t be silently reordered or skipped by a subclass.</p>

            <h3>How it&apos;s built</h3>
            <p>A base class defines a <code>prepareRecipe()</code> method that calls a fixed sequence of steps: <code>boilWater()</code>, <code>brew()</code>, <code>pourInCup()</code>, <code>addCondiments()</code>. Steps that are identical across all subclasses (<code>boilWater</code>, <code>pourInCup</code>) are implemented directly in the base class. Steps that vary (<code>brew</code>, <code>addCondiments</code>) are declared abstract, and each subclass provides its own implementation. Optionally, &quot;hook&quot; methods with a default (often no-op) implementation let subclasses opt into extra behavior — like a <code>wantsCondiments()</code> hook that a subclass can override to skip the condiment step entirely, without needing to touch <code>prepareRecipe()</code> itself.</p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>Mark the template method itself final/non-overridable, so the fixed sequence genuinely stays fixed across every subclass.</p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>Leaving the template method overridable &quot;just in case&quot; — that quietly undermines the entire guarantee the pattern is meant to provide.</p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>Because the base class calls into subclass-implemented methods (a technique sometimes called &quot;the Hollywood principle&quot; — don&apos;t call us, we&apos;ll call you), the control flow can be harder to trace by reading a single class in isolation; you have to look at both the base class&apos;s template method and whichever subclass is instantiated to see the full picture. Overusing hooks can also make the base algorithm&apos;s actual behavior hard to predict just by reading it, since so much depends on which hooks a given subclass overrides.</p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/template-method/class-diagram.svg"
                alt="Template Method diagram showing CaffeineBeverage abstract base class defining prepareRecipe() as a fixed sequence, with Tea and Coffee subclasses implementing only the brew() and addCondiments() steps"
              />
              <figcaption>Tea and Coffee only implement the steps that vary; the sequence lives once in CaffeineBeverage</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>Several classes implement the same overall algorithm/sequence, differing only in specific steps.</li>
                  <li>You want to enforce a fixed order of operations across all variants, so subclasses can&apos;t accidentally skip or reorder steps.</li>
                  <li>You want an easy way to add a new variant by implementing only the steps that differ.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>The variants don&apos;t actually share a common sequence — forcing an artificial shared abstraction adds awkward complexity.</li>
                  <li>A composition-based alternative (Strategy) fits better — Template Method relies on inheritance, a tighter coupling than composition.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are actually listening for:</strong> recognizing the &quot;Hollywood principle&quot; (don&apos;t call us, we&apos;ll call you) — the base class controls the flow and calls into the subclass, rather than the subclass controlling when the shared steps run. Also, distinguishing Template Method (inheritance-based, fixed skeleton with pluggable steps) from Strategy (composition-based, an entire algorithm swapped as one unit) — a very commonly confused pair.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Beverage preparation</strong> — tea and coffee share boil-water and pour-into-cup steps, differing only in brewing and condiments.</li>
              <li><strong>Data pipeline frameworks</strong> — a base &quot;job&quot; class defines read → transform → write, and specific jobs override only the transform step.</li>
              <li><strong>Unit testing frameworks</strong> (JUnit&apos;s <code>setUp()</code>/<code>test...()</code>/<code>tearDown()</code>) — the framework calls your test method within a fixed lifecycle it controls.</li>
              <li><strong>Servlet lifecycle</strong> (<code>init()</code>, <code>service()</code>, <code>destroy()</code> in Java servlets) — the container calls these in a fixed order; you implement only the servlet-specific parts.</li>
              <li><strong>Sorting algorithms with a customizable comparison step</strong> — the overall sort sequence is fixed, but the comparison logic is supplied by the caller.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>Same pattern, four languages. Every output shown here was captured from a real run — note &quot;Adding lemon&quot; only appears for tea, since coffee&apos;s hook override skips the condiments step entirely.</p>
            <CodeTerminal snippets={snippets} />
          </section>

          <PageNav
            prev={{ label: 'Chain of Responsibility', href: '/pages/lld/design-patterns/behavioral/chain-of-responsibility' }}
            next={{ label: 'Iterator', href: '/pages/lld/design-patterns/behavioral/iterator' }}
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
