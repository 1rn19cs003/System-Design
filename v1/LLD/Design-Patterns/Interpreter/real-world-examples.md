# Interpreter — Real-World Examples

- **Simple calculator/expression evaluators** — parsing and evaluating arithmetic expressions like `"5 + 3 - 2"` as a tree of Expression objects.
- **Business rule engines** — simple conditional rules ("if amount > 1000 and region == 'US'") represented as a tree of evaluable rule expressions.
- **Regular expression engines** (at a conceptual level) — a regex pattern is compiled into a tree/state machine of matching expressions, each interpretable against input text.
- **SQL-like query filters embedded in applications** — a simplified filter language (e.g., search query syntax) parsed into a tree of filter expressions and evaluated against records.
- **Spreadsheet formula evaluation** — a cell formula like `=A1+B2*C3` is parsed into a tree of operations and evaluated recursively.
