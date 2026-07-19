# Chain of Responsibility — Real-World Examples

- **Expense/purchase approval workflows** — a request escalates through team lead, manager, director, and CEO until someone's authority level covers it.
- **Web server middleware pipelines** (Express.js, ASP.NET Core, Django middleware) — each middleware decides whether to handle the request, modify it, or pass it to the next one in the pipeline.
- **Logging frameworks** — a log record passes through handlers for different severity levels/destinations (console, file, remote service), each deciding whether it applies.
- **Event bubbling in GUI frameworks** — a click event travels up through nested UI components, each of which can handle it or let it continue bubbling to its parent.
- **Exception handling chains** — a try/catch hierarchy where each catch block decides whether it can handle a given exception type or re-throws it further up.
