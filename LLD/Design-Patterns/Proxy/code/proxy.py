"""
Proxy Pattern — virtual proxy that lazily loads an expensive Image.
Run: python proxy.py
"""

from abc import ABC, abstractmethod


class Image(ABC):
    @abstractmethod
    def display(self):
        ...


class RealImage(Image):
    """The RealSubject — expensive to construct."""

    def __init__(self, filename):
        self.filename = filename
        self._load_from_disk()

    def _load_from_disk(self):
        print(f"Loading '{self.filename}' from disk (expensive)...")

    def display(self):
        print(f"Displaying '{self.filename}'")


class ProxyImage(Image):
    """Same interface, defers creating the RealImage until display() is first called."""

    def __init__(self, filename):
        self.filename = filename
        self._real_image = None

    def display(self):
        if self._real_image is None:
            self._real_image = RealImage(self.filename)
        self._real_image.display()


if __name__ == "__main__":
    image = ProxyImage("vacation.jpg")
    print("Proxy created, no loading yet.")

    print("First display() call:")
    image.display()

    print("Second display() call:")
    image.display()
