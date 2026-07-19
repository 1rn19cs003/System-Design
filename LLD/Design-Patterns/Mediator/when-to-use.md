# When to Use Mediator

## Reach for it when
- A group of objects needs to communicate with each other, and letting them hold direct references to one another would create a tangled, quadratically-growing web of dependencies.
- You want to centralize interaction/coordination logic in one place instead of scattering it across every participant.
- You want to add or remove participants without having to update every existing participant's references.

## Don't reach for it when
- Only two objects need to communicate — a direct reference is simpler than routing through a middleman.
- The coordination logic is genuinely simple and unlikely to grow — introducing a Mediator can add more indirection than the problem calls for.

## What interviewers are actually listening for
Recognizing the trade-off explicitly: Mediator reduces many-to-many coupling between colleagues at the cost of concentrating complexity into a single mediator object, which can itself become a maintenance burden ("god object" risk) if it grows unchecked. Also, distinguishing Mediator from Observer — Mediator actively coordinates and can contain business logic about how colleagues interact, while Observer is a simpler one-directional broadcast from a Subject to its Observers with no coordination logic between the observers themselves.
