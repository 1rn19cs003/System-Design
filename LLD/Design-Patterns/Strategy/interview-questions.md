# Strategy — Interview Questions

**What problem does Strategy solve, concretely?**
It replaces a growing `if/else` or `switch` chain that picks between different algorithms/behaviors with a set of interchangeable classes implementing a common interface, so the code that uses the behavior doesn't need to change every time a new variant is added.

**How is Strategy different from just passing a function/lambda?**
In languages with first-class functions, a plain function reference genuinely can act as a lightweight Strategy — the essence of the pattern is the Context depending on an abstraction for the varying behavior, not specifically a class hierarchy. Class-based Strategy earns its keep when a variant needs its own state or is more than a single pure operation.

**Does Strategy decide which strategy to use?**
No — Strategy only defines the interchangeable-behavior structure. Something else (often a factory, configuration, or user selection) still has to decide which concrete Strategy gets plugged into the Context; conflating "define the strategies" with "pick the right one" is a common design smell.

**How is Strategy different from State, since both involve a Context holding a reference to an interface implementation?**
Structurally similar, but intent differs. Strategy variants are usually chosen once (or explicitly swapped by the client) and don't know about each other. State pattern variants represent a Context's internal state and often trigger transitions to other states themselves as part of handling a request — the states actively participate in moving the Context between states, which Strategy implementations typically don't do.
