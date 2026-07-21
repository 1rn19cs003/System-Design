# Singleton — Real-World Examples

- **Java `Runtime.getRuntime()`** — the JVM exposes exactly one `Runtime` object per running application, accessed via a static method, matching the classic Singleton shape.
- **Logging frameworks (Log4j, SLF4J, Python's `logging` module)** — a single logger instance/registry is shared across the whole application so all log output goes through one configured pipeline.
- **Spring Framework beans** — by default, every Spring bean is singleton-scoped within the application context; Spring manages this for you instead of you writing `getInstance()` by hand.
- **Database connection pools (HikariCP, pgBouncer client)** — one pool instance manages a fixed set of reusable connections; creating a second pool would defeat the purpose of pooling.
- **Browser `window` object in JavaScript** — there's exactly one global `window` per page/tab, and everything (localStorage, document, etc.) hangs off it.
- **Node.js `require()` caching** — when you `require('./config')` from multiple files, Node returns the same cached module object every time, effectively making every Node module a singleton by default.
- **Redux store / global app state managers** — a single store instance holds the entire application's state tree, and every component reads from that one instance.
