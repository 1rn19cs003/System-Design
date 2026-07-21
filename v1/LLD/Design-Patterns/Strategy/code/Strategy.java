// Strategy Pattern — a ShoppingCart (Context) delegates payment to a swappable PaymentStrategy.
// Compile: javac Strategy.java
// Run:     java Strategy

interface PaymentStrategy {
    void pay(double amount);
}

class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;

    CreditCardPayment(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public void pay(double amount) {
        String last4 = cardNumber.substring(cardNumber.length() - 4);
        System.out.println("Charged $" + amount + " to credit card ending in " + last4);
    }
}

class PayPalPayment implements PaymentStrategy {
    private String email;

    PayPalPayment(String email) {
        this.email = email;
    }

    public void pay(double amount) {
        System.out.println("Charged $" + amount + " via PayPal account " + email);
    }
}

class StoreCreditPayment implements PaymentStrategy {
    private double balance;

    StoreCreditPayment(double balance) {
        this.balance = balance;
    }

    public void pay(double amount) {
        if (amount > balance) {
            System.out.println("Store credit insufficient: have $" + balance + ", need $" + amount);
            return;
        }
        balance -= amount;
        System.out.println("Charged $" + amount + " to store credit, remaining balance $" + balance);
    }
}

class ShoppingCart {
    private PaymentStrategy paymentStrategy;

    void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }

    void checkout(double amount) {
        paymentStrategy.pay(amount);
    }
}

public class Strategy {
    public static void main(String[] args) {
        ShoppingCart cart = new ShoppingCart();

        cart.setPaymentStrategy(new CreditCardPayment("4111111111111234"));
        cart.checkout(49.99);

        cart.setPaymentStrategy(new PayPalPayment("shopper@example.com"));
        cart.checkout(19.50);

        cart.setPaymentStrategy(new StoreCreditPayment(30.0));
        cart.checkout(45.0);
        cart.checkout(20.0);
    }
}
