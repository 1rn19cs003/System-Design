// Proxy Pattern — virtual proxy that lazily loads an expensive Image.
// Compile: g++ -std=c++14 Proxy.cpp -o proxy
// Run:     ./proxy

#include <iostream>
#include <memory>
#include <string>

class Image {
public:
    virtual void display() = 0;
    virtual ~Image() = default;
};

// The RealSubject — expensive to construct.
class RealImage : public Image {
public:
    explicit RealImage(std::string filename) : filename_(std::move(filename)) {
        loadFromDisk();
    }

    void display() override {
        std::cout << "Displaying '" << filename_ << "'" << std::endl;
    }

private:
    std::string filename_;

    void loadFromDisk() {
        std::cout << "Loading '" << filename_ << "' from disk (expensive)..." << std::endl;
    }
};

// The Proxy — same interface, defers creating the RealImage until display() is first called.
class ProxyImage : public Image {
public:
    explicit ProxyImage(std::string filename) : filename_(std::move(filename)) {}

    void display() override {
        if (!realImage_) {
            realImage_ = std::make_unique<RealImage>(filename_);
        }
        realImage_->display();
    }

private:
    std::string filename_;
    std::unique_ptr<RealImage> realImage_;
};

int main() {
    std::unique_ptr<Image> image = std::make_unique<ProxyImage>("vacation.jpg");
    std::cout << "Proxy created, no loading yet." << std::endl;

    std::cout << "First display() call:" << std::endl;
    image->display();

    std::cout << "Second display() call:" << std::endl;
    image->display();

    return 0;
}
