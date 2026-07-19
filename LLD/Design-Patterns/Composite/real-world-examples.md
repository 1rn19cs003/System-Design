# Composite — Real-World Examples

- **File systems** (the canonical example) — files and folders both support operations like size, but folders recursively aggregate over their contents.
- **DOM (HTML/XML document trees)** — every node (element or text node) implements a common interface; a `<div>` containing other elements and text nodes is a composite over the same `Node` type as its children.
- **UI component trees** (React component trees, Android View/ViewGroup) — a `ViewGroup` (container) holds child `View`s, and operations like `measure()`/`draw()` apply uniformly whether a child is a single widget or another `ViewGroup` full of widgets.
- **Org charts** — an `Employee` and a `Manager` (who has direct reports) can share an interface for something like "total headcount under this person" or "total salary cost of this org."
- **Menu systems** — a `MenuItem` and a `Menu` (which contains `MenuItem`s and possibly submenus) share a `render()` operation so the whole menu tree draws itself recursively.
