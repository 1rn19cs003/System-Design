// Mediator Pattern — a ChatRoom routes messages between Users instead of Users talking directly.
// Compile: g++ -std=c++14 Mediator.cpp -o mediator
// Run:     ./mediator

#include <iostream>
#include <string>
#include <vector>

class User;

class ChatMediator {
public:
    virtual void sendMessage(const std::string& message, User* sender) = 0;
    virtual void addUser(User* user) = 0;
    virtual ~ChatMediator() = default;
};

class User {
public:
    User(std::string name, ChatMediator* mediator) : name_(std::move(name)), mediator_(mediator) {}

    const std::string& getName() const { return name_; }

    void send(const std::string& message) {
        std::cout << name_ << " sends: " << message << std::endl;
        mediator_->sendMessage(message, this);
    }

    void receive(const std::string& message, const std::string& fromName) {
        std::cout << name_ << " received from " << fromName << ": " << message << std::endl;
    }

private:
    std::string name_;
    ChatMediator* mediator_;
};

class ChatRoom : public ChatMediator {
public:
    void addUser(User* user) override {
        users_.push_back(user);
    }

    void sendMessage(const std::string& message, User* sender) override {
        for (auto* user : users_) {
            if (user != sender) {
                user->receive(message, sender->getName());
            }
        }
    }

private:
    std::vector<User*> users_;
};

int main() {
    ChatRoom chatRoom;

    User alice("Alice", &chatRoom);
    User bob("Bob", &chatRoom);
    User carol("Carol", &chatRoom);

    chatRoom.addUser(&alice);
    chatRoom.addUser(&bob);
    chatRoom.addUser(&carol);

    alice.send("Hey everyone!");
    bob.send("Hi Alice!");

    return 0;
}
