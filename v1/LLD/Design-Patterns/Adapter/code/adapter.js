/**
 * Adapter Pattern — adapting an incompatible third-party payment SDK.
 * Run: node adapter.js
 */

class InHousePaymentProcessor {
  pay(amountDollars) {
    console.log(`In-house processor charged $${amountDollars}`);
  }
}

// The third-party SDK we don't control — incompatible method name and units.
class ThirdPartySDK {
  makeTransaction(amountCents, currencyCode) {
    console.log(`ThirdPartySDK processed ${amountCents} ${currencyCode} cents`);
  }
}

// The Adapter: exposes the same pay() shape our app expects, translates internally.
class ThirdPartyPaymentAdapter {
  constructor(sdk) {
    this.sdk = sdk;
  }

  pay(amountDollars) {
    const cents = Math.round(amountDollars * 100);
    this.sdk.makeTransaction(cents, "USD");
  }
}

function checkout(processor, amount) {
  processor.pay(amount);
}

const inHouse = new InHousePaymentProcessor();
const thirdParty = new ThirdPartyPaymentAdapter(new ThirdPartySDK());

checkout(inHouse, 49.99);
checkout(thirdParty, 49.99);

module.exports = { InHousePaymentProcessor, ThirdPartyPaymentAdapter };
