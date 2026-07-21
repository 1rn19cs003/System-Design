"""
Strategy Pattern — a ShoppingCart (Context) delegates payment to a swappable PaymentStrategy.
Run: python strategy.py
"""

from abc import ABC, abstractmethod


class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount):
        ...


class CreditCardPayment(PaymentStrategy):
    def __init__(self, card_number):
        self.card_number = card_number

    def pay(self, amount):
        last4 = self.card_number[-4:]
        print(f"Charged ${amount} to credit card ending in {last4}")


class PayPalPayment(PaymentStrategy):
    def __init__(self, email):
        self.email = email

    def pay(self, amount):
        print(f"Charged ${amount} via PayPal account {self.email}")


class StoreCreditPayment(PaymentStrategy):
    def __init__(self, balance):
        self.balance = balance

    def pay(self, amount):
        if amount > self.balance:
            print(f"Store credit insufficient: have ${self.balance}, need ${amount}")
            return
        self.balance -= amount
        print(f"Charged ${amount} to store credit, remaining balance ${self.balance}")


class ShoppingCart:
    def __init__(self):
        self.payment_strategy = None

    def set_payment_strategy(self, strategy: PaymentStrategy):
        self.payment_strategy = strategy

    def checkout(self, amount):
        self.payment_strategy.pay(amount)


if __name__ == "__main__":
    cart = ShoppingCart()

    cart.set_payment_strategy(CreditCardPayment("4111111111111234"))
    cart.checkout(49.99)

    cart.set_payment_strategy(PayPalPayment("shopper@example.com"))
    cart.checkout(19.50)

    cart.set_payment_strategy(StoreCreditPayment(30.0))
    cart.checkout(45.0)
    cart.checkout(20.0)
