// Decorator Pattern — coffee shop add-ons, stacked at runtime.
// Compile: g++ -std=c++14 Decorator.cpp -o decorator
// Run:     ./decorator

#include <iostream>
#include <string>
#include <memory>

class Coffee {
public:
    virtual double getCost() const = 0;
    virtual std::string getDescription() const = 0;
    virtual ~Coffee() = default;
};

class Espresso : public Coffee {
public:
    double getCost() const override { return 2.00; }
    std::string getDescription() const override { return "Espresso"; }
};

class CoffeeDecorator : public Coffee {
public:
    explicit CoffeeDecorator(std::unique_ptr<Coffee> wrapped) : wrapped_(std::move(wrapped)) {}

protected:
    std::unique_ptr<Coffee> wrapped_;
};

class Milk : public CoffeeDecorator {
public:
    explicit Milk(std::unique_ptr<Coffee> wrapped) : CoffeeDecorator(std::move(wrapped)) {}
    double getCost() const override { return wrapped_->getCost() + 0.50; }
    std::string getDescription() const override { return wrapped_->getDescription() + " + Milk"; }
};

class Caramel : public CoffeeDecorator {
public:
    explicit Caramel(std::unique_ptr<Coffee> wrapped) : CoffeeDecorator(std::move(wrapped)) {}
    double getCost() const override { return wrapped_->getCost() + 0.75; }
    std::string getDescription() const override { return wrapped_->getDescription() + " + Caramel"; }
};

int main() {
    std::unique_ptr<Coffee> plain = std::make_unique<Espresso>();
    std::cout << plain->getDescription() << " = $" << plain->getCost() << std::endl;

    std::unique_ptr<Coffee> fancy = std::make_unique<Caramel>(std::make_unique<Milk>(std::make_unique<Espresso>()));
    std::cout << fancy->getDescription() << " = $" << fancy->getCost() << std::endl;

    return 0;
}
