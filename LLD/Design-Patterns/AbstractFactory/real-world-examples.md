# Abstract Factory — Real-World Examples

- **Cross-platform GUI toolkits** (Java Swing's pluggable look-and-feel, Qt) — one factory produces an entire family of native-looking widgets (buttons, checkboxes, scrollbars) consistent with the current OS or theme.
- **JDBC / database driver abstraction** — switching database vendors (MySQL vs. PostgreSQL) swaps a whole family of related objects (Connection, Statement, ResultSet implementations) behind one consistent interface.
- **Theming engines in design systems** — a "dark theme" factory and a "light theme" factory each produce a consistent family of styled components; the app just asks the current theme factory for whatever component it needs.
- **Document format exporters** — an "Office Open XML" factory vs. an "OpenDocument" factory, each producing a consistent family of document/paragraph/table objects that serialize correctly together.
