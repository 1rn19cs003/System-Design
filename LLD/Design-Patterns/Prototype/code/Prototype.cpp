// Prototype Pattern — cloning a game Enemy, demonstrating deep copy of a nested field.
// Compile: g++ -std=c++14 Prototype.cpp -o prototype
// Run:     ./prototype

#include <iostream>
#include <string>
#include <memory>

class Stats {
public:
    int health;
    int damage;

    Stats(int health, int damage) : health(health), damage(damage) {}

    std::unique_ptr<Stats> deepCopy() const {
        return std::make_unique<Stats>(health, damage);
    }
};

class Enemy {
public:
    std::string type;
    std::unique_ptr<Stats> stats;

    Enemy(std::string type, std::unique_ptr<Stats> stats)
        : type(std::move(type)), stats(std::move(stats)) {}

    // Deep copy: stats gets its own independent copy, not a shared pointer.
    std::unique_ptr<Enemy> clone() const {
        return std::make_unique<Enemy>(type, stats->deepCopy());
    }

    void print() const {
        std::cout << type << "{health=" << stats->health
                   << ", damage=" << stats->damage << "}" << std::endl;
    }
};

int main() {
    Enemy orcPrototype("Orc", std::make_unique<Stats>(100, 15));

    auto orc1 = orcPrototype.clone();
    auto orc2 = orcPrototype.clone();

    // Mutate orc1's stats — orc2 and the prototype must stay unaffected.
    orc1->stats->health = 40;

    std::cout << "Prototype: ";
    orcPrototype.print();

    std::cout << "orc1 (damaged): ";
    orc1->print();

    std::cout << "orc2 (untouched): ";
    orc2->print();

    return 0;
}
