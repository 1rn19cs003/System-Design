// Adapter Pattern — adapting an incompatible third-party payment SDK.
// Compile: g++ -std=c++14 Adapter.cpp -o adapter
// Run:     ./adapter

#include <iostream>
#include <string>
#include <cmath>

class PaymentProcessor {
public:
    virtual void pay(double amountDollars) = 0;
    virtual ~PaymentProcessor() = default;
};

class InHousePaymentProcessor : public PaymentProcessor {
public:
    void pay(double amountDollars) override {
        std::cout << "In-house processor charged $" << amountDollars << std::endl;
    }
};

// The third-party SDK we don't control — incompatible method name and units.
class ThirdPartySDK {
public:
    void makeTransaction(int amountCents, const std::string& currencyCode) {
        std::cout << "ThirdPartySDK processed " << amountCents << " " << currencyCode << " cents" << std::endl;
    }
};

class ThirdPartyPaymentAdapter : public PaymentProcessor {
public:
    explicit ThirdPartyPaymentAdapter(ThirdPartySDK& sdk) : sdk_(sdk) {}

    void pay(double amountDollars) override {
        int cents = static_cast<int>(std::round(amountDollars * 100));
        sdk_.makeTransaction(cents, "USD");
    }

private:
    ThirdPartySDK& sdk_;
};

void checkout(PaymentProcessor& processor, double amount) {
    processor.pay(amount);
}

int main() {
    InHousePaymentProcessor inHouse;
    ThirdPartySDK sdk;
    ThirdPartyPaymentAdapter thirdParty(sdk);

    checkout(inHouse, 49.99);
    checkout(thirdParty, 49.99);

    return 0;
}
