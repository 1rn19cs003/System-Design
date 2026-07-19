# Command — Real-World Examples

- **GUI undo/redo stacks** — text editors and image editors represent every edit as a command object so it can be undone or redone.
- **Job/task queues** (e.g., Sidekiq, Celery, Hangfire) — a unit of work is serialized as a command/message, queued, and executed later, possibly by a different process.
- **Remote controls and home automation** — each button or voice command maps to a Command object executed against the relevant device (light, thermostat, lock).
- **Transactional database operations** — a sequence of operations packaged as commands that can be executed together and rolled back as a unit on failure.
- **Menu items and toolbar buttons in IDEs** — each maps to a Command object rather than the UI code calling application logic directly.
