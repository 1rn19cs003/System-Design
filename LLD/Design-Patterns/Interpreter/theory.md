# Interpreter Pattern

## Category
Behavioral

## The problem, in plain terms
You want your application to evaluate simple arithmetic expressions supplied as data, like `"5 + 3 - 2"`, without hard-coding every possible expression as a method in your language. Writing a single big function that parses and evaluates the whole string works for very simple grammars, but as the grammar grows — parentheses, more operators, variables — that one function turns into a tangle of string-parsing logic that's hard to extend or reason about.

Interpreter represents each grammar rule as its own class implementing a common `Expression` interface with an `interpret()` method. A `NumberExpression` just returns its literal value. An `AddExpression` holds references to two other expressions and returns the sum of interpreting each of them. Because expressions can hold other expressions, you build up a tree — the same idea as an abstract syntax tree in a real compiler — and evaluating the whole expression just means calling `interpret()` on the root, which recursively calls `interpret()` down through the tree.

## How it's built
An `Expression` interface declares `interpret()`. `TerminalExpression` classes (like `NumberExpression`) represent the grammar's basic building blocks and directly return a value. `NonterminalExpression` classes (like `AddExpression`, `SubtractExpression`) represent composite rules, holding references to child expressions and combining their interpreted results according to the rule. A separate parsing step (not really part of the pattern itself) turns raw input, like a string, into this tree of Expression objects, which is then interpreted by calling `interpret()` on the root node.

## Where it bites you
Interpreter works cleanly for genuinely small, simple grammars, but scales poorly — each grammar rule needs its own class, so a grammar with dozens of rules means dozens of classes, and the resulting tree-walking interpretation is typically much slower than a proper parser generator or hand-written recursive-descent parser producing optimized code. For anything beyond a toy expression language, most real systems reach for a parser generator (ANTLR, yacc) or a hand-rolled parser rather than a literal class-per-grammar-rule Interpreter implementation.
