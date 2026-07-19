# Interpreter — Interview Questions

**What are terminal and nonterminal expressions in Interpreter?**
A terminal expression represents a basic, indivisible element of the grammar (a literal number) and directly returns a value when interpreted. A nonterminal expression represents a composite grammar rule (addition, subtraction) that holds references to child expressions and combines their interpreted results according to that rule — building up a tree structure.

**How does evaluating the whole expression tree actually work?**
You call `interpret()` on the root node of the tree. Each nonterminal expression's `interpret()` recursively calls `interpret()` on its child expressions and combines their results (e.g., adding them together), while each terminal expression's `interpret()` simply returns its own literal value — the recursion naturally evaluates the entire tree bottom-up.

**Why doesn't Interpreter scale well to large grammars?**
Because each distinct grammar rule needs its own class — a grammar with dozens of rules requires dozens of classes, which becomes unwieldy to maintain. Tree-walking interpretation is also typically much slower than a properly compiled or bytecode-based evaluator, since it recomputes the tree traversal on every evaluation rather than compiling the logic once.

**What do real-world systems use instead of hand-rolled Interpreter classes for larger grammars?**
Parser generator tools (ANTLR, yacc, PEG-based generators) or hand-written recursive-descent parsers that typically compile the grammar into a more efficient representation (bytecode, a direct AST walker generated from the grammar spec) rather than representing every single grammar rule as its own hand-written class.
