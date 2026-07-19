# Decorator Pattern

## Category
Structural

## The problem, in plain terms
You're building a coffee shop ordering system. A `Coffee` can have milk, whipped cream, caramel, extra shots — any combination, each adding to the price and description. Modeling this with subclasses gives you `CoffeeWithMilk`, `CoffeeWithMilkAndCream`, `CoffeeWithMilkAndCreamAndCaramel` — a new class for every combination, again the class-explosion problem, except now it's driven by *optional add-ons* rather than two independent dimensions.

Decorator solves this by wrapping objects instead of subclassing them. Each add-on (`Milk`, `Cream`, `Caramel`) is its own small class that wraps a `Coffee` (or another decorator), implements the same `Coffee` interface, and adds its own bit of behavior (price, description) before or after delegating to the object it wraps. You build the final coffee by wrapping layer after layer at runtime: `new Caramel(new Cream(new Milk(new Espresso())))`.

## How it's built
A `Component` interface (`Coffee`) is implemented both by concrete base objects (`Espresso`) and by `Decorator` classes that also implement `Component` while holding a reference to a wrapped `Component`. Each decorator's methods typically call through to the wrapped object first, then add their own contribution — so a chain of decorators executes in the reverse order they were wrapped in. Because every decorator satisfies the same interface as the thing it wraps, decorators can be stacked arbitrarily and the caller can't tell (or need to care) how many layers deep the object is.

## Decorator vs. inheritance vs. Adapter
Inheritance fixes behavior additions at compile time, one fixed combination per subclass. Decorator adds behavior at *runtime*, and combinations aren't limited to what you thought to name in advance — any order, any subset. Unlike Adapter, a Decorator keeps the *same* interface as what it wraps (a decorated coffee is still a `Coffee` you can hand to any code expecting one) — it's not translating anything, it's layering on responsibility while staying interchangeable with the undecorated version.

## Where it bites you
Deeply nested decorator chains can get hard to read and debug — "what does this object actually do?" requires mentally unwinding several layers. Order can matter too (applying a discount decorator before vs. after a tax decorator gives different results), and that ordering isn't always obvious from the outside. It's also easy to over-decorate something that would be clearer as one configurable object with a few flags.
