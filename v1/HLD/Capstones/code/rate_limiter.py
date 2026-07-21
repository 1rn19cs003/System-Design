import time

CAPACITY = 5
REFILL_RATE_PER_SEC = 2

class TokenBucket:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = capacity
        self.last_refill = time.perf_counter()

    def _refill(self):
        now = time.perf_counter()
        elapsed = now - self.last_refill
        added = elapsed * self.refill_rate
        if added > 0:
            self.tokens = min(self.capacity, self.tokens + added)
            self.last_refill = now

    def allow_request(self):
        self._refill()
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False

if __name__ == "__main__":
    bucket = TokenBucket(CAPACITY, REFILL_RATE_PER_SEC)
    start = time.perf_counter()

    print("Burst of 8 requests with no delay (capacity 5):")
    for i in range(8):
        allowed = bucket.allow_request()
        elapsed_ms = (time.perf_counter() - start) * 1000
        print(f"  request {i + 1} at {elapsed_ms:.0f} ms: {'allowed' if allowed else 'REJECTED (rate limited)'}")

    print("Waiting 1.5s for tokens to refill...")
    time.sleep(1.5)

    print("3 more requests after waiting:")
    for i in range(3):
        allowed = bucket.allow_request()
        elapsed_ms = (time.perf_counter() - start) * 1000
        print(f"  request {i + 1} at {elapsed_ms:.0f} ms: {'allowed' if allowed else 'REJECTED (rate limited)'}")
