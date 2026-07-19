# Factory Method — Interview Questions

**What's the difference between Factory Method and a "simple factory"?**
A simple factory is one method (often static) with a switch/if-else that returns different concrete types based on an input parameter — convenient, but not a GoF pattern, and it becomes a maintenance bottleneck as types grow because everyone edits the same method. Factory Method uses inheritance: an abstract Creator declares the factory method, and each ConcreteCreator subclass overrides it to return its own product. Adding a new type means adding a new subclass, not editing existing code.

**How does Factory Method relate to the Open/Closed Principle?**
It's a textbook example of satisfying it. The code that uses products (the part of the Creator that isn't the factory method itself) is closed for modification — it's written once against the Product interface. The system stays open for extension because adding a new product type just means adding a new ConcreteCreator/ConcreteProduct pair, with zero changes to existing classes.

**When would you choose Abstract Factory over Factory Method?**
Factory Method creates one product. Abstract Factory creates families of related products that need to stay consistent with each other (e.g., a "Windows" factory that produces a Windows button AND a Windows checkbox, so you never accidentally mix a Windows button with a Mac checkbox). If you only ever need one kind of object at a time, Factory Method is simpler and sufficient.

**Can the Creator class provide a default implementation of the factory method?**
Yes — this is common. The base Creator can implement the factory method to return some default product, and only some subclasses override it to return something different. This avoids forcing every subclass to implement the method if most of them are happy with the default.
