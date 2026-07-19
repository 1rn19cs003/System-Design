# When to Use Command

## Reach for it when
- You need to decouple the thing that triggers an action (a button, a menu item, an API call) from the thing that performs it.
- You need undo/redo, queuing, logging, or scheduling of requests — turning a request into an object is what makes all of these possible.
- You want to support macro commands — bundling several commands together and executing them as one.

## Don't reach for it when
- The trigger and the action are permanently one-to-one and you'll never need to queue, log, undo, or reassign the action — a direct method call is simpler.
- Undo isn't needed and the "requests as objects" flexibility (queuing, logging, macros) has no use case in your system — the extra indirection buys you nothing.

## What interviewers are actually listening for
Connecting Command to real infrastructure uses: job queues, task schedulers, and transactional systems where a request needs to be represented as data (so it can be retried, persisted, or logged) rather than executed immediately as a direct call. Also, being able to explain concretely how undo works — that it requires each Command to carry (or reconstruct) enough state to reverse its own effect, not just an abstract "it supports undo."
