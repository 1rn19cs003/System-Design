// Command Pattern — a RemoteControl (Invoker) triggers Commands against a Light (Receiver), with undo support.
// Compile: g++ -std=c++14 Command.cpp -o command
// Run:     ./command

#include <iostream>
#include <vector>
#include <memory>

// Receiver — knows how to actually perform the operations.
class Light {
public:
    void turnOn() {
        on_ = true;
        std::cout << "Light is ON" << std::endl;
    }

    void turnOff() {
        on_ = false;
        std::cout << "Light is OFF" << std::endl;
    }

private:
    bool on_ = false;
};

class RemoteCommand {
public:
    virtual void execute() = 0;
    virtual void undo() = 0;
    virtual ~RemoteCommand() = default;
};

class LightOnCommand : public RemoteCommand {
public:
    explicit LightOnCommand(Light& light) : light_(light) {}

    void execute() override { light_.turnOn(); }
    void undo() override { light_.turnOff(); }

private:
    Light& light_;
};

class LightOffCommand : public RemoteCommand {
public:
    explicit LightOffCommand(Light& light) : light_(light) {}

    void execute() override { light_.turnOff(); }
    void undo() override { light_.turnOn(); }

private:
    Light& light_;
};

// Invoker — triggers commands and keeps a history for undo.
class RemoteControl {
public:
    void pressButton(RemoteCommand* command) {
        command->execute();
        history_.push_back(command);
    }

    void pressUndo() {
        if (history_.empty()) {
            std::cout << "Nothing to undo." << std::endl;
            return;
        }
        RemoteCommand* last = history_.back();
        history_.pop_back();
        last->undo();
    }

private:
    std::vector<RemoteCommand*> history_;
};

int main() {
    Light light;
    RemoteControl remote;

    LightOnCommand onCommand(light);
    LightOffCommand offCommand(light);

    std::cout << "Press ON button:" << std::endl;
    remote.pressButton(&onCommand);

    std::cout << "Press OFF button:" << std::endl;
    remote.pressButton(&offCommand);

    std::cout << "Press UNDO button:" << std::endl;
    remote.pressUndo();

    std::cout << "Press UNDO button again:" << std::endl;
    remote.pressUndo();

    std::cout << "Press UNDO button once more (nothing left):" << std::endl;
    remote.pressUndo();

    return 0;
}
