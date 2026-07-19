#include <iostream>
#include <vector>
#include <unordered_map>
#include <string>
#include <chrono>
#include <random>

const int NUM_RECORDS = 200000;
const int NUM_LOOKUPS = 500;

struct Row {
    int id;
    std::string name;
};

std::vector<Row> buildTable(int n) {
    std::vector<Row> table;
    table.reserve(n);
    for (int i = 0; i < n; i++) {
        table.push_back({i, "user-" + std::to_string(i)});
    }
    return table;
}

std::unordered_map<int, const Row*> buildIndex(const std::vector<Row>& table) {
    std::unordered_map<int, const Row*> index;
    for (const auto& row : table) {
        index[row.id] = &row;
    }
    return index;
}

const Row* linearScanLookup(const std::vector<Row>& table, int targetId) {
    for (const auto& row : table) {
        if (row.id == targetId) return &row;
    }
    return nullptr;
}

const Row* indexedLookup(const std::unordered_map<int, const Row*>& index, int targetId) {
    auto it = index.find(targetId);
    return it == index.end() ? nullptr : it->second;
}

int main() {
    auto table = buildTable(NUM_RECORDS);
    auto index = buildIndex(table);

    std::mt19937 rng(42);
    std::uniform_int_distribution<int> dist(0, NUM_RECORDS - 1);
    std::vector<int> lookupIds(NUM_LOOKUPS);
    for (int i = 0; i < NUM_LOOKUPS; i++) lookupIds[i] = dist(rng);

    long checksum = 0;
    auto start = std::chrono::steady_clock::now();
    for (int target : lookupIds) {
        const Row* found = linearScanLookup(table, target);
        if (found) checksum += found->id;
    }
    double linearMs = std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();

    start = std::chrono::steady_clock::now();
    for (int target : lookupIds) {
        const Row* found = indexedLookup(index, target);
        if (found) checksum += found->id;
    }
    double indexedMs = std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();

    std::cout << NUM_RECORDS << " records, " << NUM_LOOKUPS << " lookups" << std::endl;
    std::cout << "Linear scan (no index): " << linearMs << " ms" << std::endl;
    std::cout << "Indexed lookup (hash index): " << indexedMs << " ms" << std::endl;
    std::cout << "Speedup from indexing: " << (linearMs / indexedMs) << "x" << std::endl;
    std::cout << "(checksum " << checksum << ")" << std::endl;
    return 0;
}
