/**
 * Strategy Pattern — a ShoppingCart (Context) delegates payment to a swappable PaymentStrategy.
 * Run: node strategy.js
 */

class CreditCardPayment {
  constructor(cardNumber) {
    this.cardNumber = cardNumber;
  }

  pay(amount) {
    const last4 = this.cardNumber.slice(-4);
    console.log(`Charged $${amount} to credit card ending in ${last4}`);
  }
}

class PayPalPayment {
  constructor(email) {
    this.email = email;
  }

  pay(amount) {
    console.log(`Charged $${amount} via PayPal account ${this.email}`);
  }
}

class StoreCreditPayment {
  constructor(balance) {
    this.balance = balance;
  }

  pay(amount) {
    if (amount > this.balance) {
      console.log(`Store credit insufficient: have $${this.balance}, need $${amount}`);
      return;
    }
    this.balance -= amount;
    console.log(`Charged $${amount} to store credit, remaining balance $${this.balance}`);
  }
}

class ShoppingCart {
  setPaymentStrategy(strategy) {
    this.paymentStrategy = strategy;
  }

  checkout(amount) {
    this.paymentStrategy.pay(amount);
  }
}

const cart = new ShoppingCart();

cart.setPaymentStrategy(new CreditCardPayment("4111111111111234"));
cart.checkout(49.99);

cart.setPaymentStrategy(new PayPalPayment("shopper@example.com"));
cart.checkout(19.50);

cart.setPaymentStrategy(new StoreCreditPayment(30.0));
cart.checkout(45.0);
cart.checkout(20.0);

module.exports = { CreditCardPayment, PayPalPayment, StoreCreditPayment, ShoppingCart };
