#include <iostream>
#include <thread>
#include <chrono>
#include <cstring>
#include <sstream>
#include <string>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>

const char* HOST = "127.0.0.1";
const int PAYMENT_PORT = 9601;
const int ORDER_PORT = 9602;
const int NUM_REQUESTS = 5;

void runPaymentService() {
    int serverFd = socket(AF_INET, SOCK_STREAM, 0);
    int opt = 1;
    setsockopt(serverFd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(PAYMENT_PORT);
    bind(serverFd, (sockaddr*)&addr, sizeof(addr));
    listen(serverFd, 5);
    while (true) {
        int clientFd = accept(serverFd, nullptr, nullptr);
        char buffer[1024] = {0};
        read(clientFd, buffer, sizeof(buffer));
        send(clientFd, "payment-approved", 17, 0);
        close(clientFd);
    }
}

void runOrderService() {
    int serverFd = socket(AF_INET, SOCK_STREAM, 0);
    int opt = 1;
    setsockopt(serverFd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(ORDER_PORT);
    bind(serverFd, (sockaddr*)&addr, sizeof(addr));
    listen(serverFd, 5);
    while (true) {
        int clientFd = accept(serverFd, nullptr, nullptr);
        char buffer[1024] = {0};
        read(clientFd, buffer, sizeof(buffer));

        auto paymentStart = std::chrono::steady_clock::now();
        int paymentSock = socket(AF_INET, SOCK_STREAM, 0);
        sockaddr_in paymentAddr{};
        paymentAddr.sin_family = AF_INET;
        paymentAddr.sin_port = htons(PAYMENT_PORT);
        inet_pton(AF_INET, HOST, &paymentAddr.sin_addr);
        connect(paymentSock, (sockaddr*)&paymentAddr, sizeof(paymentAddr));
        send(paymentSock, "charge-card", 11, 0);
        char paymentBuffer[1024] = {0};
        read(paymentSock, paymentBuffer, sizeof(paymentBuffer));
        close(paymentSock);
        double paymentMs = std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - paymentStart).count();

        std::ostringstream reply;
        reply << "order-confirmed(" << paymentBuffer << ")|" << paymentMs;
        std::string replyStr = reply.str();
        send(clientFd, replyStr.c_str(), replyStr.size(), 0);
        close(clientFd);
    }
}

void runClient(int requests) {
    for (int i = 0; i < requests; i++) {
        auto start = std::chrono::steady_clock::now();
        int sock = socket(AF_INET, SOCK_STREAM, 0);
        sockaddr_in servAddr{};
        servAddr.sin_family = AF_INET;
        servAddr.sin_port = htons(ORDER_PORT);
        inet_pton(AF_INET, HOST, &servAddr.sin_addr);
        connect(sock, (sockaddr*)&servAddr, sizeof(servAddr));
        send(sock, "place-order", 11, 0);
        char buffer[1024] = {0};
        read(sock, buffer, sizeof(buffer));
        close(sock);
        double totalMs = std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start).count();
        std::string response(buffer);
        size_t sep = response.find('|');
        std::string reply = response.substr(0, sep);
        std::string paymentMs = sep == std::string::npos ? "?" : response.substr(sep + 1);
        std::cout << "Request " << (i + 1) << ": " << reply << ", total=" << totalMs
                   << " ms (payment hop=" << paymentMs << " ms)" << std::endl;
    }
}

int main() {
    std::thread(runPaymentService).detach();
    std::thread(runOrderService).detach();
    std::this_thread::sleep_for(std::chrono::milliseconds(300));
    runClient(NUM_REQUESTS);
    return 0;
}
