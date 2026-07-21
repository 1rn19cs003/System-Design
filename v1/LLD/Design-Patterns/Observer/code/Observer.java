// Observer Pattern — a StockTicker (Subject) notifies registered Observers on price change.
// Compile: javac Observer.java
// Run:     java Observer

import java.util.ArrayList;
import java.util.List;

interface StockObserver {
    void update(String symbol, double price);
}

class StockTicker {
    private List<StockObserver> observers = new ArrayList<>();
    private String symbol;
    private double price;

    StockTicker(String symbol) {
        this.symbol = symbol;
    }

    void attach(StockObserver observer) {
        observers.add(observer);
    }

    void detach(StockObserver observer) {
        observers.remove(observer);
    }

    void setPrice(double newPrice) {
        this.price = newPrice;
        notifyObservers();
    }

    private void notifyObservers() {
        for (StockObserver observer : observers) {
            observer.update(symbol, price);
        }
    }
}

class MobileDisplay implements StockObserver {
    public void update(String symbol, double price) {
        System.out.println("[MobileDisplay] " + symbol + " is now $" + price);
    }
}

class EmailAlert implements StockObserver {
    private double threshold;

    EmailAlert(double threshold) {
        this.threshold = threshold;
    }

    public void update(String symbol, double price) {
        if (price >= threshold) {
            System.out.println("[EmailAlert] " + symbol + " crossed $" + threshold + " — now $" + price);
        }
    }
}

public class Observer {
    public static void main(String[] args) {
        StockTicker ticker = new StockTicker("ACME");

        MobileDisplay mobileDisplay = new MobileDisplay();
        EmailAlert emailAlert = new EmailAlert(100.0);

        ticker.attach(mobileDisplay);
        ticker.attach(emailAlert);

        System.out.println("Price update 1:");
        ticker.setPrice(95.0);

        System.out.println("Price update 2:");
        ticker.setPrice(102.5);

        System.out.println("Detaching EmailAlert.");
        ticker.detach(emailAlert);

        System.out.println("Price update 3:");
        ticker.setPrice(110.0);
    }
}
