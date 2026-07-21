# Chain of Responsibility — Interview Questions

**What is the core idea of Chain of Responsibility?**
A request travels along a chain of handlers, each of which decides independently whether it can process the request or should pass it to the next handler. The sender only ever talks to the first handler and doesn't need to know which one ultimately processes the request.

**What happens if no handler in the chain can process a request?**
Nothing, unless the chain is explicitly designed with a terminal case — a well-built chain includes a final fallback (throwing an error, logging "unhandled", or a default handler) rather than silently letting the request fall off the end with no one having acted on it.

**How is Chain of Responsibility different from a simple if/else chain?**
An if/else chain is one block of code that has to be edited whenever handling logic changes, and it's aware of every branch at once. Chain of Responsibility distributes each condition into its own object, so handlers can be added, removed, or reordered by rewiring `next` references, without editing a shared block of logic or the code that submits requests.

**How does middleware in web frameworks relate to this pattern?**
Each middleware function is a handler: it can act on the request/response, and then explicitly calls `next()` to pass control to the following middleware, or short-circuits the chain by responding directly. That's Chain of Responsibility applied directly to HTTP request processing.
