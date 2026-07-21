# Databases — Real-World Examples

- **PostgreSQL / MySQL** — SQL databases using B-tree indexes by default, with read replicas commonly used to scale read-heavy workloads.
- **MongoDB / Cassandra** — NoSQL databases built from the ground up for horizontal sharding and flexible schemas.
- **Instagram's user-sharding** — sharding user data by user ID across many Postgres instances to handle a scale that a single server can't.
- **DynamoDB** — a managed NoSQL database where partitioning (a form of sharding) is handled automatically based on a chosen partition key.
