// State Pattern — a Document (Context) delegates publish() to whichever DocumentState is active.
// Compile: g++ -std=c++14 State.cpp -o state
// Run:     ./state

#include <iostream>
#include <string>
#include <memory>

class Document;

class DocumentState {
public:
    virtual void publish(Document& document) = 0;
    virtual std::string name() const = 0;
    virtual ~DocumentState() = default;
};

class Document {
public:
    Document();

    void setState(std::unique_ptr<DocumentState> state) {
        state_ = std::move(state);
    }

    void publish() {
        state_->publish(*this);
    }

    std::string currentState() const {
        return state_->name();
    }

private:
    std::unique_ptr<DocumentState> state_;
};

class PublishedState : public DocumentState {
public:
    void publish(Document& document) override {
        std::cout << "Already published — publish() has no further effect." << std::endl;
    }

    std::string name() const override { return "Published"; }
};

class ModerationState : public DocumentState {
public:
    void publish(Document& document) override {
        std::cout << "Moderator approved — publishing document." << std::endl;
        document.setState(std::make_unique<PublishedState>());
    }

    std::string name() const override { return "Moderation"; }
};

class DraftState : public DocumentState {
public:
    void publish(Document& document) override {
        std::cout << "Draft submitted for moderation." << std::endl;
        document.setState(std::make_unique<ModerationState>());
    }

    std::string name() const override { return "Draft"; }
};

Document::Document() {
    state_ = std::make_unique<DraftState>();
}

int main() {
    Document doc;

    std::cout << "Current state: " << doc.currentState() << std::endl;
    doc.publish();

    std::cout << "Current state: " << doc.currentState() << std::endl;
    doc.publish();

    std::cout << "Current state: " << doc.currentState() << std::endl;
    doc.publish();

    std::cout << "Current state: " << doc.currentState() << std::endl;

    return 0;
}
