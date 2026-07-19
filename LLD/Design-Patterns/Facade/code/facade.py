"""
Facade Pattern — OrderFacade coordinating several subsystems behind one call.
Run: python facade.py
"""


class InventoryService:
    def reserve_item(self, item):
        print(f"Inventory: reserved '{item}'")
        return True


class PaymentService:
    def charge(self, amount):
        print(f"Payment: charged ${amount}")
        return True


class ShippingService:
    def schedule_shipment(self, item):
        print(f"Shipping: scheduled shipment for '{item}'")


class NotificationService:
    def send_confirmation(self, item):
        print(f"Notification: confirmation email sent for '{item}'")


class OrderFacade:
    def __init__(self):
        self.inventory = InventoryService()
        self.payment = PaymentService()
        self.shipping = ShippingService()
        self.notification = NotificationService()

    def place_order(self, item, price):
        print(f"--- Placing order for {item} ---")
        if self.inventory.reserve_item(item) and self.payment.charge(price):
            self.shipping.schedule_shipment(item)
            self.notification.send_confirmation(item)
            print("Order complete.")


if __name__ == "__main__":
    order_facade = OrderFacade()
    order_facade.place_order("Wireless Mouse", 24.99)
