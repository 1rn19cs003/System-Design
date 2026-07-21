# Visitor — Real-World Examples

- **Compiler AST processing** — separate visitors handle type-checking, code generation, and optimization over the same fixed set of syntax tree node types.
- **Document export pipelines** — a document made of fixed element types (paragraph, image, table) can be visited by separate PDF-export, HTML-export, or plain-text-export visitors.
- **Shopping cart pricing/tax rules** — different item types (books, electronics, groceries) are visited by a pricing visitor that applies category-specific tax logic.
- **Static analysis tools / linters** — a linter visits every node in a parsed codebase's syntax tree, applying different rule checks without modifying the AST node classes themselves.
- **UI component tree operations** — separate visitors compute layout, accessibility checks, or serialization over the same fixed set of UI component types.
