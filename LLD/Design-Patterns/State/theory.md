# State Pattern

## Category
Behavioral

## The problem, in plain terms
You're building a document publishing workflow. A document starts as a `Draft`, moves to `Moderation` once someone submits it for review, and finally becomes `Published`. Calling `publish()` should behave completely differently depending on which of these states the document is currently in — from Draft it should move to Moderation; from Moderation, only a moderator should be able to actually publish it; from Published, calling `publish()` again should do nothing. The naive approach is a `status` field checked by a wall of `if (status == "draft") ... else if (status == "moderation") ...` inside every method that behaves differently per state — and that wall grows and gets duplicated across every method as more states and behaviors are added.

State pulls each state's behavior into its own class implementing a common interface, and the `Document` (the `Context`) simply delegates to whichever state object is currently active. Calling `document.publish()` just calls `currentState.publish(document)` — the Document doesn't need to know what "draft" or "moderation" actually implies; each state class encodes its own rules and even decides what the next state should be.

## How it's built
A `State` interface declares the operations that vary by state (`publish()`, `render()`, etc). Concrete states (`DraftState`, `ModerationState`, `PublishedState`) implement these operations according to their own rules, and — critically — often call `context.setState(nextState)` themselves as part of handling a request, meaning states actively drive their own transitions. The `Context` (`Document`) holds a reference to the current state object and delegates all state-dependent behavior to it, exposing `setState()` for states (or external code) to trigger a transition.

## Where it bites you
If transitions between states are scattered across many state classes with no central picture of the state machine, it can get hard to see or verify the full set of valid transitions just by reading the code — a state diagram (or comment mapping the full transition table) becomes important documentation alongside the code itself. Also, for a genuinely small number of states with simple, static rules, a plain `enum` plus a switch statement can be perfectly readable and the State pattern's extra classes are unnecessary ceremony.
