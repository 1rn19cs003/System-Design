import time
from collections import OrderedDict

SOURCE_LATENCY_SECONDS = 0.01
CAPACITY = 3
KEY_SEQUENCE = [1, 2, 3, 1, 2, 4, 1, 5, 1, 2]

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.store = OrderedDict()

    def get(self, key):
        if key not in self.store:
            return None
        self.store.move_to_end(key)
        return self.store[key]

    def put(self, key, value):
        if key in self.store:
            self.store.move_to_end(key)
        self.store[key] = value
        if len(self.store) > self.capacity:
            evicted, _ = self.store.popitem(last=False)
            print(f"  evicted key {evicted} (least recently used)")

def slow_fetch(key):
    time.sleep(SOURCE_LATENCY_SECONDS)
    return f"value-{key}"

def run_with_cache(sequence):
    cache = LRUCache(CAPACITY)
    hits, misses = 0, 0
    start = time.perf_counter()
    for key in sequence:
        value = cache.get(key)
        if value is not None:
            hits += 1
        else:
            misses += 1
            value = slow_fetch(key)
            cache.put(key, value)
    elapsed = time.perf_counter() - start
    return elapsed, hits, misses

def run_without_cache(sequence):
    start = time.perf_counter()
    for key in sequence:
        slow_fetch(key)
    return time.perf_counter() - start

if __name__ == "__main__":
    print("With LRU cache:")
    with_cache_time, hits, misses = run_with_cache(KEY_SEQUENCE)
    print(f"  hits={hits} misses={misses} total_time={with_cache_time * 1000:.2f} ms")

    without_cache_time = run_without_cache(KEY_SEQUENCE)
    print(f"Without cache: total_time={without_cache_time * 1000:.2f} ms")

    speedup = without_cache_time / with_cache_time
    print(f"Speedup from caching: {speedup:.2f}x")
