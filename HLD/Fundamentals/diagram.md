# Fundamentals — Diagrams

Three rendered SVG diagrams used on the website page:
- `assets/hld-fundamentals/dns-resolution.svg` — Client → DNS Resolver (name → IP) → Server, showing the lookup happens before the connection opens
- `assets/hld-fundamentals/request-response.svg` — sequence diagram (two lifelines) of TCP handshake → optional TLS handshake → HTTP request → HTTP response
- `assets/hld-fundamentals/latency-vs-throughput.svg` — side-by-side comparison of a low-latency, one-worker setup vs. a high-throughput, parallel-worker setup

These are system/architecture diagrams (boxes = components, arrows = network calls), not UML class diagrams — HLD topics describe how components across a network interact, not how a single class is shaped internally.

See them in context at: `pages/hld/fundamentals.html`
