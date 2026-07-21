# Adapter Pattern

## Category
Structural

## The problem, in plain terms
Your app's payment module expects every payment provider to implement a `PaymentProcessor` interface with a `pay(amount)` method. You now need to integrate a third-party payment SDK — but it wasn't written for you. It exposes `makeTransaction(cents, currencyCode)`, a completely different method name and signature. You can't change the third-party SDK's source, and you don't want to scatter `if (usingThirdPartySDK)` branches through your payment module just to accommodate one incompatible library.

An Adapter sits between the two: it implements the interface your code expects (`PaymentProcessor`), and internally translates each call into whatever the incompatible library actually needs (`makeTransaction`). Your payment module never knows it's talking to a translator — it just calls `.pay(amount)` like it always does.

## How it's built
Two common shapes: **object adapter** (the adapter holds a reference to the wrapped object — "the adaptee" — and delegates to it, translating arguments/return values as needed) and **class adapter** (the adapter inherits from both the target interface and the adaptee — only possible in languages with multiple inheritance, so it's rare in Java, common enough in C++). Object adapter is the more portable, more commonly used form, and it's what you'll reach for in Java, Python, or JavaScript.

## Adapter vs. Facade
Both wrap something else, which is why they're often confused. Adapter's job is *compatibility* — it makes an existing interface look like a different, specific interface your code already expects, one-to-one. Facade's job is *simplification* — it hides a complex subsystem with many interfaces behind one simple, new interface, without necessarily mimicking any interface that already exists. If you're translating "this shape doesn't fit" you're doing Adapter; if you're hiding "this is too complicated" you're doing Facade.

## Where it bites you
Every third-party dependency you adapt is another translation layer to maintain — if the adaptee's API changes, the adapter has to change with it. And an adapter can only paper over a mismatch in interface *shape*; it can't fix a fundamental mismatch in *behavior* (e.g., if the adaptee is synchronous and your interface assumes async, the adapter alone won't make that gap disappear cleanly).
