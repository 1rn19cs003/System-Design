# State — Interview Questions

**What does it mean that State lets an object "appear to change its class at runtime"?**
The Context's behavior for a given method call can change completely just by swapping which State object it currently delegates to — from the outside, calling the same method produces entirely different behavior depending on the active state, as if the Context itself had become a different class, even though the Context's own code never changed.

**Who decides the next state — the Context or the State objects?**
Typically the State objects themselves. A concrete state's method implementation both performs its state-specific logic and calls `context.setState(nextState)` to move the Context into the next state, meaning the transition logic is distributed across the state classes rather than centralized in the Context.

**How is State different from Strategy, given both have a Context holding a reference to an interface implementation?**
Structurally similar, but by intent: Strategy variants are usually selected once (or explicitly swapped in by client code) and don't know about or trigger each other. State variants represent a Context's internal condition and actively drive transitions to other states as part of handling requests — the states know about and cause movement between each other, which Strategy implementations typically don't do.

**When would you avoid the State pattern in favor of a simple enum + switch?**
When there are only a couple of states with simple, stable, unlikely-to-grow behavior differences — the overhead of a full class per state buys you little, and a straightforward conditional on an enum value is easier for a new reader to scan in one place.
