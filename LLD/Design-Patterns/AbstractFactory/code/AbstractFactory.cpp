// Abstract Factory Pattern — cross-platform UI widget families.
// Compile: g++ -std=c++14 AbstractFactory.cpp -o abstract_factory
// Run:     ./abstract_factory

#include <iostream>
#include <memory>

class Button {
public:
    virtual void render() = 0;
    virtual ~Button() = default;
};

class Checkbox {
public:
    virtual void render() = 0;
    virtual ~Checkbox() = default;
};

class WindowsButton : public Button {
public:
    void render() override { std::cout << "Rendering a Windows-style button." << std::endl; }
};
class WindowsCheckbox : public Checkbox {
public:
    void render() override { std::cout << "Rendering a Windows-style checkbox." << std::endl; }
};
class MacButton : public Button {
public:
    void render() override { std::cout << "Rendering a Mac-style button." << std::endl; }
};
class MacCheckbox : public Checkbox {
public:
    void render() override { std::cout << "Rendering a Mac-style checkbox." << std::endl; }
};

class UIFactory {
public:
    virtual std::unique_ptr<Button> createButton() = 0;
    virtual std::unique_ptr<Checkbox> createCheckbox() = 0;
    virtual ~UIFactory() = default;
};

class WindowsFactory : public UIFactory {
public:
    std::unique_ptr<Button> createButton() override { return std::make_unique<WindowsButton>(); }
    std::unique_ptr<Checkbox> createCheckbox() override { return std::make_unique<WindowsCheckbox>(); }
};

class MacFactory : public UIFactory {
public:
    std::unique_ptr<Button> createButton() override { return std::make_unique<MacButton>(); }
    std::unique_ptr<Checkbox> createCheckbox() override { return std::make_unique<MacCheckbox>(); }
};

void renderUI(UIFactory& factory) {
    auto button = factory.createButton();
    auto checkbox = factory.createCheckbox();
    button->render();
    checkbox->render();
}

int main() {
    std::cout << "-- Windows family --" << std::endl;
    WindowsFactory windowsFactory;
    renderUI(windowsFactory);

    std::cout << "-- Mac family --" << std::endl;
    MacFactory macFactory;
    renderUI(macFactory);

    return 0;
}
