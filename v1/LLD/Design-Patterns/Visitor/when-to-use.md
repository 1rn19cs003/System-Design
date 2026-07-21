# When to Use Visitor

## Reach for it when
- You have a stable, rarely-changing set of element types, but you frequently need to add new operations that act differently across those types.
- You want to keep operation-specific logic (pricing, rendering, exporting) out of the element classes themselves, which should stay focused on representing their own data.
- Different unrelated operations need to traverse the same object structure, and you don't want to keep adding methods to every element class for each one.

## Don't reach for it when
- New element types are added frequently — every new type requires updating every existing Visitor with a new `visit()` overload, which can be more churn than the alternative.
- The operations are simple and few — a plain method on each element class is more direct and requires less machinery.

## What interviewers are actually listening for
Explaining "double dispatch" clearly — that `accept()` calling back into an overloaded `visit()` is what lets the correct operation run for a given combination of element type and visitor type, using two method calls instead of one. Also, being able to state the core trade-off precisely: Visitor makes adding new operations easy and adding new element types hard, which is the exact opposite of a plain method-per-type design, so choosing it requires being confident which axis (types or operations) is more likely to grow in your system.
