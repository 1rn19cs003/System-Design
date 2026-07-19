# Factory Method Pattern

## Category
Creational

## The problem, in plain terms
You're building a notification system. Today it sends email. Tomorrow product wants SMS too, and next quarter, push notifications. If every place in your code that sends a notification does `new EmailNotification()` directly, adding SMS means hunting down every one of those call sites and adding an `if/else`. Worse, the code that sends notifications now has to know about every notification type that exists, even though all it actually wants to do is "send a notification" — it doesn't care which kind.

Factory Method separates "deciding which class to instantiate" from "using the object once you have it." The calling code asks a factory for a notification and gets back something that satisfies the `Notification` interface — it never types `new EmailNotification()` itself.

## How it's built
There's a `Creator` (often abstract) with a method — the "factory method" — that returns a `Product`. Each `ConcreteCreator` overrides that method to return a specific `ConcreteProduct`. The rest of the Creator's logic (the part that actually uses the product) is written once, against the `Product` interface, and never needs to change when a new product type is added.

Concretely: `NotificationFactory` declares `createNotification()`. `EmailNotificationFactory` overrides it to return an `EmailNotification`. `SMSNotificationFactory` overrides it to return an `SMSNotification`. Any code holding a `NotificationFactory` reference can call `.send()` without knowing or caring which concrete factory it's holding.

## Factory Method vs. a simple "if/else" factory
A static method with a big `switch` on a type string is sometimes called a "simple factory" — it's not a GoF pattern, just a useful shortcut, and it's often good enough for a handful of stable types. Factory Method earns its keep when new product types get added often, or when you want each product's creation logic to live in its own class instead of one giant switch statement that everyone has to touch.

## Where it bites you
Every new product type means a new Creator subclass — that's more classes to navigate, and for a small, stable set of types it can be more ceremony than value. It also doesn't help if the *caller* needs to choose which concrete factory to use in the first place; something, somewhere, still has to decide "use the email factory" — Factory Method just keeps that decision from leaking into the code that uses the product.
