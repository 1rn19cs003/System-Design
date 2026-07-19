"""
Visitor Pattern — a PricingVisitor computes price differently for Book and Electronic via double dispatch.
Run: python visitor.py

Python has no compile-time method overloading, so "visit(Book)" / "visit(Electronic)" become
separate, distinctly-named methods (visit_book / visit_electronic) — accept() still performs the
double dispatch by calling the visitor method matching its own concrete type.
"""

from abc import ABC, abstractmethod


class ItemElement(ABC):
    @abstractmethod
    def accept(self, visitor):
        ...


class Book(ItemElement):
    def __init__(self, title, price):
        self.title = title
        self.price = price

    def accept(self, visitor):
        return visitor.visit_book(self)


class Electronic(ItemElement):
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def accept(self, visitor):
        return visitor.visit_electronic(self)


class PricingVisitor:
    def visit_book(self, book: Book):
        # Books are tax-exempt.
        print(f"Pricing book '{book.title}': ${book.price} (no tax)")
        return book.price

    def visit_electronic(self, electronic: Electronic):
        # Electronics carry an 8% tax.
        taxed = electronic.price * 1.08
        print(f"Pricing electronic '{electronic.name}': ${electronic.price} + 8% tax = ${taxed}")
        return taxed


if __name__ == "__main__":
    cart = [
        Book("Design Patterns", 45.0),
        Electronic("Headphones", 100.0),
    ]

    pricing_visitor = PricingVisitor()

    total = 0
    for item in cart:
        total += item.accept(pricing_visitor)

    print(f"Total: ${total}")
