# Mediator — Interview Questions

**What problem does Mediator solve?**
It replaces a web of direct many-to-many references between communicating objects with a single central object that routes communication between them. Instead of every object needing references to every other object it talks to, each one only needs a reference to the mediator.

**What's the risk of using Mediator, and when does it show up?**
The mediator can turn into a "god object" — since all the coordination logic that used to be scattered across many colleague classes is now concentrated in one place, that one class can grow large and complex as the number of colleagues and interaction rules increases, becoming a maintenance burden itself.

**How is Mediator different from Observer?**
Observer is a simpler, typically one-directional broadcast: a Subject notifies Observers of a state change, and Observers don't coordinate with each other through the Subject. Mediator actively coordinates interaction between multiple Colleague objects and can contain real business logic about how those colleagues should interact with each other, not just a notification broadcast.

**Why does using a Mediator make unit testing individual colleagues easier?**
Because each colleague only depends on the mediator interface rather than on every other concrete colleague it might interact with, you can test a colleague in isolation by supplying a mock/stub mediator, rather than needing to construct a whole web of real interconnected objects just to exercise one piece.
