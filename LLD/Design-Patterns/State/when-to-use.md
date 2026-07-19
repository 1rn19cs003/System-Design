# When to Use State

## Reach for it when
- An object's behavior genuinely changes based on its internal state, and multiple methods each have their own per-state branching logic.
- The set of states and transitions is non-trivial and expected to grow, making a scattered `if/switch`-per-method approach hard to maintain.
- States themselves should be responsible for deciding the next valid transition, rather than external code managing a status field and deciding what's next.

## Don't reach for it when
- There are only two or three states with trivial, unlikely-to-change behavior differences — a simple `enum` and conditional is more direct and easier to scan.
- State transitions need to be centrally, explicitly validated/audited from one place — a table-driven state machine (or a dedicated state-machine library) may give clearer visibility than behavior scattered across state classes.

## What interviewers are actually listening for
Recognizing that State's essence is letting an object appear to change its class at runtime — the Context's behavior changes entirely just by swapping which State object it delegates to, with no change to the Context's own code. Also, being able to clearly distinguish State from Strategy despite the near-identical class structure: State variants actively trigger transitions to other states as part of their own logic, while Strategy variants are typically chosen once and don't know about each other.
