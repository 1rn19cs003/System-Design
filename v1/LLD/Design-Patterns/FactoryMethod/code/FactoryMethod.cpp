// Factory Method Pattern — notification system example.
// Compile: g++ -std=c++14 FactoryMethod.cpp -o factory_method
// Run:     ./factory_method

#include <iostream>
#include <memory>

class Notification {
public:
    virtual void notifyUser() = 0;
    virtual ~Notification() = default;
};

class EmailNotification : public Notification {
public:
    void notifyUser() override {
        std::cout << "Sending an EMAIL notification." << std::endl;
    }
};

class SMSNotification : public Notification {
public:
    void notifyUser() override {
        std::cout << "Sending an SMS notification." << std::endl;
    }
};

class NotificationFactory {
public:
    virtual std::unique_ptr<Notification> createNotification() = 0;
    virtual ~NotificationFactory() = default;

    void send() {
        auto notification = createNotification();
        notification->notifyUser();
    }
};

class EmailNotificationFactory : public NotificationFactory {
public:
    std::unique_ptr<Notification> createNotification() override {
        return std::make_unique<EmailNotification>();
    }
};

class SMSNotificationFactory : public NotificationFactory {
public:
    std::unique_ptr<Notification> createNotification() override {
        return std::make_unique<SMSNotification>();
    }
};

int main() {
    EmailNotificationFactory emailFactory;
    SMSNotificationFactory smsFactory;

    emailFactory.send();
    smsFactory.send();

    return 0;
}
