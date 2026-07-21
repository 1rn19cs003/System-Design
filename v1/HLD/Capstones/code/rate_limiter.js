const CAPACITY = 5;
const REFILL_RATE_PER_SEC = 2;

class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = capacity;
    this.lastRefill = process.hrtime.bigint();
  }

  refill() {
    const now = process.hrtime.bigint();
    const elapsedSeconds = Number(now - this.lastRefill) / 1e9;
    const added = elapsedSeconds * this.refillRate;
    if (added > 0) {
      this.tokens = Math.min(this.capacity, this.tokens + added);
      this.lastRefill = now;
    }
  }

  allowRequest() {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  const bucket = new TokenBucket(CAPACITY, REFILL_RATE_PER_SEC);
  const start = process.hrtime.bigint();

  console.log("Burst of 8 requests with no delay (capacity 5):");
  for (let i = 0; i < 8; i++) {
    const allowed = bucket.allowRequest();
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(`  request ${i + 1} at ${elapsedMs.toFixed(0)} ms: ${allowed ? "allowed" : "REJECTED (rate limited)"}`);
  }

  console.log("Waiting 1.5s for tokens to refill...");
  await sleep(1500);

  console.log("3 more requests after waiting:");
  for (let i = 0; i < 3; i++) {
    const allowed = bucket.allowRequest();
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(`  request ${i + 1} at ${elapsedMs.toFixed(0)} ms: ${allowed ? "allowed" : "REJECTED (rate limited)"}`);
  }
})();
