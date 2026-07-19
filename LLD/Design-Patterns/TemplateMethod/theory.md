# Template Method Pattern

## Category
Behavioral

## The problem, in plain terms
You're writing code to prepare both tea and coffee. Both follow almost the same sequence: boil water, brew (steep tea leaves or run water through coffee grounds), pour into a cup, add a condiment (lemon or sugar/milk). Only the brewing step and the condiment differ between the two — everything else is identical. Writing two completely separate methods duplicates the boil-water and pour-into-cup steps, and if you ever change the pouring logic, you have to remember to update it in both places.

Template Method puts the overall sequence — the algorithm's skeleton — in a base class method that's marked final (not overridable), and calls out to abstract methods for the steps that vary. Subclasses (`Tea`, `Coffee`) only implement the varying steps; the sequence itself, and the steps that don't vary, live once in the base class and can't be silently reordered or skipped by a subclass.

## How it's built
A base class defines a `prepareRecipe()` method that calls a fixed sequence of steps: `boilWater()`, `brew()`, `pourInCup()`, `addCondiments()`. Steps that are identical across all subclasses (`boilWater`, `pourInCup`) are implemented directly in the base class. Steps that vary (`brew`, `addCondiments`) are declared abstract, and each subclass provides its own implementation. Optionally, "hook" methods with a default (often no-op) implementation let subclasses opt into extra behavior — like a `wantsCondiments()` hook that a subclass can override to skip the condiment step entirely, without needing to touch `prepareRecipe()` itself.

## Where it bites you
Because the base class calls into subclass-implemented methods (a technique sometimes called "the Hollywood principle" — don't call us, we'll call you), the control flow can be harder to trace by reading a single class in isolation; you have to look at both the base class's template method and whichever subclass is instantiated to see the full picture. Overusing hooks can also make the base algorithm's actual behavior hard to predict just by reading it, since so much depends on which hooks a given subclass overrides.
