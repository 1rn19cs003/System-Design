# Facade Pattern

## Category
Structural

## The problem, in plain terms
Placing an online order actually touches half a dozen subsystems: check inventory, charge the payment gateway, reserve the item, generate an invoice, schedule the shipment, send a confirmation email. Each of those is its own subsystem with its own classes and its own quirks. If the checkout button's click handler has to call all six directly, in the right order, handling each one's specific error cases, that handler becomes a tangle of subsystem knowledge that has nothing to do with "the user clicked checkout."

A Facade wraps all of that behind one simple method: `orderFacade.placeOrder(cart)`. Internally it calls the inventory system, the payment gateway, the shipping system, etc., in the right order — but the checkout code only ever sees one call. The subsystems still exist and still work exactly as before; the Facade just gives external code a much smaller surface to depend on.

## How it's built
The `Facade` class holds references to (or creates) the subsystem objects it needs, and exposes a small number of high-level methods that internally orchestrate calls across those subsystems. Critically, the Facade doesn't hide the subsystems — code that needs finer control can still reach past the facade and use the subsystems directly. The facade is a convenience layer for the common case, not a lockdown.

## Facade vs. Adapter (again)
Facade simplifies access to something that's just *complicated* — many classes, many steps, all pointed at one broader goal. Adapter fixes something that's *incompatible* — a specific interface mismatch between what you have and what you need. A Facade typically wraps *multiple* subsystem classes into one simpler entry point; an Adapter typically wraps *one* adaptee into a specific interface shape.

## Where it bites you
A Facade that tries to expose every possible option from every subsystem stops being a facade and just becomes another layer to maintain — the value is specifically in offering the common-case simplification, not full pass-through coverage. It's also easy to let a Facade quietly become a god object if every new feature gets bolted onto it instead of being modeled properly in the underlying subsystems.
