# Strategy — Real-World Examples

- **Payment processing** — different payment methods (credit card, PayPal, store credit) each implementing a common `pay()` interface.
- **Sorting with a custom comparator** — `Collections.sort(list, comparator)` in Java or `sorted(list, key=...)` in Python — the comparison logic is a swappable strategy.
- **Compression algorithms** — a file archiver choosing between ZIP, GZIP, or LZMA strategies for the same "compress this file" operation.
- **Route calculation in navigation apps** — fastest route, shortest distance, and avoid-tolls are each a different routing strategy behind the same "calculate route" call.
- **Validation rules** — a form or API validating input using a pluggable strategy per field type or per business rule set.
