# Decorator — Real-World Examples

- **Java I/O streams** (the textbook example) — `new BufferedReader(new InputStreamReader(new FileInputStream("file.txt")))` layers buffering and character-decoding behavior onto a raw byte stream, each layer implementing the same stream interface.
- **Python decorators** (`@staticmethod`, `@property`, custom `@decorator` functions) — conceptually related: wrapping a function to add behavior (logging, caching, access control) while preserving its callable interface.
- **UI component libraries** — wrapping a base component with a `ScrollableDecorator`, `BorderDecorator`, or `TooltipDecorator` that each add visual/behavioral extras while remaining a valid component.
- **HTTP middleware chains** (Express.js middleware, servlet filters) — each middleware wraps the next handler, optionally adding behavior (logging, auth, compression) before/after calling through, all while presenting the same "handle a request" interface.
- **Coffee shop / pizza ordering systems** — the canonical teaching example: toppings/add-ons stack on a base item, each contributing to price and description without subclassing every combination.
