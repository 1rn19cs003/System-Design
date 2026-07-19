/**
 * Observer Pattern — a StockTicker (Subject) notifies registered Observers on price change.
 * Run: node observer.js
 */

class StockTicker {
  constructor(symbol) {
    this.symbol = symbol;
    this.price = 0;
    this.observers = [];
  }

  attach(observer) {
    this.observers.push(observer);
  }

  detach(observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }

  setPrice(newPrice) {
    this.price = newPrice;
    this.notifyObservers();
  }

  notifyObservers() {
    this.observers.forEach(observer => observer.update(this.symbol, this.price));
  }
}

class MobileDisplay {
  update(symbol, price) {
    console.log(`[MobileDisplay] ${symbol} is now $${price}`);
  }
}

class EmailAlert {
  constructor(threshold) {
    this.threshold = threshold;
  }

  update(symbol, price) {
    if (price >= this.threshold) {
      console.log(`[EmailAlert] ${symbol} crossed $${this.threshold} — now $${price}`);
    }
  }
}

const ticker = new StockTicker("ACME");

const mobileDisplay = new MobileDisplay();
const emailAlert = new EmailAlert(100.0);

ticker.attach(mobileDisplay);
ticker.attach(emailAlert);

console.log("Price update 1:");
ticker.setPrice(95.0);

console.log("Price update 2:");
ticker.setPrice(102.5);

console.log("Detaching EmailAlert.");
ticker.detach(emailAlert);

console.log("Price update 3:");
ticker.setPrice(110.0);

module.exports = { StockTicker, MobileDisplay, EmailAlert };
