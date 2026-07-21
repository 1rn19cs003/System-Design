# Command — Interview Questions

**What are the core participants in Command, and what does each do?**
Command declares `execute()` (and often `undo()`). ConcreteCommand implements it and holds a reference to a Receiver, delegating the actual work to it. Receiver is the object that knows how to perform the operation. Invoker holds a Command reference and triggers `execute()` without knowing the concrete command or receiver involved.

**How does Command enable undo?**
Because a request is represented as an object rather than a one-shot method call, that object can also carry an `undo()` method and whatever state it needs to reverse its own effect. The Invoker keeps a history stack of executed commands, and undo simply calls `undo()` on the most recently executed one.

**Why would you use Command instead of just calling the Receiver's method directly?**
Because the Invoker (button, menu item, scheduler) shouldn't need to know which Receiver or which specific operation is behind it — that binding can change at runtime, be queued, logged, retried, or reversed. A direct method call can't be stored, replayed, or undone; a Command object can.

**How does Command relate to job queues in backend systems?**
A job/task in a queue is essentially a Command — a serialized representation of "do this operation with this data" that gets executed later, possibly by a completely different process than the one that created it. The queue is the Invoker (deciding when to trigger execution), and the worker executing the job is effectively calling `execute()` on it.
