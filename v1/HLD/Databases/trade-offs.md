# Databases — Trade-offs

## Indexes speed up reads, slow down writes
Every index has to be updated on every insert/update/delete to the indexed column, so more indexes mean slower writes and more storage. Index the columns that are actually queried often, not every column that might someday be useful.

## SQL vs. NoSQL
SQL gives strong consistency and relational integrity but is harder to scale horizontally past a point. NoSQL scales out more easily and handles unstructured or rapidly changing data shapes well, but pushes more consistency and integrity responsibility onto the application.

## Sharding vs. a bigger single server
Vertical scaling (a bigger server) is simple — no application changes — but has a hard ceiling and gets expensive fast. Sharding scales further, but every shard-key decision is close to permanent, and any query that needs data from multiple shards gets significantly harder to write and slower to run.

**What interviewers are listening for:** knowing that adding an index isn't free — it has a write-side cost — and being able to explain what breaks when a database gets sharded (specifically: cross-shard joins/transactions) rather than treating sharding as a free scaling lever.
