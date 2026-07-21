// Observer Pattern — a StockTicker (Subject) notifies registered Observers on price change.
// Compile: g++ -std=c++14 Observer.cpp -o observer
// Run:     ./observer

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

class StockObserver {
public:
    virtual void update(const std::string& symbol, double price) = 0;
    virtual ~StockObserver() = default;
};

class StockTicker {
public:
    explicit StockTicker(std::string symbol) : symbol_(std::move(symbol)), price_(0.0) {}

    void attach(StockObserver* observer) {
        observers_.push_back(observer);
    }

    void detach(StockObserver* observer) {
        observers_.erase(std::remove(observers_.begin(), observers_.end(), observer), observers_.end());
    }

    void setPrice(double newPrice) {
        price_ = newPrice;
        notifyObservers();
    }

private:
    std::string symbol_;
    double price_;
    std::vector<StockObserver*> observers_;

    void notifyObservers() {
        for (auto* observer : observers_) {
            observer->update(symbol_, price_);
        }
    }
};

class MobileDisplay : public StockObserver {
public:
    void update(const std::string& symbol, double price) override {
        std::cout << "[MobileDisplay] " << symbol << " is now $" << price << std::endl;
    }
};

class EmailAlert : public StockObserver {
public:
    explicit EmailAlert(double threshold) : threshold_(threshold) {}

    void update(const std::string& symbol, double price) override {
        if (price >= threshold_) {
            std::cout << "[EmailAlert] " << symbol << " crossed $" << threshold_ << " — now $" << price << std::endl;
        }
    }

private:
    double threshold_;
};

int main() {
    StockTicker ticker("ACME");

    MobileDisplay mobileDisplay;
    EmailAlert emailAlert(100.0);

    ticker.attach(&mobileDisplay);
    ticker.attach(&emailAlert);

    std::cout << "Price update 1:" << std::endl;
    ticker.setPrice(95.0);

    std::cout << "Price update 2:" << std::endl;
    ticker.setPrice(102.5);

    std::cout << "Detaching EmailAlert." << std::endl;
    ticker.detach(&emailAlert);

    std::cout << "Price update 3:" << std::endl;
    ticker.setPrice(110.0);

    return 0;
}
