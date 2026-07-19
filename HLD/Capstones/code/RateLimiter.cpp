#include <iostream>
#include <thread>
#include <chrono>
#include <algorithm>

const double CAPACITY = 5.0;
const double REFILL_RATE_PER_SEC = 2.0;

class TokenBucket {
public:
    TokenBucket(double capacity, double refillRate)
        : capacity(capacity), refillRate(refillRate), tokens(capacity),
          lastRefill(std::chrono::steady_clock::now()) {}

    bool allowRequest() {
        refill();
        if (tokens >= 1.0) {
            tokens -= 1.0;
            return true;
        }
        return false;
    }

private:
    double capacity;
    double refillRate;
    double tokens;
    std::chrono::steady_clock::time_point lastRefill;

    void refill() {
        auto now = std::chrono::steady_clock::now();
        double elapsedSeconds = std::chrono::duration<double>(now - lastRefill).count();
        double added = elapsedSeconds * refillRate;
        if (added > 0) {
            tokens = std::min(capacity, tokens + added);
            lastRefill = now;
        }
    }
};

int main() {
    TokenBucket bucket(CAPACITY, REFILL_RATE_PER_SEC);
    auto start = std::chrono::steady_clock::now();

    std::cout << "Burst of 8 requests with no delay (capacity 5):" << std::endl;
    for (int i = 0; i < 8; i++) {
        bool allowed = bucket.allowRequest();
        double elapsedMs = std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();
        std::cout << "  request " << (i + 1) << " at " << elapsedMs << " ms: "
                   << (allowed ? "allowed" : "REJECTED (rate limited)") << std::endl;
    }

    std::cout << "Waiting 1.5s for tokens to refill..." << std::endl;
    std::this_thread::sleep_for(std::chrono::milliseconds(1500));

    std::cout << "3 more requests after waiting:" << std::endl;
    for (int i = 0; i < 3; i++) {
        bool allowed = bucket.allowRequest();
        double elapsedMs = std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();
        std::cout << "  request " << (i + 1) << " at " << elapsedMs << " ms: "
                   << (allowed ? "allowed" : "REJECTED (rate limited)") << std::endl;
    }
    return 0;
}
