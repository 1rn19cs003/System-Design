#include <iostream>
#include <thread>
#include <chrono>
#include <queue>
#include <mutex>
#include <vector>
#include <map>
#include <string>

const int NUM_MESSAGES = 20;
const int PROCESSING_MS = 50;

double processWithWorkers(int numWorkers, std::map<std::string, int>& processedBy) {
    std::queue<std::string> q;
    for (int i = 0; i < NUM_MESSAGES; i++) {
        q.push("message-" + std::to_string(i));
    }
    std::mutex queueMutex;
    std::mutex resultMutex;

    auto worker = [&](int workerId) {
        while (true) {
            std::string message;
            {
                std::lock_guard<std::mutex> lock(queueMutex);
                if (q.empty()) return;
                message = q.front();
                q.pop();
            }
            std::this_thread::sleep_for(std::chrono::milliseconds(PROCESSING_MS));
            {
                std::lock_guard<std::mutex> lock(resultMutex);
                processedBy[message] = workerId;
            }
        }
    };

    auto start = std::chrono::steady_clock::now();
    std::vector<std::thread> threads;
    for (int w = 0; w < numWorkers; w++) {
        threads.emplace_back(worker, w);
    }
    for (auto& t : threads) t.join();
    return std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();
}

int main() {
    std::map<std::string, int> processedBy1;
    double elapsed1 = processWithWorkers(1, processedBy1);
    std::cout << "1 consumer:  " << NUM_MESSAGES << " messages in " << elapsed1 << " ms" << std::endl;

    std::map<std::string, int> processedBy3;
    double elapsed3 = processWithWorkers(3, processedBy3);
    std::map<int, int> counts;
    for (auto& kv : processedBy3) counts[kv.second]++;
    std::cout << "3 consumers: " << NUM_MESSAGES << " messages in " << elapsed3 << " ms" << std::endl;
    std::cout << "Messages per worker:";
    for (auto& kv : counts) std::cout << " worker-" << kv.first << "=" << kv.second;
    std::cout << std::endl;
    std::cout << "Speedup from 3 concurrent consumers: " << (elapsed1 / elapsed3) << "x" << std::endl;
    return 0;
}
