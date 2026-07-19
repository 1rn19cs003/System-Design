#include <iostream>
#include <thread>
#include <chrono>
#include <list>
#include <unordered_map>
#include <vector>
#include <string>

const int SOURCE_LATENCY_MS = 10;
const int CAPACITY = 3;
const std::vector<int> KEY_SEQUENCE = {1, 2, 3, 1, 2, 4, 1, 5, 1, 2};

class LRUCache {
public:
    LRUCache(int capacity) : capacity(capacity) {}

    bool get(int key, std::string& value) {
        auto it = index.find(key);
        if (it == index.end()) return false;
        order.splice(order.begin(), order, it->second);
        value = it->second->second;
        return true;
    }

    void put(int key, const std::string& value) {
        auto it = index.find(key);
        if (it != index.end()) {
            order.erase(it->second);
        }
        order.push_front({key, value});
        index[key] = order.begin();
        if ((int)order.size() > capacity) {
            auto last = order.back();
            std::cout << "  evicted key " << last.first << " (least recently used)" << std::endl;
            index.erase(last.first);
            order.pop_back();
        }
    }

private:
    int capacity;
    std::list<std::pair<int, std::string>> order;
    std::unordered_map<int, std::list<std::pair<int, std::string>>::iterator> index;
};

std::string slowFetch(int key) {
    std::this_thread::sleep_for(std::chrono::milliseconds(SOURCE_LATENCY_MS));
    return "value-" + std::to_string(key);
}

double runWithCache(int& hits, int& misses) {
    LRUCache cache(CAPACITY);
    hits = 0;
    misses = 0;
    auto start = std::chrono::steady_clock::now();
    for (int key : KEY_SEQUENCE) {
        std::string value;
        if (cache.get(key, value)) {
            hits++;
        } else {
            misses++;
            value = slowFetch(key);
            cache.put(key, value);
        }
    }
    return std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();
}

double runWithoutCache() {
    auto start = std::chrono::steady_clock::now();
    for (int key : KEY_SEQUENCE) {
        slowFetch(key);
    }
    return std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();
}

int main() {
    std::cout << "With LRU cache:" << std::endl;
    int hits, misses;
    double withCacheMs = runWithCache(hits, misses);
    std::cout << "  hits=" << hits << " misses=" << misses << " total_time=" << withCacheMs << " ms" << std::endl;

    double withoutCacheMs = runWithoutCache();
    std::cout << "Without cache: total_time=" << withoutCacheMs << " ms" << std::endl;

    std::cout << "Speedup from caching: " << (withoutCacheMs / withCacheMs) << "x" << std::endl;
    return 0;
}
