// Decorator Pattern — coffee shop add-ons, stacked at runtime.
// Compile: javac Decorator.java
// Run:     java Decorator

interface Coffee {
    double getCost();
    String getDescription();
}

class Espresso implements Coffee {
    public double getCost() { return 2.00; }
    public String getDescription() { return "Espresso"; }
}

abstract class CoffeeDecorator implements Coffee {
    protected Coffee wrapped;

    CoffeeDecorator(Coffee wrapped) {
        this.wrapped = wrapped;
    }
}

class Milk extends CoffeeDecorator {
    Milk(Coffee wrapped) { super(wrapped); }
    public double getCost() { return wrapped.getCost() + 0.50; }
    public String getDescription() { return wrapped.getDescription() + " + Milk"; }
}

class Caramel extends CoffeeDecorator {
    Caramel(Coffee wrapped) { super(wrapped); }
    public double getCost() { return wrapped.getCost() + 0.75; }
    public String getDescription() { return wrapped.getDescription() + " + Caramel"; }
}

public class Decorator {
    public static void main(String[] args) {
        Coffee plain = new Espresso();
        System.out.println(plain.getDescription() + " = $" + plain.getCost());

        Coffee fancy = new Caramel(new Milk(new Espresso()));
        System.out.println(fancy.getDescription() + " = $" + fancy.getCost());
    }
}
