"""
Adapter Pattern — adapting an incompatible third-party payment SDK.
Run: python adapter.py
"""

from abc import ABC, abstractmethod


class PaymentProcessor(ABC):
    @abstractmethod
    def pay(self, amount_dollars):
        ...


class InHousePaymentProcessor(PaymentProcessor):
    def pay(self, amount_dollars):
        print(f"In-house processor charged ${amount_dollars}")


class ThirdPartySDK:
    def make_transaction(self, amount_cents, currency_code):
        print(f"ThirdPartySDK processed {amount_cents} {currency_code} cents")


class ThirdPartyPaymentAdapter(PaymentProcessor):
    def __init__(self, sdk: ThirdPartySDK):
        self._sdk = sdk

    def pay(self, amount_dollars):
        cents = round(amount_dollars * 100)
        self._sdk.make_transaction(cents, "USD")


def checkout(processor: PaymentProcessor, amount):
    processor.pay(amount)


if __name__ == "__main__":
    in_house = InHousePaymentProcessor()
    third_party = ThirdPartyPaymentAdapter(ThirdPartySDK())

    checkout(in_house, 49.99)
    checkout(third_party, 49.99)
