# Mediator — Real-World Examples

- **Chat rooms / group messaging** — a chat room object routes messages between participants instead of each user holding direct references to every other user.
- **Air traffic control** — the control tower (mediator) coordinates aircraft (colleagues) so planes don't need to communicate directly with every other plane.
- **GUI dialog/form coordination** — a dialog controller mediates between form fields and buttons (e.g., enabling a "Submit" button only when several fields are valid), rather than each field needing direct references to every other field.
- **Message brokers / event buses** (RabbitMQ, Kafka in a coordination role) — publishers and subscribers interact through a broker rather than directly with each other.
- **Workflow orchestrators** — a central orchestrator coordinates calls between multiple microservices, rather than each service calling every other service directly.
