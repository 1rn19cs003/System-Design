# Observer — Real-World Examples

- **GUI event listeners** — a button doesn't know what code runs when it's clicked; it just notifies every registered click listener.
- **MVC architecture** — the Model notifies registered Views whenever its data changes, so the View can re-render without the Model knowing anything about rendering.
- **Pub/sub messaging systems** (Kafka topics, Redis pub/sub) — publishers emit events without knowing which or how many subscribers exist.
- **RxJS / reactive streams** — Observables notify subscribed Observers whenever a new value is emitted.
- **Spreadsheet formula recalculation** — changing one cell notifies every dependent cell/formula that references it, triggering a recalculation.
- **Node.js `EventEmitter`** — a direct, widely used implementation of the Observer pattern in the standard library.
