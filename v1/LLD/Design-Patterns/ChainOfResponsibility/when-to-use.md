# When to Use Chain of Responsibility

## Reach for it when
- More than one object might handle a request, and the right handler depends on runtime conditions (an amount, a permission level, a request type).
- You want to add, remove, or reorder handlers without touching the code that submits requests.
- You don't want the sender of a request to know exactly which object will ultimately process it.

## Don't reach for it when
- There's a single, fixed handler for every request — a direct call is simpler.
- Every request must always be checked against every handler regardless of whether an earlier one "handled" it (that's closer to an event bus / pub-sub broadcast than a chain that stops once handled).

## What interviewers are actually listening for
Naming concrete examples like middleware pipelines (Express.js, ASP.NET) and logging frameworks (each handler decides whether it logs and whether it passes the record further up in severity), showing this isn't just a textbook toy. Also, flagging the "silent fall-through" risk explicitly — a well-designed chain has a defined terminal behavior for unhandled requests rather than assuming one link always catches everything.
