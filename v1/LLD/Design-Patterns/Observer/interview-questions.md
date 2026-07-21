# Observer — Interview Questions

**What problem does Observer solve that a direct method call doesn't?**
A direct method call requires the caller to know exactly who it's calling — adding a new reaction means editing the caller. Observer lets the Subject broadcast a single notification to an open-ended, changeable list of Observers it knows nothing about concretely, so new reactions can be added or removed without touching the Subject's code.

**What's the difference between "push" and "pull" notification styles?**
Push: the Subject sends the changed data directly as arguments to `update()`, e.g. `update(newPrice)` — simple, but couples the Observer interface to exactly what the Subject decides to send. Pull: `update()` receives a reference to the Subject itself, and the Observer calls getters to retrieve whatever it needs — more flexible for observers with differing data needs, slightly heavier interface.

**How can Observer cause a memory leak, and how do you avoid it?**
If a Subject holds strong references to Observers and an Observer is never explicitly detached, the Subject keeps it alive even after the rest of the program is done with it — garbage collectors can't reclaim it. Fix: always provide and call a `detach()`/unsubscribe method when an Observer is no longer needed, or use weak references from the Subject's side so Observers can still be collected.

**How is Observer different from Mediator, since both deal with communication between objects?**
Observer is one-directional and typically one-to-many: a Subject broadcasts state changes to Observers, who don't talk back through the Subject. Mediator coordinates many-to-many communication between a set of Colleague objects that would otherwise need direct references to each other — the Mediator actively directs traffic between them, rather than just broadcasting a single event.
