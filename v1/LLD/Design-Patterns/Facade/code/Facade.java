// Facade Pattern — OrderFacade coordinating several subsystems behind one call.
// Compile: javac Facade.java
// Run:     java Facade

class InventoryService {
    boolean reserveItem(String item) {
        System.out.println("Inventory: reserved '" + item + "'");
        return true;
    }
}

class PaymentService {
    boolean charge(double amount) {
        System.out.println("Payment: charged $" + amount);
        return true;
    }
}

class ShippingService {
    void scheduleShipment(String item) {
        System.out.println("Shipping: scheduled shipment for '" + item + "'");
    }
}

class NotificationService {
    void sendConfirmation(String item) {
        System.out.println("Notification: confirmation email sent for '" + item + "'");
    }
}

// The Facade: one simple method hiding the coordination of four subsystems.
class OrderFacade {
    private InventoryService inventory = new InventoryService();
    private PaymentService payment = new PaymentService();
    private ShippingService shipping = new ShippingService();
    private NotificationService notification = new NotificationService();

    void placeOrder(String item, double price) {
        System.out.println("--- Placing order for " + item + " ---");
        if (inventory.reserveItem(item) && payment.charge(price)) {
            shipping.scheduleShipment(item);
            notification.sendConfirmation(item);
            System.out.println("Order complete.");
        }
    }
}

public class Facade {
    public static void main(String[] args) {
        OrderFacade orderFacade = new OrderFacade();
        orderFacade.placeOrder("Wireless Mouse", 24.99);
    }
}
