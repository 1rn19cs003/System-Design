// Visitor Pattern — a PricingVisitor computes price differently for Book and Electronic via double dispatch.
// Compile: g++ -std=c++14 Visitor.cpp -o visitor
// Run:     ./visitor

#include <iostream>
#include <string>
#include <vector>
#include <memory>

class Book;
class Electronic;

class ShoppingCartVisitor {
public:
    virtual double visit(Book& book) = 0;
    virtual double visit(Electronic& electronic) = 0;
    virtual ~ShoppingCartVisitor() = default;
};

class ItemElement {
public:
    virtual double accept(ShoppingCartVisitor& visitor) = 0;
    virtual ~ItemElement() = default;
};

class Book : public ItemElement {
public:
    Book(std::string title, double price) : title_(std::move(title)), price_(price) {}

    const std::string& getTitle() const { return title_; }
    double getPrice() const { return price_; }

    double accept(ShoppingCartVisitor& visitor) override {
        return visitor.visit(*this);
    }

private:
    std::string title_;
    double price_;
};

class Electronic : public ItemElement {
public:
    Electronic(std::string name, double price) : name_(std::move(name)), price_(price) {}

    const std::string& getName() const { return name_; }
    double getPrice() const { return price_; }

    double accept(ShoppingCartVisitor& visitor) override {
        return visitor.visit(*this);
    }

private:
    std::string name_;
    double price_;
};

class PricingVisitor : public ShoppingCartVisitor {
public:
    double visit(Book& book) override {
        std::cout << "Pricing book '" << book.getTitle() << "': $" << book.getPrice() << " (no tax)" << std::endl;
        return book.getPrice();
    }

    double visit(Electronic& electronic) override {
        double taxed = electronic.getPrice() * 1.08;
        std::cout << "Pricing electronic '" << electronic.getName() << "': $" << electronic.getPrice()
                   << " + 8% tax = $" << taxed << std::endl;
        return taxed;
    }
};

int main() {
    Book book("Design Patterns", 45.0);
    Electronic electronic("Headphones", 100.0);

    std::vector<ItemElement*> cart = { &book, &electronic };

    PricingVisitor pricingVisitor;

    double total = 0;
    for (auto* item : cart) {
        total += item->accept(pricingVisitor);
    }

    std::cout << "Total: $" << total << std::endl;

    return 0;
}
