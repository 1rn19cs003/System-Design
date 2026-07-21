# Memento Pattern

## Category
Behavioral

## The problem, in plain terms
You're building a text editor with undo support. To undo, you need to be able to restore the document to some earlier state. The obvious approach is to let whatever code manages undo history reach directly into the `TextEditor` object and copy out its internal fields — but that breaks encapsulation, since external code now needs to know exactly what internal state the editor holds and how to reconstruct it. If the editor's internal representation changes later, the undo code breaks too.

Memento solves this by having the object itself (`TextEditor`, the `Originator`) create an opaque snapshot object (the `Memento`) that captures its own internal state, and hand that snapshot to external code without exposing what's inside it. The external code (a `History`/`Caretaker`) stores mementos and, to undo, hands a memento back to the originator, which restores its own state from it. The originator is the only thing that ever reads or writes the memento's actual internal contents — the caretaker just stores and passes it around as a black box.

## How it's built
The `Originator` (`TextEditor`) has a method like `save()` that creates and returns a `Memento` containing a copy of its current state, and a `restore(memento)` method that sets its state back from a given memento. The `Memento` itself only exposes what the Originator needs to read it back — often the memento's fields are private to everything except the Originator (achieved via a nested class, a "narrow" interface exposed to the Caretaker, or similar encapsulation tricks depending on the language). The `Caretaker` (`History`) just calls `originator.save()` to get mementos and stores them in a list/stack, calling `originator.restore(memento)` when undo is requested — it never inspects what's inside a memento.

## Where it bites you
Storing a full deep copy of large object state for every undo point can become memory-expensive if snapshots are taken frequently or the state is large — some implementations mitigate this by only storing diffs/deltas rather than full snapshots. Also, achieving true encapsulation (the Caretaker genuinely cannot read the memento's internals) requires some language-specific technique — many "textbook" implementations in practice just make the memento's fields readable, which weakens the encapsulation guarantee the pattern is meant to provide.
