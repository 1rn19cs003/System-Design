# Observer Pattern

## Category
Behavioral

## The problem, in plain terms
You're building a stock ticker. When a stock's price changes, three different parts of your app need to react: a mobile widget that redraws itself, an email alert service that fires off a message if the price crosses a threshold, and a logging service that records every tick for later analysis. The naive approach is to hard-code all three reactions directly inside the code that updates the price — but now that code has to know about every consumer, and adding a fourth consumer (say, a Slack notifier) means going back and editing the price-update code again.

Observer flips the dependency around. The thing that changes (the `Subject`, here the stock ticker) doesn't know or care what's watching it — it just keeps a list of `Observer`s and calls a single method on each of them, `update()`, whenever its state changes. Adding a new reaction to a price change means writing a new class that implements `Observer` and registering it — zero changes to the ticker itself.

## How it's built
The `Subject` maintains a list of registered `Observer`s and exposes `attach(observer)` / `detach(observer)` methods to manage that list, plus a `notifyObservers()` method that loops through the list and calls `update()` on each one. Concrete Observers implement `update()` however they see fit — updating a display, sending an alert, writing a log line. The Subject typically calls `notifyObservers()` right after any state change that observers care about.

## Push vs. pull notification
There are two common styles for what `update()` receives. In the **push** style, the Subject passes the changed data directly as arguments (`update(newPrice)`) — simple, but couples the Observer interface to exactly what data the Subject happens to send. In the **pull** style, `update()` receives a reference to the Subject itself, and the Observer calls getters on it to pull whatever data it actually needs (`update(subject)`, then `subject.getPrice()`) — more flexible when different observers need different subsets of state, at the cost of a slightly heavier interface.

## Where it bites you
If Subjects hold strong references to Observers and Observers are never explicitly detached, you get a memory leak — an Observer that should have been garbage collected stays alive because the Subject still references it. This is common enough in UI frameworks that some implementations use weak references specifically to avoid it. Also, if `notifyObservers()` triggers a long chain of updates that themselves cause further state changes, you can end up with subtle infinite update loops if you're not careful about what triggers what.
