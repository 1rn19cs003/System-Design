# Facade — Real-World Examples

- **`javax.faces.context.FacesContext`** and similar framework "context" objects — one object that gives convenient access to many underlying subsystems (request, response, session state) without the caller needing to know how they're wired together.
- **jQuery** (historically) — a facade over inconsistent, verbose native DOM APIs across browsers, giving one simple `$(...)` interface for selection, events, and animation.
- **Checkout/order-placement services** in e-commerce backends — one `placeOrder()` call orchestrating inventory, payment, shipping, and notifications behind the scenes.
- **Compiler front-ends** — a single `compile(sourceFile)` entry point that internally coordinates lexing, parsing, semantic analysis, optimization, and code generation subsystems.
- **Operating system system calls** — a simple call like `open()` or `read()` hides enormous underlying complexity (device drivers, file system implementations, permission checks) behind one small interface.
