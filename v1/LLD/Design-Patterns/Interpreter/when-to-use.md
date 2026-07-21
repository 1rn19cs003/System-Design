# When to Use Interpreter

## Reach for it when
- You have a genuinely small, simple grammar to evaluate repeatedly (a basic expression language, a simple rules engine, a small query filter language).
- Representing the grammar as a tree of objects, each interpretable on its own, is a natural fit for the problem.
- The grammar is stable and unlikely to grow into something much larger.

## Don't reach for it when
- The grammar is large or likely to grow substantially — a parser generator (ANTLR, yacc) or hand-written recursive-descent parser will scale far better than one class per grammar rule.
- Performance matters and the expression tree will be evaluated extremely frequently — tree-walking interpretation is typically much slower than a compiled or bytecode-based approach.

## What interviewers are actually listening for
Recognizing that Interpreter is essentially "build a tiny AST and evaluate it recursively," and being honest about its scaling limits — most production-grade language/expression parsing uses dedicated parser generators rather than a literal Interpreter-pattern implementation once the grammar grows beyond something small. Also, being able to connect the pattern to real, common use cases: simple rule engines, basic calculator/expression evaluators, and small filter/query languages embedded inside larger applications.
