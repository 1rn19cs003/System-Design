# Visitor — Interview Questions

**What problem does Visitor solve?**
It lets you add new operations over a fixed set of element types without modifying those element classes — each new operation becomes a new Visitor class, rather than a new method scattered across every existing element class.

**What is "double dispatch" and why does Visitor need it?**
Double dispatch means the operation that actually executes depends on two types resolved through two separate method calls: first, the element's concrete `accept()` implementation is chosen based on the element's runtime type; then inside `accept()`, calling `visitor.visit(this)` resolves to the correct overload based on the compile-time type of `this` within that specific `accept()` method. This two-step resolution is what lets the right type-specific `visit()` method run without an explicit type-check/switch statement.

**What's the core trade-off of using Visitor?**
Adding a new operation is easy — just write a new Visitor implementing `visit()` for each existing element type. Adding a new element type is hard — every existing Visitor must be updated with a new `visit()` overload for that type. Visitor is the right choice specifically when element types are stable but operations grow often; it's the wrong choice if the reverse is true.

**Why can't a single overloaded method on the Subject decide which visit to call directly, without accept()?**
Most mainstream languages resolve overloaded methods based on the static/compile-time type of the argument, not its runtime type. If client code holds an element through a general `ItemElement` reference and calls `visitor.visit(item)` directly, the compiler would pick the `visit(ItemElement)` overload rather than the specific `visit(Book)` one, even if the item is actually a `Book` at runtime. Routing through the element's own `accept()` method fixes this, because inside `Book.accept()`, the compile-time type of `this` is genuinely `Book`.
