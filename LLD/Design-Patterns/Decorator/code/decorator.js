/**
 * Decorator Pattern — coffee shop add-ons, stacked at runtime.
 * Run: node decorator.js
 */

class Espresso {
  getCost() { return 2.00; }
  getDescription() { return "Espresso"; }
}

class CoffeeDecorator {
  constructor(wrapped) {
    this.wrapped = wrapped;
  }
}

class Milk extends CoffeeDecorator {
  getCost() { return this.wrapped.getCost() + 0.50; }
  getDescription() { return this.wrapped.getDescription() + " + Milk"; }
}

class Caramel extends CoffeeDecorator {
  getCost() { return this.wrapped.getCost() + 0.75; }
  getDescription() { return this.wrapped.getDescription() + " + Caramel"; }
}

const plain = new Espresso();
console.log(`${plain.getDescription()} = $${plain.getCost()}`);

const fancy = new Caramel(new Milk(new Espresso()));
console.log(`${fancy.getDescription()} = $${fancy.getCost()}`);

module.exports = { Espresso, Milk, Caramel };
