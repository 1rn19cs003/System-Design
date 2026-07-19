# Abstract Factory — Interview Questions

**What's the core difference between Abstract Factory and Factory Method?**
Factory Method produces one product via one overridden creation method. Abstract Factory produces a whole family of related products via multiple creation methods bundled into one factory interface, guaranteeing the products it hands out are mutually compatible.

**How would you add a new product type (e.g., a Slider) to an existing Abstract Factory setup?**
You'd add `createSlider()` to the `AbstractFactory` interface, then implement it in every existing `ConcreteFactory` (WindowsFactory, MacFactory, etc.). This is the known trade-off — the interface change ripples to every concrete factory, which is the cost of the consistency guarantee this pattern gives you.

**How would you add an entirely new family (e.g., a LinuxFactory) instead?**
That's the case the pattern is optimized for: implement the existing `AbstractFactory` interface once in a new `LinuxFactory` class. No existing factories or client code need to change — only a new class is added.

**Can Abstract Factory be implemented without inheritance, e.g., in a language favoring composition?**
Yes — a factory can just be an object holding function references (or a simple struct of factory functions) rather than a class implementing an interface. The core idea — one bundle of related creation logic, swappable as a whole — doesn't require classical inheritance to work.
