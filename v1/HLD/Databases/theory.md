# Databases

## Category
High-Level Design

## Why indexes exist
Finding one row in a table by scanning every row is O(n) — fine for a thousand rows, unusable for a hundred million. An index is a separate structure (commonly a B-tree or hash table) that maps a lookup key straight to the row's location, turning that search into O(log n) or O(1).

## Read replicas
A single database server can only take so many concurrent reads before it saturates. A read replica is a copy of the primary that stays in sync and serves read-only queries, so read load can scale out horizontally while all writes still go through one primary.

## SQL vs. NoSQL
SQL databases enforce a fixed schema and strong relational guarantees (foreign keys, joins, transactions) — good when data is structured and consistency matters more than raw write throughput. NoSQL databases relax the schema and often the consistency guarantees in exchange for easier horizontal scaling and more flexible data shapes.

## Sharding
Past a certain size, even one primary with replicas isn't enough — the data itself is split across multiple independent database instances (shards), each holding a subset of rows, usually partitioned by a key like user ID. This scales both storage and write throughput, at the cost of making cross-shard queries much harder.
