# Template Method — Real-World Examples

- **Beverage preparation** — tea and coffee share boil-water and pour-into-cup steps, differing only in brewing and condiments.
- **Data pipeline frameworks** — a base "job" class defines read → transform → write, and specific jobs override only the transform step.
- **Unit testing frameworks** (JUnit's `setUp()`/`test...()`/`tearDown()` sequence) — the framework calls your test method within a fixed lifecycle it controls.
- **Servlet lifecycle** (`init()`, `service()`, `destroy()` in Java servlets) — the container calls these in a fixed order; you only implement the parts specific to your servlet.
- **Sorting algorithms with a customizable comparison step** — the overall sort sequence is fixed, but the comparison logic used within it is supplied by the caller.
