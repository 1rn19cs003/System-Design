// Singleton Pattern — thread-safe lazy initialization (C++11 "magic static").
// Compile: g++ -std=c++11 -pthread Singleton.cpp -o singleton
// Run:     ./singleton

#include <iostream>
#include <mutex>

class Singleton {
public:
    // Deleted copy operations so no one can copy the single instance
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;

    // C++11 guarantees thread-safe initialization of function-local statics
    static Singleton& getInstance() {
        static Singleton instance;
        return instance;
    }

    void logRequest() {
        requestCount++;
        std::cout << "Handled request #" << requestCount << std::endl;
    }

private:
    int requestCount = 0;
    Singleton() {
        std::cout << "Singleton instance created." << std::endl;
    }
};

int main() {
    Singleton& a = Singleton::getInstance();
    Singleton& b = Singleton::getInstance();

    a.logRequest();
    b.logRequest();

    std::cout << "&a == &b: " << (&a == &b ? "true" : "false") << std::endl;
    return 0;
}
