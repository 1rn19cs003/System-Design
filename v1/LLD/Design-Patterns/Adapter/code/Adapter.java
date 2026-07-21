// Adapter Pattern — adapting an incompatible third-party payment SDK.
// Compile: javac Adapter.java
// Run:     java Adapter

// The interface our application code expects everywhere.
interface PaymentProcessor {
    void pay(double amountDollars);
}

// A "native" implementation that already matches our interface.
class InHousePaymentProcessor implements PaymentProcessor {
    public void pay(double amountDollars) {
        System.out.println("In-house processor charged $" + amountDollars);
    }
}

// The third-party SDK we don't control — incompatible method name and units.
class ThirdPartySDK {
    void makeTransaction(int amountCents, String currencyCode) {
        System.out.println("ThirdPartySDK processed " + amountCents + " " + currencyCode + " cents");
    }
}

// The Adapter: implements OUR interface, translates to the SDK's shape internally.
class ThirdPartyPaymentAdapter implements PaymentProcessor {
    private final ThirdPartySDK sdk;

    ThirdPartyPaymentAdapter(ThirdPartySDK sdk) {
        this.sdk = sdk;
    }

    public void pay(double amountDollars) {
        int cents = (int) Math.round(amountDollars * 100);
        sdk.makeTransaction(cents, "USD");
    }
}

public class Adapter {
    static void checkout(PaymentProcessor processor, double amount) {
        processor.pay(amount);
    }

    public static void main(String[] args) {
        PaymentProcessor inHouse = new InHousePaymentProcessor();
        PaymentProcessor thirdParty = new ThirdPartyPaymentAdapter(new ThirdPartySDK());

        checkout(inHouse, 49.99);
        checkout(thirdParty, 49.99);
    }
}
