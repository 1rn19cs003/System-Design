#include <iostream>
#include <thread>
#include <chrono>
#include <vector>
#include <map>
#include <cstring>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>

const char* HOST = "127.0.0.1";
const std::vector<int> BACKEND_PORTS = {9201, 9202, 9203};
const int NUM_REQUESTS = 9;

void runBackend(int port) {
    int serverFd = socket(AF_INET, SOCK_STREAM, 0);
    int opt = 1;
    setsockopt(serverFd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(port);
    bind(serverFd, (sockaddr*)&addr, sizeof(addr));
    listen(serverFd, 5);
    while (true) {
        int clientFd = accept(serverFd, nullptr, nullptr);
        char buffer[1024] = {0};
        read(clientFd, buffer, sizeof(buffer));
        std::string reply = "pong-from-" + std::to_string(port);
        send(clientFd, reply.c_str(), reply.size(), 0);
        close(clientFd);
    }
}

void roundRobin(int requests) {
    std::map<int, int> counts;
    for (int p : BACKEND_PORTS) counts[p] = 0;
    for (int i = 0; i < requests; i++) {
        int port = BACKEND_PORTS[i % BACKEND_PORTS.size()];
        auto start = std::chrono::steady_clock::now();
        int sock = socket(AF_INET, SOCK_STREAM, 0);
        sockaddr_in servAddr{};
        servAddr.sin_family = AF_INET;
        servAddr.sin_port = htons(port);
        inet_pton(AF_INET, HOST, &servAddr.sin_addr);
        connect(sock, (sockaddr*)&servAddr, sizeof(servAddr));
        send(sock, "ping", 4, 0);
        char buffer[1024] = {0};
        read(sock, buffer, sizeof(buffer));
        double latencyMs = std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();
        close(sock);
        counts[port]++;
        std::cout << "Request " << (i + 1) << ": routed to " << port << ", got '" << buffer
                   << "' in " << latencyMs << " ms" << std::endl;
    }
    std::cout << "Distribution:";
    for (auto& kv : counts) {
        std::cout << " backend-" << kv.first << "=" << kv.second;
    }
    std::cout << std::endl;
}

int main() {
    for (int p : BACKEND_PORTS) {
        std::thread(runBackend, p).detach();
    }
    std::this_thread::sleep_for(std::chrono::milliseconds(300));
    roundRobin(NUM_REQUESTS);
    return 0;
}
