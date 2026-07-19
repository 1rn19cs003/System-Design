# Memento — Interview Questions

**What are the three roles in Memento, and what does each do?**
Originator is the object whose state needs to be saved/restored — it creates mementos of itself and can restore its own state from one. Memento is the opaque snapshot object holding captured state, exposed only to the Originator's full reading. Caretaker stores mementos (often in a stack/list for undo history) and requests restores, but never inspects a memento's actual contents.

**Why does the Caretaker never read a memento's internal state?**
Because the whole point of the pattern is preserving encapsulation — the object being snapshotted (the Originator) is the only thing that understands its own internal representation. If the Caretaker could freely read memento internals, external code would become coupled to the Originator's internal structure, defeating the purpose.

**What's the main cost/trade-off of using Memento for undo?**
Storing a full snapshot of state for every undo point can be memory-expensive, especially for large objects or frequent snapshots. An alternative is storing a log of reversible commands (pairing with or replacing Memento with Command) and replaying/undoing them, which can be cheaper if state is large but changes are small.

**How does Memento relate to Command when both support undo?**
They solve undo differently: Memento captures and restores full state snapshots, letting the Originator's `restore()` jump directly back to a previous state. Command-based undo instead has each executed command carry enough information to reverse its own specific effect, without needing a full state snapshot — often cheaper, but requires every command to correctly implement its own inverse operation.
