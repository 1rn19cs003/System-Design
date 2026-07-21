# Strategy Pattern

## Category
Behavioral

## The problem, in plain terms
You're building a checkout flow. Customers can pay by credit card, PayPal, or store credit, and each option has genuinely different logic — different validation, different external API calls, different fee calculations. The obvious first pass is a `processPayment` method riddled with `if (method == "credit_card") { ... } else if (method == "paypal") { ... }`. Every time the business adds a new payment option, you're back inside that method, and the branches keep growing alongside the risk of breaking an existing one while editing.

Strategy pulls each branch out into its own class that all implement a common interface, and the checkout code holds a reference to whichever one the customer picked, calling the same method (`pay(amount)`) regardless of which concrete strategy is plugged in. The checkout code no longer needs to know how each payment method works — only that it can be asked to `pay()`.

## How it's built
A `Strategy` interface declares the operation that varies (`pay(amount)`). Concrete strategies (`CreditCardPayment`, `PayPalPayment`, `StoreCreditPayment`) each implement it differently. A `Context` (the `ShoppingCart` or checkout flow) holds a reference to a `Strategy` object — set at construction, or swappable later via a setter — and delegates to it instead of implementing the varying behavior itself.

## Strategy vs. simple parameters
A common early instinct is "why not just pass a function or a flag instead of a whole class hierarchy?" In languages with first-class functions, a plain function reference genuinely can serve as a lightweight Strategy — the pattern's essence is really about the Context depending on an abstraction for the varying behavior, not the specific mechanism (interface vs. function) used to supply it. The class-based version earns its keep when each strategy needs to carry its own state or when the operation is more than a single pure function.

## Where it bites you
If there's only ever going to be one or two variants and they're unlikely to grow, a Strategy hierarchy is over-engineering — a simple conditional is more direct and easier for a new reader to follow at a glance. Also, the Context has to somehow pick which concrete Strategy to use in the first place — Strategy itself doesn't solve that selection problem, and teams sometimes end up reintroducing the very `if/else` chain they were trying to avoid, just one level up, at the point where the Strategy gets chosen.
