const SOURCE_LATENCY_MS = 10;
const CAPACITY = 3;
const KEY_SEQUENCE = [1, 2, 3, 1, 2, 4, 1, 5, 1, 2];

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.store = new Map();
  }
  get(key) {
    if (!this.store.has(key)) return null;
    const value = this.store.get(key);
    this.store.delete(key);
    this.store.set(key, value);
    return value;
  }
  put(key, value) {
    if (this.store.has(key)) this.store.delete(key);
    this.store.set(key, value);
    if (this.store.size > this.capacity) {
      const evicted = this.store.keys().next().value;
      this.store.delete(evicted);
      console.log(`  evicted key ${evicted} (least recently used)`);
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function slowFetch(key) {
  await sleep(SOURCE_LATENCY_MS);
  return `value-${key}`;
}

async function runWithCache(sequence) {
  const cache = new LRUCache(CAPACITY);
  let hits = 0, misses = 0;
  const start = process.hrtime.bigint();
  for (const key of sequence) {
    let value = cache.get(key);
    if (value !== null) {
      hits += 1;
    } else {
      misses += 1;
      value = await slowFetch(key);
      cache.put(key, value);
    }
  }
  const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
  return { elapsedMs, hits, misses };
}

async function runWithoutCache(sequence) {
  const start = process.hrtime.bigint();
  for (const key of sequence) {
    await slowFetch(key);
  }
  return Number(process.hrtime.bigint() - start) / 1e6;
}

(async () => {
  console.log("With LRU cache:");
  const { elapsedMs, hits, misses } = await runWithCache(KEY_SEQUENCE);
  console.log(`  hits=${hits} misses=${misses} total_time=${elapsedMs.toFixed(2)} ms`);

  const withoutCacheMs = await runWithoutCache(KEY_SEQUENCE);
  console.log(`Without cache: total_time=${withoutCacheMs.toFixed(2)} ms`);

  console.log(`Speedup from caching: ${(withoutCacheMs / elapsedMs).toFixed(2)}x`);
})();
