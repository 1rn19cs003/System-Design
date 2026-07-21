# Bridge — Real-World Examples

- **JDBC (Java Database Connectivity)** — your application code (the abstraction) talks to the generic JDBC API, while different database vendors provide different driver implementations (the implementor side) — swapping databases doesn't mean rewriting application code.
- **Java AWT/Swing's peer architecture** — UI components (abstraction) are bridged to platform-specific "peer" implementations (implementor) that do the actual native rendering per OS.
- **Device / Remote Control examples in textbooks** — a `RemoteControl` (abstraction) works with any `Device` (implementor) — TV, radio — without a new remote class per device type.
- **Logging frameworks with pluggable backends** (SLF4J as an API bridging to Logback/Log4j2/java.util.logging) — the logging API (abstraction) is decoupled from which logging engine actually writes the output (implementor).
- **Graphics/rendering engines** — a shape or scene graph API bridged to different rendering backends (software rendering, GPU-accelerated rendering) without duplicating shape logic per backend.
