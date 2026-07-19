# Builder — Real-World Examples

- **Java's `StringBuilder`** — technically named after this pattern; chains `.append()` calls and produces the final string via `.toString()`, similar spirit even if the "product" is simpler than a typical Builder use case.
- **`OkHttpClient.Builder` / `Request.Builder`** (OkHttp, a popular Java/Android HTTP library) — HTTP requests have many optional pieces (headers, body, timeouts), assembled fluently before `.build()`.
- **Lombok's `@Builder` annotation** (Java) — generates an entire fluent builder class for you from a plain data class, because the pattern is so common that codegen for it is worth having.
- **`Document.Builder`-style APIs in protobuf** (Google Protocol Buffers) — every generated message class comes with a builder for constructing immutable message objects field by field.
- **UI component builders** (Android's `AlertDialog.Builder`, SwiftUI-adjacent patterns) — dialogs/views with many optional pieces (title, message, buttons, icon) assembled fluently before `.show()`/`.build()`.
