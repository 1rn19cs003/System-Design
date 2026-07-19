/**
 * Visitor Pattern — a PricingVisitor computes price differently for Book and Electronic via double dispatch.
 * Run: node visitor.js
 *
 * JavaScript has no compile-time method overloading, so visit(Book)/visit(Electronic) become
 * separate, distinctly-named methods (visitBook / visitElectronic) — accept() still performs the
 * double dispatch by calling the visitor method matching its own concrete type.
 */

class Book {
  constructor(title, price) {
    this.title = title;
    this.price = price;
  }

  accept(visitor) {
    return visitor.visitBook(this);
  }
}

class Electronic {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  accept(visitor) {
    return visitor.visitElectronic(this);
  }
}

class PricingVisitor {
  visitBook(book) {
    // Books are tax-exempt.
    console.log(`Pricing book '${book.title}': $${book.price} (no tax)`);
    return book.price;
  }

  visitElectronic(electronic) {
    // Electronics carry an 8% tax.
    const taxed = electronic.price * 1.08;
    console.log(`Pricing electronic '${electronic.name}': $${electronic.price} + 8% tax = $${taxed}`);
    return taxed;
  }
}

const cart = [
  new Book("Design Patterns", 45.0),
  new Electronic("Headphones", 100.0),
];

const pricingVisitor = new PricingVisitor();

let total = 0;
cart.forEach(item => {
  total += item.accept(pricingVisitor);
});

console.log(`Total: $${total}`);

module.exports = { Book, Electronic, PricingVisitor };
