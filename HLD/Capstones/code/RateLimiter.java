public class RateLimiter {
    static final double CAPACITY = 5.0;
    static final double REFILL_RATE_PER_SEC = 2.0;

    static class TokenBucket {
        double capacity;
        double refillRate;
        double tokens;
        long lastRefillNanos;

        TokenBucket(double capacity, double refillRate) {
            this.capacity = capacity;
            this.refillRate = refillRate;
            this.tokens = capacity;
            this.lastRefillNanos = System.nanoTime();
        }

        void refill() {
            long now = System.nanoTime();
            double elapsedSeconds = (now - lastRefillNanos) / 1_000_000_000.0;
            double added = elapsedSeconds * refillRate;
            if (added > 0) {
                tokens = Math.min(capacity, tokens + added);
                lastRefillNanos = now;
            }
        }

        boolean allowRequest() {
            refill();
            if (tokens >= 1.0) {
                tokens -= 1.0;
                return true;
            }
            return false;
        }
    }

    public static void main(String[] args) throws InterruptedException {
        TokenBucket bucket = new TokenBucket(CAPACITY, REFILL_RATE_PER_SEC);
        long start = System.nanoTime();

        System.out.println("Burst of 8 requests with no delay (capacity 5):");
        for (int i = 0; i < 8; i++) {
            boolean allowed = bucket.allowRequest();
            double elapsedMs = (System.nanoTime() - start) / 1_000_000.0;
            System.out.printf("  request %d at %.0f ms: %s%n", i + 1, elapsedMs, allowed ? "allowed" : "REJECTED (rate limited)");
        }

        System.out.println("Waiting 1.5s for tokens to refill...");
        Thread.sleep(1500);

        System.out.println("3 more requests after waiting:");
        for (int i = 0; i < 3; i++) {
            boolean allowed = bucket.allowRequest();
            double elapsedMs = (System.nanoTime() - start) / 1_000_000.0;
            System.out.printf("  request %d at %.0f ms: %s%n", i + 1, elapsedMs, allowed ? "allowed" : "REJECTED (rate limited)");
        }
    }
}
