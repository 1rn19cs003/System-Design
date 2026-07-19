import java.util.LinkedHashMap;
import java.util.Map;

public class LruCache {
    static final int SOURCE_LATENCY_MS = 10;
    static final int CAPACITY = 3;
    static final int[] KEY_SEQUENCE = {1, 2, 3, 1, 2, 4, 1, 5, 1, 2};

    static class Cache extends LinkedHashMap<Integer, String> {
        int capacity;
        Cache(int capacity) {
            super(16, 0.75f, true);
            this.capacity = capacity;
        }
        @Override
        protected boolean removeEldestEntry(Map.Entry<Integer, String> eldest) {
            boolean evict = size() > capacity;
            if (evict) {
                System.out.println("  evicted key " + eldest.getKey() + " (least recently used)");
            }
            return evict;
        }
    }

    static String slowFetch(int key) throws InterruptedException {
        Thread.sleep(SOURCE_LATENCY_MS);
        return "value-" + key;
    }

    static double runWithCache(int[] hitsMisses) throws InterruptedException {
        Cache cache = new Cache(CAPACITY);
        int hits = 0, misses = 0;
        long start = System.nanoTime();
        for (int key : KEY_SEQUENCE) {
            String value = cache.get(key);
            if (value != null) {
                hits++;
            } else {
                misses++;
                value = slowFetch(key);
                cache.put(key, value);
            }
        }
        hitsMisses[0] = hits;
        hitsMisses[1] = misses;
        return (System.nanoTime() - start) / 1_000_000.0;
    }

    static double runWithoutCache() throws InterruptedException {
        long start = System.nanoTime();
        for (int key : KEY_SEQUENCE) {
            slowFetch(key);
        }
        return (System.nanoTime() - start) / 1_000_000.0;
    }

    public static void main(String[] args) throws Exception {
        System.out.println("With LRU cache:");
        int[] hitsMisses = new int[2];
        double withCacheMs = runWithCache(hitsMisses);
        System.out.printf("  hits=%d misses=%d total_time=%.2f ms%n", hitsMisses[0], hitsMisses[1], withCacheMs);

        double withoutCacheMs = runWithoutCache();
        System.out.printf("Without cache: total_time=%.2f ms%n", withoutCacheMs);

        System.out.printf("Speedup from caching: %.2fx%n", withoutCacheMs / withCacheMs);
    }
}
