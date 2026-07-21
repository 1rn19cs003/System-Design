"""
Observer Pattern — a StockTicker (Subject) notifies registered Observers on price change.
Run: python observer.py
"""

from abc import ABC, abstractmethod


class StockObserver(ABC):
    @abstractmethod
    def update(self, symbol, price):
        ...


class StockTicker:
    """The Subject — maintains observers and notifies them on state change."""

    def __init__(self, symbol):
        self.symbol = symbol
        self.price = 0.0
        self._observers = []

    def attach(self, observer: StockObserver):
        self._observers.append(observer)

    def detach(self, observer: StockObserver):
        self._observers.remove(observer)

    def set_price(self, new_price):
        self.price = new_price
        self._notify_observers()

    def _notify_observers(self):
        for observer in self._observers:
            observer.update(self.symbol, self.price)


class MobileDisplay(StockObserver):
    def update(self, symbol, price):
        print(f"[MobileDisplay] {symbol} is now ${price}")


class EmailAlert(StockObserver):
    def __init__(self, threshold):
        self.threshold = threshold

    def update(self, symbol, price):
        if price >= self.threshold:
            print(f"[EmailAlert] {symbol} crossed ${self.threshold} — now ${price}")


if __name__ == "__main__":
    ticker = StockTicker("ACME")

    mobile_display = MobileDisplay()
    email_alert = EmailAlert(100.0)

    ticker.attach(mobile_display)
    ticker.attach(email_alert)

    print("Price update 1:")
    ticker.set_price(95.0)

    print("Price update 2:")
    ticker.set_price(102.5)

    print("Detaching EmailAlert.")
    ticker.detach(email_alert)

    print("Price update 3:")
    ticker.set_price(110.0)
