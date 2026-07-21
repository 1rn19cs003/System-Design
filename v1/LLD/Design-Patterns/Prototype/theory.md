# Prototype Pattern

## Category
Creational

## The problem, in plain terms
You've got a `Enemy` object in a game that took real work to set up — it loaded a 3D model, computed pathfinding data, initialized stats from a config file. You now need fifty more of the exact same enemy type on screen. Calling `new Enemy()` fifty times and re-running all that setup logic is wasteful — you already have a fully-configured object sitting right there. What you actually want is to copy the one you have.

Prototype formalizes "copy an existing object" as the creation mechanism itself, instead of "construct one from scratch." Any object that supports cloning implements a `clone()` method, and creating a new instance means calling `.clone()` on a prototype rather than invoking a constructor.

## How it's built
An object implements a `clone()` method (in Java, this maps directly onto `Cloneable` and `Object.clone()`; other languages just define the method themselves) that returns a copy of itself. The critical design decision is **shallow vs. deep copy**: a shallow copy duplicates the object's own fields but leaves any object-reference fields pointing at the *same* nested objects as the original — mutate a nested object through the copy, and you'll see that mutation reflected in the "original" too, which is rarely what you want. A deep copy recursively clones referenced objects as well, so the copy is fully independent.

## Prototype vs. just calling `new`
If your class has cheap, side-effect-free construction, there's no reason to reach for Prototype — a plain constructor is simpler and just as fast. Prototype earns its place when construction is expensive (network calls, file I/O, heavy computation) or when you want to create variations of an object without knowing its concrete class ahead of time — you just need *a* prototype instance and can clone it regardless of its exact type.

## Where it bites you
Deep-cloning an object graph with circular references, or objects wrapping external resources (open file handles, database connections, live network sockets) is genuinely tricky — those resources usually can't be meaningfully cloned at all, and need special-casing (re-establish the connection instead of copying the handle). Getting shallow vs. deep copy wrong is the single most common bug with this pattern, and it usually shows up as "I mutated my copy and my original changed too."
