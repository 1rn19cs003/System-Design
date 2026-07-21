// Chain of Responsibility — an expense request travels through TeamLead -> Manager -> Director.
// Compile: g++ -std=c++14 ChainOfResponsibility.cpp -o chain
// Run:     ./chain

#include <iostream>

class ApprovalHandler {
public:
    virtual void handle(double amount) = 0;
    virtual ~ApprovalHandler() = default;

    ApprovalHandler* setNext(ApprovalHandler* handler) {
        next_ = handler;
        return handler;
    }

protected:
    ApprovalHandler* next_ = nullptr;
};

class TeamLead : public ApprovalHandler {
public:
    void handle(double amount) override {
        if (amount <= 1000) {
            std::cout << "TeamLead approved expense of $" << amount << std::endl;
        } else if (next_) {
            std::cout << "TeamLead cannot approve $" << amount << " — escalating." << std::endl;
            next_->handle(amount);
        } else {
            std::cout << "No handler could approve $" << amount << std::endl;
        }
    }
};

class Manager : public ApprovalHandler {
public:
    void handle(double amount) override {
        if (amount <= 5000) {
            std::cout << "Manager approved expense of $" << amount << std::endl;
        } else if (next_) {
            std::cout << "Manager cannot approve $" << amount << " — escalating." << std::endl;
            next_->handle(amount);
        } else {
            std::cout << "No handler could approve $" << amount << std::endl;
        }
    }
};

class Director : public ApprovalHandler {
public:
    void handle(double amount) override {
        if (amount <= 20000) {
            std::cout << "Director approved expense of $" << amount << std::endl;
        } else if (next_) {
            next_->handle(amount);
        } else {
            std::cout << "No handler could approve $" << amount << " — needs CEO sign-off." << std::endl;
        }
    }
};

int main() {
    TeamLead teamLead;
    Manager manager;
    Director director;

    teamLead.setNext(&manager)->setNext(&director);

    std::cout << "Requesting approval for $500:" << std::endl;
    teamLead.handle(500);

    std::cout << "Requesting approval for $3000:" << std::endl;
    teamLead.handle(3000);

    std::cout << "Requesting approval for $18000:" << std::endl;
    teamLead.handle(18000);

    std::cout << "Requesting approval for $50000:" << std::endl;
    teamLead.handle(50000);

    return 0;
}
