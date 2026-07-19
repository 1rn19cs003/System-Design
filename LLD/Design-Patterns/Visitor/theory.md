# Visitor Pattern

## Category
Behavioral

## The problem, in plain terms
You have a shopping cart containing different item types — `Book` and `Electronic` — and you need to compute a final price that applies different tax rules to each type: books are tax-exempt, electronics carry a flat tax rate. The obvious approach is a `calculatePrice()` method on each item class. But now imagine you also need to add a "generate shipping label" operation, and later an "apply holiday discount" operation — every new operation means going back and adding a new method to every single item class, even though the operation itself (say, pricing) has nothing to do with what the item class is fundamentally responsible for representing.

Visitor solves this by moving each operation into its own separate `Visitor` class, with one `visit(...)` method per item type. Each item class implements a single, stable method — `accept(visitor)` — that simply calls the correct `visit()` overload on the visitor, passing itself in. Adding a brand-new operation (shipping labels, discounts) means writing one new Visitor class, without touching `Book` or `Electronic` at all. The trade-off is the reverse: adding a brand-new item type does require updating every existing Visitor.

## How it's built
An `Element` interface (`ItemElement`) declares `accept(visitor)`. Concrete elements (`Book`, `Electronic`) implement `accept()` to call `visitor.visit(this)` — note this is exactly the right overload of `visit()` because the compile-time type of `this` inside `Book.accept()` is `Book`, letting the language's method overload resolution pick `visit(Book)` automatically. This two-step call (`accept()` calling back into `visit()`) is called "double dispatch" — the operation that actually runs depends on both the concrete element type and the concrete visitor type, resolved through two separate method calls rather than one.

## Where it bites you
Visitor is genuinely awkward when new element types are added frequently, since every existing Visitor implementation needs a new `visit()` method for the new type — this is the mirror image of the flexibility it buys you for adding new operations. It's specifically well-suited to systems where the set of element types is stable (rarely changes) but the set of operations over those types grows often — get that assumption backwards and Visitor becomes more work than it saves.
