# Builder Pattern

## Category
Creational

## The problem, in plain terms
You need to construct a `Computer` object that can have a CPU, RAM, storage, an optional GPU, an optional liquid cooler, an optional RGB lighting kit, and so on. A constructor that takes every combination of these as parameters either explodes into ten overloaded constructors or one constructor with eight parameters where callers have to remember the order and pass `null`/`false` for the ones they don't want. Both are miserable to read and easy to get wrong — did the fourth `true` mean "has GPU" or "has cooler"?

Builder fixes this by pulling construction out into its own object with named steps: `.setCPU(...).setRAM(...).addGPU(...).build()`. Each step is self-explanatory, optional steps are just steps you skip, and the object being built stays immutable and fully valid once `.build()` returns it.

## How it's built
A `Builder` object exposes chainable setter-style methods, each returning `this` so calls can be strung together (this style is often called a "fluent" builder). A final `.build()` method assembles everything into the actual product object and returns it. For genuinely complex products, a `Director` class can encapsulate common *recipes* — "build me a gaming PC" calls a fixed sequence of builder steps — while the `Builder` itself stays generic and reusable for any combination.

## Builder vs. just using a constructor with defaults
Languages with named/default parameters (Python, Kotlin) reduce the need for Builder in simple cases — you can call `Computer(cpu="i9", ram=32)` and skip the rest. Builder earns its place when construction has real *validation* or *ordering* logic (some combinations aren't valid, some steps depend on earlier ones), or when the product must be immutable and you don't want a half-built object visible to any code before it's fully configured.

## Where it bites you
It's another class (sometimes two, with a Director) to maintain for what might be a simple object. If your object realistically only has two or three fields and no optional combinations, a constructor is more honest than a Builder. Builder pays off specifically when the parameter list is long, mostly optional, and readability/immutability actually matter.
