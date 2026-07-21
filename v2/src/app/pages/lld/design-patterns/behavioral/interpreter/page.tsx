import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicSidebar from '@/components/TopicSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageNav from '@/components/PageNav';
import { Callout, TwoCol } from '@/components/Callout';
import QA from '@/components/QA';
import CodeTerminal from '@/components/CodeTerminal';

export const metadata = {
  title: 'Interpreter Pattern — System Design Architectures',
};

const snippets = {
  java: {
    code: `// Interpreter Pattern — a small tree of Expression objects evaluates "5 + 3 - 2".
// Compile: javac Interpreter.java
// Run:     java Interpreter

interface Expression {
    int interpret();
}

// Terminal expression — a literal number.
class NumberExpression implements Expression {
    private int number;

    NumberExpression(int number) {
        this.number = number;
    }

    public int interpret() {
        return number;
    }
}

// Nonterminal expression — addition of two sub-expressions.
class AddExpression implements Expression {
    private Expression left;
    private Expression right;

    AddExpression(Expression left, Expression right) {
        this.left = left;
        this.right = right;
    }

    public int interpret() {
        return left.interpret() + right.interpret();
    }
}

// Nonterminal expression — subtraction of two sub-expressions.
class SubtractExpression implements Expression {
    private Expression left;
    private Expression right;

    SubtractExpression(Expression left, Expression right) {
        this.left = left;
        this.right = right;
    }

    public int interpret() {
        return left.interpret() - right.interpret();
    }
}

public class Interpreter {
    public static void main(String[] args) {
        // Build the tree for "5 + 3 - 2" as ((5 + 3) - 2).
        Expression five = new NumberExpression(5);
        Expression three = new NumberExpression(3);
        Expression two = new NumberExpression(2);

        Expression addition = new AddExpression(five, three);
        Expression expression = new SubtractExpression(addition, two);

        System.out.println("Evaluating: (5 + 3) - 2");
        System.out.println("Result: " + expression.interpret());

        // A second, differently-shaped expression: 10 - (4 + 1).
        Expression tree2 = new SubtractExpression(
            new NumberExpression(10),
            new AddExpression(new NumberExpression(4), new NumberExpression(1))
        );

        System.out.println("Evaluating: 10 - (4 + 1)");
        System.out.println("Result: " + tree2.interpret());
    }
}`,
    output: `Evaluating: (5 + 3) - 2
Result: 6
Evaluating: 10 - (4 + 1)
Result: 5`,
  },
  python: {
    code: `"""
Interpreter Pattern — a small tree of Expression objects evaluates "5 + 3 - 2".
Run: python interpreter.py
"""

from abc import ABC, abstractmethod


class Expression(ABC):
    @abstractmethod
    def interpret(self):
        ...


class NumberExpression(Expression):
    """Terminal expression — a literal number."""

    def __init__(self, number):
        self.number = number

    def interpret(self):
        return self.number


class AddExpression(Expression):
    """Nonterminal expression — addition of two sub-expressions."""

    def __init__(self, left: Expression, right: Expression):
        self.left = left
        self.right = right

    def interpret(self):
        return self.left.interpret() + self.right.interpret()


class SubtractExpression(Expression):
    """Nonterminal expression — subtraction of two sub-expressions."""

    def __init__(self, left: Expression, right: Expression):
        self.left = left
        self.right = right

    def interpret(self):
        return self.left.interpret() - self.right.interpret()


if __name__ == "__main__":
    # Build the tree for "5 + 3 - 2" as ((5 + 3) - 2).
    five = NumberExpression(5)
    three = NumberExpression(3)
    two = NumberExpression(2)

    addition = AddExpression(five, three)
    expression = SubtractExpression(addition, two)

    print("Evaluating: (5 + 3) - 2")
    print(f"Result: {expression.interpret()}")

    # A second, differently-shaped expression: 10 - (4 + 1).
    tree2 = SubtractExpression(
        NumberExpression(10),
        AddExpression(NumberExpression(4), NumberExpression(1)),
    )

    print("Evaluating: 10 - (4 + 1)")
    print(f"Result: {tree2.interpret()}")`,
    output: `Evaluating: (5 + 3) - 2
Result: 6
Evaluating: 10 - (4 + 1)
Result: 5`,
  },
  javascript: {
    code: `/**
 * Interpreter Pattern — a small tree of Expression objects evaluates "5 + 3 - 2".
 * Run: node interpreter.js
 */

class NumberExpression {
  constructor(number) {
    this.number = number;
  }

  interpret() {
    return this.number;
  }
}

class AddExpression {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  interpret() {
    return this.left.interpret() + this.right.interpret();
  }
}

class SubtractExpression {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  interpret() {
    return this.left.interpret() - this.right.interpret();
  }
}

// Build the tree for "5 + 3 - 2" as ((5 + 3) - 2).
const five = new NumberExpression(5);
const three = new NumberExpression(3);
const two = new NumberExpression(2);

const addition = new AddExpression(five, three);
const expression = new SubtractExpression(addition, two);

console.log("Evaluating: (5 + 3) - 2");
console.log(\`Result: \${expression.interpret()}\`);

// A second, differently-shaped expression: 10 - (4 + 1).
const tree2 = new SubtractExpression(
  new NumberExpression(10),
  new AddExpression(new NumberExpression(4), new NumberExpression(1))
);

console.log("Evaluating: 10 - (4 + 1)");
console.log(\`Result: \${tree2.interpret()}\`);

module.exports = { NumberExpression, AddExpression, SubtractExpression };`,
    output: `Evaluating: (5 + 3) - 2
Result: 6
Evaluating: 10 - (4 + 1)
Result: 5`,
  },
  cpp: {
    code: `// Interpreter Pattern — a small tree of Expression objects evaluates "5 + 3 - 2".
// Compile: g++ -std=c++14 Interpreter.cpp -o interpreter
// Run:     ./interpreter

#include <iostream>
#include <memory>

class Expression {
public:
    virtual int interpret() const = 0;
    virtual ~Expression() = default;
};

// Terminal expression — a literal number.
class NumberExpression : public Expression {
public:
    explicit NumberExpression(int number) : number_(number) {}

    int interpret() const override {
        return number_;
    }

private:
    int number_;
};

// Nonterminal expression — addition of two sub-expressions.
class AddExpression : public Expression {
public:
    AddExpression(std::shared_ptr<Expression> left, std::shared_ptr<Expression> right)
        : left_(std::move(left)), right_(std::move(right)) {}

    int interpret() const override {
        return left_->interpret() + right_->interpret();
    }

private:
    std::shared_ptr<Expression> left_;
    std::shared_ptr<Expression> right_;
};

// Nonterminal expression — subtraction of two sub-expressions.
class SubtractExpression : public Expression {
public:
    SubtractExpression(std::shared_ptr<Expression> left, std::shared_ptr<Expression> right)
        : left_(std::move(left)), right_(std::move(right)) {}

    int interpret() const override {
        return left_->interpret() - right_->interpret();
    }

private:
    std::shared_ptr<Expression> left_;
    std::shared_ptr<Expression> right_;
};

int main() {
    // Build the tree for "5 + 3 - 2" as ((5 + 3) - 2).
    auto five = std::make_shared<NumberExpression>(5);
    auto three = std::make_shared<NumberExpression>(3);
    auto two = std::make_shared<NumberExpression>(2);

    auto addition = std::make_shared<AddExpression>(five, three);
    auto expression = std::make_shared<SubtractExpression>(addition, two);

    std::cout << "Evaluating: (5 + 3) - 2" << std::endl;
    std::cout << "Result: " << expression->interpret() << std::endl;

    // A second, differently-shaped expression: 10 - (4 + 1).
    auto tree2 = std::make_shared<SubtractExpression>(
        std::make_shared<NumberExpression>(10),
        std::make_shared<AddExpression>(std::make_shared<NumberExpression>(4), std::make_shared<NumberExpression>(1))
    );

    std::cout << "Evaluating: 10 - (4 + 1)" << std::endl;
    std::cout << "Result: " << tree2->interpret() << std::endl;

    return 0;
}`,
    output: `Evaluating: (5 + 3) - 2
Result: 6
Evaluating: 10 - (4 + 1)
Result: 5`,
  },
};

const qaItems = [
  {
    q: 'What are terminal and nonterminal expressions in Interpreter?',
    a: 'A terminal expression represents a basic, indivisible element of the grammar and directly returns a value when interpreted. A nonterminal expression represents a composite grammar rule that holds references to child expressions and combines their interpreted results according to that rule — building up a tree structure.',
  },
  {
    q: 'How does evaluating the whole expression tree actually work?',
    a: <>You call <code>interpret()</code> on the root node of the tree. Each nonterminal expression&apos;s <code>interpret()</code> recursively calls <code>interpret()</code> on its child expressions and combines their results, while each terminal expression&apos;s <code>interpret()</code> simply returns its own literal value — the recursion naturally evaluates the entire tree bottom-up.</>,
  },
  {
    q: 'Why doesn’t Interpreter scale well to large grammars?',
    a: 'Because each distinct grammar rule needs its own class — a grammar with dozens of rules requires dozens of classes, which becomes unwieldy to maintain. Tree-walking interpretation is also typically much slower than a properly compiled or bytecode-based evaluator.',
  },
  {
    q: 'What do real-world systems use instead of hand-rolled Interpreter classes for larger grammars?',
    a: 'Parser generator tools (ANTLR, yacc, PEG-based generators) or hand-written recursive-descent parsers that typically compile the grammar into a more efficient representation rather than representing every single grammar rule as its own hand-written class.',
  },
];

export default function InterpreterPatternPage() {
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
              { label: 'Interpreter' },
            ]}
          />
          <h1 id="overview">Interpreter Pattern</h1>
          <p>Represents each rule of a simple grammar as its own class, so evaluating an expression means building a tree of these objects and recursively calling interpret() on it.</p>

          <section id="theory">
            <h2>Theory</h2>

            <h3>The problem, in plain terms</h3>
            <p>You want your application to evaluate simple arithmetic expressions supplied as data, like <code>&quot;5 + 3 - 2&quot;</code>, without hard-coding every possible expression as a method in your language. Writing a single big function that parses and evaluates the whole string works for very simple grammars, but as the grammar grows — parentheses, more operators, variables — that one function turns into a tangle of string-parsing logic that&apos;s hard to extend or reason about.</p>
            <p>Interpreter represents each grammar rule as its own class implementing a common <code>Expression</code> interface with an <code>interpret()</code> method. A <code>NumberExpression</code> just returns its literal value. An <code>AddExpression</code> holds references to two other expressions and returns the sum of interpreting each of them. Because expressions can hold other expressions, you build up a tree — the same idea as an abstract syntax tree in a real compiler — and evaluating the whole expression just means calling <code>interpret()</code> on the root, which recursively calls <code>interpret()</code> down through the tree.</p>

            <h3>How it&apos;s built</h3>
            <p>An <code>Expression</code> interface declares <code>interpret()</code>. <code>TerminalExpression</code> classes (like <code>NumberExpression</code>) represent the grammar&apos;s basic building blocks and directly return a value. <code>NonterminalExpression</code> classes (like <code>AddExpression</code>, <code>SubtractExpression</code>) represent composite rules, holding references to child expressions and combining their interpreted results according to the rule. A separate parsing step turns raw input into this tree of Expression objects, which is then interpreted by calling <code>interpret()</code> on the root node.</p>

            <TwoCol>
              <Callout kind="good" title="✓ Good practice">
                <p>Reach for Interpreter only for genuinely small, stable grammars — it&apos;s a good fit for a tiny expression or rule language, not a general-purpose one.</p>
              </Callout>
              <Callout kind="bad" title="✕ Common mistake">
                <p>Reaching for a full class-per-grammar-rule Interpreter implementation for a grammar that&apos;s actually large or growing — a parser generator scales far better.</p>
              </Callout>
            </TwoCol>

            <h3>Where it bites you</h3>
            <p>Interpreter works cleanly for genuinely small, simple grammars, but scales poorly — each grammar rule needs its own class, so a grammar with dozens of rules means dozens of classes, and the resulting tree-walking interpretation is typically much slower than a proper parser generator or hand-written recursive-descent parser producing optimized code. For anything beyond a toy expression language, most real systems reach for a parser generator (ANTLR, yacc) or a hand-rolled parser rather than a literal class-per-grammar-rule Interpreter implementation.</p>
          </section>

          <section id="diagram">
            <h2>Diagram</h2>
            <figure>
              <img
                className="diagram-img"
                src="/assets/interpreter/class-diagram.svg"
                alt="Interpreter pattern diagram showing an Expression interface implemented by NumberExpression terminal nodes and AddExpression/SubtractExpression nonterminal nodes, building a tree for (5 + 3) - 2"
              />
              <figcaption>The tree for (5 + 3) - 2 — interpret() recurses bottom-up, yielding 6</figcaption>
            </figure>
          </section>

          <section id="when-to-use">
            <h2>When to Use</h2>
            <TwoCol>
              <Callout kind="good" title="✓ Reach for it when">
                <ul>
                  <li>You have a genuinely small, simple grammar to evaluate repeatedly.</li>
                  <li>Representing the grammar as a tree of objects, each interpretable on its own, is a natural fit.</li>
                  <li>The grammar is stable and unlikely to grow into something much larger.</li>
                </ul>
              </Callout>
              <Callout kind="bad" title="✕ Don't reach for it when">
                <ul>
                  <li>The grammar is large or likely to grow substantially — a parser generator scales far better.</li>
                  <li>Performance matters and the tree will be evaluated extremely frequently — tree-walking interpretation is typically slow.</li>
                </ul>
              </Callout>
            </TwoCol>
            <p style={{ marginTop: 16 }}>
              <strong>What interviewers are actually listening for:</strong> recognizing that Interpreter is essentially &quot;build a tiny AST and evaluate it recursively,&quot; and being honest about its scaling limits — most production-grade language/expression parsing uses dedicated parser generators rather than a literal Interpreter-pattern implementation once the grammar grows beyond something small.
            </p>
          </section>

          <section id="real-world">
            <h2>Real-World Examples</h2>
            <ul>
              <li><strong>Simple calculator/expression evaluators</strong> — parsing and evaluating arithmetic expressions as a tree of Expression objects.</li>
              <li><strong>Business rule engines</strong> — simple conditional rules represented as a tree of evaluable rule expressions.</li>
              <li><strong>Regular expression engines</strong> (conceptually) — a regex pattern compiled into a tree/state machine of matching expressions.</li>
              <li><strong>SQL-like query filters embedded in applications</strong> — a simplified filter language parsed into a tree of filter expressions.</li>
              <li><strong>Spreadsheet formula evaluation</strong> — a cell formula parsed into a tree of operations and evaluated recursively.</li>
            </ul>
          </section>

          <section id="interview-questions">
            <h2>Interview Questions</h2>
            <p>Click a question to reveal the answer.</p>
            <QA items={qaItems} />
          </section>

          <section id="code">
            <h2>Code &amp; Output</h2>
            <p>Same pattern, four languages. Every output shown here was captured from a real run — note two differently-shaped trees both evaluate correctly through the same recursive interpret() call.</p>
            <CodeTerminal snippets={snippets} />
          </section>

          <PageNav
            prev={{ label: 'Visitor', href: '/pages/lld/design-patterns/behavioral/visitor' }}
            next={{ label: 'Case Studies', href: '/pages/case-studies' }}
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
