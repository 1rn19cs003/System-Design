// Strategy Pattern — a ShoppingCart (Context) delegates payment to a swappable PaymentStrategy.
// Compile: g++ -std=c++14 Strategy.cpp -o strategy
// Run:     ./strategy

#include <iostream>
#include <string>
#include <memory>

class PaymentStrategy {
public:
    virtual void pay(double amount) = 0;
    virtual ~PaymentStrategy() = default;
};

class CreditCardPayment : public PaymentStrategy {
public:
    explicit CreditCardPayment(std::string cardNumber) : cardNumber_(std::move(cardNumber)) {}

    void pay(double amount) override {
        std::string last4 = cardNumber_.substr(cardNumber_.size() - 4);
        std::cout << "Charged $" << amount << " to credit card ending in " << last4 << std::endl;
    }

private:
    std::string cardNumber_;
};

class PayPalPayment : public PaymentStrategy {
public:
    explicit PayPalPayment(std::string email) : email_(std::move(email)) {}

    void pay(double amount) override {
        std::cout << "Charged $" << amount << " via PayPal account " << email_ << std::endl;
    }

private:
    std::string email_;
};

class StoreCreditPayment : public PaymentStrategy {
public:
    explicit StoreCreditPayment(double balance) : balance_(balance) {}

    void pay(double amount) override {
        if (amount > balance_) {
            std::cout << "Store credit insufficient: have $" << balance_ << ", need $" << amount << std::endl;
            return;
        }
        balance_ -= amount;
        std::cout << "Charged $" << amount << " to store credit, remaining balance $" << balance_ << std::endl;
    }

private:
    double balance_;
};

class ShoppingCart {
public:
    void setPaymentStrategy(std::unique_ptr<PaymentStrategy> strategy) {
        paymentStrategy_ = std::move(strategy);
    }

    void checkout(double amount) {
        paymentStrategy_->pay(amount);
    }

private:
    std::unique_ptr<PaymentStrategy> paymentStrategy_;
};

int main() {
    ShoppingCart cart;

    cart.setPaymentStrategy(std::make_unique<CreditCardPayment>("4111111111111234"));
    cart.checkout(49.99);

    cart.setPaymentStrategy(std::make_unique<PayPalPayment>("shopper@example.com"));
    cart.checkout(19.50);

    cart.setPaymentStrategy(std::make_unique<StoreCreditPayment>(30.0));
    cart.checkout(45.0);
    cart.checkout(20.0);

    return 0;
}
