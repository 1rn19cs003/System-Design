/**
 * Interpreter Pattern — a small tree of Expression objects evaluates "5 + 3 - 2".
 * Run: node interpreter.js
 */

class NumberExpression {
  constructor(number) {
    this.number = number;
  }

  interpret() {
    return this.number;
  }
}

class AddExpression {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  interpret() {
    return this.left.interpret() + this.right.interpret();
  }
}

class SubtractExpression {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  interpret() {
    return this.left.interpret() - this.right.interpret();
  }
}

// Build the tree for "5 + 3 - 2" as ((5 + 3) - 2).
const five = new NumberExpression(5);
const three = new NumberExpression(3);
const two = new NumberExpression(2);

const addition = new AddExpression(five, three);
const expression = new SubtractExpression(addition, two);

console.log("Evaluating: (5 + 3) - 2");
console.log(`Result: ${expression.interpret()}`);

// A second, differently-shaped expression: 10 - (4 + 1).
const tree2 = new SubtractExpression(
  new NumberExpression(10),
  new AddExpression(new NumberExpression(4), new NumberExpression(1))
);

console.log("Evaluating: 10 - (4 + 1)");
console.log(`Result: ${tree2.interpret()}`);

module.exports = { NumberExpression, AddExpression, SubtractExpression };
