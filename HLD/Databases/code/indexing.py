import random
import time

NUM_RECORDS = 200_000
NUM_LOOKUPS = 500

def build_table(n):
    return [{"id": i, "name": f"user-{i}"} for i in range(n)]

def build_index(table):
    return {row["id"]: row for row in table}

def linear_scan_lookup(table, target_id):
    for row in table:
        if row["id"] == target_id:
            return row
    return None

def indexed_lookup(index, target_id):
    return index.get(target_id)

if __name__ == "__main__":
    table = build_table(NUM_RECORDS)
    index = build_index(table)
    lookup_ids = [random.randint(0, NUM_RECORDS - 1) for _ in range(NUM_LOOKUPS)]

    start = time.perf_counter()
    for target in lookup_ids:
        linear_scan_lookup(table, target)
    linear_time_ms = (time.perf_counter() - start) * 1000

    start = time.perf_counter()
    for target in lookup_ids:
        indexed_lookup(index, target)
    indexed_time_ms = (time.perf_counter() - start) * 1000

    print(f"{NUM_RECORDS} records, {NUM_LOOKUPS} lookups")
    print(f"Linear scan (no index): {linear_time_ms:.2f} ms")
    print(f"Indexed lookup (hash index): {indexed_time_ms:.2f} ms")
    print(f"Speedup from indexing: {linear_time_ms / indexed_time_ms:.1f}x")
