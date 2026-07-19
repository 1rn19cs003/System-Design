# Factory Method — Real-World Examples

- **Java's `Calendar.getInstance()`** — returns a `Calendar` object, but the actual concrete class depends on the default locale/timezone at runtime; the caller never picks the class directly.
- **`java.util.ResourceBundle.getBundle()`** — returns a locale-specific resource bundle subclass without the caller needing to know which locale-specific class was chosen.
- **Document editors (Word, Google Docs)** — a "create document" action might return a `WordDocument`, `SpreadsheetDocument`, or `PresentationDocument`, all satisfying a common `Document` interface, chosen by a factory based on the file type.
- **Logging frameworks** — `LoggerFactory.getLogger(...)` in SLF4J returns different concrete logger implementations (Logback, Log4j2, java.util.logging) depending on what's on the classpath, without calling code ever choosing the concrete class.
- **UI toolkits** — a cross-platform UI framework's `createButton()` returns a `WindowsButton`, `MacButton`, or `LinuxButton` depending on the OS, while the rest of the app just calls `.render()` on whatever it got back.
