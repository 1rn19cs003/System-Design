# Abstract Factory Pattern

## Category
Creational

## The problem, in plain terms
You're building a cross-platform UI toolkit. On Windows, buttons and checkboxes need to look and behave like Windows controls. On macOS, they need to look like Mac controls. The one thing you absolutely cannot allow: a Windows-style button next to a Mac-style checkbox in the same window. The controls have to come from the same "family" — mixing them looks broken and can behave inconsistently.

Factory Method solves "which class do I instantiate" for one product. Abstract Factory solves it for a whole family of related products that need to stay consistent with each other. You get one factory object per family (a `WindowsFactory`, a `MacFactory`), and every product it hands out — button, checkbox, whatever else — matches that family automatically, because it's physically impossible to ask the `WindowsFactory` for a Mac checkbox.

## How it's built
An `AbstractFactory` interface declares a creation method per product type in the family — `createButton()`, `createCheckbox()`. Each `ConcreteFactory` (`WindowsFactory`, `MacFactory`) implements all of those methods, each one returning the family-appropriate concrete product. The client code takes in one factory instance at startup — usually chosen once, based on the current OS or theme — and from then on only calls methods on that factory. It never touches a concrete class name.

## Abstract Factory vs. Factory Method
They're closely related and often confused. Factory Method is about one method overridden by subclasses to produce one product. Abstract Factory is usually implemented *using* multiple Factory Methods bundled into one interface — one method per product in the family. The distinguishing question: "does this app need to guarantee that a whole group of objects it creates are mutually compatible?" If yes, that's Abstract Factory's actual job.

## Where it bites you
Adding a new product to the family (say, a `createSlider()`) means updating the `AbstractFactory` interface *and* every concrete factory that implements it — that ripple effect is the trade-off you accept for the consistency guarantee. If your family only ever has one product, or you don't actually care about cross-product consistency, Abstract Factory adds structure you don't need — plain Factory Method or even direct construction is more honest.
