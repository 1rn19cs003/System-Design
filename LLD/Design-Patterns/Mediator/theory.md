# Mediator Pattern

## Category
Behavioral

## The problem, in plain terms
You're building a group chat feature. If every `User` object holds direct references to every other `User` in the room so it can send them messages, adding a fifth user means updating every existing user's list of references, and the number of connections grows quadratically as the room gets bigger. Worse, each `User` class now has to know about the existence and structure of every other `User` it talks to — a tangled, tightly-coupled mess where nobody can be changed in isolation.

Mediator introduces a middle object — the `ChatRoom` — that all users talk to instead of talking to each other directly. A user sends a message to the `ChatRoom`, and the `ChatRoom` is responsible for broadcasting it out to every other registered user. Users only need a reference to the mediator, not to each other; the mediator centralizes and owns all the "who talks to whom" logic that would otherwise be scattered across every participant.

## How it's built
A `Mediator` interface (or concrete class, `ChatRoom`) exposes a method like `sendMessage(sender, message)` and keeps track of registered `Colleague` objects (the `User`s). Each `Colleague` holds a reference to the mediator (not to other colleagues) and calls the mediator's method to communicate. The mediator's implementation contains the actual routing/broadcasting logic — in a chat room, forwarding a message to every user except the sender; in other contexts, potentially more complex coordination logic between colleagues.

## Where it bites you
Because all the coordination logic accumulates in one place, the mediator can become a large, complex "god object" if the number of colleagues and interaction rules grows significantly — the very complexity that was scattered across many classes is now concentrated in one, and that one class can become hard to maintain. It also means every colleague indirectly depends on the mediator being available and correctly wired, so testing a colleague in isolation typically requires a mock mediator.
