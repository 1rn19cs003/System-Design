# Databases — Interview Questions

## Why does an index speed up lookups?
Without one, finding a row means checking every row in the table — O(n). An index is a separate structure (B-tree or hash table) that maps the lookup key directly to the row's location, cutting that down to O(log n) or O(1), at the cost of extra storage and slower writes to the indexed column.

## What's the difference between a read replica and a shard?
A read replica is a full copy of the same data, used to spread read load across more machines — every replica has everything. A shard holds only a subset of the data, partitioned by some key, used to spread both storage and write load — no single shard has everything.

## What breaks when you shard a database?
Any query that needs data from more than one shard — a cross-shard join or a multi-shard transaction — becomes far more expensive and complex, because the database engine can no longer do it in one place with one set of guarantees.

## When would you choose NoSQL over SQL?
When the data doesn't fit a fixed relational schema well, when horizontal scalability matters more than strong consistency guarantees, or when the access pattern is simple key-based lookups rather than complex joins across tables.
