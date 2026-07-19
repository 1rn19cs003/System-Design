"""
Interpreter Pattern — a small tree of Expression objects evaluates "5 + 3 - 2".
Run: python interpreter.py
"""

from abc import ABC, abstractmethod


class Expression(ABC):
    @abstractmethod
    def interpret(self):
        ...


class NumberExpression(Expression):
    """Terminal expression — a literal number."""

    def __init__(self, number):
        self.number = number

    def interpret(self):
        return self.number


class AddExpression(Expression):
    """Nonterminal expression — addition of two sub-expressions."""

    def __init__(self, left: Expression, right: Expression):
        self.left = left
        self.right = right

    def interpret(self):
        return self.left.interpret() + self.right.interpret()


class SubtractExpression(Expression):
    """Nonterminal expression — subtraction of two sub-expressions."""

    def __init__(self, left: Expression, right: Expression):
        self.left = left
        self.right = right

    def interpret(self):
        return self.left.interpret() - self.right.interpret()


if __name__ == "__main__":
    # Build the tree for "5 + 3 - 2" as ((5 + 3) - 2).
    five = NumberExpression(5)
    three = NumberExpression(3)
    two = NumberExpression(2)

    addition = AddExpression(five, three)
    expression = SubtractExpression(addition, two)

    print("Evaluating: (5 + 3) - 2")
    print(f"Result: {expression.interpret()}")

    # A second, differently-shaped expression: 10 - (4 + 1).
    tree2 = SubtractExpression(
        NumberExpression(10),
        AddExpression(NumberExpression(4), NumberExpression(1)),
    )

    print("Evaluating: 10 - (4 + 1)")
    print(f"Result: {tree2.interpret()}")
