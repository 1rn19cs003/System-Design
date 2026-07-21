/**
 * Facade Pattern — OrderFacade coordinating several subsystems behind one call.
 * Run: node facade.js
 */

class InventoryService {
  reserveItem(item) {
    console.log(`Inventory: reserved '${item}'`);
    return true;
  }
}

class PaymentService {
  charge(amount) {
    console.log(`Payment: charged $${amount}`);
    return true;
  }
}

class ShippingService {
  scheduleShipment(item) {
    console.log(`Shipping: scheduled shipment for '${item}'`);
  }
}

class NotificationService {
  sendConfirmation(item) {
    console.log(`Notification: confirmation email sent for '${item}'`);
  }
}

class OrderFacade {
  constructor() {
    this.inventory = new InventoryService();
    this.payment = new PaymentService();
    this.shipping = new ShippingService();
    this.notification = new NotificationService();
  }

  placeOrder(item, price) {
    console.log(`--- Placing order for ${item} ---`);
    if (this.inventory.reserveItem(item) && this.payment.charge(price)) {
      this.shipping.scheduleShipment(item);
      this.notification.sendConfirmation(item);
      console.log("Order complete.");
    }
  }
}

const orderFacade = new OrderFacade();
orderFacade.placeOrder("Wireless Mouse", 24.99);

module.exports = { OrderFacade };
