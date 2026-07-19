# Bridge Pattern

## Category
Structural

## The problem, in plain terms
You're building a set of `Shape` classes — `Circle`, `Square` — and each one needs to render using different graphics APIs — `OpenGL`, `DirectX`. Do this naively with inheritance and you get `OpenGLCircle`, `DirectXCircle`, `OpenGLSquare`, `DirectXSquare` — a new class for every combination of shape and renderer. Add a third renderer or a third shape, and the class count multiplies again. This is the classic "class explosion" that happens when two independent dimensions of variation (what kind of shape, which rendering API) get tangled together in a single inheritance hierarchy.

Bridge splits the two dimensions into two separate hierarchies that can vary independently, connected by composition instead of inheritance. A `Shape` holds a reference to a `Renderer` (any renderer) and delegates the actual drawing work to it. Adding a new shape means one new class. Adding a new renderer means one new class. They combine at runtime, not at compile time via a fixed inheritance tree.

## How it's built
Two hierarchies: the **abstraction** (`Shape`, with subclasses like `Circle`) holds a reference to an **implementor** interface (`Renderer`, with concrete implementations like `OpenGLRenderer`, `DirectXRenderer`). The abstraction's methods call through to the implementor rather than implementing the low-level details themselves. Crucially, the abstraction and the implementor can each be extended independently — that's the entire point of "bridging" them with composition instead of inheriting through both dimensions at once.

## Bridge vs. Adapter (a common point of confusion)
Both use composition to delegate to another object, and both diagrams can look similar. The difference is *intent* and *timing*: Adapter is applied after the fact to make an existing, incompatible interface work with your code. Bridge is designed in up front, specifically to let two hierarchies vary independently from the start — you're not working around an incompatibility, you're preventing a combinatorial explosion before it happens.

## Where it bites you
Bridge adds indirection and two hierarchies where a single class might have sufficed — if you only ever have one implementor (one renderer, one database, one platform) and no real plan to add more, the split is unnecessary complexity. It earns its keep specifically when both dimensions are genuinely expected to grow independently.
