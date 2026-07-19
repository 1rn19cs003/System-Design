# Adapter — Interview Questions

**What's the difference between an object adapter and a class adapter?**
An object adapter holds a reference to the adaptee and delegates to it (composition) — this works in any OOP language and is the more common form. A class adapter inherits from both the target interface and the adaptee (multiple inheritance) — only viable in languages that support it, like C++; not possible in Java, which lacks multiple class inheritance.

**How is Adapter different from Facade?**
Adapter makes an existing interface match a specific interface your code already expects — one-to-one compatibility. Facade simplifies access to a complex subsystem with many interfaces behind one new, simpler interface — it's not matching a pre-existing expected interface, it's inventing an easier one.

**How is Adapter different from Decorator, given both "wrap" another object?**
Adapter changes the *interface* — the wrapped object couldn't be used directly because its methods don't match what's expected. Decorator keeps the *same* interface as the object it wraps, and adds new behavior/responsibility on top — the wrapped and wrapping object are interchangeable from the caller's perspective, which is never true for Adapter's adaptee.

**Can an Adapter wrap multiple different adaptees behind the same target interface?**
Yes — this is common. You might have `StripeAdapter`, `PaypalAdapter`, and `RazorpayAdapter` all implementing the same `PaymentProcessor` interface, each translating to a different vendor SDK. The calling code depends only on `PaymentProcessor` and never knows which adapter (or vendor) it's actually using.
