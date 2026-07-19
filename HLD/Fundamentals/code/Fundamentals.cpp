// HLD Fundamentals — a real TCP client-server pair measuring latency and throughput.
// Compile: g++ -std=c++14 -pthread Fundamentals.cpp -o fundamentals
// Run:     ./fundamentals
//
// This is not a simulation: an actual socket server and client talk over 127.0.0.1,
// and every latency number printed is a real measured round-trip time.

#include <iostream>
#include <thread>
#include <chrono>
#include <vector>
#include <numeric>
#include <cstring>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>

const char* HOST = "127.0.0.1";
const int PORT = 8903;
const int NUM_REQUESTS = 5;

void runServer() {
    int serverFd = socket(AF_INET, SOCK_STREAM, 0);
    int opt = 1;
    setsockopt(serverFd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(PORT);
    bind(serverFd, (sockaddr*)&addr, sizeof(addr));
    listen(serverFd, 1);

    int clientFd = accept(serverFd, nullptr, nullptr);
    char buffer[1024];
    for (int i = 0; i < NUM_REQUESTS; i++) {
        ssize_t received = read(clientFd, buffer, sizeof(buffer));
        if (received <= 0) break;
        send(clientFd, "pong", 4, 0);
    }
    close(clientFd);
    close(serverFd);
}

void runClient() {
    std::this_thread::sleep_for(std::chrono::milliseconds(300));

    int sock = socket(AF_INET, SOCK_STREAM, 0);
    sockaddr_in servAddr{};
    servAddr.sin_family = AF_INET;
    servAddr.sin_port = htons(PORT);
    inet_pton(AF_INET, HOST, &servAddr.sin_addr);
    connect(sock, (sockaddr*)&servAddr, sizeof(servAddr));

    std::vector<double> latencies;
    auto overallStart = std::chrono::steady_clock::now();

    for (int i = 0; i < NUM_REQUESTS; i++) {
        auto requestStart = std::chrono::steady_clock::now();
        send(sock, "ping", 4, 0);

        char buffer[1024] = {0};
        read(sock, buffer, sizeof(buffer));
        auto requestEnd = std::chrono::steady_clock::now();

        double latencyMs = std::chrono::duration<double, std::milli>(requestEnd - requestStart).count();
        latencies.push_back(latencyMs);
        std::cout << "Request " << (i + 1) << ": received '" << buffer << "' in "
                   << latencyMs << " ms" << std::endl;
    }

    auto overallEnd = std::chrono::steady_clock::now();
    close(sock);

    double totalSeconds = std::chrono::duration<double>(overallEnd - overallStart).count();
    double avgLatency = std::accumulate(latencies.begin(), latencies.end(), 0.0) / latencies.size();
    double throughput = NUM_REQUESTS / totalSeconds;

    std::cout << "Average latency: " << avgLatency << " ms" << std::endl;
    std::cout << "Throughput: " << throughput << " requests/sec" << std::endl;
}

int main() {
    std::thread serverThread(runServer);
    runClient();
    serverThread.join();
    return 0;
}
