"""
Template Method — CaffeineBeverage fixes the recipe sequence; Tea and Coffee fill in the varying steps.
Run: python template_method.py
"""

from abc import ABC, abstractmethod


class CaffeineBeverage(ABC):
    def prepare_recipe(self):
        """The template method — the fixed sequence of steps."""
        self.boil_water()
        self.brew()
        self.pour_in_cup()
        if self.wants_condiments():
            self.add_condiments()

    def boil_water(self):
        print("Boiling water")

    def pour_in_cup(self):
        print("Pouring into cup")

    @abstractmethod
    def brew(self):
        ...

    @abstractmethod
    def add_condiments(self):
        ...

    def wants_condiments(self):
        """Hook — subclasses may override; default is True."""
        return True


class Tea(CaffeineBeverage):
    def brew(self):
        print("Steeping the tea")

    def add_condiments(self):
        print("Adding lemon")


class Coffee(CaffeineBeverage):
    def brew(self):
        print("Dripping coffee through filter")

    def add_condiments(self):
        print("Adding sugar and milk")

    def wants_condiments(self):
        return False


if __name__ == "__main__":
    print("Preparing tea:")
    tea = Tea()
    tea.prepare_recipe()

    print("Preparing coffee (no condiments):")
    coffee = Coffee()
    coffee.prepare_recipe()
