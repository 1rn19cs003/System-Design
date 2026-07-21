# Facade — Interview Questions

**What's the core difference between Facade and Adapter?**
Facade simplifies access to something that's complicated — usually multiple subsystem classes coordinated toward one goal. Adapter fixes something that's incompatible — a specific interface mismatch between what you have and what your code expects. Facade typically wraps many classes into one simpler entry point; Adapter typically wraps one adaptee into a specific expected shape.

**Does using a Facade mean callers lose access to the underlying subsystems?**
No, and that's an important distinction. A Facade is a convenience layer for the common case — code that needs finer-grained control can still reach past the facade and use the subsystem classes directly. A well-designed Facade doesn't lock anything down; it just gives most callers a much smaller surface to depend on.

**How would you decide what belongs in the Facade versus what stays in the subsystems?**
The Facade should hold only orchestration logic — the sequence and coordination of subsystem calls for common use cases. Business logic specific to one subsystem (how payment retries work, how inventory reservations expire) belongs in that subsystem, not the facade. If the facade starts accumulating subsystem-specific logic, that's a sign it's becoming a god object instead of a thin coordination layer.

**Can a Facade evolve into an Adapter, or vice versa, as a codebase changes?**
Not really — they solve different problems, so a Facade wouldn't typically "become" an Adapter. But it's common for a Facade to internally use an Adapter, e.g., if one of the subsystems it coordinates has an incompatible interface that needs translating first, before the Facade's orchestration logic calls it.
