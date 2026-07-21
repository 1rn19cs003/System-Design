# When to Use Memento

## Reach for it when
- You need to implement undo/redo, checkpoints, or rollback for an object's state, without exposing that object's internal representation to the code managing the history.
- You want the object itself to be responsible for capturing and restoring its own state, keeping that logic in one place rather than scattered across external code.

## Don't reach for it when
- The state is trivially small and simple enough that just copying a couple of public fields directly is clear and safe — full encapsulated snapshot machinery is unnecessary ceremony.
- Undo can be achieved more efficiently by replaying a log of commands (see Command) rather than storing full state snapshots — appropriate when re-deriving state is cheap and storing every full snapshot would be wasteful.

## What interviewers are actually listening for
Understanding that the core value of Memento is preserving encapsulation while still allowing external code to manage history — the Caretaker stores mementos opaquely and never reaches into their internals. Also, being able to discuss the memory cost trade-off of full-state snapshots versus command-log-based undo (pairing Memento with Command, or replacing it with Command's replay/undo entirely), showing awareness of real implementation trade-offs rather than reciting the pattern by rote.
