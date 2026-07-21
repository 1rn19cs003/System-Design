# Memento — Real-World Examples

- **Text/image editor undo history** — each edit creates a snapshot of document state that can be restored on undo.
- **Database transaction savepoints** — a savepoint captures the state to roll back to, without the calling code needing to understand the database's internal storage format.
- **Game save states** — a game's internal state is serialized into a save file (a memento) that can later restore the game to that exact point.
- **Form wizards with a "back" button** — each step's data is captured as a memento so navigating back restores the exact previous state without re-deriving it.
- **Version control snapshots** — a commit captures a full snapshot of the project state at that point, which can be restored later without needing to replay every change from the beginning.
