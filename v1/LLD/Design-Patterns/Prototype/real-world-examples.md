# Prototype — Real-World Examples

- **Java's `Object.clone()` / `Cloneable` interface** — the pattern is baked directly into the language; any class implementing `Cloneable` supports prototype-style copying.
- **JavaScript's prototypal inheritance itself** — `Object.create(proto)` creates a new object using an existing object as its prototype, conceptually related (though JS's "prototype chain" is a broader mechanism than the GoF pattern).
- **Game engines** — spawning many similar enemies/particles/props by cloning a pre-configured template object instead of re-running full initialization for each one.
- **Document/spreadsheet templates** — "Save As Template" or "Duplicate" features in tools like Google Docs/Sheets clone an existing, fully-formatted document rather than rebuilding formatting from scratch.
- **`git clone`** (a different domain, same core idea) — copying an existing, fully-initialized repository rather than reconstructing history and objects from nothing.
