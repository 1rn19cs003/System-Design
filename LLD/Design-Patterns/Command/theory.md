# Command Pattern

## Category
Behavioral

## The problem, in plain terms
You're building a universal remote control with buttons that can be reprogrammed to trigger different actions — one button turns a light on, another closes the garage door, another triggers a whole "movie night" macro. The remote itself shouldn't need to know anything about lights or garage doors; it just needs to know "when this button is pressed, run whatever action was assigned to it." You also want undo — pressing an "undo" button should reverse whatever the last action did, again without the remote needing to know the specifics of what it's undoing.

Command wraps a request — "turn the light on" — as an object with a single `execute()` method (and often `undo()`). The remote (the `Invoker`) just holds a `Command` reference per button and calls `execute()` on it; it never touches the light directly. Because the request is now an object, it can be stored, queued, logged, passed around, or reversed, instead of being a one-shot method call that vanishes the moment it runs.

## How it's built
A `Command` interface declares `execute()` (and optionally `undo()`). Concrete Commands (`LightOnCommand`, `LightOffCommand`) each hold a reference to a `Receiver` (the `Light` object that actually does the work) and, in `execute()`, call the appropriate method on it. The `Invoker` (the `RemoteControl`) holds Command references and calls `execute()` without knowing which concrete command or receiver is involved. For undo, the Invoker can keep a history stack of executed Commands and call `undo()` on the most recent one.

## Where it bites you
Adding undo support properly usually means each Command needs enough state to reverse its own effect — sometimes that's trivial (turn the light back off), sometimes it means capturing a snapshot of prior state, which pushes Command uncomfortably close to needing a Memento alongside it for anything non-trivial. Also, if every single button/action in your system gets its own Command class, you can end up with a proliferation of very small, similar-looking classes — reasonable in languages that support first-class functions, where a lambda can often stand in for a whole Command class without the extra ceremony.
