# Chain of Responsibility Pattern

## Category
Behavioral

## The problem, in plain terms
You're building an expense approval system. A $200 expense can be approved by a team lead. A $3,000 expense needs a manager. A $15,000 expense needs a director. Anything above that needs the CEO. The naive approach is one method with nested `if/else` checking the amount and hard-coding who approves what — every time the approval hierarchy changes (a new "VP" level gets inserted, say), that method has to be edited, and it grows a new branch for every threshold.

Chain of Responsibility turns each approver into a link in a chain. Each handler decides for itself: "can I approve this, or does it need to go further up the chain?" If it can handle the request, it does and stops the chain. If not, it passes the request to the next handler. The code that submits the expense doesn't know or care how many approvers exist or what their thresholds are — it just hands the request to the first handler in the chain and lets the chain sort out where it ends up.

## How it's built
A `Handler` interface (or abstract class) declares a `handle(request)` method and holds a reference to the `next` handler in the chain. Concrete handlers (`TeamLead`, `Manager`, `Director`) each implement `handle()` to check whether they can process the request; if they can, they do and return; if they can't, they call `next.handle(request)` to pass it along. Client code builds the chain once (wiring each handler's `next` reference) and only ever talks to the first handler.

## Where it bites you
If no handler in the chain can process a request, and nobody put a check for that at the end, the request can silently fall through without anyone acting on it — a chain needs an explicit terminal case ("no handler could process this") rather than assuming someone always will. Debugging can also get harder than a single method with visible branches, because tracing which handler ultimately processed a given request means stepping through however many handlers sit before it in the chain.
