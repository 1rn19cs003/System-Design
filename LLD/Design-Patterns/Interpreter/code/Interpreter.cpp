// Interpreter Pattern — a small tree of Expression objects evaluates "5 + 3 - 2".
// Compile: g++ -std=c++14 Interpreter.cpp -o interpreter
// Run:     ./interpreter

#include <iostream>
#include <memory>

class Expression {
public:
    virtual int interpret() const = 0;
    virtual ~Expression() = default;
};

// Terminal expression — a literal number.
class NumberExpression : public Expression {
public:
    explicit NumberExpression(int number) : number_(number) {}

    int interpret() const override {
        return number_;
    }

private:
    int number_;
};

// Nonterminal expression — addition of two sub-expressions.
class AddExpression : public Expression {
public:
    AddExpression(std::shared_ptr<Expression> left, std::shared_ptr<Expression> right)
        : left_(std::move(left)), right_(std::move(right)) {}

    int interpret() const override {
        return left_->interpret() + right_->interpret();
    }

private:
    std::shared_ptr<Expression> left_;
    std::shared_ptr<Expression> right_;
};

// Nonterminal expression — subtraction of two sub-expressions.
class SubtractExpression : public Expression {
public:
    SubtractExpression(std::shared_ptr<Expression> left, std::shared_ptr<Expression> right)
        : left_(std::move(left)), right_(std::move(right)) {}

    int interpret() const override {
        return left_->interpret() - right_->interpret();
    }

private:
    std::shared_ptr<Expression> left_;
    std::shared_ptr<Expression> right_;
};

int main() {
    // Build the tree for "5 + 3 - 2" as ((5 + 3) - 2).
    auto five = std::make_shared<NumberExpression>(5);
    auto three = std::make_shared<NumberExpression>(3);
    auto two = std::make_shared<NumberExpression>(2);

    auto addition = std::make_shared<AddExpression>(five, three);
    auto expression = std::make_shared<SubtractExpression>(addition, two);

    std::cout << "Evaluating: (5 + 3) - 2" << std::endl;
    std::cout << "Result: " << expression->interpret() << std::endl;

    // A second, differently-shaped expression: 10 - (4 + 1).
    auto tree2 = std::make_shared<SubtractExpression>(
        std::make_shared<NumberExpression>(10),
        std::make_shared<AddExpression>(std::make_shared<NumberExpression>(4), std::make_shared<NumberExpression>(1))
    );

    std::cout << "Evaluating: 10 - (4 + 1)" << std::endl;
    std::cout << "Result: " << tree2->interpret() << std::endl;

    return 0;
}
