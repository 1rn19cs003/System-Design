# When to Use Observer

## Reach for it when
- Multiple, potentially unknown-in-advance parts of the system need to react to a single object's state changes.
- You want to add or remove reactions to an event without modifying the thing producing the event.
- The Subject and its Observers should be decoupled — the Subject shouldn't need to import or know the concrete types of everything watching it.

## Don't reach for it when
- There's exactly one consumer of the change, permanently — a direct method call is simpler and easier to trace than an indirection layer.
- The order in which observers are notified matters strictly and observers have interdependencies — plain Observer gives no ordering guarantees, and coordinating strict order across observers usually signals you want Mediator instead.

## What interviewers are actually listening for
Recognizing this as the backbone of event-driven and reactive systems (pub/sub, GUI event listeners, MVC's model-notifies-view relationship) rather than treating it as an isolated toy pattern. Also, being able to name the memory-leak risk of Subjects holding onto Observers that were never detached, and knowing the push-vs-pull tradeoff for what data `update()` carries.
