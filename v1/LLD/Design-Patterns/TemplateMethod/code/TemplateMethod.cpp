// Template Method — CaffeineBeverage fixes the recipe sequence; Tea and Coffee fill in the varying steps.
// Compile: g++ -std=c++14 TemplateMethod.cpp -o template_method
// Run:     ./template_method

#include <iostream>

class CaffeineBeverage {
public:
    // The template method — not virtual, so subclasses can't change the sequence.
    void prepareRecipe() {
        boilWater();
        brew();
        pourInCup();
        if (wantsCondiments()) {
            addCondiments();
        }
    }

    virtual ~CaffeineBeverage() = default;

protected:
    void boilWater() {
        std::cout << "Boiling water" << std::endl;
    }

    void pourInCup() {
        std::cout << "Pouring into cup" << std::endl;
    }

    virtual void brew() = 0;
    virtual void addCondiments() = 0;

    // Hook — subclasses may override; default is true.
    virtual bool wantsCondiments() {
        return true;
    }
};

class Tea : public CaffeineBeverage {
protected:
    void brew() override {
        std::cout << "Steeping the tea" << std::endl;
    }

    void addCondiments() override {
        std::cout << "Adding lemon" << std::endl;
    }
};

class Coffee : public CaffeineBeverage {
protected:
    void brew() override {
        std::cout << "Dripping coffee through filter" << std::endl;
    }

    void addCondiments() override {
        std::cout << "Adding sugar and milk" << std::endl;
    }

    bool wantsCondiments() override {
        return false;
    }
};

int main() {
    std::cout << "Preparing tea:" << std::endl;
    Tea tea;
    tea.prepareRecipe();

    std::cout << "Preparing coffee (no condiments):" << std::endl;
    Coffee coffee;
    coffee.prepareRecipe();

    return 0;
}
