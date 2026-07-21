"""
Decorator Pattern — coffee shop add-ons, stacked at runtime.
Run: python decorator.py
"""

from abc import ABC, abstractmethod


class Coffee(ABC):
    @abstractmethod
    def get_cost(self):
        ...

    @abstractmethod
    def get_description(self):
        ...


class Espresso(Coffee):
    def get_cost(self):
        return 2.00

    def get_description(self):
        return "Espresso"


class CoffeeDecorator(Coffee):
    def __init__(self, wrapped: Coffee):
        self.wrapped = wrapped


class Milk(CoffeeDecorator):
    def get_cost(self):
        return self.wrapped.get_cost() + 0.50

    def get_description(self):
        return self.wrapped.get_description() + " + Milk"


class Caramel(CoffeeDecorator):
    def get_cost(self):
        return self.wrapped.get_cost() + 0.75

    def get_description(self):
        return self.wrapped.get_description() + " + Caramel"


if __name__ == "__main__":
    plain = Espresso()
    print(f"{plain.get_description()} = ${plain.get_cost()}")

    fancy = Caramel(Milk(Espresso()))
    print(f"{fancy.get_description()} = ${fancy.get_cost()}")
