// Facade Pattern — OrderFacade coordinating several subsystems behind one call.
// Compile: g++ -std=c++14 Facade.cpp -o facade
// Run:     ./facade

#include <iostream>
#include <string>

class InventoryService {
public:
    bool reserveItem(const std::string& item) {
        std::cout << "Inventory: reserved '" << item << "'" << std::endl;
        return true;
    }
};

class PaymentService {
public:
    bool charge(double amount) {
        std::cout << "Payment: charged $" << amount << std::endl;
        return true;
    }
};

class ShippingService {
public:
    void scheduleShipment(const std::string& item) {
        std::cout << "Shipping: scheduled shipment for '" << item << "'" << std::endl;
    }
};

class NotificationService {
public:
    void sendConfirmation(const std::string& item) {
        std::cout << "Notification: confirmation email sent for '" << item << "'" << std::endl;
    }
};

class OrderFacade {
public:
    void placeOrder(const std::string& item, double price) {
        std::cout << "--- Placing order for " << item << " ---" << std::endl;
        if (inventory_.reserveItem(item) && payment_.charge(price)) {
            shipping_.scheduleShipment(item);
            notification_.sendConfirmation(item);
            std::cout << "Order complete." << std::endl;
        }
    }

private:
    InventoryService inventory_;
    PaymentService payment_;
    ShippingService shipping_;
    NotificationService notification_;
};

int main() {
    OrderFacade orderFacade;
    orderFacade.placeOrder("Wireless Mouse", 24.99);
    return 0;
}
