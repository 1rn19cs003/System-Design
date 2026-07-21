# Adapter — Real-World Examples

- **Java's `Arrays.asList()`** — adapts a plain array to the `List` interface so array-based data can be used anywhere a `List` is expected.
- **`InputStreamReader` / `OutputStreamWriter`** (Java I/O) — adapts byte-oriented streams to the character-oriented `Reader`/`Writer` interfaces.
- **Power adapters** (the everyday physical object) — the canonical non-software example: converts a plug shape/voltage to whatever the wall socket actually provides, without changing the device or the wall.
- **Third-party payment/SMS/analytics SDK wrappers** — nearly every production codebase has at least one adapter class wrapping a vendor SDK behind an internal interface, specifically so the vendor can be swapped later without touching business logic.
- **Cross-browser JavaScript polyfills / shims** — adapting inconsistent browser APIs to a single, consistent interface the rest of the app can rely on.
